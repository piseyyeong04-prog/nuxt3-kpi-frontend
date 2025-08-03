<template>
  <div class="bg-white dark:bg-dark">
    <!-- Mobile Header -->
    <div
      class="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 dark:text-white text-dark p-4 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <button @click="toggleSidebar" class="focus:outline-none md:hidden" aria-label="Toggle Sidebar">
          <Icon :icon="isSidebarOpen ? 'mdi:close' : 'mdi:menu'" class="text-2xl" />
        </button>
        <h1 class="text-md sm:text-xl font-bold md:hidden">BAKSEY  </h1>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Theme toggle -->
        <button @click="customToggleTheme"
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors hidden md:flex items-center justify-center">
          <Icon
            :icon="theme === 'dark' ? 'line-md:sunny-filled-loop-to-moon-filled-alt-loop-transition' : 'line-md:moon-filled-alt-to-sunny-filled-loop-transition'"
            class="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <!-- Notifications -->
        <div class="relative" ref="notificationDropdownContainer">
          <button @click="toggleNotificationDropdown"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors">
            <div class="relative">
              <Icon icon="mdi:bell" class="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span v-if="notifications.length > 0"
                class="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 text-xs bg-red-500 text-white rounded-full">{{
                  notifications.length }}</span>
            </div>
          </button>

          <!-- Notification Dropdown -->
          <div v-if="notificationDropdownOpen"
            class="absolute   right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 "
            v-motion-fade-visible-once>
            <div class="p-4 border-b border-gray-100 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                <span
                  class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                  {{ notifications.length }}
                </span>
              </div>
            </div>

            <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
              No notifications
            </div>

            <div v-else>
              <div v-for="(notification, index) in notifications" :key="index"
                class="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer">
                <div class="flex items-start">
                  <div class="w-2 h-2 mt-1.5 bg-primary-500 rounded-full mr-3"></div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ notification.title }}</p>
                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      {{ new Date(notification.date_created).toLocaleString() }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-3 text-center border-t border-gray-100 dark:border-gray-700">
              <button class="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                View all notifications
              </button>
            </div>
          </div>
        </div>


        <!-- Language Selector -->
        <div class="relative" ref="dropdownContainer">
          <button @click="toggleDropdown"
            class="flex items-center px-1  sm:px-3 px-1  sm:py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors focus:outline-none">
            <span class="mr-1">{{ locale === 'en' ? 'English' : 'Khmer' }}</span>
            <Icon icon="mdi:chevron-down" class="w-4 h-4" />
          </button>
          <div v-if="dropdownOpen"
            class="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden animate-fadeIn">
            <button @click="switchLanguage('en')" :class="[
              'flex items-center w-full text-left px-4 py-2.5 text-sm transition-colors',
              'hover:bg-gray-50 dark:hover:bg-gray-700',
              locale === 'en' ? 'font-medium text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-gray-700/50' : 'text-gray-700 dark:text-gray-300'
            ]">
              <Icon icon="emojione-v1:flag-for-united-states" class="w-4 h-4 mr-2" />
              English
            </button>
            <button @click="switchLanguage('km')" :class="[
              'flex items-center w-full text-left px-4 py-2.5 text-sm transition-colors',
              'hover:bg-gray-50 dark:hover:bg-gray-700',
              locale === 'km' ? 'font-medium text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-gray-700/50' : 'text-gray-700 dark:text-gray-300'
            ]">
              <Icon icon="emojione-v1:flag-for-cambodia" class="w-4 h-4 mr-2" />
              Khmer
            </button>
          </div>
        </div>
        <!-- User Avatar Dropdown -->
        <div class="relative" ref="userDropdownContainer">
          <button @click="toggleUserDropdown" class="flex items-center focus:outline-none group">
            <div class="relative">
              <img :src="useImg(auth.user?.avatar || '/user-avatar.png')" alt="User Avatar"
                class="w-9 h-9 rounded-full object-cover border-2 border-gray-200 transition-all duration-300 group-hover:border-primary-500 dark:border-gray-700 dark:group-hover:border-primary-400" />
              <div
                class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white dark:border-gray-800">
              </div>
            </div>
          </button>

          <div v-if="userDropdownOpen"
            class="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700 overflow-hidden transition-all duration-200 ease-in-out transform origin-top-right animate-fadeIn">
            <div class="px-5 py-4">
              <div class="flex items-center space-x-3">
                <img :src="useImg(auth.user?.avatar || '/default-avatar.png')" alt="User Avatar"
                  class="w-12 h-12 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700" />
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{ auth.user?.first_name }} {{ auth.user?.last_name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ auth.user?.email }}
                  </p>
                </div>
                <button @click="customToggleTheme"
                  class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none md:hidden ml-auto">
                  <Icon :icon="theme === 'dark' ? 'mdi:weather-night' : 'mdi:weather-sunny'" class="w-5 h-5" />
                </button>
              </div>

              <div class="mt-4 py-3 px-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <p class="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Department
                  </p>
                  <span
                    class="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full dark:bg-gray-600 dark:text-gray-300">
                    {{ auth.user?.department?.title }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Role
                  </p>
                  <div class="flex flex-wrap gap-1">
                    <span v-for="(role, index) in formatDepartments(auth.user?.role.name)" :key="index"
                      class="px-2 py-1 text-xs bg-primary-500 text-dark dark:text-white rounded-full dark:bg-primary-600">
                      {{ role }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 dark:border-gray-700">
              <ul>
                <li>
                  <NuxtLink to="/profile"
                    class="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/30 transition-colors duration-150"
                    @click="closeUserDropdown">
                    <Icon icon="mdi:account" class="text-lg mr-3 text-gray-500 dark:text-gray-400" />
                    Profile
                  </NuxtLink>
                </li>

                <li>
                  <button @click="handleLogout"
                    class="w-full flex items-center px-5 py-3 text-sm text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10 transition-colors duration-150">
                    <Icon icon="mdi:logout" class="text-lg mr-3" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- Sidebar -->
    <aside :class="[
      'fixed top-0 left-0 h-full w-64 z-50 shadow-lg',
      'bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100',
      'md:translate-x-0 transition-all duration-300',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <!-- Make this section scrollable -->
      <div class="h-full flex flex-col pt-16 md:pt-5">
        <div class="flex-1 overflow-y-auto px-3 py-2">
          <h2
            class="text-2xl font-bold text-center mb-8 hidden md:block text-blue-500">
            BAKSEY System
          </h2>

          <nav>
            <ul class="space-y-2">
              <li v-for="item in localizedMenuItems" :key="item.to" class="group">
                <!-- Items with submenu -->
                <div v-if="item.hasSubmenu" class="mb-2">
                  <button @click="toggleSubmenu(item.to)" class="flex items-center justify-between w-full p-3 rounded-xl font-medium transition-all duration-300 ease-in-out
                relative overflow-hidden group/btn
                text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50
                hover:shadow-md transform hover:-translate-y-0.5" :class="{
                  'bg-gray-50 dark:bg-gray-800/50 shadow-md': openSubmenus[item.to],
                  'border-b-2 border-blue-500': openSubmenus[item.to] && getIconColor(item.icon) === 'blue',
                  'border-b-2 border-red-500': openSubmenus[item.to] && getIconColor(item.icon) === 'red',
                  'border-b-2 border-green-500': openSubmenus[item.to] && getIconColor(item.icon) === 'green'
                }">
                    <div class="flex items-center">
                      <Icon :icon="item.icon" class="mr-3 text-xl transition-all duration-300" :class="[
                        getIconColorClass(item.icon),
                        { 'scale-110': openSubmenus[item.to] }
                      ]" />
                      <span class="text-start">{{ item.label }}</span>
                    </div>
                    <Icon :icon="openSubmenus[item.to] ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                      class="text-sm transition-transform duration-300"
                      :class="{ 'rotate-180': openSubmenus[item.to] }" />
                  </button>

                  <!-- Submenu with smooth animation -->
                  <div v-show="openSubmenus[item.to]"
                    class="mt-2 ml-8 pl-4 border-l-2 overflow-hidden transition-all duration-300" :class="[
                      getIconColor(item.icon) === 'blue' ? 'border-blue-200 dark:border-blue-800' : '',
                      getIconColor(item.icon) === 'red' ? 'border-red-200 dark:border-red-800' : '',
                      getIconColor(item.icon) === 'green' ? 'border-green-200 dark:border-green-800' : ''
                    ]">
                    <NuxtLink v-for="sub in item.submenu" :key="sub.to" :to="sub.to" class="block py-2.5 px-3 my-1 text-sm rounded-lg transition-all duration-300
                  text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/30
                  transform hover:translate-x-1 relative group/sub" @click="closeSidebarOnMobile" :class="{
                    'bg-gray-50 dark:bg-gray-800/50 font-medium border-b-2': $route.path.includes(sub.to) && sub.to !== '/',
                    'border-blue-500 text-blue-600 dark:text-blue-400': $route.path.includes(sub.to) && sub.to !== '/' && getIconColor(item.icon) === 'blue',
                    'border-red-500 text-red-600 dark:text-red-400': $route.path.includes(sub.to) && sub.to !== '/' && getIconColor(item.icon) === 'red',
                    'border-green-500 text-green-600 dark:text-green-400': $route.path.includes(sub.to) && sub.to !== '/' && getIconColor(item.icon) === 'green'
                  }">
                      <div class="flex items-center">
                        <div class="w-1.5 h-1.5 rounded-full mr-2 transition-all duration-300" :class="[
                          getIconColor(item.icon) === 'blue' ? 'bg-blue-400' : '',
                          getIconColor(item.icon) === 'red' ? 'bg-red-400' : '',
                          getIconColor(item.icon) === 'green' ? 'bg-green-400' : '',
                          { 'scale-150': $route.path.includes(sub.to) && sub.to !== '/' }
                        ]">
                        </div>
                        {{ sub.label[locale as 'en' | 'km'] }}
                      </div>
                    </NuxtLink>
                  </div>
                </div>

                <!-- Regular menu items -->
                <NuxtLink v-else :to="item.to" class="flex items-center p-3 rounded-xl font-medium transition-all duration-300 ease-in-out 
              relative overflow-hidden group/link
              text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50
              hover:shadow-md transform hover:-translate-y-0.5" :class="{
                'bg-gray-50 dark:bg-gray-800/50 shadow-md border-b-2 font-semibold': $route.path === item.to || ($route.path.includes(item.to) && item.to !== '/'),
                'border-blue-500 text-blue-700 dark:text-blue-400': ($route.path === item.to || ($route.path.includes(item.to) && item.to !== '/')) && getIconColor(item.icon) === 'blue',
                'border-red-500 text-red-700 dark:text-red-400': ($route.path === item.to || ($route.path.includes(item.to) && item.to !== '/')) && getIconColor(item.icon) === 'red',
                'border-green-500 text-green-700 dark:text-green-400': ($route.path === item.to || ($route.path.includes(item.to) && item.to !== '/')) && getIconColor(item.icon) === 'green'
              }" @click="closeSidebarOnMobile">
                  <Icon :icon="item.icon" class="mr-3 text-xl transition-all duration-300" :class="[
                    getIconColorClass(item.icon, item),
                    { 'scale-110': route.path === item.to || (route.path.includes(item.to) && item.to !== '/') }
                  ]" />
                  <span>{{ item.label }}</span>

                  <!-- Active indicator glow effect -->
                  <div v-if="$route.path === item.to || ($route.path.includes(item.to) && item.to !== '/')"
                    class="absolute inset-0 rounded-xl opacity-10 pointer-events-none" :class="[
                      getIconColor(item.icon) === 'blue' ? 'bg-blue-500' : '',
                      getIconColor(item.icon) === 'red' ? 'bg-red-500' : '',
                      getIconColor(item.icon) === 'green' ? 'bg-green-500' : ''
                    ]">
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Sidebar bottom (sticky footer) -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div class="mt-2 text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
              BAKSEY Tech Solution © {{ new Date().getFullYear() }}
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Version 1.0</p>
          </div>
        </div>
      </div>
    </aside>


    <!-- Overlay for mobile -->
    <div v-if="isSidebarOpen" @click="closeSidebar" class="fixed inset-0 bg-black/50 z-40 md:hidden"></div>

    <!-- Page content -->
    <div class="md:ml-64 pt-20 p-2  ">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import useTheme from '~/composables/useTheme'
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/store/useAuthStore'
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useInternetStatus } from '~/utils/useInternetStatus';
import { usePermissions } from '~/composables/usePermissions'
// Import notification type
import type { IResponse } from '~/types/api';
import type { INotification } from '~/types/notification';

