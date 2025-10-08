<!-- pages/index.vue -->
<template>
  <div v-motion-fade-visible-once data-aos="fade-down">
    <div class="container mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {{ locale === 'en' ? 'KPI Request Dashboard' : 'ផ្ទាំងគ្រប់គ្រង KPI' }}
      </h1>
      
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-900 border border-blue-500 shadow-md rounded-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {{ locale === 'en'? 'Total Requests' : 'ចំនួនសរុបការស្នើសុំ' }}
              </h2>
              <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ totalKpiRequests }}</p>
            </div>
            <Icon icon="mdi:chart-bar" class="text-4xl text-blue-500 dark:text-blue-400" />
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 border border-red-500">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {{ locale === 'en' ? 'Pending Requests' : 'សំណើដែលកំពុងរង់ចាំ' }}
              </h2>
              <p class="text-3xl font-bold text-red-600 dark:text-red-400">{{ pendingKpiRequests }}</p>
            </div>
            <Icon icon="mdi:clock-outline" class="text-4xl text-red-500 dark:text-red-400" />
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 border border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {{ locale === 'en' ? 'Approved Requests' : 'សំណើដែលបានយល់ព្រម' }}
              </h2>
              <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ approvedKpiRequests }}</p>
            </div>
            <Icon icon="mdi:check-circle-outline" class="text-4xl text-green-500 dark:text-green-400" />
          </div>
        </div>
      </div>

      <!-- Creator Performance Summary (for Creators and Admins) -->
      <div v-if="(isCreator || isAdmin) && creatorsData.length > 0" class="mb-8">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ isAdmin 
            ? (locale === 'en' ? 'Video Creators Performance' : 'ការអនុវត្តអ្នកបង្កើតវីដេអូ')
            : (locale === 'en' ? 'My Content Performance' : 'ការអនុវត្តខ្លឹមសាររបស់ខ្ញុំ')
          }}
          <span class="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
            ({{ dateRangeHeader }})
          </span>
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Creators (only show if multiple creators or admin) -->
          <div v-if="isAdmin && creatorsData.length > 1"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                    {{ locale === 'en' ? 'Total Creators' : 'អ្នកបង្កើតសរុប' }}
                  </h3>
                  <div class="bg-indigo-100 dark:bg-indigo-900/30 px-2 py-1 rounded-full">
                    <span class="text-xs font-medium text-indigo-600 dark:text-indigo-400">All</span>
                  </div>
                </div>
                <p class="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                  {{ creatorsData.length }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ locale === 'en' ? 'Content creators' : 'អ្នកបង្កើតខ្លឹមសារ' }}
                </p>
              </div>
              <div class="bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 p-4 rounded-2xl">
                <Icon icon="mdi:account-group" class="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          <!-- Total Videos -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                    {{ locale === 'en' ? 'Total Videos' : 'វីដេអូសរុប' }}
                  </h3>
                  <div class="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                    <span class="text-xs font-medium text-blue-600 dark:text-blue-400">FB</span>
                  </div>
                </div>
                <p class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {{ totalVideosCount }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ locale === 'en' ? 'Videos uploaded' : 'វីដេអូដែលបានផ្ទុកឡើង' }}
                </p>
              </div>
              <div class="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-2xl">
                <Icon icon="mdi:video-outline" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <!-- Total Views -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                    {{ locale === 'en' ? 'Total Views' : 'ចំនួនមើលសរុប' }}
                  </h3>
                  <div class="bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                    <span class="text-xs font-medium text-purple-600 dark:text-purple-400">Views</span>
                  </div>
                </div>
                <p class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {{ formatTotalViews(totalViewsCount) }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ locale === 'en' ? 'Engagement metric' : 'រង្វាស់ការចូលរួម' }}
                </p>
              </div>
              <div class="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-2xl">
                <Icon icon="mdi:eye-outline" class="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <!-- Big Videos -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                    {{ locale === 'en' ? 'Big Videos' : 'វីដេអូធំ' }}
                  </h3>
                  <div class="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
                    <span class="text-xs font-medium text-red-600 dark:text-red-400">Big</span>
                  </div>
                </div>
                <p class="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                  {{ totalBigVideosCount }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatTotalViews(totalBigVideoViewsCount) }} 
                  {{ locale === 'en' ? 'views' : 'ការមើល' }}
                </p>
              </div>
              <div class="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 p-4 rounded-2xl">
                <Icon icon="mdi:video-high-definition" class="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <!-- Impact Videos -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                    {{ locale === 'en' ? 'Impact Videos' : 'វីដេអូជាប់ផលប៉ះពាល់' }}
                  </h3>
                  <div class="bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                    <span class="text-xs font-medium text-orange-600 dark:text-orange-400">Impact</span>
                  </div>
                </div>
                <p class="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {{ totalImpactVideosCount }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatTotalViews(totalImpactVideoViewsCount) }} 
                  {{ locale === 'en' ? 'views' : 'ការមើល' }}
                </p>
              </div>
              <div class="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 p-4 rounded-2xl">
                <Icon icon="mdi:star" class="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar (only for single creator view, not for admin) -->
        <div v-if="!isAdmin && creatorsData.length === 1 && creatorsData[0]" class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
              {{ locale === 'en' ? 'Target Progress' : 'វឌ្ឍនភាពគោលដៅ' }}
            </h3>
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ formatTotalViews(totalViewsCount) }} / {{ formatNumber(creatorsData[0].target) }}
            </span>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                class="h-4 rounded-full transition-all duration-500"
                :class="getProgressBarColor(progressPercent)"
                :style="`width: ${Math.min(progressPercent, 100)}%`"
              ></div>
            </div>
            <span class="text-lg font-bold" :class="progressPercent >= 100 ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'">
              {{ progressPercent }}%
            </span>
          </div>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span v-if="progressPercent >= 100" class="text-green-600 font-semibold">
              {{ locale === 'en' ? '🎉 Target Completed!' : '🎉 បានបំពេញគោលដៅ!' }}
            </span>
            <span v-else>
              {{ locale === 'en' ? 'Keep going!' : 'បន្តខិតខំ!' }}
              {{ formatTotalViews((parseInt(creatorsData[0].target) - parseInt(totalViewsCount)).toString()) }}
              {{ locale === 'en' ? 'views to go' : 'ការមើលនៅសល់' }}
            </span>
          </p>
        </div>
      </div>

      <!-- Writer Performance Summary (for Writers and Admins) -->
      <div v-if="(isWriter || isAdmin) && writersData.length > 0" class="mb-8">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ isAdmin
            ? (locale === 'en' ? 'Article Writers Performance' : 'ការអនុវត្តអ្នកនិពន្ធអត្ថបទ')
            : (locale === 'en' ? 'My Writing Performance' : 'ការអនុវត្តការសរសេររបស់ខ្ញុំ')
          }}
          <span class="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
            ({{ dateRangeHeader }})
          </span>
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Writers (only show if multiple writers and admin) -->
          <div v-if="isAdmin && writersData.length > 1"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                    {{ locale === 'en' ? 'Total Writers' : 'អ្នកនិពន្ធសរុប' }}
                  </h3>
                  <div class="bg-teal-100 dark:bg-teal-900/30 px-2 py-1 rounded-full">
                    <span class="text-xs font-medium text-teal-600 dark:text-teal-400">All</span>
                  </div>
                </div>
                <p class="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">
                  {{ writersData.length }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ locale === 'en' ? 'Article writers' : 'អ្នកនិពន្ធអត្ថបទ' }}
                </p>
              </div>
              <div class="bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 p-4 rounded-2xl">
                <Icon icon="mdi:account-edit" class="h-8 w-8 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </div>

          <!-- Total Articles -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                    {{ locale === 'en' ? 'Total Articles' : 'អត្ថបទសរុប' }}
                  </h3>
                  <div class="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                    <span class="text-xs font-medium text-blue-600 dark:text-blue-400">Articles</span>
                  </div>
                </div>
                <p class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {{ totalArticlesCount }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ locale === 'en' ? 'Articles published' : 'អត្ថបទដែលបានផ្សាយ' }}
                </p>
              </div>
              <div class="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-2xl">
                <Icon icon="mdi:file-document-outline" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <!-- Total Article Views -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                    {{ locale === 'en' ? 'Total Views' : 'ចំនួនមើលសរុប' }}
                  </h3>
                  <div class="bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                    <span class="text-xs font-medium text-purple-600 dark:text-purple-400">Views</span>
                  </div>
                </div>
                <p class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {{ formatTotalViews(totalArticleViewsCount) }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ locale === 'en' ? 'Reader engagement' : 'ការចូលរួមអ្នកអាន' }}
                </p>
              </div>
              <div class="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-2xl">
                <Icon icon="mdi:eye-outline" class="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <!-- Impact Articles -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                    {{ locale === 'en' ? 'Impact Articles' : 'អត្ថបទមានផលប៉ះពាល់' }}
                  </h3>
                  <div class="bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                    <span class="text-xs font-medium text-orange-600 dark:text-orange-400">Impact</span>
                  </div>
                </div>
                <p class="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {{ totalImpactArticlesCount }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatTotalViews(totalImpactArticleViewsCount) }}
                  {{ locale === 'en' ? 'views' : 'ការមើល' }}
                </p>
              </div>
              <div class="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 p-4 rounded-2xl">
                <Icon icon="mdi:star-circle" class="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <!-- Average Views per Article -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                    {{ locale === 'en' ? 'Avg Views' : 'មើលជាមធ្យម' }}
                  </h3>
                  <div class="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    <span class="text-xs font-medium text-green-600 dark:text-green-400">Avg</span>
                  </div>
                </div>
                <p class="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {{ averageViewsPerArticle }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ locale === 'en' ? 'Per article' : 'ក្នុងមួយអត្ថបទ' }}
                </p>
              </div>
              <div class="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-2xl">
                <Icon icon="mdi:chart-line" class="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        <!-- Writer Progress Bar (only for single writer view, not for admin) -->
        <div v-if="!isAdmin && writersData.length === 1 && writersData[0]" class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
              {{ locale === 'en' ? 'Target Progress' : 'វឌ្ឍនភាពគោលដៅ' }}
            </h3>
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ formatTotalViews(totalArticleViewsCount) }} / {{ formatNumber(writersData[0].target) }}
            </span>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                class="h-4 rounded-full transition-all duration-500"
                :class="getWriterProgressBarColor(writerProgressPercent)"
                :style="`width: ${Math.min(writerProgressPercent, 100)}%`"
              ></div>
            </div>
            <span class="text-lg font-bold" :class="writerProgressPercent >= 100 ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'">
              {{ writerProgressPercent }}%
            </span>
          </div>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span v-if="writerProgressPercent >= 100" class="text-green-600 font-semibold">
              {{ locale === 'en' ? '🎉 Target Completed!' : '🎉 បានបំពេញគោលដៅ!' }}
            </span>
            <span v-else>
              {{ locale === 'en' ? 'Keep going!' : 'បន្តខិតខំ!' }}
              {{ formatTotalViews((parseInt(writersData[0].target) - parseInt(totalArticleViewsCount)).toString()) }}
              {{ locale === 'en' ? 'views to go' : 'ការមើលនៅសល់' }}
            </span>
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="creatorLoading" class="mb-8 text-center py-12">
        <Icon icon="mdi:loading" class="animate-spin h-12 w-12 mx-auto text-gray-400" />
        <p class="mt-4 text-gray-600 dark:text-gray-400">
          {{ locale === 'en' ? 'Loading performance data...' : 'កំពុងផ្ទុកទិន្នន័យ...' }}
        </p>
      </div>

      <!-- KPI History Component -->
      <IndexPageHistoryKpi />
    </div>

    <!-- ListUser -->
    <div v-if="isAdmin" class="mx-auto p-2 md:px-6">
      <AdministratorListuser />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/store/useAuthStore';
