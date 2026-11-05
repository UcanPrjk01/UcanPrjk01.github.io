/* UcanPrjk01 - shared helpers: safe DOM building, JSON loading, URL validation, states */
(function () {
  var root = document.documentElement.getAttribute("data-root") || "";
  var D = { root: root };

  /* Build an element. Text is always set with textContent, never innerHTML. */
  D.el = function (tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "text") n.textContent = v;
      else if (k === "class") n.className = v;
      else n.setAttribute(k, v === true ? "" : v);
    });
    (kids || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return n;
  };
  D.clear = function (n) { while (n.firstChild) n.removeChild(n.firstChild); };

  /* Only http(s) URLs are ever used as links. */
  D.safeUrl = function (u) {
    if (typeof u !== "string" || !u) return null;
    try {
      var x = new URL(u, window.location.href);
      return x.protocol === "https:" || x.protocol === "http:" ? x.href : null;
    } catch (e) { return null; }
  };
  D.link = function (label, url, cls) {
    var href = D.safeUrl(url);
    if (!href) return null;
    return D.el("a", { class: cls || "btn btn-sm", href: href, target: "_blank", rel: "noopener noreferrer", text: label });
  };

  D.load = function (name) {
    return fetch(root + "data/" + name + ".json", { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  };

  D.arr = function (v) { return Array.isArray(v) ? v.filter(function (x) { return typeof x === "string" && x; }) : []; };
  D.str = function (v) { return typeof v === "string" ? v : ""; };

  D.formatDate = function (s) {
    if (!s) return "";
    var d = new Date(s + "T00:00:00");
    return isNaN(d.getTime()) ? s : d.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
  };

  /* kind: loading | empty | error */
  D.state = function (container, kind, title, text, linkEl) {
    D.clear(container);
    var box = D.el("div", { class: "card pending", role: kind === "error" ? "alert" : "status" });
    if (kind === "loading") box.appendChild(D.el("div", { class: "loader", "aria-hidden": "true" }));
    if (title) box.appendChild(D.el("h3", { text: title }));
    if (text) box.appendChild(D.el("p", { text: text }));
    if (linkEl) box.appendChild(linkEl);
    container.appendChild(box);
  };

  D.metaList = function (rows) {
    var dl = D.el("dl", { class: "meta" });
    rows.forEach(function (r) {
      if (!r[1]) return;
      dl.appendChild(D.el("dt", { text: r[0] }));
      dl.appendChild(D.el("dd", { text: r[1] }));
    });
    return dl;
  };

  D.chips = function (container, values, labelFn, onPick, allLabel) {
    D.clear(container);
    var active = "";
    function mk(value, label) {
      var b = D.el("button", { type: "button", class: "chip-btn", "aria-pressed": value === active ? "true" : "false", text: label });
      b.addEventListener("click", function () {
        active = value;
        Array.prototype.forEach.call(container.children, function (c) { c.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        onPick(value);
      });
      return b;
    }
    container.appendChild(mk("", allLabel || "All"));
    values.forEach(function (v) { container.appendChild(mk(v, labelFn ? labelFn(v) : v)); });
  };

  window.UcanData = D;
})();
