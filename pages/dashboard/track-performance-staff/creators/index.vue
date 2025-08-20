<!-- pages/dashboard/track-performance-staff/creators/index.vue -->
<template>
  <div class="min-h-screen p-6">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Add Video Form -->
      <div
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl shadow-gray-100 dark:shadow-gray-900/30 overflow-hidden">
        <!-- Header with gradient -->
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <div class="flex items-center gap-3">
            <div class="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Icon icon="basil:add-solid" class="h-6 w-6 text-white" />
            </div>
            <h2 class="text-xl font-semibold text-white">Add Facebook Video</h2>
          </div>
        </div>
        <!-- Form Content -->
        <div class="p-6 space-y-6">
          <form @submit.prevent="addVideoData" class="space-y-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Facebook Page</label>
              <select v-model="selectedPage"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white appearance-none cursor-pointer"
                required>
                <option value="TC">Page: Technology Cambodia</option>
                <option value="BC">Page: Business Cambodia</option>
                <option value="HC">Page: Healthy Cambodia</option>
              </select>
            </div>

            <!-- URL and Creator Selection -->
            <div class="grid md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Video URL</label>
                <div class="relative">
                  <input v-model="videoUrl" type="text"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900 dark:text-white"
                    placeholder="2538985403127510" required />
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Icon icon="mdi:facebook" class="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Creator</label>
                <select v-model="selectedCreator"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white appearance-none cursor-pointer"
                  required>
                  <option value="" disabled>Select Creator</option>
                  <option v-for="creator in creatorsList" :key="creator.id" :value="creator.id">
                    {{ getUserName(creator.staff) || (auth.user?.first_name + ' ' + auth.user?.last_name) + ' ' +
                      auth.user?.department?.title }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Video Title -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Video Title (Optional)</label>
              <input v-model="videoTitle" type="text"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900 dark:text-white"
                placeholder="Video Title will be auto-generated (After Click Fetch Data Button)" />
            </div>

            <!-- Big Video Toggle -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Video Type</label>
              <div class="flex gap-4">
                <!-- Regular Video -->
                <label class="flex items-center cursor-pointer">
                  <input v-model="isBigVideo" type="radio" value="no" class="sr-only" required />
                  <div class="flex items-center gap-2 px-4 py-2 border-2 rounded-xl transition-all duration-200" :class="isBigVideo === 'no'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 text-gray-700 dark:text-gray-300'">
                    <Icon icon="mdi:video" class="h-5 w-5" />
                    <span class="font-medium">Regular Video</span>
                  </div>
                </label>

                <!-- Big Video -->
                <label class="flex items-center cursor-pointer"
                  :class="{ 'opacity-50 cursor-not-allowed': isBigVideoDisabled }">
                  <input v-model="isBigVideo" type="radio" value="yes" class="sr-only" :disabled="isBigVideoDisabled" />
                  <div class="flex items-center gap-2 px-4 py-2 border-2 rounded-xl transition-all duration-200" :class="[
                    isBigVideo === 'yes' && !isBigVideoDisabled
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : isBigVideoDisabled
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 text-gray-700 dark:text-gray-300'
                  ]">
                    <Icon icon="mdi:video-high-definition" class="h-5 w-5" />
                    <span class="font-medium">Big Video</span>
                    <span v-if="isBigVideoDisabled" class="text-xs text-red-500 ml-1">({{ Math.floor(minBigVideoLength / 60) }}min+ required)</span>
                  </div>
                </label>
              </div>

              <!-- Show video length info if available -->
              <div v-if="fbVideoData?.length" class="text-xs text-gray-500 dark:text-gray-400">
                Current video length: {{ formatDuration(fbVideoData.length) }}
                <span v-if="fbVideoData.length < minBigVideoLength" class="text-red-500 ml-1">
                  (Too short for Big Video - minimum {{ Math.floor(minBigVideoLength / 60) }} minutes required)
                </span>
              </div>
            </div>
            <!-- Impact Video Toggle -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Impact Video</label>
              <div class="flex gap-4">
                <!-- Regular Video -->
                <label class="flex items-center cursor-pointer">
                  <input v-model="isImpactVideo" type="radio" value="no" class="sr-only" required />
                  <div class="flex items-center gap-2 px-4 py-2 border-2 rounded-xl transition-all duration-200" :class="isImpactVideo === 'no'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 text-gray-700 dark:text-gray-300'">
                    <Icon icon="mdi:video" class="h-5 w-5" />
                    <span class="font-medium">No</span>
                  </div>
                </label>

                <!-- Impact Video -->
                <label class="flex items-center cursor-pointer">
                  <input v-model="isImpactVideo" type="radio" value="yes" class="sr-only" />
                  <div class="flex items-center gap-2 px-4 py-2 border-2 rounded-xl transition-all duration-200" :class="isImpactVideo === 'yes'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 text-gray-700 dark:text-gray-300'">
                    <Icon icon="mdi:star" class="h-5 w-5" />
                    <span class="font-medium">Yes</span>
                  </div>
                </label>
              </div>

              <!-- Impact Video Description -->
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Impact videos are high-performing content that significantly contributes to engagement and reach.
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button type="submit"
                class=" bg-gradient-to-r flex items-center justify-center from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                :disabled="loading || fbLoading">
                <Icon v-if="loading || fbLoading" icon="mdi:loading" class="animate-spin h-5 w-5 mr-2" />
                <Icon v-else icon="mdi:plus" class="h-5 w-5 mr-2" />
                {{ loading || fbLoading ? 'Processing...' : 'Add Video' }}
              </button>

              <button type="button" @click="fetchFromFacebook"
                class="px-6 py-3 border-2 flex items-center justify-center border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                :disabled="!videoUrl">
                <Icon v-if="fbLoading" icon="mdi:loading" class="animate-spin h-5 w-5 mr-2" />
                <Icon v-else icon="mdi:download" class="h-5 w-5 mr-2" />
                {{ fbLoading ? 'Fetching...' : 'Fetch Data' }}
              </button>
            </div>
          </form>

          <!-- Video Preview -->
          <div v-if="fbVideoData"
            class="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600">
            <div class="flex items-center gap-3 mb-4">
              <div class="bg-green-100 dark:bg-green-900/30 p-2 rounded-xl">
                <Icon icon="mdi:eye" class="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Video Preview</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div class="flex items-center gap-2 mb-1">
                    <Icon icon="mdi:format-title" class="h-4 w-4 text-gray-500" />
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Title</span>
                  </div>
                  <p class="text-gray-900 dark:text-white font-medium">{{ fbVideoData.title || 'N/A' }}</p>
                </div>

                <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div class="flex items-center gap-2 mb-1">
                    <Icon icon="mdi:eye" class="h-4 w-4 text-gray-500" />
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Views</span>
                  </div>
                  <p class="text-gray-900 dark:text-white font-medium">{{ formatNumber(fbVideoData.views?.toString() ||
                    '0') }}</p>
                </div>
              </div>

              <div class="space-y-3">
                <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div class="flex items-center gap-2 mb-1">
                    <Icon icon="mdi:calendar" class="h-4 w-4 text-gray-500" />
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Created</span>
                  </div>
                  <p class="text-gray-900 dark:text-white font-medium">{{ formatDate(fbVideoData.created_time) }}</p>
                </div>

                <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div class="flex items-center gap-2 mb-1">
                    <Icon icon="mdi:identifier" class="h-4 w-4 text-gray-500" />
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Video ID</span>
                  </div>
                  <p class="text-gray-900 dark:text-white font-mono text-sm">{{ fbVideoData.id }}</p>
                </div>


              </div>
              <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                <div class="flex items-center gap-2 mb-1">
                  <Icon icon="mdi:timer-outline" class="h-4 w-4 text-gray-500" />
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Video Length</span>
                </div>
                <p class="text-gray-900 dark:text-white font-medium">
                  {{ fbVideoData.length ? formatDuration(fbVideoData.length) : 'N/A' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Summary Cards -->
      <!-- Performance Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Creators -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
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
            <div
              class="bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 p-4 rounded-2xl">
              <Icon icon="mdi:account-group" class="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>

        <!-- Big Video Views (Filtered by KPI Month) -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Big Video Views</h3>
                <div class="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
                  <span class="text-xs font-medium text-red-600 dark:text-red-400">Big Videos</span>
                </div>
              </div>
              <p class="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                {{
                  formatTotalViews(
                    creatorsList.reduce(
                      (sum, c) =>
                        sum + parseInt(getBigVideoViews(filterRemarksByKpiMonth(c.remarks || [])) || '0'),
                      0
                    ).toString()
                  )
                }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ dateRangeHeader }}</p>
            </div>
            <!-- <div
              class="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 p-4 rounded-2xl">
              <Icon icon="mdi:video-high-definition" class="h-8 w-8 text-red-600 dark:text-red-400" />
            </div> -->
          </div>
        </div>
        <!-- Total Videos (Filtered by KPI Month) -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Total Videos</h3>
                <div class="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                  <span class="text-xs font-medium text-blue-600 dark:text-blue-400">FB</span>
                </div>
              </div>
              <p class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {{creatorsList.reduce((sum, c) => sum + filterRemarksByKpiMonth(c.remarks || []).length, 0)}}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ dateRangeHeader }}</p>
            </div>
            <div
              class="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-2xl">
              <Icon icon="mdi:video-outline" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <!-- Total Views (Filtered by KPI Month) -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Total Views</h3>
                <div class="bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                  <span class="text-xs font-medium text-purple-600 dark:text-purple-400">Views</span>
                </div>
              </div>
              <p class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {{formatTotalViews(
                  creatorsList.reduce(
                    (sum, c) => sum + parseInt(getTotalViews(filterRemarksByKpiMonth(c.remarks || [])) || '0'),
                    0
                  ).toString()
                )}}
              </p>


              <p class="text-sm text-gray-500 dark:text-gray-400">{{ dateRangeHeader }}</p>
            </div>
            <div
              class="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-2xl">
              <Icon icon="mdi:eye-outline" class="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
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
            <!-- <button @click="refreshAllVideos"
              class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
              :disabled="globalRefreshLoading">
              {{ globalRefreshLoading ? 'Refreshing...' : 'Reload' }}
            </button> -->

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
            <thead class="bg-gray-50 dark:bg-gray-700 dark:text-light">
              <tr>
                <th class="px-4 py-3 text-left">Name</th>
                <!-- <th class="px-4 py-3 text-left">Position</th>
                <th class="px-4 py-3 text-left">Department</th> -->
                <th class="px-4 py-3 text-left">Target</th>
                <!-- <th class="px-4 py-3 text-left">Status</th> -->
                <!-- <th class="px-4 py-3 text-left">{{ dateRangeHeader }}</th> -->
                <th class="px-4 py-3 text-left">Videos</th>
                <!-- Big Video -->
                <th class="px-4 py-3 text-left">Big Videos</th>
                <th class="px-4 py-3 text-left">Big Video Views</th>
                <th class="px-4 py-3 text-left">Impact Videos</th>
                <th class="px-4 py-3 text-left">Impact Video Views</th>
                <th class="px-4 py-3 text-left">{{ totalViewsHeader }}</th>
                <th class="px-4 py-3 text-left">Progress</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="creator in creatorsList" :key="creator.id"
                class="border-b hover:bg-gray-50 dark:hover:bg-dark dark:text-light">

                <td class="px-4 py-3 -medium">
                  <p class="font-medium dark:text-gray-200">
                    {{ getUserName(creator.staff) || (auth.user?.first_name + ' ' + auth.user?.last_name) }}

                  </p>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ creator.user_created?.title || 'N/A' }}
                  </span> <br>
                  <span class="text-xs" :class="{
                    'text-blue-600': creator.user_created?.department?.id === 1,
                    'text-red-600': creator.user_created?.department?.id === 2,
                    'text-green-600': creator.user_created?.department?.id === 3,
                    'text-gray-500 dark:text-gray-400': ![1, 2, 3].includes(creator.user_created?.department?.id)
                  }">
                    {{ creator.user_created?.department?.title || 'N/A' }}
                  </span>
                </td>

                <!-- <td class="px-4 py-3">{{ creator.user_created?.title || 'N/A' }}</td>
                <td class="px-4 py-3">{{ creator.user_created?.department?.title || 'N/A' }}</td> -->
                <td class="px-4 py-3 dark:text-gray-200">
                  {{ formatNumber(creator.target) }} <br>
                  <span class="px-2 py-1 rounded-full text-xs" :class="isCompleted({ ...creator, remarks: filterRemarksByKpiMonth(creator.remarks) })
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'">
                    {{ isCompleted({ ...creator, remarks: filterRemarksByKpiMonth(creator.remarks) })
                      ? 'Completed'
                      : 'In Progress' }}
                  </span>
                </td>

                <!-- <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded-full text-xs" :class="isCompleted({ ...creator, remarks: filterRemarksByKpiMonth(creator.remarks) })
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'">
                    {{ isCompleted({ ...creator, remarks: filterRemarksByKpiMonth(creator.remarks) })
                      ? 'Completed'
                      : 'In Progress' }}
                  </span>
                </td> -->

                <!-- <td class="px-4 py-3 font-medium">
                  {{ getTotalViews(filterRemarksByKpiMonth(creator.remarks)) }}
                </td> -->

                <td class="px-4 space-y-1 py-3">
                  <button @click="handleRemarkClick(creator)"
                    class="px-2 py-1 bg-orange-500 text-white dark:bg-orange-800 rounded text-xs">
                    {{ filterRemarksByKpiMonth(creator.remarks).length }} Videos
                  </button> <br>
                  <button @click="viewCreatorVideos(creator)" class="px-2 py-1 bg-green-500 dark:bg-green-800 text-white rounded text-xs">
                    View History
                  </button>
                </td>

                <td class="px-4 py-3 font-medium ">
                  {{ countBigVideos(filterRemarksByKpiMonth(creator.remarks)) }}
                </td>

                <td class="px-4 py-3 font-medium">
                  {{ formatTotalViews(getBigVideoViews(filterRemarksByKpiMonth(creator.remarks))) }}
                </td>
                <td class="px-4 py-3 font-medium">
                  {{ countImpactVideos(filterRemarksByKpiMonth(creator.remarks)) }}
                </td>

                <td class="px-4 py-3 font-medium">
                  {{ formatTotalViews(getImpactVideoViews(filterRemarksByKpiMonth(creator.remarks))) }}
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

