import express from "express";
import { loadMixedArticles } from "../services/articleLoader.js";
import parseArticles from "../services/articleParser.js";
const router = express.Router();


router.post("/load-articles", async (req, res) => {
    try{
        let user = req.body.user;
        const articles = await loadMixedArticles(user);
        res.status(200).json({ message: "Articles loaded successfully", articles });
    } catch (error) {
        res.status(500).json({ message: "Error loading articles", error });
    }
});


router.post("/parse-article", async (req, res) => {
    try{
        const passedArticle = await req.body;
        const article = await parseArticles(passedArticle);
        res.status(200).json({ message: "Article parsed successfully", article });
    }
    catch(error){
        res.status(500).json({ message: "Failed to load and parse article at endpoint", error });
    }
})





export default router;


