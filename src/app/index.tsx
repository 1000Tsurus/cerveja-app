import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, ImageSourcePropType, StyleSheet, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const logoScale = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const introOpacity = useRef(new Animated.Value(0)).current;

  const logoSource: ImageSourcePropType = require("../../assets/images/SchraLOGO.png");
  // Se preferir, troque por:
  // const logoSource: ImageSourcePropType = require("../../assets/images/splash-icon.png");

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.12,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    const firstTimer = setTimeout(() => {
      pulseAnimation.stop();

      Animated.parallel([
        Animated.timing(logoOpacity, {
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
    }, 5200); // tempo do carregamento

    const secondTimer = setTimeout(() => {
      router.replace("/home");
    }, 9300); // loading + intro

    return () => {
      pulseAnimation.stop();
      clearTimeout(firstTimer);
      clearTimeout(secondTimer);
    };
  }, [introOpacity, logoOpacity, logoScale, router]);

  return (
    <LinearGradient
      colors={["#B30000", "#610000", "#000000"] as const}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.absoluteCenter,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Animated.Image source={logoSource} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <Animated.View style={[styles.absoluteCenter, { opacity: introOpacity }]}>
          <Animated.Text style={styles.title}>Seja Bem-Vindo!</Animated.Text>
          <Animated.Text style={styles.subtitle}>
            A melhor cerveja artesanal.
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
  logo: {
    width: 170,
    height: 170,
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