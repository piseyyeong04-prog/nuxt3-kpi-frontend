<template>
  <div class="bg-white dark:bg-gray-900 p-4 md:p-6 m-8 rounded-3xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Icon icon="mdi:megaphone" class="text-red-500 text-3xl" />
          PR Tracking
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Create, view, update and remove PR records</p>
      </div>
      <div class="flex gap-2">
        <button @click="loadData" class="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <Icon icon="mdi:refresh" :class="{'animate-spin': isLoading}" /> Refresh
        </button>
        <button v-if="isAdminOrSale" @click="openCreate" class="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition">
          <Icon icon="mdi:plus" /> New PR
        </button>
      </div>
    </div>

    <!-- Alert Banner -->
    <div v-if="nearlyDeadlineCount > 0" class="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl flex items-center gap-3 animate-pulse">
      <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
        <Icon icon="mdi:alert-decagram" class="text-2xl" />
      </div>
      <div>
        <h4 class="font-bold text-red-800 dark:text-red-300 text-sm">គម្រោងជិតដល់ថ្ងៃកំណត់! (Nearly Deadline Alerts)</h4>
        <p class="text-xs text-red-600 dark:text-red-400">There are {{ nearlyDeadlineCount }} project(s) close to or past their deadline. Please check the highlighted records below.</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div v-for="s in stats" :key="s.label" class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-3">
        <div :class="s.bg" class="w-10 h-10 rounded-lg flex items-center justify-center">
          <Icon :icon="s.icon" :class="s.color" class="text-xl" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ s.value }}</p>
          <p class="text-xs text-gray-500">{{ s.label }}</p>
        </div>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4 flex flex-col md:flex-row gap-3">
      <div class="relative flex-1">
        <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input v-model="search" placeholder="Search title, client, creator…" class="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400" />
      </div>
      <select v-model="filterStatus" class="py-2 px-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none">
        <option value="">All Statuses</option>
        <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="font-semibold text-gray-900 dark:text-white">Records <span v-if="filtered.length" class="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{{ filtered.length }}</span></h2>
      </div>
      <div v-if="isLoading" class="flex justify-center py-16"><Icon icon="mdi:loading" class="text-4xl text-red-500 animate-spin" /></div>
      <div v-else-if="!filtered.length" class="py-16 text-center text-gray-400">
        <Icon icon="mdi:inbox-outline" class="text-5xl mx-auto mb-2" />
        <p>No records found</p>
        <button @click="openCreate" class="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition">Create first record</button>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700 text-left">
              <th class="py-3 px-4 text-gray-500 font-semibold">#</th>
              <th class="py-3 px-4 text-gray-500 font-semibold">Title / Client</th>
              <th class="py-3 px-4 text-gray-500 font-semibold hidden md:table-cell">Creator / Writer</th>
              <th class="py-3 px-4 text-gray-500 font-semibold hidden md:table-cell">Editor</th>
              <th class="py-3 px-4 text-gray-500 font-semibold hidden lg:table-cell">Period</th>
              <th class="py-3 px-4 text-gray-500 font-semibold">Status</th>
              <th class="py-3 px-4 text-gray-500 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in paginated" :key="r.id"
              :class="[
                'border-b border-gray-50 dark:border-gray-800 transition',
                isNearlyDeadline(r)
                  ? 'bg-red-50/40 dark:bg-red-950/10 hover:bg-red-100/40 dark:hover:bg-red-950/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              ]"
            >
              <td :class="['py-3 px-4 text-gray-400', isNearlyDeadline(r) ? 'border-l-4 border-l-red-500 font-bold text-red-500' : '']">
                {{ (page-1)*pageSize+i+1 }}
              </td>
              <td class="py-3 px-4">
                <p :class="['font-medium', isNearlyDeadline(r) ? 'text-red-700 dark:text-red-400 font-bold' : 'text-gray-900 dark:text-white']">{{ r.title }}</p>
                <p class="text-xs text-gray-400">{{ r.client }}</p>
              </td>
              <td class="py-3 px-4 hidden md:table-cell text-gray-600 dark:text-gray-300">
                <span v-if="r.creator_or_writer">
                  {{ fullName(r.creator_or_writer) }}
                  <span class="ml-1 text-xs text-gray-400">({{ roleLabel((r.creator_or_writer as any)?.role) }})</span>
                </span>
                <span v-else class="text-gray-400">—</span>
              </td>
              <td class="py-3 px-4 hidden md:table-cell text-gray-600 dark:text-gray-300">{{ fullName(r.editor) }}</td>
              <td class="py-3 px-4 hidden lg:table-cell text-xs text-gray-400">
                <span v-if="r.start_pr">{{ fmtDate(r.start_pr) }}</span>
                <span v-if="r.start_pr && r.deadline_pr"> → </span>
                <span v-if="r.deadline_pr" :class="isNearlyDeadline(r) ? 'text-red-600 dark:text-red-400 font-bold inline-flex items-center gap-1 mt-0.5' : ''">
                  <Icon v-if="isNearlyDeadline(r)" icon="mdi:alert-circle" class="text-red-500 text-sm animate-pulse" />
                  {{ fmtDate(r.deadline_pr) }}
                </span>
                <span v-if="!r.start_pr && !r.deadline_pr">—</span>
              </td>
              <td class="py-3 px-4">
                <span :class="statusCls(r.status)" class="px-2 py-0.5 rounded-full text-xs font-medium">{{ r.status }}</span>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex justify-end gap-1">
                  <button @click="openView(r)" class="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition" title="View"><Icon icon="mdi:eye" /></button>
                  <button @click="openEdit(r)" class="p-1.5 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition" title="Edit"><Icon icon="mdi:pencil" /></button>
                  <button @click="askDelete(r)" v-if="isAdminOrSale" class="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Delete"><Icon icon="mdi:trash-can" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-between p-4 border-t border-gray-100 dark:border-gray-700">
          <p class="text-xs text-gray-500">{{ (page-1)*pageSize+1 }}–{{ Math.min(page*pageSize, filtered.length) }} of {{ filtered.length }}</p>
          <div class="flex gap-1">
            <button @click="page--" :disabled="page===1" class="px-3 py-1 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 transition">‹</button>
            <button @click="page++" :disabled="page===totalPages" class="px-3 py-1 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 transition">›</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── CREATE / EDIT MODAL ── -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <!-- Fixed Header -->
        <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Icon :icon="editing ? 'mdi:pencil' : 'mdi:plus-circle'" class="text-red-500 text-xl" />
          </div>
          <div>
            <h3 class="font-bold text-gray-900 dark:text-white">{{ editing ? 'Edit PR Record' : 'New PR Record' }}</h3>
            <p class="text-xs text-gray-500">{{ editing ? 'Update the details below' : 'Fill in to create a new record' }}</p>
          </div>
          <button @click="showForm=false" class="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><Icon icon="mdi:close" class="text-xl" /></button>
        </div>
        <!-- Scrollable body -->
        <form id="pr-form" @submit.prevent="submitForm" class="overflow-y-auto flex-1 p-5 space-y-4">
          <!-- Project Info -->
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
              <Icon icon="mdi:file-document" class="text-blue-500" />
              <span class="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Project Info</span>
            </div>
            <div class="p-4 space-y-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Title <span class="text-red-500">*</span></label>
                <input v-model="form.title" required :disabled="isLimitedRole" :class="['w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400', isLimitedRole ? disabledCls : 'bg-white dark:bg-gray-700']" placeholder="PR project title" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Client <span class="text-red-500">*</span></label>
                  <input v-model="form.client" required :disabled="isLimitedRole" :class="['w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400', isLimitedRole ? disabledCls : 'bg-white dark:bg-gray-700']" placeholder="Client name" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Status <span class="text-red-500">*</span></label>
                  <select v-model="form.status" required class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400">
                    <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <!-- Team -->
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800">
              <Icon icon="mdi:account-group" class="text-purple-500" />
              <span class="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">Team</span>
            </div>
            <div class="p-4 grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Creator / Writer</label>
                <select v-model="form.creator_or_writer" :disabled="isLimitedRole" :class="['w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400', isLimitedRole ? disabledCls : 'bg-white dark:bg-gray-700']">
                  <option value="">— None —</option>
                  <option v-for="u in creatorList" :key="u.id" :value="u.id">{{ fullName(u) }} ({{ roleLabel(u.role) }})</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Editor</label>
                <!-- Read-only display for Creator / Writer — they can't change the editor -->
                <div v-if="isLimitedRole" :class="['w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm', disabledCls]">
                  <span v-if="form.editor">{{ fullName(editorList.find(u => u.id === form.editor)) || '—' }} <span class="text-gray-400">(Editor)</span></span>
                  <span v-else class="text-gray-400">— None —</span>
                </div>
                <!-- Full select for Admin / Sales / Editor -->
                <select
                  v-else
                  v-model="form.editor"
                  :disabled="isWriterSelected"
                  :class="['w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition', isWriterSelected ? disabledCls : 'bg-white dark:bg-gray-700']"
                >
                  <option value="">{{ isWriterSelected ? 'N/A — Writer selected' : '— None —' }}</option>
                  <option v-for="u in editorList" :key="u.id" :value="u.id">{{ fullName(u) }} (Editor)</option>
                </select>
              </div>
            </div>
          </div>
          <!-- Timeline -->
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-900/20 border-b border-teal-100 dark:border-teal-800">
              <Icon icon="mdi:calendar-range" class="text-teal-500" />
              <span class="text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wide">Timeline</span>
            </div>
            <div class="p-4 grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                <input v-model="form.start_pr" type="date" :disabled="isLimitedRole" :class="['w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400', isLimitedRole ? disabledCls : 'bg-white dark:bg-gray-700']" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                <input v-model="form.deadline_pr" type="date" :disabled="isLimitedRole" :class="['w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400', isLimitedRole ? disabledCls : 'bg-white dark:bg-gray-700']" />
              </div>
            </div>
          </div>
          <!-- Description -->
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800">
              <Icon icon="mdi:text-box" class="text-amber-500" />
              <span class="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide">Details</span>
            </div>
            <div class="p-4 space-y-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea v-model="form.description" rows="3" :disabled="isLimitedRole" :class="['w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none', isLimitedRole ? disabledCls : 'bg-white dark:bg-gray-700']" placeholder="Project description or notes…"></textarea>
              </div>
              <!-- File upload -->
              <div class="relative">
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Attach Document</label>
                <label
                  for="file-upload"
                  class="relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer transition overflow-hidden"
                  :class="[
                    pickedFile || form.attach_document ? 'border-transparent' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/40 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 h-28',
                  ]"
                >
                  <!-- ✕ remove button top-right -->
                  <button
                    v-if="pickedFile || form.attach_document"
                    type="button"
                    class="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md transition"
                    @click.stop.prevent="pickedFile ? (pickedFile=null, pickedPreviewUrl='') : (form.attach_document='')"
                    title="Remove"
                  >
                    <Icon icon="mdi:close" class="text-sm" />
                  </button>

                  <!-- Picked image preview -->
                  <template v-if="pickedFile && pickedPreviewUrl">
                    <img :src="pickedPreviewUrl" class="w-full max-h-56 object-cover rounded-xl" />
                    <div class="absolute inset-0 bg-black/0 hover:bg-black/20 transition rounded-xl flex items-end pointer-events-none">
                      <div class="w-full bg-black/50 px-3 py-2 rounded-b-xl">
                        <p class="text-xs font-medium text-white truncate">{{ pickedFile.name }}</p>
                        <p class="text-xs text-gray-300">{{ (pickedFile.size/1024).toFixed(1) }} KB · click to change</p>
                      </div>
                    </div>
                  </template>
                  <!-- Picked non-image file -->
                  <template v-else-if="pickedFile">
                    <div class="flex items-center gap-3 w-full px-4 py-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-300">
                      <Icon icon="mdi:file-check" class="text-4xl text-green-500 flex-shrink-0" />
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-green-700 dark:text-green-300 truncate">{{ pickedFile.name }}</p>
                        <p class="text-xs text-gray-400">{{ (pickedFile.size/1024).toFixed(1) }} KB · click to change</p>
                      </div>
                    </div>
                  </template>
                  <!-- Existing Directus image -->
                  <template v-else-if="form.attach_document && isImage(form.attach_document)">
                    <img :src="`http://46.250.231.152:8056/assets/${form.attach_document}`" class="w-full max-h-56 object-cover rounded-xl" />
                    <div class="absolute inset-0 bg-black/0 hover:bg-black/20 transition rounded-xl flex items-end pointer-events-none">
                      <div class="w-full bg-black/50 px-3 py-2 rounded-b-xl">
                        <p class="text-xs text-gray-200">Existing image · click to replace</p>
                      </div>
                    </div>
                  </template>
                  <!-- Existing non-image Directus file -->
                  <template v-else-if="form.attach_document">
                    <div class="flex items-center gap-3 w-full px-4 py-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                      <Icon icon="mdi:file-document" class="text-4xl text-blue-400 flex-shrink-0" />
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-semibold text-blue-700 dark:text-blue-300">File attached</p>
                        <a :href="`http://46.250.231.152:8056/assets/${form.attach_document}`" target="_blank" @click.stop class="text-xs text-blue-500 hover:underline">View file ↗</a>
                        <p class="text-xs text-gray-400 mt-0.5">Click area to replace</p>
                      </div>
                    </div>
                  </template>
                  <!-- Empty -->
                  <template v-else>
                    <Icon icon="mdi:cloud-upload" class="text-3xl text-gray-400 mx-auto mb-1" />
                    <p class="text-xs text-gray-500">Click to upload a file</p>
                    <p class="text-xs text-gray-400">Images, PDF, DOCX, etc.</p>
                  </template>
                  <input id="file-upload" type="file" class="hidden" @change="onFilePick" />
                </label>
              </div>

            </div>
          </div>

          <!-- Editing Process Images (Visible only when Status is 'Editing') -->
          <div v-if="form.status === 'Editing'" class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800">
              <Icon icon="mdi:image-multiple" class="text-purple-500" />
              <span class="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">Editing Process Photos</span>
            </div>
            <div class="p-4 space-y-4">
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div v-for="(img, idx) in editingFiles" :key="idx" class="relative group aspect-square border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                  <img v-if="img.previewUrl" :src="img.previewUrl" class="w-full h-full object-cover" />
                  <div v-else class="flex flex-col items-center text-gray-400">
                    <Icon icon="mdi:file-document" class="text-3xl" />
                    <span class="text-[10px] truncate max-w-full px-1">{{ img.file?.name }}</span>
                  </div>
                  <!-- Delete button -->
                  <button
                    type="button"
                    class="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md transition opacity-0 group-hover:opacity-100"
                    @click="removeMultiFile(idx)"
                  >
                    <Icon icon="mdi:close" class="text-xs" />
                  </button>
                </div>
                <!-- Uploader dropzone -->
                <label
                  for="multi-file-upload"
                  class="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 dark:hover:bg-purple-900/10 transition"
                >
                  <Icon icon="mdi:camera-plus" class="text-2xl text-gray-400 mb-1" />
                  <span class="text-[10px] text-gray-500 font-semibold">Upload Photo</span>
                  <input id="multi-file-upload" type="file" multiple class="hidden" @change="onMultiFilePick" accept="image/*" />
                </label>
              </div>
            </div>
          </div>

          <!-- Project Links (Production Link & Checking Link - Editable by Editor/Creator/Admin) -->
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800">
              <Icon icon="mdi:link-variant" class="text-indigo-500" />
              <span class="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">Project Links</span>
            </div>
            <div class="p-4 space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Production Link</label>
                  <input v-model="form.production_link" type="url" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="https://..." />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Checking Link</label>
                  <input v-model="form.checking_link" type="url" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="https://..." />
                </div>
              </div>
            </div>
          </div>

          <!-- Management Process Guidance Comments (Only Admin role 3a5cb98e-02f8-4f09-afd9-dcd43288c756 can edit) -->
          <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 border-b border-rose-100 dark:border-rose-800">
              <Icon icon="mdi:comment-text-multiple" class="text-rose-500" />
              <span class="text-xs font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wide">Process Guidance Comments</span>
            </div>
            <div class="p-4 space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Plan Process Guidance</label>
                  <textarea v-model="form.comment_plan" :disabled="!isAdmin" rows="2" :class="['w-full px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none', !isAdmin ? disabledCls : 'bg-white dark:bg-gray-700']" placeholder="Admin guidance for Plan process..."></textarea>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Processing Guidance</label>
                  <textarea v-model="form.comment_processing" :disabled="!isAdmin" rows="2" :class="['w-full px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none', !isAdmin ? disabledCls : 'bg-white dark:bg-gray-700']" placeholder="Admin guidance for Processing..."></textarea>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Shooting / Writing Guidance</label>
                  <textarea v-model="form.comment_shooting" :disabled="!isAdmin" rows="2" :class="['w-full px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none', !isAdmin ? disabledCls : 'bg-white dark:bg-gray-700']" placeholder="Admin guidance for Shooting/Writing..."></textarea>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Editing Guidance</label>
                  <textarea v-model="form.comment_editing" :disabled="!isAdmin" rows="2" :class="['w-full px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none', !isAdmin ? disabledCls : 'bg-white dark:bg-gray-700']" placeholder="Admin guidance for Editing..."></textarea>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Checking Guidance</label>
                  <textarea v-model="form.comment_checking" :disabled="!isAdmin" rows="2" :class="['w-full px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none', !isAdmin ? disabledCls : 'bg-white dark:bg-gray-700']" placeholder="Admin guidance for Checking..."></textarea>
                </div>
              </div>
            </div>
          </div>
        </form>
        <!-- Fixed Footer -->
        <div class="flex items-center justify-between px-5 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl flex-shrink-0">
          <p class="text-xs text-gray-400"><Icon icon="mdi:information" class="inline" /> Fields marked <span class="text-red-500">*</span> are required</p>
          <div class="flex gap-2">
            <button type="button" @click="showForm=false" class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
            <button type="submit" form="pr-form" :disabled="isSaving" class="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm rounded-lg transition font-medium">
              <Icon :icon="isSaving ? 'mdi:loading' : (editing ? 'mdi:check' : 'mdi:plus')" :class="{'animate-spin': isSaving}" />
              {{ editing ? 'Save Changes' : 'Create Record' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── VIEW MODAL ── -->
    <div v-if="showView && viewRec" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div class="p-5 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between gap-4">
          <div>
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ viewRec.title }}</h3>
            <p class="text-sm text-gray-500">{{ viewRec.client }}</p>
          </div>
          <span :class="statusCls(viewRec.status)" class="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0">{{ viewRec.status }}</span>
        </div>
        <div class="p-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-xs text-gray-400 mb-1">Creator / Writer</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ fullName(viewRec.creator_or_writer) || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-1">Editor</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ fullName(viewRec.editor) || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-1">Start Date</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ viewRec.start_pr ? fmtDate(viewRec.start_pr) : '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-1">Deadline</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ viewRec.deadline_pr ? fmtDate(viewRec.deadline_pr) : '—' }}</p>
          </div>
          <div v-if="viewRec.description" class="col-span-2">
            <p class="text-xs text-gray-400 mb-1">Description</p>
            <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ viewRec.description }}</p>
          </div>
          <div v-if="viewRec.attach_document" class="col-span-2">
            <p class="text-xs text-gray-400 mb-1">Attached Document</p>
            <a :href="`http://46.250.231.152:8056/assets/${viewRec.attach_document}`" target="_blank" class="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              <Icon icon="mdi:file-download" /> Download / View File
            </a>
          </div>
          <!-- Process Images View Section -->
          <div v-if="viewRec.editing_process && viewRec.editing_process.length" class="col-span-2">
            <p class="text-xs text-gray-400 mb-1 font-semibold">Editing Process Images</p>
            <div class="grid grid-cols-3 gap-2 mt-1">
              <div v-for="item in viewRec.editing_process" :key="item.id || (typeof item.directus_files_id === 'object' ? item.directus_files_id?.id : item.directus_files_id)" class="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <a :href="`${useRuntimeConfig().public.API_BASE_URL || 'http://46.250.231.152:8056'}/assets/${typeof item.directus_files_id === 'object' ? item.directus_files_id?.id : item.directus_files_id}`" target="_blank">
                  <img :src="`${useRuntimeConfig().public.API_BASE_URL || 'http://46.250.231.152:8056'}/assets/${typeof item.directus_files_id === 'object' ? item.directus_files_id?.id : item.directus_files_id}`" class="w-full h-full object-cover hover:scale-105 transition duration-300" />
                </a>
              </div>
            </div>
          </div>
          <!-- Project Links View Section -->
          <div v-if="viewRec.production_link || viewRec.checking_link" class="col-span-2 grid grid-cols-2 gap-3 mt-2 border-t border-gray-100 dark:border-gray-700/50 pt-3">
            <div v-if="viewRec.production_link">
              <p class="text-xs text-gray-400 mb-1 font-semibold">Production Link</p>
              <a :href="viewRec.production_link" target="_blank" class="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                <Icon icon="mdi:launch" /> Go to Production ↗
              </a>
            </div>
            <div v-if="viewRec.checking_link">
              <p class="text-xs text-gray-400 mb-1 font-semibold">Checking Link</p>
              <a :href="viewRec.checking_link" target="_blank" class="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                <Icon icon="mdi:launch" /> Go to Checking ↗
              </a>
            </div>
          </div>
          <!-- Process Guidance Comments View (Visible to everyone if any exist) -->
          <div v-if="viewRec.comment_plan || viewRec.comment_processing || viewRec.comment_shooting || viewRec.comment_editing || viewRec.comment_checking" class="col-span-2 rounded-xl border border-rose-200 dark:border-rose-900/50 overflow-hidden mt-2">
            <div class="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 border-b border-rose-100 dark:border-rose-900">
              <Icon icon="mdi:comment-text-multiple" class="text-rose-500" />
              <span class="text-xs font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wide">Process Guidance Details</span>
            </div>
            <div class="p-4 space-y-3 text-xs">
              <div v-if="viewRec.comment_plan" class="border-b border-gray-100 dark:border-gray-700/50 pb-2">
                <p class="font-bold text-gray-700 dark:text-gray-300">Plan Comment:</p>
                <p class="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{{ viewRec.comment_plan }}</p>
              </div>
              <div v-if="viewRec.comment_processing" class="border-b border-gray-100 dark:border-gray-700/50 pb-2">
                <p class="font-bold text-gray-700 dark:text-gray-300">Processing Comment:</p>
                <p class="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{{ viewRec.comment_processing }}</p>
              </div>
              <div v-if="viewRec.comment_shooting" class="border-b border-gray-100 dark:border-gray-700/50 pb-2">
                <p class="font-bold text-gray-700 dark:text-gray-300">Shooting / Writing Comment:</p>
                <p class="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{{ viewRec.comment_shooting }}</p>
              </div>
              <div v-if="viewRec.comment_editing" class="border-b border-gray-100 dark:border-gray-700/50 pb-2">
                <p class="font-bold text-gray-700 dark:text-gray-300">Editing Comment:</p>
                <p class="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{{ viewRec.comment_editing }}</p>
              </div>
              <div v-if="viewRec.comment_checking">
                <p class="font-bold text-gray-700 dark:text-gray-300">Checking Comment:</p>
                <p class="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{{ viewRec.comment_checking }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button @click="showView=false" class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Close</button>
          <button @click="openEdit(viewRec); showView=false" class="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-lg transition"><Icon icon="mdi:pencil" /> Edit</button>
        </div>
      </div>
    </div>

    <!-- ── DELETE MODAL ── -->
    <div v-if="showDel" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <Icon icon="mdi:alert-circle" class="text-red-500 text-5xl mx-auto mb-4" />
        <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Delete Record?</h3>
        <p class="text-sm text-gray-500 mb-6">Are you sure you want to delete <strong class="text-gray-900 dark:text-white">{{ delTarget?.title }}</strong>? This cannot be undone.</p>
        <div class="flex gap-3 justify-center">
          <button @click="showDel=false" class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
          <button @click="doDelete" :disabled="isDeleting" class="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm rounded-lg transition">
            <Icon :icon="isDeleting ? 'mdi:loading' : 'mdi:trash-can'" :class="{'animate-spin': isDeleting}" /> Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Toast notifications -->
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      <div v-for="t in toasts" :key="t.id" :class="t.type === 'success' ? 'bg-green-600' : 'bg-red-600'" class="flex items-center gap-2 px-4 py-3 text-white text-sm rounded-xl shadow-lg">
        <Icon :icon="t.type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'" />
        {{ t.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { usePRTracking, type PRTrackingExpanded, type DirectusUser, CREATOR_ROLE_ID, WRITER_ROLE_ID, EDITOR_ROLE_ID, ADMIN_ROLE_ID } from '~/composables/usePRTracking'
import { useTelegramNotify } from '~/composables/useTelegramNotify'
import { useAuthStore } from '~/store/useAuthStore'

definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()
const { fetchAll, fetchCreatorsOrWriters, fetchEditors, create, update, remove, uploadFile } = usePRTracking()
const { notifyPR } = useTelegramNotify()

// toast
const toasts = ref<{id:number,type:string,message:string}[]>([])
let tid = 0
const toast = (message: string, type = 'success') => {
  const id = ++tid
  toasts.value.push({ id, type, message })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3500)
}

// state
const records    = ref<PRTrackingExpanded[]>([])
const creatorList = ref<DirectusUser[]>([])
const editorList  = ref<DirectusUser[]>([])
const isLoading  = ref(false)
const isSaving   = ref(false)
const isDeleting = ref(false)
const showForm   = ref(false)
const showView   = ref(false)
const showDel    = ref(false)
const editing    = ref(false)
const editingId  = ref<string|number|undefined>()
const viewRec    = ref<PRTrackingExpanded|null>(null)
const delTarget  = ref<PRTrackingExpanded|null>(null)
const search     = ref('')
const filterStatus = ref('')
const page       = ref(1)
const pageSize   = 10

const statusOptions = ['Plan','Processing','Shooting / Writing','Editing','Checking','Compleated']

const pickedFile = ref<File|null>(null)
const pickedPreviewUrl = ref<string>('')
const onFilePick = (e: Event) => {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  if (pickedPreviewUrl.value) URL.revokeObjectURL(pickedPreviewUrl.value)
  pickedFile.value = f
  pickedPreviewUrl.value = f.type.startsWith('image/') ? URL.createObjectURL(f) : ''
}
const isImage = (name: string) => /\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(name)

// Multi-image process uploading state
const editingFiles = ref<{ id?: string; file?: File; previewUrl?: string }[]>([])
const onMultiFilePick = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
    editingFiles.value.push({ file, previewUrl })
  }
}
const removeMultiFile = (index: number) => {
  const item = editingFiles.value[index]
  if (item.previewUrl && !item.id) {
    URL.revokeObjectURL(item.previewUrl)
  }
  editingFiles.value.splice(index, 1)
}

