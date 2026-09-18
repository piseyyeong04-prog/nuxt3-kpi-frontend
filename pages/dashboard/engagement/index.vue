<!-- pages/dashboard/engagement/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6">
    <div class="max-w-7xl mx-auto space-y-6">

      <!-- ===== PAGE HEADER ===== -->
      <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
          <div class="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-20 translate-y-20"></div>
        </div>
        <div class="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <Icon icon="mdi:chart-line" class="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-white">Facebook Engagement Tracker</h1>
              <p class="text-blue-100 mt-1 text-sm sm:text-base">
                Paste Facebook photo/post URLs to fetch likes, reactions, comments &amp; shares
              </p>
            </div>
          </div>
          <div v-if="results.length > 0" class="sm:ml-auto flex gap-3">
            <div class="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
              <div class="text-xl font-bold text-white">{{ successCount }}</div>
              <div class="text-xs text-blue-200">Fetched</div>
            </div>
            <div class="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
              <div class="text-xl font-bold text-white">{{ formatK(totalClicks) }}</div>
              <div class="text-xs text-blue-200">👆 Clicks</div>
            </div>
            <div class="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
              <div class="text-xl font-bold text-white">{{ totalReactionsSum.toLocaleString() }}</div>
              <div class="text-xs text-blue-200">🔥 Reactions</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== INPUT SECTION ===== -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-xl">
              <Icon icon="mdi:link-variant" class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-800 dark:text-white">Enter Facebook URLs</h2>
              <p class="text-xs text-gray-500 dark:text-gray-400">One URL per line — supports photo, post, and video links</p>
            </div>
          </div>
        </div>

        <div class="p-6 space-y-4">
          <!-- Page Selector -->
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1 space-y-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Facebook Page</label>
              <div class="relative">
                <select
                  v-model="selectedPage"
                  class="w-full px-4 py-3 pr-10 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none text-gray-900 dark:text-white"
                >
                  <option value="TC">🟦 Technology Cambodia (TC)</option>
                  <option value="BC">🟩 Business Cambodia (BC)</option>
                  <option value="HC">🟧 Healthy Cambodia (HC)</option>
                </select>
                <Icon icon="mdi:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div class="flex items-end gap-2">
              <button
                @click="handleFetch"
                :disabled="isLoading || !urlInput.trim()"
                class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                <Icon v-if="isLoading" icon="mdi:loading" class="h-5 w-5 animate-spin" />
                <Icon v-else icon="mdi:download-circle" class="h-5 w-5" />
                {{ isLoading ? `Fetching ${progress}/${total}...` : 'Fetch Engagement' }}
              </button>

              <button
                v-if="results.length > 0"
                @click="handleReset"
                :disabled="isLoading"
                class="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 whitespace-nowrap"
              >
                <Icon icon="mdi:refresh" class="h-5 w-5" />
                Reset
              </button>
            </div>
          </div>

          <!-- URL Textarea -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Facebook URLs
              <span v-if="parsedUrlCount > 0" class="ml-2 text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                {{ parsedUrlCount }} URL{{ parsedUrlCount > 1 ? 's' : '' }} detected
              </span>
            </label>
            <textarea
              v-model="urlInput"
              rows="8"
              :disabled="isLoading"
              placeholder="Paste Facebook URLs here, one per line. Supports numbered lists:&#10;1 https://www.facebook.com/photo.php?fbid=1040839948277599&...&#10;2 https://www.facebook.com/photo.php?fbid=1041403324887928&...&#10;&#10;Or plain URLs:&#10;https://www.facebook.com/photo.php?fbid=1042330664795194&..."
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400 resize-none font-mono disabled:opacity-60"
            ></textarea>
          </div>

          <!-- Progress Bar -->
          <div v-if="isLoading" class="space-y-2">
            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span class="flex items-center gap-2">
                <Icon icon="mdi:loading" class="h-4 w-4 animate-spin text-indigo-500" />
                Processing URLs...
              </span>
              <span class="font-medium">{{ progress }} / {{ total }}</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                class="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                :style="`width: ${total > 0 ? Math.round((progress / total) * 100) : 0}%`"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== SUMMARY CARDS ===== -->
      <Transition name="slide-up">
        <div v-if="results.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          <!-- Total Posts -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ successCount }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Posts</div>
          </div>
          <!-- Clicks -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div class="text-2xl font-bold text-violet-600 dark:text-violet-400">{{ formatK(totalClicks) }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">👆 Clicks</div>
          </div>
          <!-- Total Reactions -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ formatK(totalReactionsSum) }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">🔥 Reactions</div>
          </div>
          <!-- Likes -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div class="text-2xl font-bold text-blue-500 dark:text-blue-400">{{ formatK(totalLikes) }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">👍 Likes</div>
          </div>
          <!-- Comments -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ formatK(totalComments) }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">💬 Comments</div>
          </div>
          <!-- Shares -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ formatK(totalShares) }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">🔁 Shares</div>
          </div>
          <!-- Errors -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div class="text-2xl font-bold" :class="errorCount > 0 ? 'text-red-500' : 'text-gray-400 dark:text-gray-600'">{{ errorCount }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ errorCount > 0 ? '❌ Errors' : '✅ No Errors' }}</div>
          </div>
        </div>
      </Transition>

      <!-- ===== RESULTS TABLE ===== -->
      <Transition name="slide-up">
        <div v-if="results.length > 0" class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Table Header -->
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="flex items-center gap-3">
              <div class="bg-green-100 dark:bg-green-900/30 p-2 rounded-xl">
                <Icon icon="mdi:table" class="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 class="font-semibold text-gray-800 dark:text-white">Engagement Results</h2>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ results.length }} posts processed</p>
              </div>
            </div>
            <div class="sm:ml-auto flex gap-2">
              <button
                @click="exportToXLSX"
                class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-all hover:shadow-md"
              >
                <Icon icon="mdi:microsoft-excel" class="h-4 w-4" />
                Export XLSX
              </button>
            </div>
          </div>

          <!-- Desktop Table -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10">#</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Post / URL</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">👆 Clicks</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">👍 Like</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">❤️ Love</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">😆 Haha</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">😮 Wow</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">😢 Sad</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">😡 Angry</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">💬 Comments</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">🔁 Shares</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">🔥 Total</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">📅 Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr
                  v-for="(item, index) in results"
                  :key="index"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  :class="item.status === 'error' ? 'bg-red-50/50 dark:bg-red-950/20' : ''"
                >
                  <td class="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">{{ index + 1 }}</td>

                  <!-- URL / Status -->
                  <td class="px-4 py-3 max-w-xs">
                    <div v-if="item.status === 'success'">
                      <a
                        :href="item.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-600 dark:text-blue-400 hover:underline text-xs font-mono block truncate max-w-[220px]"
                        :title="item.url"
                      >
                        {{ item.url }}
                      </a>
                      <div v-if="item.data?.message" class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[220px]" :title="item.data.message">
                        {{ item.data.message }}
                      </div>
                    </div>
                    <div v-else class="space-y-1">
                      <a
                        :href="item.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-gray-500 hover:underline text-xs font-mono block truncate max-w-[220px]"
                        :title="item.url"
                      >
                        {{ item.url }}
                      </a>
                      <div class="flex items-center gap-1 text-xs text-red-500">
                        <Icon icon="mdi:alert-circle" class="h-3 w-3 flex-shrink-0" />
                        <span>{{ item.error }}</span>
                      </div>
                    </div>
                  </td>

                  <template v-if="item.status === 'success' && item.data">
                    <!-- Clicks -->
                    <td class="px-4 py-3 text-center">
                      <span class="font-medium text-violet-600 dark:text-violet-400">{{ item.data.clicks > 0 ? formatK(item.data.clicks) : '—' }}</span>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span class="font-medium text-blue-600 dark:text-blue-400">{{ item.data.reactions.like.toLocaleString() }}</span>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span class="font-medium text-red-500 dark:text-red-400">{{ item.data.reactions.love.toLocaleString() }}</span>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span class="font-medium text-yellow-500 dark:text-yellow-400">{{ item.data.reactions.haha.toLocaleString() }}</span>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span class="font-medium text-purple-500 dark:text-purple-400">{{ item.data.reactions.wow.toLocaleString() }}</span>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span class="font-medium text-blue-400 dark:text-blue-300">{{ item.data.reactions.sad.toLocaleString() }}</span>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span class="font-medium text-orange-600 dark:text-orange-400">{{ item.data.reactions.angry.toLocaleString() }}</span>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span class="font-medium text-green-600 dark:text-green-400">{{ item.data.comments.toLocaleString() }}</span>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span class="font-medium text-orange-500 dark:text-orange-400">{{ item.data.shares.toLocaleString() }}</span>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span
                        class="inline-block px-2 py-1 rounded-lg text-xs font-bold"
                        :class="getEngagementClass(item.data.reactions.total)"
                      >
                        {{ item.data.reactions.total.toLocaleString() }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {{ formatDate(item.data.created_time) }}
                    </td>
                  </template>
                  <!-- Error row -->
                  <template v-else>
                    <td colspan="13" class="px-4 py-3 text-center text-red-400 text-xs italic">Failed to fetch</td>
                  </template>
                </tr>
              </tbody>

              <!-- Footer totals -->
              <tfoot v-if="successCount > 0" class="bg-indigo-50 dark:bg-indigo-950/30 border-t-2 border-indigo-200 dark:border-indigo-800">
                <tr>
                  <td class="px-4 py-3"></td>
                  <td class="px-4 py-3 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase">TOTAL</td>
                  <td class="px-4 py-3 text-center text-xs font-bold text-violet-700 dark:text-violet-300">{{ formatK(totalClicks) }}</td>
                  <td class="px-4 py-3 text-center text-xs font-bold text-indigo-700 dark:text-indigo-300">{{ totalLikes.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-center text-xs font-bold text-indigo-700 dark:text-indigo-300">{{ totalLove.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-center text-xs font-bold text-indigo-700 dark:text-indigo-300">{{ totalHaha.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-center text-xs font-bold text-indigo-700 dark:text-indigo-300">{{ totalWow.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-center text-xs font-bold text-indigo-700 dark:text-indigo-300">{{ totalSad.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-center text-xs font-bold text-indigo-700 dark:text-indigo-300">{{ totalAngry.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-center text-xs font-bold text-indigo-700 dark:text-indigo-300">{{ totalComments.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-center text-xs font-bold text-indigo-700 dark:text-indigo-300">{{ totalShares.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-center">
                    <span class="inline-block px-2 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white">
                      {{ totalReactionsSum.toLocaleString() }}
                    </span>
                  </td>
                  <td class="px-4 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Mobile Card View -->
          <div class="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
            <div
              v-for="(item, index) in results"
              :key="index"
              class="p-4"
              :class="item.status === 'error' ? 'bg-red-50 dark:bg-red-950/20' : ''"
            >
              <!-- Card Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono text-gray-400">#{{ index + 1 }}</span>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full font-medium"
                    :class="item.status === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'"
                  >
                    {{ item.status === 'success' ? '✅ OK' : '❌ Error' }}
                  </span>
                </div>
                <a
                  :href="item.url"
                  target="_blank"
                  class="text-blue-500 hover:text-blue-700"
                >
                  <Icon icon="mdi:open-in-new" class="h-4 w-4" />
                </a>
              </div>

              <div v-if="item.status === 'success' && item.data">
                <!-- Message -->
                <p v-if="item.data.message" class="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{{ item.data.message }}</p>

                <!-- Reaction Grid -->
                <div class="grid grid-cols-3 gap-2 mb-3">
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                    <div class="text-sm font-bold text-blue-600">{{ item.data.reactions.like.toLocaleString() }}</div>
                    <div class="text-xs text-gray-400">👍 Like</div>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                    <div class="text-sm font-bold text-red-500">{{ item.data.reactions.love.toLocaleString() }}</div>
                    <div class="text-xs text-gray-400">❤️ Love</div>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                    <div class="text-sm font-bold text-yellow-500">{{ item.data.reactions.haha.toLocaleString() }}</div>
                    <div class="text-xs text-gray-400">😆 Haha</div>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                    <div class="text-sm font-bold text-purple-500">{{ item.data.reactions.wow.toLocaleString() }}</div>
                    <div class="text-xs text-gray-400">😮 Wow</div>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                    <div class="text-sm font-bold text-green-600">{{ item.data.comments.toLocaleString() }}</div>
                    <div class="text-xs text-gray-400">💬 Comments</div>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                    <div class="text-sm font-bold text-orange-500">{{ item.data.shares.toLocaleString() }}</div>
                    <div class="text-xs text-gray-400">🔁 Shares</div>
                  </div>
                </div>

                <!-- Total + Date -->
                <div class="flex items-center justify-between">
                  <span
                    class="px-3 py-1 rounded-lg text-sm font-bold"
                    :class="getEngagementClass(item.data.reactions.total)"
                  >
                    🔥 {{ item.data.reactions.total.toLocaleString() }} Total
                  </span>
                  <span class="text-xs text-gray-400">{{ formatDate(item.data.created_time) }}</span>
                </div>
              </div>

              <!-- Error State -->
              <div v-else class="flex items-center gap-2 text-sm text-red-500">
                <Icon icon="mdi:alert-circle" class="h-4 w-4 flex-shrink-0" />
                <span>{{ item.error }}</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Empty state -->
      <div v-if="results.length === 0 && !isLoading" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
          <Icon icon="mdi:facebook" class="h-10 w-10 text-indigo-500" />
        </div>
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No data yet</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Paste your Facebook photo or post URLs above and click "Fetch Engagement" to see likes, reactions, comments and shares.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFacebookEngagement, parseFacebookUrls } from '~/composables/useFacebookEngagement';

// ============================================================
// COMPOSABLES
// ============================================================
const { results, isLoading, progress, total, fetchBulkEngagement, reset } = useFacebookEngagement();

// ============================================================
// STATE
// ============================================================
const selectedPage = ref<'TC' | 'BC' | 'HC'>('BC');
const urlInput = ref('');

// ============================================================
// COMPUTED
// ============================================================
const parsedUrlCount = computed(() => {
  return parseFacebookUrls(urlInput.value).length;
});

const successResults = computed(() => results.value.filter(r => r.status === 'success' && r.data));

const successCount = computed(() => successResults.value.length);
const errorCount = computed(() => results.value.filter(r => r.status === 'error').length);

const totalReactionsSum = computed(() =>
  successResults.value.reduce((sum, r) => sum + (r.data?.reactions.total ?? 0), 0)
);
const totalLikes = computed(() =>
  successResults.value.reduce((sum, r) => sum + (r.data?.reactions.like ?? 0), 0)
);
const totalLove = computed(() =>
  successResults.value.reduce((sum, r) => sum + (r.data?.reactions.love ?? 0), 0)
);
const totalHaha = computed(() =>
  successResults.value.reduce((sum, r) => sum + (r.data?.reactions.haha ?? 0), 0)
);
const totalWow = computed(() =>
  successResults.value.reduce((sum, r) => sum + (r.data?.reactions.wow ?? 0), 0)
);
const totalSad = computed(() =>
  successResults.value.reduce((sum, r) => sum + (r.data?.reactions.sad ?? 0), 0)
);
const totalAngry = computed(() =>
  successResults.value.reduce((sum, r) => sum + (r.data?.reactions.angry ?? 0), 0)
);
const totalComments = computed(() =>
  successResults.value.reduce((sum, r) => sum + (r.data?.comments ?? 0), 0)
);
const totalShares = computed(() =>
  successResults.value.reduce((sum, r) => sum + (r.data?.shares ?? 0), 0)
);
const totalClicks = computed(() =>
  successResults.value.reduce((sum, r) => sum + (r.data?.clicks ?? 0), 0)
);

// ============================================================
// METHODS
// ============================================================
const handleFetch = async () => {
  const urls = parseFacebookUrls(urlInput.value);
  if (urls.length === 0) {
    alert('No valid Facebook URLs found. Please paste at least one URL.');
    return;
  }
  await fetchBulkEngagement(urls, selectedPage.value);
};

const handleReset = () => {
  reset();
  urlInput.value = '';
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const formatK = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toLocaleString();
};

const getEngagementClass = (total: number): string => {
  if (total >= 10000) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  if (total >= 5000)  return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
  if (total >= 1000)  return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  if (total >= 100)   return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
};

const exportToXLSX = async () => {
  const XLSX = await import('xlsx');

  const pageName = selectedPage.value;
  const today = new Date().toISOString().slice(0, 10);

  // ── Build data rows ──
  const headers = [
    '#',
    'Post Title / Message',
    'Post ID',
    'Post URL',
    '👆 Clicks',
    '👍 Like',
    '❤️ Love',
    '😆 Haha',
    '😮 Wow',
    '😢 Sad',
    '😡 Angry',
    '🔥 Total Reactions',
    '💬 Comments',
    '🔁 Shares',
    '📅 Date',
    'Status',
  ];

  const dataRows = results.value
    .filter(item => item.status === 'success')
    .map((item, i) => ([
      i + 1,
      item.data?.message || '(no title)',
      item.objectId,
      item.url,
      item.data?.clicks ?? 0,
      item.data?.reactions.like ?? 0,
      item.data?.reactions.love ?? 0,
      item.data?.reactions.haha ?? 0,
      item.data?.reactions.wow ?? 0,
      item.data?.reactions.sad ?? 0,
      item.data?.reactions.angry ?? 0,
      item.data?.reactions.total ?? 0,
      item.data?.comments ?? 0,
      item.data?.shares ?? 0,
      item.data?.created_time ? formatDate(item.data.created_time) : '',
      'Success',
    ]));

  // Totals row
  const totalsRow = [
    '',
    'TOTAL',
    '',
    '',
    totalClicks.value,
    totalLikes.value,
    totalLove.value,
    totalHaha.value,
    totalWow.value,
    totalSad.value,
    totalAngry.value,
    totalReactionsSum.value,
    totalComments.value,
    totalShares.value,
    '',
    `${successCount.value} posts`,
  ];

  const wsData = [headers, ...dataRows, totalsRow];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths
  ws['!cols'] = [
    { wch: 4 },   // #
    { wch: 50 },  // Title
    { wch: 20 },  // Post ID
    { wch: 55 },  // URL
    { wch: 10 },  // Clicks
    { wch: 8 },   // Like
    { wch: 8 },   // Love
    { wch: 8 },   // Haha
    { wch: 8 },   // Wow
    { wch: 8 },   // Sad
    { wch: 8 },   // Angry
    { wch: 14 },  // Total
    { wch: 10 },  // Comments
    { wch: 10 },  // Shares
    { wch: 14 },  // Date
    { wch: 12 },  // Status
  ];

  // Freeze header row
  ws['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2', activeCell: 'A2', sqref: 'A2' };

  // Create workbook with sheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `${pageName} Engagement`);

  // Download
  XLSX.writeFile(wb, `FB-Engagement-${pageName}-${today}.xlsx`);
};
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>