import { StyleSheet, Text, View } from "react-native";
import BottomNav from "../components/BottomNav";

export default function Perfil() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>
          Aqui você pode colocar dados do usuário.
        </Text>
      </View>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 90,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111111",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
});