const { isSale, isAdmin, isHr } = usePermissions()
const auth = useAuthStore()
const router = useRouter();
const route = useRoute();
/// Form State
const firstName = ref('');
const lastName = ref('');
const departments = ref<string[]>([]);
const roles = ref<string[]>([]);
const email = ref('');
const avatarFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);
// Original Values
const originalFirstName = ref('');
const originalLastName = ref('');
onMounted(() => {
  if (auth.user) {
    firstName.value = auth.user.first_name;
    lastName.value = auth.user.last_name;
    roles.value = auth.user?.role.name ? [auth.user.role.name] : [];
    originalFirstName.value = auth.user.first_name;
    originalLastName.value = auth.user.last_name;
  }
});

// console.log('auth user:', auth.user)

// Add this function to your script setup
const formatDepartments = (departments: any) => {
  if (!departments) return [];

  // Handle both string and array types
  const deptArray = Array.isArray(departments)
    ? departments
    : departments.split(',');

  return deptArray.map((dept: string) => {
    const trimmed = dept.trim();
    // Replace underscores with spaces and capitalize each word
    return trimmed.split('_')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  });
};

const { t, locale } = useI18n();
const { theme } = useTheme()

// Notifications
const notifications = ref<INotification[]>([]);
const notificationDropdownOpen = ref(false);
const notificationDropdownContainer = ref<HTMLElement | null>(null);

