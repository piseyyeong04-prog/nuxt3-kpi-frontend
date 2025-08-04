<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

        <!-- Header Section -->
        <div class="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-12    z-10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <div class="flex items-center justify-between mt-4 ">
                    <div class="flex items-center space-x-4">
                        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                            <Icon icon="heroicons:document-arrow-up" class="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1
                                class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                                Client Data Manager
                            </h1>
                            <p class="text-sm text-gray-600">Import and manage your client database efficiently</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2 text-sm text-gray-500">
                        <Icon icon="heroicons:users" class="h-4 w-4" />
                        <span>{{ clients.length }} clients</span>
                    </div>
                </div>
                <div class=" flex justify-end">
                    <button @click="openImportModal"
                        class="px-6 flex py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow hover:scale-105 transition">
                        <Icon icon="heroicons:cloud-arrow-up" class="h-5 w-5 mr-2" />
                        Import Clients
                    </button>
                </div>
            </div>
        </div>
        <ImportClientModal :show="isImportModalOpen" :close="closeImportModal">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <!-- Import Section -->
                <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                        <h2 class="text-xl font-semibold text-white flex items-center">
                            <Icon icon="heroicons:cloud-arrow-up" class="h-6 w-6 mr-3" />
                            Import Client Data
                        </h2>
                        <p class="text-blue-100 mt-1">Upload Excel files to bulk import client information</p>
                    </div>

                    <div class="p-8">
                        <!-- File Upload Area -->
                        <div class="mb-8">
                            <div class="relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 group hover:scale-[1.02]"
                                :class="{
                                    'border-blue-400 bg-blue-50/50 scale-[1.02]': isDragOver,
                                    'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30': !isDragOver
                                }" @dragover.prevent="isDragOver = true" @dragleave="isDragOver = false"
                                @drop.prevent="handleFileDrop">
                                <div
                                    class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                </div>

                                <div class="relative z-10">
                                    <div class="mb-6">
                                        <div
                                            class="inline-flex p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
                                            <Icon icon="heroicons:document-arrow-up" class="h-12 w-12 text-blue-600" />
                                        </div>
                                    </div>

                                    <h3 class="text-xl font-semibold text-gray-900 mb-2">
                                        {{ isDragOver ? 'Drop your file here' : 'Upload Excel File' }}
                                    </h3>
                                    <p class="text-gray-600 mb-6">
                                        Drag and drop your Excel file or click to browse
                                    </p>

                                    <button type="button"
                                        class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                                        @click="triggerFileInput">
                                        <Icon icon="heroicons:folder-open" class="h-5 w-5 mr-2" />
                                        Browse Files
                                    </button>

                                    <p class="text-sm text-gray-500 mt-4 flex items-center justify-center">
                                        <Icon icon="heroicons:document-check" class="h-4 w-4 mr-1" />
                                        Supports .xlsx, .xls files up to 10MB
                                    </p>
                                </div>
                            </div>

                            <input ref="fileInput" type="file" accept=".xlsx,.xls" class="hidden"
                                @change="handleFileSelect">
                        </div>

                        <!-- Selected File Info -->
                        <Transition enter-active-class="transition-all duration-300"
                            enter-from-class="opacity-0 transform scale-95"
                            enter-to-class="opacity-100 transform scale-100"
                            leave-active-class="transition-all duration-200"
                            leave-from-class="opacity-100 transform scale-100"
                            leave-to-class="opacity-0 transform scale-95">
                            <div v-if="selectedFile" class="mb-8">
                                <div
                                    class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center space-x-4">
                                            <div class="flex-shrink-0">
                                                <div class="bg-green-100 p-3 rounded-xl">
                                                    <Icon icon="heroicons:document-check"
                                                        class="h-8 w-8 text-green-600" />
                                                </div>
                                            </div>
                                            <div>
                                                <h4 class="font-semibold text-gray-900">{{ selectedFile.name }}</h4>
                                                <p class="text-sm text-gray-600">{{ formatFileSize(selectedFile.size) }}
                                                </p>
                                            </div>
                                        </div>
                                        <button type="button"
                                            class="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                            @click="removeFile">
                                            <Icon icon="heroicons:x-mark" class="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Transition>

                        <!-- Import Options -->
                        <Transition enter-active-class="transition-all duration-300 delay-150"
                            enter-from-class="opacity-0 transform translate-y-4"
                            enter-to-class="opacity-100 transform translate-y-0">
                            <div v-if="selectedFile" class="mb-8">
                                <div class="bg-gray-50/50 rounded-2xl p-6 border border-gray-200">
                                    <h4 class="font-semibold text-gray-900 mb-4 flex items-center">
                                        <Icon icon="heroicons:cog-6-tooth" class="h-5 w-5 mr-2" />
                                        Import Settings
                                    </h4>

                                    <div class="space-y-4">
                                        <label
                                            class="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                                            <input type="checkbox" v-model="useBatchImport"
                                                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0">
                                            <div class="ml-4">
                                                <div class="font-medium text-gray-900">Batch Import</div>
                                                <div class="text-sm text-gray-600">Process large files in smaller chunks
                                                    for better performance</div>
                                            </div>
                                        </label>

                                        <Transition enter-active-class="transition-all duration-200"
                                            enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-20"
                                            leave-active-class="transition-all duration-200"
                                            leave-from-class="opacity-100 max-h-20" leave-to-class="opacity-0 max-h-0">
                                            <div v-if="useBatchImport" class="ml-4 pl-8 border-l-2 border-blue-200">
                                                <label class="flex items-center space-x-3">
                                                    <span class="text-sm font-medium text-gray-700">Batch size:</span>
                                                    <select v-model="batchSize"
                                                        class="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500">
                                                        <option value="25">25 records</option>
                                                        <option value="50">50 records</option>
                                                        <option value="100">100 records</option>
                                                    </select>
                                                </label>
                                            </div>
                                        </Transition>
                                    </div>
                                </div>
                            </div>
                        </Transition>

                        <!-- Import Button -->
                        <Transition enter-active-class="transition-all duration-300 delay-300"
                            enter-from-class="opacity-0 transform translate-y-4"
                            enter-to-class="opacity-100 transform translate-y-0">
                            <div v-if="selectedFile" class="mb-8">
                                <button type="button" :disabled="importing"
                                    class="w-full relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                                    @click="startImport">
                                    <div v-if="importing" class="flex items-center justify-center">
                                        <div
                                            class="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3">
                                        </div>
                                        Importing... {{ progress }}%
                                    </div>
                                    <div v-else class="flex items-center justify-center">
                                        <Icon icon="heroicons:play" class="h-5 w-5 mr-2" />
                                        Start Import
                                    </div>

                                    <!-- Progress overlay -->
                                    <div v-if="importing"
                                        class="absolute inset-0 bg-green-400/20 transition-all duration-300"
                                        :style="{ width: progress + '%' }"></div>
                                </button>
                            </div>
                        </Transition>

                        <!-- Progress Bar -->
                        <Transition enter-active-class="transition-all duration-300"
                            enter-from-class="opacity-0 transform scale-95"
                            enter-to-class="opacity-100 transform scale-100">
                            <div v-if="importing" class="mb-8">
                                <div class="bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-500 rounded-full"
                                        :style="{ width: progress + '%' }"></div>
                                </div>
                                <p class="text-center text-sm text-gray-600 mt-2">Processing your data...</p>
                            </div>
                        </Transition>

                        <!-- Results -->
                        <Transition enter-active-class="transition-all duration-500"
                            enter-from-class="opacity-0 transform translate-y-8"
                            enter-to-class="opacity-100 transform translate-y-0">
                            <div v-if="importResult" class="space-y-6">
                                <!-- Success Summary -->
                                <div v-if="importResult.success"
                                    class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                                    <div class="flex items-start">
                                        <div class="flex-shrink-0">
                                            <div class="bg-green-100 p-2 rounded-xl">
                                                <Icon icon="heroicons:check-circle" class="h-6 w-6 text-green-600" />
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <h3 class="font-semibold text-green-900">Import Completed Successfully!</h3>
                                            <div class="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                                <div class="bg-white/50 rounded-xl p-3">
                                                    <div class="font-medium text-green-800">Total Records</div>
                                                    <div class="text-2xl font-bold text-green-900">{{
                                                        importResult.totalRecords }}</div>
                                                </div>
                                                <div class="bg-white/50 rounded-xl p-3">
                                                    <div class="font-medium text-green-800">Successful</div>
                                                    <div class="text-2xl font-bold text-green-900">{{
                                                        importResult.successfulImports }}</div>
                                                </div>
                                                <div v-if="importResult.failedImports > 0"
                                                    class="bg-white/50 rounded-xl p-3">
                                                    <div class="font-medium text-red-800">Failed</div>
                                                    <div class="text-2xl font-bold text-red-900">{{
                                                        importResult.failedImports }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Error Summary -->
                                <div v-if="importResult.errors.length > 0"
                                    class="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6">
                                    <div class="flex items-start">
                                        <div class="flex-shrink-0">
                                            <div class="bg-red-100 p-2 rounded-xl">
                                                <Icon icon="heroicons:exclamation-triangle"
                                                    class="h-6 w-6 text-red-600" />
                                            </div>
                                        </div>
                                        <div class="ml-4 flex-1">
                                            <h3 class="font-semibold text-red-900">Import Errors</h3>
                                            <div class="mt-3 bg-white/50 rounded-xl p-4 max-h-48 overflow-y-auto">
                                                <ul class="space-y-2">
                                                    <li v-for="error in importResult.errors" :key="error.row"
                                                        class="text-sm">
                                                        <span
                                                            class="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-medium mr-2">
                                                            <span v-if="error.row > 0">Row {{ error.row }}</span>
                                                            <span v-else>General</span>
                                                        </span>
                                                        {{ error.error }}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>

                <!-- Manual Add Section -->

            </div>
        </ImportClientModal>

        <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                <h3 class="text-xl font-semibold text-white flex items-center">
                    <Icon icon="heroicons:user-plus" class="h-6 w-6 mr-3" />
                    Add Client Manually
                </h3>
                <p class="text-indigo-100 mt-1">Quickly add individual client records</p>
            </div>

            <div class="p-8">
                <form @submit.prevent="addClient" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700">Business Name *</label>
                            <input v-model="newClient.business_name" placeholder="Enter business name"
                                class="input-modern" required />
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700">Industry *</label>
                            <input v-model="newClient.industry" placeholder="e.g., Technology, Healthcare"
                                class="input-modern" required />
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700">Contact Person</label>
                            <input v-model="newClient.contact_person" placeholder="Primary contact name"
                                class="input-modern" />
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700">Phone Number</label>
                            <input v-model="newClient.contact" placeholder="+1 (555) 123-4567" class="input-modern" />
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700">Telegram</label>
                            <input v-model="newClient.telegram_contact" placeholder="@username" class="input-modern" />
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700">Facebook</label>
                            <input v-model="newClient.facebook_link" placeholder="Facebook profile/page URL"
                                class="input-modern" />
                        </div>

                        <div class="space-y-2 md:col-span-2 xl:col-span-1">
                            <label class="text-sm font-medium text-gray-700">Task/Project</label>
                            <input v-model="newClient.task" placeholder="Current task or project"
                                class="input-modern" />
                        </div>

                        <div class="space-y-2 md:col-span-2 xl:col-span-1">
                            <label class="text-sm font-medium text-gray-700">Last Contact</label>
                            <input v-model="newClient.date_of_last_contact" type="date" class="input-modern" />
                        </div>

                        <div class="space-y-2 md:col-span-2 xl:col-span-1">
                            <label class="text-sm font-medium text-gray-700">Remarks</label>
                            <input v-model="newClient.remark" placeholder="Additional notes" class="input-modern" />
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <button type="submit"
                            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                            <Icon icon="heroicons:plus" class="h-5 w-5 mr-2" />
                            Add Client
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <!-- Client List Section -->
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div class="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-xl font-semibold text-white flex items-center">
                            <Icon icon="heroicons:users" class="h-6 w-6 mr-3" />
                            Client Database
                        </h3>
                        <p class="text-gray-300 mt-1">Manage your client relationships</p>
                    </div>
                    <div class="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                        <span class="text-white font-semibold">{{ filteredClients.length }}</span>
                        <span class="text-gray-300 ml-1">clients</span>
                    </div>
                </div>
            </div>

            <div class="p-8">
                <!-- Controls -->
                <!-- Enhanced Controls Section -->
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <!-- Search and Filter Section -->
                    <div class="flex flex-col sm:flex-row gap-4 flex-1 max-w-4xl">
                        <!-- Search Input with Icon -->
                        <div class="relative flex-1">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Icon icon="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
                            </div>
                            <input v-model="searchQuery" type="text"
                                placeholder="Search by name, industry, or contact..."
                                class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500" />
                            <!-- Clear Search Button -->
                            <button v-if="searchQuery" @click="searchQuery = ''"
                                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                                <Icon icon="heroicons:x-mark" class="h-5 w-5" />
                            </button>
                        </div>

                        <!-- User Filter Dropdown -->
                        <div class="relative min-w-0 sm:w-72">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Icon icon="heroicons:users" class="h-5 w-5 text-gray-400" />
                            </div>
                            <select v-model="selectedUser"
                                class="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 appearance-none cursor-pointer">
                                <option value="">All Users</option>
                                <option v-for="user in availableUsers" :key="user" :value="user">
                                    {{ user }}
                                </option>
                            </select>
                          
                        </div>
                    </div>

                    <!-- Results Per Page Section -->
                    <div class="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                        <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Show:</span>
                        <div class="relative">
                            <select v-model="perPage"
                                class="pr-8 pl-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer min-w-[4rem]">
                                <option :value="10">10</option>
                                <option :value="20">20</option>
                                <option :value="50">50</option>
                                <option :value="100">100</option>
                                <option :value="0">All</option>
                            </select>
                            <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                <Icon icon="heroicons:chevron-down" class="h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Active Filters Display -->
                <div v-if="searchQuery || selectedUser"
                    class="flex flex-wrap items-center gap-2 mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <span class="text-sm font-medium text-blue-800">Active filters:</span>

                    <!-- Search Filter Tag -->
                    <div v-if="searchQuery"
                        class="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                        <Icon icon="heroicons:magnifying-glass" class="h-4 w-4" />
                        <span>"{{ searchQuery }}"</span>
                        <button @click="searchQuery = ''" class="hover:text-blue-600 transition-colors">
                            <Icon icon="heroicons:x-mark" class="h-4 w-4" />
                        </button>
                    </div>

                    <!-- User Filter Tag -->
                    <div v-if="selectedUser"
                        class="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                        <Icon icon="heroicons:users" class="h-4 w-4" />
                        <span>{{ selectedUser }}</span>
                        <button @click="selectedUser = ''" class="hover:text-blue-600 transition-colors">
                            <Icon icon="heroicons:x-mark" class="h-4 w-4" />
                        </button>
                    </div>

                    <!-- Clear All Button -->
                    <button @click="searchQuery = ''; selectedUser = ''"
                        class="ml-2 px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                        Clear all
                    </button>
                </div>

                <div v-if="filteredClients.length === 0" class="text-center py-12">
                    <div class="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon icon="heroicons:users" class="h-12 w-12 text-gray-400" />
                    </div>
                    <h4 class="text-lg font-medium text-gray-900 mb-2">No matching clients</h4>
                    <p class="text-gray-600 mb-6">Try adjusting your search or filters</p>
                </div>

                <div v-else class="overflow-hidden rounded-2xl border border-gray-200">
                    <div v-for="group in groupedClients" :key="group.name" class="mb-8">
                        <div class="flex items-center mb-4 space-x-4 px-6 pt-6">
                            <img v-if="group.avatar" :src="useImg(group.avatar)"
                                class="w-10 h-10 rounded-full border-2 border-blue-500" />
                            <div class="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center" v-else>
                                <Icon icon="heroicons:user" class="h-6 w-6 text-blue-600" />
                            </div>
                            <h2 class="text-lg font-semibold text-gray-800">
                                {{ group.name }}
                                <span class="text-sm text-gray-500">
                                    ({{ group.clients.length }} clients)
                                </span>
                            </h2>
                        </div>
                        <div class="overflow-x-auto rounded-xl border border-gray-200 mx-6 mb-6">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Business</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Industry</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Contact</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Main Incharge</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Task</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Social</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="client in group.clients" :key="client.id"
                                        class="hover:bg-gray-50 transition-colors">
                                        <td class="px-6 py-4">
                                            <div class="font-medium text-gray-900">{{ client.business_name }}</div>
                                            <div v-if="client.contact_person" class="text-sm text-gray-600">{{
                                                client.contact_person }}</div>
                                        </td>
                                        <td class="px-6 py-4">{{ client.industry }}</td>
                                        <td class="px-6 py-4">
                                            <div v-if="client.contact" class="flex items-center">
                                                <Icon icon="heroicons:phone" class="h-4 w-4 mr-2 text-gray-400" />
                                                {{ client.contact }}
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 flex items-center gap-x-1">
                                            <img v-if="client.user_created.avatar"
                                                :src="useImg(client.user_created.avatar)" class="w-8 h-8 rounded-full"
                                                alt="">
                                            <div v-else
                                                class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                <Icon icon="heroicons:user" class="h-4 w-4 text-gray-500" />
                                            </div>
                                            <span class="ml-2">{{ client.user_created.first_name }} {{
                                                client.user_created.last_name }}</span>
                                        </td>
                                        <td class="px-6 py-4">{{ client.task || '—' }}</td>
                                        <td class="px-6 py-4">
                                            <div class="flex items-center space-x-3">
                                                <a v-if="client.telegram_contact"
                                                    :href="`https://t.me/${client.telegram_contact.replace('@', '')}`"
                                                    target="_blank" class="text-blue-600 hover:text-blue-800">
                                                    <Icon icon="simple-icons:telegram" class="h-5 w-5" />
                                                </a>
                                                <a v-if="client.facebook_link" :href="client.facebook_link"
                                                    target="_blank" class="text-blue-600 hover:text-blue-800">
                                                    <Icon icon="simple-icons:facebook" class="h-5 w-5" />
                                                </a>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="flex items-center space-x-3">
                                                <button @click="openClientModal(client)"
                                                    class="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors">
                                                    <Icon icon="heroicons:eye" class="h-4 w-4 mr-1" />
                                                    View
                                                </button>
                                                <button @click="deleteClient(client.id!)"
                                                    class="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors">
                                                    <Icon icon="heroicons:trash" class="h-4 w-4 mr-1" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Pagination Controls -->
                    <div v-if="perPage !== 0 && totalPages > 1"
                        class="flex justify-center items-center gap-2 py-6 bg-white border-t border-gray-200">
                        <button
                            class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="currentPage === 1" @click="currentPage--">
                            Prev
                        </button>

                        <button v-for="page in totalPages" :key="page" @click="currentPage = page"
                            class="px-4 py-2 rounded transition-colors" :class="{
                                'bg-blue-600 text-white': currentPage === page,
                                'bg-gray-100 hover:bg-gray-200': currentPage !== page
                            }">
                            {{ page }}
                        </button>

                        <button
                            class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="currentPage === totalPages" @click="currentPage++">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>



        <!-- Client Detail Modal -->
        <TransitionRoot appear :show="isModalOpen" as="template">
            <Dialog as="div" @close="closeModal" class="relative z-50">
                <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0"
                    enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4">
                        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100" leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                            <DialogPanel
                                class="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all">
                                <div class="flex items-center justify-between mb-6">
                                    <DialogTitle class="text-2xl font-bold text-gray-900">
                                        {{ isEditing ? 'Edit Client' : 'Client Details' }}
                                    </DialogTitle>

                                    <button @click="closeModal"
                                        class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                                        <Icon icon="heroicons:x-mark" class="h-6 w-6" />
                                    </button>
                                </div>

                                <div class="space-y-6">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <!-- Business Info -->
                                        <div
                                            class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                                            <h4 class="font-semibold text-blue-900 mb-4 flex items-center">
                                                <Icon icon="heroicons:building-office" class="h-5 w-5 mr-2" />
                                                Business Information
                                            </h4>
                                            <div class="space-y-3 text-sm">
                                                <div>
                                                    <span class="font-medium text-gray-700">Business Name:</span>
                                                    <div class="mt-1">
                                                        <p v-if="!isEditing" class="text-gray-900">{{
                                                            selectedClient?.business_name }}</p>
                                                        <input v-else v-model="selectedClient!.business_name"
                                                            class="input-modern" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <span class="font-medium text-gray-700">Industry:</span>
                                                    <div class="mt-1">
                                                        <p v-if="!isEditing" class="text-gray-900">{{
                                                            selectedClient?.industry }}</p>
                                                        <input v-else v-model="selectedClient!.industry"
                                                            class="input-modern" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <span class="font-medium text-gray-700">Current Task:</span>
                                                    <div class="mt-1">
                                                        <p v-if="!isEditing" class="text-gray-900">{{
                                                            selectedClient?.task || '—' }}</p>
                                                        <input v-else v-model="selectedClient!.task"
                                                            class="input-modern" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Contact Info -->
                                        <div
                                            class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                                            <h4 class="font-semibold text-green-900 mb-4 flex items-center">
                                                <Icon icon="heroicons:user" class="h-5 w-5 mr-2" />
                                                Contact Information
                                            </h4>
                                            <div class="space-y-3 text-sm">
                                                <div>
                                                    <span class="font-medium text-gray-700">Contact Person:</span>
                                                    <div class="mt-1">
                                                        <p v-if="!isEditing" class="text-gray-900">{{
                                                            selectedClient?.contact_person || '—' }}</p>
                                                        <input v-else v-model="selectedClient!.contact_person"
                                                            class="input-modern" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <span class="font-medium text-gray-700">Phone:</span>
                                                    <div class="mt-1 flex items-center space-x-2">
                                                        <Icon icon="heroicons:phone" class="h-4 w-4 text-gray-400" />
                                                        <span v-if="!isEditing">{{ selectedClient?.contact || '—'
                                                            }}</span>
                                                        <input v-else v-model="selectedClient!.contact"
                                                            class="input-modern" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <span class="font-medium text-gray-700">Last Contact:</span>
                                                    <div class="mt-1">
                                                        <p v-if="!isEditing">{{
                                                            formatDate(selectedClient?.date_of_last_contact || '') }}
                                                        </p>
                                                        <input v-else type="date"
                                                            v-model="selectedClient!.date_of_last_contact"
                                                            class="input-modern" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Social -->
                                        <div
                                            class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 md:col-span-2">
                                            <h4 class="font-semibold text-purple-900 mb-4 flex items-center">
                                                <Icon icon="heroicons:globe-alt" class="h-5 w-5 mr-2" />
                                                Social & Communication
                                            </h4>
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span class="font-medium text-gray-700">Telegram:</span>
                                                    <div class="mt-1">
                                                        <div v-if="!isEditing" class="flex items-center">
                                                            <Icon icon="simple-icons:telegram"
                                                                class="h-4 w-4 mr-2 text-blue-500" />
                                                            <a v-if="selectedClient?.telegram_contact"
                                                                :href="`https://t.me/${selectedClient.telegram_contact.replace('@', '')}`"
                                                                target="_blank" class="text-blue-600 hover:underline">
                                                                {{ selectedClient.telegram_contact }}
                                                            </a>
                                                            <span v-else class="text-gray-500">—</span>
                                                        </div>
                                                        <input v-else v-model="selectedClient!.telegram_contact"
                                                            class="input-modern" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <span class="font-medium text-gray-700">Facebook:</span>
                                                    <div class="mt-1">
                                                        <div v-if="!isEditing" class="flex items-center">
                                                            <Icon icon="simple-icons:facebook"
                                                                class="h-4 w-4 mr-2 text-blue-600" />
                                                            <a v-if="selectedClient?.facebook_link"
                                                                :href="selectedClient.facebook_link" target="_blank"
                                                                class="text-blue-600 hover:underline truncate">
                                                                View Profile
                                                            </a>
                                                            <span v-else class="text-gray-500">—</span>
                                                        </div>
                                                        <input v-else v-model="selectedClient!.facebook_link"
                                                            class="input-modern" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Notes -->
                                        <div
                                            class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 md:col-span-2">
                                            <h4 class="font-semibold text-yellow-900 mb-4 flex items-center">
                                                <Icon icon="heroicons:chat-bubble-left-ellipsis" class="h-5 w-5 mr-2" />
                                                Notes & Remarks
                                            </h4>
                                            <div class="text-sm">
                                                <p v-if="!isEditing" class="text-gray-900 leading-relaxed">{{
                                                    selectedClient?.remark || '—' }}</p>
                                                <textarea v-else v-model="selectedClient!.remark"
                                                    class="input-modern w-full h-24 resize-none"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div class="mt-8 flex justify-end space-x-4">
                                    <button @click="closeModal"
                                        class="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">
                                        Close
                                    </button>
                                    <button @click="editClient(selectedClient)"
                                        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                                        <Icon icon="heroicons:pencil" class="h-4 w-4 mr-2 inline" />
                                        Edit Client
                                    </button>
                                    <button v-if="isEditing" @click="saveClientEdits"
                                        class="px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition">
                                        Save Changes
                                    </button>

                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { Icon } from '@iconify/vue';
