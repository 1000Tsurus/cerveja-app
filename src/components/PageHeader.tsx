import { StyleSheet, Text, View } from "react-native";
import { fonts } from "../components/fonts";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}> Grupo Revelação</Text>

      <Text style={styles.title}>{title}</Text>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 24,
  },
  eyebrow: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: "#B30000",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 30,
    color: "#151515",
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 7,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
});
