import { onMounted } from 'vue'

export function useTrackTraffic() {
  if (import.meta.server) {
    return
  }

  onMounted(() => {
    void $fetch('/api/traffic/track', {
      method: 'POST',
    }).catch(() => {
      // Tracking must not affect the page render path.
    })
  })
}