// Function to toggle notification dropdown
const toggleNotificationDropdown = () => {
  notificationDropdownOpen.value = !notificationDropdownOpen.value;
  if (notificationDropdownOpen.value) {
    // Close other dropdowns when opening notifications
    userDropdownOpen.value = false;
    dropdownOpen.value = false;
  }
};

const closeNotificationDropdown = () => {
  notificationDropdownOpen.value = false;
};

// Handle click outside for notification dropdown
const handleNotificationClickOutside = (event: MouseEvent) => {
  if (notificationDropdownContainer.value && !notificationDropdownContainer.value.contains(event.target as Node)) {
    closeNotificationDropdown();
  }
};

// Function to fetch notifications
const fetchNotificationsData = async () => {
  try {
    const response = await (<Promise<IResponse<INotification[]>>>(
      useApi(
        `/items/notifications?filter[status]=published&sort=-date_created&fields=*`,
        { method: 'GET' }
      )
    ));
    notifications.value = response.data || [];
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    notifications.value = [];
  }
};

// Close all dropdowns
const closeAllDropdowns = () => {
  notificationDropdownOpen.value = false;
  userDropdownOpen.value = false;
  dropdownOpen.value = false;
};

const customToggleTheme = () => {
  const isDark = theme.value === 'dark'
  theme.value = isDark ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
  document.documentElement.classList.toggle('dark', !isDark)
}

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 768) {
    closeSidebar()
  }
}

