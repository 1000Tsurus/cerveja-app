import { useEffect, useRef } from "react";
import BottomNav from "../components/BottomNav";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSwipeNavigation } from "../components/useSwipeNavigation";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

/*
  EDITE OS TEXTOS AQUI
  Aqui é o local principal para você preencher o conteúdo da Home.
*/

const homeText = {
  projectName: "Schraderbräu",
  label: "Grupo Revelação",
  mainTitle: "Da produção ao copo, uma experiência artesanal mais inteligente.",
  mainDescription:
    "Controle, monitore e aproveite sua cerveja artesanal com mais praticidade, tecnologia e precisão.",

  buttonText: "Encha o copo",

  presentationTitle: "Sobre o projeto",
  presentationText:
    "O projeto Schraderbräu tem como objetivo automatizar e monitorar a produção de cerveja artesanal, utilizando conceitos de IoT, automação e Cervejaria 4.0. O sistema utiliza sensores, ESP32 e controle PID para acompanhar e controlar a temperatura durante a brassagem, garantindo mais precisão, qualidade e eficiência no processo. Além disso, conta com monitoramento por aplicativo e dashboards, permitindo visualizar os dados em tempo real e transformar um processo artesanal em uma solução tecnológica e inteligente.",

  objectiveTitle: "Nosso Objetivo",
  objectiveText:
    "Nosso objetivo é trazer inovação, tecnologia e praticidade na produção de cerveja artesanal, facilitando o controle do processo por meio da Cervejaria 4.0, e oferecendo uma experiência simples, eficiente e acessível ao cliente.",

  conceptTitle: "Experiência",
  conceptText:
    "Com o Schraderbräu, a produção de cerveja artesanal se torna mais simples, prática e inteligente. O usuário pode acompanhar informações importantes do processo em tempo real, ter mais controle sobre a brassagem e aproveitar uma experiência mais moderna, da produção ao momento de servir.",

  finalTitle: "Sejam Bem-Vindos",
  finalText:
    "Esta é a nossa página inicial. Esperamos que gostem do nosso projeto, que teve dedicação, empenho, suor e energia para entregar o máximo das nossas capacidades e apresentar um bom trabalho para nós e para vocês que estão nos conhecendo.",
};

const storyBlocks = [
  {
    id: 1,
    title: "Ideia inicial",
    text: "O Grupo Revelação, detentor da marca Schraderbräu, surgiu com a junção dos integrantes do período diurno com o noturno do curso de Engenharia. Achamos interessante explorar ainda mais o conceito de automação para facilitar a experiência dos nossos clientes.",
    icon: "bulb-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: 2,
    title: "Produção artesanal",
    text: "Nosso conceito inicial foi explorar a tecnologia junto com a cerveja, trabalhando com a Cervejaria 4.0 e utilizando nosso controlador para maximizar a produção com ainda mais qualidade. Graças ao controlador, foi possível registrar temperaturas pelo Dashboard, além de realizar a produção da Witbier.",
    icon: "beer-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: 3,
    title: "Tecnologia Aplicada",
    text: "O controlador conta com ESP32, sensores e Dashboard para registrar precisamente a temperatura da cerveja dentro do sistema. O aplicativo busca conectar ainda mais a clientela e proporcionar uma boa experiência com a Schraderbräu.",
    icon: "hardware-chip-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: 4,
    title: "Apresentação",
    text: "O aplicativo, o site e o caderno tornam a apresentação do projeto mais clara, visual e interativa, reunindo informações importantes sobre o desenvolvimento, funcionamento e resultados do Schraderbräu.",
    icon: "easel-outline" as keyof typeof Ionicons.glyphMap,
  },
];

const bubblePositions = [
  0.1,
  0.18,
  0.27,
  0.35,
  0.44,
  0.52,
  0.61,
  0.7,
  0.8,
  0.88,
  0.14,
  0.32,
  0.49,
  0.67,
  0.76,
  0.22,
];

