<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useApi } from '~/composables/useApi';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface Activity {
  id: string;
  timestamp: string;
  action: string;
  collection: string;
  item: string;
  deal: boolean;
  user: User;
}

interface ActivityResponse {
  data: Activity[];
}

interface RoleUser {
  id: string;
  name: string;
  users: string[];
}

interface RoleResponse {
  data: RoleUser[];
}

interface UsersResponse {
  data: User[];
}

const SELLER_ROLE_ID = '487171a6-b731-4d96-b350-3481868c8f92';

const activities = ref<Activity[]>([]);
const sellers = ref<string[]>([]);
const sellersDetails = ref<User[]>([]);
const loading = ref(false);
const currentDate = ref(new Date());

// Modal state
const showModal = ref(false);
const selectedDay = ref<number | null>(null);
const selectedDateKey = ref<string>('');

// User detail modal state
const showUserDetailModal = ref(false);
const selectedUser = ref<User | null>(null);
const selectedUserActivities = ref<Activity[]>([]);

// Calendar state
const selectedMonth = ref(new Date().getMonth());
const selectedYear = ref(new Date().getFullYear());

// Get days in month
const daysInMonth = computed(() => {
  return new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate();
});

// Get first day of month (0 = Sunday, 1 = Monday, etc.)
const firstDayOfMonth = computed(() => {
  return new Date(selectedYear.value, selectedMonth.value, 1).getDay();
});

// Calendar grid
const calendarDays = computed(() => {
  const days = [];
  const totalDays = daysInMonth.value;
  const firstDay = firstDayOfMonth.value;

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= totalDays; day++) {
    days.push(day);
  }

  return days;
});

// Group activities by date and user
const attendanceByDate = computed(() => {
  const attendance: Record<string, Set<string>> = {};

  activities.value.forEach((activity) => {
    const date = new Date(activity.timestamp);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    if (!attendance[dateKey]) {
      attendance[dateKey] = new Set();
    }

    attendance[dateKey].add(activity.user.id);
  });

  return attendance;
});

