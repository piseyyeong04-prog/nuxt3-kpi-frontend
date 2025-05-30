<template>
    <div class="p-6 min-h-screen">
        <!-- Header with Add Button -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Interview Tracking</h1>
            <button @click="openCreateModal"
                class="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5">
                Add New Business
            </button>
        </div>

        <!-- Search and Filter Controls -->
        <div class="mb-6 flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
                <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input 
                    id="search"
                    v-model="searchQuery" 
                    @input="handleSearch"
                    type="text" 
                    placeholder="Search by business name, owner, or location..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
            </div>
            <div>
                <label for="per-page" class="block text-sm font-medium text-gray-700 mb-2">Show</label>
                <select 
                    id="per-page"
                    v-model="itemsPerPage" 
                    @change="handlePerPageChange"
                    class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
        </div>

        <!-- Results Info -->
        <div v-if="!loading" class="mb-4 text-sm text-gray-600">
            Showing {{ startIndex }} to {{ endIndex }} of {{ totalItems }} entries
            <span v-if="searchQuery">(filtered from {{ businesses.length }} total entries)</span>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>

        <!-- Table -->
        <div v-else class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3 bg-green-600 text-white font-medium">
                            Business Name
                        </th>
                        <th scope="col" class="px-6 py-3 bg-green-600 text-white font-medium">
                            Owner Name
                        </th>
                        <th scope="col" class="px-6 py-3 bg-green-600 text-white font-medium">
                            Location
                        </th>
                        <th scope="col" class="px-6 py-3 bg-green-600 text-white font-medium">
                            Confirm Date 
                        </th>
                        <th scope="col" class="px-6 py-3 bg-green-600 text-white font-medium">
                            <div class="flex items-center">
                                <input id="checkbox-all" type="checkbox"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    @change="toggleAllCheckboxes" v-model="selectAll">
                                <label for="checkbox-all" class="sr-only">checkbox</label>
                                <span class="ml-2">Checked</span>
                            </div>
                        </th>
                        <th scope="col" class="px-6 py-3 bg-green-600 text-white font-medium">
                            Interview By
                        </th>
                        <th scope="col" class="px-6 py-3 bg-green-600 text-white font-medium">
                            Contact Link
                        </th>
                        <th scope="col" class="px-6 py-3 bg-green-600 text-white font-medium">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(business, index) in paginatedBusinesses" :key="business.id"
                        class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {{ business.business_name }}
                        </th>
                        <td class="px-6 py-4">
                            {{ business.owner_name }}
                        </td>
                        <td class="px-6 py-4">
                            {{ business.location }}
                        </td>
                        <td class="px-6 py-4">
                            {{ business.confirm_date }}
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-center">
                                <input :id="`checkbox-${index}`" type="checkbox"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    :checked="business.checked && business.checked[0] === 'yes'"
                                    @change="updateCheckbox(business, $event)">
                                <label :for="`checkbox-${index}`" class="sr-only">checkbox</label>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <span v-if="business.interview_by && typeof business.interview_by === 'object'">
                                {{ business.interview_by.first_name || '' }} {{ business.interview_by.last_name || '' }}
                            </span>
                            <span v-else class="text-gray-400 italic">Not set</span>
                        </td>
                        <td class="px-6 py-4">
                            <a :href="business.contact_link"
                                class="font-medium text-blue-600 dark:text-blue-500 hover:underline" target="_blank"
                                rel="noopener noreferrer">
                                Contact
                            </a>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex space-x-2">
                                <button @click="openEditModal(business)"
                                    class="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs px-3 py-1.5">
                                    Edit
                                </button>
                                <button @click="confirmDelete(business)"
                                    class="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-xs px-3 py-1.5">
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- No Results Message -->
            <div v-if="filteredBusinesses.length === 0" class="text-center py-8 text-gray-500">
                <p v-if="searchQuery">No businesses found matching "{{ searchQuery }}"</p>
                <p v-else>No businesses found</p>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-between mt-6">
            <div class="flex items-center space-x-2">
                <button 
                    @click="goToPage(1)" 
                    :disabled="currentPage === 1"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    First
                </button>
                <button 
                    @click="goToPage(currentPage - 1)" 
                    :disabled="currentPage === 1"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
            </div>

            <div class="flex items-center space-x-1">
                <button 
                    v-for="page in visiblePages" 
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                        'px-3 py-2 text-sm font-medium rounded-lg',
                        currentPage === page 
                            ? 'text-white bg-green-600 hover:bg-green-700' 
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                    ]"
                >
                    {{ page }}
                </button>
            </div>

            <div class="flex items-center space-x-2">
                <button 
                    @click="goToPage(currentPage + 1)" 
                    :disabled="currentPage === totalPages"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
                <button 
                    @click="goToPage(totalPages)" 
                    :disabled="currentPage === totalPages"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Last
                </button>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

                <div
                    class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form @submit.prevent="submitForm">
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="sm:flex sm:items-start">
                                <div class="w-full">
                                    <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        {{ isEdit ? 'Edit Business' : 'Add New Business' }}
                                    </h3>

                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                                            <input v-model="formData.business_name" type="text" required
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                                            <input v-model="formData.owner_name" type="text" required
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                            <input v-model="formData.location" type="text" required
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Date</label>
                                            <input v-model="formData.confirm_date" type="text" required
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Contact Link</label>
                                            <input v-model="formData.contact_link" type="url" required
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Checked</label>
                                            <select v-model="formData.checked[0]"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Interviewed By</label>
                                            <select v-model="formData.interview_by" required
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                                                <option disabled value="">Select User</option>
                                                <option v-for="user in users" :key="user.id" :value="user.id">
                                                    {{ user.first_name }} {{ user.last_name }} ({{ user.title }})
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" :disabled="submitting"
                                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                                {{ submitting ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
                            </button>
                            <button type="button" @click="closeModal"
                                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import type { IResponse } from '~/types/api';
import Swal from 'sweetalert2';

interface InterviewTracking {
    id?: number
    status?: string
    sort?: null
    user_created?: string
    date_created?: string
    user_updated?: string
    date_updated?: string
    business_name: string
    owner_name: string
    location: string
    confirm_date: string
    contact_link: string
    checked: string[]
    interview_by?: {
        id: string
        first_name: string
        last_name: string
        title?: string
        avatar?: string
        email?: string
        department?: { title: string }
    } | string
}

const users = ref<any[]>([])
const businesses = ref<InterviewTracking[]>([])
const loading = ref(false)
const selectAll = ref(false)
const showModal = ref(false)
const isEdit = ref(false)
const submitting = ref(false)

// Search and Pagination
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const formData = ref<InterviewTracking>({
    business_name: '',
    owner_name: '',
    location: '',
    confirm_date: '',
    contact_link: '',
    checked: ['no'],
    interview_by: '',
})

const currentEditId = ref<number | null>(null)

// Computed properties for search and pagination
const filteredBusinesses = computed(() => {
    if (!searchQuery.value.trim()) {
        return businesses.value
    }
    
    const query = searchQuery.value.toLowerCase().trim()
    return businesses.value.filter(business => 
        business.business_name.toLowerCase().includes(query) ||
        business.owner_name.toLowerCase().includes(query) ||
        business.location.toLowerCase().includes(query) ||
        business.confirm_date.toLowerCase().includes(query) ||
        (business.interview_by && typeof business.interview_by === 'object' && 
         `${business.interview_by.first_name} ${business.interview_by.last_name}`.toLowerCase().includes(query))
    )
})

const totalItems = computed(() => filteredBusinesses.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const startIndex = computed(() => {
    if (totalItems.value === 0) return 0
    return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endIndex = computed(() => {
    const end = currentPage.value * itemsPerPage.value
    return Math.min(end, totalItems.value)
})

const paginatedBusinesses = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredBusinesses.value.slice(start, end)
})

const visiblePages = computed(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)
    
    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    
    return pages
})

// Watchers
watch([searchQuery], () => {
    currentPage.value = 1
})

watch([itemsPerPage], () => {
    currentPage.value = 1
})

// Search and Pagination methods
const handleSearch = () => {
    currentPage.value = 1
}

const handlePerPageChange = () => {
    currentPage.value = 1
}

const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

// API methods
const fetchUsers = async () => {
    try {
        const response = await useApi(`/users`, { method: 'GET' }) as IResponse<any>
        users.value = response.data || []
    } catch (error) {
        console.error('Error fetching users:', error)
    }
}

const fetchBusinesses = async () => {
    loading.value = true
    try {
        const response = await useApi(`/items/interview_tracking?sort=-date_created&fields=*,interview_by.id,interview_by.first_name,interview_by.last_name,interview_by.title`, {
            method: 'GET'
        }) as IResponse<any>

        businesses.value = response.data || []
    } catch (error) {
        console.error('Error fetching businesses:', error)
    } finally {
        loading.value = false
    }
}

const createBusiness = async (data: InterviewTracking) => {
    try {
        await useApi('/items/interview_tracking', {
            method: 'POST',
            data: data
        })
        await fetchBusinesses()
    } catch (error) {
        console.error('Error creating business:', error)
        throw error
    }
}

const updateBusiness = async (id: number, data: InterviewTracking) => {
    try {
        await useApi(`/items/interview_tracking/${id}`, {
            method: 'PATCH',
            data: data
        })
        await fetchBusinesses()
    } catch (error) {
        console.error('Error updating business:', error)
        throw error
    }
}

const deleteBusiness = async (id: number) => {
    try {
        await useApi(`/items/interview_tracking/${id}`, {
            method: 'DELETE'
        })
        await fetchBusinesses()
    } catch (error) {
        console.error('Error deleting business:', error)
        throw error
    }
}

// Modal functions
const openCreateModal = () => {
    isEdit.value = false
    formData.value = {
        business_name: '',
        owner_name: '',
        location: '',
        confirm_date: '',
        contact_link: '',
        checked: ['no'],
        interview_by: '',
    }
    showModal.value = true
}

const openEditModal = (business: InterviewTracking) => {
    isEdit.value = true
    currentEditId.value = business.id || null
    formData.value = {
        business_name: business.business_name,
        owner_name: business.owner_name,
        location: business.location,
        confirm_date: business.confirm_date,
        contact_link: business.contact_link,
        checked: business.checked ? [...business.checked] : ['no'],
        interview_by: business.interview_by ? (typeof business.interview_by === 'string' ? business.interview_by : business.interview_by.id) : ''
    }
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    currentEditId.value = null
}

const submitForm = async () => {
    submitting.value = true
    try {
        if (isEdit.value && currentEditId.value) {
            await updateBusiness(currentEditId.value, formData.value)
            await Swal.fire('Updated!', 'Business updated successfully.', 'success')
        } else {
            await createBusiness(formData.value)
            await Swal.fire('Created!', 'New business added successfully.', 'success')
        }
        closeModal()
    } catch (error) {
        console.error('Error submitting form:', error)
        await Swal.fire('Error', 'Something went wrong. Please try again.', 'error')
    } finally {
        submitting.value = false
    }
}

const confirmDelete = async (business: InterviewTracking) => {
    const result = await Swal.fire({
        title: `Delete "${business.business_name}"?`,
        text: "This action cannot be undone.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed && business.id) {
        try {
            await deleteBusiness(business.id)
            await Swal.fire('Deleted!', 'Business has been removed.', 'success')
        } catch (error) {
            console.error('Error deleting business:', error)
            await Swal.fire('Error', 'Unable to delete business.', 'error')
        }
    }
}

// Checkbox functions
const updateCheckbox = async (business: InterviewTracking, event: Event) => {
    const target = event.target as HTMLInputElement
    const newCheckedValue = target.checked ? 'yes' : 'no'

    if (business.id) {
        try {
            await updateBusiness(business.id, {
                ...business,
                checked: [newCheckedValue]
            })
            await Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Status updated',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.error('Error updating checkbox:', error)
            target.checked = !target.checked
            await Swal.fire('Error', 'Could not update status.', 'error')
        }
    }
}

const toggleAllCheckboxes = async () => {
    const newValue = selectAll.value ? 'yes' : 'no'

    for (const business of paginatedBusinesses.value) {
        if (business.id) {
            try {
                await updateBusiness(business.id, {
                    ...business,
                    checked: [newValue]
                })
            } catch (error) {
                console.error('Error updating business checkbox:', error)
            }
        }
    }
    await fetchBusinesses()
}

// Initialize
onMounted(() => {
    fetchBusinesses()
    fetchUsers()
})
</script>

<style scoped>
.fixed.inset-0 {
    backdrop-filter: blur(2px);
}

@media (max-width: 768px) {
    table {
        font-size: 0.875rem;
    }

    th,
    td {
        padding: 0.5rem 0.75rem;
    }

    .px-6 {
        padding-left: 0.75rem;
        padding-right: 0.75rem;
    }
}
</style>