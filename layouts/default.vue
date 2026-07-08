<template>
  <div class="bg-gray-100 dark:bg-gray-950 min-h-screen">
    <!-- Mobile Header -->
    <header
      class="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div class="flex items-center justify-between h-16 px-4">
        <!-- Left Section: Menu & Logo -->
        <div class="flex items-center gap-3">
          <button @click="toggleSidebar"
            class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Sidebar">
            <Icon :icon="isSidebarOpen ? 'mdi:close' : 'mdi:menu'" class="text-xl" />
          </button>
          <h1 class="text-lg font-bold text-blue-600 dark:text-blue-500 lg:hidden">
            BAKSEY
          </h1>
          <!-- Desktop: Breadcrumb area -->
          <div class="hidden lg:block">
            <!-- You can add breadcrumbs or page title here -->
          </div>
        </div>

        <!-- Right Section: Actions -->
        <div class="flex items-center gap-2">
          <!-- Theme Toggle (Desktop) -->
          <button @click="customToggleTheme"
            class="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Icon
              :icon="theme === 'dark' ? 'line-md:sunny-filled-loop-to-moon-filled-alt-loop-transition' : 'line-md:moon-filled-alt-to-sunny-filled-loop-transition'"
              class="w-5 h-5" />
          </button>

          <!-- Notifications -->
          <div class="relative" ref="notificationDropdownContainer">
            <button @click="toggleNotificationDropdown"
              class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Icon icon="mdi:bell-outline" class="w-5 h-5" />
              <span v-if="notifications.length > 0"
                class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
            </button>

            <!-- Notification Dropdown -->
            <Transition name="dropdown">
              <div v-if="notificationDropdownOpen"
                class="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800">
                <div
                  class="sticky top-0 bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                  <div class="flex items-center justify-between">
                    <h3 class="font-semibold">Notifications</h3>
                    <span
                      class="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                      {{ notifications.length }}
                    </span>
                  </div>
                </div>

                <div v-if="notifications.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Icon icon="mdi:bell-off-outline" class="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p class="text-sm">No notifications</p>
                </div>

                <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
                  <button v-for="(notification, index) in notifications" :key="index"
                    class="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left">
                    <div class="flex gap-3">
                      <div class="w-2 h-2 mt-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                          {{ notification.title }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {{ new Date(notification.date_created).toLocaleString() }}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Language Selector -->
          <div class="relative" ref="dropdownContainer">
            <button @click="toggleDropdown"
              class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span class="text-sm font-medium">{{ locale === 'en' ? 'EN' : 'KH' }}</span>
              <Icon icon="mdi:chevron-down" class="w-4 h-4" />
            </button>

            <Transition name="dropdown">
              <div v-if="dropdownOpen"
                class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <button @click="switchLanguage('en')" :class="[
                  'flex items-center w-full px-4 py-2.5 text-sm transition-colors',
                  locale === 'en'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                ]">
                  <Icon icon="emojione-v1:flag-for-united-states" class="w-4 h-4 mr-2" />
                  English
                </button>
                <button @click="switchLanguage('km')" :class="[
                  'flex items-center w-full px-4 py-2.5 text-sm transition-colors',
                  locale === 'km'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                ]">
                  <Icon icon="emojione-v1:flag-for-cambodia" class="w-4 h-4 mr-2" />
                  ភាសាខ្មែរ
                </button>
              </div>
            </Transition>
          </div>

          <!-- User Avatar -->
          <div class="relative" ref="userDropdownContainer">
            <button @click="toggleUserDropdown"
              class="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div class="relative">
                <img :src="useImg(auth.user?.avatar || '/user-avatar.png')" alt="User Avatar"
                  class="w-8 h-8 rounded-lg object-cover" />
                <div
                  class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
              </div>
            </button>

            <Transition name="dropdown">
              <div v-if="userDropdownOpen"
                class="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <!-- User Info -->
                <div class="p-4">
                  <div class="flex items-center gap-3 mb-3">
                    <img :src="useImg(auth.user?.avatar || '/default-avatar.png')" alt="User Avatar"
                      class="w-12 h-12 rounded-lg object-cover" />
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-gray-900 dark:text-white truncate">
                        {{ auth.user?.first_name }} {{ auth.user?.last_name }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {{ auth.user?.email }}
                      </p>
                    </div>
                    <button @click="customToggleTheme"
                      class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                      <Icon :icon="theme === 'dark' ? 'mdi:weather-night' : 'mdi:weather-sunny'" class="w-5 h-5" />
                    </button>
                  </div>

                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-gray-600 dark:text-gray-400">Department</span>
                      <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg font-medium">
                        {{ auth.user?.department?.title }}
                      </span>
                    </div>
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-gray-600 dark:text-gray-400">Role</span>
                      <div class="flex flex-wrap gap-1">
                        <span v-for="(role, index) in formatDepartments(auth.user?.role.name)" :key="index"
                          class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-medium">
                          {{ role }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="border-t border-gray-200 dark:border-gray-800">
                  <NuxtLink to="/profile"
                    class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    @click="closeUserDropdown">
                    <Icon icon="mdi:account-outline" class="w-5 h-5 text-gray-500" />
                    <span>Profile</span>
                  </NuxtLink>
                  <button @click="handleLogout"
                    class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                    <Icon icon="mdi:logout" class="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside :class="[
      'fixed top-0 left-0 h-full z-[50] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300',
      isDesktopSidebarCollapsed ? 'lg:w-0 lg:border-r-0' : 'lg:w-64',
      'w-64',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]">
      <div :class="[
        'flex flex-col h-full transition-opacity duration-300',
        isDesktopSidebarCollapsed ? 'lg:opacity-0 lg:pointer-events-none' : 'lg:opacity-100'
      ]">
        <!-- Logo -->
        <div class="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
          <h1 class="text-xl font-bold text-blue-600 dark:text-blue-500">
            BAKSEY SYSTEM
          </h1>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto p-3">
          <ul class="space-y-1">
            <li v-for="item in localizedMenuItems" :key="item.to">
              <!-- Menu Item with Submenu -->
              <template v-if="item.hasSubmenu">
                <button @click="toggleSubmenu(item.to)" :class="[
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  openSubmenus[item.to]
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                ]">
                  <div class="flex items-center gap-3">
                    <Icon :icon="item.icon" class="text-lg flex-shrink-0" :class="getIconColorClass(item.icon)" />
                    <span class="text-left">{{ item.label }}</span>
                  </div>
                  <Icon :icon="openSubmenus[item.to] ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                    class="text-sm transition-transform flex-shrink-0" />
                </button>

                <!-- Submenu -->
                <Transition name="submenu">
                  <ul v-show="openSubmenus[item.to]" class="mt-1 ml-6 space-y-1">
                    <li v-for="sub in item.submenu" :key="sub.to">
                      <!-- Nested Submenu -->
                      <template v-if="sub.hasNestedSubmenu">
                        <button @click="toggleNestedSubmenu(sub.to)" :class="[
                          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all',
                          openNestedSubmenus[sub.to]
                            ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white font-medium'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/30'
                        ]">
                          <div class="flex items-center gap-2">
                            <Icon v-if="sub.icon" :icon="sub.icon" class="text-base flex-shrink-0"
                              :class="getIconColorClass(sub.icon)" />
                            <span class="text-left">{{ sub.label }}</span>
                          </div>
                          <Icon :icon="openNestedSubmenus[sub.to] ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                            class="text-xs transition-transform flex-shrink-0" />
                        </button>

                        <!-- Nested Submenu Items -->
                        <Transition name="submenu">
                          <ul v-show="openNestedSubmenus[sub.to]" class="mt-1 ml-6 space-y-1">
                            <li v-for="nested in sub.nestedSubmenu" :key="nested.to">
                              <NuxtLink :to="nested.to" @click="closeSidebarOnMobile" :class="[
                                'flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all',
                                isActiveRoute(nested.to)
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/30'
                              ]">
                                <Icon v-if="nested.icon" :icon="nested.icon" class="text-sm flex-shrink-0"
                                  :class="getIconColorClass(nested.icon)" />
                                <span>{{ nested.label }}</span>
                              </NuxtLink>
                            </li>
                          </ul>
                        </Transition>
                      </template>

                      <!-- Regular Submenu Item -->
                      <NuxtLink v-else :to="sub.to" @click="closeSidebarOnMobile" :class="[
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all',
                        isActiveRoute(sub.to)
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/30'
                      ]">
                        <Icon v-if="sub.icon" :icon="sub.icon" class="text-base flex-shrink-0"
                          :class="getIconColorClass(sub.icon)" />
                        <span>{{ sub.label }}</span>
                      </NuxtLink>
                    </li>
                  </ul>
                </Transition>
              </template>

              <!-- Regular Menu Item -->
              <NuxtLink v-else :to="item.to" @click="closeSidebarOnMobile" :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActiveRoute(item.to)
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              ]">
                <Icon :icon="item.icon" class="text-lg flex-shrink-0" :class="getIconColorClass(item.icon)" />
                <span>{{ item.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-800">
          <p class="text-xs text-center text-gray-500 dark:text-gray-400">
            © {{ new Date().getFullYear() }} BAKSEY Tech
          </p>
        </div>
      </div>

      <!-- Desktop Sidebar Toggle Button (Floating) - Always Visible -->
      <button @click="toggleDesktopSidebar" :class="[
        'hidden lg:flex fixed top-20 z-[60] w-8 h-12 items-center justify-center',
        'bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg shadow-lg',
        'transition-all duration-300',
        isDesktopSidebarCollapsed ? 'left-0' : 'left-64'
      ]" aria-label="Toggle Sidebar">
        <Icon :icon="isDesktopSidebarCollapsed ? 'mdi:chevron-right' : 'mdi:chevron-left'"
          class="text-lg transition-transform hover:scale-110" />
      </button>
    </aside>

    <!-- Overlay -->
    <Transition name="fade">
      <div v-if="isSidebarOpen" @click="closeSidebar" class="fixed inset-0 bg-black/50 z-30 lg:hidden" />
    </Transition>

    <!-- Main Content -->
    <main :class="[
      'pt-16 min-h-screen transition-all duration-300',
      isDesktopSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-64'
    ]">
      <div class="">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import useTheme from '~/composables/useTheme'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/store/useAuthStore'