interface Form {
  title: string;
  client: string;
  status: string;
  creator_or_writer: string;
  editor: string;
  start_pr: string;
  deadline_pr: string;
  description: string;
  attach_document: string;
  editing_process: { id?: string | number; directus_files_id: string }[];
  comment_plan: string;
  comment_processing: string;
  comment_shooting: string;
  comment_editing: string;
  comment_checking: string;
  production_link: string;
  checking_link: string;
}
const blank = (): Form => ({
  title: '',
  client: '',
  status: 'Plan',
  creator_or_writer: '',
  editor: '',
  start_pr: '',
  deadline_pr: '',
  description: '',
  attach_document: '',
  editing_process: [],
  comment_plan: '',
  comment_processing: '',
  comment_shooting: '',
  comment_editing: '',
  comment_checking: '',
  production_link: '',
  checking_link: ''
})
const form = ref<Form>(blank())

// helpers
const fullName = (u?: DirectusUser|null) => u ? (`${u.first_name??''} ${u.last_name??''}`).trim() || u.email || '' : ''
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})
const toDateInput = (d?:string|null) => d ? d.slice(0,10) : ''
const roleLabel = (r?: string) => r === CREATOR_ROLE_ID ? 'Creator' : r === WRITER_ROLE_ID ? 'Writer' : r === ADMIN_ROLE_ID ? 'Admin' : 'Editor'

