(function () {
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
    if (btn) btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
  }

  // Load saved theme (default: dark)
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (saved === "light" || saved === "dark") setTheme(saved);
  else setTheme("dark");

  if (!btn) return;

  btn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";
    setTheme(current === "dark" ? "light" : "dark");
  });
})();
