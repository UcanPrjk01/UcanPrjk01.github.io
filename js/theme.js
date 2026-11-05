/* UcanPrjk01 - theme persistence (dark default, light optional) */
(function () {
  var KEY = "ucanprjk01-theme";
  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#faf8ff" : "#0d0a17");
  }
  function toggle() {
    var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    apply(next);
    try { localStorage.setItem(KEY, next); } catch (e) { /* storage unavailable */ }
    return next;
  }
  apply(stored() === "light" ? "light" : "dark");
  window.UcanTheme = { toggle: toggle, apply: apply };
})();
