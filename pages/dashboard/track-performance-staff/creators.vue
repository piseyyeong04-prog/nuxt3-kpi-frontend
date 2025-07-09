<!-- pages/dashboard/track-performance-staff/creators.vue -->
<template>
  <div class="min-h-screen p-6">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Add Video Form -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Add Facebook Video</h2>

        <form @submit.prevent="addVideoData" class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <input v-model="videoUrl" type="text" class="border rounded-lg px-3 py-2 w-full"
              placeholder="Facebook Video URL" required />
            <select v-model="selectedCreator" class="border rounded-lg px-3 py-2 w-full" required>
              <option value="" disabled>Select Creator</option>
              <option v-for="creator in creatorsList" :key="creator.id" :value="creator.id">
                {{ getUserName(creator.staff) || (auth.user?.first_name + ' ' + auth.user?.last_name) }}
              </option>
            </select>
          </div>

          <input v-model="videoTitle" type="text" class="border rounded-lg px-3 py-2 w-full"
            placeholder="Video Title (Optional)" />
          <select v-model="isBigVideo" class="border rounded-lg px-3 py-2 w-full" required>
            <option value="no">Big Video? - No</option>
            <option value="yes">Big Video? - Yes</option>
          </select>


          <div class="flex gap-3">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              :disabled="loading || fbLoading">
              {{ loading || fbLoading ? 'Processing...' : 'Add Video' }}
            </button>

            <button type="button" @click="fetchFromFacebook"
              class="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50" :disabled="!videoUrl">
              {{ fbLoading ? 'Fetching...' : 'Fetch Data' }}
            </button>
          </div>
        </form>

        <!-- Video Preview -->
        <div v-if="fbVideoData" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 class="font-medium mb-2">Preview</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Title:</strong> {{ fbVideoData.title || 'N/A' }}</div>
            <div><strong>Views:</strong> {{ formatNumber(fbVideoData.views?.toString() || '0') }}</div>
            <div><strong>Created:</strong> {{ formatDate(fbVideoData.created_time) }}</div>
            <div><strong>ID:</strong> {{ fbVideoData.id }}</div>
          </div>
        </div>
      </div>

      <!-- Performance Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="p-4 border-b flex justify-between items-center">
          <div>
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Staff Performance</h2>
            <p class="text-sm text-gray-500">Track video engagement metrics</p>
          </div>

          <div class="flex gap-2">
            <button @click="refreshAllVideos"
              class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
              :disabled="globalRefreshLoading">
              {{ globalRefreshLoading ? 'Refreshing...' : 'Reload' }}
            </button>

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
                <th class="px-4 py-3 text-left">Position</th>
                <th class="px-4 py-3 text-left">Department</th>
                <th class="px-4 py-3 text-left">Target</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-left">{{ dateRangeHeader }}</th>
                <th class="px-4 py-3 text-left">Videos</th>
                <!-- Big Video -->
                <th class="px-4 py-3 text-left">Big Videos</th>
                <th class="px-4 py-3 text-left">Big Video Views</th>

                <th class="px-4 py-3 text-left">{{ totalViewsHeader }}</th>
                <th class="px-4 py-3 text-left">Progress</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="creator in creatorsList" :key="creator.id"
                class="border-b hover:bg-gray-50 dark:hover:bg-gray-700">

                <td class="px-4 py-3 font-medium">
                  {{ getUserName(creator.staff) || (auth.user?.first_name + ' ' + auth.user?.last_name) }}
                </td>

                <td class="px-4 py-3">{{ creator.user_created?.title || 'N/A' }}</td>
                <td class="px-4 py-3">{{ creator.user_created?.department?.title || 'N/A' }}</td>
                <td class="px-4 py-3">{{ formatNumber(creator.target) }}</td>

                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded-full text-xs" :class="isCompleted({ ...creator, remarks: filterRemarksByKpiMonth(creator.remarks) })
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'">
                    {{ isCompleted({ ...creator, remarks: filterRemarksByKpiMonth(creator.remarks) })
                      ? 'Completed'
                      : 'In Progress' }}
                  </span>
                </td>

                <td class="px-4 py-3 font-medium">
                  {{ getTotalViews(filterRemarksByKpiMonth(creator.remarks)) }}
                </td>

                <td class="px-4 py-3">
                  <button @click="handleRemarkClick(creator)"
                    class="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-xs">
                    {{ filterRemarksByKpiMonth(creator.remarks).length }} Videos
                  </button>
                  <button @click="viewCreatorVideos(creator)" class="text-blue-600 hover:underline text-xs">
                    View History
                  </button>
                </td>

                <td class="px-4 py-3 font-medium">
                  {{ countBigVideos(filterRemarksByKpiMonth(creator.remarks)) }}
                </td>

                <td class="px-4 py-3 font-medium">
                  {{ formatTotalViews(getBigVideoViews(filterRemarksByKpiMonth(creator.remarks))) }}
                </td>

                <td class="px-4 py-3 font-medium">
                  {{ formatTotalViews(getTotalViews(filterRemarksByKpiMonth(creator.remarks))) }}
                </td>

                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="flex-1 bg-gray-200 rounded-full h-2">
                      <div class="h-2 rounded-full" :class="getProgressBarColor(
                        calculatePercent({ ...creator, remarks: filterRemarksByKpiMonth(creator.remarks) })
                      )" :style="`width: ${Math.min(
                        calculatePercent({ ...creator, remarks: filterRemarksByKpiMonth(creator.remarks) }),
                        100
                      )}%`">
                      </div>
                    </div>
                    <span class="text-xs font-medium">
                      {{ calculatePercent({ ...creator, remarks: filterRemarksByKpiMonth(creator.remarks) }) }}%
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
        <div class="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
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
                  <a :href="big.video_link" target="_blank" 
                    class="text-blue-600 hover:underline font-medium break-all">
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
            <select v-model="selectedMonth" @change="filterVideosByKpiPeriod"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-0 sm:max-w-xs">
              <option v-for="(period, key) in kpiPeriods" :key="key" :value="key">
                {{ period.label }}
              </option>
            </select>
          </div>

          <!-- Mobile Card View (< md) -->
          <div class="md:hidden space-y-4">
            <div v-for="(item, index) in creatorVideos" :key="item.id" 
              class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-sm">
              <div class="flex justify-between items-start mb-3">
                <span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 
                           text-xs font-medium px-2.5 py-0.5 rounded">
                  #{{ index + 1 }}
                </span>
                <div class="flex space-x-2">
                  <button @click="editVideo(item)"
                    class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium">
                    Edit
                  </button>
                  <button @click="deleteVideo(item.id, selectedCreatorName, item.title)"
                    class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium">
                    Delete
                  </button>
                </div>
              </div>
              
              <div class="space-y-2">
                <div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Title</div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.title }}</div>
                </div>
                
                <div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Link</div>
                  <a :href="item.video_link" target="_blank"
                    class="text-blue-600 hover:underline text-sm break-all">
                    {{ item.video_link }}
                  </a>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Views</div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ formatNumber(item.view || 0) }}</div>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Created</div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(item.date_created) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop/Tablet Table View (>= md) -->
          <div class="hidden md:block">
            <div class="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      No.
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Link
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Views
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="(item, index) in creatorVideos" :key="item.id" 
                    class="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ index + 1 }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div class="max-w-xs truncate">{{ item.title }}</div>
                    </td>
                    <td class="px-6 py-4 text-sm text-blue-600 dark:text-blue-400">
                      <a :href="item.video_link" target="_blank"
                        class="hover:underline block truncate max-w-xs">
                        {{ item.video_link }}
                      </a>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ formatNumber(item.view || 0) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ formatDate(item.date_created) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button @click="editVideo(item)"
                        class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs">
                        Edit
                      </button>
                      <button @click="deleteVideo(item.id, selectedCreatorName, item.title)"
                        class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { useAuthStore } from '~/store/useAuthStore';