import { useRouter, useRoute } from 'vue-router'
import { usePermissions } from '~/composables/usePermissions'
import type { IResponse } from '~/types/api'

const { isSale, isAdmin, isHr, isCreator, isWriter, isEditor } = usePermissions()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()
const { theme } = useTheme()

// State
const isSidebarOpen = ref(false)
const isDesktopSidebarCollapsed = ref(false)
const notificationDropdownOpen = ref(false)
const dropdownOpen = ref(false)
const userDropdownOpen = ref(false)
const openSubmenus = ref<Record<string, boolean>>({})
const openNestedSubmenus = ref<Record<string, boolean>>({})
const notifications = ref<INotification[]>([])

// Refs
const notificationDropdownContainer = ref<HTMLElement | null>(null)
const dropdownContainer = ref<HTMLElement | null>(null)
const userDropdownContainer = ref<HTMLElement | null>(null)

// Theme Toggle
const customToggleTheme = () => {
  const isDark = theme.value === 'dark'
  theme.value = isDark ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
  document.documentElement.classList.toggle('dark', !isDark)
}

// Sidebar
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1024) {
    closeSidebar()
  }
}

// Desktop sidebar toggle
const toggleDesktopSidebar = () => {
  isDesktopSidebarCollapsed.value = !isDesktopSidebarCollapsed.value
  // Save preference to localStorage
  if (process.client) {
    localStorage.setItem('desktopSidebarCollapsed', String(isDesktopSidebarCollapsed.value))
  }
}

