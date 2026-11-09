<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-950/50 p-4 sm:p-6 lg:p-8 transition-colors duration-300" v-motion-fade-visible-once data-aos="fade-down">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <span class="bg-gradient-to-r from-red-600 to-red-600 bg-clip-text text-transparent">
              {{ locale === 'en' ? 'KPI Request Dashboard' : 'ផ្ទាំងគ្រប់គ្រង KPI' }}
            </span>
          </h1>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{ locale === 'en' ? 'Monitor your requests and content performance metrics.' : 'តាមដានយុទ្ធសាស្ត្ររបស់អ្នក។' }}
          </p>
        </div>
        <div v-if="dateRangeHeader" class="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <Icon icon="mdi:calendar-month" class="w-5 h-5 text-indigo-500" />
          {{ dateRangeHeader }}
        </div>
      </div>

      <!-- Main Overview Section -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        <!-- KPI Summary Cards -->
        <div class="xl:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Total -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            <div class="absolute right-0 top-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div class="flex flex-col justify-between h-full relative z-10">
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {{ locale === 'en'? 'Total Requests' : 'ចំនួនសរុបការស្នើសុំ' }}
                </p>
                <h3 class="text-4xl font-bold text-gray-900 dark:text-white">{{ totalKpiRequests }}</h3>
              </div>
              <div class="mt-4 flex items-center text-sm">
                <Icon icon="mdi:chart-box" class="mr-2 w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>
          
          <!-- Pending -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            <div class="absolute right-0 top-0 w-24 h-24 bg-amber-50 dark:bg-amber-900/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div class="flex flex-col justify-between h-full relative z-10">
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {{ locale === 'en'? 'Pending Requests' : 'សំណើដែលកំពុងរង់ចាំ' }}
                </p>
                <h3 class="text-4xl font-bold text-amber-600 dark:text-amber-500">{{ pendingKpiRequests }}</h3>
              </div>
              <div class="mt-4 flex items-center text-sm">
                <Icon icon="mdi:clock-fast" class="mr-2 w-8 h-8 text-amber-500" />
              </div>
            </div>
          </div>

          <!-- Approved -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            <div class="absolute right-0 top-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div class="flex flex-col justify-between h-full relative z-10">
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {{ locale === 'en'? 'Approved Requests' : 'សំណើដែលបានយល់ព្រម' }}
                </p>
                <h3 class="text-4xl font-bold text-emerald-600 dark:text-emerald-500">{{ approvedKpiRequests }}</h3>
              </div>
              <div class="mt-4 flex items-center text-sm">
                <Icon icon="mdi:check-decagram" class="mr-2 w-8 h-8 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        <!-- KPI Status Chart -->
        <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col relative h-[220px]">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {{ locale === 'en' ? 'Overview' : 'ទិដ្ឋភាពទូទៅ' }}
          </h3>
          <div class="flex-1 min-h-0 relative w-full flex items-center justify-center">
            <canvas ref="kpiChartRef" class="max-w-[200px] max-h-[160px]"></canvas>
          </div>
        </div>

      </div>

      <!-- Advanced Creator Performance -->
      <div v-if="(isCreator || isAdmin) && creatorsData.length > 0" class="space-y-6">
        <div class="flex items-center justify-between mt-8 mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon icon="mdi:video-vintage" class="text-indigo-500" />
            {{ isAdmin ? (locale === 'en' ? 'Creators Analytics' : 'ការវិភាគអ្នកបង្កើត') : (locale === 'en' ? 'My Content Analytics' : 'ការវិភាគមាតិការបស់ខ្ញុំ') }}
          </h2>
        </div>

        <!-- KPI Visual Dashboard for Creator -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <!-- Quick Stats -->
          <div class="lg:col-span-1 flex flex-col gap-4">
             <div class="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <Icon icon="mdi:play-network-outline" class="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
                <p class="text-blue-100 text-sm font-medium mb-1">
                  {{ locale === 'en' ? 'Total Video Views' : 'ចំនួនមើលវីដេអូសរុប' }}
                </p>
                <h3 class="text-3xl font-extrabold mb-2">{{ formatTotalViews(totalViewsCount) }}</h3>
                <div class="flex items-center gap-2 mt-4 text-sm bg-blue-800/30 rounded-lg p-2 backdrop-blur-sm">
                  <Icon icon="mdi:video-wireless" />
                  <span>{{ totalVideosCount }} {{ locale === 'en' ? 'videos uploaded' : 'វីដេអូ' }}</span>
                </div>
             </div>

             <div class="grid grid-cols-2 gap-4">
                <div v-if="isAdmin && creatorsData.length > 1" class="col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <Icon icon="mdi:account-group" class="text-indigo-500 w-5 h-5" />
                    <span class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ locale === 'en' ? 'Total Creators' : 'អ្នកបង្កើតសរុប' }}</span>
                  </div>
                  <span class="text-lg font-bold text-indigo-600 dark:text-indigo-400">{{ creatorsData.length }}</span>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Big Videos</p>
                  <p class="text-xl font-bold text-red-500">{{ totalBigVideosCount }}</p>
                  <p class="text-[11px] text-gray-400 mt-1">{{ formatTotalViews(totalBigVideoViewsCount) }} views</p>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Impact Videos</p>
                  <p class="text-xl font-bold text-orange-500">{{ totalImpactVideosCount }}</p>
                  <p class="text-[11px] text-gray-400 mt-1">{{ formatTotalViews(totalImpactVideoViewsCount) }} views</p>
                </div>
             </div>
          </div>

          <!-- Video Performance Chart -->
          <div class="lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm h-[320px]">
            <h3 class="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-between">
              <span>{{ locale === 'en' ? 'Performance Insights' : 'ទិន្នន័យនៃការអនុវត្ត' }}</span>
              <span class="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-md">Views Breakdown</span>
            </h3>
            <div class="h-[220px] w-full relative">
              <canvas ref="creatorChartRef"></canvas>
            </div>
          </div>
        </div>

        <!-- Target Progress Single Creator -->
        <div v-if="!isAdmin && creatorsData.length === 1 && creatorsData[0]" class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm mt-4">
          <div class="flex justify-between items-end mb-4">
            <div>
              <h3 class="text-lg font-bold text-gray-800 dark:text-white">
                {{ locale === 'en' ? 'Target Progress' : 'វឌ្ឍនភាពគោលដៅ' }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                You have reached {{ progressPercent }}% of your goal.
              </p>
            </div>
            <div class="text-right">
              <span class="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{{ formatTotalViews(totalViewsCount) }}</span>
              <span class="text-gray-400 dark:text-gray-500 font-medium"> / {{ formatNumber(creatorsData[0].target) }}</span>
            </div>
          </div>
          <div class="bg-gray-100 dark:bg-gray-800 rounded-full h-4 w-full overflow-hidden flex">
            <div 
              class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out"
              :style="`width: ${Math.min(progressPercent, 100)}%`"
            ></div>
          </div>
          <div class="mt-4 text-center">
            <span v-if="progressPercent >= 100" class="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full text-sm font-semibold">
              <Icon icon="mdi:party-popper" /> {{ locale === 'en' ? 'Target Completed!' : 'បានបំពេញគោលដៅ!' }}
            </span>
            <span v-else class="text-sm text-gray-500">
              <span class="font-medium text-indigo-600 dark:text-indigo-400">{{ formatTotalViews((parseInt(creatorsData[0].target) - parseInt(totalViewsCount)).toString()) }}</span> 
              {{ locale === 'en' ? 'views remaining to hit target.' : 'ការមើលនៅសល់ ដើម្បីសម្រេចគោលដៅ។' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Advanced Writer Performance -->
      <div v-if="(isWriter || isAdmin) && writersData.length > 0" class="space-y-6">
        <div class="flex items-center justify-between mt-8 mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon icon="mdi:fountain-pen-tip" class="text-teal-500" />
            {{ isAdmin ? (locale === 'en' ? 'Writers Analytics' : 'ការវិភាគអ្នកនិពន្ធ') : (locale === 'en' ? 'My Writing Analytics' : 'ការវិភាគមាតិការបស់ខ្ញុំ') }}
          </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Quick Stats -->
          <div class="lg:col-span-1 flex flex-col gap-4">
             <div class="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <Icon icon="mdi:newspaper-variant-outline" class="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
                <p class="text-teal-100 text-sm font-medium mb-1">
                  {{ locale === 'en' ? 'Total Article Views' : 'ចំនួនមើលអត្ថបទសរុប' }}
                </p>
                <h3 class="text-3xl font-extrabold mb-2">{{ formatTotalViews(totalArticleViewsCount) }}</h3>
                <div class="flex items-center gap-2 mt-4 text-sm bg-teal-800/30 rounded-lg p-2 backdrop-blur-sm">
                  <Icon icon="mdi:file-document-edit" />
                  <span>{{ totalArticlesCount }} {{ locale === 'en' ? 'articles published' : 'អត្ថបទ' }}</span>
                </div>
             </div>

             <div class="grid grid-cols-2 gap-4">
                <div v-if="isAdmin && writersData.length > 1" class="col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <Icon icon="mdi:account-edit" class="text-teal-500 w-5 h-5" />
                    <span class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ locale === 'en' ? 'Total Writers' : 'អ្នកនិពន្ធសរុប' }}</span>
                  </div>
                  <span class="text-lg font-bold text-teal-600 dark:text-teal-400">{{ writersData.length }}</span>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg Views</p>
                  <p class="text-xl font-bold text-blue-500">{{ averageViewsPerArticle }}</p>
                  <p class="text-[11px] text-gray-400 mt-1">{{ locale === 'en' ? 'Per article' : 'ក្នុងមួយអត្ថបទ' }}</p>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Impact Articles</p>
                  <p class="text-xl font-bold text-orange-500">{{ totalImpactArticlesCount }}</p>
                  <p class="text-[11px] text-gray-400 mt-1">{{ formatTotalViews(totalImpactArticleViewsCount) }} views</p>
                </div>
             </div>
          </div>

          <!-- Writer Performance Chart -->
          <div class="lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm h-[320px]">
            <h3 class="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-between">
              <span>{{ locale === 'en' ? 'Article Tracking' : 'ការតាមដានអត្ថបទ' }}</span>
              <span class="text-xs px-2 py-1 bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 rounded-md">Article Performance</span>
            </h3>
            <div class="h-[220px] w-full relative">
              <canvas ref="writerChartRef"></canvas>
            </div>
          </div>
        </div>

        <!-- Target Progress Single Writer -->
        <div v-if="!isAdmin && writersData.length === 1 && writersData[0]" class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm mt-4">
          <div class="flex justify-between items-end mb-4">
            <div>
              <h3 class="text-lg font-bold text-gray-800 dark:text-white">
                {{ locale === 'en' ? 'Target Progress' : 'វឌ្ឍនភាពគោលដៅ' }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                You have reached {{ writerProgressPercent }}% of your goal.
              </p>
            </div>
            <div class="text-right">
              <span class="text-2xl font-extrabold text-teal-600 dark:text-teal-400">{{ formatTotalViews(totalArticleViewsCount) }}</span>
              <span class="text-gray-400 dark:text-gray-500 font-medium"> / {{ formatNumber(writersData[0].target) }}</span>
            </div>
          </div>
          <div class="bg-gray-100 dark:bg-gray-800 rounded-full h-4 w-full overflow-hidden flex">
            <div 
              class="h-full bg-gradient-to-r from-teal-500 to-emerald-600 transition-all duration-1000 ease-out"
              :style="`width: ${Math.min(writerProgressPercent, 100)}%`"
            ></div>
          </div>
          <div class="mt-4 text-center">
             <span v-if="writerProgressPercent >= 100" class="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full text-sm font-semibold">
              <Icon icon="mdi:party-popper" /> {{ locale === 'en' ? 'Target Completed!' : 'បានបំពេញគោលដៅ!' }}
            </span>
            <span v-else class="text-sm text-gray-500">
              <span class="font-medium text-teal-600 dark:text-teal-400">{{ formatTotalViews((parseInt(writersData[0].target) - parseInt(totalArticleViewsCount)).toString()) }}</span> 
              {{ locale === 'en' ? 'views remaining.' : 'ការមើលនៅសល់។' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading || creatorLoading" class="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <Icon icon="svg-spinners:pulse-rings-multiple" class="w-16 h-16 text-indigo-500 mb-4" />
        <p class="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
          {{ locale === 'en' ? 'Loading your dynamic dashboard...' : 'កំពុងផ្ទុកទិន្នន័យ...' }}
        </p>
      </div>

      <!-- Historical & Management Components -->
      <div class="mt-12 w-full">
         <IndexPageHistoryKpi class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6" />
      </div>

      <!-- <div v-if="isAdmin" class="mt-8">
        <AdministratorListuser />
      </div> -->

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, shallowRef, nextTick } from 'vue';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/store/useAuthStore';
import { usePermissions } from '~/composables/usePermissions';
import { Chart, registerables } from 'chart.js';

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
  getWriterTotalViews,
  type IWriter,
  type IRemark as IWriterRemark
} from '~/utils/writers';
import { formatNumber, formatTotalViews, getKpiDateHeaders } from '~/utils/format';

Chart.register(...registerables);

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

const creatorsData = ref<ICreator[]>([]);
const writersData = ref<IWriter[]>([]);
const creatorLoading = ref(false);

const { dateRangeHeader } = getKpiDateHeaders();

// Chart refs
const kpiChartRef = ref<HTMLCanvasElement | null>(null);
const creatorChartRef = ref<HTMLCanvasElement | null>(null);
const writerChartRef = ref<HTMLCanvasElement | null>(null);

let kpiChartInstance: Chart | null = null;
let creatorChartInstance: Chart | null = null;
let writerChartInstance: Chart | null = null;

// Fetch all KPI requests for the current user
const fetchKpiData = async () => {
  loading.value = true;
  try {
    if (!auth.user?.id) throw new Error('User is not authenticated');
    const response = await useApi<IResponse<KpiItem[]>>(
      `/items/kpi?filter[requestedBy][_eq]=${auth.user.id}&fields=*&sort=-date_created`, 
      { method: 'GET' }
    );
    if (response?.data) kpiItems.value = response.data;
  } catch (err) {
    error.value = true;
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const fetchCreatorsData = async () => {
  creatorLoading.value = true;
  try {
    const response = await useApi<IResponse<ICreator[]>>(
      `/items/creators?fields=*,remarks.*,user_created.*,user_created.department.*&deep[remarks][_limit]=-1`,
      { method: 'GET' }
    );
    if (response?.data) creatorsData.value = response.data;
  } catch (err) {
    console.error(err);
  } finally {
    creatorLoading.value = false;
  }
};

const fetchWritersData = async () => {
  creatorLoading.value = true;
  try {
    const response = await useApi<IResponse<IWriter[]>>(
      `/items/writers?fields=*,remarks.*,user_created.*,user_created.department.*&deep[remarks][_limit]=-1`,
      { method: 'GET' }
    );
    if (response?.data) writersData.value = response.data;
  } catch (err) {
    console.error(err);
  } finally {
    creatorLoading.value = false;
  }
};

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

// Computeds
const totalKpiRequests = computed(() => kpiItems.value.length);
const pendingKpiRequests = computed(() => kpiItems.value.filter(item => item.status === 'requested' || item.status === 'checked').length);
const approvedKpiRequests = computed(() => kpiItems.value.filter(item => item.status === 'approved' || item.status === 'verified').length);

const totalVideosCount = computed(() => creatorsData.value.reduce((sum, c) => sum + filterRemarksByKpiMonth(c.remarks || []).length, 0));
const totalViewsCount = computed(() => creatorsData.value.reduce((sum, c) => sum + parseInt(getTotalViews(filterRemarksByKpiMonth(c.remarks || [])) || '0'), 0).toString());
const totalBigVideosCount = computed(() => creatorsData.value.reduce((sum, c) => sum + countBigVideos(filterRemarksByKpiMonth(c.remarks || [])), 0));
const totalBigVideoViewsCount = computed(() => creatorsData.value.reduce((sum, c) => sum + parseInt(getBigVideoViews(filterRemarksByKpiMonth(c.remarks || [])) || '0'), 0).toString());
const totalImpactVideosCount = computed(() => creatorsData.value.reduce((sum, c) => sum + countImpactVideos(filterRemarksByKpiMonth(c.remarks || [])), 0));
const totalImpactVideoViewsCount = computed(() => creatorsData.value.reduce((sum, c) => sum + parseInt(getImpactVideoViews(filterRemarksByKpiMonth(c.remarks || [])) || '0'), 0).toString());
const progressPercent = computed(() => {
  if (creatorsData.value.length !== 1) return 0;
  const t = parseInt(creatorsData.value[0].target || '0');
  return t ? Math.round((parseInt(totalViewsCount.value) / t) * 100) : 0;
});

const totalArticlesCount = computed(() => writersData.value.reduce((sum, w) => sum + filterWriterRemarksByKpiMonth(w.remarks || []).length, 0));
const totalArticleViewsCount = computed(() => writersData.value.reduce((sum, w) => sum + parseInt(getWriterTotalViews(filterWriterRemarksByKpiMonth(w.remarks || [])) || '0'), 0).toString());
const totalImpactArticlesCount = computed(() => writersData.value.reduce((sum, w) => sum + filterWriterRemarksByKpiMonth(w.remarks || []).filter(r => r.impact_article === 'yes').length, 0));
const totalImpactArticleViewsCount = computed(() => writersData.value.reduce((sum, w) => {
  return sum + filterWriterRemarksByKpiMonth(w.remarks || [])
    .filter(r => r.impact_article === 'yes')
    .reduce((total, r) => total + parseInt(r.view || '0'), 0);
}, 0).toString());
const averageViewsPerArticle = computed(() => totalArticlesCount.value ? formatNumber(Math.round(parseInt(totalArticleViewsCount.value) / totalArticlesCount.value).toString()) : '0');
const writerProgressPercent = computed(() => {
  if (writersData.value.length !== 1) return 0;
  const t = parseInt(writersData.value[0].target || '0');
  return t ? Math.round((parseInt(totalArticleViewsCount.value) / t) * 100) : 0;
});

// Render Charts Function
const initCharts = () => {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#9ca3af' : '#4b5563';
  const gridColor = isDark ? '#374151' : '#e5e7eb';

  // KPI Chart (Doughnut)
  if (kpiChartRef.value) {
    if (kpiChartInstance) kpiChartInstance.destroy();
    kpiChartInstance = new Chart(kpiChartRef.value, {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'Approved', 'Rejected'],
        datasets: [{
          data: [
            pendingKpiRequests.value, 
            approvedKpiRequests.value, 
            kpiItems.value.filter(i => i.status === 'rejected').length
          ],
          backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { position: 'right', labels: { color: textColor, font: { size: 11 } } },
          tooltip: {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            titleColor: isDark ? '#ffffff' : '#111827',
            bodyColor: isDark ? '#ffffff' : '#111827',
            borderColor: gridColor,
            borderWidth: 1
          }
        }
      }
    });
  }

  // Creator Chart (Bar/Line)
  if (creatorChartRef.value && creatorsData.value.length > 0) {
    if (creatorChartInstance) creatorChartInstance.destroy();
    
    // Group records by day
    let allRemarks: IRemark[] = [];
    creatorsData.value.forEach(c => {
      allRemarks = [...allRemarks, ...filterRemarksByKpiMonth(c.remarks || [])];
    });
    
    // Sort
    allRemarks.sort((a, b) => new Date(a.date_created).getTime() - new Date(b.date_created).getTime());
    
    const aggregatedDates: Record<string, number> = {};
    allRemarks.forEach(r => {
      const date = new Date(r.date_created).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      aggregatedDates[date] = (aggregatedDates[date] || 0) + parseInt(r.view || '0');
    });

    const dates = Object.keys(aggregatedDates);
    const views = Object.values(aggregatedDates);

    creatorChartInstance = new Chart(creatorChartRef.value, {
      type: 'line',
      data: {
        labels: dates.length ? dates : ['No Data'],
        datasets: [{
          label: 'Video Views',
          data: views.length ? views : [0],
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: '#4f46e5',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { 
            beginAtZero: true, 
            grid: { color: gridColor },
            ticks: { color: textColor, callback: (val) => Intl.NumberFormat('en', { notation: 'compact' }).format(Number(val)) }
          },
          x: { 
            grid: { display: false },
            ticks: { color: textColor, maxTicksLimit: 7 } 
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
             backgroundColor: isDark ? '#1f2937' : '#ffffff',
             titleColor: isDark ? '#ffffff' : '#111827',
             bodyColor: isDark ? '#ffffff' : '#111827',
             borderColor: gridColor,
             borderWidth: 1
          }
        }
      }
    });
  }

   // Writer Chart (Bar)
  if (writerChartRef.value && writersData.value.length > 0) {
    if (writerChartInstance) writerChartInstance.destroy();
    
    let allRemarks: IWriterRemark[] = [];
    writersData.value.forEach(w => {
      allRemarks = [...allRemarks, ...filterWriterRemarksByKpiMonth(w.remarks || [])];
    });
    
    const aggregatedDates: Record<string, number> = {};
    allRemarks.forEach(r => {
      const date = new Date(r.date_created).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      aggregatedDates[date] = (aggregatedDates[date] || 0) + parseInt(r.view || '0');
    });

    const dates = Object.keys(aggregatedDates);
    const views = Object.values(aggregatedDates);

    writerChartInstance = new Chart(writerChartRef.value, {
      type: 'bar',
      data: {
        labels: dates.length ? dates : ['No Data'],
        datasets: [{
          label: 'Article Views',
          data: views.length ? views : [0],
          backgroundColor: '#0d9488',
          borderRadius: 4,
          hoverBackgroundColor: '#0f766e'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { 
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: textColor, callback: (val) => Intl.NumberFormat('en', { notation: 'compact' }).format(Number(val)) }
          },
          x: { 
            grid: { display: false },
            ticks: { color: textColor, maxTicksLimit: 7 } 
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
             backgroundColor: isDark ? '#1f2937' : '#ffffff',
             titleColor: isDark ? '#ffffff' : '#111827',
             bodyColor: isDark ? '#ffffff' : '#111827',
             borderColor: gridColor,
             borderWidth: 1
          }
        }
      }
    });
  }

};

watch([kpiItems, creatorsData, writersData], () => {
  nextTick(() => {
    initCharts();
  });
}, { deep: true });

onMounted(async () => {
  await fetchKpiData();
  if (isAdmin) {
    await Promise.all([fetchCreatorsData(), fetchWritersData()]);
  } else if (isCreator) {
    await fetchCreatorsData();
  } else if (isWriter) {
    await fetchWritersData();
  }
  
  // Create charts initially
  nextTick(() => {
    initCharts();
  });
  
  // Re-init chart on theme change (if using a mutation observer or a dark mode ref)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') initCharts();
    });
  });
  observer.observe(document.documentElement, { attributes: true });
});
</script>

<style scoped>
/* Additional responsive styling for canvas */
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