import { usePermissions } from '~/composables/usePermissions';
import type { IResponse } from '~/types/api';
import type { KpiItem } from '~/types/kpi';
import { 
  getTotalViews, 
  countBigVideos, 
  getBigVideoViews,
  countImpactVideos,
  getImpactVideoViews,
  filterRemarksByKpiMonth,
  getProgressBarColor,
  type ICreator,
  type IRemark
} from '~/utils/creators';
import { 
  getTotalViews as getWriterTotalViews,
  type IWriter,
  type IRemark as IWriterRemark
} from '~/utils/writers';
import { formatNumber, formatTotalViews, getKpiDateHeaders } from '~/utils/format';

const { isAdmin, isCreator, isWriter } = usePermissions();
const { locale } = useI18n();
const auth = useAuthStore();

definePageMeta({
  middleware: ['auth']
});

// State for KPI data
const kpiItems = ref<KpiItem[]>([]);
const loading = ref(true);
const error = ref(false);

// State for creator/writer data
const creatorsData = ref<ICreator[]>([]);
const writersData = ref<IWriter[]>([]);
const creatorLoading = ref(false);

// Get date headers
const { dateRangeHeader } = getKpiDateHeaders();

// Fetch all KPI requests for the current user
const fetchKpiData = async () => {
  loading.value = true;
  error.value = false;
  
  try {
    if (!auth.user?.id) {
      throw new Error('User is not authenticated');
    }

    const response = await useApi<IResponse<KpiItem[]>>(
      `/items/kpi?filter[requestedBy][_eq]=${auth.user.id}&fields=*&sort=-date_created`, 
      { method: 'GET' }
    );

    if (response && response.data) {
      kpiItems.value = response.data;
    } else {
      throw new Error('Failed to load data');
    }
  } catch (err) {
    error.value = true;
    console.error('Error fetching KPI data:', err);
  } finally {
    loading.value = false;
  }
};

