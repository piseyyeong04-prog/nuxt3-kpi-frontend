<!-- pages/dashboard/track-performance-staff/creators.vue -->
<template>
  <div class="min-h-screen p-6">
    <div class="max-w-6xl mx-auto space-y-6">
  <!-- Add this after the Performance Summary Cards and before the Performance Table -->
<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-1">KPI Period Filter</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">View performance data for specific KPI periods</p>
    </div>
    
    <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        Select Period:
      </label>
      <select 
        v-model="selectedMonth" 
        @change="changeGlobalKpiPeriod(selectedMonth)"
        class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
               min-w-0 sm:min-w-[200px]">
        <option v-for="(period, key) in kpiPeriods" :key="key" :value="key">
          {{ period.label }}
        </option>
      </select>
    </div>
  </div>
  
  <!-- Period Summary -->
  <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
      <div class="text-gray-700 dark:text-gray-300">
        <span class="font-medium">Period:</span> {{ currentPeriodLabel }}
      </div>
      <div class="text-gray-700 dark:text-gray-300">
        <span class="font-medium">Total Videos:</span> 
        {{ creatorsList.reduce((sum, c) => sum + (c.remarks?.length || 0), 0) }}
      </div>
      <div class="text-gray-700 dark:text-gray-300">
        <span class="font-medium">Total Views:</span> 
        {{ formatTotalViews(creatorsList.reduce((sum, c) => sum + parseInt(getTotalViews(c.remarks || []) || '0'), 0).toString()) }}
      </div>
      <div class="text-gray-700 dark:text-gray-300">
        <span class="font-medium">Big Videos:</span> 
        {{ creatorsList.reduce((sum, c) => sum + countBigVideos(c.remarks || []), 0) }}
      </div>
    </div>
  </div>
</div>

<!-- Update the Performance Summary Cards to show filtered data -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <!-- Total Creators -->
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Total Creators</h3>
          <div class="bg-indigo-100 dark:bg-indigo-900/30 px-2 py-1 rounded-full">
            <span class="text-xs font-medium text-indigo-600 dark:text-indigo-400">All</span>
          </div>
        </div>
        <p class="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
          {{ creatorsList.length }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Content creators</p>
      </div>
      <div class="bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 p-4 rounded-2xl">
        <Icon icon="mdi:account-group" class="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
      </div>
    </div>
  </div>

  <!-- Big Video Views (Now showing filtered data) -->
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Big Video Views</h3>
          <div class="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
            <span class="text-xs font-medium text-red-600 dark:text-red-400">Big Videos</span>
          </div>
        </div>
        <p class="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
          {{ formatTotalViews(creatorsList.reduce((sum, c) => sum + parseInt(getBigVideoViews(c.remarks || []) || '0'), 0).toString()) }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ currentPeriodLabel }}</p>
      </div>
    </div>
  </div>

  <!-- Total Videos (Now showing filtered data) -->
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Total Videos</h3>
          <div class="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
            <span class="text-xs font-medium text-blue-600 dark:text-blue-400">FB</span>
          </div>
        </div>
        <p class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
          {{ creatorsList.reduce((sum, c) => sum + (c.remarks?.length || 0), 0) }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ currentPeriodLabel }}</p>
      </div>
      <div class="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-2xl">
        <Icon icon="mdi:video-outline" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>
    </div>
  </div>

  <!-- Total Views (Now showing filtered data) -->
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Total Views</h3>
          <div class="bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
            <span class="text-xs font-medium text-purple-600 dark:text-purple-400">Views</span>
          </div>
        </div>
        <p class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
          {{ formatTotalViews(creatorsList.reduce((sum, c) => sum + parseInt(getTotalViews(c.remarks || []) || '0'), 0).toString()) }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ currentPeriodLabel }}</p>
      </div>
      <div class="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-2xl">
        <Icon icon="mdi:eye-outline" class="h-8 w-8 text-purple-600 dark:text-purple-400" />
      </div>
    </div>
  </div>
</div>

