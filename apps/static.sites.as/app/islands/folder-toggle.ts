// Folder toggle island for navigation tree
export default function folderToggle() {
  const folderButtons = document.querySelectorAll('[data-folder-toggle]')

  folderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const content = button.nextElementSibling as HTMLElement
      const icon = button.querySelector('svg')

      if (!content) return

      // Toggle hidden class
      content.classList.toggle('hidden')

      // Rotate icon
      if (icon) {
        if (content.classList.contains('hidden')) {
          icon.style.transform = 'rotate(0deg)'
        } else {
          icon.style.transform = 'rotate(90deg)'
        }
      }
    })
  })

  // Initialize icon rotation for open folders
  document.querySelectorAll('[data-folder-content]:not(.hidden)').forEach((content) => {
    const button = content.previousElementSibling
    const icon = button?.querySelector('svg')
    if (icon) {
      icon.style.transform = 'rotate(90deg)'
    }
  })
}