<!-- Enhanced History Modal Section -->
<Transition name="fade">
  <div v-if="showHistoryModal" class="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] flex flex-col">
      <!-- Enhanced Header with Summary Stats -->
      <div class="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
        <div class="flex-1">
          <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white truncate pr-4 mb-2">
            KPI History for {{ selectedCreatorName }}
          </h3>
          
          <!-- Summary Statistics Row -->
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
            <!-- Total Videos -->
            <div class="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg text-center">
              <div class="font-bold text-blue-700 dark:text-blue-400 text-lg">{{ creatorVideos.length }}</div>
              <div class="text-blue-600 dark:text-blue-300">Total Videos</div>
            </div>
            
            <!-- Big Videos -->
            <div class="bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg text-center">
              <div class="font-bold text-red-700 dark:text-red-400 text-lg">{{ countBigVideos(creatorVideos) }}</div>
              <div class="text-red-600 dark:text-red-300">Big Videos</div>
            </div>
            
            <!-- Impact Videos -->
            <div class="bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg text-center">
              <div class="font-bold text-orange-700 dark:text-orange-400 text-lg">{{ countImpactVideos(creatorVideos) }}</div>
              <div class="text-orange-600 dark:text-orange-300">Impact Videos</div>
            </div>
            
            <!-- Total Views -->
            <div class="bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg text-center">
              <div class="font-bold text-purple-700 dark:text-purple-400 text-lg">{{ formatTotalViews(getTotalViews(creatorVideos)) }}</div>
              <div class="text-purple-600 dark:text-purple-300">Total Views</div>
            </div>
            
            <!-- Big Video Views -->
            <div class="bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg text-center">
              <div class="font-bold text-red-700 dark:text-red-400 text-lg">{{ formatTotalViews(getBigVideoViews(creatorVideos)) }}</div>
              <div class="text-red-600 dark:text-red-300">Big Video Views</div>
            </div>
            
            <!-- Impact Video Views -->
            <div class="bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg text-center">
              <div class="font-bold text-orange-700 dark:text-orange-400 text-lg">{{ formatTotalViews(getImpactVideoViews(creatorVideos)) }}</div>
              <div class="text-orange-600 dark:text-orange-300">Impact Video Views</div>
            </div>
          </div>
        </div>
        
        <button @click="showHistoryModal = false"
          class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl p-2 -m-2 ml-4">
          ✕
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6">
        <!-- Existing Summary Block (simplified since we have header stats now) -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 text-sm text-gray-700 dark:text-gray-200">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
            <div><strong>KPI Period:</strong> {{ kpiPeriods[selectedMonth]?.label }}</div>
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
            <div><strong>Target:</strong> {{ formatNumber(currentCreator?.target || 0) }} views</div>
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
              <div class="flex items-center gap-2">
                <span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 
                           text-xs font-medium px-2.5 py-0.5 rounded">
                  #{{ index + 1 }}
                </span>
                <!-- Video Type Badges -->
                <span v-if="item.big_video === 'yes'" 
                  class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 
                         text-xs font-medium px-2.5 py-0.5 rounded">
                  Big Video
                </span>
                <span v-if="item.impact_video === 'yes'" 
                  class="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 
                         text-xs font-medium px-2.5 py-0.5 rounded">
                  Impact Video
                </span>
              </div>
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
                <a :href="item.video_link" target="_blank" class="text-blue-600 hover:underline text-sm break-all">
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

              <!-- Video Length for Big Videos -->
              <div v-if="item.big_video === 'yes' && item.length_big_video" class="pt-2 border-t border-gray-200 dark:border-gray-600">
                <div class="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Video Length</div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDuration(item.length_big_video) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Desktop/Tablet Table View (>= md) -->
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
                    Big Video
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Impact Video
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Length
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
                    <a :href="item.video_link" target="_blank" class="hover:underline block truncate max-w-xs">
                      {{ item.video_link }}
                    </a>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatNumber(item.view || 0) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span v-if="item.big_video === 'yes'" 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                             bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Big Video
                    </span>
                    <span v-else class="text-gray-400 dark:text-gray-500 text-xs">—</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span v-if="item.impact_video === 'yes'" 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                             bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      Impact Video
                    </span>
                    <span v-else class="text-gray-400 dark:text-gray-500 text-xs">—</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span v-if="item.length_big_video && item.length_big_video > 0">
                      {{ formatDuration(item.length_big_video) }}
                    </span>
                    <span v-else class="text-gray-400 dark:text-gray-500">—</span>
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
  getTotalViewsAcrossAll, getTotalVideosCount, countBigVideos, getBigVideoViews, countImpactVideos, getImpactVideoViews
} from '~/utils/creators';
import { extractVideoId, isValidVideoInput, buildFacebookVideoUrl } from '~/utils/facebook';
import { formatDate, formatNumber, formatTotalViews, getKpiDateHeaders } from '~/utils/format';