// Get activities for a specific user on a specific day
const getUserActivitiesForDay = (userId: string, day: number) => {
  const dateKey = `${selectedYear.value}-${String(selectedMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  return activities.value.filter((activity) => {
    const activityDate = new Date(activity.timestamp);
    const activityDateKey = `${activityDate.getFullYear()}-${String(activityDate.getMonth() + 1).padStart(2, '0')}-${String(activityDate.getDate()).padStart(2, '0')}`;
    
    return activity.user.id === userId && activityDateKey === dateKey;
  });
};

// Get attendance for specific day
const getAttendanceForDay = (day: number) => {
  const dateKey = `${selectedYear.value}-${String(selectedMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const userIds = attendanceByDate.value[dateKey];

  if (!userIds) return { count: 0, percentage: 0 };

  const count = userIds.size;
  const percentage = sellers.value.length > 0 ? Math.round((count / sellers.value.length) * 100) : 0;

  return { count, percentage };
};

// Get sellers who were active on a specific day
const getActiveSellersForDay = (day: number) => {
  const dateKey = `${selectedYear.value}-${String(selectedMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const userIds = attendanceByDate.value[dateKey];

  if (!userIds) return [];

  return sellersDetails.value.filter(seller => userIds.has(seller.id));
};

// Get sellers who were absent on a specific day
const getAbsentSellersForDay = (day: number) => {
  const dateKey = `${selectedYear.value}-${String(selectedMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const userIds = attendanceByDate.value[dateKey];

  if (!userIds) return sellersDetails.value;

  return sellersDetails.value.filter(seller => !userIds.has(seller.id));
};

// Open modal for a specific day
const openDayDetails = (day: number) => {
  selectedDay.value = day;
  selectedDateKey.value = `${selectedYear.value}-${String(selectedMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  showModal.value = true;
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  selectedDay.value = null;
  selectedDateKey.value = '';
};

// Open user detail modal
const openUserDetail = (user: User) => {
  selectedUser.value = user;
  if (selectedDay.value) {
    selectedUserActivities.value = getUserActivitiesForDay(user.id, selectedDay.value);
  }
  showUserDetailModal.value = true;
};

// Close user detail modal
const closeUserDetailModal = () => {
  showUserDetailModal.value = false;
  selectedUser.value = null;
  selectedUserActivities.value = [];
};

// Get activity type label
const getActivityTypeLabel = (deal: boolean) => {
  return deal ? 'Deal Activity' : 'Login Activity';
};

// Get activity type color
const getActivityTypeColor = (deal: boolean) => {
  return deal ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
};

// Format timestamp
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

// Format date for modal title
const formatSelectedDate = computed(() => {
  if (!selectedDay.value) return '';
  const date = new Date(selectedYear.value, selectedMonth.value, selectedDay.value);
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});

// Get color class based on attendance percentage
const getAttendanceColor = (percentage: number) => {
  if (percentage === 0) return 'bg-gray-100';
  if (percentage < 30) return 'bg-red-100';
  if (percentage < 60) return 'bg-yellow-100';
  if (percentage < 90) return 'bg-blue-100';
  return 'bg-green-100';
};

// Month names
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Day names
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Navigation
const previousMonth = () => {
  if (selectedMonth.value === 0) {
    selectedMonth.value = 11;
    selectedYear.value--;
  } else {
    selectedMonth.value--;
  }
  fetchActivities();
};

const nextMonth = () => {
  if (selectedMonth.value === 11) {
    selectedMonth.value = 0;
    selectedYear.value++;
  } else {
    selectedMonth.value++;
  }
  fetchActivities();
};

const goToToday = () => {
  const today = new Date();
  selectedMonth.value = today.getMonth();
  selectedYear.value = today.getFullYear();
  fetchActivities();
};

// Fetch sellers from role
const fetchSellers = async () => {
  try {
    const response = await useApi<RoleResponse>('/roles', {
      method: 'GET',
      params: {
        filter: {
          id: {
            _eq: SELLER_ROLE_ID
          }
        },
        fields: 'users'
      }
    });

    if (response.data && response.data.length > 0) {
      sellers.value = response.data[0].users || [];
      
      // Fetch seller details
      if (sellers.value.length > 0) {
        const usersResponse = await useApi<UsersResponse>('/users', {
          method: 'GET',
          params: {
            filter: {
              id: {
                _in: sellers.value
              }
            },
            fields: 'id,first_name,last_name'
          }
        });
        
        sellersDetails.value = usersResponse.data || [];
      }
    }
  } catch (error) {
    console.error('Error fetching sellers:', error);
  }
};

// Fetch activities
const fetchActivities = async () => {
  loading.value = true;

  try {
    // Make sure we have sellers first
    if (sellers.value.length === 0) {
      await fetchSellers();
    }

    // Get first and last day of selected month
    const startDate = new Date(selectedYear.value, selectedMonth.value, 1);
    const endDate = new Date(selectedYear.value, selectedMonth.value + 1, 0, 23, 59, 59);

    const response = await useApi<ActivityResponse>('/activity', {
      method: 'GET',
      params: {
        fields: '*,user.id,user.first_name,user.last_name',
        filter: {
          user: {
            _in: sellers.value
          },
          timestamp: {
            _between: [startDate.toISOString(), endDate.toISOString()]
          },
           action: {
                _in: ['login', 'create']   // 👈 only show Login & Create
            },
          _or: [
            { deal: { _eq: false } },
            { deal: { _eq: true } }
          ]
        },
        limit: -1,
        sort: '-timestamp'
      }
    });

    activities.value = response.data || [];
  } catch (error) {
    console.error('Error fetching activities:', error);
  } finally {
    loading.value = false;
  }
};

// Initialize
onMounted(async () => {
  await fetchSellers();
  await fetchActivities();
});

// Check if day is today
const isToday = (day: number) => {
  const today = new Date();
  return (
    day === today.getDate() &&
    selectedMonth.value === today.getMonth() &&
    selectedYear.value === today.getFullYear()
  );
};
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Seller Attendance Report</h1>
      <p class="text-gray-600 mt-2">Track daily system usage by creators</p>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-sm text-gray-600">Total Creators</div>
        <div class="text-3xl font-bold text-gray-900 mt-2">{{ sellers.length }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-sm text-gray-600">Activities This Month</div>
        <div class="text-3xl font-bold text-gray-900 mt-2">{{ activities.length }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-sm text-gray-600">Current Month</div>
        <div class="text-3xl font-bold text-gray-900 mt-2">
          {{ monthNames[selectedMonth] }} {{ selectedYear }}
        </div>
      </div>
    </div>

    <!-- Calendar -->
    <div class="bg-white rounded-lg shadow">
      <!-- Calendar Header -->
      <div class="p-4 border-b border-gray-200 flex items-center justify-between">
        <button
          @click="previousMonth"
          class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          ← Previous
        </button>

        <div class="flex items-center gap-4">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ monthNames[selectedMonth] }} {{ selectedYear }}
          </h2>
          <button
            @click="goToToday"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Today
          </button>
        </div>

        <button
          @click="nextMonth"
          class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          Next →
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p class="text-gray-600 mt-4">Loading attendance data...</p>
      </div>

      <!-- Calendar Grid -->
      <div v-else class="p-4">
        <!-- Day Names -->
        <div class="grid grid-cols-7 gap-2 mb-2">
          <div
            v-for="dayName in dayNames"
            :key="dayName"
            class="text-center font-semibold text-gray-700 py-2"
          >
            {{ dayName }}
          </div>
        </div>

        <!-- Calendar Days -->
        <div class="grid grid-cols-7 gap-2">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="aspect-square"
          >
            <div
              v-if="day"
              :class="[
                'h-full rounded-lg p-2 transition cursor-pointer hover:shadow-md',
                getAttendanceColor(getAttendanceForDay(day).percentage),
                isToday(day) ? 'ring-2 ring-blue-500' : ''
              ]"
              @click="openDayDetails(day)"
            >
              <div class="flex flex-col h-full">
                <div class="text-sm font-semibold text-gray-900">{{ day }}</div>
                <div class="mt-auto">
                  <div class="text-xs text-gray-600">
                    {{ getAttendanceForDay(day).count }} / {{ sellers.length }}
                  </div>
                  <div class="text-xs font-semibold text-gray-900">
                    {{ getAttendanceForDay(day).percentage }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="p-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-center gap-6 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-gray-100 rounded"></div>
            <span>0%</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-red-100 rounded"></div>
            <span>1-29%</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-yellow-100 rounded"></div>
            <span>30-59%</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-blue-100 rounded"></div>
            <span>60-89%</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-green-100 rounded"></div>
            <span>90-100%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- HeadlessUI Modal -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <!-- Modal Header -->
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5">
                  <div class="flex items-start justify-between">
                    <div>
                      <DialogTitle as="h3" class="text-2xl font-bold text-white">
                        Attendance Details
                      </DialogTitle>
                      <p class="mt-1 text-blue-100 text-sm">{{ formatSelectedDate }}</p>
                    </div>
                    <button
                      @click="closeModal"
                      class="rounded-lg p-1 text-blue-100 hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Modal Body -->
                <div class="px-6 py-6 max-h-[70vh] overflow-y-auto">
                  <!-- Summary Cards -->
                  <div class="grid grid-cols-3 gap-4 mb-6">
                    <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                      <div class="flex items-center gap-2 mb-2">
                        <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        <div class="text-sm text-green-700 font-semibold">Active</div>
                      </div>
                      <div class="text-3xl font-bold text-green-900">
                        {{ selectedDay ? getActiveSellersForDay(selectedDay).length : 0 }}
                      </div>
                    </div>

                    <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                      <div class="flex items-center gap-2 mb-2">
                        <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        <div class="text-sm text-red-700 font-semibold">Absent</div>
                      </div>
                      <div class="text-3xl font-bold text-red-900">
                        {{ selectedDay ? getAbsentSellersForDay(selectedDay).length : 0 }}
                      </div>
                    </div>

                    <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <div class="flex items-center gap-2 mb-2">
                        <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                        <div class="text-sm text-blue-700 font-semibold">Rate</div>
                      </div>
                      <div class="text-3xl font-bold text-blue-900">
                        {{ selectedDay ? getAttendanceForDay(selectedDay).percentage : 0 }}%
                      </div>
                    </div>
                  </div>

                  <!-- Active Sellers Section -->
                  <div class="mb-6">
                    <div class="flex items-center gap-2 mb-4">
                      <div class="w-1 h-6 bg-green-500 rounded-full"></div>
                      <h4 class="text-lg font-bold text-gray-900">
                        Active Creators
                      </h4>
                      <span class="ml-auto bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {{ selectedDay ? getActiveSellersForDay(selectedDay).length : 0 }}
                      </span>
                    </div>

                    <div v-if="selectedDay && getActiveSellersForDay(selectedDay).length > 0" class="grid gap-3">
                      <div
                        v-for="seller in getActiveSellersForDay(selectedDay)"
                        :key="seller.id"
                        class="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-md cursor-pointer"
                        @click="openUserDetail(seller)"
                      >
                        <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {{ seller.first_name?.[0] }}{{ seller.last_name?.[0] }}
                        </div>
                        <div class="flex-1">
                          <div class="font-semibold text-gray-900 text-lg">
                            {{ seller.first_name }} {{ seller.last_name }}
                          </div>
                          <div class="text-sm text-gray-500 font-mono">{{ seller.id.substring(0, 8) }}...</div>
                          <div class="text-xs text-gray-400 mt-1">
                            {{ getUserActivitiesForDay(seller.id, selectedDay).length }} activities
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p class="text-gray-600 font-medium">No active sellers on this day</p>
                    </div>
                  </div>

                  <!-- Absent Sellers Section -->
                  <div>
                    <div class="flex items-center gap-2 mb-4">
                      <div class="w-1 h-6 bg-red-500 rounded-full"></div>
                      <h4 class="text-lg font-bold text-gray-900">
                        Absent Sellers
                      </h4>
                      <span class="ml-auto bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {{ selectedDay ? getAbsentSellersForDay(selectedDay).length : 0 }}
                      </span>
                    </div>

                    <div v-if="selectedDay && getAbsentSellersForDay(selectedDay).length > 0" class="grid gap-3">
                      <div
                        v-for="seller in getAbsentSellersForDay(selectedDay)"
                        :key="seller.id"
                        class="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-red-100 hover:border-red-300 transition-all hover:shadow-md"
                      >
                        <div class="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {{ seller.first_name?.[0] }}{{ seller.last_name?.[0] }}
                        </div>
                        <div class="flex-1">
                          <div class="font-semibold text-gray-900 text-lg">
                            {{ seller.first_name }} {{ seller.last_name }}
                          </div>
                          <div class="text-sm text-gray-500 font-mono">{{ seller.id.substring(0, 8) }}...</div>
                        </div>
                        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                      </div>
                    </div>
                    <div v-else class="text-center py-8 bg-green-50 rounded-xl border-2 border-dashed border-green-200">
                      <svg class="w-12 h-12 mx-auto text-green-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <p class="text-green-700 font-semibold">Perfect attendance!</p>
                      <p class="text-green-600 text-sm mt-1">All sellers were active on this day</p>
                    </div>
                  </div>
                </div>

                <!-- Modal Footer -->
                <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                  <button
                    @click="closeModal"
                    class="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- User Detail Modal -->
    <TransitionRoot appear :show="showUserDetailModal" as="template">
      <Dialog as="div" @close="closeUserDetailModal" class="relative z-[60]">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/40" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <!-- User Detail Header -->
                <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-5">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-4">
                      <div v-if="selectedUser" class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-2xl shadow-lg">
                        {{ selectedUser.first_name?.[0] }}{{ selectedUser.last_name?.[0] }}
                      </div>
                      <div>
                        <DialogTitle as="h3" class="text-2xl font-bold text-white">
                          {{ selectedUser?.first_name }} {{ selectedUser?.last_name }}
                        </DialogTitle>
                        <p class="mt-1 text-green-100 text-sm">Activity Details for {{ formatSelectedDate }}</p>
                      </div>
                    </div>
                    <button
                      @click="closeUserDetailModal"
                      class="rounded-lg p-1 text-green-100 hover:bg-green-600 hover:text-white transition-colors"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- User Detail Body -->
                <div class="px-6 py-6 max-h-[60vh] overflow-y-auto">
                  <!-- Activity Summary -->
                  <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <div class="flex items-center gap-2 mb-2">
                        <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                        </svg>
                        <div class="text-sm text-blue-700 font-semibold">Login Activities</div>
                      </div>
                      <div class="text-3xl font-bold text-blue-900">
                        {{ selectedUserActivities.filter(a => !a.deal).length }}
                      </div>
                    </div>

                    <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                      <div class="flex items-center gap-2 mb-2">
                        <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                        </svg>
                        <div class="text-sm text-purple-700 font-semibold">Deal Activities</div>
                      </div>
                      <div class="text-3xl font-bold text-purple-900">
                        {{ selectedUserActivities.filter(a => a.deal).length }}
                      </div>
                    </div>
                  </div>

                  <!-- Activities Timeline -->
                  <div>
                    <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Activity Timeline
                      <span class="ml-auto text-sm font-normal text-gray-500">
                        {{ selectedUserActivities.length }} total
                      </span>
                    </h4>

                    <div v-if="selectedUserActivities.length > 0" class="space-y-3">
                      <div
                        v-for="(activity, index) in selectedUserActivities"
                        :key="activity.id"
                        class="relative pl-8 pb-4"
                      >
                        <!-- Timeline line -->
                        <div
                          v-if="index < selectedUserActivities.length - 1"
                          class="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-200"
                        ></div>

                        <!-- Timeline dot -->
                        <div
                          :class="[
                            'absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center',
                            activity.deal ? 'bg-purple-500' : 'bg-blue-500'
                          ]"
                        >
                          <svg v-if="activity.deal" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                          </svg>
                          <svg v-else class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                          </svg>
                        </div>

                        <!-- Activity card -->
                        <div class="bg-white rounded-lg border-2 border-gray-100 p-4 hover:border-gray-200 transition-colors">
                          <div class="flex items-start justify-between mb-2">
                            <span
                              :class="[
                                'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
                                getActivityTypeColor(activity.deal)
                              ]"
                            >
                              {{ getActivityTypeLabel(activity.deal) }}
                            </span>
                            <span class="text-sm font-medium text-gray-600">
                              {{ formatTimestamp(activity.timestamp) }}
                            </span>
                          </div>

                          <div class="grid grid-cols-2 gap-3 mt-3 text-sm">
                            <div>
                              <span class="text-gray-500">Action:</span>
                              <span class="ml-2 font-medium text-gray-900">{{ activity.action }}</span>
                            </div>
                            <div>
                              <span class="text-gray-500">Collection:</span>
                              <span class="ml-2 font-medium text-gray-900">{{ activity.collection }}</span>
                            </div>
                            <div class="col-span-2">
                              <span class="text-gray-500">Item:</span>
                              <span class="ml-2 font-mono text-xs text-gray-900">{{ activity.item }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-else class="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p class="text-gray-600 font-medium">No activities found</p>
                    </div>
                  </div>
                </div>

                <!-- User Detail Footer -->
                <div class="bg-gray-50 px-6 py-4 flex justify-between items-center">
                  <button
                    @click="closeUserDetailModal"
                    class="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                  >
                    Back
                  </button>
                  <span class="text-sm text-gray-500">
                    User ID: {{ selectedUser?.id.substring(0, 8) }}...
                  </span>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>