<!-- Update the Performance Table headers to show current period -->
<div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
  <div class="p-4 border-b flex justify-between items-center">
    <div>
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Staff Performance</h2>
      <p class="text-sm text-gray-500">Track video engagement metrics - {{ currentPeriodLabel }}</p>
    </div>

    <div class="flex gap-2">
      <div class="relative">
        <button @click="isExportDropdownOpen = !isExportDropdownOpen"
          class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm">
          Export ▼
        </button>

        <div v-if="isExportDropdownOpen"
          class="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-50">
          <button @click="exportToCSV(); isExportDropdownOpen = false"
            class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
            Summary CSV
          </button>
          <button @click="exportDetailedCSV(); isExportDropdownOpen = false"
            class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
            Detailed CSV
          </button>
          <button @click="exportToExcelSummary(); isExportDropdownOpen = false"
            class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
            Summary Excel
          </button>
          <button @click="exportToExcelDetailed(); isExportDropdownOpen = false"
            class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
            Detailed Excel
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-3 text-left">Name</th>
          <th class="px-4 py-3 text-left">Target</th>
          <th class="px-4 py-3 text-left">Status</th>
          <!-- <th class="px-4 py-3 text-left">{{ currentPeriodLabel }} Views</th> -->
          <th class="px-4 py-3 text-left">Big Videos</th>
          <th class="px-4 py-3 text-left">Big Video Views</th>
          <th class="px-4 py-3 text-left">{{ currentPeriodLabel }} Views</th>
          <th class="px-4 py-3 text-left">Progress</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="creator in creatorsList" :key="creator.id"
          class="border-b hover:bg-gray-50 dark:hover:bg-gray-700">

          <td class="px-4 py-3">
            <p class="font-medium">
              {{ getUserName(creator.staff) || (auth.user?.first_name + ' ' + auth.user?.last_name) }}
            </p>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ creator.user_created?.title || 'N/A' }}
            </span><br>
            <span class="text-xs" :class="{
              'text-blue-600': creator.user_created?.department?.id === 1,
              'text-red-600': creator.user_created?.department?.id === 2,
              'text-green-600': creator.user_created?.department?.id === 3,
              'text-gray-500 dark:text-gray-400': ![1, 2, 3].includes(creator.user_created?.department?.id)
            }">
              {{ creator.user_created?.department?.title || 'N/A' }}
            </span>
          </td>

          <td class="px-4 py-3">{{ formatNumber(creator.target) }}</td>

          <td class="px-4 py-3">
            <span class="px-2 py-1 rounded-full text-xs" :class="isCompleted(creator)
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'">
              {{ isCompleted(creator) ? 'Completed' : 'In Progress' }}
            </span>
          </td>

          <!-- <td class="px-4 py-3 font-medium">
            {{ getTotalViews(creator.remarks || []) }}
          </td> -->

         

          <td class="px-4 py-3 font-medium">
            {{ countBigVideos(creator.remarks || []) }}
          </td>

          <td class="px-4 py-3 font-medium">
            {{ formatTotalViews(getBigVideoViews(creator.remarks || [])) }}
          </td>

          <td class="px-4 py-3 font-medium">
            {{ formatTotalViews(getTotalViews(creator.remarks || [])) }}
          </td>

          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <div class="flex-1 bg-gray-200 rounded-full h-2">
                <div class="h-2 rounded-full" :class="getProgressBarColor(calculatePercent(creator))" 
                  :style="`width: ${Math.min(calculatePercent(creator), 100)}%`">
                </div>
              </div>
              <span class="text-xs font-medium">
                {{ calculatePercent(creator) }}%
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
    </div>
  </div>

  <Transition name="fade">
    <div v-if="showHistoryModal" class="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] flex flex-col">
        <!-- Header -->
        <div
          class="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
          <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white truncate pr-4">
            KPI History for {{ selectedCreatorName }}
          </h3>
          <button @click="showHistoryModal = false"
            class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl p-2 -m-2">
            ✕
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6">
          <!-- Summary Block -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 text-sm text-gray-700 dark:text-gray-200">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <div><strong>KPI Period:</strong> {{ kpiPeriods[selectedMonth]?.label }}</div>
              <div><strong>Total Videos:</strong> {{ creatorVideos.length }}</div>
              <div><strong>Total Views:</strong> {{ formatNumber(getTotalViews(creatorVideos)) }}</div>
              <div>
                <strong>Status:</strong>
                <span :class="parseInt(getTotalViews(creatorVideos)) >= parseInt(currentCreator?.target || '0')
                  ? 'text-green-600 font-semibold'
                  : 'text-yellow-600 font-semibold'">
                  {{ parseInt(getTotalViews(creatorVideos)) >= parseInt(currentCreator?.target || '0')
                    ? 'Target Completed'
                    : 'In Progress' }}
                </span>
              </div>
            </div>

            <!-- Big Videos Section -->
            <div class="border-t border-gray-200 dark:border-gray-600 pt-3">
              <div class="mb-2">
                <strong>Big Videos:</strong> {{ countBigVideos(creatorVideos) }}
              </div>
              <div class="space-y-1">
                <div v-for="big in creatorVideos.filter(v => v.big_video === 'yes')" :key="big.id"
                  class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                  <a :href="big.video_link" target="_blank" class="text-blue-600 hover:underline font-medium break-all">
                    {{ big.title }}
                  </a>
                  <span class="text-gray-500">– {{ formatNumber(big.view || '0') }} views</span>
                </div>
              </div>
            </div>
          </div>

          <!-- KPI Period Selector -->
          <div class="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">KPI Period:</label>
            <select v-model="selectedMonth" @change="filterVideosByKpiPeriod" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-0 sm:max-w-xs">
              <option v-for="(period, key) in kpiPeriods" :key="key" :value="key">
                {{ period.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </Transition>

</template>
<script lang="ts" setup>

// Updated script section for the Vue component

import { ref, computed, onMounted, onUnmounted, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { useAuthStore } from '~/store/useAuthStore';
import { useFacebookVideo } from '~/composables/useFacebookVideo';
import type { IResponse } from '~/types/api';
import {
  getTotalViews, isCompleted, calculatePercent, getPercentClass,
  getProgressBarColor, getCompletedTargetsCount, getActiveCreatorsCount,
  getTotalViewsAcrossAll, getTotalVideosCount, countBigVideos, getBigVideoViews,
  filterRemarksByKpiMonth, filterRemarksByKpiPeriod, initializeKpiPeriods,
  getCurrentKpiPeriodKey, getKpiPeriodsFromCreators
} from '~/utils/creators';
import { extractVideoId, isValidVideoInput, buildFacebookVideoUrl } from '~/utils/facebook';
import { formatDate, formatNumber, formatTotalViews, getKpiDateHeaders } from '~/utils/format';

// Composables & Stores
const auth = useAuthStore();
const router = useRouter();
const { videoData: fbVideoData, loading: fbLoading, error: fbError, fetchVideoData } = useFacebookVideo();

// Reactive State
const loading = ref(false);
const globalRefreshLoading = ref(false);
const isExportDropdownOpen = ref(false);

// Form data
const videoUrl = ref('');
const videoTitle = ref('');
const selectedCreator = ref('');
const isBigVideo = ref('no');

// Data
const creators = ref<ICreator[]>([]);
const staffMembers = ref<Record<string, string>>({});

// KPI Period filtering
const selectedMonth = ref('current');
const kpiPeriods = ref<Record<string, { label: string; from: Date; to: Date }>>({});

// Modal states
const showHistoryModal = ref(false);
const selectedCreatorId = ref<string | null>(null);
const selectedCreatorName = ref('');
const creatorVideos = ref<any[]>([]);
const currentCreator = ref<ICreator | null>(null);

// Computed Properties
const creatorsList = computed(() => {
  // Filter each creator's remarks by the selected KPI period
  return creators.value.map(creator => ({
    ...creator,
    remarks: filterRemarksByKpiPeriod(creator.remarks || [], selectedMonth.value, kpiPeriods.value)
  }));
});

const { dateRangeHeader, totalViewsHeader } = getKpiDateHeaders();

// Update dateRangeHeader to show selected period
const currentPeriodLabel = computed(() => {
  return kpiPeriods.value[selectedMonth.value]?.label || 'Current Period';
});

// Initialize KPI periods when creators data changes
watch(creators, (newCreators) => {
  if (newCreators.length > 0) {
    kpiPeriods.value = initializeKpiPeriods(newCreators);
    
    // Set default to current period or most recent period
    const currentKey = getCurrentKpiPeriodKey();
    if (kpiPeriods.value[currentKey]) {
      selectedMonth.value = currentKey;
    } else {
      // Get the most recent period
      const sortedKeys = Object.keys(kpiPeriods.value).sort((a, b) =>
        new Date(kpiPeriods.value[b].from).getTime() - new Date(kpiPeriods.value[a].from).getTime()
      );
      selectedMonth.value = sortedKeys[0] || 'current';
    }
  }
}, { immediate: true });

// Watch for selected creator changes
watch(creatorsList, (newCreatorsList) => {
  if (newCreatorsList.length > 0 && !selectedCreator.value) {
    selectedCreator.value = String(newCreatorsList[0].id);
  }
}, { immediate: true });

// Auto select page by department
const selectedPage = ref<'TC' | 'BC' | 'HC'>('TC');

watchEffect(() => {
  const length = fbVideoData.value?.length || 0;

  // Prevent "Big Video" selection if video is too short
  if (isBigVideo.value === 'yes' && length > 0 && length < 1500) {
    isBigVideo.value = 'no';
    showWarning('Videos shorter than 25 minutes cannot be marked as Big Video');
  }
  
  const departmentId = Number(auth.user?.department?.id);
  if (departmentId === 1) {
    selectedPage.value = 'TC';
  } else if (departmentId === 2) {
    selectedPage.value = 'BC';
  } else if (departmentId === 3) {
    selectedPage.value = 'HC';
  }
});

// Computed property to disable the Big Video option when video is too short
const isBigVideoDisabled = computed(() => {
  const length = fbVideoData.value?.length || 0;
  return length > 0 && length < 1500;
});

// View Creator Videos Function (Updated)
const viewCreatorVideos = (creator: any) => {
  selectedCreatorId.value = creator.id;
  selectedCreatorName.value = getUserName(creator.staff);
  currentCreator.value = creator;

  // Get all videos (not filtered) for the history modal
  const originalCreator = creators.value.find(c => c.id === creator.id);
  const allVideos = originalCreator?.remarks || [];

  allVideos.sort((a: { date_created: string | number | Date; }, b: { date_created: string | number | Date; }) => 
    new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
  );

  // Create KPI periods from all videos
  const historyKpiPeriods = getKpiPeriodsFromCreators(allVideos);
  
  // Set the selected month for the modal (start with most recent)
  const sortedKeys = Object.keys(historyKpiPeriods).sort((a, b) =>
    new Date(historyKpiPeriods[b].from).getTime() - new Date(historyKpiPeriods[a].from).getTime()
  );
  
  const modalSelectedMonth = sortedKeys[0] || 'current';
  
  // Filter videos by the selected period
  creatorVideos.value = filterRemarksByKpiPeriod(allVideos, modalSelectedMonth, historyKpiPeriods);
  
  // Store the periods for the modal
  kpiPeriods.value = historyKpiPeriods;
  selectedMonth.value = modalSelectedMonth;
  
  showHistoryModal.value = true;
};

// Filter videos by KPI period (for modal)
const filterVideosByKpiPeriod = () => {
  if (!selectedCreatorId.value) return;
  
  const originalCreator = creators.value.find(c => c.id === Number(selectedCreatorId.value));
  const allVideos = originalCreator?.remarks || [];
  
  creatorVideos.value = filterRemarksByKpiPeriod(allVideos, selectedMonth.value, kpiPeriods.value);
};

// Add a method to change the global KPI period filter
const changeGlobalKpiPeriod = (periodKey: string) => {
  selectedMonth.value = periodKey;
  // The computed creatorsList will automatically update due to reactivity
};

// Rest of your existing methods remain the same...
// (fetchCreators, getUserName, validateVideoUrl, etc.)

// Utility Functions
const getUserName = (staffId: string): string => {
  return staffMembers.value[staffId] || 'Unknown';
};

const showError = (message: string) => {
  Swal.fire({ title: 'Error', text: message, icon: 'error' });
};

const showSuccess = (message: string) => {
  Swal.fire({ title: 'Success', text: message, icon: 'success' });
};

const showWarning = (message: string) => {
  Swal.fire({ title: 'Warning', text: message, icon: 'warning' });
};

// API Functions (keeping your existing ones)
const fetchCreators = async () => {
  loading.value = true;
  try {
    let allCreators: ICreator[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    console.log('Starting to fetch creators with remarks...');

    while (hasMore) {
      console.log(`Fetching creators batch: offset=${offset}, limit=${limit}`);

      const response = await useApi(`/items/creators?fields=*,remarks.*,user_created.*,user_created.department.title&limit=${limit}&offset=${offset}&deep[remarks][_limit]=-1`, {
        method: 'GET'
      }) as IResponse<ICreator[]>;

      const fetchedData = response.data || [];
      console.log(`Received ${fetchedData.length} creators in this batch`);

      fetchedData.forEach((creator, index) => {
        const remarksCount = creator.remarks?.length || 0;
        console.log(`Creator ${index + 1}: ${remarksCount} remarks`);
      });

      allCreators = [...allCreators, ...fetchedData];
      hasMore = fetchedData.length === limit;
      offset += limit;

      console.log(`Total creators so far: ${allCreators.length}, hasMore: ${hasMore}`);

      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Finished fetching all ${allCreators.length} creators`);

    const totalRemarks = allCreators.reduce((sum, creator) => sum + (creator.remarks?.length || 0), 0);
    console.log(`Total remarks across all creators: ${totalRemarks}`);

    creators.value = allCreators;
    await fetchStaffMembers();

  } catch (error) {
    console.error('Failed to fetch creators:', error);
    showError('Failed to load creator data');
  } finally {
    loading.value = false;
  }
};

const fetchStaffMembers = async () => {
  try {
    let allStaff: any[] = [];
    let staffOffset = 0;
    const limit = 100;
    let hasMoreStaff = true;

    console.log('Starting to fetch staff members...');

    while (hasMoreStaff) {
      console.log(`Fetching staff batch: offset=${staffOffset}, limit=${limit}`);

      const staffResponse = await useApi(`/users?limit=${limit}&offset=${staffOffset}`, {
        method: 'GET'
      });
      const staffData = (staffResponse as IResponse<any>).data || [];

      console.log(`Received ${staffData.length} staff members in this batch`);
      allStaff = [...allStaff, ...staffData];

      hasMoreStaff = staffData.length === limit;
      staffOffset += limit;

      console.log(`Total staff so far: ${allStaff.length}, hasMoreStaff: ${hasMoreStaff}`);

      if (hasMoreStaff) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Finished fetching all ${allStaff.length} staff members`);

    allStaff.forEach((staff: any) => {
      if (staff.first_name && staff.last_name) {
        staffMembers.value[staff.id] = `${staff.first_name} ${staff.last_name}`;
      }
    });

    console.log(`Processed ${Object.keys(staffMembers.value).length} staff member names`);
  } catch (err) {
    console.warn('Could not fetch staff names:', err);
  }
};

// Lifecycle
onMounted(async () => {
  await fetchCreators();

  const departmentId = Number(auth.user?.department?.id);
  if (departmentId === 1) {
    selectedPage.value = 'TC';
  } else if (departmentId === 2) {
    selectedPage.value = 'BC';
  } else if (departmentId === 3) {
    selectedPage.value = 'HC';
  }

});

// ==============================================================================
// EXPORT exportToExcelSummary
// ==============================================================================
import { exportToExcel } from '~/composables/exportToExcel';
const exportToExcelSummary = () => {
  if (!creatorsList.value?.length) {
    showWarning('There is no data available to export');
    return;
  }

  const data = creatorsList.value.map(creator => ({
    Name: getUserName(creator.staff),
    Position: creator.user_created?.title || 'N/A',
    Department: auth.user?.department?.title || 'N/A',
    "View Target": creator.target || 0,
    Status: isCompleted(creator) ? 'Completed' : 'In Progress',
    "Number of Videos": creator.remarks?.length || 0,
    "Total Views": getTotalViews(creator.remarks),
    "Video Links": creator.remarks?.map(r => r.video_link).join(', ') || ''
  }));

  exportToExcel(data, 'video-performance-summary');
};

const exportToExcelDetailed = () => {
  if (!creatorsList.value?.length) {
    showWarning('There is no data available to export');
    return;
  }

  const detailedData = creatorsList.value.flatMap(creator => {
    const base = {
      Name: getUserName(creator.staff),
      Position: creator.user_created?.title || 'N/A',
      Department: creator.user_created?.department?.title || 'N/A',
      "View Target": creator.target || 0,
      Status: isCompleted(creator) ? 'Completed' : 'In Progress',
      "Total Views": getTotalViews(creator.remarks)
    };

    return creator.remarks?.length
      ? creator.remarks.map(r => ({
        ...base,
        "Video Title": r.title || 'Untitled',
        "Video Link": r.video_link || '',
        Views: formatNumber(r.view) || 0
      }))
      : [{ ...base, "Video Title": 'N/A', "Video Link": 'N/A', Views: 0 }];
  });

  exportToExcel(detailedData, 'video-performance-detailed');
};
// ==============================================================================
// EXPORT FUNCTIONS
// ==============================================================================
const exportToCSV = () => {
  if (!creatorsList.value?.length) {
    showWarning('There is no data available to export');
    return;
  }

  const csvData = creatorsList.value.map(creator => ({
    Name: getUserName(creator.staff) || (auth.user?.first_name + ' ' + auth.user?.last_name),
    Position: creator.user_created?.title || 'N/A',
    Department: creator.user_created?.department?.title || 'N/A',
    "View Target": creator.target || 0,
    Status: isCompleted(creator) ? 'Completed' : 'In Progress',
    "Number of Videos": creator.remarks?.length || 0,
    "Total Views": getTotalViews(creator.remarks),
    "Video Links": creator.remarks?.map(r => r.video_link).join(', ') || ''
  }));

  downloadCSV(csvData, 'video-performance');
};

const exportDetailedCSV = () => {
  if (!creatorsList.value?.length) {
    showWarning('There is no data available to export');
    return;
  }

  const detailedData = creatorsList.value.flatMap(creator => {
    const baseData = {
      Name: getUserName(creator.staff) || (auth.user?.first_name + ' ' + auth.user?.last_name),
      Position: creator.user_created?.title || 'N/A',
      Department: creator.user_created?.department?.title || 'N/A',
      "View Target": creator.target || 0,
      Status: isCompleted(creator) ? 'Completed' : 'In Progress',
      "Total Views": getTotalViews(creator.remarks)
    };

    if (!creator.remarks?.length) {
      return [{ ...baseData, "Video Title": "N/A", "Video Link": "N/A", "Views": 0 }];
    }

    return creator.remarks.map(video => ({
      ...baseData,
      "Video Title": video.title || "Untitled",
      "Video Link": video.video_link || "N/A",
      "Views": formatNumber(video.view) || 0
    }));
  });

  downloadCSV(detailedData, 'detailed-video-performance');
};

const downloadCSV = (data: any[], filename: string) => {
  const csv = Papa.unparse(data);
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]); // UTF-8 BOM
  const blob = new Blob([bom, csv], { type: 'text/csv;charset=utf-8' });

  saveAs(blob, `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);

  Swal.fire({
    title: 'Success',
    text: 'CSV file has been generated and downloaded',
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  });
};

</script>