// Dropdowns
const toggleNotificationDropdown = () => {
  notificationDropdownOpen.value = !notificationDropdownOpen.value
  if (notificationDropdownOpen.value) {
    userDropdownOpen.value = false
    dropdownOpen.value = false
  }
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
  if (dropdownOpen.value) {
    notificationDropdownOpen.value = false
    userDropdownOpen.value = false
  }
}

const toggleUserDropdown = () => {
  userDropdownOpen.value = !userDropdownOpen.value
  if (userDropdownOpen.value) {
    notificationDropdownOpen.value = false
    dropdownOpen.value = false
  }
}

const closeUserDropdown = () => {
  userDropdownOpen.value = false
}

// Submenu toggles
const toggleSubmenu = (key: string) => {
  openSubmenus.value[key] = !openSubmenus.value[key]
}

const toggleNestedSubmenu = (key: string) => {
  openNestedSubmenus.value[key] = !openNestedSubmenus.value[key]
}

// Helper to check if route is active
const isActiveRoute = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(to + '/')
}

// Language switch
const switchLanguage = (newLocale: string) => {
  locale.value = newLocale
  if (process.client) {
    localStorage.setItem('locale', newLocale)
  }
  dropdownOpen.value = false
}

// Format departments
const formatDepartments = (departments: any) => {
  if (!departments) return []
  const deptArray = Array.isArray(departments) ? departments : departments.split(',')
  return deptArray.map((dept: string) => {
    const trimmed = dept.trim()
    return trimmed.split('_')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  })
}

