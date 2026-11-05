/* UcanPrjk01 - project directory (projects page) and featured projects (home page) */
(function () {
  var listBox = document.getElementById("project-list");
  var featBox = document.getElementById("featured-projects");
  if (!listBox && !featBox) return;
  var D = window.UcanData, S = window.UcanSearch, E = D.el;

  function clean(p) {
    return {
      name: D.str(p.name), description: D.str(p.description), category: D.str(p.category) || "Other",
      version: D.str(p.version), status: D.str(p.status), devices: D.arr(p.devices), tech: D.arr(p.tech),
      repo: D.str(p.repo), docs: D.str(p.docs), download: D.str(p.download),
      featured: p.featured === true, updated: D.str(p.updated)
    };
  }

  function card(p) {
    var tags = E("div", { class: "tags" }, [E("span", { class: "tag", text: p.category })]);
    if (p.status) tags.appendChild(E("span", { class: "tag tag-status", text: p.status }));
    var links = E("div", { class: "card-links" }, [
      D.link("Repository", p.repo, "btn btn-sm btn-primary"),
      D.link("Docs", p.docs), D.link("Download", p.download)
    ]);
    return E("article", { class: "card item" }, [
      p.featured ? E("span", { class: "featured-flag", text: "Featured" }) : null,
      E("h3", { text: p.name }), tags, E("p", { text: p.description }),
      D.metaList([["Version", p.version], ["Devices", p.devices.join(", ")], ["Built with", p.tech.join(", ")]]),
      links
    ]);
  }

  D.load("projects").then(function (data) {
    var all = (Array.isArray(data.projects) ? data.projects : []).map(clean).filter(function (p) { return p.name; });

    if (featBox && all.length) {
      var pick = all.filter(function (p) { return p.featured; });
      if (!pick.length) pick = all;
      D.clear(featBox);
      var g = E("div", { class: "grid" });
      pick.slice(0, 3).forEach(function (p) { g.appendChild(card(p)); });
      featBox.appendChild(g);
      featBox.classList.remove("card", "pending");
    }
    if (!listBox) return;

    var q = "", cat = "", sort = "featured";
    var count = document.getElementById("result-count");
    var sortSel = document.getElementById("sort");
    var chipBox = document.getElementById("category-filters");

    if (!all.length) {
      D.state(listBox, "empty", "No projects added yet", "Add entries to data/projects.json and they will show up here with search, filters and sorting.");
      if (count) count.textContent = "";
      return;
    }

    var cats = all.map(function (p) { return p.category; }).filter(function (c, i, a) { return a.indexOf(c) === i; }).sort();
    D.chips(chipBox, cats, null, function (v) { cat = v; render(); }, "All categories");

    function render() {
      var rows = all.filter(function (p) {
        return (!cat || p.category === cat) && S.matches(q, [p.name, p.description, p.category, p.status, p.devices.join(" "), p.tech.join(" ")]);
      });
      rows.sort(function (a, b) {
        if (sort === "name-desc") return b.name.localeCompare(a.name);
        if (sort === "newest") return (b.updated || "").localeCompare(a.updated || "") || a.name.localeCompare(b.name);
        if (sort === "name") return a.name.localeCompare(b.name);
        return (b.featured - a.featured) || a.name.localeCompare(b.name);
      });
      if (count) count.textContent = rows.length + (rows.length === 1 ? " project" : " projects");
      D.clear(listBox);
      if (!rows.length) {
        D.state(listBox, "empty", "No projects match", "Try a different search word or choose another category.");
        return;
      }
      var grid = E("div", { class: "grid" });
      rows.forEach(function (p) { grid.appendChild(card(p)); });
      listBox.appendChild(grid);
    }
    S.bind(document.getElementById("search"), function (v) { q = v; render(); });
    if (sortSel) sortSel.addEventListener("change", function () { sort = sortSel.value; render(); });
    render();
  }).catch(function () {
    var target = listBox || featBox;
    D.state(target, "error", "Could not load projects", "The data file failed to load. If you opened this page from disk, serve the folder over HTTP (for example: python -m http.server) or use GitHub Pages.");
  });
  if (listBox) D.state(listBox, "loading", "Loading projects", "");
})();
