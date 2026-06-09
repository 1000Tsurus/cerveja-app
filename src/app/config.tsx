import BottomNav from "../components/BottomNav";
import PageHeader from "../components/PageHeader";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useBluetoothClassic } from "../context/BluetoothClassicContext";
import { useSwipeNavigation } from "../components/useSwipeNavigation";
import { useBle } from "../Provider/useBle";

export default function Config() {
  const swipe = useSwipeNavigation("/controle", "/perfil");

  const {
    dispositivoConectado,
    estaEscaneando,
    statusConexao,
    iniciarEscaneamento,
  } = useBle();

  // Tratamento de caixa de string para evitar problemas de case-sensitive ("Conectado")
  const bluetoothEnabled =
    statusConexao === "Conectado" ||
    estaEscaneando ||
    statusConexao === "Descobrindo Dispositivo...";

  const connectedDevice = dispositivoConectado?.name ?? dispositivoConectado?.localName ?? null;

  const appVersion =
    Constants.expoConfig?.version ??
    Constants.nativeApplicationVersion ??
    "1.0.0";

  function handleBluetoothPress() {
    if (statusConexao === "Conectado") {
      Alert.alert(
        "Bluetooth ativo",
        "O aplicativo se conectou com o Dispositivo"
      );
    } else {
      Alert.alert(
        "Bluetooth desativado",
        `Status atual: ${statusConexao}. Use o botão de busca abaixo.`
      );
    }
  }

  function handleSearchEsp() {
    if (statusConexao === "Bluetooth desligado") {
      Alert.alert(
        "Bluetooth Desativado",
        "Por favor, ative o Bluetooth do seu celular nas configurações do sistema antes de buscar o ESP."
      );
      return;
    }

    // Dispara o escaneamento nativo apenas sob ação do clique do usuário
    iniciarEscaneamento();
  }

  return (
    <View style={styles.container} {...swipe.panHandlers}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader
          title="Configurações"
          subtitle="Bluetooth, ESP e informações do app."
        />

        {/* CARD 1: BLUETOOTH STATUS */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Bluetooth clássico</Text>
              <Text style={styles.cardDescription}>
                Status da conexão Bluetooth do celular
              </Text>
            </View>

            <View
              style={[
                styles.statusDot,
                bluetoothEnabled ? styles.statusOn : styles.statusOff,
              ]}
            />
          </View>

          <Pressable
            style={[
              styles.bluetoothButton,
              bluetoothEnabled && { backgroundColor: "#1F8A46" }
            ]}
            onPress={handleBluetoothPress}
          >
            <Ionicons name="bluetooth" size={22} color="#FFFFFF" />
            <Text style={styles.buttonText}>
              {statusConexao === "Conectado" ? "Bluetooth conectado" : `Status: ${statusConexao}`}
            </Text>
          </Pressable>

          <Text style={styles.infoText}>
            Comunicação via canal serial BLE ativo para escuta de dados e processamento no pino lógico.
          </Text>
        </View>

        {/* CARD 2: DISPOSITIVO ESP (TRIGGER BUSCA) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dispositivos ESP</Text>
          <Text style={styles.cardDescription}>
            Busque e conecte o ESP responsible pelo monitoramento.
          </Text>

          <Pressable
            style={[
              styles.disabledButton,
              !estaEscaneando && statusConexao !== "Conectado" && { backgroundColor: "#1565c0" }
            ]}
            onPress={handleSearchEsp}
            disabled={estaEscaneando || statusConexao === "Conectado"}
          >
            <Ionicons name="search-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>
              {estaEscaneando ? "Buscando..." : "Buscar ESP"}
            </Text>
          </Pressable>

          <View style={styles.emptyDeviceBox}>
            <Ionicons name="hardware-chip-outline" size={26} color="#999999" />
            <Text style={styles.emptyDeviceText}>
              {estaEscaneando ? "Escaneando dispositivos próximos..." : "Nenhum ESP pareado nesta sessão"}
            </Text>
          </View>
        </View>

        {/* CARD 3: DISPOSITIVO CONECTADO FEEDBACK */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ESP conectado</Text>

          {dispositivoConectado ? (
            <View style={styles.connectedBox}>
              <Ionicons name="checkmark-circle" size={24} color="#1F8A46" />
              <View>
                <Text style={styles.connectedName}>{connectedDevice || "ESP32-Cerveja"}</Text>
                <Text style={styles.connectedId}>ID: {dispositivoConectado.id}</Text>
              </View>

              {lastMessage ? (
                <Text style={styles.lastMessage}>Última resposta: {lastMessage}</Text>
              ) : null}

              <Pressable style={styles.disconnectButton} onPress={disconnectDevice}>
                <Text style={styles.disconnectText}>Desconectar</Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.notConnectedBox}>
              <Ionicons name="close-circle-outline" size={24} color="#B30000" />
              <Text style={styles.notConnectedText}>Nenhum ESP conectado</Text>
            </View>
          )}
        </View>

        {/* CARD 4: SOBRE */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sobre o aplicativo</Text>

          <View style={styles.versionRow}>
            <View style={styles.versionIcon}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color="#B30000"
              />
            </View>

            <View>
              <Text style={styles.versionLabel}>Versão do app</Text>
              <Text style={styles.versionValue}>v{appVersion}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

// Mantendo exatamente a folha de estilos original do seu arquivo
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
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#151515",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 14,
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
  },
  statusOn: {
    backgroundColor: "#1F8A46",
  },
  statusOff: {
    backgroundColor: "#B30000",
  },
  primaryButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  buttonSuccess: {
    backgroundColor: "#1F8A46",
  },
  buttonDanger: {
    backgroundColor: "#B30000",
  },
  scanButton: {
    marginTop: 4,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#B30000",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  infoText: {
    marginTop: 12,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  emptyDeviceBox: {
    marginTop: 4,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F4F4F5",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyDeviceText: {
    fontSize: 14,
    color: "#777777",
    fontWeight: "600",
    textAlign: "center",
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
  },
  deviceIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(179,0,0,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#151515",
  },
  deviceId: {
    fontSize: 11,
    color: "#8A8A8A",
    marginTop: 2,
  },
  connectedBox: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#EAF8EE",
    padding: 14,
    borderRadius: 16,
  },
  connectedName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F8A46",
  },
  connectedId: {
    fontSize: 11,
    color: "#477A59",
    marginTop: 2,
  },
  lastMessage: {
    marginTop: 10,
    fontSize: 13,
    color: "#6B7280",
  },
  disconnectButton: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#FDE8E8",
    alignItems: "center",
  },
  disconnectText: {
    color: "#B30000",
    fontWeight: "700",
  },
  notConnectedBox: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FDE8E8",
    padding: 14,
    borderRadius: 16,
  },
  notConnectedText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#B30000",
  },
  versionRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F6F7FB",
    padding: 14,
    borderRadius: 16,
  },
  versionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(179,0,0,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  versionLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
  },
  versionValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#151515",
  },
})
