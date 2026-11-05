/* UcanPrjk01 - Android modules: list, filters, details dialog, featured modules on home */
(function () {
  var listBox = document.getElementById("module-list");
  var featBox = document.getElementById("featured-modules");
  if (!listBox && !featBox) return;
  var D = window.UcanData, S = window.UcanSearch, E = D.el;
  var LABELS = { magisk: "Magisk", kernelsu: "KernelSU", apatch: "APatch", customization: "Customization" };
  function typeLabel(t) { return LABELS[t] || t || "Other"; }

  function clean(m) {
    return {
      name: D.str(m.name), description: D.str(m.description), type: D.str(m.type).toLowerCase(),
      version: D.str(m.version), compatibility: D.arr(m.compatibility), requirements: D.arr(m.requirements),
      install: D.arr(m.install), changelog: D.arr(m.changelog), repo: D.str(m.repo), download: D.str(m.download),
      featured: m.featured === true
    };
  }

  var dlg = document.getElementById("module-dialog");
  var dlgTitle = document.getElementById("module-dialog-title");
  var dlgBody = document.getElementById("module-dialog-body");

  function section(title, items, ordered) {
    if (!items.length) return null;
    var list = E(ordered ? "ol" : "ul", null, items.map(function (t) { return E("li", { text: t }); }));
    return E("div", null, [E("h3", { text: title }), list]);
  }
  function note(title, text) { return E("div", null, [E("h3", { text: title }), E("p", { text: text })]); }

  function openDetails(m, trigger) {
    if (!dlg) return;
    dlgTitle.textContent = m.name;
    D.clear(dlgBody);
    dlgBody.appendChild(E("p", { text: m.description }));
    dlgBody.appendChild(D.metaList([["Type", typeLabel(m.type)], ["Version", m.version]]));
    dlgBody.appendChild(m.compatibility.length ? section("Compatibility", m.compatibility) : note("Compatibility", "Not specified yet. Check the source repository before installing."));
    dlgBody.appendChild(m.requirements.length ? section("Requirements", m.requirements) : note("Requirements", "Not specified yet."));
    dlgBody.appendChild(m.install.length ? section("Installation", m.install, true) : note("Installation", "Instructions have not been added yet. See the general guide in the documentation."));
    var cl = section("Changelog", m.changelog);
    if (cl) dlgBody.appendChild(cl);
    var links = E("div", { class: "card-links" }, [D.link("Source repository", m.repo, "btn btn-sm btn-primary"), D.link("Download", m.download)]);
    dlgBody.appendChild(links);
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }
  if (dlg) {
    document.getElementById("module-dialog-close").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }

  function card(m) {
    var btn = E("button", { type: "button", class: "btn btn-sm", text: "Details" });
    btn.addEventListener("click", function () { openDetails(m, btn); });
    var tags = E("div", { class: "tags" }, [E("span", { class: "tag tag-status", text: typeLabel(m.type) })]);
    var links = E("div", { class: "card-links" }, [btn, D.link("Source", m.repo), D.link("Download", m.download, "btn btn-sm btn-primary")]);
    return E("article", { class: "card item" }, [
      m.featured ? E("span", { class: "featured-flag", text: "Featured" }) : null,
      E("h3", { text: m.name }), tags, E("p", { text: m.description }),
      D.metaList([["Version", m.version], ["Compatibility", m.compatibility.length ? m.compatibility.join(", ") : "Not specified"]]),
      links
    ]);
  }

  if (listBox) D.state(listBox, "loading", "Loading modules", "");
  D.load("modules").then(function (data) {
    var all = (Array.isArray(data.modules) ? data.modules : []).map(clean).filter(function (m) { return m.name; });
    if (featBox && all.length) {
      var pick = all.filter(function (m) { return m.featured; });
      if (!pick.length) pick = all;
      D.clear(featBox);
      var g = E("div", { class: "grid" });
      pick.slice(0, 3).forEach(function (m) { g.appendChild(card(m)); });
      featBox.appendChild(g);
      featBox.classList.remove("card", "pending");
    }
    if (!listBox) return;
    var q = "", type = "";
    var count = document.getElementById("result-count");
    if (!all.length) {
      D.state(listBox, "empty", "No modules added yet", "Add entries to data/modules.json. Compatibility is shown only when you provide it.");
      if (count) count.textContent = "";
      return;
    }
    var types = all.map(function (m) { return m.type; }).filter(function (t, i, a) { return a.indexOf(t) === i; }).sort();
    D.chips(document.getElementById("type-filters"), types, typeLabel, function (v) { type = v; render(); }, "All types");
    function render() {
      var rows = all.filter(function (m) {
        return (!type || m.type === type) && S.matches(q, [m.name, m.description, typeLabel(m.type), m.compatibility.join(" ")]);
      }).sort(function (a, b) { return (b.featured - a.featured) || a.name.localeCompare(b.name); });
      if (count) count.textContent = rows.length + (rows.length === 1 ? " module" : " modules");
      D.clear(listBox);
      if (!rows.length) { D.state(listBox, "empty", "No modules match", "Try a different search word or type."); return; }
      var grid = E("div", { class: "grid" });
      rows.forEach(function (m) { grid.appendChild(card(m)); });
      listBox.appendChild(grid);
    }
    S.bind(document.getElementById("search"), function (v) { q = v; render(); });
    render();
  }).catch(function () {
    D.state(listBox || featBox, "error", "Could not load modules", "The data file failed to load. Serve the folder over HTTP or use GitHub Pages.");
  });
})();
