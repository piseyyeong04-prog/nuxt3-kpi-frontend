<!-- pages/dashboard/track-performance-staff/editors.vue -->
<template>
  <div class="min-h-screen dark:from-gray-900 dark:to-indigo-950 py-10">
    <div class="container mx-auto px-4 max-w-6xl">
      <div class="grid grid-cols-1 gap-8">
        <!-- Article Form -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-indigo-100 dark:border-indigo-900">
          <div class="flex items-center mb-6">
            <div class="mr-3 bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg">
              <Icon icon="basil:add-solid" class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Add Article</h2>
          </div>

          <form @submit.prevent="addArticleData" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Facebook Link URL
                </label>
                <div class="relative flex gap-2">
                  <div class="relative flex-grow">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Icon icon="iconoir:www" class="h-5 w-5 text-gray-400" />
                    </div>
                    <input v-model="facebook_link" type="text"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-3"
                      placeholder="https://web.facebook.com/watch/?v=your-video-id" required />
                  </div>

                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date Created
                </label>
                <div class="relative flex-grow cursor-pointer">
                  <div class="absolute inset-y-0 z-[1] left-0 flex items-center pl-3 pointer-events-none">
                    <Icon icon="clarity:date-line" class="h-5 w-5 text-gray-400" />
                  </div>
                  <Datepicker v-model="date_created" :enable-time-picker="true" time-picker-inline format="PPPp"
                    class="bg-gray-50 border cursor-pointer border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-3" />
                </div>
              </div>
              <!-- Creator select dropdown -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Writer
                </label>
                <select v-model="selectedCreator"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
                  required>
                  <option v-for="creator in editorsList" :key="creator.id" :value="creator.id">
                    {{ getUserName(creator.staff) || (auth.user?.first_name + ' ' + auth.user?.last_name) }}
                  </option>
                </select>
              </div>
            </div>


            <div class="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button type="submit"
                class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all flex items-center justify-center shadow-md hover:shadow-lg"
                :disabled="loading">
                <span v-if="loading" class="flex items-center">
                  <Icon icon="line-md:loading-twotone-loop" class="h-6 w-6 mr-2" />
                  Processing...
                </span>
                <span v-else class="flex items-center">
                  <Icon icon="basil:add-solid" class="h-6 w-6 mr-2 text-white" />
                  Add Videos
                </span>
              </button>
            </div>
          </form>
        </div>
        <!-- Performance Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5 border-l-4 border-indigo-500">
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Videos</p>
            <div class="flex items-center mt-2">
              <Icon icon="fluent:document-16-filled" class="h-8 w-8 text-indigo-500 mr-3" />
              <span class="text-2xl font-bold text-gray-800 dark:text-white">{{ getTotalArticlesCount(editors)
              }}</span>
            </div>
          </div>


          <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5 border-l-4 border-rose-500">
            <p class="text-sm text-gray-500 dark:text-gray-400">Completed Targets</p>
            <div class="flex items-center mt-2">
              <Icon icon="fluent-mdl2:completed" class="h-8 w-8 text-rose-500 mr-3" />
              <span class="text-2xl font-bold text-gray-800 dark:text-white">{{ getCompletedTargetsCount(editors)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Performance Table -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          <div class="p-5 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Staff Performance</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Track article engagement metrics for each team member
            </p>
          </div>
          <!-- Refresh Articles Button -->
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead
                class="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider">
                <tr>
                  <th scope="col" class="py-4 px-6">Name</th>
                  <th scope="col" class="py-4 px-6">Position</th>
                  <th scope="col" class="py-4 px-6">Department</th>
                  <th scope="col" class="py-4 px-6">Video Target</th>
                  <th scope="col" class="py-4 px-6">Status</th>
                  <th scope="col" class="py-4 px-6">{{ dateRangeHeader }}</th>
                  <th scope="col" class="py-4 px-6">Videos</th>
                  <th scope="col" class="py-4 px-6">{{ totalViewsHeader }}</th>
                  <th scope="col" class="py-4 px-6">Progress</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(creator, index) in editorsList" :key="creator.id"
                  class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td class="py-4 px-6 font-medium text-gray-800 dark:text-white">
                    {{ getUserName(creator.staff) || (auth.user?.first_name + ' ' + auth.user?.last_name) }}
                  </td>
                  <td class="py-4 px-6 text-gray-600 dark:text-gray-300">{{ creator.user_created?.title || 'N/A' }}</td>
                  <td class="py-4 px-6 text-gray-600 dark:text-gray-300">{{ creator.user_created?.department?.title ||
                    'N/A' }}
                  </td>
                  <td class="py-4 px-6 font-medium dark:text-white">{{ formatNumber(creator.target) }}</td>
                  <td class="py-4 px-6">
                    <span v-if="isCompleted(creator)"
                      class="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                      Completed
                    </span>
                    <span v-else
                      class="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-full text-xs font-medium">
                      In Progress
                    </span>
                  </td>
                  <td class="py-4 px-6 font-medium"
                    :class="index % 2 === 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'">
                    {{ filterRemarksByKpiMonth(creator.remarks).length }}
                  </td>
                  <td class="py-4 px-6">
                    <button @click="viewWriterArticles(creator.id)" class="px-3 py-1 flex bg-blue-500  dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50
                      text-white  dark:text-indigo-400 rounded-md transition-colors">
                      {{ filterRemarksByKpiMonth(creator.remarks).length | 0 }} Articles
                      <Icon icon="game-icons:click" width="24" height="24" />
                    </button>
                  </td>
                  <td class="py-4 px-6 font-medium dark:text-white"> {{ filterRemarksByKpiMonth(creator.remarks).length
                    | 0 }}</td>
                  <td class="py-4 px-6 w-40 dark:text-white">
                    <div class="flex items-center">
                      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                        <div class="h-2.5 rounded-full" :class="getProgressBarColor(calculatePercent(creator))"
                          :style="`width: ${Math.min(calculatePercent(creator), 100)}%`"></div>
                      </div>
                      <div class="whitespace-nowrap text-xs font-medium"
                        :class="getPercentClass(calculatePercent(creator))">
                        {{ calculatePercent(creator) }}%
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showArticlesModal" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
        @click="closeArticlesModal"></div>

      <!-- Center modal -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="w-full">
              <div class="flex justify-between items-center mb-5">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Articles by {{ selectedWriterName }}
                </h3>
                <button @click="closeArticlesModal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                  <Icon icon="heroicons:x-mark" class="h-6 w-6" />
                </button>
              </div>
              <!-- KPI Month Dropdown -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Filter by KPI Month
                </label>
                <select v-model="selectedKpiMonth" @change="filterWriterArticlesByKpi"
                  class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm rounded-lg p-2">
                  <option v-for="(period, key) in kpiPeriods" :key="key" :value="key">
                    {{ period.label }}
                  </option>
                </select>
              </div>
              <!-- summry report -->
              <div class="mb-4">
                <h4 class="text-md font-semibold text-gray-800 dark:text-white mb-2">Summary Report</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  <!-- Total Videos -->
                  <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Total Videos</p>
                    <p class="text-lg font-bold text-gray-800 dark:text-white">{{ writerArticles.length }}</p>
                  </div>

                  <!-- Status -->
                  <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <div>
                      <span
                        v-if="editors.find(c => c.id === selectedWriterId) && isCompleted(editors.find(c => c.id === selectedWriterId)!)"
                        class="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                        Completed
                      </span>
                      <span v-else
                        class="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-full text-xs font-medium">
                        In Progress
                      </span>
                    </div>
                  </div>

                  <!-- Progress % -->
                  <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                    <p class="text-lg font-bold text-gray-800 dark:text-white">
                      {{ averageEngagement }}%
                    </p>
                  </div>

                </div>
              </div>


              <!-- Articles table -->
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date Created
                      </th>
                      <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        URL
                      </th>

                      <th scope="col"
                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-if="writerArticles.length === 0">
                      <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No articles found for this writer.
                      </td>
                    </tr>
                    <tr v-else v-for="article in writerArticles" :key="article.id"
                      class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">

                      <!-- Date Created -->
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {{ article.date_created ? format(new Date(article.date_created), 'PPPp') : 'N/A' }}
                      </td>

                      <!-- Facebook Link -->
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        <a :href="article.facebook_link" target="_blank"
                          class="text-blue-600 dark:text-blue-400 hover:underline">
                          {{ article.facebook_link }}
                        </a>
                      </td>

                      <!-- Actions -->
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                        <button @click="editArticle(article)"
                          class="text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors">
                          <span class="flex items-center">
                            <Icon icon="heroicons:pencil-square" class="h-4 w-4 mr-1" />
                            Edit
                          </span>
                        </button>
                        <button @click="confirmDeleteArticle(article.id)"
                          class="text-rose-600 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors">
                          <span class="flex items-center">
                            <Icon icon="heroicons:trash" class="h-4 w-4 mr-1" />
                            Delete
                          </span>
                        </button>
                      </td>
                    </tr>
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" @click="closeArticlesModal"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Edit Article Modal -->
  <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
        @click="closeEditModal"></div>

      <!-- Center modal -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left min-h-[26rem] overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="w-full">
              <div class="flex justify-between items-center mb-5">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Edit Article
                </h3>
                <button @click="closeEditModal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                  <Icon icon="heroicons:x-mark" class="h-6 w-6" />
                </button>
              </div>

              <!-- Edit form -->
              <form @submit.prevent="updateArticle" class="space-y-10">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date Created
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 z-[1] left-0 flex items-center pl-3 pointer-events-none">
                      <Icon icon="clarity:date-line" class="h-5 w-5 text-gray-400" />
                    </div>
                    <Datepicker v-model="editForm.date_created" :enable-time-picker="true" format="PPPp"
                      class="bg-gray-50 border cursor-pointer border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-3" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website URL
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Icon icon="iconoir:www" class="h-5 w-5 text-gray-400" />
                    </div>
                    <input v-model="editForm.facebook_link" type="text"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-3"
                      placeholder="https://www.tech-cambodia.com/example-slug" required />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" @click="updateArticle"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 sm:ml-3 sm:w-auto sm:text-sm"
            :disabled="isEditLoading">
            <span v-if="isEditLoading" class="flex items-center">
              <Icon icon="line-md:loading-twotone-loop" class="h-5 w-5 mr-2" />
              Updating...
            </span>
            <span v-else>Save Changes</span>
          </button>
          <button type="button" @click="closeEditModal"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuthStore } from '~/store/useAuthStore';
import type { IResponse } from '~/types/api';
import Datepicker from 'vue3-datepicker';
import { format } from 'date-fns';
import { filterRemarksByKpiMonth } from '~/utils/editors';

// Import writer utilities
import {
  getTotalViews,
  isCompleted,
  calculatePercent,
  getPercentClass,
  getProgressBarColor,
  getCompletedTargetsCount,
  getTotalArticlesCount,
  getTotalViewsAcrossAll,
  type IEditor
} from '~/utils/editors';

// Import formatting utilities
import { formatDate, formatNumber, formatTotalViews, getKpiDateHeaders } from '~/utils/format';

const auth = useAuthStore();
const router = useRouter();
const loading = ref(false);

// Form data
const selectedCreator = ref('');
const facebook_link = ref('');
const article_title = ref('');
const date_created = ref(new Date());

// Format for Directus
const formattedDate = computed(() => {
  return format(date_created.value, "yyyy-MM-dd'T'HH:mm:ssXXX");
});

// Writers and staff data
const editors = ref<IEditor[]>([]);
const staffMembers = ref<Record<string, string>>({});

const editorsList = computed(() => {
  return editors.value;
});

const { dateRangeHeader, totalViewsHeader } = getKpiDateHeaders();

// Function to check if an article link already exists
const checkDuplicateArticleLink = async (link: string): Promise<boolean> => {
  try {
    // Normalize the URL to ensure consistent comparison
    let normalizedLink = link.trim();

    // Try to create URL object to handle different formats of the same URL
    try {
      const url = new URL(normalizedLink);
      // Remove trailing slashes for consistency
      normalizedLink = url.toString().replace(/\/$/, '');
    } catch (error) {
      // If URL is invalid, just use the trimmed version
      console.warn('Invalid URL format:', link);
    }

    // Query the API to check for existing articles with similar links
    const filter = encodeURIComponent(JSON.stringify({
      facebook_link: {
        _contains: normalizedLink
      }
    }));
    const fields = encodeURIComponent('id,facebook_link');
    const response = await useApi(`/items/remark_link_editor?filter=${filter}&fields=${fields}`, {
      method: 'GET'
    });

    // If there are any results, a duplicate exists
    if (response && Array.isArray((response as any).data) && (response as any).data.length > 0) {
      // Look through results to handle exact matches (accounting for trailing slashes, etc)
      for (const existingArticle of (response as any).data) {
        // Normalize the existing article link too
        let existingLink = existingArticle.facebook_link.trim();
        try {
          const url = new URL(existingLink);
          existingLink = url.toString().replace(/\/$/, '');
        } catch (error) {
          // Continue with the trimmed version
        }

        // Compare the normalized links
        if (normalizedLink === existingLink) {
          return true; // Duplicate found
        }
      }
    }
    // No duplicates found
    return false;

  } catch (error) {
    console.error('Error checking for duplicate article links:', error);
    // In case of error, assume it might be a duplicate to be safe
    throw new Error('Failed to check for duplicate articles');
  }
};


// ================= end check duplicate editors =================
// Add article data to the system
const addArticleData = async () => {
  if (!selectedCreator.value) {
    Swal.fire({
      title: 'Missing Information',
      text: 'Please select a writer',
      icon: 'warning'
    });
    return;
  }

  loading.value = true;

  try {

    // First check if this article link already exists
    const isDuplicate = await checkDuplicateArticleLink(facebook_link.value);

    if (isDuplicate) {
      Swal.fire({
        title: 'Duplicate Article',
        text: 'This article URL has already been added to the system',
        icon: 'error'
      });
      return;
    }
    // Create a new remark with the article data
    const remarkData = {
      title: article_title.value,
      facebook_link: facebook_link.value,
      date_created: formattedDate.value,
      status: 'active',
      editors: selectedCreator.value
    };

    // Save the remark
    const response = await useApi('/items/remark_link_editor', {
      method: 'POST',
      data: remarkData
    });

    Swal.fire({
      title: 'Success',
      text: 'Article data has been added successfully',
      icon: 'success'
    });

    // Reset form
    facebook_link.value = '';
    article_title.value = '';
    date_created.value = new Date();

    // Refresh creator data
    await fetcheditors();

  } catch (error: any) {
    console.error('Failed to save article data:', error);
    Swal.fire({
      title: 'Error',
      text: error?.data?.message || 'Failed to save article data',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};

// Get formatted name for a staff member
const getUserName = (staffId: string): string => {
  return staffMembers.value[staffId] || 'Unknown';
};

//================= View article modal =================

// Add these refs for the modal
const showArticlesModal = ref(false);
const selectedWriterId = ref<number | null>(null);
const selectedWriterName = ref('');
const writerArticles = ref<any[]>([]);

// Declare kpiPeriods and selectedKpiMonth refs
const kpiPeriods = ref<Record<string, any>>({});
const selectedKpiMonth = ref('');

// Replace the viewWriterArticles function with this:

const viewWriterArticles = (writerId: number) => {
  selectedWriterId.value = writerId;

  const writer = editors.value.find(c => c.id === writerId);
  if (writer) {
    selectedWriterName.value = getUserName(writer.staff) || (auth.user?.first_name + ' ' + auth.user?.last_name);
    writerArticles.value = writer.remarks || [];

    // Build KPI period list from all remarks
    kpiPeriods.value = getKpiPeriodsFromArticles(
      (writer.remarks || []).map((r: any) => ({
        ...r,
        date_created: typeof r.date_created === 'string'
          ? r.date_created
          : r.date_created instanceof Date
            ? r.date_created.toISOString()
            : ''
      }))
    );
    const sortedKeys = Object.keys(kpiPeriods.value).sort().reverse();
    selectedKpiMonth.value = sortedKeys[0] || '';
    filterWriterArticlesByKpi();
  }

  showArticlesModal.value = true;
};
const filterWriterArticlesByKpi = () => {
  const key = selectedKpiMonth.value;
  if (!key || !kpiPeriods.value[key]) return;

  const { from, to } = kpiPeriods.value[key];
  const writer = editors.value.find(c => c.id === selectedWriterId.value);
  if (!writer) return;

  writerArticles.value = (writer.remarks || []).filter(r => {
    const created = new Date(r.date_created);
    return created >= from && created <= to;
  });
};

// Add a function to close the modal
const closeArticlesModal = () => {
  showArticlesModal.value = false;
  selectedWriterId.value = null;
  writerArticles.value = [];
};
const totalViews = computed(() => {
  return getTotalViews(writerArticles.value);
});

const averageEngagement = computed(() => {
  const creator = editors.value.find(e => e.id === selectedWriterId.value);
  const target = Number(creator?.target) || 0;
  const achieved = writerArticles.value.length;
  return target > 0 ? ((achieved / target) * 100).toFixed(1) : '0.0';
});



// =================
// Fetch editors data
const fetcheditors = async () => {
  loading.value = true;
  try {
    // Fetch writers data
    const response = await useApi('/items/editors?fields=*,remarks.*,user_created.*,user_created.department.title', {
      method: 'GET'
    }) as IResponse<IEditor[]>;

    editors.value = response.data;

    // Get staff members info for display names
    try {
      const staffResponse = await useApi('/users', { method: 'GET' });
      const staffData = (staffResponse as IResponse<any>).data;

      staffData.forEach((staff: any) => {
        staffMembers.value[staff.id] = `${staff.first_name} ${staff.last_name}`;
      });
    } catch (err) {
      console.warn('Could not fetch staff names:', err);
    }

  } catch (error) {
    console.error('Failed to fetch writers:', error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to load writer data',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};
// function tto get + number of faebook_link 
// ================= Edit article =================
const showEditModal = ref(false);
const isEditLoading = ref(false);
const editForm = ref({
  id: null as number | null,
  date_created: new Date(),
  facebook_link: '',
});
// Function to open edit modal with article data
const editArticle = (article: any) => {
  editForm.value = {
    id: article.id,
    date_created: article.date_created ? new Date(article.date_created) : new Date(),
    facebook_link: article.facebook_link || '',
  };


  showEditModal.value = true;
};

// Function to close edit modal
const closeEditModal = () => {
  showEditModal.value = false;
  editForm.value = {
    id: null,
    date_created: new Date(),
    facebook_link: '',
  };
};

// Function to update article
const updateArticle = async () => {
  if (!editForm.value.id) return;

  try {
    isEditLoading.value = true;

    // Validate URL format
    try {
      new URL(editForm.value.facebook_link);
    } catch (error) {
      throw new Error('Please enter a valid URL');
    }

    // Update the article
    await useApi(`/items/remark_link_editor/${editForm.value.id}`, {
      method: 'PATCH',
      data: {
        date_created: editForm.value.date_created instanceof Date
          ? format(editForm.value.date_created, "yyyy-MM-dd'T'HH:mm:ssXXX")
          : editForm.value.date_created,
        facebook_link: editForm.value.facebook_link,
      }
    });

    // Update local state
    const articleIndex = writerArticles.value.findIndex(a => a.id === editForm.value.id);
    if (articleIndex !== -1) {
      writerArticles.value[articleIndex] = {
        ...writerArticles.value[articleIndex],
        facebook_link: editForm.value.facebook_link,
      };
    }

    // Refresh editors to update counts/metrics
    await fetcheditors();

    // Show success notification
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Article updated successfully',
      showConfirmButton: false,
      timer: 3000
    });

    // Close the modal
    closeEditModal();

  } catch (error: any) {
    console.error('Failed to update article:', error);
    Swal.fire({
      title: 'Error',
      text: error?.message || 'Failed to update article',
      icon: 'error'
    });
  } finally {
    isEditLoading.value = false;
  }
};

// Function to confirm deletion of an article
const confirmDeleteArticle = (articleId: number) => {
  Swal.fire({
    title: 'Delete Article',
    text: 'Are you sure you want to delete this article? This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteArticle(articleId);
    }
  });
};

// Function to delete an article
const deleteArticle = async (articleId: number) => {
  try {
    // Delete the article
    await useApi(`/items/remark_link_editor/${articleId}`, {
      method: 'DELETE'
    });

    // Remove from local state
    writerArticles.value = writerArticles.value.filter(a => a.id !== articleId);

    // If this was the last article and the filtered array is now empty
    if (writerArticles.value.length === 0) {
      // Refresh the editors data to ensure everything is in sync
      await fetcheditors();
    } else {
      // Otherwise just update the creator's data
      const updatedCreator = editors.value.find(c => c.id === selectedWriterId.value);
      if (updatedCreator) {
        updatedCreator.remarks = updatedCreator.remarks?.filter(r => r.id !== articleId) || [];
      }
      await fetcheditors();
    }
    // Show success notification
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Article deleted successfully',
      showConfirmButton: false,
      timer: 3000
    });
  } catch (error: any) {
    console.error('Failed to delete article:', error);
    Swal.fire({
      title: 'Error',
      text: error?.data?.message || 'Failed to delete article',
      icon: 'error'
    });
  }
};

// ================== End delete article =================
// Set default selected creator when list loads
watch(editorsList, (neweditorsList) => {
  if (neweditorsList.length > 0 && !selectedCreator.value) {
    selectedCreator.value = String(neweditorsList[0].id);
  }
}, { immediate: true });

// Set page metadata and auth middleware
definePageMeta({
  middleware: ['auth', 'role'],
});

// Fetch data on component mount
onMounted(async () => {
  await fetcheditors();
});


// function filterWriterArticlesByKpi() {
//   throw new Error('Function not implemented.');
// }
</script>