import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSavedArticles } from "../context/SavedArticlesContext";
import { styles } from "../styles/savedStyles";
import { useRouter } from "expo-router";




export default function Saved() {
  const { savedArticles, unsaveArticle } = useSavedArticles();
  const [loadingUrl, setLoadingUrl] = useState(null);



  
  const router = useRouter();
  const openArticle = (currentArticle) => {
    router.push({
      pathname: "/fullArticle",
      params: {
        title: currentArticle.title,
        topic: currentArticle.topic,
      },
    });
  };

  const handleUnsave = async (articleUrl) => {
    setLoadingUrl(articleUrl); // Track specific article
    try {
      await unsaveArticle(articleUrl);
    } catch (error) {
      console.error("Failed to unsave article:", error);
    } finally {
      setLoadingUrl(null); // Reset
    }
  };

  if (savedArticles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="star-outline" size={80} color="#2D333F" />
          <Text style={styles.emptyTitle}>No Saved Articles</Text>
          <Text style={styles.emptyText}>
            Articles you save will appear here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Articles</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{savedArticles.length}</Text>
        </View>
      </View>

      <FlatList
        data={savedArticles}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardMainRow}>
              {/* Text side takes up all remaining width */}
              <View style={styles.textContainer}>
                <Text style={styles.sourceTag}>{item.author}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardExcerpt} numberOfLines={2}>
                  {item.content}
                </Text>

                <TouchableOpacity
                  style={styles.readMoreBtn}
                  onPress={() => openArticle(item)}
                >
                  <Text style={styles.readMoreText}>Read Article</Text>
                  <Ionicons name="arrow-forward" size={16} color="#00F5D4" />
                </TouchableOpacity>
              </View>

              {/* Button side remains fixed on the right */}
              <TouchableOpacity
                onPress={() => handleUnsave(item.url)}
                style={styles.unsaveBtn}
                disabled={loadingUrl !== null}
              >
                {loadingUrl === item.url ? (
                  <ActivityIndicator size="small" color="#00F5D4" />
                ) : (
                  <Ionicons name="star" size={24} color="#00F5D4" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}
