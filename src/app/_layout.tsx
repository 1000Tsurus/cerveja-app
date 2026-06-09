import { Stack } from "expo-router";
import { BluetoothClassicProvider } from "../context/BluetoothClassicContext";

export default function Layout() {
  return (
    <BluetoothClassicProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
          contentStyle: {
            backgroundColor: "#F6F7FB",
          },
        }}
      />
    </BluetoothClassicProvider>
  );
}