const isNearlyDeadline = (r: PRTrackingExpanded) => {
  if (r.status === 'Compleated' || !r.deadline_pr) return false
  try {
    const deadline = new Date(r.deadline_pr)
    deadline.setHours(0,0,0,0)
    const today = new Date()
    today.setHours(0,0,0,0)
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 2
  } catch {
    return false
  }
}

const nearlyDeadlineCount = computed(() => records.value.filter(r => isNearlyDeadline(r)).length)

/** True when the selected creator/writer is a Writer role user */
const isWriterSelected = computed(() => {
  if (!form.value.creator_or_writer) return false
  const user = creatorList.value.find(u => u.id === form.value.creator_or_writer)
  return user?.role === WRITER_ROLE_ID
})

watch(() => form.value.creator_or_writer, () => {
  if (isWriterSelected.value) form.value.editor = ''
})

/** Current logged-in user's role */
const currentUserRole = computed(() => authStore.user?.role?.id ?? '')
const isCurrentUserWriter  = computed(() => currentUserRole.value === WRITER_ROLE_ID)
const isCurrentUserCreator = computed(() => currentUserRole.value === CREATOR_ROLE_ID)
const isCurrentUserEditor  = computed(() => currentUserRole.value === EDITOR_ROLE_ID)
const isAdmin              = computed(() => currentUserRole.value === ADMIN_ROLE_ID)
/** Writer, Creator, or Editor — limited to status + attach_document edits only */
const isLimitedRole = computed(() => isCurrentUserWriter.value || isCurrentUserCreator.value || isCurrentUserEditor.value)
const disabledCls   = 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
/** Roles allowed to delete records */
const isAdminOrSale = computed(() => [
  // Admin
  '3a5cb98e-02f8-4f09-afd9-dcd43288c756',

  // Sales
  'a7b9388a-9f74-4a0d-afd4-741f0f488ec2',
].includes(currentUserRole.value))

