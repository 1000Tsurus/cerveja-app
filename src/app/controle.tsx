import BottomNav from "../components/BottomNav";
import PageHeader from "../components/PageHeader";
import { useSwipeNavigation } from "../components/useSwipeNavigation";

import Ionicons from "@expo/vector-icons/Ionicons";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function Controle() {
  const swipe = useSwipeNavigation("/config", "/dash");

  function handlePump(minutes: number) {
    Alert.alert(
      "Bomba acionada",
      `A bomba ficará ligada por ${minutes} minuto(s).\n\n(Depois vamos conectar isso ao ESP via BLE.)`
    );
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
              <Ionicons name="water-outline" size={26} color="#B30000" />
            </View>

            <View>
              <Text style={styles.cardTitle}>Controle da bomba</Text>
              <Text style={styles.cardSubtitle}>
                Escolha por quanto tempo a bomba ficará ativa.
              </Text>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <Pressable
              style={styles.button}
              onPress={() => handlePump(1)}
            >
              <Text style={styles.buttonTime}>1 min</Text>
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={() => handlePump(3)}
            >
              <Text style={styles.buttonTime}>3 min</Text>
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={() => handlePump(5)}
            >
              <Text style={styles.buttonTime}>5 min</Text>
            </Pressable>
          </View>

          <Text style={styles.infoText}>
            Futuramente estes botões irão enviar comandos diretamente para o ESP via Bluetooth BLE.
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
    shadowOffset: { width: 0, height: 6 },
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
  button: {
    backgroundColor: "#B30000",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTime: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  infoText: {
    marginTop: 20,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
  },
});