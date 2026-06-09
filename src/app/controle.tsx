import BottomNav from "../components/BottomNav";
import PageHeader from "../components/PageHeader";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useBluetoothClassic } from "../context/BluetoothClassicContext";
import { useSwipeNavigation } from "../components/useSwipeNavigation";

export default function Controle() {
  const swipe = useSwipeNavigation("/cerveja", "/dash");

  const { connectedDevice, sendCommand } = useBluetoothClassic();

  const [volumeMl, setVolumeMl] = useState("300");
  const [flowMlPerSecond, setFlowMlPerSecond] = useState("50");

  const doseTimeMs = useMemo(() => {
    const volume = Number(volumeMl.replace(",", "."));
    const flow = Number(flowMlPerSecond.replace(",", "."));

    if (!volume || !flow || flow <= 0) {
      return 0;
    }

    return Math.round((volume / flow) * 1000);
  }, [volumeMl, flowMlPerSecond]);

  const doseTimeSeconds = doseTimeMs / 1000;

  async function handleStartDose() {
    if (doseTimeMs <= 0) {
      Alert.alert(
        "Dados inválidos",
        "Informe um volume e uma vazão válidos."
      );
      return;
    }

    await sendCommand(`DOSE:${doseTimeMs}`);

    Alert.alert(
      "Dosagem enviada",
      `A bomba ficará ligada por ${doseTimeSeconds.toFixed(1)} segundos.`
    );
  }

  async function handlePumpOn() {
    await sendCommand("PUMP:ON");
  }

  async function handlePumpOff() {
    await sendCommand("PUMP:OFF");
  }

  return (
    <View style={styles.container} {...swipe.panHandlers}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader
          title="Controle"
          subtitle="Controle da dosagem e acionamento da bomba."
        />

        <View style={styles.connectionCard}>
          <View style={styles.connectionIcon}>
            <Ionicons
              name={connectedDevice ? "checkmark-circle" : "alert-circle-outline"}
              size={24}
              color={connectedDevice ? "#1F8A46" : "#B30000"}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.connectionLabel}>ESP conectado</Text>
            <Text style={styles.connectionValue}>
              {connectedDevice
                ? connectedDevice.name ?? "ESP conectado"
                : "Nenhum ESP conectado"}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Configuração da dosagem</Text>
          <Text style={styles.cardSubtitle}>
            Defina o volume desejado e a vazão da bomba.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Volume desejado (mL)</Text>
            <TextInput
              value={volumeMl}
              onChangeText={setVolumeMl}
              keyboardType="numeric"
              placeholder="Ex: 300"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Vazão da bomba (mL/s)</Text>
            <TextInput
              value={flowMlPerSecond}
              onChangeText={setFlowMlPerSecond}
              keyboardType="numeric"
              placeholder="Ex: 50"
              style={styles.input}
            />
          </View>

          <View style={styles.resultBox}>
            <Ionicons name="timer-outline" size={26} color="#B30000" />
            <View>
              <Text style={styles.resultLabel}>Tempo calculado</Text>
              <Text style={styles.resultValue}>
                {doseTimeMs > 0 ? `${doseTimeSeconds.toFixed(1)}s` : "--"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ações da bomba</Text>
          <Text style={styles.cardSubtitle}>
            Os comandos serão enviados para o ESP32 via Bluetooth clássico.
          </Text>

          <Pressable
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleStartDose}
          >
            <Ionicons name="beer-outline" size={22} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Iniciar dosagem</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.warningButton]}
            onPress={handlePumpOn}
          >
            <Ionicons name="play" size={22} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Ligar bomba</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handlePumpOff}
          >
            <Ionicons name="stop" size={22} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Desligar bomba</Text>
          </Pressable>
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
  connectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  connectionIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#F6F7FB",
    alignItems: "center",
    justifyContent: "center",
  },
  connectionLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
  },
  connectionValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#151515",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#151515",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#151515",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F6F7FB",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#151515",
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  resultBox: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(179,0,0,0.08)",
    borderRadius: 18,
    padding: 16,
  },
  resultLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  resultValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#151515",
  },
  actionButton: {
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  primaryButton: {
    backgroundColor: "#1F8A46",
  },
  warningButton: {
    backgroundColor: "#D97706",
  },
  dangerButton: {
    backgroundColor: "#B30000",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});