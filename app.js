
async function loadEpisodes() {
  const container = document.getElementById("episodes");

  try {
    const response = await fetch("data/episodes.json");

    if (!response.ok) {
      throw new Error("Episodes konnten nicht geladen werden.");
    }

    const episodes = await response.json();

    if (!episodes.length) {
      container.innerHTML = "<p>Noch keine Folgen vorhanden.</p>";
      return;
    }

    container.innerHTML = episodes.map((episode, index) => {
      const description = stripHtml(episode.description || "");

      return `
        <article class="episode">
          <div class="episode-number">
            ${String(index + 1).padStart(2, "0")}
          </div>

          <div>
            <div class="episode-date">${formatDate(episode.pubDate)}</div>
            <h3>${escapeHtml(episode.title)}</h3>
            <p class="episode-description">
              ${escapeHtml(description.slice(0, 220))}
              ${description.length > 220 ? "…" : ""}
            </p>
          </div>

          <div class="episode-links">
            <a class="platform-link" href="${episode.links?.spotify || episode.link}" target="_blank" rel="noopener">
              Spotify
            </a>
            <a class="platform-link" href="${episode.links?.apple || episode.link}" target="_blank" rel="noopener">
              Apple Podcasts
            </a>
            <a class="platform-link" href="${episode.links?.pocketcasts || episode.link}" target="_blank" rel="noopener">
              Pocket Casts
            </a>
          </div>
        </article>
      `;
    }).join("");

  } catch (error) {
    container.innerHTML =
      "<p>Die Folgen konnten momentan nicht geladen werden.</p>";
    console.error(error);
  }
}

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

loadEpisodes();