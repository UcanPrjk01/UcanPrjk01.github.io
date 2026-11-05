/* UcanPrjk01 - documentation viewer: sidebar, search, TOC, code blocks, callouts, prev/next */
(function () {
  var navBox = document.getElementById("docs-nav-list");
  var article = document.getElementById("docs-article");
  if (!navBox || !article) return;
  var D = window.UcanData, S = window.UcanSearch, E = D.el;
  var tocBox = document.getElementById("docs-toc");
  var wrap = document.getElementById("docs-nav-wrap");
  var articles = [], current = null;

  /* Tiny highlighter: comments, strings, numbers, a few keywords. Output is built with DOM nodes. */
  var KW = "if|then|else|fi|for|do|done|while|case|esac|in|function|return|sudo|cd|echo|export|val|var|fun|class|import|const|let|true|false|null";
  var TOKEN = new RegExp("(#.*$|\\/\\/.*$)|(\"(?:[^\"\\\\]|\\\\.)*\"|'[^']*')|\\b(\\d+(?:\\.\\d+)*)\\b|\\b(" + KW + ")\\b", "gm");
  function highlight(code) {
    var frag = document.createDocumentFragment(), last = 0, m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(code)) !== null) {
      if (m.index > last) frag.appendChild(document.createTextNode(code.slice(last, m.index)));
      var cls = m[1] ? "tok-c" : m[2] ? "tok-s" : m[3] ? "tok-n" : "tok-k";
      frag.appendChild(E("span", { class: cls, text: m[0] }));
      last = m.index + m[0].length;
      if (m[0].length === 0) TOKEN.lastIndex++;
    }
    if (last < code.length) frag.appendChild(document.createTextNode(code.slice(last)));
    return frag;
  }
  function inline(text) {
    var out = [], parts = String(text).split("`");
    parts.forEach(function (p, i) { if (p) out.push(i % 2 ? E("code", { text: p }) : p); });
    return out;
  }
  function slug(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  function block(b, headings) {
    switch (b.type) {
      case "p": return E("p", null, inline(b.text));
      case "h2": case "h3":
        var h = E(b.type, { id: slug(b.text), text: b.text });
        if (b.type === "h2") headings.push(h);
        return h;
      case "list": case "olist":
        return E(b.type === "olist" ? "ol" : "ul", null, (b.items || []).map(function (i) { return E("li", null, inline(i)); }));
      case "callout":
        var warn = b.tone === "warning";
        return E("div", { class: "callout " + (warn ? "callout-warning" : "callout-info"), role: "note" }, [
          E("strong", { text: warn ? "Warning" : "Note" }), E("p", null, inline(b.text))
        ]);
      case "code":
        var pre = E("pre", null, [E("code")]);
        pre.firstChild.appendChild(highlight(String(b.text || "")));
        var copy = E("button", { type: "button", class: "btn btn-sm", text: "Copy", "data-copy": String(b.text || "") });
        return E("div", { class: "codeblock" }, [E("div", { class: "codeblock-bar" }, [E("span", { text: b.lang || "text" }), copy]), pre]);
      default: return null;
    }
  }

  function renderArticle(a) {
    current = a;
    D.clear(article);
    var headings = [];
    article.appendChild(E("h1", { text: a.title }));
    if (a.summary) article.appendChild(E("p", { text: a.summary }));
    (a.content || []).forEach(function (b) { var n = block(b, headings); if (n) article.appendChild(n); });

    var i = articles.indexOf(a), prev = articles[i - 1], next = articles[i + 1];
    var pager = E("nav", { class: "docs-pager", "aria-label": "Article navigation" });
    function pl(x, dir) {
      var link = E("a", { href: "#" + x.id, class: dir }, [E("small", { text: dir === "next" ? "Next" : "Previous" }), x.title]);
      return link;
    }
    if (prev) pager.appendChild(pl(prev, "prev"));
    if (next) pager.appendChild(pl(next, "next"));
    if (prev || next) article.appendChild(pager);

    D.clear(tocBox);
    if (headings.length > 1) {
      tocBox.appendChild(E("h2", { text: "On this page" }));
      tocBox.appendChild(E("ul", null, headings.map(function (h) {
        return E("li", null, [E("a", { href: "#" + a.id, "data-target": h.id, text: h.textContent })]);
      })));
    }
    Array.prototype.forEach.call(navBox.querySelectorAll("a"), function (l) {
      if (l.getAttribute("data-id") === a.id) l.setAttribute("aria-current", "page"); else l.removeAttribute("aria-current");
    });
    document.title = a.title + " | Documentation | UcanPrjk01";
  }
  /* TOC links scroll without changing the hash route. */
  tocBox.addEventListener("click", function (e) {
    var l = e.target.closest("a[data-target]");
    if (!l) return;
    e.preventDefault();
    var t = document.getElementById(l.getAttribute("data-target"));
    if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  function route(scroll) {
    var id = decodeURIComponent(window.location.hash.slice(1));
    var a = articles.filter(function (x) { return x.id === id; })[0] || articles[0];
    renderArticle(a);
    if (scroll) window.scrollTo({ top: 0 });
    if (wrap && window.matchMedia("(max-width: 900px)").matches) wrap.open = false;
  }

  function buildNav(query) {
    D.clear(navBox);
    var cats = [];
    articles.forEach(function (a) { if (cats.indexOf(a.category) === -1) cats.push(a.category); });
    var found = 0;
    cats.forEach(function (c) {
      var items = articles.filter(function (a) {
        return a.category === c && S.matches(query, [a.title, a.category, a.summary, a.text]);
      });
      if (!items.length) return;
      found += items.length;
      navBox.appendChild(E("h2", { text: c }));
      navBox.appendChild(E("ul", null, items.map(function (a) {
        var l = E("a", { href: "#" + a.id, "data-id": a.id, text: a.title });
        if (current && current.id === a.id) l.setAttribute("aria-current", "page");
        return E("li", null, [l]);
      })));
    });
    if (!found) navBox.appendChild(E("p", { class: "result-count", role: "status", text: "No articles match your search." }));
  }

  function setupDetails() {
    if (!wrap) return;
    var mq = window.matchMedia("(max-width: 900px)");
    function sync() { wrap.open = !mq.matches; }
    sync();
    if (mq.addEventListener) mq.addEventListener("change", sync);
  }

  D.state(article, "loading", "Loading documentation", "");
  D.load("documentation").then(function (data) {
    articles = (Array.isArray(data.articles) ? data.articles : []).filter(function (a) { return a && a.id && a.title; }).map(function (a) {
      var text = (a.content || []).map(function (b) { return (b.text || "") + " " + (b.items || []).join(" "); }).join(" ");
      a.category = D.str(a.category) || "General"; a.summary = D.str(a.summary); a.text = text;
      return a;
    });
    if (!articles.length) {
      D.state(article, "empty", "No documentation yet", "Add articles to data/documentation.json.");
      return;
    }
    buildNav("");
    route(false);
    S.bind(document.getElementById("docs-search"), buildNav);
    window.addEventListener("hashchange", function () { route(true); });
    setupDetails();
  }).catch(function () {
    D.state(article, "error", "Could not load documentation", "The data file failed to load. Serve the folder over HTTP or use GitHub Pages.");
  });
})();
