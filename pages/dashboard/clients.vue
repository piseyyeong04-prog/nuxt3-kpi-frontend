<!-- pages/dashboard/clients.vue -->
<template>
  <div>
    <!-- Header with search and add button -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Client Management</h1>
      <div class="flex gap-4">
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Search by name, phone, category, or contact person..."
            class="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-80"
            @input="handleSearch" />
          <div class="absolute left-3 top-2.5">
            <Icon icon="mdi:magnify" class="text-gray-500" />
          </div>
          <!-- Clear search button -->
          <button v-if="searchQuery" @click="clearSearch"
            class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors">
            <Icon icon="mdi:close" />
          </button>
        </div>
        <button @click="openCreateModal"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Icon icon="mdi:plus" />
          Add Client
        </button>
      </div>
    </div>

    <!-- Active search indicator -->
    <div v-if="searchQuery"
      class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon icon="mdi:magnify" class="text-blue-600" />
          <span class="text-sm text-blue-800 dark:text-blue-200">
            Searching for: <strong>"{{ searchQuery }}"</strong>
          </span>
          <span class="text-sm text-blue-600 dark:text-blue-400">
            ({{ totalClients }} {{ totalClients === 1 ? 'result' : 'results' }} found)
          </span>
        </div>
        <button @click="clearSearch"
          class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm font-medium">
          Clear search
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="clients.length === 0" class="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
      <Icon icon="mdi:account-group" class="text-gray-400 text-6xl mb-4" />
      <h3 class="text-xl font-semibold mb-2">No clients found</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        {{ searchQuery ? 'Try a different search term or clear your search' : 'Get started by adding your first client'
        }}
      </p>
      <div class="flex justify-center gap-3">
        <button v-if="searchQuery" @click="clearSearch"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Icon icon="mdi:refresh" />
          Clear Search
        </button>
        <button @click="openCreateModal"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Icon icon="mdi:plus" />
          Add Client
        </button>
      </div>
    </div>

    <!-- Client table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100 dark:bg-gray-800">
            <th class="text-left p-4">Name</th>
            <th class="text-left p-4">Phone</th>
            <th class="text-left p-4">Category</th>
            <th class="text-left p-4">Contact Person</th>
            <th class="text-left p-4">Status</th>
            <th class="text-left p-4">Created</th>
            <th class="text-center p-4">Actions</th>
          </tr>
        </thead>
        <!-- Enhanced table with highlighting for all searchable fields -->
        <tbody>
          <tr v-for="client in clients" :key="client.id"
            class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
            <td class="p-4">
              <span v-html="highlightSearchTerm(client.name)"></span>
            </td>
            <td class="p-4">
              <span v-html="highlightSearchTerm(client.phone_number)"></span>
            </td>
            <td class="p-4">
              <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                v-html="highlightSearchTerm(client.category?.name || 'Uncategorized')">
              </span>
            </td>
            <td class="p-4">
              <div v-if="client.contact_person" class="flex items-center gap-2">
                <div v-if="client.contact_person.avatar" class="w-8 h-8 rounded-full overflow-hidden">
                  <img :src="useImg(client.contact_person.avatar)" :alt="`${client.contact_person.first_name} avatar`"
                    class="w-10 h-10 object-cover" />
                </div>
                <div v-else class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Icon icon="mdi:account" class="text-gray-500" />
                </div>
                <div>
                  <p>
                    <span v-html="highlightSearchTerm(client.contact_person.first_name)"></span>
                    <span v-html="highlightSearchTerm(client.contact_person.last_name)"></span>
                  </p>
                  <p class="text-sm text-gray-500" v-html="highlightSearchTerm(client.contact_person.email)"></p>
                </div>
              </div>
              <span v-else class="text-gray-500">Not specified</span>
            </td>
            <td class="p-4">
              <span>
                {{ formatStatusText(client.status) }}
              </span>
            </td>
            <td class="p-4">{{ formatDate(client.date_created) }}</td>
            <td class="p-4">
              <div class="flex justify-center gap-2">
                <button @click="openEditModal(client)" class="text-blue-500 hover:text-blue-700" title="Edit">
                  <Icon icon="mdi:pencil" />
                </button>
                <button @click="confirmDelete(client)" class="text-red-500 hover:text-red-700" title="Delete">
                  <Icon icon="mdi:delete" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Enhanced Pagination -->
      <div class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <!-- Results info -->
        <div class="text-sm text-gray-500">
          <span v-if="totalClients > 0">
            Showing {{ startIndex }} to {{ endIndex }} of {{ totalClients }}
            {{ searchQuery ? 'matching ' : '' }}clients
          </span>
          <span v-else>No clients found</span>
        </div>

        <!-- Pagination controls -->
        <div v-if="totalPages > 1" class="flex items-center gap-2">
          <!-- Page info -->
          <span class="text-sm text-gray-500 mr-4">
            Page {{ page }} of {{ totalPages }}
          </span>

          <!-- First page button -->
          <button @click="goToPage(1)" :disabled="page === 1 || loading"
            :class="{ 'opacity-50 cursor-not-allowed': page === 1 || loading }"
            class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors">
            <Icon icon="mdi:chevron-double-left" />
          </button>

          <!-- Previous page button -->
          <button @click="goToPage(page - 1)" :disabled="page === 1 || loading"
            :class="{ 'opacity-50 cursor-not-allowed': page === 1 || loading }"
            class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors">
            Previous
          </button>

          <!-- Page numbers -->
          <div class="flex gap-1">
            <template v-for="pageNum in visiblePages" :key="pageNum">
              <span v-if="pageNum === -1" class="px-2 py-1 text-gray-400">...</span>
              <button v-else @click="goToPage(pageNum)" :disabled="loading" :class="{
                'bg-green-500 text-white': pageNum === page,
                'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600': pageNum !== page,
                'opacity-50 cursor-not-allowed': loading
              }" class="px-3 py-1 rounded text-sm min-w-[2rem] transition-colors">
                {{ pageNum }}
              </button>
            </template>
          </div>

          <!-- Next page button -->
          <button @click="goToPage(page + 1)" :disabled="page >= totalPages || loading"
            :class="{ 'opacity-50 cursor-not-allowed': page >= totalPages || loading }"
            class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors">
            Next
          </button>

          <!-- Last page button -->
          <button @click="goToPage(totalPages)" :disabled="page >= totalPages || loading"
            :class="{ 'opacity-50 cursor-not-allowed': page >= totalPages || loading }"
            class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors">
            <Icon icon="mdi:chevron-double-right" />
          </button>
        </div>

        <!-- Items per page selector -->
        <div class="flex items-center gap-2 text-sm">
          <span class="text-gray-500">Show:</span>
          <select v-model="limit" @change="changeLimit" :disabled="loading"
            class="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="text-gray-500">per page</span>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[51] ">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl" data-aos="fade-down"
        data-aos-duration="500">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">{{ isEditing ? 'Edit Client' : 'Add New Client' }}</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <Icon icon="mdi:close" />
          </button>
        </div>

        <form @submit.prevent="submitForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium mb-1">Name *</label>
              <input v-model="form.name" type="text" required
                class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Phone Number *</label>
              <input v-model="form.phone_number" type="text" required
                class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Facebook Link</label>
              <input v-model="form.facebook_link" type="text"
                class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <!-- Enhanced Category Field with Search and Add New Functionality -->
            <div>
              <label class="block text-sm font-medium mb-1">Category</label>
              <div class="relative">
                <!-- Search Input -->
                <input v-model="categorySearch" type="text" placeholder="Search or type new category..."
                  class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  @focus="showCategoryDropdown = true" @input="handleCategorySearch"
                  @keydown.enter.prevent="selectOrCreateCategory" @keydown.escape="showCategoryDropdown = false"
                  @keydown.arrow-down.prevent="navigateCategories(1)"
                  @keydown.arrow-up.prevent="navigateCategories(-1)" />

                <!-- Clear button -->
                <button v-if="categorySearch" @click="clearCategorySearch" type="button"
                  class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <Icon icon="mdi:close" class="w-4 h-4" />
                </button>

                <!-- Dropdown -->
                <div v-if="showCategoryDropdown && (filteredCategories.length > 0 || categorySearch.trim())"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">

                  <!-- Existing categories -->
                  <div v-for="(category, index) in filteredCategories" :key="category.id" :class="{
                    'bg-blue-50': index === highlightedIndex,
                    'hover:bg-gray-50': index !== highlightedIndex
                  }" class="px-3 py-2 cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-b-0"
                    @click="selectCategory(category)">
                    <span>{{ category.name }}</span>
                    <Icon icon="mdi:check" class="w-4 h-4 text-green-500" v-if="form.category === category.id" />
                  </div>

                  <!-- Add new category option -->
                  <div v-if="categorySearch.trim() && !categoryExists && !creatingCategory" :class="{
                    'bg-blue-50': highlightedIndex === filteredCategories.length,
                    'hover:bg-gray-50': highlightedIndex !== filteredCategories.length
                  }" class="px-3 py-2 cursor-pointer flex items-center gap-2 text-green-600 font-medium border-t border-gray-200"
                    @click="createNewCategory">
                    <Icon icon="mdi:plus" class="w-4 h-4" />
                    <span>Add "{{ categorySearch.trim() }}" as new category</span>
                  </div>

                  <!-- Creating new category loading -->
                  <div v-if="creatingCategory" class="px-3 py-2 flex items-center gap-2 text-blue-600">
                    <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating category...</span>
                  </div>

                  <!-- No results -->
                  <div v-if="filteredCategories.length === 0 && !categorySearch.trim()"
                    class="px-3 py-2 text-gray-500 text-center">
                    Type to search categories
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Status</label>
              <select v-model="form.status"
                class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option disabled value="">Select status</option>
                <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Creator or Writers</label>
              <select v-model="form.contact_person"
                class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Select contact person</option>
                <option v-for="contact in contacts" :key="contact.id" :value="contact.id">
                  {{ contact.first_name }} {{ contact.last_name }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button type="button" @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              :disabled="loading">
              <span v-if="loading" class="flex items-center gap-2">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </span>
              <span v-else>
                {{ isEditing ? 'Update Client' : 'Create Client' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/store/useAuthStore'
import { usePermissions } from '~/composables/usePermissions'
import Swal from 'sweetalert2'
import type { IClient } from '~/types/client'
import type { ICategory } from '~/types/category'
import { useFormatters } from '~/composables/useFormatters';

const { formatStatus } = useFormatters();

// Access permissions and auth
const users = ref<IClient[]>([]);
const { t } = useI18n()
const { isSale } = usePermissions()
const auth = useAuthStore()

const uniqueClient = computed(() => {
  const allDepts = users.value.flatMap(user => formatStatus(user.status));
  return [...new Set(allDepts)];
});

// Define page meta for authentication
definePageMeta({
  middleware: 'auth',
})

// State for clients
const clients = ref<IClient[]>([])
const categories = ref<ICategory[]>([])
const contacts = ref<any[]>([])
const loading = ref(false)
const page = ref(1)
const limit = ref(50)
const totalClients = ref(0)
const searchQuery = ref('')
const searchTimeout = ref<NodeJS.Timeout | null>(null)

// Modal and form state - MOVED BEFORE category search state
const showModal = ref(false)
const isEditing = ref(false)
const form = ref({
  id: '',
  name: '',
  phone_number: '',
  facebook_link: '',
  status: 'active',
  category: '',
  contact_person: ''
})

// Category search state - MOVED AFTER form initialization
const categorySearch = ref('')
const showCategoryDropdown = ref(false)
const highlightedIndex = ref(-1)
const creatingCategory = ref(false)

// Computed properties for category search
const filteredCategories = computed(() => {
  if (!categorySearch.value.trim()) {
    return categories.value
  }
  
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(categorySearch.value.toLowerCase())
  )
})

const categoryExists = computed(() => {
  return categories.value.some(category =>
    category.name.toLowerCase() === categorySearch.value.toLowerCase().trim()
  )
})

// Enhanced pagination computed values
const totalPages = computed(() => {
  return Math.ceil(totalClients.value / limit.value) || 1
})

const startIndex = computed(() => {
  return totalClients.value === 0 ? 0 : (page.value - 1) * limit.value + 1
})

const endIndex = computed(() => {
  return Math.min(page.value * limit.value, totalClients.value)
})

// Enhanced visible pages calculation with ellipsis support
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = page.value
  const pages: (number | -1)[] = []

  if (total <= 7) {
    // Show all pages if total is 7 or less
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (current <= 4) {
      // Show pages 2, 3, 4, 5, ..., total
      for (let i = 2; i <= Math.min(5, total - 1); i++) {
        pages.push(i)
      }
      if (total > 6) pages.push(-1) // Ellipsis
      if (total > 5) pages.push(total)
    } else if (current >= total - 3) {
      // Show 1, ..., total-4, total-3, total-2, total-1, total
      if (total > 6) pages.push(-1) // Ellipsis
      for (let i = Math.max(2, total - 4); i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Show 1, ..., current-1, current, current+1, ..., total
      pages.push(-1) // Ellipsis
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push(-1) // Ellipsis
      pages.push(total)
    }
  }

  return pages
})

// Status options - initialize as ref
const statusOptions = ref<{ text: string; value: string; color?: string }[]>([])

// Utility functions
const formatStatusText = (status: string) => {
  if (!status) return ''
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// Enhanced search highlighting for all searchable fields
const highlightSearchTerm = (text: string) => {
  if (!searchQuery.value || !text) return text

  const regex = new RegExp(`(${searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>')
}

// Clear search function
const clearSearch = () => {
  searchQuery.value = ''
  page.value = 1
  loadClients()
}

// Category search functions
const handleCategorySearch = () => {
  highlightedIndex.value = -1
  showCategoryDropdown.value = true
}

const clearCategorySearch = () => {
  categorySearch.value = ''
  form.value.category = ''
  showCategoryDropdown.value = false
  highlightedIndex.value = -1
}

const selectCategory = (category: ICategory) => {
  form.value.category = category.id
  categorySearch.value = category.name
  showCategoryDropdown.value = false
  highlightedIndex.value = -1
}

const navigateCategories = (direction: number) => {
  const maxIndex = filteredCategories.value.length + (categorySearch.value.trim() && !categoryExists.value ? 0 : -1)
  
  if (direction === 1) {
    highlightedIndex.value = highlightedIndex.value < maxIndex ? highlightedIndex.value + 1 : 0
  } else {
    highlightedIndex.value = highlightedIndex.value > 0 ? highlightedIndex.value - 1 : maxIndex
  }
}

const selectOrCreateCategory = () => {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredCategories.value.length) {
    selectCategory(filteredCategories.value[highlightedIndex.value])
  } else if (categorySearch.value.trim() && !categoryExists.value) {
    createNewCategory()
  }
}

const createNewCategory = async () => {
  if (!categorySearch.value.trim() || creatingCategory.value) return
  
  try {
    creatingCategory.value = true
    
    const newCategoryData = {
      name: categorySearch.value.trim(),
      status: 'published'
    }
    
    const response = await useApi<{ data: ICategory }>('/items/category', {
      method: 'POST',
      data: newCategoryData
    })
    
    if (response?.data) {
      // Add new category to the list
      categories.value.push(response.data)
      
      // Select the new category
      form.value.category = response.data.id
      categorySearch.value = response.data.name
      showCategoryDropdown.value = false
      highlightedIndex.value = -1
      
      // Show success message
      Swal.fire({
        title: 'Success',
        text: `Category "${response.data.name}" created successfully`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  } catch (error) {
    console.error('Error creating category:', error)
    
    const errorMessage = error?.response?.data?.errors?.[0]?.message || 'Failed to create category. Please try again.'
    
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
    })
  } finally {
    creatingCategory.value = false
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showCategoryDropdown.value = false
  }
}

// Enhanced pagination function
const goToPage = async (pageNum: number) => {
  if (pageNum < 1 || pageNum > totalPages.value || pageNum === page.value || loading.value) {
    return
  }

  page.value = pageNum
  await loadClients()
}

// Change items per page
const changeLimit = async () => {
  page.value = 1 // Reset to first page when changing limit
  await loadClients()
}

// Enhanced load clients function with multi-field search
const loadClients = async () => {
  try {
    loading.value = true

    // Build API query with proper offset calculation
    const offset = (page.value - 1) * limit.value
    let query = `/items/clients?sort=-date_created&limit=${limit.value}&offset=${offset}`
    query += '&fields=id,status,user_created,date_created,name,phone_number,facebook_link'
    query += ',contact_person.id,contact_person.first_name,contact_person.last_name,contact_person.email,contact_person.avatar'
    query += ',category.id,category.status,category.name'
    query += '&meta=total_count' // Important: request total count for pagination

    // Enhanced search - search Name, Phone, Category, Contact Person
    if (searchQuery.value.trim()) {
      const searchTerm = encodeURIComponent(searchQuery.value.trim())
      query += `&filter[_or][0][name][_icontains]=${searchTerm}`
      query += `&filter[_or][1][phone_number][_icontains]=${searchTerm}`
      query += `&filter[_or][2][category][name][_icontains]=${searchTerm}`
      query += `&filter[_or][3][contact_person][first_name][_icontains]=${searchTerm}`
      query += `&filter[_or][4][contact_person][last_name][_icontains]=${searchTerm}`
      query += `&filter[_or][5][contact_person][email][_icontains]=${searchTerm}`
    }

    const response = await useApi<{ data: IClient[]; meta?: { total_count: number } }>(query, {
      method: 'GET',
    })

    if (response?.data) {
      clients.value = response.data
      totalClients.value = response.meta?.total_count || 0

      // If we're on a page that doesn't exist anymore (e.g., after search), go to last valid page
      const maxPage = Math.ceil(totalClients.value / limit.value) || 1
      if (page.value > maxPage) {
        page.value = maxPage
        // Don't reload here to avoid infinite loop, the pagination will be corrected
      }
    }
  } catch (error) {
    console.error('Error loading clients:', error)

    // More specific error handling
    const errorMessage = error?.response?.data?.errors?.[0]?.message || 'Failed to load clients. Please try again.'

    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Retry',
      showCancelButton: true,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        loadClients()
      }
    })
  } finally {
    loading.value = false
  }
}

// Load other data functions
const loadCategories = async () => {
  try {
    const response = await useApi<{ data: ICategory[] }>('/items/category?fields=id,name&sort=name', {
      method: 'GET',
    })

    if (response?.data) {
      categories.value = response.data
    }
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

const loadContacts = async () => {
  try {
    // Role IDs for creators and writers
    const creatorRoleId = '487171a6-b731-4d96-b350-3481868c8f92'
    const writerRoleId = 'bb5d4a67-a17e-4cdf-9d59-c8f95518797b'

    const response = await useApi<{ data: any[] }>(`/users?filter[status]=active&fields=id,first_name,last_name,role.name&sort=first_name&filter[_or][0][role][_eq]=${creatorRoleId}&filter[_or][1][role][_eq]=${writerRoleId}`, {
      method: 'GET',
    })

    if (response?.data) {
      contacts.value = response.data
    }
  } catch (error) {
    console.error('Error loading contacts:', error)
  }
}

const loadStatusOptions = async () => {
  try {
    const res = await useApi('/fields/clients/status', {
      method: 'GET',
    })
    const typedRes = res as { data: { meta: { options: { choices: { text: string; value: string }[] } } } }
    statusOptions.value = typedRes.data?.meta?.options?.choices || []
  } catch (err) {
    console.error('Failed to load status options', err)
  }
}

// Enhanced search handler with better debouncing
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    page.value = 1 // Reset to first page when searching
    loadClients()
  }, 500) // Increased debounce time for better UX
}

// Modal functions
const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    id: '',
    name: '',
    phone_number: '',
    facebook_link: '',
    status: 'active',
    category: '',
    contact_person: ''
  }
  // Reset category search
  categorySearch.value = ''
  showCategoryDropdown.value = false
  highlightedIndex.value = -1
  showModal.value = true
}

const openEditModal = (client: IClient) => {
  isEditing.value = true
  form.value = {
    id: client.id,
    name: client.name,
    phone_number: client.phone_number,
    facebook_link: client.facebook_link || '',
    status: client.status,
    category: client.category?.id || '',
    contact_person: client.contact_person?.id || ''
  }
  // Set category search to selected category name
  if (client.category?.name) {
    categorySearch.value = client.category.name
  } else {
    categorySearch.value = ''
  }
  
  showCategoryDropdown.value = false
  highlightedIndex.value = -1
  
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  // Reset category search state
  categorySearch.value = ''
  showCategoryDropdown.value = false
  highlightedIndex.value = -1
}

// Enhanced form submission
const submitForm = async () => {
  try {
    loading.value = true

    const payload = {
      name: form.value.name.trim(),
      phone_number: form.value.phone_number.trim(),
      facebook_link: form.value.facebook_link?.trim() || null,
      status: form.value.status,
      category: form.value.category || null,
      contact_person: form.value.contact_person || null
    }

    if (isEditing.value) {
      // Update
      await useApi(`/items/clients/${form.value.id}`, {
        method: 'PATCH',
        data: payload
      })

      Swal.fire({
        title: 'Success',
        text: 'Client updated successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } else {
      // Create - go to first page to see new item
      await useApi('/items/clients', {
        method: 'POST',
        data: payload
      })

      Swal.fire({
        title: 'Success',
        text: 'Client created successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })

      page.value = 1 // Go to first page to see new item
    }

    closeModal()
    await loadClients()
  } catch (error) {
    console.error('Error saving client:', error)

    const errorMessage = error?.response?.data?.errors?.[0]?.message || 'Failed to save client. Please try again.'

    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}

// Enhanced delete with better pagination handling
const confirmDelete = (client: IClient) => {
  Swal.fire({
    title: 'Are you sure?',
    text: `Do you really want to delete ${client.name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        loading.value = true

        await useApi(`/items/clients/${client.id}`, {
          method: 'DELETE'
        })

        Swal.fire({
          title: 'Deleted!',
          text: 'Client has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })

        // Check if we need to go to previous page after deletion
        const remainingItems = totalClients.value - 1
        const maxPage = Math.ceil(remainingItems / limit.value) || 1

        if (page.value > maxPage) {
          page.value = maxPage
        }

        await loadClients()
      } catch (error) {
        console.error('Error deleting client:', error)

        const errorMessage = error?.response?.data?.errors?.[0]?.message || 'Failed to delete client. Please try again.'

        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
        })
      } finally {
        loading.value = false
      }
    }
  })
}

