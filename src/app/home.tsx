import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import BottomNav from "../components/BottomNav";
import PageHeader from "../components/PageHeader";
import { useSwipeNavigation } from "../components/useSwipeNavigation";

export default function Home() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const swipe = useSwipeNavigation("/dash", "/config");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <LinearGradient
      {...swipe.panHandlers}
      colors={["#ffffff", "#ffffff", "#ffffff"] as const}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      
      <View style={styles.content} {...swipe.panHandlers}>
        <Animated.View style={[styles.headerWrapper, { opacity: fadeAnim }]}>
          <PageHeader
            title="Home"
            subtitle="Bem-vindo ao aplicativo."
          />
        </Animated.View>
      </View>

      <BottomNav />
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
    paddingBottom: 90,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#000000",
  },
  headerWrapper: {
    width: "100%",
  },
});