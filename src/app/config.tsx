import BottomNav from "../components/BottomNav";
import PageHeader from "../components/PageHeader";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useBluetoothClassic } from "../context/BluetoothClassicContext";
import { useSwipeNavigation } from "../components/useSwipeNavigation";

export default function Config() {
  const swipe = useSwipeNavigation("/controle", "/perfil");

  const {
    bluetoothAvailable,
    bluetoothEnabled,
    isScanning,
    devices,
    connectedDevice,
    lastMessage,
    requestEnableBluetooth,
    scanDevices,
    connectToDevice,
    disconnectDevice,
  } = useBluetoothClassic();

  const appVersion =
    Constants.expoConfig?.version ??
    Constants.nativeApplicationVersion ??
    "1.0.0";

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
              styles.primaryButton,
              bluetoothEnabled ? styles.buttonSuccess : styles.buttonDanger,
            ]}
            onPress={requestEnableBluetooth}
          >
            <Ionicons name="bluetooth" size={22} color="#FFFFFF" />
            <Text style={styles.buttonText}>
              {bluetoothEnabled ? "Bluetooth ativo" : "Ativar Bluetooth"}
            </Text>
          </Pressable>

          <Text style={styles.infoText}>
            {bluetoothAvailable
              ? "Bluetooth disponível neste aparelho."
              : "Bluetooth não disponível neste aparelho."}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dispositivos ESP</Text>
          <Text style={styles.cardDescription}>
            Busque o ESP32 e toque no dispositivo para conectar.
          </Text>

          <Pressable style={styles.scanButton} onPress={scanDevices}>
            <Ionicons
              name={isScanning ? "sync-outline" : "search-outline"}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.buttonText}>
              {isScanning ? "Buscando..." : "Buscar ESP"}
            </Text>
          </Pressable>

          {devices.length === 0 ? (
            <View style={styles.emptyDeviceBox}>
              <Ionicons name="hardware-chip-outline" size={26} color="#999999" />
              <Text style={styles.emptyDeviceText}>
                Nenhum ESP encontrado. Pareie o ESP no Bluetooth do celular se necessário.
              </Text>
            </View>
          ) : (
            devices.map((device) => (
              <Pressable
                key={device.address ?? device.id}
                style={styles.deviceItem}
                onPress={() => connectToDevice(device)}
              >
                <View style={styles.deviceIcon}>
                  <Ionicons
                    name="hardware-chip-outline"
                    size={20}
                    color="#B30000"
                  />
                </View>

                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>
                    {device.name ?? "Dispositivo sem nome"}
                  </Text>
                  <Text style={styles.deviceId}>
                    {device.address ?? device.id}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#999999" />
              </Pressable>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>ESP conectado</Text>

          {connectedDevice ? (
            <>
              <View style={styles.connectedBox}>
                <Ionicons name="checkmark-circle" size={24} color="#1F8A46" />

                <View style={{ flex: 1 }}>
                  <Text style={styles.connectedName}>
                    {connectedDevice.name ?? "ESP conectado"}
                  </Text>
                  <Text style={styles.connectedId}>
                    {connectedDevice.address ?? connectedDevice.id}
                  </Text>
                </View>
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
});