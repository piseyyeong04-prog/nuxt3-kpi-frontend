<template>
  <div>
    <!-- Header with search and add button -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Client Management</h1>
      <div class="flex gap-4">
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Search clients..."
            class="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @input="handleSearch" />
          <div class="absolute left-3 top-2.5">
            <Icon icon="mdi:magnify" class="text-gray-500" />
          </div>
        </div>
        <button @click="openCreateModal"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Icon icon="mdi:plus" />
          Add Client
        </button>
      </div>
    </div>

    <!-- Client list -->
    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <div v-else-if="clients.length === 0" class="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
      <Icon icon="mdi:account-group" class="text-gray-400 text-6xl mb-4" />
      <h3 class="text-xl font-semibold mb-2">No clients found</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        {{ searchQuery ? 'Try a different search term' : 'Get started by adding your first client' }}
      </p>
      <button @click="openCreateModal"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto">
        <Icon icon="mdi:plus" />
        Add Client
      </button>
    </div>

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
        <tbody>
          <tr v-for="client in clients" :key="client.id"
            class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
            <td class="p-4">{{ client.name }}</td>
            <td class="p-4">{{ client.phone_number }}</td>
            <td class="p-4">
              <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {{ client.category?.name || 'Uncategorized' }}
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
                  <p>{{ client.contact_person.first_name }} {{ client.contact_person.last_name }}</p>
                  <p class="text-sm text-gray-500">{{ client.contact_person.email }}</p>
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

      <!-- Fixed Pagination -->
      <div class="flex justify-between items-center mt-6">
        <p class="text-sm text-gray-500">
          Showing {{ startIndex }} to {{ endIndex }} of {{ totalClients }} clients
        </p>
        <div class="flex items-center gap-2">
          <!-- Page info -->
          <span class="text-sm text-gray-500 mr-4">
            Page {{ page }} of {{ totalPages }}
          </span>
          
          <!-- First page button -->
          <button 
            @click="goToPage(1)" 
            :disabled="page === 1"
            :class="{ 'opacity-50 cursor-not-allowed': page === 1 }"
            class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm">
            <Icon icon="mdi:chevron-double-left" />
          </button>

          <!-- Previous page button -->
          <button 
            @click="goToPage(page - 1)" 
            :disabled="page === 1"
            :class="{ 'opacity-50 cursor-not-allowed': page === 1 }"
            class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm">
            Previous
          </button>

          <!-- Page numbers -->
          <div class="flex gap-1">
            <button
              v-for="pageNum in visiblePages"
              :key="pageNum"
              @click="goToPage(pageNum)"
              :class="{
                'bg-green-500 text-white': pageNum === page,
                'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600': pageNum !== page
              }"
              class="px-3 py-1 rounded text-sm min-w-[2rem]">
              {{ pageNum }}
            </button>
          </div>

          <!-- Next page button -->
          <button 
            @click="goToPage(page + 1)" 
            :disabled="page >= totalPages"
            :class="{ 'opacity-50 cursor-not-allowed': page >= totalPages }"
            class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm">
            Next
          </button>

          <!-- Last page button -->
          <button 
            @click="goToPage(totalPages)" 
            :disabled="page >= totalPages"
            :class="{ 'opacity-50 cursor-not-allowed': page >= totalPages }"
            class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm">
            <Icon icon="mdi:chevron-double-right" />
          </button>
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

            <div>
              <label class="block text-sm font-medium mb-1">Category</label>
              <select v-model="form.category"
                class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Select a category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
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
              <label class="block text-sm font-medium mb-1">Contact Person</label>
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
import { ref, onMounted, computed } from 'vue'
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

// Modal and form state
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

// Fixed pagination computed values
const totalPages = computed(() => {
  return Math.ceil(totalClients.value / limit.value)
})

const startIndex = computed(() => {
  return totalClients.value === 0 ? 0 : (page.value - 1) * limit.value + 1
})

const endIndex = computed(() => {
  return Math.min(page.value * limit.value, totalClients.value)
})

// Generate visible page numbers for pagination
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = page.value
  const pages: number[] = []
  
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
      for (let i = 2; i <= 5; i++) {
        pages.push(i)
      }
      if (total > 6) pages.push(-1) // Ellipsis
      pages.push(total)
    } else if (current >= total - 3) {
      // Show 1, ..., total-4, total-3, total-2, total-1, total
      if (total > 6) pages.push(-1) // Ellipsis
      for (let i = total - 4; i <= total; i++) {
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
  
  return pages.filter(p => p !== -1) // Remove ellipsis for now, can be added later
})

const formatStatusText = (status: string) => {
  if (!status) return ''
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Fixed pagination function
const goToPage = async (pageNum: number) => {
  if (pageNum < 1 || pageNum > totalPages.value || pageNum === page.value || loading.value) {
    return
  }
  
  page.value = pageNum
  await loadClients()
}

// Load clients from API - Fixed to handle pagination properly
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

    if (searchQuery.value) {
      query += `&filter[name][_contains]=${encodeURIComponent(searchQuery.value)}`
    }

    const response = await useApi<{ data: IClient[]; meta?: { total_count: number } }>(query, {
      method: 'GET',
    })

    if (response?.data) {
      clients.value = response.data
      totalClients.value = response.meta?.total_count || 0
    }
  } catch (error) {
    console.error('Error loading clients:', error)
    Swal.fire({
      title: 'Error',
      text: 'Failed to load clients. Please try again.',
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}

// Load categories
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

// Load contacts
const loadContacts = async () => {
  try {
    const response = await useApi<{ data: any[] }>('/users?fields=id,first_name,last_name&sort=first_name', {
      method: 'GET',
    })

    if (response?.data) {
      contacts.value = response.data
    }
  } catch (error) {
    console.error('Error loading contacts:', error)
  }
}

const statusOptions = ref<{ text: string; value: string; color?: string }[]>([])

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

// Handle search with debounce - Fixed to reset pagination
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    page.value = 1 // Reset to first page when searching
    loadClients()
  }, 300)
}

// Format date
const formatDate = (dateString: string) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
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
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// Submit form - Fixed to stay on current page after operations
const submitForm = async () => {
  try {
    loading.value = true

    const payload = {
      name: form.value.name,
      phone_number: form.value.phone_number,
      facebook_link: form.value.facebook_link || null,
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
    Swal.fire({
      title: 'Error',
      text: 'Failed to save client. Please try again.',
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}

// Confirm and delete client - Fixed to handle pagination after deletion
const confirmDelete = (client: IClient) => {
  Swal.fire({
    title: 'Are you sure?',
    text: `Do you really want to delete ${client.name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
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
        Swal.fire({
          title: 'Error',
          text: 'Failed to delete client. Please try again.',
          icon: 'error',
        })
      }
    }
  })
}

// On component mount
onMounted(async () => {
  await Promise.all([
    loadClients(),
    loadCategories(),
    loadContacts(),
    loadStatusOptions()
  ])
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

/* Dark mode compatibility */
@media (prefers-color-scheme: dark) {
  .overflow-x-auto::-webkit-scrollbar-track {
    background: #2a2a2a;
  }
}
</style>