// Watch for form category changes to update search input
watch(() => form.value.category, (newCategoryId) => {
  if (newCategoryId) {
    const selectedCategory = categories.value.find(cat => cat.id === newCategoryId)
    if (selectedCategory) {
      categorySearch.value = selectedCategory.name
    }
  } else {
    categorySearch.value = ''
  }
})

// Watch for search query changes and clear timeout on component unmount
watch(searchQuery, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    handleSearch()
  }
})

// Add event listener for click outside
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Load all data
  Promise.all([
    loadClients(),
    loadCategories(),
    loadContacts(),
    loadStatusOptions()
  ])
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>

<style scoped>
/* Custom scrollbar for tables */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Smooth transition for hover effects */
button {
  transition: all 0.2s ease;
}

/* Enhanced search highlight styles */
:deep(mark) {
  background-color: #fef08a;
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: 500;
}

/* Dark mode search highlights */
@media (prefers-color-scheme: dark) {
  :deep(mark) {
    background-color: #a16207;
    color: #fef3c7;
  }
}

/* Dark mode scrollbar */
@media (prefers-color-scheme: dark) {
  .overflow-x-auto::-webkit-scrollbar-track {
    background: #2a2a2a;
  }

  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #555;
  }

  .overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #777;
  }
}

/* Loading state animation */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Pagination button hover effects */
.pagination-btn {
  transition: all 0.15s ease-in-out;
}

.pagination-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-btn:active:not(:disabled) {
  transform: translateY(0);
}

/* Enhanced table row hover effects */
tbody tr {
  transition: all 0.15s ease-in-out;
}

tbody tr:hover {
  transform: translateX(2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Search input focus effects */
input:focus {
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

/* Modal animation enhancements */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

/* Status badge improvements */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

/* Action button improvements */
.action-btn {
  padding: 8px;
  border-radius: 6px;
  transition: all 0.15s ease-in-out;
}

.action-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: scale(1.1);
}

@media (prefers-color-scheme: dark) {
  .action-btn:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

/* Responsive improvements */
@media (max-width: 768px) {
  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .pagination-info {
    order: 2;
  }

  .pagination-buttons {
    order: 1;
  }

  .items-per-page {
    order: 3;
  }
}

/* Search results indicator */
.search-indicator {
  border-left: 4px solid #3b82f6;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced empty state */
.empty-state {
  animation: fadeIn 0.5s ease-in-out;
}

/* Form validation styles */
.form-input:invalid {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input:valid {
  border-color: #10b981;
}

/* Loading overlay for pagination */
.pagination-loading {
  position: relative;
  overflow: hidden;
}

.pagination-loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  to {
    left: 100%;
  }
}
</style>