// User Dropdown
const userDropdownOpen = ref(false)
const userDropdownContainer = ref<HTMLElement | null>(null)
// Toggle user dropdown
const toggleUserDropdown = () => {
  userDropdownOpen.value = !userDropdownOpen.value
  if (userDropdownOpen.value) {
    // Close other dropdowns when opening user dropdown
    notificationDropdownOpen.value = false;
    dropdownOpen.value = false;
  }
}
const closeUserDropdown = () => {
  userDropdownOpen.value = false
}
// Handle click outside for user dropdown
const handleUserClickOutside = (event: MouseEvent) => {
  if (userDropdownContainer.value && !userDropdownContainer.value.contains(event.target as Node)) {
    closeUserDropdown()
  }
}
// Logout handler
async function handleLogout() {
  try {
    await auth.logout(); // Call the logout function from useAuthStore
    location.reload(); // Reload the page
    router.push('/'); // Navigate to the root path
  } catch (error) {
    console.error('Logout failed:', error);
  }
}


const handleResize = () => {
  if (window.innerWidth >= 768) {
    closeSidebar()
  }
}

onMounted(async () => {
  const hasToken = !!localStorage.getItem('refresh_token')
  if (hasToken && !auth.user) {
    await auth.refresh()
  }

  // Fetch notifications on mount
  await fetchNotificationsData();
})
onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

