import { Redirect } from "expo-router";
import { useAuth } from "./context/AuthContext";

export default function Index() {
  const { isAuthenticated } = useAuth();

  console.log("📍 app/index.jsx - isAuthenticated:", isAuthenticated);

  return <Redirect href={isAuthenticated ? "/(app)" : "/(auth)"} />;
}