// Fetch creators data (for Creator role)
const fetchCreatorsData = async () => {
  creatorLoading.value = true;
  try {
    const response = await useApi<IResponse<ICreator[]>>(
      `/items/creators?fields=*,remarks.*,user_created.*,user_created.department.*&deep[remarks][_limit]=-1`,
      { method: 'GET' }
    );

    if (response?.data) {
      creatorsData.value = response.data;
      console.log(`Fetched ${response.data.length} creator(s) based on user permissions`);
    }
  } catch (err) {
    console.error('Error fetching creators data:', err);
  } finally {
    creatorLoading.value = false;
  }
};

// Fetch writers data (for Writer role)
const fetchWritersData = async () => {
  creatorLoading.value = true;
  try {
    const response = await useApi<IResponse<IWriter[]>>(
      `/items/writers?fields=*,remarks.*,user_created.*,user_created.department.*&deep[remarks][_limit]=-1`,
      { method: 'GET' }
    );

    if (response?.data) {
      writersData.value = response.data;
      console.log(`Fetched ${response.data.length} writer(s) based on user permissions`);
    }
  } catch (err) {
    console.error('Error fetching writers data:', err);
  } finally {
    creatorLoading.value = false;
  }
};

// Helper function to filter writer remarks by KPI month
const filterWriterRemarksByKpiMonth = (remarks: IWriterRemark[]): IWriterRemark[] => {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  if (now.getDate() < 24) {
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
  }

  const start = new Date(Date.UTC(year, month, 24));
  const end = new Date(Date.UTC(year, month + 1, 23, 23, 59, 59));

  return remarks.filter(r => {
    const created = new Date(r.date_created);
    return created >= start && created <= end;
  });
};

