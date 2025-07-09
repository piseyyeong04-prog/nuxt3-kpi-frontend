<!-- pages/dashboard/track-performance-staff/writers.vue -->
<template>
  <div class="min-h-screen dark:from-gray-900 dark:to-indigo-950 ">
    <div class="container mx-auto px-4 ">
      <div class="grid grid-cols-1 gap-8">
        <div class="  dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 p-4 md:p-6">
          <div class=" mx-auto space-y-8">
            <div
              class="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-3xl p-8 border border-white/20 dark:border-gray-700/30">
              <div class="flex items-center gap-4 mb-8">
                <div
                  class="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <Icon icon="basil:add-solid" class="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Add New Article</h2>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Enter URL to automatically fetch article details
                  </p>
                </div>
              </div>

              <form @submit.prevent="addArticleData" class="space-y-2">
                <!-- URL Input Section -->
                <div class="space-y-3">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Website URL
                  </label>
                  <div class="flex gap-3">
                    <div class="relative flex-1">
                      <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Icon icon="iconoir:www" class="h-5 w-5 text-indigo-400" />
                      </div>
                      <input v-model="article_link" type="url"
                        class="w-full h-14 pl-12 pr-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200"
                        placeholder="https://www.tech-cambodia.com/example-slug" required />
                    </div>
                    <button type="button" @click="fetchArticleData"
                      class="h-14 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                      :disabled="loading || !article_link">
                      <span v-if="loading" class="flex items-center gap-2">
                        <Icon icon="line-md:loading-twotone-loop" class="h-5 w-5" />
                        <span class="hidden sm:inline">Fetching</span>
                      </span>
                      <span v-else class="flex items-center gap-2">
                        <Icon icon="material-symbols:search" class="h-5 w-5" />
                        <span class="hidden sm:inline">Fetch</span>
                      </span>
                    </button>
                  </div>
                </div>

                <!-- Form Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <!-- Left Column -->
                  <div class="space-y-2">
                    <!-- Writer Selection -->
                    <div class="space-y-3">
                      <label
                        class="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Select Writer
                      </label>
                      <div class="relative">
                        <select v-model="selectedCreator"
                          class="w-full h-14 pl-4 pr-10 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 appearance-none cursor-pointer"
                          required>
                          <option v-for="creator in creatorsList" :key="creator.id" :value="creator.id">
                            {{ getUserName(creator.staff) || (auth.user?.first_name + ' ' + auth.user?.last_name) }}
                          </option>
                        </select>
                        <!-- <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <Icon icon="material-symbols:keyboard-arrow-down" class="h-5 w-5 text-gray-400" />
                        </div> -->
                      </div>
                    </div>

                    <!-- Article Title -->
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Article Title
                        <span class="text-xs text-gray-400 normal-case ml-1">(Optional)</span>
                      </label>
                      <input v-model="article_title" type="text"
                        class="w-full h-14 px-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200"
                        placeholder="Auto-filled from URL if left blank" />
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="space-y-2">
                    <!-- Article Views -->
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Article Views
                      </label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <Icon icon="icon-park:preview-open" class="h-5 w-5 text-gray-400" />
                        </div>
                        <input v-model.number="article_view" type="number" disabled
                          class="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-500 dark:text-gray-400"
                          placeholder="0" required />
                      </div>
                    </div>

                    <!-- Article Date -->
                    <div class="space-y-3">
                      <label
                        class="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Date Created
                        <span class="text-xs text-gray-400 normal-case ml-1">(Auto-filled)</span>
                      </label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <Icon icon="material-symbols:calendar-today" class="h-5 w-5 text-gray-400" />
                        </div>
                        <input v-model="formattedArticleDate" type="text" readonly
                          class="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-500 dark:text-gray-400"
                          placeholder="Auto-filled from URL" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="flex justify-center pt-4">
                  <button type="submit"
                    class="h-14 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none font-semibold text-lg min-w-[200px]"
                    :disabled="loading">
                    <span v-if="loading" class="flex items-center gap-3">
                      <Icon icon="line-md:loading-twotone-loop" class="h-6 w-6" />
                      Processing...
                    </span>
                    <span v-else class="flex items-center gap-3">
                      <Icon icon="basil:add-solid" class="h-6 w-6" />
                      Add Article
                    </span>
                  </button>
                </div>
              </form>
            </div>

            <!-- Performance Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Total Articles Card -->
              <div
                class="group relative overflow-hidden bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div class="relative space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Icon icon="fluent:document-16-filled" class="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p class="text-indigo-100 text-sm font-medium uppercase tracking-wide">Articles (This Period)</p>
                  <p class="text-4xl font-bold text-white">
                    {{ getTotalArticlesCountInCurrentPeriod(creators, currentKpiPeriod) }}
                  </p>
                </div>
              </div>

              <!-- Total Views Card -->
              <div
                class="group relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div class="relative space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Icon icon="icon-park:preview-open" class="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p class="text-emerald-100 text-sm font-medium uppercase tracking-wide">Views (This Period)</p>
                  <p class="text-4xl font-bold text-white">
                    {{ formatNumber(getTotalViewsAcrossAllInCurrentPeriod(creators, currentKpiPeriod)) }}
                  </p>
                </div>
              </div>

              <!-- Completed Targets Card -->
              <div
                class="group relative overflow-hidden bg-gradient-to-br from-rose-500 via-rose-600 to-pink-700 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div class="relative space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Icon icon="fluent-mdl2:completed" class="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p class="text-rose-100 text-sm font-medium uppercase tracking-wide">Completed Targets</p>
                  <p class="text-4xl font-bold text-white">
                    {{ getCompletedTargetsCountInCurrentPeriod(creators, currentKpiPeriod) }}
                  </p>
                </div>
              </div>
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
          <div class="flex justify-end px-6 mb-4 mt-2">
            <button @click="refreshAllArticles"
              class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-3 rounded-lg transition-all flex items-center justify-center shadow-md hover:shadow-lg"
              :disabled="globalRefreshLoading">
              <span v-if="globalRefreshLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Refreshing All Articles...
              </span>
              <span v-else class="flex items-center">
                <Icon icon="ion:refresh-circle" class="h-5 w-5 mr-2" />
                Reload views
              </span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead
                class="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider">
                <tr>
                  <th scope="col" class="py-4 px-6">Name</th>
                  <th scope="col" class="py-4 px-6">Position</th>
                  <th scope="col" class="py-4 px-6">Department</th>
                  <th scope="col" class="py-4 px-6">View Target</th>
                  <th scope="col" class="py-4 px-6">Status</th>
                  <th scope="col" class="py-4 px-6">{{ dateRangeHeader }}</th>
                  <th scope="col" class="py-4 px-6">Articles</th>
                  <th scope="col" class="py-4 px-6">{{ totalViewsHeader }}</th>
                  <th scope="col" class="py-4 px-6">Progress</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(creator, index) in creatorsList" :key="creator.id"
                  class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">

                  <!-- Staff Name -->
                  <td class="py-4 px-6 font-medium text-gray-800 dark:text-white">
                    {{ getUserName(creator.staff) || (auth.user?.first_name + ' ' + auth.user?.last_name) }}
                  </td>

                  <!-- Position -->
                  <td class="py-4 px-6 text-gray-600 dark:text-gray-300">
                    {{ creator.user_created?.title || 'N/A' }}
                  </td>

                  <!-- Department -->
                  <td class="py-4 px-6 text-gray-600 dark:text-gray-300">
                    {{ creator.user_created?.department?.title || 'N/A' }}
                  </td>

                  <!-- View Target -->
                  <td class="py-4 px-6 font-medium dark:text-white">
                    {{ formatNumber(creator.target) }}
                  </td>

                  <!-- Status -->
                  <td class="py-4 px-6">
                    <span v-if="isCompleted({ ...creator, remarks: getRemarksInCurrentPeriod(creator) })"
                      class="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                      Completed
                    </span>
                    <span v-else
                      class="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-full text-xs font-medium">
                      In Progress
                    </span>
                  </td>

                  <!-- Views in KPI Period -->
                  <td class="py-4 px-6 font-medium"
                    :class="index % 2 === 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'">
                    {{ getTotalViews(getRemarksInCurrentPeriod(creator)) }}
                  </td>

                  <!-- Article Count (KPI period only) -->
                  <td class="py-4 px-6">
                    <button @click="viewWriterArticles(creator.id)"
                      class="px-3 py-1 flex bg-blue-500 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-white dark:text-indigo-400 rounded-md transition-colors">
                      {{ getRemarksInCurrentPeriod(creator).length }} Articles
                      <Icon icon="game-icons:click" width="24" height="24" />
                    </button>
                  </td>

                  <!-- Formatted Views (KPI period) -->
                  <td class="py-4 px-6 font-medium dark:text-white">
                    {{ formatTotalViews(getTotalViews(getRemarksInCurrentPeriod(creator))) }}
                  </td>

                  <!-- Progress Bar -->
                  <td class="py-4 px-6 w-40 dark:text-white">
                    <div class="flex items-center">
                      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                        <div class="h-2.5 rounded-full"
                          :class="getProgressBarColor(calculatePercent({ ...creator, remarks: getRemarksInCurrentPeriod(creator) }))"
                          :style="`width: ${Math.min(calculatePercent({ ...creator, remarks: getRemarksInCurrentPeriod(creator) }), 100)}%`">
                        </div>
                      </div>
                      <div class="whitespace-nowrap text-xs font-medium"
                        :class="getPercentClass(calculatePercent({ ...creator, remarks: getRemarksInCurrentPeriod(creator) }))">
                        {{ calculatePercent({ ...creator, remarks: getRemarksInCurrentPeriod(creator) }) }}%
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
      <div data-aos="fade-down"
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
              <div class="py-2">
                <select v-model="selectedMonth" @change="filterArticlesByKpiPeriod"
                  class="rounded-md text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <option v-for="(period, key) in kpiPeriods" :key="key" :value="key">{{ period.label }}</option>
                </select>
              </div>
              <!-- KPI Monthly Summary -->
              <div class="mb-4 mt-2 px-1 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>Total Views:</strong> {{ formatNumber(getPeriodViews(writerArticles).toString()) }}</p>
                <p><strong>Total Articles:</strong> {{ writerArticles.length }}</p>
                <p>
                  <strong>Status:</strong>
                  <span v-if="getPeriodViews(writerArticles) >= selectedWriterTarget"
                    class="text-green-600 font-semibold">
                    Completed
                  </span>
                  <span v-else class="text-yellow-600 font-semibold">
                    In Progress
                  </span>
                </p>
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
                        Title
                      </th>
                      <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        URL
                      </th>
                      <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Views
                      </th>
                      <th scope="col"
                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-if="writerArticles.length === 0">
                      <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No articles found for this writer.
                      </td>
                    </tr>
                    <tr v-for="article in writerArticles" :key="article.id"
                      class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {{ formatDate(article.date_created) || 'Untitled Date' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {{ article.title || 'Untitled Article' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <a :href="article.article_link" target="_blank"
                          class="text-blue-600 dark:text-blue-400 hover:underline truncate block max-w-xs">
                          {{ article.article_link }}
                        </a>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm  text-gray-500 dark:text-gray-400">
                        {{ formatNumber(article.view || 0) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button @click="refreshArticleViews(article.id)"
                          class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                          :disabled="article.isRefreshing">
                          <span v-if="article.isRefreshing" class="flex items-center">
                            <Icon icon="line-md:loading-twotone-loop" class="h-4 w-4 mr-1" />
                            Refreshing...
                          </span>
                          <span v-else class="flex items-center">
                            <Icon icon="ion:refresh-circle" class="h-4 w-4 mr-1" />
                            Refresh Views
                          </span>
                        </button>
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
      <div data-aos="fade-down"
        class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
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
              <form @submit.prevent="updateArticle" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Article Title
                  </label>
                  <input v-model="editForm.title" type="text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
                    placeholder="Article Title" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website URL
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Icon icon="iconoir:www" class="h-5 w-5 text-gray-400" />
                    </div>
                    <input v-model="editForm.article_link" type="text"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-3"
                      placeholder="https://www.tech-cambodia.com/example-slug" required />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Article Views
                  </label>
                  <input v-model.number="editForm.view" type="number" disabled
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
                    placeholder="0" required />
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
import { getKpiPeriodsFromArticles } from '~/utils/writers';

// Import writer utilities
import {
  getTotalViews,
  isCompleted,
  calculatePercent,
  getPercentClass,
  getProgressBarColor,
  getCompletedTargetsCount,
  getTotalArticlesCount,
  getTotalViewsAcrossAll
} from '~/utils/writers';

// Import formatting utilities
import { formatDate, formatNumber, formatTotalViews, getKpiDateHeaders } from '~/utils/format';

const auth = useAuthStore();
const router = useRouter();
const loading = ref(false);
const globalRefreshLoading = ref(false);

// Form data
const selectedCreator = ref('');
const article_link = ref('');
const article_title = ref('');
const article_view = ref(0);
const article_date = ref('');
// Writers and staff data
const creators = ref<IWriter[]>([]);
const staffMembers = ref<Record<string, string>>({});


// Computed value to show formatted date but keep ISO internally
const formattedArticleDate = computed({
  get() {
    return article_date.value ? formatDate(article_date.value) : '';
  },
  set(val: string) {
    // Optional: parse back if you want to allow editing (or skip to keep read-only)
    article_date.value = val; // Keep raw string if you're not parsing input
  }
});

const creatorsList = computed(() => {
  return creators.value;
});

const { dateRangeHeader, totalViewsHeader } = getKpiDateHeaders();

// ================== Fetch Article Data =================

// Function to fetch article data from Tech Cambodia API

const fetchArticleData = async () => {
  if (!article_link.value) return;

  try {
    loading.value = true;

    let slug;
    let selectedApi;
    let apiPath = '/items/articles'; // default path

    try {
      const url = new URL(article_link.value);
      const pathParts = url.pathname.split('/');
      slug = pathParts[pathParts.length - 1];

      // Determine API and endpoint based on domain
      if (url.hostname.includes('tech-cambodia.com')) {
        selectedApi = techCambodiaApi;
        apiPath = '/items/articles';
      } else if (url.hostname.includes('business-cambodia.com')) {
        selectedApi = businessCambodiaApi;
        apiPath = '/items/articles';
      } else if (url.hostname.includes('healthy-cambodia.com')) {
        selectedApi = healthyCambodiaApi;
        apiPath = '/items/article'; // Note: singular for healthy-cambodia
      } else {
        Swal.fire({
          title: 'Unsupported Domain',
          text: 'The article URL domain is not supported',
          icon: 'warning'
        });
        return;
      }
    } catch (error) {
      console.error('Invalid URL:', article_link.value);
      return;
    }

    if (!slug) {
      Swal.fire({
        title: 'Invalid URL',
        text: 'Could not extract article slug from the URL',
        icon: 'warning'
      });
      return;
    }

    const response = await selectedApi.get(apiPath, {
      params: {
        filter: JSON.stringify({
          slug: {
            _eq: slug
          }
        })
      }
    });

    if (!response.data || !response.data.data || response.data.data.length === 0) {
      Swal.fire({
        title: 'Article Not Found',
        text: 'Could not find article data in the selected CMS',
        icon: 'warning'
      });
      return;
    }

    const articleData = response.data.data[0];
    article_title.value = articleData.title || '';
    article_view.value = articleData.views || 0;
    article_date.value = articleData.date_created || '';

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Article data fetched successfully',
      showConfirmButton: false,
      timer: 2000
    });

  } catch (error) {
    console.error('Failed to fetch article data:', error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to fetch article data from the CMS',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};




// ================== end fetch Article Data =================

// ===================cehck duplicate article=================


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
      article_link: {
        _contains: normalizedLink
      }
    }));
    const fields = encodeURIComponent('id,article_link');
    const response = await useApi(`/items/remark_link_writer?filter=${filter}&fields=${fields}`, {
      method: 'GET'
    });

    // If there are any results, a duplicate exists
    if (response && Array.isArray((response as any).data) && (response as any).data.length > 0) {
      // Look through results to handle exact matches (accounting for trailing slashes, etc)
      for (const existingArticle of (response as any).data) {
        // Normalize the existing article link too
        let existingLink = existingArticle.article_link.trim();
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


// ================= end check duplicate Creators =================
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
    const isDuplicate = await checkDuplicateArticleLink(article_link.value);

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
      article_link: article_link.value,
      view: article_view.value,
      date_created: article_date.value,
      status: 'active',
      creators: selectedCreator.value
    };

    // Save the remark
    const response = await useApi('/items/remark_link_writer', {
      method: 'POST',
      data: remarkData
    });

    Swal.fire({
      title: 'Success',
      text: 'Article data has been added successfully',
      icon: 'success'
    });

    // Reset form
    article_link.value = '';
    article_title.value = '';
    article_date.value = '';
    article_view.value = 0;

    // Refresh creator data
    await fetchCreators();

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
import axios from 'axios';

const techCambodiaApi = axios.create({
  baseURL: 'https://tech-cambodia.com/cms',
  headers: {
    'Content-Type': 'application/json'
  }
});

// businessCambodiaApi
const businessCambodiaApi = axios.create({
  baseURL: 'https://business-cambodia.com/cms',
  headers: {
    'Content-Type': 'application/json'
  }
});

// healthyCambodiaApi
const healthyCambodiaApi = axios.create({
  baseURL: 'https://healthy-cambodia.com/cms',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add these refs for the modal
const showArticlesModal = ref(false);
const selectedWriterId = ref<number | null>(null);
const selectedWriterName = ref('');
const writerArticles = ref<any[]>([]);
const availableMonths = ref<Record<string, string>>({});
const selectedMonth = ref<string>('current');
const currentKpiPeriod = ref<{ from: Date; to: Date } | null>(null);



const filterArticlesByMonth = () => {
  const allArticles = creators.value.find(c => c.id === selectedWriterId.value)?.remarks || [];

  if (selectedMonth.value === 'current') {
    writerArticles.value = [...allArticles];
  } else {
    writerArticles.value = allArticles.filter(article => {
      const date = new Date(article.date_created);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const formatted = `${year}-${String(month).padStart(2, '0')}`;
      return formatted === selectedMonth.value;
    });
  }

  writerArticles.value.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
};

// Replace the viewWriterArticles function with this:
const filterArticlesByKpiPeriod = () => {
  const writer = creators.value.find(c => c.id === selectedWriterId.value);
  const allArticles = writer?.remarks || [];

  if (selectedMonth.value === 'current' || !kpiPeriods.value[selectedMonth.value]) {
    writerArticles.value = allArticles;
    return;
  }

  const { from, to } = kpiPeriods.value[selectedMonth.value];
  writerArticles.value = allArticles.filter(article => {
    const date = new Date(article.date_created);
    return date >= from && date < to;
  });
};

const kpiPeriods = ref<Record<string, { label: string, from: Date, to: Date }>>({});

const viewWriterArticles = (writerId: number) => {
  selectedWriterId.value = writerId;
  const writer = creators.value.find(c => c.id === writerId);
  if (!writer) return;

  selectedWriterName.value = getUserName(writer.staff) || (auth.user?.first_name + ' ' + auth.user?.last_name);
  const allArticles = writer.remarks || [];

  // Sort all articles by date (latest first)
  allArticles.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
  writerArticles.value = allArticles;

  // Generate KPI periods
  kpiPeriods.value = getKpiPeriodsFromArticles(
    allArticles.map(article => ({
      ...article,
      date_created: typeof article.date_created === 'string'
        ? article.date_created
        : article.date_created?.toISOString?.() || ''
    }))
  );

  // ✅ Fix: Select the latest KPI period dynamically
  const sortedKeys = Object.keys(kpiPeriods.value).sort((a, b) => {
    return new Date(kpiPeriods.value[b].from).getTime() - new Date(kpiPeriods.value[a].from).getTime();
  });

  selectedMonth.value = sortedKeys[0] || 'current';

  filterArticlesByKpiPeriod();
  showArticlesModal.value = true;
};


// Add a function to close the modal
const closeArticlesModal = () => {
  showArticlesModal.value = false;
  selectedWriterId.value = null;
  writerArticles.value = [];
};

// Add a function to refresh a specific article's view count

const refreshArticleViews = async (articleId: number) => {
  try {
    // Set loading state for this specific article
    const articleIndex = writerArticles.value.findIndex(a => a.id === articleId);
    if (articleIndex !== -1) {
      writerArticles.value[articleIndex].isRefreshing = true;
    }

    const article = writerArticles.value.find(a => a.id === articleId);
    if (!article || !article.article_link) {
      throw new Error('Article link not found');
    }

    // Extract domain + slug
    let slug, selectedApi, apiPath;
    try {
      const url = new URL(article.article_link);
      const pathParts = url.pathname.split('/');
      slug = pathParts[pathParts.length - 1];

      // Set the correct API and path based on domain
      if (url.hostname.includes('tech-cambodia.com')) {
        selectedApi = techCambodiaApi;
        apiPath = '/items/articles';
      } else if (url.hostname.includes('business-cambodia.com')) {
        selectedApi = businessCambodiaApi;
        apiPath = '/items/articles';
      } else if (url.hostname.includes('healthy-cambodia.com')) {
        selectedApi = healthyCambodiaApi;
        apiPath = '/items/article';
      } else {
        throw new Error('Unsupported article domain');
      }
    } catch (err) {
      throw new Error('Invalid article URL');
    }

    if (!slug) {
      throw new Error('Could not extract article slug from URL');
    }

    // Fetch article views
    const response = await selectedApi.get(apiPath, {
      params: {
        filter: JSON.stringify({
          slug: {
            _eq: slug
          }
        })
      }
    });

    if (!response.data || !response.data.data || response.data.data.length === 0) {
      throw new Error('Article not found in the CMS');
    }

    const articleData = response.data.data[0];
    const viewCount = articleData.views || 0;

    // Update view count in local CMS
    await useApi(`/items/remark_link_writer/${articleId}`, {
      method: 'PATCH',
      data: {
        view: viewCount
      }
    });

    // Update local state
    if (articleIndex !== -1) {
      writerArticles.value[articleIndex].view = viewCount;
    }

    await fetchCreators();

    // Update modal view if open
    if (showArticlesModal.value && selectedWriterId.value) {
      const updatedWriter = creators.value.find(c => c.id === selectedWriterId.value);
      if (updatedWriter) {
        writerArticles.value = updatedWriter.remarks || [];
      }
    }

    // Show success
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Views refreshed successfully',
      showConfirmButton: false,
      timer: 3000
    });

  } catch (error) {
    console.error('Failed to refresh article views:', error);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Failed to refresh views',
      showConfirmButton: false,
      timer: 3000
    });
  } finally {
    // Reset loading state
    const articleIndex = writerArticles.value.findIndex(a => a.id === articleId);
    if (articleIndex !== -1) {
      writerArticles.value[articleIndex].isRefreshing = false;
    }
  }
};



// =================
// Fetch creators data
const fetchCreators = async () => {
  loading.value = true;
  try {
    // Fetch writers data
    const response = await useApi('/items/writers?fields=*,remarks.*,user_created.*,user_created.department.title', {
      method: 'GET'
    }) as IResponse<IWriter[]>;

    creators.value = response.data;

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

// Function to refresh all articles for all writers
const refreshAllArticles = async () => {
  try {
    globalRefreshLoading.value = true;

    // Toast notification
    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 0,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });

    toast.fire({
      icon: 'info',
      title: 'Refreshing all article view counts...'
    });

    // Collect all remarks
    const allRemarks = creators.value.flatMap(creator => creator.remarks || []);

    if (allRemarks.length === 0) {
      Swal.fire({
        title: 'No Articles',
        text: 'No article data available to refresh',
        icon: 'info'
      });
      return;
    }

    // Progress counters
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    const totalCount = allRemarks.length;

    const updatePromises = allRemarks.map(async (article) => {
      try {
        if (!article.article_link) {
          skippedCount++;
          return;
        }

        // Extract domain and slug
        let slug, selectedApi, apiPath;
        try {
          const url = new URL(article.article_link);
          const pathParts = url.pathname.split('/');
          slug = pathParts[pathParts.length - 1];

          // Determine API and path
          if (url.hostname.includes('tech-cambodia.com')) {
            selectedApi = techCambodiaApi;
            apiPath = '/items/articles';
          } else if (url.hostname.includes('business-cambodia.com')) {
            selectedApi = businessCambodiaApi;
            apiPath = '/items/articles';
          } else if (url.hostname.includes('healthy-cambodia.com')) {
            selectedApi = healthyCambodiaApi;
            apiPath = '/items/article'; // singular
          } else {
            skippedCount++;
            return;
          }
        } catch (error) {
          console.error('Invalid URL:', article.article_link);
          skippedCount++;
          return;
        }

        if (!slug) {
          skippedCount++;
          return;
        }

        // Fetch view count
        const response = await selectedApi.get(apiPath, {
          params: {
            filter: JSON.stringify({
              slug: {
                _eq: slug
              }
            })
          }
        });

        if (!response.data?.data?.length) {
          skippedCount++;
          return;
        }

        const articleData = response.data.data[0];
        const viewCount = articleData.views || 0;

        // Update in CMS
        await useApi(`/items/remark_link_writer/${article.id}`, {
          method: 'PATCH',
          data: {
            view: viewCount
          }
        });

        successCount++;
      } catch (error) {
        console.error(`Error updating article ${article.id}:`, error);
        errorCount++;
      }
    });

    await Promise.allSettled(updatePromises);
    await fetchCreators();

    // Final report
    Swal.fire({
      title: 'Refresh Complete',
      html: `<div class="space-y-2">
              <p>Processed ${totalCount} articles:</p>
              <div class="flex justify-between px-4">
                <span class="text-green-600">Updated: ${successCount}</span>
                <span class="text-yellow-600">Skipped: ${skippedCount}</span>
                <span class="text-red-600">Errors: ${errorCount}</span>
              </div>
            </div>`,
      icon: 'success'
    });

  } catch (error: any) {
    console.error('Failed to refresh articles:', error);
    Swal.fire({
      title: 'Error',
      text: error?.data?.message || 'Failed to refresh articles',
      icon: 'error'
    });
  } finally {
    globalRefreshLoading.value = false;
  }
};



// ================= Edit article =================
const showEditModal = ref(false);
const isEditLoading = ref(false);
const editForm = ref({
  id: null as number | null,
  title: '',
  article_link: '',
  view: 0,
});
// Function to open edit modal with article data
const editArticle = (article: any) => {
  editForm.value = {
    id: article.id,
    title: article.title || '',
    article_link: article.article_link || '',
    view: article.view || 0,
  };
  showEditModal.value = true;
};

// Function to close edit modal
const closeEditModal = () => {
  showEditModal.value = false;
  editForm.value = {
    id: null,
    title: '',
    article_link: '',
    view: 0,
  };
};

// Function to update article
const updateArticle = async () => {
  if (!editForm.value.id) return;

  try {
    isEditLoading.value = true;

    // Validate URL format
    try {
      new URL(editForm.value.article_link);
    } catch (error) {
      throw new Error('Please enter a valid URL');
    }

    // Update the article
    await useApi(`/items/remark_link_writer/${editForm.value.id}`, {
      method: 'PATCH',
      data: {
        title: editForm.value.title,
        article_link: editForm.value.article_link,
        view: editForm.value.view
      }
    });

    // Update local state
    const articleIndex = writerArticles.value.findIndex(a => a.id === editForm.value.id);
    if (articleIndex !== -1) {
      writerArticles.value[articleIndex] = {
        ...writerArticles.value[articleIndex],
        title: editForm.value.title,
        article_link: editForm.value.article_link,
        view: editForm.value.view
      };
    }

    // Refresh creators to update counts/metrics
    await fetchCreators();

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
    await useApi(`/items/remark_link_writer/${articleId}`, {
      method: 'DELETE'
    });

    // Remove from local state
    writerArticles.value = writerArticles.value.filter(a => a.id !== articleId);

    // If this was the last article and the filtered array is now empty
    if (writerArticles.value.length === 0) {
      // Refresh the creators data to ensure everything is in sync
      await fetchCreators();
    } else {
      // Otherwise just update the creator's data
      const updatedCreator = creators.value.find(c => c.id === selectedWriterId.value);
      if (updatedCreator) {
        updatedCreator.remarks = updatedCreator.remarks?.filter(r => r.id !== articleId) || [];
      }
      await fetchCreators();
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


// ================= avaible month history =================

// Return total views for current period
const getPeriodViews = (articles: any[]): number => {
  return articles.reduce((sum, article) => sum + (parseInt(article.view) || 0), 0);
};

// Writer's view target (used in modal summary)
const selectedWriterTarget = computed(() => {
  const creator = creators.value.find(c => c.id === selectedWriterId.value);
  return creator ? parseInt(creator.target) : 0;
});
// =================end avaible month history =================
// Set default selected creator when list loads
watch(creatorsList, (newCreatorsList) => {
  if (newCreatorsList.length > 0 && !selectedCreator.value) {
    selectedCreator.value = String(newCreatorsList[0].id);
  }
}, { immediate: true });

// Set page metadata and auth middleware
definePageMeta({
  middleware: ['auth', 'role'],
});
const getRemarksInCurrentPeriod = (creator: IWriter) => {
  if (!currentKpiPeriod.value) return creator.remarks || [];

  const { from, to } = currentKpiPeriod.value;
  return (creator.remarks || []).filter(article => {
    const date = new Date(article.date_created);
    return date >= from && date < to;
  });
};

// Fetch data on component mount
onMounted(async () => {
  await fetchCreators();

  // Optional: use today’s date to match KPI period
  const now = new Date();
  const periods = getKpiPeriodsFromArticles(
    creators.value.flatMap(c =>
      (c.remarks || []).map(r => ({
        ...r,
        date_created: typeof r.date_created === 'string'
          ? r.date_created
          : r.date_created?.toISOString?.() || ''
      }))
    )
  );

  const sortedKeys = Object.keys(periods).sort((a, b) => new Date(periods[b].from).getTime() - new Date(periods[a].from).getTime());
  const latestKey = sortedKeys[0];
  if (latestKey) {
    currentKpiPeriod.value = periods[latestKey];
  }
});

</script>