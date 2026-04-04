




let parseArticles = async (article) => {
let url = `https://en.wikipedia.org/w/api.php?action=parse&page=${article.title}&format=json&origin=*`;
try {
    const response = await fetch(url, {
        headers: {
        'User-Agent': 'NotAFeed/1.0 (yousef.abdallah.lbx@gmail.com)'
        }
    });

    const data = await response.json();
    
    console.log("✅ Parsed article correctly");
    return cleanHTML(data.parse.text["*"]);
}catch (error) {
    console.log("❌ Error parsing article:", error);
}
}
export default parseArticles;

const cleanHTML = (html) => {
  let cleaned = html;

  // 1. Remove edit sections (multiple patterns)
  cleaned = cleaned.replace(/<span class="mw-editsection">.*?<\/span>/gs, "");
  cleaned = cleaned.replace(
    /<span class="mw-editsection-bracket">.*?<\/span>/gs,
    "",
  );

  // 2. Remove edit links with all their content
  cleaned = cleaned.replace(/<a[^>]*mw-editsection[^>]*>.*?<\/a>/gs, "");

  // 3. Remove any remaining "[edit]" or "edit" text patterns
  cleaned = cleaned.replace(/\[edit\]/gi, "");
  cleaned = cleaned.replace(/\[ edit \]/gi, "");
  cleaned = cleaned.replace(/\(\s*edit\s*\)/gi, ""); // (edit)

  // 4. ✅ Remove standalone "edit" that appears after headings
  cleaned = cleaned.replace(/(<\/h[1-6]>)\s*edit\s*/gi, "$1"); // After headings
  cleaned = cleaned.replace(/\bedit\b(?=\s*<\/)/gi, ""); // Before closing tags

  // 5. Remove reference numbers [1], [2]
  cleaned = cleaned.replace(/<sup.*?class="reference".*?<\/sup>/gs, "");

  // 6. Fix image URLs
  cleaned = cleaned.replace(/src="\/\//g, 'src="https://');
  cleaned = cleaned.replace(/srcset="\/\//g, 'srcset="https://');

  // 7. Fix internal links
  cleaned = cleaned.replace(
    /href="\/wiki\//g,
    'href="https://en.wikipedia.org/wiki/',
  );

  // 8. Remove info boxes
  cleaned = cleaned.replace(/<table class="infobox.*?<\/table>/gs, "");

  // 9. Remove navigation boxes
  cleaned = cleaned.replace(/<table class="navbox.*?<\/table>/gs, "");

  return cleaned;
};

