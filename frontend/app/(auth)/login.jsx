import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Email validation regex
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Clear previous errors
    setErrorMessage("");

    // Validate required fields
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    // Attempt login
    const result = await login(email, password);
    if (result?.error) {
      setErrorMessage(result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your discovery.
            </Text>
          </View>

          <View style={styles.form}>
            {errorMessage ? (
              <Text style={styles.error}>{errorMessage}</Text>
            ) : null}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>EMAIL *</Text>
              <TextInput
                placeholder="email@example.com"
                placeholderTextColor="#475569"
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrorMessage(""); // Clear error when user types
                }}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>PASSWORD *</Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#475569"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrorMessage(""); // Clear error when user types
                }}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New here? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text style={styles.link}>Create an account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1115" },
  inner: { flex: 1, padding: 30, justifyContent: "center" },
  header: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: "800", color: "#FFF", letterSpacing: -1 },
  subtitle: { fontSize: 16, color: "#94A3B8", marginTop: 8 },
  form: { width: "100%" },
  inputContainer: { marginBottom: 25 },
  label: {
    color: "#00F5D4",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "#1C1F26",
    borderRadius: 12,
    padding: 16,
    color: "#FFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2D333F",
  },
  error: {
    color: "#FF4B66",
    marginBottom: 15,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#00F5D4",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#0F1115", fontWeight: "700", fontSize: 16 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 40 },
  footerText: { fontSize: 14, color: "#94A3B8" },
  link: { fontSize: 14, color: "#00F5D4", fontWeight: "700" },
});