import { useFacebookVideo } from '~/composables/useFacebookVideo';
import type { IResponse } from '~/types/api';
// Utility imports
import {
  getTotalViews, isCompleted, calculatePercent, getPercentClass,
  getProgressBarColor, getCompletedTargetsCount, getActiveCreatorsCount,
  getTotalViewsAcrossAll, getTotalVideosCount, countBigVideos, getBigVideoViews
} from '~/utils/creators';
import { extractVideoId, isValidVideoInput, buildFacebookVideoUrl } from '~/utils/facebook';
import { formatDate, formatNumber, formatTotalViews, getKpiDateHeaders } from '~/utils/format';

// Global type declarations
declare global {
  interface Window {
    editRemark: (remarkId: string) => Promise<void>;
    deleteRemark: (remarkId: string, creatorName: string, videoTitle: string) => Promise<void>;
    refreshViewCount: (remarkId: string) => Promise<void>;
  }
}

// ==============================================================================
// COMPOSABLES & STORES
// ==============================================================================
const auth = useAuthStore();
const router = useRouter();
const { videoData: fbVideoData, loading: fbLoading, error: fbError, fetchVideoData } = useFacebookVideo();

// ==============================================================================
// REACTIVE STATE
// ==============================================================================
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

// ==============================================================================
// COMPUTED PROPERTIES
// ==============================================================================
const creatorsList = computed(() => creators.value);
const { dateRangeHeader, totalViewsHeader } = getKpiDateHeaders();

