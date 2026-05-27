import Ionicons from "@expo/vector-icons/Ionicons";
import { usePathname, useRouter, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs: {
    label: string;
    route: Href;
    icon: keyof typeof Ionicons.glyphMap;
    activeIcon: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      label: "Perfil", //perfil
      route: "/perfil",
      icon: "person-outline",
      activeIcon: "person",
    },
    {
      label: "Beer",
      route: "/cerveja",
      icon: "beer-outline",
      activeIcon: "beer",
    },
    {
      label: "Home", //home
      route: "/home",
      icon: "home-outline",
      activeIcon: "home",
   },
    {
      label: "Dash",
      route: "/dash",
      icon: "grid-outline",
      activeIcon: "grid",
   },
    {
      label: "Controle",
     route: "/controle",
      icon: "game-controller-outline",
     activeIcon: "game-controller",
    },
    {
      label: "Config",
      route: "/config",
      icon: "settings-outline",
      activeIcon: "settings",
    },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.route;

        return (
          <Pressable
            key={tab.label}
            style={[styles.navItem, isActive && styles.navItemActive]}
            onPress={() => router.replace(tab.route)}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={isActive ? 28 : 24}
              color={isActive ? "#B30000" : "#444444"}
            />
            <Text style={[styles.navText, isActive && styles.navTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: "88%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 20,
  },
  navItemActive: {
    backgroundColor: "rgba(179,0,0,0.10)",
  },
  navText: {
    marginTop: 4,
    fontSize: 11,
    color: "#444444",
    fontWeight: "600",
  },
  navTextActive: {
    color: "#B30000",
    fontWeight: "700",
  },
});