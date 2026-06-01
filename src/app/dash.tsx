import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import BottomNav from "../components/BottomNav";
import PageHeader from "../components/PageHeader";
import { useSwipeNavigation } from "../components/useSwipeNavigation";
import { useTank } from "../context/TankContext";

export default function Dash() {
  const swipe = useSwipeNavigation("/perfil", "/home");

  const { currentLiters, percentage } = useTank();

  const tanque = {
    nome: "Tanque Total",
    temperatura: "4.8°C",
    volumeAtual: `${currentLiters.toFixed(2)} L`,
    volumeFaltante: `${(20 - currentLiters).toFixed(2)} L`,
    capacidadeTotal: "20 L",
    status: "Estável",
    ultimaAtualizacao: "Agora mesmo",
    percentualAtual: percentage,
  };

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
              <Text style={styles.tankName}>{tanque.nome}</Text>
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{tanque.status}</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <View style={styles.iconWrap}>
                <Ionicons name="thermometer-outline" size={22} color="#B30000" />
              </View>
              <Text style={styles.metricLabel}>Temperatura</Text>
              <Text style={styles.metricValue}>{tanque.temperatura}</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.iconWrap}>
                <Ionicons name="beer-outline" size={22} color="#B30000" />
              </View>
              <Text style={styles.metricLabel}>Volume Consumido</Text>
              <Text style={styles.metricValue}>{tanque.volumeFaltante}</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Nível atual</Text>
              <Text style={styles.progressPercent}>{tanque.percentualAtual.toFixed(2)}%</Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${tanque.percentualAtual.toFixed(2)}%` as `${number}%`}]}
              />
            </View>

            <Text style={styles.progressInfo}>
              Volume atual: {tanque.volumeAtual} de {tanque.capacidadeTotal}
            </Text>
          </View>
        </View>

        <View style={styles.tableCard}>
          <Text style={styles.tableTitle}>Detalhes do tanque</Text>

          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Temperatura atual</Text>
            <Text style={styles.tableValue}>{tanque.temperatura}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Volume atual</Text>
            <Text style={styles.tableValue}>{tanque.volumeAtual}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Volume Consumido</Text>
            <Text style={styles.tableValue}>{tanque.volumeFaltante}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Capacidade total</Text>
            <Text style={styles.tableValue}>{tanque.capacidadeTotal}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Status</Text>
            <Text style={styles.tableValue}>{tanque.status}</Text>
          </View>

          <View style={[styles.tableRow, styles.tableRowLast]}>
            <Text style={styles.tableLabel}>Última atualização</Text>
            <Text style={styles.tableValue}>{tanque.ultimaAtualizacao}</Text>
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