const statusCls = (s: string) => ({
  'Plan':              'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  'Processing':        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  'Shooting / Writing':'bg-orange-500 text-white dark:bg-orange-600 font-semibold ring-2 ring-orange-300/50 dark:ring-orange-500/30 animate-pulse',
  'Editing':           'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Checking':          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Compleated':        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
}[s] ?? 'bg-gray-100 text-gray-600')

// stats
const stats = computed(() => [
  { label:'Total', value: records.value.length, icon:'mdi:folder-open', bg:'bg-blue-100 dark:bg-blue-900/30', color:'text-blue-500' },
  { label:'Plan',  value: records.value.filter(r=>r.status==='Plan').length, icon:'mdi:lightbulb', bg:'bg-sky-100 dark:bg-sky-900/30', color:'text-sky-500' },
  { label:'In Progress', value: records.value.filter(r=>['Processing','Shooting / Writing','Editing','Checking'].includes(r.status)).length, icon:'mdi:progress-clock', bg:'bg-yellow-100 dark:bg-yellow-900/30', color:'text-yellow-500' },
  { label:'Compleated', value: records.value.filter(r=>r.status==='Compleated').length, icon:'mdi:check-circle', bg:'bg-green-100 dark:bg-green-900/30', color:'text-green-500' },
])

