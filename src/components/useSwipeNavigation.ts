import { useRouter, type Href } from "expo-router";
import { useRef, useEffect } from "react";
import { PanResponder } from "react-native";

export function useSwipeNavigation(swipeLeftTo?: Href, swipeRightTo?: Href) {
  const router = useRouter();

  const rotasRef = useRef({ swipeLeftTo, swipeRightTo, router });

  useEffect(() => {
    rotasRef.current = { swipeLeftTo, swipeRightTo, router };
  }, [swipeLeftTo, swipeRightTo, router]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        const isHorizontal = Math.abs(gesture.dx) > 20;

        const isIntentional = Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.5;

        return isHorizontal && isIntentional;
      },

      onPanResponderRelease: (_, gesture) => {
        const { swipeLeftTo: left, swipeRightTo: right, router: r } = rotasRef.current;

        if (gesture.dx < -70 && left) {
          r.replace(left);
        } else if (gesture.dx > 70 && right) {
          r.replace(right);
        }
      },
    })
  ).current;

  return panResponder;
}