export default function Home() {
  const swipe = useSwipeNavigation("/dash");

  const fillAnim = useRef(new Animated.Value(0)).current;
  const foamAnim = useRef(new Animated.Value(0)).current;

  const fillAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const isFillingRef = useRef(false);

  const bubbleAnims = useRef(
    Array.from({ length: 16 }, () => new Animated.Value(0))
  ).current;

  const fillHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, screenHeight * 0.62],
  });

  const foamBottom = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, screenHeight * 0.62 - 18],
  });

  const foamScale = foamAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  function fillCup() {
    if (isFillingRef.current) {
      return;
    }

    isFillingRef.current = true;

    fillAnimationRef.current?.stop();
    fillAnim.stopAnimation();

    fillAnim.setValue(0);

    const fillAnimation = Animated.timing(fillAnim, {
      toValue: 1,
      duration: 4300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });

    fillAnimationRef.current = fillAnimation;

    fillAnimation.start(() => {
      isFillingRef.current = false;
    });
  }

  useEffect(() => {
    fillCup();

    const foamLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(foamAnim, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(foamAnim, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    foamLoop.start();

    const bubbleLoops = bubbleAnims.map((bubble, index) => {
      bubble.setValue(0);

      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(index * 190),
          Animated.timing(bubble, {
            toValue: 1,
            duration: 2500 + index * 95,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(bubble, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

      loop.start();
      return loop;
    });

    return () => {
      foamLoop.stop();
      bubbleLoops.forEach((loop) => loop.stop());
      fillAnimationRef.current?.stop();
    };
  }, []);

  return (
    <View style={styles.container} {...swipe.panHandlers}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroGlass}>
          <View style={styles.glassHighlight} />

          <Animated.View style={[styles.beerFill, { height: fillHeight }]} />

          <Animated.View
            style={[
              styles.foam,
              {
                bottom: foamBottom,
                transform: [{ scaleX: foamScale }],
              },
            ]}
          >
            <View style={styles.foamCircleOne} />
            <View style={styles.foamCircleTwo} />
            <View style={styles.foamCircleThree} />
            <View style={styles.foamCircleFour} />
            <View style={styles.foamCircleFive} />
          </Animated.View>

          {bubbleAnims.map((bubble, index) => {
            const translateY = bubble.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -screenHeight * 0.5],
            });

            const opacity = bubble.interpolate({
              inputRange: [0, 0.18, 0.82, 1],
              outputRange: [0, 0.85, 0.85, 0],
            });

            const scale = bubble.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1.25],
            });

            const bubblePosition = bubblePositions[index] ?? 0.5;
            const bubbleLeft = screenWidth * bubblePosition - 18;

            return (
              <Animated.View
                key={index}
                style={[
                  styles.bubble,
                  {
                    left: bubbleLeft,
                    bottom: 36 + (index % 5) * 20,
                    opacity,
                    transform: [{ translateY }, { scale }],
                  },
                ]}
              />
            );
          })}

          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>{homeText.label}</Text>

            <View style={styles.logoCircle}>
              <Ionicons name="beer" size={42} color="#FFD978" />
            </View>

            <Text style={styles.projectName}>{homeText.projectName}</Text>

            <Text style={styles.mainTitle}>{homeText.mainTitle}</Text>

            <Text style={styles.mainDescription}>
              {homeText.mainDescription}
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.restartButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={fillCup}
            >
              <Ionicons name="refresh" size={18} color="#4A120B" />
              <Text style={styles.restartButtonText}>{homeText.buttonText}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.textSection}>
          <Text style={styles.sectionSmallTitle}>Introdução</Text>

          <View style={styles.bigTextCard}>
            <Text style={styles.bigTextTitle}>{homeText.presentationTitle}</Text>
            <Text style={styles.bigText}>{homeText.presentationText}</Text>
          </View>

          <View style={styles.bigTextCard}>
            <Text style={styles.bigTextTitle}>{homeText.objectiveTitle}</Text>
            <Text style={styles.bigText}>{homeText.objectiveText}</Text>
          </View>

          <View style={styles.bigTextCardDark}>
            <Text style={styles.bigTextTitleDark}>{homeText.conceptTitle}</Text>
            <Text style={styles.bigTextDark}>{homeText.conceptText}</Text>
          </View>
        </View>

        <View style={styles.storySection}>
          <Text style={styles.sectionSmallTitle}>Narrativa do trabalho</Text>

          <Text style={styles.storySectionTitle}>
            Linha do tempo Schraderbräu
          </Text>

          {storyBlocks.map((block, index) => (
            <View key={block.id} style={styles.storyRow}>
              <View style={styles.storyNumberArea}>
                <View style={styles.storyNumberCircle}>
                  <Text style={styles.storyNumberText}>
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                </View>

                {index < storyBlocks.length - 1 ? (
                  <View style={styles.storyLine} />
                ) : null}
              </View>

              <View style={styles.storyCard}>
                <View style={styles.storyIcon}>
                  <Ionicons name={block.icon} size={22} color="#B30000" />
                </View>

                <View style={styles.storyTextArea}>
                  <Text style={styles.storyTitle}>{block.title}</Text>
                  <Text style={styles.storyText}>{block.text}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.finalCard}>
          <View style={styles.finalIcon}>
            <Ionicons name="sparkles-outline" size={28} color="#FFD978" />
          </View>

          <Text style={styles.finalTitle}>{homeText.finalTitle}</Text>
          <Text style={styles.finalText}>{homeText.finalText}</Text>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3A0D08",
  },
  scrollContent: {
    paddingTop: 42,
    paddingHorizontal: 18,
    paddingBottom: 150,
  },

  heroGlass: {
    height: screenHeight * 0.82,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.34)",
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    marginBottom: 26,
  },
  glassHighlight: {
    position: "absolute",
    top: 38,
    left: 22,
    width: 13,
    height: "72%",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.22)",
    zIndex: 5,
  },
  beerFill: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#E08A12",
  },
  foam: {
    position: "absolute",
    left: 14,
    right: 14,
    height: 42,
    borderRadius: 999,
    backgroundColor: "#FFF2C6",
    zIndex: 4,
  },
  foamCircleOne: {
    position: "absolute",
    width: 58,
    height: 58,
    borderRadius: 999,
    backgroundColor: "#FFF8DD",
    left: 8,
    top: -18,
  },
  foamCircleTwo: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: "#FFF8DD",
    left: 76,
    top: -11,
  },
  foamCircleThree: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 999,
    backgroundColor: "#FFF8DD",
    left: 138,
    top: -20,
  },
  foamCircleFour: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "#FFF8DD",
    right: 70,
    top: -10,
  },
  foamCircleFive: {
    position: "absolute",
    width: 54,
    height: 54,
    borderRadius: 999,
    backgroundColor: "#FFF8DD",
    right: 10,
    top: -17,
  },
  bubble: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.65)",
    zIndex: 3,
  },

  heroContent: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 44,
    paddingBottom: 34,
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  heroLabel: {
    fontSize: 11,
    color: "#FFD978",
    fontWeight: "900",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    textAlign: "center",
  },
  logoCircle: {
    width: 92,
    height: 92,
    borderRadius: 32,
    backgroundColor: "rgba(74,18,11,0.88)",
    borderWidth: 2,
    borderColor: "rgba(255,217,120,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  projectName: {
    fontSize: 43,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -1,
  },
  mainTitle: {
    fontSize: 27,
    fontWeight: "900",
    color: "#FFF2C6",
    textAlign: "center",
    lineHeight: 33,
  },
  mainDescription: {
    fontSize: 15,
    color: "#FFE8A3",
    textAlign: "center",
    lineHeight: 23,
  },
  restartButton: {
    backgroundColor: "#FFD978",
    borderRadius: 999,
    paddingVertical: 15,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  restartButtonText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#4A120B",
  },

  textSection: {
    marginBottom: 26,
  },
  sectionSmallTitle: {
    fontSize: 12,
    color: "#FFD978",
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  bigTextCard: {
    backgroundColor: "#FFF2C6",
    borderRadius: 28,
    padding: 22,
    marginBottom: 16,
  },
  bigTextTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#4A120B",
    marginBottom: 10,
  },
  bigText: {
    fontSize: 15,
    color: "#6B3A16",
    lineHeight: 24,
    fontWeight: "600",
  },
  bigTextCardDark: {
    backgroundColor: "#5B0D0B",
    borderRadius: 28,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,217,120,0.22)",
  },
  bigTextTitleDark: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFD978",
    marginBottom: 10,
  },
  bigTextDark: {
    fontSize: 15,
    color: "#FFE8A3",
    lineHeight: 24,
    fontWeight: "600",
  },

  storySection: {
    marginBottom: 26,
  },
  storySectionTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 31,
    marginBottom: 18,
  },
  storyRow: {
    flexDirection: "row",
  },
  storyNumberArea: {
    width: 44,
    alignItems: "center",
  },
  storyNumberCircle: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "#FFD978",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  storyNumberText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#4A120B",
  },
  storyLine: {
    flex: 1,
    width: 2,
    backgroundColor: "rgba(255,217,120,0.28)",
  },
  storyCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    flexDirection: "row",
  },
  storyIcon: {
    width: 46,
    height: 46,
    borderRadius: 17,
    backgroundColor: "#FFF2C6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  storyTextArea: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  storyText: {
    fontSize: 13,
    color: "#FFE8A3",
    lineHeight: 20,
    fontWeight: "600",
  },

  finalCard: {
    backgroundColor: "#FFF2C6",
    borderRadius: 30,
    padding: 24,
    alignItems: "center",
  },
  finalIcon: {
    width: 62,
    height: 62,
    borderRadius: 23,
    backgroundColor: "#4A120B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  finalTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#4A120B",
    marginBottom: 10,
    textAlign: "center",
  },
  finalText: {
    fontSize: 15,
    color: "#6B3A16",
    textAlign: "center",
    lineHeight: 23,
    fontWeight: "600",
  },

  buttonPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.98 }],
  },
});