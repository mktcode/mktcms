export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sky',
      neutral: 'zinc'
    },
    navigationMenu: {
      slots: {
        linkLabel: 'hidden md:inline'
      }
    },
    carousel: {
      variants: {
        active: {
          true: {
            dot: '!bg-(--color-primary-500)',
          }
        }
      }
    }
  }
})
