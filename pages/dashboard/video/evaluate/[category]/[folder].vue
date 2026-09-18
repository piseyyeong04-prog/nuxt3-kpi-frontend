<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-950/50 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
    <div class="max-w-7xl mx-auto space-y-6">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>

      <template v-else-if="folder">
        <div class="flex items-center gap-3">
          <div class="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-xl">
            <Icon icon="mdi:account-tie" class="h-6 w-6 text-white" />
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

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="video in videos" :key="video.id"
            class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div class="aspect-video">
              <div style="padding:56.25% 0 0 0;position:relative;">
                <iframe
                  :src="`https://player.vimeo.com/video/${video.vimeo_video_id}?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`"
                  frameborder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  style="position:absolute;top:0;left:0;width:100%;height:100%;"
                  :title="(locale === 'en' ? video.title_en : video.title_km) || 'Video'">
                </iframe>
              </div>
            </div>
            <div v-if="video.title_en || video.title_km" class="p-4 border-t border-gray-100 dark:border-gray-800">
              <h3 class="font-medium text-gray-900 dark:text-white">
                {{ locale === 'en' ? video.title_en : video.title_km }}
              </h3>
              <p v-if="video.description_en || video.description_km" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ locale === 'en' ? video.description_en : video.description_km }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="!loading && videos.length === 0" class="text-center py-20 text-gray-500 dark:text-gray-400">
          <Icon icon="mdi:video-off-outline" class="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p class="text-lg">{{ locale === 'en' ? 'No videos found' : 'រកមិនឃើញវីដេអូ' }}</p>
        </div>
      </template>

      <div v-else class="text-center py-20 text-gray-500 dark:text-gray-400">
        <Icon icon="mdi:alert-circle-outline" class="h-16 w-16 mx-auto mb-4 opacity-30" />
        <p class="text-lg">{{ locale === 'en' ? 'Folder not found' : 'រកមិនឃើញថតឯកសារ' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const route = useRoute()
const { getFolderBySlug, getVideosByFolder } = useVideoEvaluate()

const loading = ref(true)
const folder = ref<any>(null)
const videos = ref<any[]>([])

const fetchData = async () => {
  loading.value = true
  try {
    const categorySlug = route.params.category as string
    const folderSlug = route.params.folder as string
    const [folderData, videoData] = await Promise.all([
      getFolderBySlug(categorySlug, folderSlug),
      getVideosByFolder(folderSlug),
    ])
    folder.value = folderData
    videos.value = videoData
  } catch (err) {
    console.error('Failed to load folder:', err)
  } finally {
    loading.value = false
  }
}

watch(() => [route.params.category, route.params.folder], fetchData, { immediate: true })
</script>
