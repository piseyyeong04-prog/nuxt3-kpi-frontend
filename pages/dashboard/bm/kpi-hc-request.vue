<!-- pages/dashboard/bm/kpi-bc-request.vue -->
<template>
  <div class="container min-h-screen mx-auto p-4 md:p-6">
    <div
      class="bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
      v-motion-slide-visible-once="{
        initial: { opacity: 0, y: 50 },
        visibleOnce: { opacity: 1, y: 0, transition: { duration: 600 } }
      }">

      <!-- Header -->
      <div class="relative overflow-hidden p-6 border-b dark:border-gray-800">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-indigo-200/30 rounded-full -translate-y-1/2 translate-x-1/3 dark:from-blue-900/10 dark:to-indigo-800/10"></div>
        <div class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-100/20 to-indigo-100/20 rounded-full translate-y-1/2 -translate-x-1/3"></div>
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
          <div class="flex items-center gap-4">
            <div class="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
              <img src="/logo.png" alt="Baksey Media Logo" class="h-10 w-auto" />
            </div>
            <div class="h-10 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {{ locale === 'en' ? 'BC Commission Request' : 'លិខិតស្នើសុំកម្រៃ BC' }}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Business Cambodia</p>
            </div>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{{ currentDate }}</span>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="p-6 space-y-8">

        <!-- Basic Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ locale === 'en' ? 'Name' : 'ឈ្មោះ' }}
            </label>
            <input readonly v-model="form.name" type="text"
              class="block w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/30 transition-all" />
          </div>
          <div class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ locale === 'en' ? 'Department' : 'ដេប៉ាតឺម៉ង់' }}
            </label>
            <input readonly v-model="form.departmentTitle" type="text"
              class="block w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/30 transition-all" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ locale === 'en' ? 'Date' : 'កាលបរិច្ឆេទ' }}
            </label>
            <input v-model="form.date" type="date"
              class="block w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/30 transition-all" />
          </div>
          <div class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ locale === 'en' ? 'Total Bonus Amount' : 'ចំនួនប្រាក់រង្វាន់សរុប' }}
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">$</span>
              <input readonly :value="formatMoney(totalBonusAmount)" type="text"
                class="block w-full pl-10 px-4 py-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/30 transition-all" />
            </div>
          </div>
        </div>

        <!-- ── COMMERCIAL REQUEST TABLE ─────────────────────────────────── -->
        <div>
          <h3 class="text-base font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            <span class="w-2 h-5 bg-blue-500 rounded-full inline-block"></span>
            {{ locale === 'en' ? 'For Commercial Request' : 'សម្រាប់ការស្នើសុំពាណិជ្ជកម្ម' }}
          </h3>
          <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Activity</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Clients Name</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Bonus Fee</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Fee Charge ($)</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Request ($)</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 w-12"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                  <tr v-for="(row, i) in form.commercial" :key="i" class="hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors">
                    <td class="px-4 py-3">
                      <input v-model="row.activity" type="text" placeholder="Activity name"
                        class="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/30" />
                    </td>
                    <td class="px-4 py-3">
                      <input v-model="row.client" type="text" placeholder="Client"
                        class="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/30" />
                    </td>
                    <td class="px-4 py-3">
                      <input v-model="row.bonusFee" type="text" placeholder="e.g. 30%"
                        class="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/30" />
                    </td>
                    <td class="px-4 py-3">
                      <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400 text-xs">$</span>
                        <input v-model.number="row.feeCharge" type="number" step="0.01" placeholder="0.00" @input="calcCommercial(i)"
                          class="w-full pl-6 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/30" />
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400 text-xs">$</span>
                        <input v-model.number="row.request" type="number" step="0.01" placeholder="0.00"
                          class="w-full pl-6 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/30" />
                      </div>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <button type="button" @click="removeCommercial(i)"
                        class="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
                        <Icon icon="mdi:delete-outline" class="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 font-medium">
                    <td colspan="3" class="px-4 py-3 text-right text-gray-700 dark:text-gray-300 text-xs font-bold uppercase">Total Amount:</td>
                    <td class="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">${{ formatMoney(totalCommercialFee) }}</td>
                    <td class="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">${{ formatMoney(totalCommercialRequest) }}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3">
              <button type="button" @click="addCommercial"
                class="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all">
                <Icon icon="mdi:plus" class="w-4 h-4" />
                {{ locale === 'en' ? 'Add Row' : 'បន្ថែមជួរ' }}
              </button>
            </div>
          </div>
        </div>

        <!-- ── INTERNAL POLICY TABLE ─────────────────────────────────────── -->
        <div>
          <h3 class="text-base font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            <span class="w-2 h-5 bg-indigo-500 rounded-full inline-block"></span>
            {{ locale === 'en' ? 'For Internal Policy Request' : 'សម្រាប់ការស្នើសុំគោលការណ៍ផ្ទៃក្នុង' }}
          </h3>
          <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Activity</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Bonus Fee</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Video Title / Quote</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Post Date</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Request ($)</th>
                    <th class="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                  <tr v-for="(row, i) in form.internal" :key="i" class="hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 transition-colors">
                    <td class="px-4 py-3">
                      <input v-model="row.activity" type="text" placeholder="Activity name"
                        class="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/30" />
                    </td>
                    <td class="px-4 py-3">
                      <input v-model="row.bonusFee" type="text" placeholder="e.g. $15/Video"
                        class="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/30" />
                    </td>
                    <td class="px-4 py-3">
                      <input v-model="row.videoTitle" type="text" placeholder="Title or quote"
                        class="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/30" />
                    </td>
                    <td class="px-4 py-3">
                      <input v-model="row.postDate" type="date"
                        class="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/30" />
                    </td>
                    <td class="px-4 py-3">
                      <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400 text-xs">$</span>
                        <input v-model.number="row.request" type="number" step="0.01" placeholder="0.00"
                          class="w-full pl-6 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/30" />
                      </div>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <button type="button" @click="removeInternal(i)"
                        class="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
                        <Icon icon="mdi:delete-outline" class="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 font-medium">
                    <td colspan="4" class="px-4 py-3 text-right text-gray-700 dark:text-gray-300 text-xs font-bold uppercase">Total Request:</td>
                    <td class="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">${{ formatMoney(totalInternalRequest) }}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3">
              <button type="button" @click="addInternal"
                class="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all">
                <Icon icon="mdi:plus" class="w-4 h-4" />
                {{ locale === 'en' ? 'Add Row' : 'បន្ថែមជួរ' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Approvers Section -->
        <div class="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Icon icon="mdi:check-circle-outline" class="w-5 h-5 text-blue-500" />
            {{ locale === 'en' ? 'Approvals' : 'ការអនុម័ត' }}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div v-for="(key) in approverKeys" :key="key"
              class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h4 class="font-semibold capitalize text-gray-800 dark:text-white text-xs mb-2 uppercase tracking-wide">{{ formatApproverTitle(key) }}</h4>
              <div class="space-y-2">
                <div>
                  <label class="block text-[10px] text-gray-500 mb-0.5">Name</label>
                  <input :readonly="key !== 'requestedBy'" v-model="form.approvers[key].name" type="text"
                    class="w-full px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white text-xs" />
                </div>
                <div>
                  <label class="block text-[10px] text-gray-500 mb-0.5">Position</label>
                  <input :readonly="key !== 'requestedBy'" v-model="form.approvers[key].position" type="text"
                    class="w-full px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white text-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── REFERENCES SECTION ──────────────────────────────────────── -->
        <div class="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Icon icon="mdi:attachment-outline" class="w-5 h-5 text-blue-500" />
              {{ locale === 'en' ? 'References (Optional)' : 'ឯកសារយោង (ស្រេចចិត្ត)' }}
            </h3>
            <button type="button" @click="addReference"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all">
              <Icon icon="mdi:plus" class="w-4 h-4" />
              {{ locale === 'en' ? 'Add Reference' : 'បន្ថែមឯកសារយោង' }}
            </button>
          </div>
          <div class="divide-y divide-gray-100 dark:divide-gray-800">
            <div v-for="(refItem, idx) in form.references" :key="idx"
              class="flex items-start gap-4 py-4 first:pt-0 last:pb-0 transition-colors">
              <div class="flex-1 grid grid-cols-1 gap-3">
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Link (optional)</label>
                  <input v-model="refItem.link" type="url" placeholder="https://..."
                    class="block w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-400/30 transition-all" />
                </div>
                <!-- Image upload + previews -->
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Images (multiple - local only, not uploaded to CMS)</label>
                  <div class="relative">
                    <input type="file" multiple accept="image/*" :disabled="refItem.uploading" @change="(e) => handleImages(e, idx)"
                      class="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
                    <div v-if="refItem.uploading" class="absolute right-2 top-2.5 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
                      <Icon icon="mdi:loading" class="w-4 h-4 animate-spin" />
                      <span>Uploading to server...</span>
                    </div>
                  </div>
                  <div v-if="refItem.images.length" class="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    <div v-for="(img, imgIdx) in refItem.images" :key="imgIdx" 
                      class="relative bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center gap-2 group">
                      
                      <!-- Thumbnail -->
                      <div class="h-24 w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded">
                        <img :src="getImgSrc(img.url)" class="max-h-full max-w-full object-contain rounded" />
                      </div>
                      
                      <!-- Image Dimensions Controls -->
                      <div class="w-full space-y-2 text-xs">
                        <!-- Width slider & input -->
                        <div class="space-y-1">
                          <div class="flex justify-between text-[10px] text-gray-500">
                            <span>Width (px)</span>
                            <input type="number" :value="img.width" @input="(e) => { img.width = Number((e.target as HTMLInputElement).value); onWidthChange(idx, imgIdx); }" min="30" max="700"
                              class="w-12 text-right border rounded bg-transparent px-1 font-bold text-[10px] text-gray-800 dark:text-white" />
                          </div>
                          <input type="range" :value="img.width" @input="(e) => { img.width = Number((e.target as HTMLInputElement).value); onWidthChange(idx, imgIdx); }" min="30" max="700" step="5" 
                            class="w-full accent-blue-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                        </div>
                        
                        <!-- Height slider & input -->
                        <div class="space-y-1">
                          <div class="flex justify-between text-[10px] text-gray-500">
                            <span>Height (px)</span>
                            <input type="number" :value="img.height" @input="(e) => { img.height = Number((e.target as HTMLInputElement).value); onHeightChange(idx, imgIdx); }" min="30" max="700"
                              class="w-12 text-right border rounded bg-transparent px-1 font-bold text-[10px] text-gray-800 dark:text-white" />
                          </div>
                          <input type="range" :value="img.height" @input="(e) => { img.height = Number((e.target as HTMLInputElement).value); onHeightChange(idx, imgIdx); }" min="30" max="700" step="5" 
                            class="w-full accent-blue-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                        </div>

                        <!-- Aspect Lock Toggle -->
                        <div class="flex items-center justify-between text-[10px] text-gray-500 border-t pt-1 dark:border-gray-800">
                          <span>Lock Aspect</span>
                          <button type="button" @click="toggleAspectLock(idx, imgIdx)" 
                            class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
                            :class="img.aspectLocked ? 'text-blue-600' : 'text-gray-400'">
                            <Icon :icon="img.aspectLocked ? 'mdi:lock' : 'mdi:lock-open-variant'" class="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      <!-- Delete button -->
                      <button type="button" @click="removeImage(idx, imgIdx)"
                        class="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-all">
                        <Icon icon="mdi:close" class="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <button type="button" @click="removeReference(idx)" v-if="form.references.length > 1"
                class="mt-6 p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                <Icon icon="mdi:delete-outline" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
          <button type="button" @click="resetForm"
            class="group w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700">
            <Icon icon="mdi:refresh" class="w-5 h-5 mr-2 transition-transform group-hover:rotate-180" />
            {{ locale === 'en' ? 'Reset Form' : 'កំណត់ឡើងវិញ' }}
          </button>
          <button type="button" @click="showPreview = true"
            class="group w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-indigo-300 shadow-sm text-base font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700">
            <Icon icon="mdi:eye-outline" class="w-5 h-5 mr-2" />
            {{ locale === 'en' ? 'Preview Document' : 'មើលឯកសារ' }}
          </button>
          <button type="submit"
            class="group w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
            <Icon icon="mdi:send-outline" class="w-5 h-5 mr-2 transition-transform group-hover:translate-x-1" />
            {{ locale === 'en' ? 'Submit Request' : 'ដាក់ស្នើសុំ' }}
          </button>
        </div>
      </form>
    </div>

    <!-- ================================================================
         PREVIEW MODAL
         ================================================================ -->
    <Teleport to="body">
      <Transition name="fade">
        <div id="bc-print-modal-wrapper" v-if="showPreview"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          @click.self="showPreview = false">
          <div class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">

            <!-- Modal Header -->
            <div class="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between text-white">
              <div class="flex items-center gap-3">
                <Icon icon="mdi:file-document-outline" class="w-6 h-6 text-white" />
                <h2 class="text-xl font-bold">{{ locale === 'en' ? 'Document Preview' : 'មើលឯកសារជាមុន' }}</h2>
              </div>
              <div class="flex items-center gap-2">
                <button @click="downloadPdf" :disabled="isDownloadingPdf"
                  class="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white rounded-lg transition-all flex items-center gap-1.5 text-sm font-semibold">
                  <Icon v-if="!isDownloadingPdf" icon="mdi:file-download-outline" class="w-5 h-5" />
                  <Icon v-else icon="mdi:loading" class="w-5 h-5 animate-spin" />
                  {{ isDownloadingPdf ? 'Generating...' : 'Download PDF' }}
                </button>
                <button @click="printDocument"
                  class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all flex items-center gap-1.5 text-sm font-semibold">
                  <Icon icon="mdi:printer" class="w-5 h-5" />
                  {{ locale === 'en' ? 'Print' : 'បោះពុម្ព' }}
                </button>
                <button @click="showPreview = false"
                  class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center justify-center">
                  <Icon icon="mdi:close" class="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <!-- Modal Body -->
            <div class="overflow-y-auto flex-1 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:bg-gray-800 p-8 flex flex-col items-center gap-8">
              <div id="bc-printable-document" class="flex flex-col items-center gap-8 bg-transparent">

                <!-- PAGE 1: Main Letter -->
                <div class="bg-white text-gray-950 relative overflow-hidden printable-a4 shadow-xl"
                  style="width: 210mm; height: 297mm; padding: 10mm 15mm 38mm 15mm; font-family: 'Times New Roman', Times, serif; box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.15); background-image: url('/healthy-cambodia-kpi-bg.png'); background-size: cover; background-repeat: no-repeat; background-position: center;">

                  <div class="relative z-10 flex flex-col justify-between h-full min-h-[249mm]">
                    <div>
                      <!-- Title -->
                      <div class="text-center mt-10 mb-4">
                        <h1 class="text-lg font-bold text-gray-900 underline decoration-2 underline-offset-4">
                          Commission Request Letter
                        </h1>
                      </div>

                      <!-- Meta Info -->
                      <div class="mb-4 text-sm space-y-0.5">
                        <div class="flex gap-2"><span class="font-bold w-48">Name:</span><span>{{ form.name }}</span></div>
                        <div class="flex gap-2"><span class="font-bold w-48">Department:</span><span>{{ form.departmentTitle }}</span></div>
                        <div class="flex gap-2"><span class="font-bold w-48">Date:</span><span>{{ form.date || currentDate }}</span></div>
                        <div class="flex gap-2"><span class="font-bold w-48">Total Bonus Amount:</span><span class="font-bold">${{ formatMoney(totalBonusAmount) }}</span></div>
                      </div>

                      <!-- Commercial Table -->
                      <div class="mb-4" v-if="form.commercial && form.commercial.length > 0">
                        <h2 class="text-xs font-bold text-gray-800 mb-1 border-b border-gray-300 pb-0.5">For Commercial Request</h2>
                        <table class="w-full border-collapse border border-gray-400 text-[9px] text-left">
                          <thead>
                            <tr class="bg-gray-50">
                              <th class="border border-gray-400 px-2 py-1 font-bold">Activity</th>
                              <th class="border border-gray-400 px-2 py-1 font-bold">Clients Name</th>
                              <th class="border border-gray-400 px-2 py-1 font-bold">Bonus Fee</th>
                              <th class="border border-gray-400 px-2 py-1 font-bold w-20">Fee Charge</th>
                              <th class="border border-gray-400 px-2 py-1 font-bold w-20">Request</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(row, idx) in form.commercial" :key="idx">
                              <td class="border border-gray-400 px-2 py-0.5">{{ row.activity }}</td>
                              <td class="border border-gray-400 px-2 py-0.5">{{ row.client }}</td>
                              <td class="border border-gray-400 px-2 py-0.5 whitespace-pre-line">{{ row.bonusFee }}</td>
                              <td class="border border-gray-400 px-2 py-0.5">${{ formatMoney(row.feeCharge) }}</td>
                              <td class="border border-gray-400 px-2 py-0.5 font-bold">${{ formatMoney(row.request) }}</td>
                            </tr>
                            <tr class="font-bold bg-gray-50">
                              <td colspan="3" class="border border-gray-400 px-2 py-1 text-right">Total:</td>
                              <td class="border border-gray-400 px-2 py-1">${{ formatMoney(totalCommercialFee) }}</td>
                              <td class="border border-gray-400 px-2 py-1">${{ formatMoney(totalCommercialRequest) }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <!-- Internal Table -->
                      <div class="mb-4" v-if="form.internal && form.internal.length > 0">
                        <h2 class="text-xs font-bold text-gray-800 mb-1 border-b border-gray-300 pb-0.5">For Internal Policy</h2>
                        <table class="w-full border-collapse border border-gray-400 text-[9px] text-left">
                          <thead>
                            <tr class="bg-gray-50">
                              <th class="border border-gray-400 px-2 py-1 font-bold">Activity</th>
                              <th class="border border-gray-400 px-2 py-1 font-bold">Bonus Fee</th>
                              <th class="border border-gray-400 px-2 py-1 font-bold">Video Title/Quote</th>
                              <th class="border border-gray-400 px-2 py-1 font-bold w-20">Post Date</th>
                              <th class="border border-gray-400 px-2 py-1 font-bold w-20">Request</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(row, idx) in form.internal" :key="idx">
                              <td class="border border-gray-400 px-2 py-0.5">{{ row.activity }}</td>
                              <td class="border border-gray-400 px-2 py-0.5">{{ row.bonusFee }}</td>
                              <td class="border border-gray-400 px-2 py-0.5">{{ row.videoTitle }}</td>
                              <td class="border border-gray-400 px-2 py-0.5">{{ row.postDate }}</td>
                              <td class="border border-gray-400 px-2 py-0.5 font-bold">${{ formatMoney(row.request) }}</td>
                            </tr>
                            <tr class="font-bold bg-gray-50">
                              <td colspan="4" class="border border-gray-400 px-2 py-1 text-right">Total:</td>
                              <td class="border border-gray-400 px-2 py-1">${{ formatMoney(totalInternalRequest) }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <!-- Bottom part of Page 1: Signatures and Reference -->
                    <div>
                      <!-- Approvers Signatures -->
                      <div class="mt-2">
                        <table class="w-full border-collapse border border-gray-400">
                          <thead>
                            <tr class="bg-white">
                              <th v-for="key in approverKeys" :key="key" class="border border-gray-400 px-2 py-1 text-center font-bold text-[9px]">
                                {{ formatApproverTitle(key) }}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr class="bg-white">
                              <td v-for="key in approverKeys" :key="key" class="border border-gray-400 px-2 align-bottom" style="height: 55px;">
                                <div class="pb-1">
                                  <div class="border-b border-gray-400 mb-0.5"></div>
                                  <p class="font-semibold text-[9px]">{{ form.approvers[key].name }}</p>
                                  <p class="text-gray-600 text-[9px]">{{ form.approvers[key].position }}</p>
                                  <p class="text-gray-500 text-[8px]">Date: {{ form.date || '…/…/……' }}</p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <!-- Reference -->
                      <!-- <div class="mt-2 text-[10px] text-gray-700">
                        <span class="font-bold">Reference: </span>
                        <span class="italic text-gray-500">{{ form.reference || '....................................................' }}</span>
                      </div> -->
                    </div>

                  </div>
                </div><!-- /PAGE 1 -->

                <!-- PAGE 2: References (Printed only if references are present) -->
                <div v-if="hasAnyReference"
                  class="bg-white text-gray-950 font-sans printable-a4 printable-a4-flow shadow-xl text-left"
                  style="width: 210mm; min-height: 297mm; padding: 20mm; position: relative; box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.15);">
                  <div class="space-y-4">
                    <h4 class="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-2">
                      Reference of Commission Request
                    </h4>
                    <div v-for="(refItem, idx) in form.references" :key="idx" class="space-y-2 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                      <div v-if="refItem.link" class="text-xs">
                        <span class="font-bold">Link: </span>
                        <a :href="refItem.link" target="_blank" class="text-blue-700 hover:underline break-all font-mono">{{ refItem.link }}</a>
                      </div>
                      <div v-if="refItem.images.length">
                        <div class="flex flex-wrap gap-4 items-start select-none">
                          <div v-for="(img, imgIdx) in refItem.images" :key="imgIdx" 
                            class="relative group border border-transparent hover:border-blue-500 rounded p-1 bg-white"
                            :class="{ 'border-blue-500 ring-2 ring-blue-500/20': activeResizingImg?.refIdx === idx && activeResizingImg?.imgIdx === imgIdx }"
                            :style="{ width: img.width + 'px', height: img.height + 'px' }">
                            
                            <img :src="getImgSrc(img.url)" class="w-full h-full object-contain rounded" alt="Reference" />
                            
                            <!-- Resizing Border Overlay -->
                            <div class="absolute inset-0 pointer-events-none border-2 border-blue-500 rounded no-print transition-opacity"
                              :class="activeResizingImg?.refIdx === idx && activeResizingImg?.imgIdx === imgIdx ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"></div>
                            
                            <!-- Corner Handles -->
                            <div class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-nwse-resize pointer-events-auto no-print shadow-sm transition-opacity z-20"
                              :class="activeResizingImg?.refIdx === idx && activeResizingImg?.imgIdx === imgIdx ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
                              @mousedown="startResize($event, idx, imgIdx, 'top-left')"
                              @touchstart="startResizeTouch($event, idx, imgIdx, 'top-left')"></div>
                              
                            <div class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-nesw-resize pointer-events-auto no-print shadow-sm transition-opacity z-20"
                              :class="activeResizingImg?.refIdx === idx && activeResizingImg?.imgIdx === imgIdx ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
                              @mousedown="startResize($event, idx, imgIdx, 'top-right')"
                              @touchstart="startResizeTouch($event, idx, imgIdx, 'top-right')"></div>
                              
                            <div class="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-nesw-resize pointer-events-auto no-print shadow-sm transition-opacity z-20"
                              :class="activeResizingImg?.refIdx === idx && activeResizingImg?.imgIdx === imgIdx ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
                              @mousedown="startResize($event, idx, imgIdx, 'bottom-left')"
                              @touchstart="startResizeTouch($event, idx, imgIdx, 'bottom-left')"></div>
                              
                            <div class="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-nwse-resize pointer-events-auto no-print shadow-sm transition-opacity z-20"
                              :class="activeResizingImg?.refIdx === idx && activeResizingImg?.imgIdx === imgIdx ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
                              @mousedown="startResize($event, idx, imgIdx, 'bottom-right')"
                              @touchstart="startResizeTouch($event, idx, imgIdx, 'bottom-right')"></div>
                              
                            <!-- Side Handles -->
                            <div class="absolute top-1/2 -translate-y-1/2 -left-1.5 w-2 h-4 bg-white border-2 border-blue-600 rounded cursor-ew-resize pointer-events-auto no-print shadow-sm transition-opacity z-20"
                              :class="activeResizingImg?.refIdx === idx && activeResizingImg?.imgIdx === imgIdx ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
                              @mousedown="startResize($event, idx, imgIdx, 'left')"
                              @touchstart="startResizeTouch($event, idx, imgIdx, 'left')"></div>
                              
                            <div class="absolute top-1/2 -translate-y-1/2 -right-1.5 w-2 h-4 bg-white border-2 border-blue-600 rounded cursor-ew-resize pointer-events-auto no-print shadow-sm transition-opacity z-20"
                              :class="activeResizingImg?.refIdx === idx && activeResizingImg?.imgIdx === imgIdx ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
                              @mousedown="startResize($event, idx, imgIdx, 'right')"
                              @touchstart="startResizeTouch($event, idx, imgIdx, 'right')"></div>
                              
                            <div class="absolute left-1/2 -translate-x-1/2 -top-1.5 w-4 h-2 bg-white border-2 border-blue-600 rounded cursor-ns-resize pointer-events-auto no-print shadow-sm transition-opacity z-20"
                              :class="activeResizingImg?.refIdx === idx && activeResizingImg?.imgIdx === imgIdx ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
                              @mousedown="startResize($event, idx, imgIdx, 'top')"
                              @touchstart="startResizeTouch($event, idx, imgIdx, 'top')"></div>
                              
                            <div class="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-4 h-2 bg-white border-2 border-blue-600 rounded cursor-ns-resize pointer-events-auto no-print shadow-sm transition-opacity z-20"
                              :class="activeResizingImg?.refIdx === idx && activeResizingImg?.imgIdx === imgIdx ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
                              @mousedown="startResize($event, idx, imgIdx, 'bottom')"
                              @touchstart="startResizeTouch($event, idx, imgIdx, 'bottom')"></div>

                            <!-- Floating Canva-like Toolbar inside modal on hover -->
                            <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur text-white px-2 py-1 rounded shadow-lg text-[10px] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-auto no-print">
                              <span class="font-mono whitespace-nowrap">{{ img.width }}x{{ img.height }}px</span>
                              <div class="w-px h-3 bg-white/20"></div>
                              <button type="button" @click.stop="toggleAspectLock(idx, imgIdx)" 
                                class="hover:text-blue-400 transition-colors p-0.5 rounded" title="Toggle Aspect Lock">
                                <Icon :icon="img.aspectLocked ? 'mdi:lock' : 'mdi:lock-open-variant'" class="w-3.5 h-3.5" />
                              </button>
                              <button type="button" @click.stop="removeImage(idx, imgIdx)" 
                                class="hover:text-red-400 transition-colors p-0.5 rounded" title="Delete Image">
                                <Icon icon="mdi:delete-outline" class="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                          </div>
                        </div>
                      </div>
                      <div v-else-if="!refItem.link" class="text-xs text-gray-400 italic">
                        Not attached
                      </div>
                    </div>
                  </div>
                </div><!-- /PAGE 2 -->

              </div><!-- /bc-printable-document -->
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/store/useAuthStore';
import { useImg } from '~/composables/useImg';

const { locale } = useI18n();
const auth = useAuthStore();

const FORM_API_BASE = 'http://localhost:4000';

// ── Types ───────────────────────────────────────────────────────────────────
interface CommercialRow { activity: string; client: string; bonusFee: string; feeCharge: number | null; request: number | null; }
interface InternalRow   { activity: string; bonusFee: string; videoTitle: string; postDate: string; request: number | null; }
interface Approver      { name: string; position: string; }
interface ReferenceImage { url: string; width: number; height: number; ratio: number; aspectLocked: boolean; }
interface ReferenceItem { description?: string; link: string; images: ReferenceImage[]; uploading?: boolean; }

// ── Form State ───────────────────────────────────────────────────────────────
const form = reactive({
  name: '',
  departmentTitle: '',
  date: new Date().toISOString().slice(0, 10),
  reference: '',
  commercial: [
    { activity: 'Writing Article/Join Event',  client: '', bonusFee: 'Get 30% of Fee Charge', feeCharge: null, request: null },
    { activity: 'Editing Article',             client: '', bonusFee: 'Get $10/Article',        feeCharge: null, request: null },
    { activity: 'Video Voiceover/Interview',   client: '', bonusFee: '-Not Complete 100K Get 50%\n-Complete 100K Get 100%\n-Hit 100K/24h Get 150%\n-Hit 200K/24 Get 200%', feeCharge: null, request: null },
    { activity: 'FB Quote Banner',             client: '', bonusFee: 'Get $40/Client',         feeCharge: null, request: null },
    { activity: 'Banner Sponsor In Video',     client: '', bonusFee: 'Get $25/Client',         feeCharge: null, request: null },
    { activity: 'Sub-Camera',                  client: '', bonusFee: 'Get $10/Video',          feeCharge: null, request: null },
  ] as CommercialRow[],
  internal: [
    { activity: 'Hit Video Impact',        bonusFee: 'Get $15/Video',           videoTitle: '', postDate: '', request: null },
    { activity: 'Hit Video Impact Direct', bonusFee: 'Get $30/Video',           videoTitle: '', postDate: '', request: null },
    { activity: 'Hit FB Quote Banner',     bonusFee: 'Hit 1.5K Likes Get $5/Quote', videoTitle: '', postDate: '', request: null },
  ] as InternalRow[],
  approvers: {
    requestedBy: { name: '', position: '' },
    checkedBy:   { name: 'Name:…………', position: 'Position:…………' },
    checkedBy2:  { name: 'Name:…………', position: 'Position:…………' },
    verifiedBy:  { name: 'Ton Sreyphor', position: 'HR&Admin' },
    approvedBy:  { name: 'Sam Kosal', position: 'CEO' },
  } as Record<string, Approver>,
  references: [
    { description: '', link: '', images: [], uploading: false }
  ] as ReferenceItem[],
});

const approverKeys = ['requestedBy', 'checkedBy', 'checkedBy2', 'verifiedBy', 'approvedBy'] as const;

const formatApproverTitle = (key: string) => {
  const map: Record<string, string> = {
    requestedBy: 'Requested by:',
    checkedBy:   'Checked by:',
    checkedBy2:  'Checked by:',
    verifiedBy:  'Verified by:',
    approvedBy:  'Approved by:',
  };
  return map[key] ?? key;
};

// ── Auth prefill ─────────────────────────────────────────────────────────────
onMounted(() => {
  if (auth.user) {
    form.name = `${auth.user.first_name || ''} ${auth.user.last_name || ''}`.trim();
    form.departmentTitle = auth.user.department?.title || '';
    form.approvers.requestedBy.name = form.name;
    form.approvers.requestedBy.position = auth.user.title || '';
  }
});

// ── Computed totals ───────────────────────────────────────────────────────────
const totalCommercialFee     = computed(() => form.commercial.reduce((s, r) => s + (r.feeCharge || 0), 0));
const totalCommercialRequest = computed(() => form.commercial.reduce((s, r) => s + (r.request    || 0), 0));
const totalInternalRequest   = computed(() => form.internal.reduce((s, r) => s + (r.request      || 0), 0));
const totalBonusAmount       = computed(() => totalCommercialRequest.value + totalInternalRequest.value);

const currentDate = computed(() => {
  const d = new Date();
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
});

// ── Row helpers ───────────────────────────────────────────────────────────────
const calcCommercial = (_i: number) => { /* auto-calc if needed */ };

const addCommercial = () => form.commercial.push({ activity: '', client: '', bonusFee: '', feeCharge: null, request: null });
const removeCommercial = (i: number) => { if (form.commercial.length > 1) form.commercial.splice(i, 1); };

const addInternal = () => form.internal.push({ activity: '', bonusFee: '', videoTitle: '', postDate: '', request: null });
const removeInternal = (i: number) => { if (form.internal.length > 1) form.internal.splice(i, 1); };

const formatMoney = (val: number | null | undefined) => {
  if (!val && val !== 0) return '0.00';
  return Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ── Reference CRUD ──
const addReference = () => {
  form.references.push({ description: '', link: '', images: [] });
};

const removeReference = (idx: number) => {
  if (form.references.length > 1) form.references.splice(idx, 1);
};

// Image handling
const handleImages = async (e: Event, refIdx: number) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;

  const refItem = form.references[refIdx];
  if (!refItem.images) {
    refItem.images = [];
  }
  
  refItem.uploading = true;

  try {
    // 1. Create previews & fetch dimensions in parallel using temporary object URLs
    const filesArray = Array.from(files);
    const items = await Promise.all(
      filesArray.map((file) => {
        const blobUrl = URL.createObjectURL(file);
        return new Promise<{ blobUrl: string; width: number; height: number; ratio: number }>((resolve) => {
          const imgObj = new Image();
          imgObj.onload = () => {
            const w = imgObj.width;
            const h = imgObj.height;
            const ratio = w / h;
            const width = Math.min(150, w);
            const height = Math.round(width / ratio);
            resolve({ blobUrl, width, height, ratio });
          };
          imgObj.src = blobUrl;
        });
      })
    );

    const blobUrls = items.map(item => item.blobUrl);
    const startIdx = refItem.images.length;

    // Push local previews
    items.forEach((item) => {
      refItem.images.push({
        url: item.blobUrl,
        width: item.width,
        height: item.height,
        ratio: item.ratio,
        aspectLocked: true
      });
    });

    // 2. Upload to the backend
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    const res = await fetch(`${FORM_API_BASE}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Upload failed');
    }

    // 3. Replace blob preview URLs with persistent server URLs
    const serverUrls: string[] = json.data.map((f: any) => f.url);
    serverUrls.forEach((serverUrl, i) => {
      const imgIdx = startIdx + i;
      // Revoke the temporary blob URL
      URL.revokeObjectURL(blobUrls[i]);
      if (refItem.images[imgIdx]) {
        refItem.images[imgIdx].url = serverUrl;
      }
    });

  } catch (err: any) {
    console.error('Image upload failed:', err);
  } finally {
    refItem.uploading = false;
    (e.target as HTMLInputElement).value = '';
  }
};

const removeImage = (refIdx: number, imgIdx: number) => {
  form.references[refIdx].images.splice(imgIdx, 1);
};

const getImgSrc = (src: string) => {
  if (!src) return '';
  if (src.startsWith('data:') || src.startsWith('http')) return src;
  return useImg(src);
};

const hasAnyReference = computed(() => {
  return form.references.some(r => r.description || r.link || r.images.length);
});

const onWidthChange = (refIdx: number, imgIdx: number) => {
  const img = form.references[refIdx].images[imgIdx];
  if (img.aspectLocked && img.ratio) {
    img.height = Math.round(img.width / img.ratio);
  }
};

const onHeightChange = (refIdx: number, imgIdx: number) => {
  const img = form.references[refIdx].images[imgIdx];
  if (img.aspectLocked && img.ratio) {
    img.width = Math.round(img.height * img.ratio);
  }
};

const toggleAspectLock = (refIdx: number, imgIdx: number) => {
  const img = form.references[refIdx].images[imgIdx];
  img.aspectLocked = !img.aspectLocked;
  if (img.aspectLocked) {
    img.ratio = img.width / img.height;
  }
};

// Resizing logic for Preview Modal
const activeResizingImg = ref<{ refIdx: number; imgIdx: number; handle: string } | null>(null);
let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;

const startResize = (e: MouseEvent, refIdx: number, imgIdx: number, handle: string) => {
  e.preventDefault();
  e.stopPropagation();
  activeResizingImg.value = { refIdx, imgIdx, handle };
  startX = e.clientX;
  startY = e.clientY;
  
  const img = form.references[refIdx].images[imgIdx];
  startWidth = img.width;
  startHeight = img.height;
  
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
};

const handleResize = (e: MouseEvent) => {
  if (!activeResizingImg.value) return;
  const { refIdx, imgIdx, handle } = activeResizingImg.value;
  const img = form.references[refIdx].images[imgIdx];
  
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  
  let newWidth = startWidth;
  let newHeight = startHeight;
  
  if (handle.includes('right')) {
    newWidth = Math.max(30, startWidth + dx);
  } else if (handle.includes('left')) {
    newWidth = Math.max(30, startWidth - dx);
  }
  
  if (handle.includes('bottom')) {
    newHeight = Math.max(30, startHeight + dy);
  } else if (handle.includes('top')) {
    newHeight = Math.max(30, startHeight - dy);
  }
  
  if (img.aspectLocked && img.ratio) {
    if (handle === 'right' || handle === 'left') {
      newHeight = Math.round(newWidth / img.ratio);
    } else if (handle === 'bottom' || handle === 'top') {
      newWidth = Math.round(newHeight * img.ratio);
    } else {
      const scale = newWidth / startWidth;
      newHeight = Math.round(startHeight * scale);
    }
  }
  
  img.width = Math.min(Math.max(30, newWidth), 700);
  img.height = Math.min(Math.max(30, newHeight), 700);
};

const stopResize = () => {
  activeResizingImg.value = null;
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
};

const startResizeTouch = (e: TouchEvent, refIdx: number, imgIdx: number, handle: string) => {
  e.preventDefault();
  e.stopPropagation();
  const touch = e.touches[0];
  activeResizingImg.value = { refIdx, imgIdx, handle };
  startX = touch.clientX;
  startY = touch.clientY;
  
  const img = form.references[refIdx].images[imgIdx];
  startWidth = img.width;
  startHeight = img.height;
  
  document.addEventListener('touchmove', handleResizeTouch, { passive: false });
  document.addEventListener('touchend', stopResizeTouch);
};

const handleResizeTouch = (e: TouchEvent) => {
  if (!activeResizingImg.value) return;
  const touch = e.touches[0];
  const { refIdx, imgIdx, handle } = activeResizingImg.value;
  const img = form.references[refIdx].images[imgIdx];
  
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;
  
  let newWidth = startWidth;
  let newHeight = startHeight;
  
  if (handle.includes('right')) {
    newWidth = Math.max(30, startWidth + dx);
  } else if (handle.includes('left')) {
    newWidth = Math.max(30, startWidth - dx);
  }
  
  if (handle.includes('bottom')) {
    newHeight = Math.max(30, startHeight + dy);
  } else if (handle.includes('top')) {
    newHeight = Math.max(30, startHeight - dy);
  }
  
  if (img.aspectLocked && img.ratio) {
    if (handle === 'right' || handle === 'left') {
      newHeight = Math.round(newWidth / img.ratio);
    } else if (handle === 'bottom' || handle === 'top') {
      newWidth = Math.round(newHeight * img.ratio);
    } else {
      const scale = newWidth / startWidth;
      newHeight = Math.round(startHeight * scale);
    }
  }
  
  img.width = Math.min(Math.max(30, newWidth), 700);
  img.height = Math.min(Math.max(30, newHeight), 700);
};

const stopResizeTouch = () => {
  activeResizingImg.value = null;
  document.removeEventListener('touchmove', handleResizeTouch);
  document.removeEventListener('touchend', stopResizeTouch);
};

const resetForm = () => {
  form.commercial = [
    { activity: 'Writing Article/Join Event',  client: '', bonusFee: 'Get 30% of Fee Charge', feeCharge: null, request: null },
    { activity: 'Editing Article',             client: '', bonusFee: 'Get $10/Article',        feeCharge: null, request: null },
    { activity: 'Video Voiceover/Interview',   client: '', bonusFee: '', feeCharge: null, request: null },
    { activity: 'FB Quote Banner',             client: '', bonusFee: 'Get $40/Client',         feeCharge: null, request: null },
    { activity: 'Banner Sponsor In Video',     client: '', bonusFee: 'Get $25/Client',         feeCharge: null, request: null },
    { activity: 'Sub-Camera',                  client: '', bonusFee: 'Get $10/Video',          feeCharge: null, request: null },
  ];
  form.internal = [
    { activity: 'Hit Video Impact',        bonusFee: 'Get $15/Video',           videoTitle: '', postDate: '', request: null },
    { activity: 'Hit Video Impact Direct', bonusFee: 'Get $30/Video',           videoTitle: '', postDate: '', request: null },
    { activity: 'Hit FB Quote Banner',     bonusFee: 'Hit 1.5K Likes Get $5/Quote', videoTitle: '', postDate: '', request: null },
  ];
  form.date = new Date().toISOString().slice(0, 10);
  form.reference = '';
  form.references = [{ description: '', link: '', images: [], uploading: false }];
};

const submitForm = () => { console.log('Submitted BC commission:', JSON.stringify(form)); };

// ── Preview / Print / PDF ─────────────────────────────────────────────────────
const showPreview = ref(false);
const printDocument = () => { window.print(); };

const isDownloadingPdf = ref(false);
const downloadPdf = async () => {
  if (isDownloadingPdf.value) return;
  isDownloadingPdf.value = true;
  try {
    const html2pdf = (await import('html2pdf.js')).default;
    const el = document.getElementById('bc-printable-document');
    if (!el) return;
    await html2pdf()
      .set({
        margin: 0,
        filename: `BC-Commission-${form.name || 'request'}-${form.date}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          allowTaint: true, 
          logging: false,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc: Document) => {
            try {
              const container = clonedDoc.getElementById('bc-printable-document');
              if (container) {
                if (container.style && container.style.setProperty) {
                  container.style.setProperty('color-scheme', 'light', 'important');
                  container.style.setProperty('color', '#0f172a', 'important');
                }
                const all = container.getElementsByTagName('*');
                for (let i = 0; i < all.length; i++) {
                  try {
                    const item = all[i] as HTMLElement;
                    if (item.closest && item.closest('.no-print')) continue;
                    if (!item.style || !item.style.setProperty) continue;
                    
                    // Force dark text color, or blue for links
                    if (item.tagName && item.tagName.toLowerCase() === 'a') {
                      item.style.setProperty('color', '#1d4ed8', 'important');
                    } else {
                      item.style.setProperty('color', '#0f172a', 'important');
                    }
                    
                    // Force borders to be visible
                    if (item.tagName && ['table', 'th', 'td'].includes(item.tagName.toLowerCase())) {
                      item.style.setProperty('border-color', '#94a3b8', 'important');
                    }
                    
                    // Force background white for printable pages
                    if (item.classList && item.classList.contains('printable-a4')) {
                      item.style.setProperty('background-color', '#ffffff', 'important');
                    }
                    
                    item.style.setProperty('color-scheme', 'light', 'important');
                  } catch (itemErr) {
                    console.warn('onclone item error:', itemErr);
                  }
                }
              }
            } catch (err) {
              console.error('onclone main error:', err);
            }
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      })
      .from(el)
      .save();
  } finally {
    isDownloadingPdf.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media print {
  .no-print {
    display: none !important;
  }
  @page { size: A4 portrait; margin: 0; }
  html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
  body > * { display: none !important; }
  body > #bc-print-modal-wrapper {
    display: block !important;
    position: static !important;
    background: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    flex: none !important;
  }
  body > #bc-print-modal-wrapper .sticky,
  body > #bc-print-modal-wrapper button { display: none !important; }
  
  #bc-printable-document {
    display: block !important;
    position: static !important;
    width: 210mm !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    background: transparent !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    gap: 0 !important;
  }
  #bc-printable-document > * {
    overflow: visible !important;
    max-height: none !important;
  }

  /* Page 1 — fixed A4 */
  .printable-a4 {
    display: block !important;
    width: 210mm !important;
    height: 297mm !important;
    overflow: hidden !important;
    page-break-after: always !important;
    break-after: page !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    box-shadow: none !important;
    margin: 0 !important;
    position: relative !important;
    background-color: #ffffff !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Page 2+ — flow, no background */
  .printable-a4.printable-a4-flow {
    height: auto !important;
    min-height: 297mm !important;
    max-height: none !important;
    overflow: visible !important;
    page-break-after: auto !important;
    break-after: auto !important;
    page-break-inside: auto !important;
    break-inside: auto !important;
    background-image: none !important;
    background-color: #ffffff !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .printable-a4:last-of-type {
    page-break-after: avoid !important;
    break-after: avoid !important;
  }

  .printable-a4.printable-a4-flow h4 {
    page-break-after: avoid !important;
    break-after: avoid !important;
  }

  .printable-a4.printable-a4-flow table {
    page-break-before: avoid !important;
    break-before: avoid !important;
    page-break-inside: auto !important;
    break-inside: auto !important;
    width: 100% !important;
  }

  .printable-a4.printable-a4-flow thead {
    display: table-header-group !important;
    page-break-after: avoid !important;
    break-after: avoid !important;
  }

  .printable-a4.printable-a4-flow tbody tr {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  #bc-printable-document img {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    visibility: visible !important;
  }
}
</style>

<style>
/* Global overrides for print/PDF and teleported modal to prevent white text in dark mode */
#bc-printable-document,
#bc-printable-document * {
  color-scheme: light !important;
}

#bc-printable-document,
#bc-printable-document *:not(.no-print):not(.no-print *) {
  color: #0f172a !important; /* Force dark text color slate-900 */
}

#bc-printable-document a,
#bc-printable-document a * {
  color: #1d4ed8 !important; /* Force blue links */
}

/* Force border colors */
#bc-printable-document table,
#bc-printable-document th,
#bc-printable-document td {
  border-color: #94a3b8 !important;
}
</style>
