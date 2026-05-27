import BottomNav from "../components/BottomNav";
import PageHeader from "../components/PageHeader";
import { useSwipeNavigation } from "../components/useSwipeNavigation";

import { StyleSheet, View } from "react-native";

export default function Cerveja() {
  const swipe = useSwipeNavigation("/home", "/controle");

  return (
    <View style={styles.container} {...swipe.panHandlers}>
      <View style={styles.content}>
        <PageHeader
          title="Cerveja"
          subtitle="Informações e receitas da cerveja."
        />
      </View>

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
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
});