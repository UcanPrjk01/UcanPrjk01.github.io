/* UcanPrjk01 - changelog page and "latest updates" on the home page */
(function () {
  var box = document.getElementById("changelog-list");
  var latest = document.getElementById("latest-updates");
  if (!box && !latest) return;
  var D = window.UcanData, E = D.el;

  function clean(c) {
    return {
      project: D.str(c.project), version: D.str(c.version), date: D.str(c.date),
      added: D.arr(c.added), improved: D.arr(c.improved), fixed: D.arr(c.fixed), breaking: D.arr(c.breaking)
    };
  }
  function group(title, items, cls) {
    if (!items.length) return null;
    return E("div", { class: cls || "" }, [E("h3", { text: title }), E("ul", null, items.map(function (t) { return E("li", { text: t }); }))]);
  }
  function release(c) {
    var title = (c.project ? c.project + " " : "") + (c.version ? "v" + c.version.replace(/^v/i, "") : "");
    return E("article", { class: "release" }, [
      E("h2", { text: title.trim() || "Release" }),
      E("p", { class: "release-meta", text: D.formatDate(c.date) }),
      group("Added", c.added), group("Improved", c.improved), group("Fixed", c.fixed), group("Breaking changes", c.breaking, "breaking")
    ]);
  }

  if (box) D.state(box, "loading", "Loading changelog", "");
  D.load("changelog").then(function (data) {
    var all = (Array.isArray(data.changelog) ? data.changelog : []).map(clean)
      .sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });

    if (latest && all.length) {
      D.clear(latest);
      all.slice(0, 3).forEach(function (c) { latest.appendChild(release(c)); });
      latest.classList.remove("card", "pending");
    }
    if (!box) return;
    if (!all.length) {
      D.state(box, "empty", "No releases recorded yet", "Add entries to data/changelog.json. Each entry can list added, improved, fixed and breaking changes.");
      return;
    }
    var sel = document.getElementById("project-filter");
    var projects = all.map(function (c) { return c.project; }).filter(function (p, i, a) { return p && a.indexOf(p) === i; }).sort();
    projects.forEach(function (p) { sel.appendChild(E("option", { value: p, text: p })); });
    function render() {
      var rows = all.filter(function (c) { return !sel.value || c.project === sel.value; });
      D.clear(box);
      rows.forEach(function (c) { box.appendChild(release(c)); });
    }
    sel.addEventListener("change", render);
    render();
  }).catch(function () {
    D.state(box || latest, "error", "Could not load changelog", "The data file failed to load. Serve the folder over HTTP or use GitHub Pages.");
  });
})();
