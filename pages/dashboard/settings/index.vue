<!-- pages/dashboard/settings/index.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row">
      <!-- Mobile Filter Toggle -->
      <div class="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <button @click="showMobileFilters = !showMobileFilters"
          class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span class="font-medium">Filters & Actions</span>
          <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': showMobileFilters }"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <!-- Sidebar -->
      <div
        class="w-full lg:w-64 bg-white/90 backdrop-blur-sm shadow-lg lg:shadow-none border-r border-gray-200/50 transition-all duration-300 ease-in-out"
        :class="[
          'lg:block lg:min-h-screen',
          showMobileFilters ? 'block' : 'hidden'
        ]">
        <nav class="p-4 lg:p-6 space-y-6">
          <!-- Current Filter Display -->
          <div class="lg:hidden bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Activity Feed</h3>
                <p class="text-sm text-gray-600">Real-time system activity</p>
              </div>
            </div>
          </div>

          <!-- Activity Feed Title (Desktop) -->
          <div class="hidden lg:block">
            <div
              class="flex items-center space-x-3 p-4 text-gray-900 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/50">
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span class="font-semibold text-gray-900">Activity Feed</span>
                <p class="text-xs text-gray-600">Real-time monitoring</p>
              </div>
            </div>
          </div>

          <!-- Filters Section -->
          <div>
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </h3>
            <div class="space-y-2">
              <button @click="selectedFilter = 'all'" :class="[
                'w-full flex items-center space-x-3 px-4 py-3 text-sm rounded-xl transition-all duration-200 group',
                selectedFilter === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]">
                <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-medium">All Activity</span>
              </button>

              <button @click="selectedFilter = 'my'" :class="[
                'w-full flex items-center space-x-3 px-4 py-3 text-sm rounded-xl transition-all duration-200 group',
                selectedFilter === 'my'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]">
                <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="font-medium">My Activity</span>
              </button>
            </div>
          </div>


          <!-- Actions Section -->
          <div>
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Actions
            </h3>
            <div class="space-y-2">
              <div
                class="flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                <div
                  class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span class="font-medium group-hover:text-gray-900">Create</span>
              </div>

              <div
                class="flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                <div
                  class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span class="font-medium group-hover:text-gray-900">Update</span>
              </div>

              <div
                class="flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                <div
                  class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <span class="font-medium group-hover:text-gray-900">Delete</span>
              </div>

              <div
                class="flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                <div
                  class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                  <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span class="font-medium group-hover:text-gray-900">Comment</span>
              </div>

              <div
                class="flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                <div
                  class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span class="font-medium group-hover:text-gray-900">Log in</span>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="flex-1 bg-white/50 backdrop-blur-sm lg:rounded-tl-2xl lg:shadow-xl">
        <!-- Activity Header -->
        <div class="border-b border-gray-200/50 bg-white/80 backdrop-blur-sm px-6 py-6 lg:rounded-tl-2xl">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h1 class="text-2xl font-bold text-gray-900 flex items-center">
              <div
                class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Activity Feed
            </h1>

            <!-- Date Filters -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <select v-model="selectedFilterType"
                class="px-4 py-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                :disabled="loading || isFilterLoading">
                <option value="today">Today</option>
                <option value="day">By Day</option>
                <option value="month">By Month</option>
              </select>

              <input v-if="selectedFilterType === 'day'" type="date" v-model="selectedDate"
                class="px-4 py-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                :disabled="loading || isFilterLoading" />

              <input v-if="selectedFilterType === 'month'" type="month" v-model="selectedMonth"
                class="px-4 py-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                :disabled="loading || isFilterLoading" />
            </div>
          </div>
          <div class="flex mt-2 justify-end items-center">
            <div
              class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full max-w-28 flex items-center justify-center   lg:mt-0">
              {{ totalItems > 0 ? `1-${Math.min(itemsPerPage, totalItems)} of ${totalItems}` : '0 items' }}
            </div>
          </div>
        </div>


        <!-- Activity Table Container -->
        <div class="overflow-hidden relative">
          <!-- Filter Loading Overlay -->
          <div v-if="isFilterLoading"
            class="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center">
            <div class="text-center">
              <div class="relative">
                <div class="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto">
                </div>
                <div
                  class="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-blue-400 mx-auto">
                </div>
              </div>
              <p class="mt-4 text-lg font-medium text-gray-700">Updating results...</p>
              <p class="text-sm text-gray-500">Please wait while we filter your data</p>
            </div>
          </div>

          <!-- Table Header -->
          <div class="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200/50 px-6 py-4">
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Action</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Collection</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Action On</span>
                <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Action By</span>
              </div>
            </div>
          </div>

          <!-- Activity Items -->
          <div class="divide-y divide-gray-200/50">
            <div v-for="(item, index) in filteredActivity" :key="item.id"
              class="px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200 group cursor-pointer"
              :style="{ animationDelay: `${index * 50}ms` }">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                <!-- Action -->
                <div class="sm:col-span-1">
                  <span
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 group-hover:shadow-md"
                    :class="{
                      'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300': item.action === 'login',
                      'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300': item.action === 'create',
                      'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300': item.action === 'update',
                      'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300': item.action === 'delete'
                    }">
                    {{ item.action }}
                  </span>
                </div>

                <!-- Collection -->
                <div class="sm:col-span-1 flex items-center">
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-all duration-200">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{{
                    item.collection }}</span>
                </div>

                <!-- Action On (Timestamp) -->
                <div class="sm:col-span-1">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span class="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">{{
                      formatTimestamp(item.timestamp) }}</span>
                  </div>
                </div>

                <!-- Action By (User) -->
                <div class="sm:col-span-1 flex items-center">
                  <div
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mr-3 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 transform group-hover:scale-105">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                      {{ item.user?.first_name }} {{ item.user?.last_name }}
                    </span>
                    <p class="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">{{ item.user?.title }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Loading State -->
          <div v-if="loading && !isFilterLoading" class="px-6 py-16 text-center">
            <div class="relative">
              <div class="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
              <div
                class="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-blue-400 mx-auto">
              </div>
            </div>
            <div class="mt-6">
              <p class="text-xl font-medium text-gray-700">Loading activity...</p>
              <p class="text-sm text-gray-500 mt-2">Fetching the latest system activity</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="!loading && !isFilterLoading && filteredActivity.length === 0" class="px-6 py-16 text-center">
            <div
              class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No activity found</h3>
            <p class="text-gray-500 max-w-sm mx-auto">There are no activities matching your current filters. Try
              adjusting your search criteria or check back later.</p>
            <button @click="selectedFilterType = 'today'; selectedFilter = 'all'"
              class="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              Reset Filters
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredActivity.length > 0"
          class="bg-white/80 backdrop-blur-sm px-6 py-6 border-t border-gray-200/50">
          <div class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div class="text-sm text-gray-700 font-medium">
              Showing <span class="font-bold text-blue-600">{{ startIndex }}</span> to <span
                class="font-bold text-blue-600">{{ endIndex }}</span> of <span class="font-bold text-purple-600">{{
                totalItems }}</span> results
            </div>
            <div class="flex space-x-3">
              <button @click="previousPage" :disabled="currentPage === 1"
                class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md disabled:hover:shadow-sm flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
              </button>

              <!-- Page Numbers -->
              <div class="hidden sm:flex items-center space-x-2">
                <template v-for="page in visiblePages" :key="page">
                  <button v-if="page !== '...'" @click="currentPage = page" :class="[
                    'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    page === currentPage
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  ]">
                    {{ page }}
                  </button>
                  <span v-else class="px-2 py-2 text-gray-500">...</span>
                </template>
              </div>

              <button @click="nextPage" :disabled="currentPage === totalPages"
                class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md disabled:hover:shadow-sm flex items-center space-x-2">
                <span>Next</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActivityItem } from '~/types/activity';
