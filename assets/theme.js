(function () {
  var THEMES = [["system", "System"], ["light", "Light"], ["dark", "Dark"], ["neon", "Cyberphunk Neon"]];
  var root = document.documentElement;
  var dark = window.matchMedia("(prefers-color-scheme: dark)");

  root.classList.add("js");

  function saved() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }

  function loadNeonFonts() {
    if (document.getElementById("neon-fonts")) return;
    var link = document.createElement("link");
    link.id = "neon-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600&family=Orbitron:wght@500&display=swap";
    document.head.appendChild(link);
  }

  function resolve(choice) {
    if (choice === "system") return dark.matches ? "dark" : "light";
    return choice;
  }

  function paint(choice) {
    var theme = resolve(choice);
    if (theme === "neon") loadNeonFonts();
    root.setAttribute("data-theme", theme);
  }

  var choice = saved();
  if (!THEMES.some(function (t) { return t[0] === choice; })) choice = "system";
  paint(choice);

  // follow the OS while the visitor has not picked a theme
  dark.addEventListener("change", function () {
    if (choice === "system") paint(choice);
  });

  function buildSwitch() {
    var label = document.createElement("label");
    label.className = "theme-switch";
    var text = document.createElement("span");
    text.className = "visually-hidden";
    text.textContent = "Colour theme";
    var select = document.createElement("select");
    THEMES.forEach(function (t) {
      var option = document.createElement("option");
      option.value = t[0];
      option.textContent = t[1];
      select.appendChild(option);
    });
    select.value = choice;
    select.addEventListener("change", function () {
      choice = select.value;
      try { localStorage.setItem("theme", choice); } catch (e) {}
      paint(choice);
    });
    label.appendChild(text);
    label.appendChild(select);
    document.body.appendChild(label);
  }

  function initReveal() {
    var targets = document.querySelectorAll(
      ".concept-title, .concept > section, .entry, .card, .prose > *, .meta, .site-header > .page, .concept-header > .wrap"
    );
    if (!("IntersectionObserver" in window)) return;
    var seen = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        var parent = el.parentElement;
        var n = seen.get(parent) || 0;
        seen.set(parent, n + 1);
        el.style.transitionDelay = Math.min(n, 5) * 80 + "ms";
        el.classList.add("is-in");
        // hand the element back to its own hover and press transitions
        setTimeout(function () {
          el.classList.remove("reveal", "is-in");
          el.style.transitionDelay = "";
        }, 1000 + Math.min(n, 5) * 80 + 100);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    targets.forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildSwitch();
    initReveal();
  });
})();
