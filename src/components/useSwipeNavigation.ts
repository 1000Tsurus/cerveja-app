import { useRouter, type Href } from "expo-router";
import { useMemo } from "react";
import { PanResponder } from "react-native";

export function useSwipeNavigation(
  swipeLeftTo?: Href,
  swipeRightTo?: Href
) {
  const router = useRouter();

  return useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => {
          const horizontal = Math.abs(gesture.dx) > 20;
          const moreHorizontalThanVertical =
            Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.2;

          return horizontal && moreHorizontalThanVertical;
        },

        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx < -70 && swipeLeftTo) {
            router.replace(swipeLeftTo);
          }

          if (gesture.dx > 70 && swipeRightTo) {
            router.replace(swipeRightTo);
          }
        },
      }),
    [router, swipeLeftTo, swipeRightTo]
  );
}