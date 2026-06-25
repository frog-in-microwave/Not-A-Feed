import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import RenderHTML from "react-native-render-html";
import * as Haptics from "expo-haptics";

export default function FullArticle() {
  const { title, topic } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const scrollRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [progress, setProgress] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Smooth Interpolation for the button
  const buttonOpacity = scrollY.interpolate({
    inputRange: [250, 400],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const buttonScale = scrollY.interpolate({
    inputRange: [250, 400],
    outputRange: [0.4, 1],
    extrapolate: "clamp",
  });

  useEffect(() => {
    loadArticle();
  }, [title]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      if (title) {
        const promise = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/parse-article`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ title }),
          },
        );
        let response = await promise.json();
        setHtmlContent(response.article);
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to load article.");
      setLoading(false);
    }
  };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const scrollableHeight = contentSize.height - layoutMeasurement.height;

    if (scrollableHeight <= 0) return;

    const currentProgress = contentOffset.y / scrollableHeight;
    setProgress(Math.min(Math.max(currentProgress, 0), 1));

    if (currentProgress > 0.98 && !hasCompleted) {
      setHasCompleted(true);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {}
    }
  };

  const scrollToTop = () => {
    // Instant execution
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00F5D4" />
          <Text style={styles.loadingText}>Curating your content...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#00F5D4" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadArticle}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backButtonInline}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#00F5D4" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <Animated.ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
            listener: handleScroll,
          },
        )}
        scrollEventThrottle={16} // Balanced for performance and responsiveness
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.articleHeader}>
          {topic && <Text style={styles.topicTag}>{topic}</Text>}
          <Text style={styles.titleText}>{title}</Text>
        </View>

        <View style={styles.htmlWrapper}>
          <RenderHTML
            contentWidth={width - 60}
            source={{ html: htmlContent }}
            ignoredDomTags={["meta", "link", "img"]}
            tagsStyles={htmlStyles}
            defaultTextProps={{ selectable: true }}
          />
        </View>

        <View style={styles.footer}>
          <Ionicons
            name={hasCompleted ? "checkmark-done-circle" : "ellipse-outline"}
            size={38}
            color={hasCompleted ? "#00F5D4" : "#2D333F"}
          />
          <Text style={[styles.footerText, hasCompleted && { color: "#FFF" }]}>
            {hasCompleted ? "Path Completed" : "Continue Reading"}
          </Text>
          {hasCompleted && (
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.doneBtnText}>Return to Discovery</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      <Animated.View
        style={[
          styles.backToTopWrapper,
          {
            opacity: buttonOpacity,
            transform: [{ scale: buttonScale }],
          },
        ]}
        pointerEvents="box-none" // Ensures touches pass through the wrapper to the button
      >
        <TouchableOpacity
          style={styles.backToTop}
          onPress={scrollToTop}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-up" size={30} color="#0F1115" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const htmlStyles = {
  body: {
    color: "#CBD5E1",
    fontSize: 18,
    lineHeight: 28,
    backgroundColor: "#0F1115",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  p: { marginBottom: 22, color: "#CBD5E1", textAlign: "left" },
  h1: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 24,
    marginBottom: 16,
    lineHeight: 38,
  },
  h2: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1C1F26",
    paddingBottom: 8,
  },
  h3: {
    color: "#00F5D4",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  a: { color: "#00F5D4", textDecorationLine: "none", fontWeight: "600" },
  ul: { marginBottom: 15, paddingLeft: 10 },
  li: { color: "#E2E8F0", marginBottom: 10, fontSize: 17 },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: "#00F5D4",
    paddingLeft: 20,
    fontStyle: "italic",
    marginVertical: 25,
    color: "#94A3B8",
  },
  code: {
    backgroundColor: "#1C1F26",
    color: "#00F5D4",
    paddingHorizontal: 6,
    borderRadius: 4,
  },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1115" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#94A3B8",
    marginTop: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  errorText: {
    color: "#FF4B66",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: "#0F1115",
    borderBottomWidth: 1,
    borderBottomColor: "#1C1F26",
    position: "relative",
  },
  progressContainer: {
    height: 2,
    width: "100%",
    position: "absolute",
    bottom: -1,
    left: 0,
    backgroundColor: "transparent",
  },
  progressBar: { height: "100%", backgroundColor: "#00F5D4", elevation: 5 },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 8,
  },
  backButtonInline: { flexDirection: "row", alignItems: "center", gap: 8 },
  backText: { color: "#00F5D4", fontSize: 16, fontWeight: "700" },
  retryBtn: {
    backgroundColor: "#00F5D4",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: { color: "#0F1115", fontWeight: "bold" },
  articleHeader: { padding: 25, paddingTop: 30 },
  topicTag: {
    color: "#00F5D4",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 10,
    letterSpacing: 1.5,
  },
  titleText: { color: "#FFF", fontSize: 30, fontWeight: "800", lineHeight: 38 },
  htmlWrapper: { paddingHorizontal: 25, overflow: "hidden" },
  footer: {
    alignItems: "center",
    marginTop: 50,
    paddingVertical: 40,
    borderTopWidth: 1,
    borderTopColor: "#1C1F26",
  },
  footerText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginTop: 15,
  },
  doneBtn: {
    marginTop: 25,
    backgroundColor: "#00F5D4",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
  },
  doneBtnText: { color: "#0F1115", fontWeight: "800", fontSize: 16 },
  backToTopWrapper: {
    position: "absolute",
    bottom: 30,
    right: 25,
    zIndex: 999,
  },
  backToTop: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00F5D4",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#00F5D4",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
});
