import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import BottomNav from "../components/BottomNav";
import PageHeader from "../components/PageHeader";
import { useSwipeNavigation } from "../components/useSwipeNavigation";
import { useTank } from "../context/TankContext";

export default function Dash() {
  const swipe = useSwipeNavigation("/perfil", "/home");

  // Puxando TODAS as variáveis reais do hardware através do Contexto Global
  const {
    currentLiters,
    maxLiters,
    percentage,
    litersConsumed,
    temperaturaAtual,
    statusTanque,
    ultimaAtualizacao
  } = useTank();

  return (
    <View style={styles.container} {...swipe.panHandlers}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader
          title="Dashboard"
          subtitle="Monitoramento do tanque em tempo real"
        />

        <View style={styles.mainCard}>
          <View style={styles.mainHeader}>
            <View>
              <Text style={styles.tankLabel}>Tanque monitorado</Text>
              <Text style={styles.tankName}>Tanque de Brassagem</Text>
            </View>

            <View style={[
              styles.statusBadge,
              statusTanque === "Aquecendo" ? { backgroundColor: "#FFF4E5" } :
                statusTanque === "Alerta" ? { backgroundColor: "#FDE8E8" } : {}
            ]}>
              <Text style={[
                styles.statusText,
                statusTanque === "Aquecendo" ? { color: "#E65100" } :
                  statusTanque === "Alerta" ? { color: "#B30000" } : {}
              ]}>
                {statusTanque || "Desconectado"}
              </Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <View style={styles.iconWrap}>
                <Ionicons name="thermometer-outline" size={22} color="#B30000" />
              </View>
              <Text style={styles.metricLabel}>Temperatura</Text>
              <Text style={styles.metricValue}>{temperaturaAtual}°C</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.iconWrap}>
                <Ionicons name="beer-outline" size={22} color="#B30000" />
              </View>
              <Text style={styles.metricLabel}>Volume Consumido</Text>
              <Text style={styles.metricValue}>{litersConsumed.toFixed(2)} L</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Nível atual</Text>
              <Text style={styles.progressPercent}>{percentage.toFixed(2)}%</Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${percentage.toFixed(2)}%` as `${number}%` }]}
              />
            </View>

            <Text style={styles.progressInfo}>
              Volume atual: {currentLiters.toFixed(2)} L de {maxLiters} L
            </Text>
          </View>
        </View>

        <View style={styles.tableCard}>
          <Text style={styles.tableTitle}>Detalhes do tanque</Text>

          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Temperatura atual</Text>
            <Text style={styles.tableValue}>{temperaturaAtual}°C</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Volume atual</Text>
            <Text style={styles.tableValue}>{currentLiters.toFixed(2)} L</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Volume Consumido</Text>
            <Text style={styles.tableValue}>{litersConsumed.toFixed(2)} L</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Capacidade total</Text>
            <Text style={styles.tableValue}>{maxLiters} L</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Status da conexão</Text>
            <Text style={styles.tableValue}>{statusTanque || "Aguardando..."}</Text>
          </View>

          <View style={[styles.tableRow, styles.tableRowLast]}>
            <Text style={styles.tableLabel}>Última leitura BLE</Text>
            <Text style={styles.tableValue}>{ultimaAtualizacao}</Text>
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
    flexGrow: 1,
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#151515",
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 22,
  },
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  mainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  tankLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  tankName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111111",
  },
  statusBadge: {
    backgroundColor: "#EAF8EE",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  statusText: {
    color: "#1F8A46",
    fontSize: 12,
    fontWeight: "700",
  },
  metricsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    borderRadius: 18,
    padding: 16,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(179,0,0,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111111",
  },
  progressSection: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222222",
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "700",
    color: "#B30000",
  },
  progressTrack: {
    height: 12,
    backgroundColor: "#E9E9E9",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#B30000",
    borderRadius: 999,
  },
  progressInfo: {
    fontSize: 13,
    color: "#6B7280",
  },
  tableCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#151515",
    marginBottom: 14,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  tableValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#151515",
  },
});