// Logout
const handleLogout = async () => {
  try {
    await auth.logout()
    location.reload()
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Fetch notifications
const fetchNotificationsData = async () => {
  try {
    const response = await useApi<IResponse<INotification[]>>(
      '/items/notifications?filter[status]=published&sort=-date_created&fields=*',
      { method: 'GET' }
    )
    notifications.value = response.data || []
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    notifications.value = []
  }
}

// Click outside handlers
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target as Node)) {
    dropdownOpen.value = false
  }
  if (userDropdownContainer.value && !userDropdownContainer.value.contains(event.target as Node)) {
    userDropdownOpen.value = false
  }
  if (notificationDropdownContainer.value && !notificationDropdownContainer.value.contains(event.target as Node)) {
    notificationDropdownOpen.value = false
  }
}

// Menu items
type LocaleKey = 'en' | 'km'

interface MenuItem {
  to: string
  icon: string
  label: { en: string; km: string }
  hasSubmenu?: boolean
  role?: string | string[]
  submenu?: {
    to: string
    icon?: string
    label: { en: string; km: string }
    hasNestedSubmenu?: boolean
    nestedSubmenu?: {
      to: string
      icon?: string
      label: { en: string; km: string }
    }[]
  }[]
}

const menuItems: MenuItem[] = [
  {
    to: '/',
    icon: 'mdi:view-dashboard',
    label: { en: 'Dashboard', km: 'ផ្ទាំងគ្រប់គ្រង' }
  },
  // {
  //   to: '/dashboard/request',
  //   icon: 'material-symbols:edit-document',
  //   label: { en: 'Form Request KPI', km: 'ទម្រង់ស្នើសុំ KPI' }
  // },
  // Form Request with submenu
  {
    to: '#formrequest',
    icon: 'material-symbols:folder-copy-outline',
    label: { en: 'Form Request', km: 'ទម្រង់ស្នើសុំ' },
    hasSubmenu: true,
    submenu: [
      {
        to: '/dashboard/kpi-bc-request',
        icon: 'material-symbols:leaderboard-outline',
        label: { en: 'Form Request KPI BC', km: 'ទម្រង់ស្នើសុំ KPI BC' }
      },
      {
        to: '/dashboard/request',
        icon: 'material-symbols:leaderboard-outline',
        label: { en: 'Form Request KPI', km: 'ទម្រង់ស្នើសុំ KPI' }
      },
      {
        to: '/dashboard/bm/salary-request/',
        icon: 'material-symbols:payments-outline',
        label: { en: 'Salary Request', km: 'ស្នើសុំប្រាក់ខែ' },
      },
      {
        to: '/dashboard/bm/impact-income-bonus-request/',
        icon: 'material-symbols:workspace-premium-outline',
        label: { en: 'Impact Income Bonus Request', km: 'ប្រាក់រង្វាន់លើកទឹកចិត្តផ្អែកលើលទ្ធផលការងារ' },
      },
      {
        to: '/dashboard/bm/kpi-bc-request/',
        icon: 'material-symbols:receipt-long-outline',
        label: { en: 'BC Commission Request', km: 'ស្នើសុំកម្រៃ BC' },
      },
      {
        to: '/dashboard/bm/kpi-hc-request/',
        icon: 'material-symbols:receipt-long-outline',
        label: { en: 'HC Commission Request', km: 'ស្នើសុំកម្រៃ HC' },
      }
    ]
  },
  {
    to: '/dashboard/history-kpi/',
    icon: 'emojione-v1:document',
    label: { en: 'History of Request KPI', km: 'ប្រវត្តិការស្នើសុំ KPI' }
  },
  {
    to: '/dashboard/pr-tracking',
    icon: 'mdi:target',
    label: { en: 'PR Tracking', km: 'ការតាមដាន PR' },
    role: ['admin', 'sales', 'creator', 'writer', 'editor'],
  },
  // {
  //   to: '/dashboard/monthly-ads-video-tracker',
  //   icon: 'mdi:currency-usd',
  //   label: { en: 'Monthly Video Ads Tracker', km: 'កម្មវិធីតាមដានការផ្សាយពាណិជ្ជកម្មវីដេអូប្រចាំខែ' }
  // },
  // {
  //   to: '/dashboard/researcher-tracking',
  //   icon: 'mdi:account-search',
  //   label: { en: 'Researcher Tracking', km: 'ការតាមដានអ្នកស្រាវជ្រាវ' }
  // },
  {
    to: '#booking',
    icon: 'mdi:calendar-clock',
    label: { en: 'Booking', km: 'ការកក់' },
    hasSubmenu: true,
    submenu: [
      {
        to: '/dashboard/booking-room/rooms',
        icon: 'mdi:office-building',
        label: { en: 'Room Bookings', km: 'ការកក់បន្ទប់' }
      },
      {
        to: '/dashboard/booking-room/equipment-request',
        icon: 'mdi:camera',
        label: { en: 'Equipment Booking', km: 'កក់ឧបករណ៍' }
      }
    ]
  },
  {
    to: '#performance',
    icon: 'mdi:account-check',
    label: { en: 'Track Performance Staff', km: 'តាមដានការប្រកួតប្រជែងរបស់បុគ្គលិក' },
    hasSubmenu: true,
    submenu: [
      {
        to: '#creators',
        icon: 'mdi:video-account',
        label: { en: 'Creators', km: 'អ្នកបង្កើត' },
        hasNestedSubmenu: true,
        nestedSubmenu: [
          {
            to: '/dashboard/track-performance-staff/creators',
            icon: 'mdi:account-circle',
            label: { en: 'Creators', km: 'អ្នកបង្កើតវីដេអូ' }
          },
          {
            to: '/dashboard/track-performance-staff/creators/history',
            icon: 'mdi:history',
            label: { en: 'View History', km: 'មើលប្រវត្តិ' }
          }
        ]
      },
      {
        to: '/dashboard/track-performance-staff/writers',
        icon: 'mdi:pen',
        label: { en: 'Writers', km: 'អ្នកសរសេរ' }
      },
      {
        to: '/dashboard/track-performance-staff/editors',
        icon: 'mdi:movie-edit',
        label: { en: 'Editors', km: 'អ្នកកែសម្រួល' }
      }
    ]
  },
  {
    to: '/dashboard/engagement',
    icon: 'mdi:chart-line',
    label: { en: 'Engagement', km: 'ការចូលរួម' }
  },
  // Video
  {
    to: '#video',
    icon: 'mdi:video-account',
    label: { en: 'Video', km: 'វីដេអូ' },
    role: ['admin', 'sales', 'creator', 'writer', 'editor'],
    hasSubmenu: true,
    submenu: [
      {
        to: '#evaluate',
        icon: 'mdi:clipboard-check-outline',
        label: { en: 'Evaluate', km: 'វាយតម្លៃ' },
        hasNestedSubmenu: true,
        nestedSubmenu: [
          {
            to: '/dashboard/video/evaluate/technology-cambodia',  
            icon: 'mdi:laptop',
            label: { en: 'Technology Cambodia', km: 'បច្ចេកវិទ្យាកម្ពុជា' }
          },
          {
            to: '/dashboard/video/evaluate/healthy-cambodia',
            icon: 'mdi:heart-pulse',
            label: { en: 'Healthy Cambodia', km: 'សុខភាពកម្ពុជា' }
          },
          {
            to: '/dashboard/video/evaluate/business-cambodia',
            icon: 'mdi:briefcase',
            label: { en: 'Business Cambodia', km: 'ធុរកិច្ចកម្ពុជា' }
          }
        ]
      },
      {
        to: '/dashboard/video/training',
        icon: 'mdi:school-outline',
        label: { en: 'Staff Training', km: 'បណ្តុះបណ្តាល' }
      }
    ]
  },
  {
    to: '/dashboard/ads',
    icon: 'hugeicons:advertisement',
    label: { en: 'Ads', km: 'ការផ្សាយពាណិជ្ជកម្ម' },
    role: ['admin', 'sales', 'hr']
  },
  {
    to: '/dashboard/bm-client',
    icon: 'mdi:account-multiple',
    label: { en: 'Sale client', km: 'អតិថិជន BM' }
  },
  // {
  //   to: '/dashboard/commissions',
  //   icon: 'mdi:cash',
  //   label: { en: 'Commissions', km: 'កម្រៃជើងសារ' },
  //   role: ['admin', 'sales']
  // },
  {
    to: '/dashboard/clients',
    icon: 'mdi:account-multiple',
    label: { en: 'Interview Clients', km: 'អតិថិជន' }
  },
  {
    to: '#attendance',
    icon: 'mdi:calendar-check',
    label: { en: 'Attendance', km: 'វត្តមាន' },
    hasSubmenu: true,
    submenu: [
      {
        to: '/dashboard/attendance/creators',
        icon: 'mdi:video-account',
        label: { en: 'Creators Attendance', km: 'វត្តមានអ្នកបង្កើត' }
      },
      {
        to: '/dashboard/attendance/writers',
        icon: 'mdi:pen',
        label: { en: 'Writers Attendance', km: 'វត្តមានអ្នកសរសេរ' }
      },
      {
        to: '/dashboard/attendance/editors',
        icon: 'mdi:movie-edit',
        label: { en: 'Editors Attendance', km: 'វត្តមានអ្នកកែសម្រួល' }
      },
      {
        to: '/dashboard/attendance/researchers',
        icon: 'mdi:account-search',
        label: { en: 'Researchers Attendance', km: 'វត្តមានអ្នកស្រាវជ្រាវ' }
      }
    ]
  },
  // {
  //   to: '/dashboard/settings',
  //   icon: 'mdi:cog',
  //   label: { en: 'Settings', km: 'ការកំណត់' }
  // }
]

