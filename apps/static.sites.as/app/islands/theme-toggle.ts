// Theme toggle island
export default function themeToggle() {
  const toggleButton = document.getElementById('theme-toggle')
  if (!toggleButton) return

  // Initialize theme from localStorage or system preference
  const initTheme = () => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark')

    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  }

  initTheme()
  toggleButton.addEventListener('click', toggleTheme)
}
