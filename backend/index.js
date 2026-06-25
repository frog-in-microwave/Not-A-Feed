import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import saveArticleRoutes from "./routes/saveArticle.js";
import articleHandelingRoutes from "./routes/articleHandeling.js";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection URL
const url = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(url)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api", authRoutes);
app.use("/api", saveArticleRoutes);
app.use("/api", articleHandelingRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});


// Start server
const PORT = process.env.PORT;
console.log("PORT:", process.env.PORT);
console.log(
  "All env keys:",
  Object.keys(process.env).filter((k) => k.includes("PORT")),
);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