import type { IResponse } from '~/types/api';
import { useTelegramBot } from '~/composables/useTelegramBot';
import dayjs from 'dayjs';

const selectedFilterType = ref<'today' | 'day' | 'month'>('today');
const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
const selectedMonth = ref(dayjs().format('YYYY-MM'));
const isFilterLoading = ref(false);
const showMobileFilters = ref(false);

// SEO
useHead({
  title: 'Activity Feed - Dashboard'
});

// State
const selectedFilter = ref<'all' | 'my'>('all');
const currentPage = ref(1);
const itemsPerPage = ref(100);

// Fetch activity data
const { data: activityResponse, pending: loading } = await useLazyAsyncData('activity', async () => {
  const fields = [
    'action',
    'collection',
    'timestamp',
    'user.id',
    'user.avatar.id',
    'user.email',
    'user.first_name',
    'user.last_name',
    'user.title',
    'id'
  ];

  const queryParams = new URLSearchParams();
  queryParams.append('limit', itemsPerPage.value.toString());
  fields.forEach(field => queryParams.append('fields[]', field));
  queryParams.append('sort[]', '-timestamp');
  queryParams.append('filter[action][_in]', 'login,create');
  queryParams.append('page', currentPage.value.toString());

  if (dateRange.value) {
    queryParams.append('filter[timestamp][_between][]', dateRange.value[0]);
    queryParams.append('filter[timestamp][_between][]', dateRange.value[1]);
  }

  const response = await useApi<IResponse<ActivityItem[]>>(
    `/activity?${queryParams.toString()}&meta=filter_count`,
    { method: 'GET' }
  );

  return response;
});

