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
                <input id="search" v-model="searchQuery" @input="handleSearch" type="text"
                    placeholder="Search by business name, owner, location, or industry..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
            </div>
            <div>
                <label for="per-page" class="block text-sm font-medium text-gray-700 mb-2">Show</label>
                <select id="per-page" v-model="itemsPerPage" @change="handlePerPageChange"
                    class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
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
                            Industry
                        </th>
                        <th scope="col" class="px-6 py-3 bg-green-600 text-white font-medium">
                            Confirm Date
                        </th>

                        <th scope="col" class="px-6 py-3 bg-green-600 text-white font-medium">
                            Contact Links
                        </th>
                        <th scope="col" class="px-6 py-3 bg-green-600 text-white font-medium">
                            Contact Tasks
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
                            <span v-if="business.industry"
                                class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {{ business.industry }}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            {{ business.confirm_date }}
                        </td>

                        <td class="px-6 py-4">
                            <div class="space-y-1">
                                <a v-if="business.contact_link" :href="business.contact_link"
                                    class="block font-medium text-blue-600 dark:text-blue-500 hover:underline text-xs"
                                    target="_blank" rel="noopener noreferrer">
                                    Main Contact
                                </a>
                                <template v-if="business.contact_links && business.contact_links.length > 0">
                                    <a v-for="(link, linkIndex) in business.contact_links" :key="linkIndex"
                                        :href="link.name"
                                        class="block font-medium text-blue-600 dark:text-blue-500 hover:underline text-xs"
                                        target="_blank" rel="noopener noreferrer">
                                        Link {{ linkIndex + 1 }}
                                    </a>
                                </template>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="space-y-1">
                                <template v-if="business.contact_task && business.contact_task.length > 0">
                                    <span v-for="(task, index) in business.contact_task" :key="index"
                                        class="block text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                        Task {{ index + 1 }}: {{ task.name }}
                                    </span>
                                </template>
                                <span v-else class="text-gray-400 italic text-xs">No tasks</span>
                            </div>
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
                <button @click="goToPage(1)" :disabled="currentPage === 1"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    First
                </button>
                <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                </button>
            </div>

            <div class="flex items-center space-x-1">
                <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
                    'px-3 py-2 text-sm font-medium rounded-lg',
                    currentPage === page
                        ? 'text-white bg-green-600 hover:bg-green-700'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                ]">
                    {{ page }}
                </button>
            </div>

            <div class="flex items-center space-x-2">
                <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                </button>
                <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Last
                </button>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <!-- Updated form section with correct data binding -->
        <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

                <div
                    class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <form @submit.prevent="submitForm">
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                                {{ isEdit ? 'Edit Business' : 'Add New Business' }}
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                                    <input v-model="formData.business_name" required type="text"
                                        class="w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
                                    <input v-model="formData.owner_name" required type="text"
                                        class="w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                                    <input v-model="formData.location" required type="text"
                                        class="w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                                    <input v-model="formData.industry" type="text"
                                        class="w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Date *</label>
                                    <input v-model="formData.confirm_date" type="text"
                                        class="w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Checked</label>
                                    <select v-model="formData.checked[0]"
                                        class="w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Main Contact Link
                                        *</label>
                                    <input v-model="formData.contact_link" required type="url"
                                        class="w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                                    <input v-model="formData.reference" type="text"
                                        class="w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Task</label>
                                    <input v-model="formData.task" type="text"
                                        class="w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500">
                                </div>

                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Additional Contact
                                        Links</label>
                                    <div class="space-y-2">
                                        <div v-for="(link, index) in formData.contact_links" :key="index"
                                            class="flex items-center space-x-2">
                                            <input v-model="link.name" type="url" placeholder="Enter contact link"
                                                class="flex-1 px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500">
                                            <button type="button" @click="removeContactLink(index)"
                                                class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm">
                                                Remove
                                            </button>
                                        </div>
                                        <button type="button" @click="addContactLink"
                                            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm">
                                            Add Contact Link
                                        </button>
                                    </div>
                                </div>

                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Contact Tasks</label>
                                    <div class="space-y-2">
                                        <div v-for="(task, index) in formData.contact_task" :key="index"
                                            class="flex items-center space-x-2">
                                            <input v-model="task.name" type="text" placeholder="Enter task"
                                                class="flex-1 px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500" />
                                            <button type="button" @click="removeContactTask(index)"
                                                class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm">
                                                Remove
                                            </button>
                                        </div>
                                        <button type="button" @click="addContactTask"
                                            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm">
                                            Add Contact Task
                                        </button>
                                    </div>
                                </div>

                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                                    <textarea v-model="formData.remark" rows="3"
                                        class="w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" :disabled="submitting"
                                class="w-full sm:w-auto inline-flex justify-center rounded-md bg-green-600 px-4 py-2 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                                {{ submitting ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
                            </button>
                            <button type="button" @click="closeModal"
                                class="mt-3 w-full sm:w-auto inline-flex justify-center rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3">
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

definePageMeta({
    middleware: 'auth',
});