import { useApi } from '~/composables/useApi';
import { useExcelImport, type ImportResult } from '~/composables/useExcelImport';
import type { IResponse } from '~/types/api';
const isImportModalOpen = ref(false)
const openImportModal = () => (isImportModalOpen.value = true)
const closeImportModal = () => (isImportModalOpen.value = false)
// Define selectedClient with proper typing

definePageMeta({
    middleware: 'auth',
});

// Composable
const { importing, progress, importFromExcel, batchImportFromExcel } = useExcelImport();

// Reactive state
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const importResult = ref<ImportResult | null>(null);
const useBatchImport = ref(true);
const batchSize = ref(50);

// Client management
interface Client {
    id?: string;
    business_name: string;
    industry: string;
    contact_person?: string;
    contact?: string;
    telegram_contact?: string;
    facebook_link?: string;
    remark?: string;
    task?: string;
    date_of_last_contact?: string;
    user_created?: {
        first_name: string;
        last_name: string;
    };
}

const clients = ref<Client[]>([]);
const newClient = ref<Client>({
    business_name: '',
    industry: ''
});

// Modal state
const isModalOpen = ref(false);
const selectedClient = ref<Client | null>(null);
const hasSelectedClient = computed(() => selectedClient.value !== null)

// Methods
const triggerFileInput = () => {
    fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0];
        importResult.value = null;
    }
};

