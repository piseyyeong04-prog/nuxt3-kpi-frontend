<template>
  <!-- <VitePwaManifest /> -->
  <NuxtLoadingIndicator color="#089cf4" />
  <!-- Pull to Refresh Wrapper -->
  <!-- <PullToRefresh :on-refresh="handleRefresh" @refresh-start="onRefreshStart" @refresh-end="onRefreshEnd">
  </PullToRefresh>  -->

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

</template>

<script setup lang="ts">
import { useHead } from '#imports'; // Use Nuxt's built-in `useHead` composable
import { onMounted } from 'vue'
import { usePwaInstallPrompt } from '@/composables/usePwaInstallPrompt'
import Swal from 'sweetalert2'
import { useAuthStore } from './store/useAuthStore';

const { isInstallPromptAvailable, promptInstall } = usePwaInstallPrompt()

// Pull to refresh handler
const handleRefresh = async () => {
  console.log('Refreshing app...')

  // Option 1: Full page reload (simplest)
  window.location.reload()

  // Option 2: Refresh current route data (more elegant)
  // await refreshCookie()
  // await navigateTo(useRoute().path, { replace: true })

  // Option 3: Custom refresh logic based on current page
  // const route = useRoute()
  // if (route.name === 'dashboard') {
  //   // Refresh dashboard data
  //   await refreshDashboardData()
  // } else {
  //   // Default refresh
  //   window.location.reload()
  // }
}

const onRefreshStart = () => {
  console.log('Refresh started')
}

const onRefreshEnd = () => {
  console.log('Refresh completed')
}

// onMounted(() => {
//   watchEffect(() => {
//     if (isInstallPromptAvailable.value) {
//       Swal.fire({
//         title: 'Install This App?',
//         text: 'Get the best experience by installing this app on your device.',
//         icon: 'info',
//         imageUrl: '/icon-green-512.png', // ✅ Path to logo (in /public folder)
//         imageWidth: 100,
//         imageHeight: 100,
//         imageAlt: 'Baksey Media Logo',
//         showCancelButton: true,
//         confirmButtonText: 'Install',
//         cancelButtonText: 'Later',
//       })
//         .then((result) => {
//           if (result.isConfirmed) {
//             promptInstall()
//           }
//         })
//     }
//   })
// })
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

// In your app.vue or layout
onMounted(() => {
  const authStore = useAuthStore();
  
  // Check auth status on app load
  authStore.checkAuth();
  
  // Optional: Set up periodic token refresh check (every 30 minutes)
  setInterval(() => {
    if (authStore.shouldRefreshToken()) {
      authStore.refresh();
    }
  }, 30 * 60 * 1000); // 30 minutes
});

onMounted(() => {
  const expiryTimestamp = 1757575136119;
  const expiryDate = new Date(expiryTimestamp);
  const currentDate = new Date();
  console.log("Current time:", currentDate.toLocaleString());
  console.log("Token expires at:", expiryDate.toLocaleString());
});
</script>
