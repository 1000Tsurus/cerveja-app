import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <LinearGradient
      colors={["#B30000", "#FF5E00", "#FFD000"] as const}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Carregando...</Text>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.subtitle}>Preparando sua experiência</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    color: "#FFF5CC",
  },
});