type LocaleKey = 'en' | 'km';
interface MenuItem {
  to: string;
  icon: string;
  label: { en: string; km: string };
  hasSubmenu?: boolean;
  role?: string | string[];
  submenu?: { to: string; label: { en: string; km: string } }[];
}

const menuItems: MenuItem[] = [
  {
    to: '/',
    icon: 'mdi:view-dashboard',
    label: { en: 'Dashboard', km: 'ផ្ទាំងគ្រប់គ្រង' }
  },
  {
    to: '/dashboard/request',
    icon: 'material-symbols:edit-document',
    label: { en: 'Form Request KPI', km: 'ទម្រង់ស្នើសុំ KPI' }
  },
  {
    to: '/dashboard/history-kpi/',
    icon: 'emojione-v1:document',
    label: { en: 'History of Request KPI', km: 'ប្រវត្តិការស្នើសុំ KPI' }
  },
  {
    to: '/dashboard/pr-tracking',
    icon: 'mdi:target',
    label: { en: 'PR Tracking', km: 'ការតាមដាន PR' }
  },
  {
    to: '/dashboard/monthly-ads-video-tracker',
    icon: 'mdi:currency-usd',
    label: { en: 'Monthly Video Ads Tracker', km: 'កម្មវិធីតាមដានការផ្សាយពាណិជ្ជកម្មវីដេអូប្រចាំខែ' }
  },
  // Interview tracking
  {
    to: '/dashboard/interview-tracking',
    icon: 'mdi:account-search',
    label: { en: 'Interview Tracking', km: 'ការតាមដានសម្ភាសន៍' }
  },
  // Booking Book and camera as submenu
  {
    to: '#',
    icon: 'mdi:calendar-clock',
    label: { en: 'Booking', km: 'ការកក់' },
    hasSubmenu: true,
    submenu: [
      {
        to: '/dashboard/booking-room/rooms',
        label: { en: 'Room Bookings', km: 'ការកក់បន្ទប់' }
      },
      {
        to: '/dashboard/booking-room/equipment-request',
        label: { en: 'Equipment Booking', km: 'កក់ឧបករណ៍' }
      }
    ]
  },
  // Track Performance Staff
  {
    to: '#',
    icon: 'mdi:account-check',
    label: { en: 'Track Performance Staff', km: 'តាមដានការប្រកួតប្រជែងរបស់បុគ្គលិក' },
    hasSubmenu: true,
    submenu: [
      {
        to: '/dashboard/track-performance-staff/creators',
        label: { en: 'Creators', km: 'អ្នកបង្កើត' }
      },
      {
        to: '/dashboard/track-performance-staff/writers',
        label: { en: 'Writers', km: 'អ្នកសរសេរ' }
      },
      {
        to: '/dashboard/track-performance-staff/editors',
        label: { en: 'Editors', km: 'អ្នកកែសម្រួល' }
      }
    ]
  },
  // {
  //   to: '/dashboard/reports',
  //   icon: 'mdi:file-document',
  //   label: { en: 'Reports', km: 'របាយការណ៍' }
  // },
  // for sales only 

  {
    to: '/dashboard/ads',
    icon: 'hugeicons:advertisement',
    label: { en: 'Ads', km: 'ការផ្សាយពាណិជ្ជកម្ម' },
    role: ['admin', 'sales', 'hr'] // Set multiple roles here 
  },
  // BM-CLIENT
  {
    to: '/dashboard/bm-client',
    icon: 'mdi:account-multiple',
    label: { en: 'Sale client', km: 'អតិថិជន BM' },

  },

  {
    to: '/dashboard/commissions',
    icon: 'mdi:cash',
    label: { en: 'Commissions', km: 'កម្រៃជើងសារ' },
    role: ['admin', 'sales']
  },
  // clients
  {
    to: '/dashboard/clients',
    icon: 'mdi:account-multiple',
    label: { en: 'Interview Clients', km: 'អតិថិជន' },
  },

]
const openSubmenus = ref<Record<string, boolean>>({});