// ==============================================================================
// UTILITY FUNCTIONS
// ==============================================================================
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

const validateVideoUrl = (): string | null => {
  const videoId = extractVideoId(videoUrl.value);
  if (!videoId) {
    showError('Could not extract a valid Facebook video ID from the provided URL');
    return null;
  }
  return videoId;
};

// ==============================================================================
// API FUNCTIONS
// ==============================================================================
const fetchCreators = async () => {
  loading.value = true;
  try {
    const response = await useApi('/items/creators?fields=*,remarks.*,user_created.*,user_created.department.title', {
      method: 'GET'
    }) as IResponse<ICreator[]>;

    creators.value = response.data;
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
    const staffResponse = await useApi('/users', { method: 'GET' });
    const staffData = (staffResponse as IResponse<any>).data;

    staffData.forEach((staff: any) => {
      staffMembers.value[staff.id] = `${staff.first_name} ${staff.last_name}`;
    });
  } catch (err) {
    console.warn('Could not fetch staff names:', err);
  }
};

const checkVideoExists = async (videoId: string): Promise<boolean> => {
  const response = await useApi(`/items/remark_link?filter[video_link][_eq]=https://www.facebook.com/watch?v=${videoId}`, {
    method: 'GET'
  }) as IResponse<any>;

  return response.data && response.data.length > 0;
};

const saveVideoRemark = async (videoId: string) => {
  const remarkData = {
    title: videoTitle.value || fbVideoData.value?.title || 'Facebook Video',
    video_link: `https://www.facebook.com/watch?v=${videoId}`,
    view: fbVideoData.value?.views?.toString() || '0',
    status: 'active',
    creators: parseInt(selectedCreator.value),
    big_video: isBigVideo.value

  };

  await useApi('/items/remark_link', {
    method: 'POST',
    data: remarkData
  });
};


// ==============================================================================
// show History Modal
// ==============================================================================
import { filterRemarksByKpiMonth } from '~/utils/creators';



const showHistoryModal = ref(false)
const selectedCreatorId = ref<string | null>(null)
const selectedCreatorName = ref('')
const creatorVideos = ref<any[]>([])
const selectedMonth = ref('current')
const kpiPeriods = ref<Record<string, { label: string; from: Date; to: Date }>>({})
const currentCreator = ref<ICreator | null>(null)

watch(creatorsList, (newCreatorsList) => {
  if (newCreatorsList.length > 0 && !selectedCreator.value) {
    selectedCreator.value = String(newCreatorsList[0].id);
  }
}, { immediate: true });

