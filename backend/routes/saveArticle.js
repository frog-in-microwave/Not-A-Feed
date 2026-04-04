import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import User from "../models/user.js";

const router = express.Router();











// pass in the headers : Authorization: Bearer <token>
//                       content-type: application/json
// in the body pass { article: {...} }     


// verifyToken will verify and decode the token, giving: { userId: ... } in req.user
router.post("/save-article", verifyToken, async (req, res) => {
    try{
        const {article } = req.body;
        const userId = req.user.userId;
        if(!userId){
            return res.status(400).json({ message: "User ID was not provided in the token"});
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found in database" }); 
        }
        user.savedArticles.push(article);
        await user.save();
        res.status(200).json({ message: "Article saved successfully", article });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
  // Save logic here
});





// pass in the headers : Authorization: Bearer <token>
//                       content-type: application/json
// in the body pass { articleUrl: "url-to-unsave" }     

// verifyToken will verify and decode the token, giving: { userId: ... } in req.user
router.post("/unsave-article", verifyToken, async (req, res) => {
    try {
      const { articleUrl } = req.body;
      const userId = req.user.userId;

      if (!userId) {
        return res
          .status(400)
          .json({ message: "User ID was not provided in the token" });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found in database" });
      }

      console.log("ArticleUrl from request:", articleUrl); // ← ADD THIS
      console.log("Saved articles BEFORE filter:", user.savedArticles); // ← ADD THIS

      user.savedArticles = user.savedArticles.filter(
        (article) => article.url !== articleUrl,
      );

      console.log("Saved articles AFTER filter:", user.savedArticles); // ← ADD THIS

      await user.save();

      res
        .status(200)
        .json({ message: "Article unsaved successfully", articleUrl });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
})


export default router;