const handleFileDrop = (event: DragEvent) => {
    isDragOver.value = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
        selectedFile.value = event.dataTransfer.files[0];
        importResult.value = null;
    }
};

const removeFile = () => {
    selectedFile.value = null;
    importResult.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return dateString;
    }
};

const startImport = async () => {
    if (!selectedFile.value) return;

    try {
        if (useBatchImport.value) {
            importResult.value = await batchImportFromExcel(selectedFile.value, batchSize.value);
        } else {
            importResult.value = await importFromExcel(selectedFile.value);
        }

        // Refresh client list after import
        if (importResult.value?.success) {
            await loadClients();
        }
    } catch (error) {
        console.error('Import failed:', error);
        importResult.value = {
            success: false,
            totalRecords: 0,
            successfulImports: 0,
            failedImports: 0,
            errors: [{ row: 0, error: 'Import failed: ' + (error as Error).message }]
        };
    }
};

// =====
// Reactive variables
const searchQuery = ref('');
const perPage = ref(10);
const currentPage = ref(1);
const selectedUser = ref(''); // Add user filter

// Filter clients based on search query and selected user
const filteredClients = computed(() => {
    let filtered = clients.value;

    // Filter by search query
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        filtered = filtered.filter(client =>
            client.business_name.toLowerCase().includes(q) ||
            client.industry.toLowerCase().includes(q) ||
            (client.contact_person || '').toLowerCase().includes(q) ||
            (client.contact || '').toLowerCase().includes(q)
        );
    }

    // Filter by selected user
    if (selectedUser.value) {
        filtered = filtered.filter(client => {
            const user = client.user_created;
            const userName = user ? `${user.first_name} ${user.last_name}` : 'Unknown';
            return userName === selectedUser.value;
        });
    }

    return filtered;
});

