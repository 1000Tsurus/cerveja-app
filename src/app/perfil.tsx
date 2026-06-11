import { useState } from "react";

import BottomNav from "../components/BottomNav";
import PageHeader from "../components/PageHeader";
import { useSwipeNavigation } from "../components/useSwipeNavigation";

import Ionicons from "@expo/vector-icons/Ionicons";

import { Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Member = {
  id: number;
  name: string;
  role: string;
  description: string;
  foto?: ImageSourcePropType;
};

export default function Perfil() {
  const swipe = useSwipeNavigation("/config", "/dash");

  const [openedMember, setOpenedMember] = useState<number | null>(null);

  const members: Member[] = [
    {
      id: 1,
      name: "Vinícius Ramos",
      role: "Desenvolvimento e Integração do Aplicativo",
      description:
        "Responsável pela estrutura do aplicativo, integração BLE e desenvolvimento geral do sistema.",
      foto: require("../../assets/images/vini.jpg"),
    },
    {
      id: 2,
      name: "Nicolas Fagundes",
      role: "Gestão e Documentação¹",
      description:
        "Responsável pela lógica do servidor e comunicação com os dados do tanque.",
      foto: require("../../assets/images/nick.jpg"),
    },
    {
      id: 3,
      name: "Pedro Henrique Strongren",
      role: "Gestão e Documentação²",
      description:
        "Cuida da experiência visual e organização das interfaces do aplicativo.",
      foto: require("../../assets/images/pedro.jpg"),
    },
    {
      id: 4,
      name: "João Victor Gomes",
      role: "Documentação e Testes",
      description:
        "Desenvolvimento da comunicação do ESP com sensores e controle da bomba.",
      foto: require("../../assets/images/goveia.jpg"),
    },
    {
      id: 5,
      name: "Victor de Jesus",
      role: "Planejamento de Manufatura e Montagem",
      description:
        "Organização da documentação técnica e estrutura do projeto.",
      foto: require("../../assets/images/victor.jpg"),
    },
    {
      id: 6,
      name: "Guilherme Pontes",
      role: "Planejamento Elétrico e Montagem",
      description:
        "Pesquisa de soluções para automação, sensores e integração IoT.",
      foto: require("../../assets/images/gpontes.jpg"),
    },
    {
      id: 7,
      name: "Alvaro Sáteles",
      role: "Planejamento e Desenvolvimento de Arquitetura",
      description:
        "Responsável pelos testes do aplicativo e validação das funcionalidades.",
      foto: require("../../assets/images/alv.jpg"),
    },
  ];

  function toggleMember(id: number) {
    setOpenedMember((prev) => (prev === id ? null : id));
  }

  return (
    <View style={styles.container} {...swipe.panHandlers}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader
          title="Equipe Responsável"
          subtitle="Conheça os integrantes responsáveis pelo projeto."
        />

        <View style={styles.introCard}>
          <Text style={styles.introTitle}>
            Grupo Revelação
          </Text>

          <Text style={styles.introText}>
            O Schrader Beer é um sistema inteligente de automação para produção de cerveja artesanal, 
            utilizando IoT, ESP32 e controle PID para monitorar e controlar a temperatura do processo em tempo real, 
            trazendo mais precisão, qualidade e eficiência à fabricação.
          </Text>
        </View>

        <View style={styles.membersContainer}>
          {members.map((member) => {
            const isOpen = openedMember === member.id;

            return (
              <Pressable
                key={member.id}
                style={styles.memberCard}
                onPress={() => toggleMember(member.id)}
              >
                <View style={styles.memberTop}>
                  <View style={styles.avatar}>
                    {member.foto ? (
                      <Image source={member.foto} style={styles.avatarImage} />
                    ) : (
                      <Ionicons name="person" size={22} color="#B30000" />
                    )}
                  </View>

                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {member.name}
                    </Text>

                    <Text style={styles.memberRole}>
                      {member.role}
                    </Text>
                  </View>

                  <Ionicons
                    name={
                      isOpen
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={22}
                    color="#6B7280"
                  />
                </View>

                {isOpen && (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>
                      {member.description}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },

  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  content: {
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 140,
  },

  introCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },

  introTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#151515",
    marginBottom: 10,
  },

  introText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
  },

  membersContainer: {
    gap: 14,
  },

  memberCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },

  memberTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "rgba(179,0,0,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    overflow: "hidden",
  },

  memberInfo: {
    flex: 1,
  },

  memberName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#151515",
  },

  memberRole: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  descriptionContainer: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
  },

  descriptionText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
  },
});