// Creator computed metrics
const totalVideosCount = computed(() => {
  return creatorsData.value.reduce((sum, creator) => {
    const filtered = filterRemarksByKpiMonth(creator.remarks || []);
    return sum + filtered.length;
  }, 0);
});

const totalViewsCount = computed(() => {
  return creatorsData.value.reduce((sum, creator) => {
    const filtered = filterRemarksByKpiMonth(creator.remarks || []);
    return sum + parseInt(getTotalViews(filtered) || '0');
  }, 0).toString();
});

const totalBigVideosCount = computed(() => {
  return creatorsData.value.reduce((sum, creator) => {
    const filtered = filterRemarksByKpiMonth(creator.remarks || []);
    return sum + countBigVideos(filtered);
  }, 0);
});

const totalBigVideoViewsCount = computed(() => {
  return creatorsData.value.reduce((sum, creator) => {
    const filtered = filterRemarksByKpiMonth(creator.remarks || []);
    return sum + parseInt(getBigVideoViews(filtered) || '0');
  }, 0).toString();
});

const totalImpactVideosCount = computed(() => {
  return creatorsData.value.reduce((sum, creator) => {
    const filtered = filterRemarksByKpiMonth(creator.remarks || []);
    return sum + countImpactVideos(filtered);
  }, 0);
});

