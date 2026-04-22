import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Perfil() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>Aqui você pode colocar dados do usuário.</Text>
      </View>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => router.replace("/intro")}>
          <Ionicons name="sparkles-outline" size={26} color="#B30000" />
          <Text style={styles.navText}>Intro</Text>
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => router.replace("/home")}>
          <Ionicons name="home-outline" size={26} color="#B30000" />
          <Text style={styles.navText}>Home</Text>
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => router.replace("/perfil")}>
          <Ionicons name="person" size={30} color="#B30000" />
          <Text style={styles.navText}>Perfil</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
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
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    backgroundColor: "#FFF8F0",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
  },
  navText: {
    marginTop: 4,
    fontSize: 12,
    color: "#B30000",
    fontWeight: "600",
  },
});