// Get paginated clients (apply pagination to filtered results)
const paginatedClients = computed(() => {
    if (perPage.value === 0) return filteredClients.value; // show all
    const start = (currentPage.value - 1) * perPage.value;
    return filteredClients.value.slice(start, start + perPage.value);
});

// Group the PAGINATED clients (not all filtered clients)
const groupedClients = computed(() => {
    const groups: Record<string, { name: string; avatar?: string; clients: Client[] }> = {};

    for (const client of paginatedClients.value) {
        const user = client.user_created;
        const key = user ? `${user.first_name} ${user.last_name}` : 'Unknown';

        if (!groups[key]) {
            groups[key] = {
                name: key,
                avatar: user?.avatar,
                clients: []
            };
        }

        groups[key].clients.push(client);
    }

    return Object.values(groups);
});

// Get total pages based on filtered results
const totalPages = computed(() => {
    return perPage.value === 0 ? 1 : Math.ceil(filteredClients.value.length / perPage.value);
});

// Get unique users for the filter dropdown
const availableUsers = computed(() => {
    const users = new Set<string>();
    clients.value.forEach(client => {
        const user = client.user_created;
        const userName = user ? `${user.first_name} ${user.last_name}` : 'Unknown';
        users.add(userName);
    });
    return Array.from(users).sort();
});

