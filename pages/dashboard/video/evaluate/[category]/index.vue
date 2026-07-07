<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-950/50 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
    <div class="max-w-7xl mx-auto space-y-6">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>

      <template v-else-if="category">
        <div class="flex items-center gap-3">
          <div class="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-xl">
            <Icon :icon="category.icon || 'mdi:folder'" class="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ locale === 'en' ? category.name_en : category.name_km }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ locale === 'en' ? 'Select a folder to view videos' : 'ជ្រើសរើសថតដើម្បីមើលវីដេអូ' }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink v-for="folder in folders" :key="folder.id"
            :to="`/dashboard/video/evaluate/${route.params.category}/${folder.slug}`"
            class="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300">
            <div class="flex items-center gap-4">
              <div
                class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Icon icon="mdi:folder-video" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white text-lg">
                  {{ locale === 'en' ? folder.name_en : folder.name_km }}
                </h3>
                <p v-if="folder.description_en || folder.description_km" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ locale === 'en' ? folder.description_en : folder.description_km }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div v-if="!loading && folders.length === 0" class="text-center py-20 text-gray-500 dark:text-gray-400">
          <Icon icon="mdi:folder-open-outline" class="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p class="text-lg">{{ locale === 'en' ? 'No folders found' : 'រកមិនឃើញថតឯកសារ' }}</p>
        </div>
      </template>

      <div v-else class="text-center py-20 text-gray-500 dark:text-gray-400">
        <Icon icon="mdi:alert-circle-outline" class="h-16 w-16 mx-auto mb-4 opacity-30" />
        <p class="text-lg">{{ locale === 'en' ? 'Category not found' : 'រកមិនឃើញប្រភេទ' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const route = useRoute()
const { getCategoryBySlug, getFoldersByCategory } = useVideoEvaluate()

const loading = ref(true)
const category = ref<any>(null)
const folders = ref<any[]>([])

const fetchData = async () => {
  loading.value = true
  try {
    const slug = route.params.category as string
    const [catData, folderData] = await Promise.all([
      getCategoryBySlug(slug),
      getFoldersByCategory(slug),
    ])
    category.value = catData
    folders.value = folderData
  } catch (err) {
    console.error('Failed to load category:', err)
  } finally {
    loading.value = false
  }
}

watch(() => route.params.category, fetchData, { immediate: true })
</script>