// Global type declarations
declare global {
  interface Window {
    editRemark: (remarkId: string) => Promise<void>;
    deleteRemark: (remarkId: string, creatorName: string, videoTitle: string) => Promise<void>;
    refreshViewCount: (remarkId: string) => Promise<void>;
    refreshAllViewsForCreator: () => Promise<void>; // ✅ Add this line
  }
}
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
};


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
const isImpactVideo = ref('no');


// Data
const creators = ref<ICreator[]>([]);
const staffMembers = ref<Record<string, string>>({});

// ==============================================================================
// COMPUTED PROPERTIES - Add this new computed property
// ==============================================================================
const selectedCreatorData = computed(() => {
  return creatorsList.value.find(c => c.id === parseInt(selectedCreator.value));
});

const minBigVideoLength = computed(() => {
  return selectedCreatorData.value?.min_big_video_lenght || 1500; // fallback to 1500
});

// ==============================================================================
// MODIFIED COMPUTED PROPERTY
// ==============================================================================
const isBigVideoDisabled = computed(() => {
  const length = fbVideoData.value?.length || 0;
  return length > 0 && length < minBigVideoLength.value;
});

const handleBigVideoChange = () => {
  const length = fbVideoData.value?.length || 0;

  if (length < 1500) {
    isBigVideo.value = 'no';
    showWarning('Videos shorter than 25 minutes cannot be uploaded as Big Video');
  }
};

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
// Fetch creators data with pagination support
const fetchCreators = async () => {
  loading.value = true;
  try {
    let allCreators: ICreator[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    console.log('Starting to fetch creators with remarks...');

    // Keep fetching until we get all records
    while (hasMore) {
      console.log(`Fetching creators batch: offset=${offset}, limit=${limit}`);

      // Use deep limit to ensure all remarks are fetched for each creator
      const response = await useApi(`/items/creators?fields=*,remarks.*,user_created.*,user_created.department.title&limit=${limit}&offset=${offset}&deep[remarks][_limit]=-1`, {
        method: 'GET'
      }) as IResponse<ICreator[]>;

      const fetchedData = response.data || [];
      console.log(`Received ${fetchedData.length} creators in this batch`);

      // Log remarks count for debugging
      fetchedData.forEach((creator, index) => {
        const remarksCount = creator.remarks?.length || 0;
        console.log(`Creator ${index + 1}: ${remarksCount} remarks`);
      });

      allCreators = [...allCreators, ...fetchedData];

      // Check if we need to fetch more
      hasMore = fetchedData.length === limit;
      offset += limit;

      console.log(`Total creators so far: ${allCreators.length}, hasMore: ${hasMore}`);

      // Optional: Add a small delay to prevent overwhelming the server
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Finished fetching all ${allCreators.length} creators`);

    // Log total remarks across all creators
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

// Update fetchStaffMembers to also support pagination
const fetchStaffMembers = async () => {
  try {
    let allStaff: any[] = [];
    let staffOffset = 0;
    const limit = 100;
    let hasMoreStaff = true;

    console.log('Starting to fetch staff members...');

    // Also paginate staff data if needed
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

// Alternative approach: Fetch creators first, then fetch all remarks separately
const fetchCreatorsAlternative = async () => {
  loading.value = true;
  try {
    // Step 1: Fetch all creators without remarks
    let allCreators: ICreator[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    console.log('Step 1: Fetching all creators...');

    while (hasMore) {
      const response = await useApi(`/items/creators?fields=*,user_created.*,user_created.department.title&limit=${limit}&offset=${offset}`, {
        method: 'GET'
      }) as IResponse<ICreator[]>;

      const fetchedData = response.data || [];
      allCreators = [...allCreators, ...fetchedData];
      hasMore = fetchedData.length === limit;
      offset += limit;

      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Step 1 complete: Fetched ${allCreators.length} creators`);

    // Step 2: Fetch ALL remarks and group by creator
    let allRemarks: any[] = [];
    let remarksOffset = 0;
    let hasMoreRemarks = true;

    console.log('Step 2: Fetching all remarks...');

    while (hasMoreRemarks) {
      const remarksResponse = await useApi(`/items/remark_link?fields=*&limit=${limit}&offset=${remarksOffset}`, {
        method: 'GET'
      });

      const fetchedRemarks = (remarksResponse as any).data || [];
      allRemarks = [...allRemarks, ...fetchedRemarks];
      hasMoreRemarks = fetchedRemarks.length === limit;
      remarksOffset += limit;

      console.log(`Fetched ${fetchedRemarks.length} remarks in this batch. Total: ${allRemarks.length}`);

      if (hasMoreRemarks) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Step 2 complete: Fetched ${allRemarks.length} total remarks`);

    // Step 3: Group remarks by creator and attach to creators
    const remarksByCreator: Record<string, any[]> = {};
    allRemarks.forEach(remark => {
      if (remark.creators) {
        if (!remarksByCreator[remark.creators]) {
          remarksByCreator[remark.creators] = [];
        }
        remarksByCreator[remark.creators].push(remark);
      }
    });

    // Attach remarks to creators
    allCreators.forEach(creator => {
      creator.remarks = remarksByCreator[creator.id] || [];
      console.log(`Creator ${creator.id}: ${creator.remarks.length} remarks attached`);
    });

    creators.value = allCreators;
    await fetchStaffMembers();

  } catch (error) {
    console.error('Failed to fetch creators:', error);
    showError('Failed to load creator data');
  } finally {
    loading.value = false;
  }
};

// const fetchStaffMembers = async () => {
//   try {
//     const staffResponse = await useApi('/users', { method: 'GET' });
//     const staffData = (staffResponse as IResponse<any>).data;

//     staffData.forEach((staff: any) => {
//       staffMembers.value[staff.id] = `${staff.first_name} ${staff.last_name}`;
//     });
//   } catch (err) {
//     console.warn('Could not fetch staff names:', err);
//   }
// };

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
    big_video: isBigVideo.value,
    impact_video: isImpactVideo.value,
    length_big_video: typeof fbVideoData.value?.length === 'number' ? fbVideoData.value.length : 0,
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

  kpiPeriods.value = getKpiPeriodsFromCreators(allVideos)

  const sortedKeys = Object.keys(kpiPeriods.value).sort((a, b) =>
    new Date(kpiPeriods.value[b].from).getTime() - new Date(kpiPeriods.value[a].from).getTime()
  )
  selectedMonth.value = sortedKeys[0] || 'current'

  filterVideosByKpiPeriod()
  showHistoryModal.value = true
}


const filterVideosByKpiPeriod = () => {
  if (!kpiPeriods.value[selectedMonth.value]) return;

  const { from, to } = kpiPeriods.value[selectedMonth.value];
  const all = creators.value.find(c => c.id === Number(selectedCreatorId.value))?.remarks || [];

  creatorVideos.value = all.filter(video => {
    const created = new Date(video.date_created);
    return created >= from && created < to;
  });
};


// ==============================================================================
// FACEBOOK VIDEO FUNCTIONS
// ==============================================================================
const fetchFromFacebook = async () => {
  const videoId = validateVideoUrl();
  if (!videoId) return;

  await fetchVideoData(videoId, selectedPage.value); // ✅ Add page argument

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
   const length = fbVideoData.value?.length || 0;
  if (isBigVideo.value === 'yes' && length < minBigVideoLength.value) {
    showWarning(`Videos shorter than ${Math.floor(minBigVideoLength.value / 60)} minutes cannot be uploaded as Big Video`);
    return;
  }
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
  isImpactVideo.value = 'no'; // Add this line
  fbVideoData.value = null;
};

// ==============================================================================
// Select Page
// ==============================================================================
// auto select page by department
const selectedPage = ref<'TC' | 'BC' | 'HC'>('TC');
// Automatically set selectedPage based on department ID
watchEffect(() => {
  const length = fbVideoData.value?.length || 0;

  // // Prevent "Big Video" selection if video is too short
  // if (isBigVideo.value === 'yes' && length > 0 && length < 1500) {
  //   isBigVideo.value = 'no';
  //   showWarning('Videos shorter than 25 minutes cannot be marked as Big Video');
  // }
  const departmentId = Number(auth.user?.department?.id);

  if (departmentId === 1) {
    selectedPage.value = 'TC';
  } else if (departmentId === 2) {
    selectedPage.value = 'BC';
  } else if (departmentId === 3) {
    selectedPage.value = 'HC';
  }
});
// Add a computed property to disable the Big Video option when video is too short:
// const isBigVideoDisabled = computed(() => {
//   const length = fbVideoData.value?.length || 0;
//   return length > 0 && length < 1500;
// });
const getPageCodeFromCreator = (creator: ICreator): 'TC' | 'BC' | 'HC' => {
  const deptId =
    creator?.user_created?.department?.id ??
    creator?.user_created?.department_id ??
    creator?.department?.id ??
    auth.user?.department?.id;

  if (deptId === 2) return 'BC';
  if (deptId === 3) return 'HC';
  return 'TC';
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
  // Get the creator for this remark to get their min_big_video_lenght
  const remarkCreator = creatorsList.value.find(c => 
    c.remarks?.some(r => r.id === remark.id)
  );
  const minLength = remarkCreator?.min_big_video_lenght || 1500;

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
        <label class="block text-sm font-medium text-gray-700 mb-1">Video Length (seconds)</label>
        <input id="swal-length" type="number" min="0" class="w-full p-2 border rounded" 
          value="${remark.length_big_video || 0}" ${auth.user?.role?.name !== 'Administrator' ? 'readonly' : ''}>
        <div id="length-display" class="text-xs text-gray-500 mt-1">
          Current: ${Math.floor((remark.length_big_video || 0) / 60)}m ${Math.floor((remark.length_big_video || 0) % 60)}s
          ${(remark.length_big_video || 0) < minLength ?
            `<span class="text-red-500">(Less than ${Math.floor(minLength / 60)} minutes)</span>` :
            `<span class="text-green-500">(${Math.floor(minLength / 60)}+ minutes - Big Video eligible)</span>`
          }
        </div>
        ${auth.user?.role?.name !== 'Administrator' ? 
          '<div class="text-xs text-orange-600 mt-1">⚠️ Only administrators can update video length</div>' : 
          '<div class="text-xs text-blue-600 mt-1">✓ You can update the video length as administrator</div>'
        }
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Big Video?</label>
        <select id="swal-bigvideo" class="w-full p-2 border rounded">
          <option value="no" ${remark.big_video === 'no' ? 'selected' : ''}>No</option>
          <option value="yes" ${remark.big_video === 'yes' ? 'selected' : ''} 
            ${(remark.length_big_video || 0) < minLength ? 'disabled' : ''}>
            Yes${(remark.length_big_video || 0) < minLength ? ` (Video too short - min ${Math.floor(minLength / 60)} minutes)` : ''}
          </option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Impact Video?</label>
        <select id="swal-impactvideo" class="w-full p-2 border rounded">
          <option value="no" ${remark.impact_video === 'no' ? 'selected' : ''}>No</option>
          <option value="yes" ${remark.impact_video === 'yes' ? 'selected' : ''}>Yes</option>
        </select>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Update',
    didOpen: () => {
      const lengthInput = document.getElementById('swal-length') as HTMLInputElement;
      const bigVideoSelect = document.getElementById('swal-bigvideo') as HTMLSelectElement;
      const lengthDisplay = document.getElementById('length-display') as HTMLDivElement;

      // Function to update display and big video options
      const updateVideoStatus = (length: number) => {
        // Update length display
        const minutes = Math.floor(length / 60);
        const seconds = Math.floor(length % 60);
        
        const statusText = length < minLength ? 
          `<span class="text-red-500">(Less than ${Math.floor(minLength / 60)} minutes)</span>` :
          `<span class="text-green-500">(${Math.floor(minLength / 60)}+ minutes - Big Video eligible)</span>`;
          
        lengthDisplay.innerHTML = `Current: ${minutes}m ${seconds}s ${statusText}`;
        
        // Update Big Video select options
        const yesOption = bigVideoSelect.querySelector('option[value="yes"]') as HTMLOptionElement;
        
        if (length < minLength) {
          // Disable "Yes" option and update text
          yesOption.disabled = true;
          yesOption.textContent = `Yes (Video too short - min ${Math.floor(minLength / 60)} minutes)`;
          
          // Force selection to "No" if currently "Yes"
          if (bigVideoSelect.value === 'yes') {
            bigVideoSelect.value = 'no';
          }
        } else {
          // Enable "Yes" option and clean text
          yesOption.disabled = false;
          yesOption.textContent = 'Yes';
        }
      };

      // Listen for length changes (only if admin)
      if (auth.user?.role?.name === 'Administrator') {
        lengthInput.addEventListener('input', (e) => {
          const target = e.target as HTMLInputElement;
          const length = parseInt(target.value) || 0;
          updateVideoStatus(length);
        });
      }

      // Initialize on modal open
      const initialLength = parseInt(lengthInput.value) || 0;
      updateVideoStatus(initialLength);
    },
    preConfirm: () => {
      const lengthValue = parseInt((document.getElementById('swal-length') as HTMLInputElement).value) || 0;
      const bigVideoValue = (document.getElementById('swal-bigvideo') as HTMLSelectElement).value;
      const impactVideoValue = (document.getElementById('swal-impactvideo') as HTMLSelectElement).value;

      // Final validation
      if (bigVideoValue === 'yes' && lengthValue < minLength) {
        Swal.showValidationMessage(`Videos shorter than ${Math.floor(minLength / 60)} minutes cannot be marked as Big Video`);
        return false;
      }

      return {
        title: (document.getElementById('swal-title') as HTMLInputElement).value,
        video_link: (document.getElementById('swal-url') as HTMLInputElement).value,
        view: (document.getElementById('swal-views') as HTMLInputElement).value,
        date_created: new Date((document.getElementById('swal-date') as HTMLInputElement).value).toISOString(),
        length_big_video: auth.user?.role?.name === 'Administrator' ? lengthValue : remark.length_big_video,
        big_video: bigVideoValue,
        impact_video: impactVideoValue
      };
    }
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

  return `
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
        Videos for ${creatorName}
      </h3>
      <button onclick="window.refreshAllViewsForCreator()" 
        class="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-all">
        🔄 Refresh All Views
      </button>
    </div>
    ${sortedRemarks.map(r => `
      <div class="mb-4 p-3 border-b border-gray-200 dark:border-gray-700">
        <div class="md:flex justify-between items-start gap-4">
          <div class="flex-1">
            <p class="font-bold text-gray-900 dark:text-white">${r.title}</p>
            <p class="text-sm break-words mt-1">
              <a href="${r.video_link}" target="_blank" class="text-blue-600 hover:underline">
                ${r.video_link}
              </a>
            </p>
            <p class="mt-2 text-sm text-gray-800 dark:text-gray-300">
              <b>Views:</b> ${formatNumber(r.view)}
            </p>
            <p class="mt-1 text-sm text-gray-800 dark:text-gray-300">
              <b>Created:</b> ${formatDate(r.date_created)}
            </p>
            
            <!-- Video Type Badges -->
            <div class="mt-2 flex items-center justify-center gap-2">
              ${r.big_video === 'yes'
      ? `<span class="inline-block bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                     Big Video
                   </span>`
      : ''}
              ${r.impact_video === 'yes'
      ? `<span class="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                     Impact Video
                   </span>`
      : ''}
            </div>
            
            <p class="text-xs mt-2 text-gray-600 dark:text-gray-400">
              <b>Status:</b> 
              <span class="${r.status === 'active' ? 'text-green-600' : 'text-red-600'}">
                ${r.status}
              </span>
            </p>
          </div>
          <div class="flex flex-col space-y-2 mt-4 md:mt-0">
            <button onclick="window.editRemark('${r.id}')" 
              class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm">
              Edit
            </button>
            <button onclick="window.deleteRemark('${r.id}', '${creatorName}', '${r.title.replace(/'/g, "\\'")}')" 
              class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm">
              Delete
            </button>
            <button onclick="window.refreshViewCount('${r.id}')" 
              class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm">
              Refresh View
            </button>
          </div>
        </div>
      </div>
    `).join('')}
  `;
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

  window.refreshAllViewsForCreator = async () => {
    if (!creator.remarks?.length) return;

    const remarksToRefresh = [...creator.remarks]; // Avoid mutation
    const stats = { success: 0, error: 0, skipped: 0 };

    const toast = Swal.mixin({
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

    const pageCode = getPageCodeFromCreator(creator); // ✅ use correct page per creator

    for (let i = 0; i < remarksToRefresh.length; i++) {
      const r = remarksToRefresh[i];

      toast.fire({
        icon: 'info',
        title: `Refreshing (${i + 1}/${remarksToRefresh.length})`,
        html: `<div class="text-xs">Success: ${stats.success} | Errors: ${stats.error} | Skipped: ${stats.skipped}</div>`
      });

      const videoId = extractVideoId(r.video_link);
      if (!videoId) {
        stats.skipped++;
        continue;
      }

      try {
        await fetchVideoData(videoId, pageCode); // ✅ pass correct page

        if (!fbVideoData.value?.views) {
          stats.error++;
          continue;
        }

        const newViews = fbVideoData.value.views.toString();
        if (newViews !== r.view) {
          await useApi(`/items/remark_link/${r.id}`, {
            method: 'PATCH',
            data: { view: newViews }
          });
          stats.success++;
        } else {
          stats.skipped++;
        }

        await new Promise(resolve => setTimeout(resolve, 500)); // throttle
      } catch (err) {
        console.error(err);
        stats.error++;
      }
    }

    await fetchCreators();
    const updatedCreator = creators.value.find(c => c.id === creator.id);
    if (updatedCreator) handleRemarkClick(updatedCreator);

    Swal.fire({
      title: 'Refresh Done',
      icon: 'success',
      html: `
      <p>Processed ${remarksToRefresh.length} videos</p>
      <p class="text-green-600">Success: ${stats.success}</p>
      <p class="text-yellow-600">Skipped: ${stats.skipped}</p>
      <p class="text-red-600">Errors: ${stats.error}</p>
    `
    });
  };


  window.refreshViewCount = async (remarkId: string) => {
    const remark = creator.remarks?.find(r => r.id.toString() === remarkId);
    if (!remark) return;

    const videoId = extractVideoId(remark.video_link);
    if (!videoId) {
      showError('Invalid video URL');
      return;
    }

    const pageCode = getPageCodeFromCreator(creator); // ✅ use correct page

    try {
      Swal.fire({
        title: 'Refreshing...',
        html: 'Fetching latest view count...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      await fetchVideoData(videoId, pageCode); // ✅ pass correct page

      if (fbError.value || !fbVideoData.value?.views) {
        showError('Could not fetch updated view count');
        return;
      }

      const updatedViews = fbVideoData.value.views.toString();

      if (updatedViews !== remark.view) {
        await useApi(`/items/remark_link/${remarkId}`, {
          method: 'PATCH',
          data: { view: updatedViews }
        });
      }

      await fetchCreators();

      const updatedCreator = creators.value.find(c => c.id === creator.id);
      if (updatedCreator) {
        handleRemarkClick(updatedCreator);
      }

      showSuccess('View count refreshed successfully');
    } catch (err) {
      console.error(err);
      showError('Failed to refresh view count');
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

  const departmentId = Number(auth.user?.department?.id);
  if (departmentId === 1) {
    selectedPage.value = 'TC';
  } else if (departmentId === 2) {
    selectedPage.value = 'BC';
  } else if (departmentId === 3) {
    selectedPage.value = 'HC';
  }

  document.addEventListener('click', closeDropdowns);
});


onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
});
</script>