const toggleSubmenu = (key: string) => {
  openSubmenus.value[key] = !openSubmenus.value[key];
};
const getIconColor = (icon: string): 'blue' | 'red' | 'green' => {
  // Blue for core system features
  if (['mdi:view-dashboard', 'material-symbols:edit-document', 'emojione-v1:document', 'mdi:target'].includes(icon)) {
    return 'blue';
  }

  // Red for business/sales features
  if (['hugeicons:advertisement', 'mdi:account-multiple', 'mdi:cash', 'mdi:currency-usd','mdi:calendar-clock'].includes(icon)) {
    return 'red';
  }

  // Green for staff/HR features
  if (['mdi:account-search', 'mdi:account-check'].includes(icon)) {
    return 'green';
  }

  // Default to blue
  return 'blue';
};
const getIconColorClass = (icon: string, item?: any): string => {
  const color = getIconColor(icon);
  // item is optional for backward compatibility, but should be passed when used
  const isActive = item
    ? route.path === item.to || (route.path.includes(item.to) && item.to !== '/')
    : false;

  switch (color) {
    case 'blue':
      return isActive
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300';
    case 'red':
      return isActive
        ? 'text-red-600 dark:text-red-400'
        : 'text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300';
    case 'green':
      return isActive
        ? 'text-green-600 dark:text-green-400'
        : 'text-green-500 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300';
    default:
      return 'text-blue-500 dark:text-blue-400';
  }
};
const localizedMenuItems = computed(() =>
  menuItems
    .filter(item => {
      if (!item.role) return true // Public item
      if (typeof item.role === 'string') {
        // Single role check
        if (item.role === 'sales') return isSale.value
        if (item.role === 'admin') return isAdmin.value
        if (item.role === 'hr') return isHr.value
      } else if (Array.isArray(item.role)) {
        // Multiple roles check (user can have any of the roles)
        return item.role.some(role => {
          if (role === 'sales') return isSale.value
          if (role === 'admin') return isAdmin.value
          if (role === 'hr') return isHr.value
          return false
        })
      }
      return false
    })
    .map((item) => ({
      ...item,
      label: item.label[locale.value as LocaleKey]
    }))
);
// 
const { setFontClass } = useI18nConfig();

const switchLanguage = (newLocale: string) => {
  locale.value = newLocale; // Change the active locale
  if (process.client) {
    localStorage.setItem('locale', newLocale); // Save the new locale to localStorage
    setFontClass(newLocale); // Update the font class
  }
};

const dropdownOpen = ref(false);
const dropdownContainer = ref<HTMLElement | null>(null);

// Toggle dropdown visibility
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
  if (dropdownOpen.value) {
    // Close other dropdowns when opening language dropdown
    notificationDropdownOpen.value = false;
    userDropdownOpen.value = false;
  }
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target as Node)) {
    dropdownOpen.value = false;
  }
};
// Add event listener to close dropdown on outside click
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('click', handleUserClickOutside);
  document.addEventListener('click', handleNotificationClickOutside);
});

// Clean up event listener when the component is destroyed
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('click', handleUserClickOutside);
  document.removeEventListener('click', handleNotificationClickOutside);
});

</script>

<style scoped>
/* Add Khmer font globally */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer&display=swap');

html, body {
  font-family: 'Noto Sans Khmer', sans-serif;
}
/* .router-link-active {
  @apply font-bold bg-gray-900 text-white dark:bg-red-500 dark:text-white;
} */

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}

/* Smooth transitions */
.router-link-active {
  transition: all 0.3s ease;
}

/* Hover effects */
.group\/btn:hover {
  transform: translateY(-1px);
}

.group\/link:hover {
  transform: translateY(-1px);
}

.group\/sub:hover {
  transform: translateX(4px);
}

</style>
