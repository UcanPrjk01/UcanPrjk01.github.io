/* UcanPrjk01 - download center. Buttons only render for real http(s) URLs. */
(function () {
  var box = document.getElementById("download-list");
  if (!box) return;
  var D = window.UcanData, S = window.UcanSearch, E = D.el;

  function clean(d) {
    return {
      file: D.str(d.file), version: D.str(d.version), size: D.str(d.size), date: D.str(d.date),
      platform: D.arr(d.platform), url: D.str(d.url), release: D.str(d.release),
      sha256: D.str(d.sha256).trim().toLowerCase()
    };
  }
  function card(d) {
    var tags = E("div", { class: "tags" }, d.platform.map(function (p) { return E("span", { class: "tag", text: p }); }));
    var main = D.link("Download", d.url, "btn btn-sm btn-primary");
    var head = E("div", { class: "dl-head" }, [
      E("code", { text: d.file }),
      E("div", { class: "card-links" }, [main || E("span", { class: "tag", text: "Link unavailable" }), D.link("GitHub release", d.release)])
    ]);
    var sum;
    if (/^[0-9a-f]{64}$/.test(d.sha256)) {
      var copy = E("button", { type: "button", class: "btn btn-sm", "data-copy": d.sha256, text: "Copy" });
      sum = E("div", { class: "checksum" }, [E("span", { text: "SHA-256" }), E("code", { text: d.sha256 }), copy]);
    } else {
      sum = E("div", { class: "checksum" }, [E("span", { text: "SHA-256" }), E("span", { class: "tag", text: "Not provided" })]);
    }
    return E("article", { class: "card dl-card" }, [
      head, tags, D.metaList([["Version", d.version], ["Size", d.size], ["Released", D.formatDate(d.date)]]), sum
    ]);
  }

  D.state(box, "loading", "Loading downloads", "");
  D.load("downloads").then(function (data) {
    var all = (Array.isArray(data.downloads) ? data.downloads : []).map(clean).filter(function (d) { return d.file; });
    var count = document.getElementById("result-count");
    if (!all.length) {
      D.state(box, "empty", "No downloads published yet", "Add release files to data/downloads.json with real URLs. Nothing is shown until a real link exists.");
      if (count) count.textContent = "";
      return;
    }
    var plats = [];
    all.forEach(function (d) { d.platform.forEach(function (p) { if (plats.indexOf(p) === -1) plats.push(p); }); });
    plats.sort();
    var sel = document.getElementById("platform");
    plats.forEach(function (p) { sel.appendChild(E("option", { value: p, text: p })); });
    var q = "";
    function render() {
      var rows = all.filter(function (d) {
        return (!sel.value || d.platform.indexOf(sel.value) !== -1) && S.matches(q, [d.file, d.version, d.platform.join(" ")]);
      }).sort(function (a, b) { return (b.date || "").localeCompare(a.date || "") || a.file.localeCompare(b.file); });
      if (count) count.textContent = rows.length + (rows.length === 1 ? " file" : " files");
      D.clear(box);
      if (!rows.length) { D.state(box, "empty", "No files match", "Try a different search word or platform."); return; }
      var list = E("div", { class: "dl-list" });
      rows.forEach(function (d) { list.appendChild(card(d)); });
      box.appendChild(list);
    }
    S.bind(document.getElementById("search"), function (v) { q = v; render(); });
    sel.addEventListener("change", render);
    render();
  }).catch(function () {
    D.state(box, "error", "Could not load downloads", "The data file failed to load. Serve the folder over HTTP or use GitHub Pages.");
  });
})();
