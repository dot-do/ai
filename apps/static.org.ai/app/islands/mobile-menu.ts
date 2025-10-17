// Mobile menu island
export default function mobileMenu() {
  const menuButton = document.getElementById('mobile-menu-button')
  const sidebar = document.querySelector('aside.md\\:block')

  if (!menuButton || !sidebar) return

  menuButton.addEventListener('click', () => {
    sidebar.classList.toggle('hidden')
    sidebar.classList.toggle('fixed')
    sidebar.classList.toggle('inset-0')
    sidebar.classList.toggle('z-50')
    sidebar.classList.toggle('bg-background')
  })

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!sidebar.classList.contains('hidden')) {
      const target = e.target as HTMLElement
      if (!sidebar.contains(target) && !menuButton.contains(target)) {
        sidebar.classList.add('hidden')
        sidebar.classList.remove('fixed', 'inset-0', 'z-50', 'bg-background')
      }
    }
  })
}
