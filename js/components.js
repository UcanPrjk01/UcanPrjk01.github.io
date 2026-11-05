/* UcanPrjk01 - shared header and footer, injected into #site-header and #site-footer */
(function () {
  var root = document.documentElement.getAttribute("data-root") || "";
  var current = document.documentElement.getAttribute("data-page") || "";
  var GITHUB = "https://github.com/UcanPrjk01";

  var links = [
    { id: "home", label: "Home", href: root + "index.html" },
    { id: "projects", label: "Projects", href: root + "pages/projects.html" },
    { id: "modules", label: "Modules", href: root + "pages/modules.html" },
    { id: "downloads", label: "Downloads", href: root + "pages/downloads.html" },
    { id: "docs", label: "Docs", href: root + "pages/documentation.html" },
    { id: "changelog", label: "Changelog", href: root + "pages/changelog.html" },
    { id: "about", label: "About", href: root + "pages/about.html" },
    { id: "contact", label: "Contact", href: root + "pages/contact.html" }
  ];

  var ICON_GITHUB = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';
  var ICON_THEME = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.39 5.39 0 0 1-4.4 2.26 5.4 5.4 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>';
  var ICON_MENU = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>';

  function buildHeader() {
    var nav = links.map(function (l) {
      var cur = l.id === current ? ' aria-current="page"' : "";
      return '<a href="' + l.href + '"' + cur + ">" + l.label + "</a>";
    }).join("");
    return '<header class="site-header"><div class="container">' +
      '<a class="brand" href="' + root + 'index.html"><img src="' + root + 'assets/mascot/chibi-01.png" alt="" width="36" height="36"><span>UcanPrjk01</span></a>' +
      '<nav class="nav" id="primary-nav" aria-label="Main">' + nav + "</nav>" +
      '<div class="header-actions">' +
      '<a class="btn btn-icon" href="' + GITHUB + '" target="_blank" rel="noopener noreferrer" aria-label="UcanPrjk01 on GitHub">' + ICON_GITHUB + "</a>" +
      '<button class="btn btn-icon" type="button" id="theme-toggle" aria-label="Toggle light and dark theme">' + ICON_THEME + "</button>" +
      '<button class="btn btn-icon menu-toggle" type="button" id="menu-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">' + ICON_MENU + "</button>" +
      "</div></div></header>";
  }

  function buildFooter() {
    var year = new Date().getFullYear();
    return '<footer class="site-footer"><div class="container"><div class="footer-grid">' +
      '<div><a class="brand" href="' + root + 'index.html"><img src="' + root + 'assets/mascot/chibi-01.png" alt="" width="36" height="36" loading="lazy"><span>UcanPrjk01</span></a>' +
      "<p>Android modules, tools and open-source projects, maintained in public on GitHub.</p></div>" +
      '<div><h3>Explore</h3><ul>' +
      '<li><a href="' + root + 'pages/projects.html">Projects</a></li>' +
      '<li><a href="' + root + 'pages/modules.html">Modules</a></li>' +
      '<li><a href="' + root + 'pages/downloads.html">Downloads</a></li>' +
      '<li><a href="' + root + 'pages/documentation.html">Documentation</a></li></ul></div>' +
      '<div><h3>Project</h3><ul>' +
      '<li><a href="' + root + 'pages/changelog.html">Changelog</a></li>' +
      '<li><a href="' + root + 'pages/about.html">About</a></li>' +
      '<li><a href="' + root + 'pages/contact.html">Contact</a></li>' +
      '<li><a href="' + GITHUB + '" target="_blank" rel="noopener noreferrer">GitHub</a></li></ul></div>' +
      '</div><p class="footer-note">&copy; ' + year + " UcanPrjk01. Open-source projects are released under the license stated in each repository.</p></div></footer>" +
      '<div class="scroll-progress" id="scroll-progress" aria-hidden="true"></div>' +
      '<button class="btn btn-icon to-top" type="button" id="to-top" aria-label="Back to top"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l7 7-1.4 1.4L13 8.8V20h-2V8.8l-4.6 4.6L5 12z"/></svg></button>';
  }

  var h = document.getElementById("site-header");
  var f = document.getElementById("site-footer");
  if (h) h.innerHTML = buildHeader();
  if (f) f.innerHTML = buildFooter();

  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", function () { window.UcanTheme.toggle(); });

  var menuBtn = document.getElementById("menu-toggle");
  var nav = document.getElementById("primary-nav");
  if (menuBtn && nav) {
    function setMenu(open) {
      nav.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });
  }
})();
