<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                <span class="text-white text-xs font-bold">◆</span>
              </div>
              <span class="font-medium text-gray-900">BAKSEY SYSTEM</span>
            </div>
          </div>
          <div class="text-sm text-gray-500">
            1-100 of {{ totalItems }}
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto flex">
      <!-- Sidebar -->
      <div class="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
        <nav class="mt-6 px-4">
          <div class="space-y-1">
            <div class="flex items-center space-x-3 px-3 py-2 text-gray-900 bg-gray-100 rounded-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="font-medium">Activity Feed</span>
            </div>
          </div>
          
          <div class="mt-8">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Filters
            </h3>
            <div class="space-y-1">
              <button 
                @click="selectedFilter = 'all'"
                :class="[
                  'w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors',
                  selectedFilter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>All Activity</span>
              </button>
              
              <button 
                @click="selectedFilter = 'my'"
                :class="[
                  'w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors',
                  selectedFilter === 'my' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span>My Activity</span>
              </button>
            </div>
          </div>

          <div class="mt-8">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Actions
            </h3>
            <div class="space-y-1">
              <div class="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span>Create</span>
              </div>
              
              <div class="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                <span>Update</span>
              </div>
              
              <div class="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                <span>Delete</span>
              </div>
              
              <div class="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <span>Comment</span>
              </div>
              
              <div class="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
                <span>Log in</span>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="flex-1 bg-white">
        <!-- Activity Header -->
        <div class="border-b border-gray-200 bg-white px-6 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-semibold text-gray-900 flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Activity Feed
            </h1>
          </div>
        </div>

        <!-- Activity Table -->
        <div class="overflow-hidden">
          <!-- Table Header -->
          <div class="bg-gray-50 border-b border-gray-200 px-6 py-3">
            <div class="grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <div>Action</div>
              <div>Collection</div>
              <div class="flex items-center">
                Action On
                <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
              </div>
              <div>Action By</div>
            </div>
          </div>

          <!-- Activity Items -->
          <div class="divide-y divide-gray-200">
            <div 
              v-for="(item, index) in filteredActivity" 
              :key="item.id"
              class="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div class="grid grid-cols-4 gap-4 items-center">
                <!-- Action -->
                <div>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ item.action }}
                  </span>
                </div>

                <!-- Collection -->
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <span class="text-sm text-gray-900">{{ item.collection }}</span>
                </div>

                <!-- Action On (Timestamp) -->
                <div>
                  <span class="text-sm text-gray-600">{{ formatTimestamp(item.timestamp) }}</span>
                </div>

                <!-- Action By (User) -->
                <div class="flex items-center">
                  <div class="w-6 h-6 rounded-full bg-gray-300 mr-2 flex items-center justify-center">
                    <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                 <div>
                   <span class="text-sm text-gray-900">{{ item.user?.first_name }} {{ item.user?.last_name }}</span>
                  <p class="text-xs text-gray-500">{{ item.user?.title }}</p>
                 </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="px-6 py-12 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-sm text-gray-500">Loading activity...</p>
          </div>

          <!-- Empty State -->
          <div v-if="!loading && filteredActivity.length === 0" class="px-6 py-12 text-center">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 class="text-sm font-medium text-gray-900 mb-1">No activity found</h3>
            <p class="text-sm text-gray-500">There are no activities matching your current filters.</p>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredActivity.length > 0" class="bg-white px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing {{ startIndex }} to {{ endIndex }} of {{ totalItems }} results
            </div>
            <div class="flex space-x-2">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
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

// SEO
useHead({
  title: 'Activity Feed - Dashboard'
});

// State
const selectedFilter = ref<'all' | 'my'>('all');
const currentPage = ref(1);
const itemsPerPage = ref(100);

// Fetch activity data
const { data: activityData, pending: loading } = await useLazyAsyncData('activity', async () => {
  // Build query parameters manually
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
  queryParams.append('page', currentPage.value.toString());
  
  const response = await useApi<IResponse<ActivityItem[]>>(
    `/activity?${queryParams.toString()}`,
    {
      method: 'GET'
    }
  );
  
  return response.data || [];
});

// Computed properties
const activity = computed(() => activityData.value || []);

const filteredActivity = computed(() => {
  if (selectedFilter.value === 'my') {
    // You would filter by current user ID here
    // For now, returning all activities
    return activity.value;
  }
  return activity.value;
});

const totalItems = computed(() => filteredActivity.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1);
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value));

// Methods
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
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
watch(selectedFilter, () => {
  currentPage.value = 1;
});
definePageMeta({
    middleware: 'auth',
});
</script>

<style scoped>
/* Additional custom styles if needed */
</style>