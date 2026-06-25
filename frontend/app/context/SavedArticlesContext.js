import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SavedArticlesContext = createContext(null);

export function SavedArticlesProvider({ children }) {
  const { currentUser, token, setCurrentUser } = useAuth(); // ✅ Get setCurrentUser
  const [savedArticles, setSavedArticles] = useState([]);
  const savingInProgress = useRef(new Set());

  useEffect(() => {
    console.log("🔄 Loading saved articles for user:", currentUser?.id);

    setSavedArticles(currentUser?.savedArticles || []);
  }, [currentUser?.id]);

  const saveArticle = async (article) => {
    console.log("🔴 saveArticle CALLED for:", article.title);
    console.log("📊 Current saved count:", savedArticles.length);

    // ✅ Prevent double-saves
    if (savingInProgress.current.has(article.url)) {
      console.log("⏳ Already saving, skipping...");
      return;
    }

    // ✅ Check if already saved
    const alreadySaved = savedArticles.some(
      (saved) => saved.url === article.url,
    );
    if (alreadySaved) {
      console.log("⚠️ Article already saved");
      return;
    }

    savingInProgress.current.add(article.url);

    try {
      // 1. Save to backend
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/save-article`,
        {
          // ✅ Fixed IP
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ article }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Backend saved article");

        // 2. Create updated arrays/objects
        const updatedSavedArticles = [...savedArticles, article];
        const updatedUser = {
          ...currentUser,
          savedArticles: updatedSavedArticles,
        };

        // 3. Update local state
        setSavedArticles(updatedSavedArticles);

        // 4. ✅ Update AsyncStorage (THIS WAS MISSING!)
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        console.log("✅ AsyncStorage updated");

        // 5. ✅ Update AuthContext (THIS WAS MISSING!)
        setCurrentUser(updatedUser);
        console.log("✅ AuthContext updated");

        console.log("✅ Save complete! Total:", updatedSavedArticles.length);
      } else {
        console.log("❌ Backend save failed:", data.message);
      }
    } catch (error) {
      console.log("❌ Network error:", error);
      console.log("💡 Check: Is backend running? Is IP correct?");
    } finally {
      savingInProgress.current.delete(article.url);
    }
  };

  const unsaveArticle = async (articleUrl) => {
    try {
      // 1. Remove from backend
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/unsave-article`,
        {
          // ✅ Fixed IP
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ articleUrl }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Backend unsaved article");

        // 2. Create updated arrays/objects
        const updatedSavedArticles = savedArticles.filter(
          (article) => article.url !== articleUrl,
        );
        const updatedUser = {
          ...currentUser,
          savedArticles: updatedSavedArticles,
        };

        // 3. Update local state
        setSavedArticles(updatedSavedArticles);

        // 4. ✅ Update AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

        // 5. ✅ Update AuthContext
        setCurrentUser(updatedUser);

        console.log("✅ Unsave complete!");
      } else {
        console.log("❌ Unsave failed:", data.message);
      }
    } catch (error) {
      console.log("❌ Error unsaving:", error);
    }
  };

  const isArticleSaved = (articleUrl) => {
    return savedArticles.some((article) => article.url === articleUrl);
  };

  return (
    <SavedArticlesContext.Provider
      value={{
        savedArticles,
        saveArticle,
        unsaveArticle,
        isArticleSaved,
      }}
    >
      {children}
    </SavedArticlesContext.Provider>
  );
}

export function useSavedArticles() {
  const context = useContext(SavedArticlesContext);
  if (!context) {
    throw new Error(
      "useSavedArticles must be used within SavedArticlesProvider",
    );
  }
  return context;
}
