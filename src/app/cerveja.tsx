import { useState } from "react";
import BottomNav from "../components/BottomNav";
import PageHeader from "../components/PageHeader";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { useSwipeNavigation } from "../components/useSwipeNavigation";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Product = {
  id: number;
  name: string;
  volume: number;
  color: string;
  description: string;
  style: string;
  ingredients: string[];
};

type Company = {
  id: number;
  name: string;
  description: string;
};

type SupplyStep = {
  id: number;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  companies: Company[];
};

type TransportStep = {
  id: number;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Witbier",
    volume: 20,
    color: "#D97706",
    style: "Trigo • Refrescante",
    description: "Cerveja de trigo leve, aromática e com perfil cítrico.",
    ingredients: [
      "Malte",
      "Trigo",
      "Lúpulo",
      "Sementes de Coentro",
      "Raspas de Laranja",
      "Levedura",
      "Água",
    ],
  },
  {
    id: 2,
    name: "Pilsen",
    volume: 5,
    color: "#B30000",
    style: "Clara • Equilibrada",
    description: "Cerveja clara, leve e equilibrada para complementar a produção.",
    ingredients: ["Malte", "Lúpulo", "Levedura", "Água"],
  },
];

const supplyNetwork: SupplyStep[] = [
  {
    id: 1,
    title: "Fornecedores Indiretos",
    subtitle: "Origem agrícola e base dos insumos.",
    icon: "leaf-outline",
    companies: [
      {
        id: 1,
        name: "Agrária",
        description:
          "Responsável por produzir o Malte.",
      },
      {
        id: 2,
        name: "Biotrigo",
        description:
          "Responsável por produzir o trigo que será utilizado na criação do Malte.",
      },
      {
        id: 3,
        name: "Biosab",
        description:
          "Responsável por produzir as leveduras utilizadas na cerveja.",
      },
    ],
  },
  {
    id: 2,
    title: "Fornecedores Diretos",
    subtitle: "Produtores primários responsáveis por fornecer os itens diretamente para nós",
    icon: "cube-outline",
    companies: [
      {
        id: 4,
        name: "Brew Beer",
        description:
          "Loja especializada em itens de cevejaria, contendo desde o Malte, e o Lupúlo.",
      },
      {
        id: 5,
        name: "Minalba",
        description:
          "Fornecedor da água que será utilizada no processo.",
      },
    ],
  },
  {
    id: 3,
    title: "Produção Schraderbrau",
    subtitle: "Brassagem, fermentação e controle do processo.",
    icon: "flask-outline",
    companies: [
      {
        id: 6,
        name: "Schraderbräu",
        description:
          "Centro de produção da cerveja, aqui é onde ocorre toda a confecção da bebida.",
      },
      {
        id: 7,
        name: "Processo da Cerveja",
        description:
          "Processo de pesagem, brassagem e fermentação.",
      },
      {
        id: 8,
        name: "Engarrafamento",
        description:
          "No engarrafamento buscamos o melhor processo para a finalização, e também é aqui que demonstramos a nossa marca.",
      },
    ],
  },
  {
    id: 4,
    title: "Clientes",
    subtitle: "Destino final da cerveja produzida.",
    icon: "people-outline",
    companies: [
      {
        id: 9,
        name: "Clientes Diretos",
        description:
          "Vendas para estabelecimentos com foco em bebida, como a Adega Rota do Samba, e a Samba da Praça da 17 (Camada Direta).",
      },
      {
        id: 10,
        name: "Clientes Indiretos",
        description:
          "Venda para publico com preferência em eventos privados, como Engenharias Senac, e os Professores (Camada Indireta).",
      },
      {
        id: 11,
        name: "Professores",
        description:
          "Parte avaliadora e orientadora do projeto, recebendo a apresentação do produto e da solução desenvolvida, tendo como nossos clientes indiretos.",
      },
    ],
  },
];