// Computed properties
const filteredActivity = computed(() => {
  if (selectedFilter.value === 'my') {
    return activity.value;
  }
  return activity.value;
});

const activity = computed(() => activityResponse.value?.data || []);
const totalItems = computed(() => activityResponse.value?.meta?.filter_count || 0);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1);
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value));

// Pagination helper
const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }
  }

  return pages;
});

const dateRange = computed(() => {
  if (selectedFilterType.value === 'today') {
    const start = dayjs().startOf('day').toISOString();
    const end = dayjs().endOf('day').toISOString();
    return [start, end];
  }

  if (selectedFilterType.value === 'day' && selectedDate.value) {
    const start = dayjs(selectedDate.value).startOf('day').toISOString();
    const end = dayjs(selectedDate.value).endOf('day').toISOString();
    return [start, end];
  }

  if (selectedFilterType.value === 'month' && selectedMonth.value) {
    const start = dayjs(selectedMonth.value).startOf('month').toISOString();
    const end = dayjs(selectedMonth.value).endOf('month').toISOString();
    return [start, end];
  }

  return null;
});

// Methods
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Watch for filter changes
watch([selectedFilterType, selectedDate, selectedMonth], async () => {
  currentPage.value = 1;
  isFilterLoading.value = true;
  await refreshNuxtData('activity');
  isFilterLoading.value = false;
});

// Close mobile filters when clicking outside or changing to desktop
watch(showMobileFilters, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});

definePageMeta({
  middleware: 'auth',
});
</script>

<style scoped>
/* Animation for activity items */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.divide-y>div {
  animation: slideInUp 0.3s ease-out forwards;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #7c3aed);
}

/* Backdrop blur fallback */
@supports not (backdrop-filter: blur(12px)) {
  .backdrop-blur-sm {
    background-color: rgba(255, 255, 255, 0.95);
  }
}

/* Mobile responsive improvements */
@media (max-width: 640px) {
  .grid-cols-4 {
    display: block;
  }

  .grid-cols-4>div {
    margin-bottom: 0.75rem;
  }

  .grid-cols-4>div:last-child {
    margin-bottom: 0;
  }
}
</style>