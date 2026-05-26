export const useThemeStore = {
  applyTheme(theme: string) {
    const root = document.documentElement;
    if (theme === "light") root.setAttribute("data-theme", "light");
    else if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
  },

  get savedTheme() {
    return localStorage.getItem("theme") || "system";
  },

  setTheme(theme: string) {
    localStorage.setItem("theme", theme);
    this.applyTheme(theme);
  },
};
