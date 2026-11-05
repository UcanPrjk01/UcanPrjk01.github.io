/* UcanPrjk01 - live repository list from the public GitHub API (no key, cached for 10 minutes) */
(function () {
  var box = document.getElementById("github-repos");
  if (!box) return;
  var D = window.UcanData, E = D.el;
  var USER = "UcanPrjk01";
  var URL_API = "https://api.github.com/users/" + USER + "/repos?sort=updated&per_page=" + (box.getAttribute("data-limit") || "6");
  var CACHE = "ucanprjk01-gh-repos", TTL = 10 * 60 * 1000;

  function fromCache() {
    try {
      var c = JSON.parse(sessionStorage.getItem(CACHE) || "null");
      if (c && Date.now() - c.t < TTL && Array.isArray(c.d)) return c.d;
    } catch (e) { /* ignore */ }
    return null;
  }
  function toCache(d) { try { sessionStorage.setItem(CACHE, JSON.stringify({ t: Date.now(), d: d })); } catch (e) { /* ignore */ } }

  function render(repos) {
    D.clear(box);
    var shown = repos.filter(function (r) { return r && typeof r.name === "string" && !r.fork; });
    if (!shown.length) {
      D.state(box, "empty", "No public repositories yet", "Repositories will appear here once they are public on GitHub.", D.link("Open GitHub profile", "https://github.com/" + USER, "btn btn-sm"));
      return;
    }
    var grid = E("div", { class: "grid" });
    shown.forEach(function (r) {
      var card = E("article", { class: "card item" }, [
        E("h3", { text: r.name }),
        E("p", { text: D.str(r.description) || "No description provided." }),
        D.metaList([["Language", D.str(r.language)], ["Stars", String(r.stargazers_count || 0)], ["Updated", D.formatDate(D.str(r.pushed_at).slice(0, 10))]]),
        E("div", { class: "card-links" }, [D.link("View repository", r.html_url, "btn btn-sm btn-primary")])
      ]);
      grid.appendChild(card);
    });
    box.appendChild(grid);
  }

  D.state(box, "loading", "Loading repositories", "Fetching the latest list from GitHub.");
  var cached = fromCache();
  if (cached) { render(cached); return; }
  fetch(URL_API, { headers: { Accept: "application/vnd.github+json" } })
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(function (d) { if (!Array.isArray(d)) throw new Error("Unexpected response"); toCache(d); render(d); })
    .catch(function () {
      D.state(box, "error", "Could not load repositories", "GitHub did not respond, or its anonymous rate limit was reached. Try again in a few minutes.", D.link("Open GitHub profile", "https://github.com/" + USER, "btn btn-sm"));
    });
})();
