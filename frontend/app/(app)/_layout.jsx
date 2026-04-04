import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { Alert, View, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function AppLayout() {
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect to auth if user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)");
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => logout(),
        style: "destructive",
      },
    ]);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true,

          // 1. HEADER DESIGN
          headerStyle: {
            backgroundColor: "#0F1115",
            borderBottomWidth: 1,
            borderBottomColor: "#1C1F26",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            fontWeight: "800",
            color: "#FFFFFF",
            fontSize: 18,
            letterSpacing: -0.5,
          },
          headerTintColor: "#00F5D4", // Mint Hamburger Menu Icon

          // 2. DRAWER DESIGN (The Sidebar)
          drawerStyle: {
            backgroundColor: "#0F1115",
            width: 280,
            borderRightWidth: 1,
            borderRightColor: "#2D333F",
          },
          drawerActiveTintColor: "#00F5D4",
          drawerInactiveTintColor: "#94A3B8",
          drawerLabelStyle: {
            fontWeight: "700",
            fontSize: 16,
            marginLeft: -10,
          },
          drawerItemStyle: {
            borderRadius: 12,
            marginVertical: 4,
            marginHorizontal: 10,
          },

          overlayColor: "rgba(0, 0, 0, 0.7)",

          // Prevents white flashes during transitions
          sceneContainerStyle: { backgroundColor: "#0F1115" },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Discovery",
            title: "Not A Feed",
            drawerIcon: ({ color }) => (
              <Ionicons name="compass" size={22} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="saved"
          options={{
            drawerLabel: "Saved Articles",
            title: "saved",
            drawerIcon: ({ color }) => (
              <Ionicons name="bookmark" size={22} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="logout"
          options={{
            drawerLabel: "Logout",
            title: "Logout",
            drawerIcon: ({ color }) => (
              <Ionicons name="log-out-outline" size={22} color={color} />
            ),
          }}
          listeners={{
            drawerItemPress: (e) => {
              e.preventDefault(); // Stop default navigation
              handleLogout(); // Trigger our custom alert
            },
          }}
        />
        <Drawer.Screen
          name="fullArticle"
          options={{
            drawerItemStyle: { display: "none" }, // Hides from drawer
            title: "Article",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