const totalImpactVideoViewsCount = computed(() => {
  return creatorsData.value.reduce((sum, creator) => {
    const filtered = filterRemarksByKpiMonth(creator.remarks || []);
    return sum + parseInt(getImpactVideoViews(filtered) || '0');
  }, 0).toString();
});

// Creator progress percent (only relevant for single creator)
const progressPercent = computed(() => {
  if (creatorsData.value.length !== 1) return 0;
  const creator = creatorsData.value[0];
  const totalViews = parseInt(totalViewsCount.value || '0');
  const target = parseInt(creator.target || '0');
  if (target === 0) return 0;
  return Math.round((totalViews / target) * 100);
});

// Writer computed metrics
const totalArticlesCount = computed(() => {
  return writersData.value.reduce((sum, writer) => {
    const filtered = filterWriterRemarksByKpiMonth(writer.remarks || []);
    return sum + filtered.length;
  }, 0);
});

const totalArticleViewsCount = computed(() => {
  return writersData.value.reduce((sum, writer) => {
    const filtered = filterWriterRemarksByKpiMonth(writer.remarks || []);
    return sum + parseInt(getWriterTotalViews(filtered) || '0');
  }, 0).toString();
});

const totalImpactArticlesCount = computed(() => {
  return writersData.value.reduce((sum, writer) => {
    const filtered = filterWriterRemarksByKpiMonth(writer.remarks || []);
    return sum + filtered.filter(r => r.impact_article === 'yes').length;
  }, 0);
});

const totalImpactArticleViewsCount = computed(() => {
  return writersData.value.reduce((sum, writer) => {
    const filtered = filterWriterRemarksByKpiMonth(writer.remarks || []);
    const impactViews = filtered
      .filter(r => r.impact_article === 'yes')
      .reduce((total, r) => total + parseInt(r.view || '0'), 0);
    return sum + impactViews;
  }, 0).toString();
});

const averageViewsPerArticle = computed(() => {
  const articles = totalArticlesCount.value;
  if (articles === 0) return '0';
  const views = parseInt(totalArticleViewsCount.value || '0');
  return formatNumber(Math.round(views / articles).toString());
});

// Writer progress percent (only relevant for single writer)
const writerProgressPercent = computed(() => {
  if (writersData.value.length !== 1) return 0;
  const writer = writersData.value[0];
  const totalViews = parseInt(totalArticleViewsCount.value || '0');
  const target = parseInt(writer.target || '0');
  if (target === 0) return 0;
  return Math.round((totalViews / target) * 100);
});

// Progress bar color for writer
const getWriterProgressBarColor = (percent: number): string => {
  if (percent >= 100) return 'bg-green-600';
  if (percent >= 75) return 'bg-blue-600';
  return 'bg-pink-600';
};

// Computed properties for dashboard metrics
const totalKpiRequests = computed(() => kpiItems.value.length);

const pendingKpiRequests = computed(() => 
  kpiItems.value.filter(item => 
    item.status === 'requested' || item.status === 'checked'
  ).length
);

const approvedKpiRequests = computed(() => 
  kpiItems.value.filter(item => 
    item.status === 'approved' || item.status === 'verified'
  ).length
);

// Fetch data on component mount
onMounted(async () => {
  await fetchKpiData();
  
  // Fetch based on user role
  if (isAdmin) {
    // Admin sees both creators and writers
    await Promise.all([
      fetchCreatorsData(),
      fetchWritersData()
    ]);
  } else if (isCreator) {
    await fetchCreatorsData();
  } else if (isWriter) {
    await fetchWritersData();
  }
});
</script>