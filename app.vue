<template>
  <VitePwaManifest />
  <NuxtLoadingIndicator color="#089cf4" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useHead } from '#imports'; // Use Nuxt's built-in `useHead` composable
import { onMounted } from 'vue'
import { usePwaInstallPrompt } from '@/composables/usePwaInstallPrompt'
import Swal from 'sweetalert2'

const { isInstallPromptAvailable, promptInstall } = usePwaInstallPrompt()

onMounted(() => {
  watchEffect(() => {
    if (isInstallPromptAvailable.value) {
      Swal.fire({
        title: 'Install This App?',
        text: 'Get the best experience by installing this app on your device.',
        icon: 'info',
        imageUrl: '/icon-green-512.png', // ✅ Path to logo (in /public folder)
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Baksey Media Logo',
        showCancelButton: true,
        confirmButtonText: 'Install',
        cancelButtonText: 'Later',
      })
        .then((result) => {
          if (result.isConfirmed) {
            promptInstall()
          }
        })
    }
  })
})
// Add an inline script to set the theme before styles load
useHead({
  script: [
    {
      children: `
        (function() {
          try {
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.classList.add(savedTheme);

            const savedLocale = localStorage.getItem('locale') || 'en';
            document.documentElement.setAttribute('lang', savedLocale);
          } catch (e) {
            console.warn('Error applying theme:', e);
          }
        })();
      `,
      type: 'text/javascript',
    },
  ],
});
</script>
