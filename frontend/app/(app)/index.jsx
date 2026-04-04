import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext.js";
import { useSavedArticles } from "../context/SavedArticlesContext.js";
import Toast from "react-native-toast-message";
import { styles } from "../styles/homeStyles.js";
import { router, useRouter } from "expo-router";

export default function Home() {
  // --- STATE ---
  const [showArticle, setShowArticle] = useState(false); // Tracks if user clicked "Explore"
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Tracks background fetching
  const [articleCount, setArticleCount] = useState(0);
  const [articleArray, setArticleArray] = useState([]);

  const { currentUser } = useAuth();
  const { saveArticle, isArticleSaved } = useSavedArticles();


const fetchArticles = async (showload=true) => {
  try {
    // We start loading immediately in the background
    showload ? setIsLoading(true) : null;
    const promise = await fetch("http://192.168.1.8:5000/api/load-articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: currentUser,
      }),
    });
    console.log("Fetched articles response:", promise);
    const response = await promise.json();
    const articles = response.articles || [];
    console.log("Article:", articles[0]);

    setArticleArray((prev) => [...prev, ...articles]);
  } catch (err) {
    console.error("Failed to load articles:", err);
    Alert.alert("Error", "Failed to load articles. Please try again.");
  } finally {
    setIsLoading(false);
  }
};









  // --- BACKGROUND FETCH ---
  useEffect(() => {
    if (!currentUser) return;

    let cancelled = false;

    

    fetchArticles();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.id]);


  let router = useRouter();
  // --- HELPERS ---
  const currentArticle = articleArray[articleCount];

  const openArticle = async () => {
    if (currentArticle?.url) {

      router.push({
        pathname: "/fullArticle",
        params: {
          title: currentArticle.title,
          topic: currentArticle.topic,
        },
      });

    }
  };

  const nextArticle = async () => {
    const nextIdx = (articleCount + 1) % articleArray.length;
    setArticleCount(nextIdx);

    // Infinite scroll logic: load more when near the end
    if (nextIdx === articleArray.length - 10) {
      try {
        fetchArticles(false);
      } catch (e) {
        console.log("Failed to load more articles");
      }
    }
  };

  const previousArticle = () => {
    if (articleArray.length > 0) {
      setArticleCount(
        (prev) => (prev - 1 + articleArray.length) % articleArray.length,
      );
    }
  };

  const handleArticleSave = async () => {
    if (!currentArticle) return;
    const isSaved = isArticleSaved(currentArticle.url);

    if (isSaved) {
      Toast.show({
        type: "info",
        text1: "Already Saved",
        text2: "This article is in your collection",
        position: "bottom",
        visibilityTime: 1000,
      });
    } else {
      setIsSaving(true);
      try {
        await saveArticle(currentArticle);
        Toast.show({
          type: "success",
          text1: "Saved! ⭐",
          position: "bottom",
          visibilityTime: 1000,
        });
      } catch (error) {
        Alert.alert("Error", "Could not save article.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  // --- CONDITIONAL RENDERING ---

  // CASE 1: User clicked Explore but background fetch is still working
  if (showArticle && isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.centered, { flex: 1 }]}>
          <ActivityIndicator size="large" color="#00F5D4" />
          <Text style={{ color: "#94A3B8", marginTop: 10 }}>
            Curating your feed...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // CASE 2: User clicked Explore, loading is done, but no articles found
  if (showArticle && !isLoading && articleArray.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.centered, { flex: 1 }]}>
          <Text style={{ color: "#94A3B8", fontSize: 16, marginBottom: 20 }}>
            No articles available right now.
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => setShowArticle(false)}
          >
            <Text style={styles.btnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // CASE 3: Standard View (Either the Welcome Screen or the Article Feed)
  return (
    <SafeAreaView style={styles.container}>
      {/* Consistent Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>
            Hello, {currentUser?.username?.split(" ")[0] || "Explorer"}
          </Text>
          <Text style={styles.date}>Daily Curation</Text>
        </View>
        <View style={styles.profileBadge}>
          <Text style={styles.profileChar}>
            {currentUser?.username?.charAt(0) || "E"}
          </Text>
        </View>
      </View>

      {!showArticle ? (
        /* WELCOME SCREEN (Data fetches silently in background while this is visible) */
        <View style={styles.centered}>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => setShowArticle(true)}
          >
            <Ionicons name="sparkles" size={24} color="#0F1115" />
            <Text style={styles.btnText}>Start Exploring</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ARTICLE FEED (Only visible after Explore is clicked AND data is ready) */
        <View style={styles.discoveryWrapper}>
          <View style={styles.navigation}>
            <TouchableOpacity
              onPress={previousArticle}
              style={styles.navIcon}
              disabled={articleCount === 0}
            >
              <Ionicons name="chevron-back" size={28} color="#94A3B8" />
            </TouchableOpacity>
            <Text style={styles.counter}>
              {articleCount + 1} / {articleArray.length}
            </Text>
            <TouchableOpacity onPress={nextArticle} style={styles.navIcon}>
              <Ionicons name="chevron-forward" size={28} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {currentArticle ? (
            <View style={styles.card}>
              <Text style={styles.sourceTag}>{currentArticle.topic}</Text>
              <Text style={styles.cardTitle}>{currentArticle.title}</Text>
              <Text style={styles.cardExcerpt}>
                {currentArticle.snippet?.replace(/<[^>]*>/g, "") ||
                  "No description available"}
              </Text>

              <TouchableOpacity
                style={styles.readMoreBtn}
                onPress={openArticle}
              >
                <Text style={styles.readMoreText}>Read Full Article</Text>
                <Ionicons name="arrow-forward" size={18} color="#00F5D4" />
              </TouchableOpacity>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <FontAwesome name="thumbs-up" size={24} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <FontAwesome name="thumbs-down" size={24} color="#94A3B8" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleArticleSave}
                  style={styles.actionBtn}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#00F5D4" />
                  ) : (
                    <Ionicons
                      name={
                        isArticleSaved(currentArticle.url)
                          ? "star"
                          : "star-outline"
                      }
                      size={24}
                      color="#00F5D4"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={{ color: "#94A3B8", textAlign: "center" }}>
              No article to display
            </Text>
          )}
        </View>
      )}
      <Toast />
    </SafeAreaView>
  );
}