// Watch for filter changes and reset to first page
watch([searchQuery, selectedUser, perPage], () => {
    currentPage.value = 1;
});

// Load clients function with proper pagination
const loading = ref(false);
const loadClients = async () => {
    loading.value = true; // Add loading state if you have it
    try {
        let allClients: Client[] = [];
        let offset = 0;
        const limit = 100;
        let hasMore = true;

        console.log('Starting to fetch clients...');

        // Keep fetching until we get all records
        while (hasMore) {
            console.log(`Fetching clients batch: offset=${offset}, limit=${limit}`);
            
            const response = await useApi<IResponse<Client[]>>(`/items/bm_client?fields=*,user_created.first_name,user_created.last_name,user_created.avatar,user_created.id&filter[status]=published&limit=${limit}&offset=${offset}`, {
                method: 'GET'
            });

            const fetchedData = response.data || [];
            console.log(`Received ${fetchedData.length} clients in this batch`);
            
            allClients = [...allClients, ...fetchedData];

            // Check if we need to fetch more
            hasMore = fetchedData.length === limit;
            offset += limit;

            console.log(`Total clients so far: ${allClients.length}, hasMore: ${hasMore}`);

            // Optional: Add a small delay to prevent overwhelming the server
            if (hasMore) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        console.log(`Finished fetching all ${allClients.length} clients`);
        clients.value = allClients;

    } catch (err) {
        console.error('Failed to load clients:', err);
        showNotification('Failed to load client data', 'error');
    } finally {
        loading.value = false; // Add loading state if you have it
    }
};

const addClient = async () => {
    try {
        const res = await useApi<IResponse<Client>>('/items/bm_client', {
            method: 'POST',
            data: newClient.value
        });
        clients.value.push(res.data);
        newClient.value = {
            business_name: '',
            industry: ''
        };

        // Show success notification
        showNotification('Client added successfully!', 'success');
    } catch (err) {
        console.error('Add failed:', err);
        showNotification('Failed to add client. Please try again.', 'error');
    }
};
const saveClientEdits = async () => {
    if (!selectedClient.value?.id) return;

    try {
        const res = await useApi<IResponse<Client>>(`/items/bm_client/${selectedClient.value.id}`, {
            method: 'PATCH',
            data: selectedClient.value
        });

        const idx = clients.value.findIndex(c => c.id === res.data.id);
        if (idx !== -1) clients.value[idx] = res.data;

        showNotification('Client updated successfully!', 'success');
        isEditing.value = false;
        closeModal();
    } catch (err) {
        showNotification('Failed to update client', 'error');
        console.error(err);
    }
};

const deleteClient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) return;

    try {
        await useApi<null>(`/items/bm_client/${id}`, {
            method: 'DELETE'
        });
        clients.value = clients.value.filter(c => c.id !== id);
        showNotification('Client deleted successfully!', 'success');
    } catch (err) {
        console.error('Delete failed:', err);
        showNotification('Failed to delete client. Please try again.', 'error');
    }
};