const viewCreatorVideos = (creator: any) => {
  selectedCreatorId.value = creator.id
  selectedCreatorName.value = getUserName(creator.staff)
  currentCreator.value = creator // ✅ Save reference to show summary

  const allVideos = creator.remarks || []

  allVideos.sort((a: { date_created: string | number | Date; }, b: { date_created: string | number | Date; }) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
  creatorVideos.value = allVideos

  kpiPeriods.value = getKpiPeriodsFromArticles(allVideos)

  const sortedKeys = Object.keys(kpiPeriods.value).sort((a, b) =>
    new Date(kpiPeriods.value[b].from).getTime() - new Date(kpiPeriods.value[a].from).getTime()
  )
  selectedMonth.value = sortedKeys[0] || 'current'

  filterVideosByKpiPeriod()
  showHistoryModal.value = true
}


const filterVideosByKpiPeriod = () => {
  if (!kpiPeriods.value[selectedMonth.value]) return

  const { from } = kpiPeriods.value[selectedMonth.value]
  const all = creators.value.find(
    c => c.id === Number(selectedCreatorId.value)
  )?.remarks || [];


  creatorVideos.value = all.filter(video => {
    const created = new Date(video.date_created)

    // 🧠 Apply 23rd-cutoff logic:
    const adjusted = new Date(created)
    if (adjusted.getDate() < 23) {
      adjusted.setMonth(adjusted.getMonth() - 1)
    }
    adjusted.setDate(23)
    adjusted.setHours(0, 0, 0, 0)

    return adjusted.getTime() === from.getTime()
  })
}


// ==============================================================================
// FACEBOOK VIDEO FUNCTIONS
// ==============================================================================
const fetchFromFacebook = async () => {
  const videoId = validateVideoUrl();
  if (!videoId) return;

  await fetchVideoData(videoId);

  if (fbVideoData.value?.title) {
    videoTitle.value = fbVideoData.value.title;
  }

  if (fbError.value) {
    showError(fbError.value);
  }
};

const addVideoData = async () => {
  if (!selectedCreator.value) {
    showWarning('Please select a creator');
    return;
  }

  const videoId = validateVideoUrl();
  if (!videoId) return;

  loading.value = true;

  try {
    // Check for duplicates
    if (await checkVideoExists(videoId)) {
      showWarning('This video has already been uploaded.');
      return;
    }

    // Fetch video data if not already fetched
    if (!fbVideoData.value) {
      await fetchVideoData(videoId);
      if (fbError.value) {
        showError(fbError.value);
        return;
      }
    }

    // Save video data
    await saveVideoRemark(videoId);
    showSuccess('Video data has been added successfully');

    // Reset form
    resetForm();
    await fetchCreators();

  } catch (error: any) {
    console.error('Failed to save video data:', error);
    showError(error?.data?.message || 'Failed to save video data');
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  videoUrl.value = '';
  videoTitle.value = '';
  isBigVideo.value = 'no';
  fbVideoData.value = null;
};

// ==============================================================================
// VIDEO MANAGEMENT FUNCTIONS
// ==============================================================================
const updateVideo = async (remarkId: string, data: any) => {
  try {
    loading.value = true;

    if (data.video_link) {
      const videoId = extractVideoId(data.video_link);
      if (!videoId) {
        showError('Could not extract a valid Facebook video ID from the provided URL');
        return false;
      }

      data.video_link = buildFacebookVideoUrl(videoId);

      if (!data.view) {
        await fetchVideoData(videoId);
        if (fbVideoData.value?.views) {
          data.view = fbVideoData.value.views.toString();
        }
      }
    }

    await useApi(`/items/remark_link/${remarkId}`, {
      method: 'PATCH',
      data: data
    });

    showSuccess('Video data has been updated successfully');
    await fetchCreators();
    return true;
  } catch (error: any) {
    console.error('Failed to update video data:', error);
    showError(error?.data?.message || 'Failed to update video data');
    return false;
  } finally {
    loading.value = false;
  }
};

const deleteVideo = async (remarkId: string, creatorName: string, videoTitle: string) => {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `You are about to delete the video:<br><strong>${videoTitle}</strong><br>from <strong>${creatorName}</strong>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return false;

    loading.value = true;
    await useApi(`/items/remark_link/${remarkId}`, { method: 'DELETE' });

    showSuccess('The video has been removed successfully.');
    await fetchCreators();
    return true;
  } catch (error: any) {
    console.error('Failed to delete video:', error);
    showError(error?.data?.message || 'Failed to delete the video');
    return false;
  } finally {
    loading.value = false;
  }
};

const editVideo = async (remark: any) => {
  const { value: formValues } = await Swal.fire({
    title: 'Edit Video Data',
    html: `
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
        <input id="swal-title" class="w-full p-2 border rounded" value="${remark.title || ''}">
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Facebook Video URL</label>
        <input id="swal-url" class="w-full p-2 border rounded" readonly value="${remark.video_link || ''}">
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">View Count</label>
        <input id="swal-views" class="w-full p-2 border rounded" disabled value="${remark.view || '0'}">
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Date Created</label>
        <input id="swal-date" type="datetime-local" class="w-full p-2 border rounded"
          value="${remark.date_created ? new Date(remark.date_created).toISOString().slice(0, 16) : ''}">
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Big Video?</label>
        <select id="swal-bigvideo" class="w-full p-2 border rounded">
          <option value="no" ${remark.big_video === 'no' ? 'selected' : ''}>No</option>
          <option value="yes" ${remark.big_video === 'yes' ? 'selected' : ''}>Yes</option>
        </select>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Update',
    preConfirm: () => ({
      title: (document.getElementById('swal-title') as HTMLInputElement).value,
      video_link: (document.getElementById('swal-url') as HTMLInputElement).value,
      view: (document.getElementById('swal-views') as HTMLInputElement).value,
      date_created: new Date((document.getElementById('swal-date') as HTMLInputElement).value).toISOString(),
      big_video: (document.getElementById('swal-bigvideo') as HTMLSelectElement).value
    })
  });

  if (formValues) {
    return await updateVideo(remark.id, formValues);
  }
  return false;
};