interface ContactLink {
    name: string
}
interface ContactTask {
    name: string
}

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
    checked: string[]
    contact_link: string
    remark?: string | null
    task?: string | null
    industry?: string | null
    reference?: string | null
    contact_links?: ContactLink[]
    contact_task?: ContactTask[]
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
const getUserById = (id: string) => {
    return users.value.find(user => user.id === id)
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
    contact_task: [],
    remark: null,
    task: null,
    industry: null,
    reference: null,
    contact_links: []
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
        (business.industry && business.industry.toLowerCase().includes(query)) ||
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

// Contact Links Management
const addContactLink = () => {
    formData.value.contact_links = formData.value.contact_links || []
    formData.value.contact_links.push({ name: '' })
}

const removeContactLink = (index: number) => {
    if (formData.value.contact_links) {
        formData.value.contact_links.splice(index, 1)
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
        const response = await useApi(`/items/interview_tracking?filter[status]=published&fields=*,contact_links.name,interview_by.id,interview_by.first_name,interview_by.last_name,interview_by.title,contact_task.name&sort=-date_created`, {
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
        console.log('Creating business with data:', data);
        
        const response = await useApi('/items/interview_tracking', {
            method: 'POST',
            data: data
        })
        
        console.log('Create response:', response);
        await fetchBusinesses()
    } catch (error: any) {
        console.error('Error creating business:', error)
        if (error.response) {
            console.error('Backend error details:', error.response.data)
        }
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
        checked: ['no'], // Initialize as array with default value
        interview_by: '',
        remark: null,
        task: null,
        industry: null,
        reference: null,
        contact_links: [],
        contact_task: [] // Initialize empty array
    }
    showModal.value = true
}
const openEditModal = (business: InterviewTracking) => {
    isEdit.value = true;
    currentEditId.value = business.id || null;

    formData.value = {
        ...business,
        checked: business.checked || ['no'], // Ensure checked is always an array
        contact_links: business.contact_links || [],
        contact_task: business.contact_task || [],
        interview_by: typeof business.interview_by === 'object' && business.interview_by?.id
            ? business.interview_by.id
            : business.interview_by || ''
    };
    showModal.value = true;
};
const closeModal = () => {
    showModal.value = false
    currentEditId.value = null
}
// Alternative clean submit function that ensures proper data structure
const submitForm = async () => {
    submitting.value = true
    try {
        // Prepare the data for submission
        const dataToSubmit = {
            business_name: formData.value.business_name,
            owner_name: formData.value.owner_name,
            location: formData.value.location,
            confirm_date: formData.value.confirm_date,
            contact_link: formData.value.contact_link,
            checked: formData.value.checked || ['no'],
            industry: formData.value.industry || null,
            reference: formData.value.reference || null,
            task: formData.value.task || null,
            remark: formData.value.remark || null,
            // Only include these if they have data
            ...(formData.value.contact_links && formData.value.contact_links.length > 0 && {
                contact_links: formData.value.contact_links.filter(link => link.name && link.name.trim() !== '')
            }),
            ...(formData.value.contact_task && formData.value.contact_task.length > 0 && {
                contact_task: formData.value.contact_task.filter(task => task.name && task.name.trim() !== '')
            }),
            // Handle interview_by separately
            ...(formData.value.interview_by && {
                interview_by: formData.value.interview_by
            })
        };

        // Debug log to see what we're sending
        console.log('Data being submitted:', JSON.stringify(dataToSubmit, null, 2));

        if (isEdit.value && currentEditId.value) {
            await updateBusiness(currentEditId.value, dataToSubmit)
        } else {
            await createBusiness(dataToSubmit)
        }
        closeModal()
    } catch (error: any) {
        console.error('Error submitting form:', error)
        
        // More detailed error logging
        if (error.response) {
            console.error('Error response data:', error.response.data)
            console.error('Error response status:', error.response.status)
            console.error('Error response headers:', error.response.headers)
        }
        
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.errors?.[0]?.message || 'There was an error saving the business. Please try again.'
        })
    } finally {
        submitting.value = false
    }
}
const confirmDelete = (business: InterviewTracking) => {
    Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete the business "${business.business_name}". This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await deleteBusiness(business.id || 0)
                Swal.fire('Deleted!', 'The business has been deleted.', 'success')
            } catch (error) {
                console.error('Error deleting business:', error)
                Swal.fire('Error!', 'There was an error deleting the business. Please try again.', 'error')
            }
        }
    })
}
// Toggle all checkboxes
const toggleAllCheckboxes = () => {
    businesses.value.forEach(business => {
        if (!business.checked) {
            business.checked = []
        }
        if (selectAll.value) {
            business.checked[0] = 'yes'
        } else {
            business.checked[0] = 'no'
        }
    })
}// Initialize
const addContactTask = () => {
    formData.value.contact_task = formData.value.contact_task || []
    formData.value.contact_task.push({ name: '' })
}

const removeContactTask = (index: number) => {
    if (formData.value.contact_task) {
        formData.value.contact_task.splice(index, 1)
    }
}

onMounted(() => {
    fetchBusinesses()
    fetchUsers()
})

</script>