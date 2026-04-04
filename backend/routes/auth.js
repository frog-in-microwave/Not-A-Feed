import dotenv from "dotenv";
dotenv.config();
import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// REGISTRATION ENDPOINT
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, topicList, topicIndices } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      topicList,
      topicIndices,
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        topicList: user.topicList,
        savedArticles: user.savedArticles || [],
        topicIndices: user.topicIndices,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// LOGIN ENDPOINT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "No account found with that email" });
    }

    // Check password
    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );

    // Send response
    res.status(201).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        topicList: user.topicList,
        savedArticles: user.savedArticles,
        topicIndices: user.topicIndices,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
