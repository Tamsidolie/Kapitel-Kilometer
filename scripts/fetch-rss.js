
const Parser = require("rss-parser");
const fs = require("fs");
const path = require("path");

const parser = new Parser();

const RSS_URL = "https://anchor.fm/s/11531c5ac/podcast/rss";

async function main() {
  const feed = await parser.parseURL(RSS_URL);

  const episodes = feed.items.map(item => ({
    title: item.title || "",
    description: item.contentSnippet || item.content || "",
    pubDate: item.pubDate || "",
    link: item.link || "",
    guid: item.guid || item.link || "",
    links: {
      spotify: "",
      apple: "",
      pocketcasts: "",
      amazon: ""
    }
  }));

  const outputPath = path.join(
    __dirname,
    "..",
    "data",
    "episodes.json"
  );

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  fs.writeFileSync(
    outputPath,
    JSON.stringify(episodes, null, 2)
  );

  console.log(`✓ ${episodes.length} Folgen gespeichert.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});