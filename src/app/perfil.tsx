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
        "Responsável pelo desenvolvimento e integração do aplicativo do projeto, criando a interface utilizada para apresentar e acompanhar as informações do sistema. Além disso, também contribuiu na produção da cerveja e no processo de engarrafamento, auxiliando nas etapas práticas do Schraderbräu.",
      foto: require("../../assets/images/vini.jpg"),
    },
    {
      id: 2,
      name: "Nicolas Fagundes",
      role: "Liderança, Gestão de Projeto e Integração Grafana",
      description:
        "Responsável na gestão e documentação do projeto, auxiliando na organização geral das etapas e no acompanhamento do desenvolvimento do grupo. Além disso, contribuiu com a produção da cerveja, apoiou a integração com o Grafana e exerceu o papel de liderança, ajudando a manter a equipe alinhada durante todo o projeto.",
      foto: require("../../assets/images/nick.jpg"),
    },
    {
      id: 3,
      name: "Pedro Henrique Strongren",
      role: "Gestão e Documentação²",
      description:
        "Atua na área de gestão e documentação do projeto, sendo responsável pela elaboração das atas e pelo registro das reuniões e decisões do grupo. Além disso, também contribuiu nas etapas práticas, auxiliando na produção da cerveja artesanal.",
      foto: require("../../assets/images/pedro.jpg"),
    },
    {
      id: 4,
      name: "João Victor Gomes",
      role: "Documentação e Testes³",
      description:
        "Responsável pela elaboração do caderno, registrando as etapas, informações e desenvolvimento do trabalho. Além disso, também contribuiu nas atividades práticas, auxiliando na produção da cerveja artesanal.",
      foto: require("../../assets/images/goveia.jpg"),
    },
    {
      id: 5,
      name: "Victor de Jesus",
      role: "Desenvolvimento da Estrutura, Manufatura e Montagem",
      description:
        "Ficou responsável pela construção da caixa do controlador e pela organização da parte física do sistema. Além disso, auxiliou no desenvolvimento do circuito, contribuiu com a documentação e também participou das etapas práticas da produção da cerveja artesanal.",
      foto: require("../../assets/images/victor.jpg"),
    },
    {
      id: 6,
      name: "Guilherme Pontes",
      role: "Engenharia de Firmware e Hardware Elétrico",
      description:
        "Atuou no desenvolvimento elétrico e na montagem do projeto, sendo responsável pelo desenvolvimento do circuito do controlador e do circuito da bomba. Além disso, auxiliou na integração do Bluetooth com o aplicativo, contribuindo para o funcionamento e comunicação do sistema.",
      foto: require("../../assets/images/gpontes.jpg"),
    },
    {
      id: 7,
      name: "Alvaro Sáteles",
      role: "Desenvolvimento Web, Arquitetura de Dados e Integração de IA",
      description:
        "Responsável pela criação do site oficial e do dashboard de monitoramento. Além disso, elevou o nível do projeto ao desenvolver e integrar uma Inteligência Artificial que simula de forma imersiva um personagem da série que inspirou a logo ",
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
