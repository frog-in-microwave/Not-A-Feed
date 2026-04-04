


// this function loades 10 articles for a given topic, using the Wikipedia API and the topicIndex 
// to determine at what index to start loading
const loadArticlesForTopic = async (topic) => {
  let topicIndex = Math.floor(Math.random() * 10000);
  console.log(topicIndex);
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&srlimit=10&sroffset=${topicIndex}&format=json&origin=*`;


    const response = await fetch(url, {
        headers: {
            "User-Agent": "NotAFeed/1.0 (yousef.abdallah.lbx@gmail.com)"
        }
    });

    
    // awaiting the response and parsing it as JSON
    const data = await response.json();



    // console.log("✅ Parsed data:", JSON.stringify(data));


    // the search containes all the articles returned with the response.
    // we map over the search results and return an array of articles with the title, url, snippet and topic for each article.
    //this is done to take only what we need from the response and to format it in a way that is easier to work with in the frontend.
    return data.query.search.map((item) => ({
      title: item.title,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
      snippet: limitText(item.snippet.replace(/<[^>]*>/g, "")),          // remove HTML tags from the snippet
      topic: topic,
    }));
  } catch (error) {
    console.log("❌ Error loading articles for topic:", error);
    return [];
  }
};


// this function only makes the snippet shorter to fit in the card, it takes the snippet and limits it to 80 characters, 
// if the snippet is longer than 80 characters it adds "..." at the end of the snippet.
const limitText = (text, maxLength = 80) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};



// this function loads the articles for all the topics in the user's topic list, it uses the loadArticlesForTopic function to load 
// the articles for each topic and then combines all the articles into one array, 
// it also shuffles the articles to make sure that the articles from different topics are mixed together.
export const loadMixedArticles = async (user) => {
    try{
        const articlePromises = user.topicList.map((topic) => {
            return loadArticlesForTopic(topic);
        });

        const articlesByTopic = await Promise.all(articlePromises);
        const MixedArticles = articlesByTopic.flat();

        for(let i = MixedArticles.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [MixedArticles[i], MixedArticles[j]] = [MixedArticles[j], MixedArticles[i]];
        }
        console.log("✅ Loaded mixed articles:", MixedArticles[0]);
        return MixedArticles;
    }
    catch (error) {
        console.log("❌ Error loading mixed articles:", error);
        return [];
    }
}