// ==============================================================================
// MODAL & UI FUNCTIONS
// ==============================================================================
const handleRemarkClick = (creator: ICreator) => {
  const kpiRemarks = filterRemarksByKpiMonth(creator.remarks || []);

  if (!kpiRemarks.length) {
    Swal.fire({
      title: 'No Videos',
      text: 'No video data available for this creator in the KPI period',
      icon: 'info'
    });
    return;
  }

  const creatorName = getUserName(creator.staff) || (auth.user?.first_name + ' ' + auth.user?.last_name);
  const remarksList = createRemarksHtml(kpiRemarks, creatorName);

  // Setup global handlers to use filtered data
  setupGlobalHandlers({ ...creator, remarks: kpiRemarks }, creatorName);

  Swal.fire({
    title: `Videos for ${creatorName}`,
    html: remarksList,
    width: '900px',
    showConfirmButton: false,
    showCloseButton: true
  });
};


const createRemarksHtml = (remarks: any[], creatorName: string) => {
  const sortedRemarks = [...remarks].sort((a, b) =>
    new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
  );

  return sortedRemarks.map(r => `
    <div class="mb-4 p-3 border-b">
      <div class="md:flex justify-between items-start">
        <div>
          <p class="font-bold">${r.title}</p>
          <p class="text-sm break-words">
            <a href="${r.video_link}" target="_blank" class="text-blue-600 hover:underline">${r.video_link}</a>
          </p>
          <p class="mt-2"><b>Views:</b> ${formatNumber(r.view)}</p>
          <p class="mt-1">
            ${r.big_video === 'yes'
      ? `<span class="inline-block bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">Big Video</span>`
      : ''}
          </p>
          <p class="text-xs mt-1"><b>Status:</b> 
            <span class="${r.status === 'active' ? 'text-green-600' : 'text-red-600'}">${r.status}</span>
          </p>
        </div>
        <div class="flex flex-col space-y-2">
          <button onclick="window.editRemark('${r.id}')" class="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">
            Edit
          </button>
          <button onclick="window.deleteRemark('${r.id}', '${creatorName}', '${r.title.replace(/'/g, "\\'")}')" 
            class="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">
            Delete
          </button> 
        </div>
      </div>
    </div>
  `).join('');
};


const setupGlobalHandlers = (creator: ICreator, creatorName: string) => {
  window.editRemark = async (remarkId: string) => {
    const remark = creator.remarks?.find(r => r.id.toString() === remarkId);
    if (!remark) return;

    Swal.close();
    const updated = await editVideo(remark);
    if (updated) {
      await fetchCreators(); // Wait for data to fully reload
      const updatedCreator = creators.value.find(c => c.id === creator.id);
      if (updatedCreator) {
        handleRemarkClick(updatedCreator); // Reopen modal with fresh data
      }
    }
  };


  window.deleteRemark = async (remarkId: string, creatorName: string, videoTitle: string) => {
    Swal.close();
    await deleteVideo(remarkId, creatorName, videoTitle);
    await fetchCreators();
    const updatedCreator = creators.value.find(c => c.id === creator.id);
    if (updatedCreator?.remarks?.length) {
      handleRemarkClick(updatedCreator);
    }
  };
};