// Get icon color class
const getIconColorClass = (icon: string): string => {
  if (['mdi:view-dashboard', 'material-symbols:edit-document', 'emojione-v1:document', 'mdi:target'].includes(icon)) {
    return 'text-blue-500 dark:text-blue-400'
  }
  if (['hugeicons:advertisement', 'mdi:account-multiple', 'mdi:cash', 'mdi:currency-usd', 'mdi:calendar-clock', 'mdi:calendar-check'].includes(icon)) {
    return 'text-red-500 dark:text-red-400'
  }
  if (['mdi:account-search', 'mdi:account-check', 'mdi:video-account', 'mdi:pen', 'mdi:movie-edit'].includes(icon)) {
    return 'text-green-500 dark:text-green-400'
  }
  if (['mdi:office-building', 'mdi:camera'].includes(icon)) {
    return 'text-orange-500 dark:text-orange-400'
  }
  if (['mdi:account-circle', 'mdi:history'].includes(icon)) {
    return 'text-purple-500 dark:text-purple-400'
  }
  if (['mdi:chart-line'].includes(icon)) {
    return 'text-indigo-500 dark:text-indigo-400'
  }
  if (['mdi:cog'].includes(icon)) {
    return 'text-gray-500 dark:text-gray-400'
  }
  return 'text-gray-500 dark:text-gray-400'
}

