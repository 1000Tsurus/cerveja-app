import { useRef, useState } from "react";
import BottomNav from "../components/BottomNav";
import PageHeader from "../components/PageHeader";
import { useSwipeNavigation } from "../components/useSwipeNavigation";
import { useTank } from "../context/TankContext";

import Ionicons from "@expo/vector-icons/Ionicons";
import {
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

  const progressAnim = useRef(new Animated.Value(0)).current;

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedDose, setSelectedDose] = useState<number | null>(null);

  function handlePump(ml: number) {
    if (loading) return;

    setSelectedDose(ml);
    setLoading(true);
    setProgress(0);

    progressAnim.setValue(0);

    const duration =
      ml === 50
        ? 2500
        : ml === 250
        ? 5000
        : 8000;

    Animated.timing(progressAnim, {
      toValue: 100,
      duration,
      useNativeDriver: false,
    }).start(() => {
      setLoading(false);
      serveBeer(ml);
    });

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;

        if (next >= 100) {
          clearInterval(interval);
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

              const isCompleted =
                progress >= 100 && isActive;

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
            Futuramente estes botões irão enviar comandos
            diretamente para o ESP via Bluetooth BLE.
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