// ==============================================================================
// REFRESH FUNCTIONS      
// ==============================================================================
const refreshAllVideos = async () => {
  try {
    globalRefreshLoading.value = true;
    const toast = createLoadingToast();

    const allRemarks = creators.value.flatMap(creator => creator.remarks || []);

    if (!allRemarks.length) {
      Swal.fire({ title: 'No Videos', text: 'No video data available to refresh', icon: 'info' });
      return;
    }

    const stats = { success: 0, error: 0, skipped: 0 };

    for (let i = 0; i < allRemarks.length; i++) {
      const remark = allRemarks[i];
      updateRefreshStatus(toast, i + 1, allRemarks.length, stats);

      await processVideoRefresh(remark, stats);
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
    }

    await fetchCreators();
    showRefreshComplete(allRemarks.length, stats);

  } catch (error: any) {
    console.error('Failed to refresh videos:', error);
    showError(error?.data?.message || 'Failed to refresh videos');
  } finally {
    globalRefreshLoading.value = false;
  }
};

const createLoadingToast = () => {
  return Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 0,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
};

const updateRefreshStatus = (toast: any, current: number, total: number, stats: any) => {
  toast.fire({
    icon: 'info',
    title: `Refreshing videos (${current}/${total})...`,
    html: `<div class="text-xs mt-1">Success: ${stats.success} | Errors: ${stats.error} | Skipped: ${stats.skipped}</div>`
  });
};

const processVideoRefresh = async (remark: any, stats: any) => {
  const videoId = extractVideoId(remark.video_link);
  if (!videoId) {
    console.warn(`Invalid URL for video: ${remark.title}`);
    stats.skipped++;
    return;
  }

  try {
    await fetchVideoData(videoId);

    if (fbError.value || !fbVideoData.value?.views) {
      console.warn(`Couldn't get view count for: ${remark.title}`);
      stats.error++;
      return;
    }

    const oldViewCount = parseInt(remark.view || '0');
    const newViewCount = parseInt(fbVideoData.value.views.toString());

    if (newViewCount !== oldViewCount) {
      await useApi(`/items/remark_link/${remark.id}`, {
        method: 'PATCH',
        data: { view: newViewCount.toString() }
      });
      stats.success++;
    } else {
      stats.skipped++;
    }
  } catch (error) {
    console.error(`Error refreshing view count for ${remark.title}:`, error);
    stats.error++;
  }
};

const showRefreshComplete = (total: number, stats: any) => {
  Swal.fire({
    title: 'Refresh Complete',
    html: `
      <div class="space-y-2">
        <p>Processed ${total} videos:</p>
        <div class="flex justify-between px-4">
          <span class="text-green-600">Updated: ${stats.success}</span>
          <span class="text-yellow-600">Skipped: ${stats.skipped}</span>
          <span class="text-red-600">Errors: ${stats.error}</span>
        </div>
      </div>
    `,
    icon: 'success'
  });
};
// ==============================================================================
// Big Video
// ==============================================================================

const showBigVideoModal = ref(false);
const bigVideoInfo = ref<IRemark | null>(null);

const openBigVideoModal = (remark: IRemark) => {
  bigVideoInfo.value = remark;
  showBigVideoModal.value = true;
};


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


// ==============================================================================
// EVENT HANDLERS
// ==============================================================================
const closeDropdowns = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (isExportDropdownOpen.value && !target.closest('.relative')) {
    isExportDropdownOpen.value = false;
  }
};

// ==============================================================================
// LIFECYCLE HOOKS
// ==============================================================================
definePageMeta({
  middleware: ['auth', 'role'],
});

onMounted(async () => {
  await fetchCreators();
  document.addEventListener('click', closeDropdowns);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
});
</script>