// Localized menu items
const localizedMenuItems = computed(() =>
  menuItems
    .filter(item => {
      if (!item.role) return true
      if (typeof item.role === 'string') {
        if (item.role === 'sales') return isSale.value
        if (item.role === 'admin') return isAdmin.value
        if (item.role === 'hr') return isHr.value
      } else if (Array.isArray(item.role)) {
        return item.role.some(role => {
          if (role === 'sales') return isSale.value
          if (role === 'admin') return isAdmin.value
          if (role === 'hr') return isHr.value
          if (role === 'creator') return isCreator.value
          if (role === 'writer') return isWriter.value
          if (role === 'editor') return isEditor.value
          return false
        })
      }
      return false
    })
    .map(item => ({
      ...item,
      label: item.label[locale.value as LocaleKey],
      submenu: item.submenu?.map(sub => ({
        ...sub,
        label: sub.label[locale.value as LocaleKey],
        nestedSubmenu: sub.nestedSubmenu?.map(nested => ({
          ...nested,
          label: nested.label[locale.value as LocaleKey]
        }))
      }))
    }))
)

// Lifecycle
onMounted(async () => {
  const hasToken = !!localStorage.getItem('refresh_token')
  if (hasToken && !auth.user) {
    await auth.refresh()
  }
  await fetchNotificationsData()
  document.addEventListener('click', handleClickOutside)

  // Restore desktop sidebar state from localStorage
  if (process.client) {
    const savedState = localStorage.getItem('desktopSidebarCollapsed')
    if (savedState !== null) {
      isDesktopSidebarCollapsed.value = savedState === 'true'
    }
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  max-height: 500px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.3);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.5);
}
</style>