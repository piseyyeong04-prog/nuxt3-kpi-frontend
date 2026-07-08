<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-950/50 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
    <div class="max-w-7xl mx-auto space-y-6">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600" />
      </div>

      <template v-else-if="folder">
        <NuxtLink to="/dashboard/video/training"
          class="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-2">
          <Icon icon="mdi:arrow-left" class="mr-1 h-4 w-4" />
          {{ locale === 'en' ? 'Back to Courses' : 'ត្រឡប់ទៅវគ្គសិក្សា' }}
        </NuxtLink>

        <div class="flex items-center gap-3">
          <div class="bg-gradient-to-r from-violet-600 to-purple-600 p-3 rounded-xl">
            <Icon :icon="folder.icon || 'mdi:book-open-page-variant'" class="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ locale === 'en' ? folder.name_en : folder.name_km }}
            </h1>
            <p v-if="folder.description_en || folder.description_km" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ locale === 'en' ? folder.description_en : folder.description_km }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div v-for="(chapter, index) in chapters" :key="chapter.id"
            class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-violet-500/30 dark:hover:border-violet-500/30 transition-all duration-300 overflow-hidden">
            <NuxtLink :to="`/dashboard/video/training/${route.params.folder}/${chapter.slug}`" class="block p-6">
              <div class="flex items-start gap-4">
                <div
                  class="bg-violet-100 dark:bg-violet-900/30 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-violet-600 dark:text-violet-400 font-bold text-sm">{{ index + 1 }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 dark:text-white text-lg">
                    {{ locale === 'en' ? chapter.title_en : chapter.title_km }}
                  </h3>
                  <p v-if="chapter.description_en || chapter.description_km" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {{ locale === 'en' ? chapter.description_en : chapter.description_km }}
                  </p>
                </div>
                <Icon icon="mdi:chevron-right" class="h-5 w-5 text-gray-400 flex-shrink-0 mt-2" />
              </div>
            </NuxtLink>
          </div>
        </div>

        <div v-if="!loading && chapters.length === 0" class="text-center py-20 text-gray-500 dark:text-gray-400">
          <Icon icon="mdi:book-open-outline" class="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p class="text-lg">{{ locale === 'en' ? 'No chapters yet' : 'មិនទាន់មានជំពូក' }}</p>
        </div>
      </template>

      <div v-else class="text-center py-20 text-gray-500 dark:text-gray-400">
        <Icon icon="mdi:alert-circle-outline" class="h-16 w-16 mx-auto mb-4 opacity-30" />
        <p class="text-lg">{{ locale === 'en' ? 'Course not found' : 'រកមិនឃើញវគ្គសិក្សា' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const route = useRoute()
const { getFolderBySlug, getChaptersByFolder } = useTraining()

const loading = ref(true)
const folder = ref<any>(null)
const chapters = ref<any[]>([])

const fetchData = async () => {
  loading.value = true
  try {
    const slug = route.params.folder as string
    const [folderData, chaptersData] = await Promise.all([
      getFolderBySlug(slug),
      getChaptersByFolder(slug),
    ])
    folder.value = folderData
    chapters.value = chaptersData
  } catch (err) {
    console.error('Failed to load folder:', err)
  } finally {
    loading.value = false
  }
}

watch(() => route.params.folder, fetchData, { immediate: true })
</script>
