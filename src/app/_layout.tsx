import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { TankProvider } from "../context/TankContext";
import { BleProvider } from "../Provider/useBle";
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  return (
    <TankProvider>
      { }
      <BleProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "none",
            contentStyle: {
              backgroundColor: "#F6F7FB",
            },
          }}
        />
      </BleProvider>
    </TankProvider>
  );
}
