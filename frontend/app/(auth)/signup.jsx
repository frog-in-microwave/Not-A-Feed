import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Signup() {
  const { signUp } = useAuth();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

 const topics = [
   "Tech",
   "Science",
   "Politics",
   "Sports",
   "Art",
   "Gaming",
   "Finance",
   "Health",
   "Travel",
   "History",
   "Music",
   "Movies",
   "Books",
   "Food",
   "Design",
   "Nature",
   "Business",
   "Philosophy",
   "Education",
   "Space",
 ];

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
    setErrorMessage(""); // Clear error when user selects topics
  };

  // Email validation regex
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = () => {
    // Clear previous errors
    setErrorMessage("");

    // Validate required fields
    if (!userName || !email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    // Validate at least one topic selected
    if (selectedTopics.length < 3) {
      setErrorMessage("Please select at least 3 topics");
      return;
    }
    

    // Attempt signup
    const result = signUp(userName, email, password, selectedTopics);
    if (result?.error) {
      setErrorMessage(result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView

        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Join Not A Feed</Text>
        <Text style={styles.subtitle}>
          Create your profile to start exploring.
        </Text>

        <View style={styles.form}>
          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>FULL NAME *</Text>
            <TextInput
              placeholder="John Doe"
              placeholderTextColor="#475569"
              style={styles.input}
              value={userName}
              onChangeText={(text) => {
                setUserName(text);
                setErrorMessage("");
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>EMAIL *</Text>
            <TextInput
              placeholder="email@example.com"
              placeholderTextColor="#475569"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrorMessage("");
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
                setErrorMessage("");
              }}
            />
          </View>

          <Text style={styles.sectionTitle}>
            I'm interested in... <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.chipContainer}>
            {topics.map((topic) => {
              const isActive = selectedTopics.includes(topic);
              return (
                <TouchableOpacity
                  key={topic}
                  onPress={() => toggleTopic(topic)}
                  style={[styles.chip, isActive && styles.chipActive]}
                >
                  <Text
                    style={[styles.chipText, isActive && styles.chipTextActive]}
                  >
                    {topic}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already a member? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.link}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1115" },
  scrollContent: { padding: 30, paddingBottom: 60 },
  title: { fontSize: 32, fontWeight: "800", color: "#FFF", letterSpacing: -1 },
  subtitle: { fontSize: 16, color: "#94A3B8", marginTop: 8, marginBottom: 30 },
  inputContainer: { marginBottom: 20 },
  label: {
    color: "#00F5D4",
    fontSize: 11,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginTop: 30,
    marginBottom: 15,
  },
  required: {
    color: "#00F5D4",
    fontSize: 18,
  },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#2D333F",
    backgroundColor: "#1C1F26",
  },
  chipActive: { backgroundColor: "#00F5D4", borderColor: "#00F5D4" },
  chipText: { color: "#94A3B8", fontWeight: "600" },
  chipTextActive: { color: "#0F1115", fontWeight: "700" },
  button: {
    backgroundColor: "#00F5D4",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: { color: "#0F1115", fontWeight: "700", fontSize: 16 },
  error: {
    color: "#FF4B66",
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 30 },
  footerText: { color: "#94A3B8" },
  link: { color: "#00F5D4", fontWeight: "700" },
});
