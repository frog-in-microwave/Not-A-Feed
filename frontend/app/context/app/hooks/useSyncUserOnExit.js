import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useSyncUserOnExit = (currentUser) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        // App is going to background
        if (
          appState.current === "active" &&
          nextAppState.match(/inactive|background/)
        ) {
          console.log("📱 App going to background, saving user...");
          if (currentUser) {
            await AsyncStorage.setItem("user", JSON.stringify(currentUser));
            console.log("✅ User saved to AsyncStorage on exit");
          }
        }

        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, [currentUser]);
};