// filtered & paginated
const filtered = computed(() => {
  let list = records.value
  if (filterStatus.value) list = list.filter(r => r.status === filterStatus.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(r =>
      (r.title??'').toLowerCase().includes(q) ||
      (r.client??'').toLowerCase().includes(q) ||
      fullName(r.creator_or_writer).toLowerCase().includes(q) ||
      fullName(r.editor).toLowerCase().includes(q)
    )
  }
  return list
})
const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize))
const paginated  = computed(() => filtered.value.slice((page.value-1)*pageSize, page.value*pageSize))
watch(filtered, () => { page.value = 1 })

// data loading
const loadData = async () => {
  isLoading.value = true
  try {
    records.value = await fetchAll()
  } catch (e: any) {
    toast(e?.message || 'Failed to load records', 'error')
  } finally { isLoading.value = false }
}
const loadUsers = async () => {
  try {
    const [c, e] = await Promise.all([fetchCreatorsOrWriters(), fetchEditors()])
    creatorList.value = c
    editorList.value  = e
  } catch {}
}

// modal openers
const openCreate = () => { editing.value=false; editingId.value=undefined; form.value=blank(); pickedFile.value=null; editingFiles.value=[]; showForm.value=true }
const openEdit   = (r: PRTrackingExpanded) => {
  editing.value  = true
  editingId.value = r.id
  form.value = {
    title:  r.title ?? '',
    client: r.client ?? '',
    status: r.status ?? 'Plan',
    creator_or_writer: (typeof r.creator_or_writer === 'object' ? r.creator_or_writer?.id : r.creator_or_writer) ?? '',
    editor:            (typeof r.editor === 'object' ? r.editor?.id : r.editor) ?? '',
    start_pr:    toDateInput(r.start_pr),
    deadline_pr: toDateInput(r.deadline_pr),
    description: r.description ?? '',
    attach_document: r.attach_document ?? '',
    editing_process: r.editing_process ? r.editing_process.map(item => ({
      id: item.id,
      directus_files_id: (typeof item.directus_files_id === 'object' ? item.directus_files_id?.id : item.directus_files_id) ?? ''
    })) : [],
    comment_plan: r.comment_plan ?? '',
    comment_processing: r.comment_processing ?? '',
    comment_shooting: r.comment_shooting ?? '',
    comment_editing: r.comment_editing ?? '',
    comment_checking: r.comment_checking ?? '',
    production_link: r.production_link ?? '',
    checking_link: r.checking_link ?? '',
  }
  pickedFile.value = null
  
  const apiBase = useRuntimeConfig().public.API_BASE_URL || 'http://46.250.231.152:8056'
  editingFiles.value = r.editing_process ? r.editing_process.map(item => {
    const fileId = typeof item.directus_files_id === 'object' ? item.directus_files_id?.id : item.directus_files_id
    return {
      id: fileId,
      previewUrl: fileId ? `${apiBase}/assets/${fileId}` : ''
    }
  }).filter(f => f.id) : []

  showForm.value = true
}
const openView = (r: PRTrackingExpanded) => { viewRec.value = r; showView.value = true }
const askDelete = (r: PRTrackingExpanded) => { delTarget.value = r; showDel.value = true }

