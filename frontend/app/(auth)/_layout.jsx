import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("🔐 AuthLayout - isAuthenticated:", isAuthenticated);

    if (isAuthenticated) {
      console.log("✅ Auth detected, navigating to /(app)");
      router.replace("/(app)");
    }
  }, [isAuthenticated]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
