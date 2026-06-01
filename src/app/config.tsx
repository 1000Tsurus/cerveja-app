import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import BottomNav from "../components/BottomNav";
import PageHeader from "../components/PageHeader";
import { useSwipeNavigation } from "../components/useSwipeNavigation";

export default function Config() {
  const swipe = useSwipeNavigation("/controle", "/perfil");

  const bluetoothEnabled = false;
  const connectedDevice: string | null = null;

  const appVersion =
    Constants.expoConfig?.version ??
    Constants.nativeApplicationVersion ??
    "1.0.0";

  function handleBluetoothPress() {
    Alert.alert(
      "Bluetooth desativado",
      "A conexão Bluetooth real ainda não está ativada neste app. Quando você for usar com o ESP, ativamos a biblioteca BLE."
    );
  }

  function handleSearchEsp() {
    Alert.alert(
      "Busca indisponível",
      "A busca por ESP está desativada por enquanto. Essa função será conectada ao Bluetooth real depois."
    );
  }

  //retornado um view
  return (
    <View style={styles.container} {...swipe.panHandlers}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader
          title="Configurações"
          subtitle="Gerencie a conexão Bluetooth e o ESP do tanque."
        />

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Bluetooth</Text> <Text style={styles.cardDescription}>
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

          <Pressable style={styles.bluetoothButton} onPress={handleBluetoothPress}>
            <Ionicons name="bluetooth" size={22} color="#FFFFFF" />
            <Text style={styles.buttonText}>Bluetooth desligado</Text>
          </Pressable>

          <Text style={styles.infoText}>
            O Bluetooth real será ativado futuramente para conexão com o ESP.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dispositivo ESP</Text>
          <Text style={styles.cardDescription}>
            Busque e conecte o ESP responsável pelo monitoramento.
          </Text>

          <Pressable style={styles.disabledButton} onPress={handleSearchEsp}>
            <Ionicons name="search-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Buscar ESP</Text>
          </Pressable>

          <View style={styles.emptyDeviceBox}>
            <Ionicons name="hardware-chip-outline" size={26} color="#999999" />
            <Text style={styles.emptyDeviceText}>
              Nenhum ESP encontrado no momento
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>ESP conectado</Text>

          {connectedDevice ? (
            <View style={styles.connectedBox}>
              <Ionicons name="checkmark-circle" size={24} color="#1F8A46" />
              <View>
                <Text style={styles.connectedName}>{connectedDevice}</Text>
                <Text style={styles.connectedId}>Dispositivo ativo</Text>
              </View>
            </View>
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

//Criando estilos 
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
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#151515",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 22,
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
  bluetoothButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#B30000",
  },
  disabledButton: {
    marginTop: 4,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#999999",
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
