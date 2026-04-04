import React, { createContext, use, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSavedArticles } from "./SavedArticlesContext";



const AuthContext = createContext(null);



export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);



  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    console.log("🔍 Checking login status..."); // ← Add this
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");

      console.log("📱 Stored user from AsyncStorage:", storedUser); // ← Add this

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("👤 Parsed user:", parsedUser); // ← Add this

        setIsAuthenticated(true);
        setToken(storedToken);
        setCurrentUser(parsedUser);
        console.log("✅ User is logged in");
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
        console.log("ℹ️ No user is logged in");
      }
    } catch (error) {
      console.log("❌ Error checking login status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    console.log("🚪 LOGIN CALLED");
    try {
      const response = await fetch("http://192.168.1.8:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        setToken(data.token);
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        console.log("✅ Login successful:", data);
        return { success: true, error: null };
      } else {
        console.log("❌ Login failed:", data.message);
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.log("❌ Login error:", error);
      return { success: false, error: "fetching error is server on?" };
    }
  };








  const signUp = async (username, email, password, topicList) => {
    console.log("🚪 SIGNUP CALLED");





    // try sending a request to the backend to register the user
    try{
      const response = await fetch("http://192.168.1.8:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, topicList, }),
      });
    const data = await response.json();
    // if the response is ok, set the user and token in the context and AsyncStorage
    if (response.ok) {
      setIsAuthenticated(true);
      setCurrentUser(data.user);
      setToken(data.token);
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      console.log("✅ Signup successful:", data);
      return { success: true, error: null };
    }
    // if the response is not ok, return the error message
    else{
      console.log("❌ Signup failed:", data.message);
      return { success: false, error: data.message };
    }



  }    catch (error) {
      console.log("❌ Signup error:", error);
      return { success: false, error: "fetching error is server on?" };
    }
  }
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setIsAuthenticated(false);
      setToken(null);
      setCurrentUser(null);
      console.log("✅ Logout successful");
    }
    catch (error) {
      console.log("❌ Logout error:", error);
    }
  };

  console.log("🔄 AuthProvider render - isAuthenticated:", isAuthenticated);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, signUp, currentUser , isLoading, token, setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
