import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const loadingOpacity = useRef(new Animated.Value(1)).current;
  const introOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(loadingOpacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(loadingOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    const firstTimer = setTimeout(() => {
      pulseAnimation.stop();

      Animated.parallel([
        Animated.timing(loadingOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(introOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, 4200);

    const secondTimer = setTimeout(() => {
      router.replace("/home");
    }, 8300);

    return () => {
      pulseAnimation.stop();
      clearTimeout(firstTimer);
      clearTimeout(secondTimer);
    };
  }, [introOpacity, loadingOpacity, router]);

  return (
    <LinearGradient
      colors={["#B30000", "#FF5E00", "#FFD000"] as const}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.absoluteCenter, { opacity: loadingOpacity }]}>
          <Animated.Text style={styles.loadingText}>Carregando...</Animated.Text>
        </Animated.View>

        <Animated.View style={[styles.absoluteCenter, { opacity: introOpacity }]}>
          <Animated.Text style={styles.title}>Olá, Vinícius!</Animated.Text>
          <Animated.Text style={styles.subtitle}>
            Bem-vindo ao aplicativo.
          </Animated.Text>
        </Animated.View>
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
  absoluteCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFF5CC",
    textAlign: "center",
  },
});