const transportSteps: TransportStep[] = [
  {
    id: 1,
    title: "Transportadora Cassemiro",
    subtitle: "Transportadora responsável para Fornecedores Indiretos e Diretos",
    icon: "cube-outline",
    description:
      "Transporta as mercadorias por vias rodoviárias (mantendo lote mínimo de um palete (1,00m x 1,20m)), faz também os transportes até a empresa Schraderbräu.",
  },
  {
    id: 2,
    title: "Faustino Serviços de Entrega",
    subtitle: "Empresa responsável pela distribuição aos estabelecimentos.",
    icon: "swap-horizontal-outline",
    description:
      "Responsável pelo processo de distribuiçao da cerveja da Schraderbräu até os estabelecimentos.",
  },
  {
    id: 3,
    title: "Zé Delivery",
    subtitle: "Distribuidora focada em entregas na porta do cliente",
    icon: "car-outline",
    description:
      "Ela conecta os estabelecimentos até os clientes finais.",
  },
];

export default function Cerveja() {
  const swipe = useSwipeNavigation("/config", "/controle");

  const [activeTab, setActiveTab] = useState<
    "produtos" | "rede" | "transporte"
  >("produtos");

  const [selectedProductId, setSelectedProductId] = useState(1);
  const [openedStep, setOpenedStep] = useState<number | null>(1);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const totalVolume = products.reduce((sum, product) => sum + product.volume, 0);

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? products[0];

  const selectedPercent = Math.round(
    (selectedProduct.volume / totalVolume) * 100
  );

  function animateLayout() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  function changeTab(tab: "produtos" | "rede" | "transporte") {
    animateLayout();
    setActiveTab(tab);
  }

  function selectProduct(id: number) {
    animateLayout();
    setSelectedProductId(id);
  }

  function toggleStep(id: number) {
    animateLayout();
    setOpenedStep((prev) => (prev === id ? null : id));
  }

  function selectCompany(company: Company) {
    animateLayout();

    setSelectedCompany((prev) =>
      prev?.id === company.id ? null : company
    );
  }

  return (
    <View style={styles.container} {...swipe.panHandlers}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader
          title="Cerveja"
          subtitle="Produção, árvore de produtos e rede de suprimentos."
        />

        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Produção total</Text>
              <Text style={styles.heroValue}>{totalVolume} L</Text>
            </View>

            <View style={styles.heroIcon}>
              <Ionicons name="beer-outline" size={34} color="#B30000" />
            </View>
          </View>

          <Text style={styles.heroDescription}>
            Lote composto por 20L de Witbier e 5L de Pilsen, com cadeia de
            suprimentos organizada do fornecedor ao cliente final.
          </Text>

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>2</Text>
              <Text style={styles.heroStatLabel}>Estilos</Text>
            </View>

            <View style={styles.heroStatDivider} />

            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>4</Text>
              <Text style={styles.heroStatLabel}>Etapas</Text>
            </View>

            <View style={styles.heroStatDivider} />

            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>IoT</Text>
              <Text style={styles.heroStatLabel}>Controle</Text>
            </View>
          </View>
        </View>

        <View style={styles.segment}>
          <Pressable
            style={[
              styles.segmentButton,
              activeTab === "produtos" && styles.segmentButtonActive,
            ]}
            onPress={() => changeTab("produtos")}
          >
            <Ionicons
              name="git-branch-outline"
              size={17}
              color={activeTab === "produtos" ? "#FFFFFF" : "#6B7280"}
            />
            <Text
              style={[
                styles.segmentText,
                activeTab === "produtos" && styles.segmentTextActive,
              ]}
            >
              Produtos
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.segmentButton,
              activeTab === "rede" && styles.segmentButtonActive,
            ]}
            onPress={() => changeTab("rede")}
          >
            <Ionicons
              name="share-social-outline"
              size={17}
              color={activeTab === "rede" ? "#FFFFFF" : "#6B7280"}
            />
            <Text
              style={[
                styles.segmentText,
                activeTab === "rede" && styles.segmentTextActive,
              ]}
            >
              Rede
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.segmentButton,
              activeTab === "transporte" && styles.segmentButtonActive,
            ]}
            onPress={() => changeTab("transporte")}
          >
            <Ionicons
              name="car-outline"
              size={17}
              color={activeTab === "transporte" ? "#FFFFFF" : "#6B7280"}
            />
            <Text
              style={[
                styles.segmentText,
                activeTab === "transporte" && styles.segmentTextActive,
              ]}
            >
              Transporte
            </Text>
          </Pressable>
        </View>

        {activeTab === "produtos" ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Árvore de produtos</Text>
              <Text style={styles.sectionSubtitle}>
                Toque em um estilo para analisar composição, volume e insumos.
              </Text>
            </View>

            <View style={styles.productionCard}>
              <View style={styles.productionHeader}>
                <View style={styles.rootIcon}>
                  <Ionicons name="beer" size={24} color="#FFFFFF" />
                </View>

                <View style={styles.rootTextArea}>
                  <Text style={styles.rootTitle}>Cerveja artesanal</Text>
                  <Text style={styles.rootSubtitle}>
                    Produção consolidada do lote
                  </Text>
                </View>

                <View style={styles.rootBadge}>
                  <Text style={styles.rootBadgeText}>{totalVolume}L</Text>
                </View>
              </View>

              <View style={styles.volumeBar}>
                {products.map((product) => (
                  <View
                    key={product.id}
                    style={[
                      styles.volumePart,
                      {
                        flex: product.volume,
                        backgroundColor: product.color,
                      },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.volumeLegend}>
                {products.map((product) => (
                  <View key={product.id} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: product.color },
                      ]}
                    />
                    <Text style={styles.legendText}>
                      {product.name} • {product.volume}L
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.productSelector}>
              {products.map((product) => {
                const isSelected = selectedProductId === product.id;
                const percentage = Math.round(
                  (product.volume / totalVolume) * 100
                );

                return (
                  <Pressable
                    key={product.id}
                    style={({ pressed }) => [
                      styles.productMiniCard,
                      isSelected && styles.productMiniCardActive,
                      isSelected && { borderColor: product.color },
                      pressed && styles.cardPressed,
                    ]}
                    onPress={() => selectProduct(product.id)}
                  >
                    <View style={styles.productMiniTop}>
                      <Text
                        style={[
                          styles.productMiniName,
                          isSelected && { color: product.color },
                        ]}
                      >
                        {product.name}
                      </Text>

                      {isSelected ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={product.color}
                        />
                      ) : null}
                    </View>

                    <Text style={styles.productMiniStyle}>{product.style}</Text>

                    <View style={styles.productMiniBottom}>
                      <Text style={styles.productMiniVolume}>
                        {product.volume}L
                      </Text>
                      <Text style={styles.productMiniPercent}>{percentage}%</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <View>
                  <Text style={styles.detailLabel}>Produto selecionado</Text>
                  <Text style={styles.detailTitle}>{selectedProduct.name}</Text>
                </View>

                <View
                  style={[
                    styles.detailBadge,
                    { backgroundColor: `${selectedProduct.color}18` },
                  ]}
                >
                  <Text
                    style={[
                      styles.detailBadgeText,
                      { color: selectedProduct.color },
                    ]}
                  >
                    {selectedPercent}%
                  </Text>
                </View>
              </View>

              <Text style={styles.detailDescription}>
                {selectedProduct.description}
              </Text>

              <View style={styles.detailMetricRow}>
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Volume</Text>
                  <Text style={styles.metricValue}>{selectedProduct.volume}L</Text>
                </View>

                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Participação</Text>
                  <Text style={styles.metricValue}>{selectedPercent}%</Text>
                </View>
              </View>

              <Text style={styles.ingredientsTitle}>Insumos principais</Text>

              <View style={styles.ingredientsWrap}>
                {selectedProduct.ingredients.map((ingredient) => (
                  <View key={ingredient} style={styles.ingredientChip}>
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color="#B30000"
                    />
                    <Text style={styles.ingredientText}>{ingredient}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : activeTab === "rede" ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Rede de suprimentos</Text>
              <Text style={styles.sectionSubtitle}>
                Expanda cada etapa e toque em uma empresa para ver sua função.
              </Text>
            </View>

            <View style={styles.timeline}>
              {supplyNetwork.map((step, index) => {
                const isOpen = openedStep === step.id;

                const selectedCompanyInStep = step.companies.find(
                  (company) => company.id === selectedCompany?.id
                );

                return (
                  <View key={step.id}>
                    <View
                      style={[
                        styles.supplyCard,
                        isOpen && styles.supplyCardActive,
                      ]}
                    >
                      <Pressable
                        style={({ pressed }) => [
                          styles.supplyTop,
                          pressed && styles.cardPressed,
                        ]}
                        onPress={() => toggleStep(step.id)}
                      >
                        <View style={styles.stepNumber}>
                          <Text style={styles.stepNumberText}>
                            {String(index + 1).padStart(2, "0")}
                          </Text>
                        </View>

                        <View style={styles.supplyIconBox}>
                          <Ionicons name={step.icon} size={22} color="#B30000" />
                        </View>

                        <View style={styles.supplyInfo}>
                          <Text style={styles.supplyTitle}>{step.title}</Text>
                          <Text style={styles.supplySubtitle}>
                            {step.subtitle}
                          </Text>
                        </View>

                        <Ionicons
                          name={isOpen ? "chevron-up" : "chevron-down"}
                          size={22}
                          color="#6B7280"
                        />
                      </Pressable>

                      {isOpen && (
                        <View style={styles.supplyDetails}>
                          <View style={styles.companyChipsArea}>
                            {step.companies.map((company) => {
                              const isSelectedCompany =
                                selectedCompany?.id === company.id;

                              return (
                                <Pressable
                                  key={company.id}
                                  style={({ pressed }) => [
                                    styles.companyChip,
                                    isSelectedCompany &&
                                      styles.companyChipActive,
                                    pressed && styles.cardPressed,
                                  ]}
                                  onPress={() => selectCompany(company)}
                                >
                                  <Text
                                    style={[
                                      styles.companyChipText,
                                      isSelectedCompany &&
                                        styles.companyChipTextActive,
                                    ]}
                                  >
                                    {company.name}
                                  </Text>
                                </Pressable>
                              );
                            })}
                          </View>

                          {selectedCompanyInStep ? (
                            <View style={styles.inlineCompanyDetail}>
                              <View style={styles.inlineCompanyHeader}>
                                <View style={styles.inlineCompanyIcon}>
                                  <Ionicons
                                    name="business-outline"
                                    size={20}
                                    color="#B30000"
                                  />
                                </View>

                                <View style={{ flex: 1 }}>
                                  <Text style={styles.inlineCompanyLabel}>
                                    Empresa selecionada
                                  </Text>
                                  <Text style={styles.inlineCompanyTitle}>
                                    {selectedCompanyInStep.name}
                                  </Text>
                                </View>
                              </View>

                              <Text style={styles.inlineCompanyText}>
                                {selectedCompanyInStep.description}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      )}
                    </View>

                    {index < supplyNetwork.length - 1 && (
                      <View style={styles.connector}>
                        <View style={styles.connectorLine} />
                        <View style={styles.connectorCircle}>
                          <Ionicons
                            name="arrow-down"
                            size={15}
                            color="#B30000"
                          />
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Transporte</Text>
              <Text style={styles.sectionSubtitle}>
                Fluxo logístico dos insumos e do produto final.
              </Text>
            </View>

            <View style={styles.transportHero}>
              <View>
                <Text style={styles.transportHeroLabel}>Fluxo logístico</Text>
                <Text style={styles.transportHeroTitle}>
                  Fornecedor → Produção → Cliente
                </Text>
              </View>

              <Ionicons name="trail-sign-outline" size={32} color="#B30000" />
            </View>

            <View style={styles.transportList}>
              {transportSteps.map((step, index) => (
                <View key={step.id} style={styles.transportCard}>
                  <View style={styles.transportNumber}>
                    <Text style={styles.transportNumberText}>
                      {String(index + 1).padStart(2, "0")}
                    </Text>
                  </View>

                  <View style={styles.transportIcon}>
                    <Ionicons name={step.icon} size={22} color="#B30000" />
                  </View>

                  <View style={styles.transportInfo}>
                    <Text style={styles.transportTitle}>{step.title}</Text>
                    <Text style={styles.transportSubtitle}>{step.subtitle}</Text>
                    <Text style={styles.transportDescription}>
                      {step.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.footerNote}>
          <Ionicons name="information-circle-outline" size={22} color="#B30000" />
          <Text style={styles.footerText}>
            A tela transforma o fluxograma do projeto em uma visualização
            interativa, adequada para apresentação mobile.
          </Text>
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
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  heroCard: {
    backgroundColor: "#151515",
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  heroLabel: {
    fontSize: 13,
    color: "#D1D5DB",
    marginBottom: 4,
  },
  heroValue: {
    fontSize: 40,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  heroDescription: {
    fontSize: 13,
    color: "#D1D5DB",
    lineHeight: 20,
    marginBottom: 18,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  heroStats: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
  },
  heroStat: {
    flex: 1,
    alignItems: "center",
  },
  heroStatValue: {
    fontSize: 17,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  heroStatLabel: {
    marginTop: 3,
    fontSize: 11,
    color: "#D1D5DB",
  },
  heroStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  segment: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 5,
    flexDirection: "row",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  segmentButtonActive: {
    backgroundColor: "#B30000",
  },
  segmentText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6B7280",
  },
  segmentTextActive: {
    color: "#FFFFFF",
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#151515",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  productionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  productionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  rootIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#B30000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rootTextArea: {
    flex: 1,
  },
  rootTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#151515",
  },
  rootSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B7280",
  },
  rootBadge: {
    backgroundColor: "#F6F7FB",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  rootBadgeText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#151515",
  },
  volumeBar: {
    height: 12,
    borderRadius: 999,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    marginBottom: 13,
  },
  volumePart: {
    height: "100%",
  },
  volumeLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B5563",
  },
  productSelector: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  productMiniCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  productMiniCardActive: {
    backgroundColor: "#FFF7ED",
  },
  productMiniTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productMiniName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#151515",
  },
  productMiniStyle: {
    marginTop: 5,
    fontSize: 12,
    color: "#6B7280",
  },
  productMiniBottom: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  productMiniVolume: {
    fontSize: 24,
    fontWeight: "900",
    color: "#151515",
  },
  productMiniPercent: {
    fontSize: 13,
    fontWeight: "800",
    color: "#6B7280",
    marginBottom: 3,
  },
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 3,
  },
  detailTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#151515",
  },
  detailBadge: {
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  detailBadgeText: {
    fontSize: 13,
    fontWeight: "900",
  },
  detailDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
    marginBottom: 16,
  },
  detailMetricRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  metricBox: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    borderRadius: 16,
    padding: 14,
  },
  metricLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#151515",
  },
  ingredientsTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#151515",
    marginBottom: 10,
  },
  ingredientsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  ingredientChip: {
    backgroundColor: "#F6F7FB",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ingredientText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  timeline: {
    marginBottom: 24,
  },
  supplyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  supplyCardActive: {
    borderWidth: 1,
    borderColor: "rgba(179,0,0,0.18)",
  },
  supplyTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: "#151515",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  supplyIconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "rgba(179,0,0,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  supplyInfo: {
    flex: 1,
  },
  supplyTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#151515",
  },
  supplySubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  supplyDetails: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
  },
  companyChipsArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  companyChip: {
    backgroundColor: "#F6F7FB",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  companyChipActive: {
    backgroundColor: "#FFF7ED",
    borderColor: "rgba(179,0,0,0.25)",
  },
  companyChipText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#374151",
  },
  companyChipTextActive: {
    color: "#B30000",
  },
  inlineCompanyDetail: {
    marginTop: 14,
    backgroundColor: "#FFF7ED",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(179,0,0,0.12)",
  },
  inlineCompanyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inlineCompanyIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(179,0,0,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  inlineCompanyLabel: {
    fontSize: 12,
    color: "#9A3412",
    marginBottom: 2,
    fontWeight: "700",
  },
  inlineCompanyTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#151515",
  },
  inlineCompanyText: {
    fontSize: 13,
    color: "#7C2D12",
    lineHeight: 20,
  },
  connector: {
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  connectorLine: {
    position: "absolute",
    width: 2,
    height: 34,
    backgroundColor: "rgba(179,0,0,0.18)",
  },
  connectorCircle: {
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(179,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  transportHero: {
    backgroundColor: "#151515",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  transportHeroLabel: {
    fontSize: 13,
    color: "#D1D5DB",
    marginBottom: 4,
  },
  transportHeroTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    maxWidth: 230,
  },
  transportList: {
    gap: 14,
    marginBottom: 24,
  },
  transportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  transportNumber: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: "#151515",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  transportNumberText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  transportIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "rgba(179,0,0,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  transportInfo: {
    flex: 1,
  },
  transportTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#151515",
    marginBottom: 3,
  },
  transportSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  transportDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
  },
  footerNote: {
    backgroundColor: "#FFF7ED",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    color: "#7C2D12",
    lineHeight: 20,
  },
  cardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
});