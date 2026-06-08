import { useEffect, useRef, useState } from "react";
import BottomNav from "../components/BottomNav";
import PageHeader from "../components/PageHeader";
import { useSwipeNavigation } from "../components/useSwipeNavigation";
import { useTank } from "../context/TankContext";
import { useBle } from "../Provider/useBle";

import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Alert,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Controle() {
  const swipe = useSwipeNavigation("/cerveja", "/config");
  const { serveBeer } = useTank();

  // Consome o estado global do Bluetooth
  const { enviarComandoPino, statusConexao } = useBle();

  const progressAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedDose, setSelectedDose] = useState<number | null>(null);

  // Limpeza de segurança (Memory Leak): Mata o cronômetro se a tela for destruída (swipe)
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  async function handlePump(ml: number) {
    if (loading) return;

    // Trava de Segurança
    if (statusConexao !== "Conectado") {
      Alert.alert("Erro de Conexão", "Conecte-se ao ESP32 na aba de Configurações antes de servir.");
      return;
    }

    setSelectedDose(ml);
    setLoading(true);
    setProgress(0);
    progressAnim.setValue(0);

    // 1. Envia a ordem direta para o cérebro do ESP32
    await enviarComandoPino(`DOSE:${ml}`);

    // Os tempos aqui são apenas para a animação visual da UI bater com o hardware
    const duration =
      ml === 50 ? 2500 : ml === 250 ? 5000 : 8000;

    Animated.timing(progressAnim, {
      toValue: 100,
      duration,
      useNativeDriver: false,
    }).start(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setLoading(false);
      serveBeer(ml); // Atualiza o nível do tanque no contexto
    });

    // Cronômetro numérico (0 a 100%)
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 100;
        }
        return next;
      });
    }, duration / 100);
  }

  return (
    <View style={styles.container} {...swipe.panHandlers}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader
          title="Controle"
          subtitle="Controle manual da bomba do tanque."
        />

        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.iconBox}>
              <Ionicons
                name="water-outline"
                size={26}
                color="#B30000"
              />
            </View>

            <View>
              <Text style={styles.cardTitle}>
                Serviço Integrado
              </Text>
              <Text style={styles.cardSubtitle}>
                Escolha a dose desejada.
              </Text>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            {[50, 250, 500].map((dose) => {
              const isActive = selectedDose === dose;

              const animatedWidth = progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              });

              const isCompleted = progress >= 100 && isActive;

              return (
                <Pressable
                  key={dose}
                  style={styles.doseButton}
                  onPress={() => handlePump(dose)}
                >
                  {isActive && (
                    <Animated.View
                      style={[
                        styles.fillBackground,
                        {
                          width: animatedWidth,
                          backgroundColor: isCompleted
                            ? "#1F8A46"
                            : "#B30000",
                        },
                      ]}
                    />
                  )}

                  <View style={styles.buttonContent}>
                    <View style={styles.doseTop}>
                      <Text
                        style={[
                          styles.doseValue,
                          isActive && styles.activeText,
                        ]}
                      >
                        {dose} ml
                      </Text>

                      <Text
                        style={[
                          styles.percentText,
                          isActive && styles.activeText,
                        ]}
                      >
                        {isActive ? `${progress}%` : ""}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.doseDescription,
                        isActive && styles.activeSubText,
                      ]}
                    >
                      {dose === 50
                        ? "Melhor opção para degustação."
                        : dose === 250
                          ? "Quantidade padrão para servir."
                          : "Dose completa com maior tempo de bomba."}
                    </Text>

                    <Text
                      style={[
                        styles.statusText,
                        isActive && styles.activeSubText,
                      ]}
                    >
                      {isActive
                        ? isCompleted
                          ? "Concluído"
                          : "Servindo..."
                        : "Pronto"}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.infoText}>
            Comandos atrelados via BLE ao acionamento inteligente do ESP32 na bomba d'água.
          </Text>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  content: {
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(179,0,0,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#151515",
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },
  buttonsContainer: {
    gap: 14,
  },
  doseButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ECECEC",
    overflow: "hidden",
    position: "relative",
  },
  fillBackground: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
  },
  buttonContent: {
    zIndex: 2,
    padding: 18,
  },
  doseTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  doseValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#151515",
  },
  percentText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#151515",
  },
  doseDescription: {
    marginTop: 12,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  statusText: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },
  activeText: {
    color: "#FFFFFF",
  },
  activeSubText: {
    color: "rgba(255,255,255,0.82)",
  },
  infoText: {
    marginTop: 20,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
  },
});
