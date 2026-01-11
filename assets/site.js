(function () {
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");
  const STORAGE_KEY = "bg_theme";

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (btn) btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
  }

  function getPreferredTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch (_) {}

    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    return prefersLight ? "light" : "dark";
  }

  // init
  setTheme(getPreferredTheme());

  if (btn) {
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      setTheme(current === "light" ? "dark" : "light");
    });
  }
})();