// CRUD
const submitForm = async () => {
  isSaving.value = true
  try {
    // Upload file first if picked
    if (pickedFile.value) {
      try {
        form.value.attach_document = await uploadFile(pickedFile.value)
      } catch {
        toast('File upload failed — record not saved', 'error')
        isSaving.value = false
        return
      }
    }

    // Upload editing process images if any
    const finalEditingProcess: { directus_files_id: string }[] = [];
    for (const item of editingFiles.value) {
      if (item.id) {
        finalEditingProcess.push({ directus_files_id: item.id })
      } else if (item.file) {
        try {
          const newId = await uploadFile(item.file)
          finalEditingProcess.push({ directus_files_id: newId })
        } catch {
          toast('Failed to upload process image', 'error')
          isSaving.value = false
          return
        }
      }
    }
    form.value.editing_process = finalEditingProcess

    const currentRoleId = authStore.user?.role?.id
    const isLimited = currentRoleId === WRITER_ROLE_ID || currentRoleId === CREATOR_ROLE_ID || currentRoleId === EDITOR_ROLE_ID

    // Writer, Creator & Editor may only update the fields their Directus policy permits
    const payload: any = {}
    if (isLimited) {
      payload.status = form.value.status
      payload.attach_document = form.value.attach_document || null
      if (currentRoleId === EDITOR_ROLE_ID) {
        payload.editing_process = form.value.editing_process
      }
      if (currentRoleId === CREATOR_ROLE_ID || currentRoleId === EDITOR_ROLE_ID || currentRoleId === WRITER_ROLE_ID) {
        payload.production_link = form.value.production_link || null
        payload.checking_link = form.value.checking_link || null
      }
    } else {
      payload.title = form.value.title
      payload.client = form.value.client
      payload.status = form.value.status
      payload.creator_or_writer = form.value.creator_or_writer || null
      payload.editor = form.value.editor || null
      payload.start_pr = form.value.start_pr || null
      payload.deadline_pr = form.value.deadline_pr || null
      payload.description = form.value.description || null
      payload.attach_document = form.value.attach_document || null
      payload.editing_process = form.value.editing_process
      payload.production_link = form.value.production_link || null
      payload.checking_link = form.value.checking_link || null
      
      // Only Admin role (3a5cb98e-02f8-4f09-afd9-dcd43288c756) is allowed to comment
      if (currentRoleId === ADMIN_ROLE_ID) {
        payload.comment_plan = form.value.comment_plan || null
        payload.comment_processing = form.value.comment_processing || null
        payload.comment_shooting = form.value.comment_shooting || null
        payload.comment_editing = form.value.comment_editing || null
        payload.comment_checking = form.value.comment_checking || null
      }
    }

    if (editing.value && editingId.value !== undefined) {
      const updated = await update(editingId.value, payload)
      const idx = records.value.findIndex(r => r.id === editingId.value)
      if (idx !== -1) records.value[idx] = updated
      toast('Record updated')
      // ── Telegram notify on update ────────────────────────────────────────
      const creatorUser2 = creatorList.value.find(u => u.id === form.value.creator_or_writer)
      const deptName = creatorUser2?.department?.title ?? authStore.user?.department?.title ?? undefined

      const apiBase = useRuntimeConfig().public.API_BASE_URL || 'http://46.250.231.152:8056'
      const attachUrl = form.value.attach_document ? `${apiBase}/assets/${form.value.attach_document}` : undefined
      const processPhotos = form.value.editing_process
        ? form.value.editing_process.map(img => {
            const fileId = typeof img.directus_files_id === 'object' ? (img.directus_files_id as any)?.id : img.directus_files_id
            return fileId ? `${apiBase}/assets/${fileId}` : ''
          }).filter(url => url)
        : []

      const editorUser2  = editorList.value.find(u  => u.id === form.value.editor)
      notifyPR({
        action: 'updated',
        title:  form.value.title,
        client: form.value.client,
        status: form.value.status,
        departmentName: deptName,
        creatorName: creatorUser2 ? `${creatorUser2.first_name ?? ''} ${creatorUser2.last_name ?? ''}`.trim() : undefined,
        editorName:  editorUser2  ? `${editorUser2.first_name  ?? ''} ${editorUser2.last_name  ?? ''}`.trim() : undefined,
        startDate: form.value.start_pr    || undefined,
        deadline:  form.value.deadline_pr || undefined,
        attachDocumentUrl: attachUrl,
        editingProcessPhotos: processPhotos,
        productionLink: form.value.production_link || undefined,
        checkingLink: form.value.checking_link || undefined,
      })
    } else {
      const created = await create(payload)
      records.value.unshift(created)
      toast('Record created')
      // ── Telegram notify on create ────────────────────────────────────────
      const creatorUser3 = creatorList.value.find(u => u.id === form.value.creator_or_writer)
      const deptName = creatorUser3?.department?.title ?? authStore.user?.department?.title ?? undefined
 
      const apiBase = useRuntimeConfig().public.API_BASE_URL || 'http://46.250.231.152:8056'
      const attachUrl = form.value.attach_document ? `${apiBase}/assets/${form.value.attach_document}` : undefined
      const processPhotos = form.value.editing_process
        ? form.value.editing_process.map(img => {
            const fileId = typeof img.directus_files_id === 'object' ? (img.directus_files_id as any)?.id : img.directus_files_id
            return fileId ? `${apiBase}/assets/${fileId}` : ''
          }).filter(url => url)
        : []
 
      const editorUser3  = editorList.value.find(u  => u.id === form.value.editor)
      notifyPR({
        action: 'created',
        title:  form.value.title,
        client: form.value.client,
        status: form.value.status,
        departmentName: deptName,
        creatorName: creatorUser3 ? `${creatorUser3.first_name ?? ''} ${creatorUser3.last_name ?? ''}`.trim() : undefined,
        editorName:  editorUser3  ? `${editorUser3.first_name  ?? ''} ${editorUser3.last_name  ?? ''}`.trim() : undefined,
        startDate: form.value.start_pr    || undefined,
        deadline:  form.value.deadline_pr || undefined,
        attachDocumentUrl: attachUrl,
        editingProcessPhotos: processPhotos,
        productionLink: form.value.production_link || undefined,
        checkingLink: form.value.checking_link || undefined,
      })
    }
    showForm.value = false
  } catch (e: any) {
    toast(e?.message || 'Save failed', 'error')
  } finally { isSaving.value = false }
}

const doDelete = async () => {
  if (!delTarget.value) return
  isDeleting.value = true
  try {
    const t = delTarget.value as any

    // ── Fetch department name from creator/writer BEFORE deleting the record ──
    const creatorId = typeof t.creator_or_writer === 'object' ? t.creator_or_writer?.id : t.creator_or_writer
    const creatorUser = creatorList.value.find(u => u.id === creatorId)
    const deptName = creatorUser?.department?.title ?? (typeof t.creator_or_writer === 'object' ? t.creator_or_writer?.department?.title : undefined) ?? authStore.user?.department?.title ?? undefined

    await remove(delTarget.value.id!)
    records.value = records.value.filter(r => r.id !== delTarget.value!.id)
    toast('Record deleted')
    showDel.value = false

    // ── Telegram notify on delete ────────────────────────────────────────
    notifyPR({
      action: 'deleted',
      title:  t.title  ?? '',
      client: t.client ?? '',
      status: t.status ?? '',
      departmentName: deptName,
    })
  } catch (e: any) {
    toast(e?.message || 'Delete failed', 'error')
  } finally { isDeleting.value = false }
}

onMounted(() => { loadData(); loadUsers() })
</script>
