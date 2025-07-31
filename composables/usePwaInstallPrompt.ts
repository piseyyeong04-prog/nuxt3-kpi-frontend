// composables/usePwaInstallPrompt.ts
import { ref, onMounted } from 'vue'

export const usePwaInstallPrompt = () => {
  const deferredPrompt = ref<Event | null>(null)
  const isInstallPromptAvailable = ref(false)

  onMounted(() => {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault()
      deferredPrompt.value = e
      isInstallPromptAvailable.value = true
    })
  })

  const promptInstall = async () => {
    if (deferredPrompt.value) {
      const promptEvent = deferredPrompt.value as any
      await promptEvent.prompt()
      const result = await promptEvent.userChoice
      if (result.outcome === 'accepted') {
        console.log('✅ PWA installed')
      } else {
        console.log('❌ PWA installation declined')
      }
      deferredPrompt.value = null
      isInstallPromptAvailable.value = false
    }
  }

  return {
    isInstallPromptAvailable,
    promptInstall,
  }
}
