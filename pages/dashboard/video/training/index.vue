<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-950/50 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <div class="bg-gradient-to-r from-violet-600 to-purple-600 p-3 rounded-xl">
          <Icon icon="mdi:school-outline" class="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ locale === 'en' ? 'Staff Training' : 'បណ្តុះបណ្តាលបុគ្គលិក' }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ locale === 'en' ? 'Select a course to start learning' : 'ជ្រើសរើសវគ្គសិក្សាដើម្បីចាប់ផ្តើមរៀន' }}
          </p>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600" />
      </div>

      <div v-else-if="folders.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink v-for="folder in folders" :key="folder.id"
          :to="`/dashboard/video/training/${folder.slug}`"
          class="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-violet-500/50 dark:hover:border-violet-500/50 transition-all duration-300">
          <div class="flex items-center gap-4 mb-3">
            <div
              class="bg-violet-100 dark:bg-violet-900/30 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Icon :icon="folder.icon || 'mdi:book-open-page-variant'" class="h-8 w-8 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white text-lg">
                {{ locale === 'en' ? folder.name_en : folder.name_km }}
              </h3>
              <p v-if="folder.description_en || folder.description_km" class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                {{ locale === 'en' ? folder.description_en : folder.description_km }}
              </p>
            </div>
          </div>
          <div class="flex items-center text-sm text-violet-600 dark:text-violet-400 font-medium">
            <span>{{ locale === 'en' ? 'View Chapters' : 'មើលជំពូក' }}</span>
            <Icon icon="mdi:arrow-right" class="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </NuxtLink>
      </div>

      <div v-else class="text-center py-20 text-gray-500 dark:text-gray-400">
        <Icon icon="mdi:book-open-outline" class="h-16 w-16 mx-auto mb-4 opacity-30" />
        <p class="text-lg">{{ locale === 'en' ? 'No training courses available' : 'មិនមានវគ្គបណ្តុះបណ្តាល' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const { getFolders } = useTraining()

const loading = ref(true)
const folders = ref<any[]>([])

onMounted(async () => {
  try {
    folders.value = await getFolders()
  } catch (err) {
    console.error('Failed to load training folders:', err)
  } finally {
    loading.value = false
  }
})
</script>
