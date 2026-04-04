import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EntranceScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        {/* Minimalist Logo Mark */}
        <View style={styles.logoMark}>
          <View style={styles.logoDot} />
        </View>

        <Text style={styles.brand}>Not A Feed</Text>
        <Text style={styles.tagline}>
          Stop scrolling.{"\n"}Start discovering.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/signup" asChild>
          <TouchableOpacity style={styles.signupBtn}>
            <Text style={styles.signupText}>Create Account</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1115", // Obsidian
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#00F5D4", // Mint
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00F5D4",
  },
  brand: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -1.5,
  },
  tagline: {
    fontSize: 18,
    color: "#94A3B8",
    marginTop: 12,
    lineHeight: 26,
  },
  buttonContainer: {
    gap: 12,
  },
  loginBtn: {
    backgroundColor: "#00F5D4", // Electric Mint
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  loginText: {
    color: "#0F1115",
    fontWeight: "700",
    fontSize: 16,
  },
  signupBtn: {
    backgroundColor: "#1C1F26", // Slate
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  signupText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
