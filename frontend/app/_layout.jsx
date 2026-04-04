import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./context/AuthContext";
import { SavedArticlesProvider } from "./context/SavedArticlesContext"; // ← Import
import Toast from "react-native-toast-message";



function RootLayoutNav() {
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SavedArticlesProvider>
          <RootLayoutNav />
          <Toast />
        </SavedArticlesProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
