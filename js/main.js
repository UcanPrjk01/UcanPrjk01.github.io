/* UcanPrjk01 - global behaviour: scroll progress, back-to-top, reveal, copy buttons */
(function () {
  var progress = document.getElementById("scroll-progress");
  var toTop = document.getElementById("to-top");
  var ticking = false;

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    if (progress) progress.style.transform = "scaleX(" + ratio + ")";
    if (toTop) toTop.classList.toggle("visible", window.scrollY > 600);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0 }); });

  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Copy buttons: <button data-copy="text"> or data-copy-target="#id" */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy], [data-copy-target]");
    if (!btn) return;
    var text = btn.getAttribute("data-copy");
    if (text === null) {
      var target = document.querySelector(btn.getAttribute("data-copy-target"));
      text = target ? target.textContent : "";
    }
    var original = btn.textContent;
    function done(ok) {
      btn.textContent = ok ? "Copied" : "Copy failed";
      setTimeout(function () { btn.textContent = original; }, 1500);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      done(ok);
    }
  });
})();