const openClientModal = (client: Client) => {
    console.log('Opening modal with client:', client); // ADD THIS
    selectedClient.value = client;
    isModalOpen.value = true;
};


const closeModal = () => {
    isModalOpen.value = false;
    selectedClient.value = null;
    isEditing.value = false; // <- Reset edit state
};

const isEditing = ref(false);

const editClient = (client: Client | null) => {
    if (client) {
        isEditing.value = true;
    }
};


// Simple notification system (you can replace with your preferred notification library)
const showNotification = (message: string, type: 'success' | 'error') => {
    // This is a placeholder - implement with your preferred notification system
    // For example, using vue3-toastify or similar
    console.log(`${type.toUpperCase()}: ${message}`);
};

// Initialize on component mount
onMounted(() => {
    loadClients();
});
</script>

<style scoped>
.input-modern {
    @apply w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200;
}

.input-modern:focus {
    @apply transform scale-[1.02];
}

/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    @apply bg-gray-100 rounded-full;
}

::-webkit-scrollbar-thumb {
    @apply bg-gray-400 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-500;
}

/* Smooth transitions for all interactive elements */
* {
    transition: all 0.2s ease-in-out;
}

/* Glass morphism effect for cards */
.glass-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Hover animations for cards */
.hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Gradient text effect */
.gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Animation for file upload area */
@keyframes pulse-border {

    0%,
    100% {
        border-color: rgb(209, 213, 219);
    }

    50% {
        border-color: rgb(59, 130, 246);
    }
}

.animate-pulse-border {
    animation: pulse-border 2s ease-in-out infinite;
}

/* Custom focus states */
.focus-visible:focus-visible {
    outline: 2px solid rgb(59, 130, 246);
    outline-offset: 2px;
}

/* Loading animation */
@keyframes shimmer {
    0% {
        background-position: -200px 0;
    }

    100% {
        background-position: calc(200px + 100%) 0;
    }
}

.shimmer {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200px 100%;
    animation: shimmer 1.5s infinite;
}
</style>