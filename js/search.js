/* UcanPrjk01 - search helpers shared by projects, modules, downloads and docs */
(function () {
  var S = {};
  S.debounce = function (fn, ms) {
    var t;
    return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms || 120); };
  };
  /* Every word in the query must appear somewhere in the haystack. */
  S.matches = function (query, fields) {
    var words = String(query || "").toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return true;
    var hay = fields.join(" ").toLowerCase();
    return words.every(function (w) { return hay.indexOf(w) !== -1; });
  };
  S.bind = function (input, onChange) {
    if (!input) return;
    input.addEventListener("input", S.debounce(function () { onChange(input.value); }, 120));
  };
  /* Press "/" to focus the page search box. */
  document.addEventListener("keydown", function (e) {
    var t = e.target, typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
    if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
      var box = document.querySelector('input[type="search"]');
      if (box) { e.preventDefault(); box.focus(); }
    }
  });
  window.UcanSearch = S;
})();
