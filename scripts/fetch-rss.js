
const Parser = require("rss-parser");
const fs = require("fs");
const path = require("path");

const parser = new Parser();

const RSS_URL = "https://anchor.fm/s/11531c5ac/podcast/rss";
const existingEpisodesPath = path.join(__dirname, "..", "data", "episodes.json");

function loadExistingLinks() {
  if (!fs.existsSync(existingEpisodesPath)) {
    return new Map();
  }

  const episodes = JSON.parse(fs.readFileSync(existingEpisodesPath, "utf8"));
  return new Map(episodes.map(episode => [episode.guid, episode.links || {}]));
}

async function main() {
  const feed = await parser.parseURL(RSS_URL);
  const existingLinks = loadExistingLinks();

  const episodes = feed.items.map(item => ({
    title: item.title || "",
    description: item.contentSnippet || item.content || "",
    pubDate: item.pubDate || "",
    link: item.link || "",
    guid: item.guid || item.link || "",
    links: existingLinks.get(item.guid || item.link) || {}
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