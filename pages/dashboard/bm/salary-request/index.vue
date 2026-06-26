<!-- pages/dashboard/bm/salary-request.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">

    <div class="mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">

      <!-- Header -->
      <div class="bg-[#1590de] px-6 py-4 text-white">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div class="flex items-center gap-3">
            <div class="bg-white p-1.5 rounded-md">
              <img src="/logo.png" alt="Baksey Media Logo" class="h-8 w-auto object-contain" />
            </div>
            <div class="h-7 w-px bg-white/25 hidden sm:block"></div>
            <div>
              <h1 class="text-base font-bold tracking-tight leading-tight">
                {{ locale === 'en' ? 'Salary Request Form' : 'Salary Request Form' }}
              </h1>
              <p class="text-[11px] text-white/70 font-medium mt-0.5">
                {{ locale === 'en' ? 'Business Manager Performance Incentive' : 'Business Manager Performance Incentive' }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" @click="fetchHistory"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-md transition-colors">
              <Icon icon="mdi:history" class="w-3.5 h-3.5"/>
              <span>{{ locale === 'en' ? 'View History' : 'View History' }}</span>
            </button>
            <div class="text-right bg-white/10 border border-white/20 px-3 py-1.5 rounded-md">
              <p class="text-[9px] text-white/60 uppercase tracking-widest font-semibold">Request Date</p>
              <p class="text-xs font-bold text-white">{{ formattedCurrentDate }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Form -->
      <form @submit.prevent="handleSubmit" class="p-5 space-y-5">

        <!-- Recipient & Date -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400">
              {{ locale === 'en' ? 'Recipient (To)' : 'Recipient (To)' }} <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-gray-400">
                <Icon icon="mdi:account-tie" class="w-4 h-4"/>
              </span>
              <input type="text" v-model="form.recipient" required
                class="w-full text-xs border border-gray-300 dark:border-gray-700 rounded-md pl-9 pr-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:border-[#1590de] focus:ring-1 focus:ring-[#1590de] transition-colors" />
            </div>
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400">
              {{ locale === 'en' ? 'Select Date' : 'Select Date' }} <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-gray-400">
                <Icon icon="mdi:calendar-month-outline" class="w-4 h-4"/>
              </span>
              <input type="date" v-model="form.date" required
                class="w-full text-xs border border-gray-300 dark:border-gray-700 rounded-md pl-9 pr-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:border-[#1590de] focus:ring-1 focus:ring-[#1590de] transition-colors" />
            </div>
          </div>
        </div>

        <div class="border-t border-gray-100 dark:border-gray-800"></div>

        <!-- Requester Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400">
              {{ locale === 'en' ? 'Requester Name' : 'Requester Name' }} <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-gray-400">
                <Icon icon="mdi:account" class="w-4 h-4"/>
              </span>
              <input type="text" v-model="form.requesterName" required placeholder="e.g. Sok Samnang"
                class="w-full text-xs border border-gray-300 dark:border-gray-700 rounded-md pl-9 pr-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:border-[#1590de] focus:ring-1 focus:ring-[#1590de] transition-colors" />
            </div>
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400">
              {{ locale === 'en' ? 'Position' : 'Position' }} <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-gray-400">
                <Icon icon="mdi:briefcase-outline" class="w-4 h-4"/>
              </span>
              <input type="text" v-model="form.requesterPosition" required placeholder="e.g. Business Manager"
                class="w-full text-xs border border-gray-300 dark:border-gray-700 rounded-md pl-9 pr-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:border-[#1590de] focus:ring-1 focus:ring-[#1590de] transition-colors" />
            </div>
          </div>
        </div>

        <!-- Target Achievements -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div class="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <Icon icon="mdi:checkbox-marked-circle-outline" class="w-4 h-4 text-[#1590de]" />
            <h3 class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              {{ locale === 'en' ? 'Target Achievements' : 'គោលដៅការងារ' }}
            </h3>
          </div>
          <div class="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <!-- Views -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-white dark:bg-gray-900">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{{ locale === 'en' ? 'Views' : 'វីយូ' }}</span>
                <span :class="viewsStatus.class" class="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">{{ viewsStatus.label }}</span>
              </div>
              <div class="flex items-baseline gap-1 mb-2">
                <span class="text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(form.actualViews) }}</span>
                <span class="text-[11px] text-gray-400">/ {{ formatNumber(form.targetViews) }}</span>
              </div>
              <div class="w-full bg-gray-100 dark:bg-gray-700 h-1 rounded-full overflow-hidden mb-3">
                <div class="h-full rounded-full transition-all duration-500" style="background-color:#1590de" :style="{ width: `${Math.min(100, (form.actualViews / form.targetViews) * 100)}%` }"></div>
              </div>
              <label class="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{{ locale === 'en' ? 'Actual Views' : 'វីយូសម្រេចបាន' }}</label>
              <input type="number" v-model.number="form.actualViews" min="0"
                class="w-full text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:border-[#1590de] focus:ring-1 focus:ring-[#1590de]" />
            </div>

            <!-- Interviews -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-white dark:bg-gray-900">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{{ locale === 'en' ? 'Interviews' : 'សម្ភាសន៍' }}</span>
                <span :class="interviewsStatus.class" class="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">{{ interviewsStatus.label }}</span>
              </div>
              <div class="flex items-baseline gap-1 mb-2">
                <span class="text-xl font-bold text-gray-900 dark:text-white">{{ form.actualInterviews }}</span>
                <span class="text-[11px] text-gray-400">/ {{ form.targetInterviews }}</span>
              </div>
              <div class="w-full bg-gray-100 dark:bg-gray-700 h-1 rounded-full overflow-hidden mb-3">
                <div class="h-full rounded-full transition-all duration-500" style="background-color:#1590de" :style="{ width: `${Math.min(100, (form.actualInterviews / form.targetInterviews) * 100)}%` }"></div>
              </div>
              <label class="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{{ locale === 'en' ? 'Actual Interviews' : 'សម្ភាសន៍សម្រេចបាន' }}</label>
              <input type="number" v-model.number="form.actualInterviews" min="0"
                class="w-full text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:border-[#1590de] focus:ring-1 focus:ring-[#1590de]" />
            </div>

            <!-- Articles -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-white dark:bg-gray-900">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{{ locale === 'en' ? 'Articles' : 'អត្ថបទ' }}</span>
                <span :class="articlesStatus.class" class="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">{{ articlesStatus.label }}</span>
              </div>
              <div class="flex items-baseline gap-1 mb-2">
                <span class="text-xl font-bold text-gray-900 dark:text-white">{{ form.actualArticles }}</span>
                <span class="text-[11px] text-gray-400">/ {{ form.targetArticles }}</span>
              </div>
              <div class="w-full bg-gray-100 dark:bg-gray-700 h-1 rounded-full overflow-hidden mb-3">
                <div class="h-full rounded-full transition-all duration-500" style="background-color:#1590de" :style="{ width: `${Math.min(100, (form.actualArticles / form.targetArticles) * 100)}%` }"></div>
              </div>
              <label class="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{{ locale === 'en' ? 'Actual Articles' : 'អត្ថបទសម្រេចបាន' }}</label>
              <input type="number" v-model.number="form.actualArticles" min="0"
                class="w-full text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:border-[#1590de] focus:ring-1 focus:ring-[#1590de]" />
            </div>
          </div>
        </div>

        <!-- Salary Amount -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div class="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <Icon icon="mdi:cash-multiple" class="w-4 h-4 text-[#1590de]" />
            <h3 class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              {{ locale === 'en' ? 'Requested Salary Amount' : 'ចំនួនទឹកប្រាក់ស្នើសុំ' }}
            </h3>
          </div>
          <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                {{ locale === 'en' ? 'Incentive Amount (USD)' : 'ចំនួនទឹកប្រាក់ (USD)' }} <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-[#1590de] font-bold text-sm">$</span>
                <input type="number" v-model.number="form.salaryAmount" required placeholder="0.00" step="any" min="0" @input="updateAmountWords"
                  class="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-md pl-7 pr-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-[#1590de] focus:ring-1 focus:ring-[#1590de] transition-colors" />
              </div>
            </div>
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                {{ locale === 'en' ? 'Amount in Words' : 'ចំនួនទឹកប្រាក់ជាអក្សរ' }} <span class="text-red-500">*</span>
              </label>
              <input type="text" v-model="form.salaryAmountWords" required placeholder="..."
                class="w-full text-xs border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:border-[#1590de] focus:ring-1 focus:ring-[#1590de] transition-colors" />
            </div>
          </div>
        </div>

        <!-- References & Proof -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <Icon icon="mdi:file-document-multiple-outline" class="w-4 h-4 text-[#1590de]" />
              <h3 class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                {{ locale === 'en' ? 'References & Proof' : 'ឯកសារយោង និងភស្តុតាង' }}
              </h3>
            </div>
            <button type="button" @click="addReference"
              class="flex items-center gap-1 px-2.5 py-1 text-[#1590de] border border-[#1590de] hover:bg-[#1590de] hover:text-white rounded text-xs font-semibold transition-colors">
              <Icon icon="mdi:plus" class="w-3.5 h-3.5" />
              {{ locale === 'en' ? 'Add Reference' : 'បន្ថែម' }}
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left">
              <thead class="bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 text-[10px] font-bold uppercase">
                <tr>
                  <th class="px-3 py-2 w-1/4">{{ locale === 'en' ? 'Category' : 'ប្រភេទ' }}</th>
                  <th class="px-3 py-2 w-1/3">{{ locale === 'en' ? 'Upload Image' : 'រូបភាពភស្តុតាង' }}</th>
                  <th class="px-3 py-2 w-1/3">{{ locale === 'en' ? 'Link URL' : 'តំណភ្ជាប់ URL' }}</th>
                  <th class="px-3 py-2 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                <tr v-for="(refItem, index) in form.references" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <!-- Category -->
                  <td class="px-3 py-2">
                    <select v-model="refItem.category"
                      class="w-full border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-white text-xs focus:outline-none focus:border-[#1590de]">
                      <option value="views_proof">{{ locale === 'en' ? 'Views Proof (200k)' : 'ភស្តុតាងវីយូ ២០០ខេ' }}</option>
                      <option value="interviews_proof">{{ locale === 'en' ? 'Interviews Proof (4)' : 'ភស្តុតាងសម្ភាសន៍ ៤' }}</option>
                      <option value="articles_proof">{{ locale === 'en' ? 'Articles Proof (50)' : 'ភស្តុតាងអត្ថបទ ៥០' }}</option>
                      <option value="other">{{ locale === 'en' ? 'Other Reference' : 'ឯកសារយោងផ្សេងទៀត' }}</option>
                    </select>
                  </td>
                  <!-- Image upload -->
                  <td class="px-3 py-2">
                    <div class="flex flex-col gap-1.5">
                      <div class="relative">
                        <input type="file" multiple :disabled="refItem.uploading" @change="(e) => handleFileChange(e, index)"
                          class="block w-full text-[10px] text-gray-500 dark:text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-[#1590de]/10 file:text-[#1590de] hover:file:bg-[#1590de]/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all" />
                        <div v-if="refItem.uploading" class="flex items-center gap-1 mt-0.5 text-[10px] text-[#1590de]">
                          <Icon icon="mdi:loading" class="w-3 h-3 animate-spin" />
                          <span>{{ locale === 'en' ? 'Uploading...' : 'កំពុងផ្ទុក...' }}</span>
                        </div>
                      </div>
                      <div v-if="refItem.images && refItem.images.length" class="flex flex-wrap gap-1.5">
                        <div v-for="(img, imgIdx) in refItem.images" :key="imgIdx" class="relative group">
                          <div v-if="img.startsWith('blob:')" class="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700 animate-pulse border border-gray-200 dark:border-gray-700" />
                          <img v-else :src="getImgSrc(img)" @click="viewReferenceImage(img)" class="h-8 w-8 object-cover rounded border border-gray-200 dark:border-gray-700 cursor-pointer" alt="Reference Image" />
                          <button type="button" @click="removeReferenceImage(index, imgIdx)" class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Icon icon="mdi:close" class="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <!-- Link URL -->
                  <td class="px-3 py-2">
                    <input v-model="refItem.link" type="url" placeholder="https://..."
                      class="w-full border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-white text-xs focus:outline-none focus:border-[#1590de]" />
                  </td>
                  <!-- Delete row -->
                  <td class="px-3 py-2 text-center">
                    <button type="button" @click="removeReference(index)" v-if="form.references.length > 1" class="text-gray-400 hover:text-red-500 transition-colors">
                      <Icon icon="mdi:delete-outline" class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button type="button" @click="openPreview"
            class="px-5 py-2 border border-[#1590de] text-[#1590de] hover:bg-[#1590de] hover:text-white text-sm font-semibold rounded-md transition-colors flex items-center gap-2">
            <Icon icon="mdi:eye-outline" class="w-4 h-4" />
            <span>{{ locale === 'en' ? 'Preview' : 'Preview' }}</span>
          </button>
          <button type="submit" :disabled="isSubmitting"
            class="px-5 py-2 bg-[#1590de] hover:bg-[#1278c2] text-white text-sm font-semibold rounded-md transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            <Icon v-if="isSubmitting" icon="mdi:loading" class="w-4 h-4 animate-spin" />
            <Icon v-else-if="submitSuccess" icon="mdi:check-circle" class="w-4 h-4 text-green-300" />
            <Icon v-else icon="mdi:send-check-outline" class="w-4 h-4" />
            <span v-if="isSubmitting">{{ locale === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...' }}</span>
            <span v-else-if="submitSuccess">{{ locale === 'en' ? 'Saved! Opening Preview...' : 'បានរក្សាទុក!' }}</span>
            <span v-else>{{ locale === 'en' ? 'Save & Preview' : 'រក្សាទុក និងមើលផ្ទៃ' }}</span>
          </button>
        </div>

      </form>
    </div>

    <!-- A4 Document Preview Modal (Teleported to Body) -->
    <Teleport to="body">
      <Transition name="fade">
        <div id="print-modal-wrapper" v-if="showPreview" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" @click.self="closePreview">
          <div class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden transition-all duration-300">
            
            <!-- Modal Header -->
            <div class="sticky top-0 z-10 bg-[#1590de] px-6 py-4 flex items-center justify-between text-white">
              <div class="flex items-center gap-2.5">
                <Icon icon="mdi:file-document-outline" class="w-6 h-6 text-white" />
                <h2 class="text-xl font-bold">{{ locale === 'en' ? 'Official Document Preview' : 'ទិដ្ឋភាពសារជាផ្លូវការ' }}</h2>
              </div>
              <div class="flex items-center gap-2">
                <button @click="downloadPdf" :disabled="isDownloadingPdf" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center gap-1.5 text-sm font-semibold">
                  <Icon v-if="!isDownloadingPdf" icon="mdi:file-download-outline" class="w-5 h-5" />
                  <Icon v-else icon="mdi:loading" class="w-5 h-5 animate-spin" />
                  {{ isDownloadingPdf ? 'Generating...' : (locale === 'en' ? 'Download PDF' : 'ទា PDF') }}
                </button>
                <button @click="printDocument" class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all flex items-center gap-1.5 text-sm font-semibold">
                  <Icon icon="mdi:printer" class="w-5 h-5" />
                  {{ locale === 'en' ? 'Print / Save PDF' : 'បោះពុម្ព / សា PDF' }}
                </button>
                <button @click="closePreview" class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center justify-center">
                  <Icon icon="mdi:close" class="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <!-- Modal Body (Printable A4 Content) -->
            <div class="overflow-y-auto flex-1 bg-gray-250 dark:bg-gray-950 p-8 flex flex-col items-center gap-8">
              <div id="printable-document" class="flex flex-col items-center gap-8 bg-transparent">
                
                <!-- PAGE 1: Official Confirmation & Signatures -->
                <div class="bg-white text-gray-950 relative overflow-hidden font-khmer printable-a4 shadow-xl" style="width: 210mm; height: 297mm; padding: 20mm 20mm 38mm 20mm; background-image: url('/business-cambodia-kpi-bg.png'); background-size: cover; background-repeat: no-repeat; background-position: center;">

                  <div class="relative z-10 flex flex-col justify-between h-full min-h-[239mm]">
                    
                    <!-- Main Document Content -->
                    <div class="space-y-8">
                      <!-- Title -->
                      <div class="text-center space-y-2">
                        <h1 class="text-3xl font-bold font-hanuman text-gray-950 border-b-2 border-double border-gray-900 pb-2 inline-block">
                          លិខិតបញ្ជាក
                        </h1>
                        <p class="text-sm font-semibold text-gray-800">
                          កាលបរិច្ឆេទ: ថ្ងៃទី {{ khmerDateDetails.day }} ខែ {{ khmerDateDetails.month }} ឆ្នាំ {{ khmerDateDetails.year }}
                        </p>
                      </div>

                      <!-- Addressed To -->
                      <div class="text-lg space-y-1 mt-4">
                        <p class="font-bold font-hanuman">ជូនចំពោះ៖ នាយកប្រតិបត្តិ សំ កុសល</p>
                        <p class="font-bold text-gray-800">
                          កម្មវត្ថុ៖ <span class="font-normal">សំណើសុំពិនិត្យ និងអនុម័តលើការបើកប្រាក់បករវត្សន៍ចំនួន <span class="font-bold text-black font-hanuman">{{ formatMoney(form.salaryAmount) }}</span> ដុល្លាររ។</span>
                        </p>
                      </div>

                      <!-- Letter Body Description -->
                      <div class="text-md leading-8 text-justify font-normal text-gray-900 space-y-4 font-hanuman">
                        <p>
                          ដោយយោងតាមគោលដៅការងារដែលបានកំណត់ក្នុងការបំពេញការងារឱ្យបានវីយ 
                          <span class="font-bold text-black">{{ formatNumber(form.targetViews) }}</span> នៅលើវេបសាយសម្ភាសន៍ឱ្យបានយ៉ាងតិច
                          <span class="font-bold text-black">{{ form.targetInterviews }}</span> និងសរសេរអ្ថបទសរុបឱ្យបានយ៉ាងតិ
                          <span class="font-bold text-black">{{ form.targetArticles }}</span> អ្ថបទ
                        </p>
                        <p>
                          អុលោមទៅតាមគោលការណ៍ផ្តល់រង្វាន់លើកទឹកចិត្តរបស់ក្រុមហ៊ុន នាងខ្ញុំ/ខ្ញុំបាទ 
                          <span class="font-bold text-black underline decoration-dotted underline-offset-4">{{ form.requesterName || '...............' }}</span> 
                          ក្នុងនាមជា <span class="font-bold text-black">{{ form.requesterPosition || '...............' }}</span> 
                          សូមស្នើសុំការពិនិត្ និងអនុម័តលើការបើកប្រាក់រង្វាន់បៀរវត្សន៍ចំនួន 
                          <span class="font-bold text-black">{{ formatMoney(form.salaryAmount) }} ដុល្លារ</span> 
                          (ជាអ្សរ៖ <span class="font-bold text-black italic">{{ form.salaryAmountWords || '................' }}</span>)
                        </p>
                      </div>
                    </div>

                    <!-- Signatures section -->
                    <div class="mt-8 font-hanuman text-xs">
                      <div class="grid grid-cols-4 gap-2 text-center w-full">
                        <!-- Column 1: Requester -->
                        <div class="flex flex-col items-center">
                          <p class="font-bold text-[11px]">ស្នើកម្មវត្ថុ៖ដោយ៖</p>
                          <div class="h-12"></div> <!-- physical signature gap -->
                          <div class="w-3/4 border-b border-gray-400 mb-1"></div>
                          <p class="font-bold text-black min-h-[16px]">{{ form.requesterName || '..................' }}</p>
                          <p class="text-[10px] text-gray-600 min-h-[16px]">{{ form.requesterPosition || '..................' }}</p>
                          <p class="text-[10px] text-gray-650 mt-2 font-mono">Date: .../.../......</p>
                        </div>

                        <!-- Column 2: Business Manager Check (blank) -->
                        <div class="flex flex-col items-center">
                          <p class="font-bold text-[11px]">ពិនិត្យដោយ៖</p>
                          <div class="h-12"></div> <!-- physical signature gap -->
                          <div class="w-3/4 border-b border-gray-400 mb-1"></div>
                          <p class="font-bold text-black min-h-[16px]">..................</p>
                          <p class="text-[10px] text-gray-600 min-h-[16px]">..................</p>
                          <p class="text-[10px] text-gray-650 mt-2 font-mono">Date: .../.../......</p>
                        </div>

                        <!-- Column 3: HR Check (Tun Sreyphos) -->
                        <div class="flex flex-col items-center">
                          <p class="font-bold text-[11px]">ពិនិត្យដោយ៖</p>
                          <div class="h-12"></div> <!-- physical signature gap -->
                          <div class="w-3/4 border-b border-gray-400 mb-1"></div>
                          <p class="font-bold text-black min-h-[16px]">ទុយ ស្រីភ័ក្រ</p>
                          <p class="text-[10px] text-gray-600 min-h-[16px]">Admin&amp;HR</p>
                          <p class="text-[10px] text-gray-650 mt-2 font-mono">Date: .../.../......</p>
                        </div>

                        <!-- Column 4: CEO approval (Sam Kosal) -->
                        <div class="flex flex-col items-center">
                          <p class="font-bold text-[11px]">បានឃើញ និងឯកភាពដោយ</p>
                          <div class="h-12"></div> <!-- physical signature gap -->
                          <div class="w-3/4 border-b border-gray-400 mb-1"></div>
                          <p class="font-bold text-black min-h-[16px]">សំ កុសល</p>
                          <p class="text-[10px] text-gray-600 min-h-[16px]">CEO</p>
                          <p class="text-[10px] text-gray-650 mt-2 font-mono">Date: .../.../......</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- PAGE 2+: References & Proof Annex Sheet (auto-height, grows with content) -->
                <div class="bg-white text-gray-950 font-khmer printable-a4 printable-a4-flow shadow-xl"
                     style="width: 210mm; min-height: 297mm; padding: 20mm 20mm 20mm 20mm; position: relative;">

                  <div class="relative z-10 space-y-4">
                    <h4 class="text-md font-bold uppercase tracking-wider text-gray-800 font-hanuman border-b border-gray-300 pb-2 flex items-center gap-2">
                      <span>ឧសម្ព័ន្ធ សារយោង និងភស្តុតាងភ្ជាប់</span>
                      <span class="text-xs font-normal text-gray-500 font-sans">(Annex: References &amp; Proof)</span>
                    </h4>
                    <table class="w-full border border-gray-400 text-xs text-left">
                      <thead>
                        <tr class="bg-gray-100 border-b border-gray-400">
                          <th class="px-4 py-2 border-r border-gray-400 w-1/3">ប្រភេទភស្តុតាង</th>
                          <th class="px-4 py-2 border-r border-gray-400 w-1/4 text-center">សម្រេចបាន</th>
                          <th class="px-4 py-2">តំណភ្ជាប់ / រូបភាព</th>
                        </tr>
                      </thead>
                      <tbody>
                        <!-- Views -->
                        <tr class="border-b border-gray-400">
                          <td class="px-4 py-2 border-r border-gray-400 font-semibold font-hanuman">ភស្តុតាងចំនួនវីយូ ២០០ខេ</td>
                          <td class="px-4 py-2 border-r border-gray-400 text-center font-bold font-hanuman">
                            {{ formatNumber(form.actualViews) }} / {{ formatNumber(form.targetViews) }}
                          </td>
                          <td class="px-4 py-2 font-mono">
                            <div class="flex flex-col gap-1">
                              <a v-if="getRefLinkByCategory('views_proof')" :href="getRefLinkByCategory('views_proof')" target="_blank" class="text-blue-700 hover:underline break-all block">
                                {{ getRefLinkByCategory('views_proof') }}
                              </a>
                              <div v-if="getRefImagesByCategory('views_proof').length" class="mt-1 flex flex-wrap gap-1.5">
                                <img v-for="(img, imgIdx) in getRefImagesByCategory('views_proof')" :key="imgIdx" :src="getImgSrc(img)" class="h-28 w-auto object-contain rounded border border-gray-300" alt="Views Proof" />
                              </div>
                              <span v-if="!getRefLinkByCategory('views_proof') && !getRefImagesByCategory('views_proof').length" class="text-gray-400 italic">
                                Not attached
                              </span>
                            </div>
                          </td>
                        </tr>
                        <!-- Interviews -->
                        <tr class="border-b border-gray-400">
                          <td class="px-4 py-2 border-r border-gray-400 font-semibold font-hanuman">ភស្តុតាងសម្ភាសន៍ ៤ លើវេបសាយ</td>
                          <td class="px-4 py-2 border-r border-gray-400 text-center font-bold font-hanuman">
                            {{ form.actualInterviews }} / {{ form.targetInterviews }}
                          </td>
                          <td class="px-4 py-2 font-mono">
                            <div class="flex flex-col gap-1">
                              <a v-if="getRefLinkByCategory('interviews_proof')" :href="getRefLinkByCategory('interviews_proof')" target="_blank" class="text-blue-700 hover:underline break-all block">
                                {{ getRefLinkByCategory('interviews_proof') }}
                              </a>
                              <div v-if="getRefImagesByCategory('interviews_proof').length" class="mt-1 flex flex-wrap gap-1.5">
                                <img v-for="(img, imgIdx) in getRefImagesByCategory('interviews_proof')" :key="imgIdx" :src="getImgSrc(img)" class="h-28 w-auto object-contain rounded border border-gray-300" alt="Interviews Proof" />
                              </div>
                              <span v-if="!getRefLinkByCategory('interviews_proof') && !getRefImagesByCategory('interviews_proof').length" class="text-gray-400 italic">
                                Not attached
                              </span>
                            </div>
                          </td>
                        </tr>
                        <!-- Articles -->
                        <tr class="border-b border-gray-400">
                          <td class="px-4 py-2 border-r border-gray-400 font-semibold font-hanuman">ភស្តុតាងសរសេរអត្ថបទសរុប</td>
                          <td class="px-4 py-2 border-r border-gray-400 text-center font-bold font-hanuman">
                            {{ form.actualArticles }} / {{ form.targetArticles }}
                          </td>
                          <td class="px-4 py-2 font-mono">
                            <div class="flex flex-col gap-1">
                              <a v-if="getRefLinkByCategory('articles_proof')" :href="getRefLinkByCategory('articles_proof')" target="_blank" class="text-blue-700 hover:underline break-all block">
                                {{ getRefLinkByCategory('articles_proof') }}
                              </a>
                              <div v-if="getRefImagesByCategory('articles_proof').length" class="mt-1 flex flex-wrap gap-1.5">
                                <img v-for="(img, imgIdx) in getRefImagesByCategory('articles_proof')" :key="imgIdx" :src="getImgSrc(img)" class="h-28 w-auto object-contain rounded border border-gray-300" alt="Articles Proof" />
                              </div>
                              <span v-if="!getRefLinkByCategory('articles_proof') && !getRefImagesByCategory('articles_proof').length" class="text-gray-400 italic">
                                Not attached
                              </span>
                            </div>
                          </td>
                        </tr>
                        <!-- Other if any -->
                        <tr v-for="(refItem, refIndex) in form.references.filter(r => r.category === 'other')" :key="'other-' + refIndex" class="border-b border-gray-400">
                          <td class="px-4 py-2 border-r border-gray-400 font-semibold font-hanuman">សារយោងផ្សេងទក</td>
                          <td class="px-4 py-2 border-r border-gray-400 text-center font-bold font-hanuman">-</td>
                          <td class="px-4 py-2 font-mono">
                            <div class="flex flex-col gap-1">
                              <a v-if="refItem.link" :href="refItem.link" target="_blank" class="text-blue-700 hover:underline break-all block">
                                {{ refItem.link }}
                              </a>
                              <div v-if="refItem.images && refItem.images.length" class="mt-1 flex flex-wrap gap-1.5">
                                <img v-for="(img, imgIdx) in refItem.images" :key="imgIdx" :src="getImgSrc(img)" class="h-28 w-auto object-contain rounded border border-gray-300" alt="Other Proof" />
                              </div>
                              <span v-if="!refItem.link && (!refItem.images || !refItem.images.length)" class="text-gray-400 italic">
                                Not attached
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Fullscreen Reference Image Viewer -->
    <Teleport to="body">
      <div v-if="activeImageViewer" class="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 p-4" @click="activeImageViewer = null">
        <button class="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-lg bg-white/10">
          <Icon icon="mdi:close" class="w-8 h-8" />
        </button>
        <img :src="getImgSrc(activeImageViewer)" class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" alt="Reference Viewer" />
      </div>
    </Teleport>

    <!-- History Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showHistoryModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="showHistoryModal = false">
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300">
            <!-- Modal Header -->
            <div class="bg-[#1590de] px-6 py-4 flex items-center justify-between text-white">
              <div class="flex items-center gap-2">
                <Icon icon="mdi:history" class="w-6 h-6"/>
                <h2 class="text-xl font-bold">{{ locale === 'en' ? 'Salary Request History' : 'ប្រវត្តិស្នើសុំប្រាក់បៀរវត្សន៍' }}</h2>
              </div>
              <button @click="showHistoryModal = false" class="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <Icon icon="mdi:close" class="w-5 h-5" />
              </button>
            </div>
            <!-- Modal Body -->
            <div class="p-6 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-950/40 space-y-4">
              <div v-if="historyLoading" class="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
                <Icon icon="mdi:loading" class="w-10 h-10 animate-spin text-blue-500"/>
                <span>{{ locale === 'en' ? 'Loading history...' : 'កំពុងទាញយកទិន្នន័យ...' }}</span>
              </div>
              <div v-else-if="historyError" class="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center gap-2 border border-red-200 dark:border-red-800">
                <Icon icon="mdi:alert-circle-outline" class="w-5 h-5"/>
                <span>{{ historyError }}</span>
              </div>
              <div v-else-if="historyList.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-500 gap-2">
                <Icon icon="mdi:text-box-remove-outline" class="w-16 h-16 text-gray-300 dark:text-gray-700"/>
                <p class="font-medium">{{ locale === 'en' ? 'No salary requests found.' : 'មិនទាន់មានប្រវត្តិស្នើសុំនៅឡើយទេ' }}</p>
              </div>
              <div v-else class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                <table class="w-full text-left text-sm">
                  <thead class="bg-gray-50 dark:bg-gray-850/80 text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">
                    <tr>
                      <th class="px-4 py-3">Date</th>
                      <th class="px-4 py-3">Requester</th>
                      <th class="px-4 py-3">Recipient</th>
                      <th class="px-4 py-3">Amount</th>
                      <th class="px-4 py-3 text-center">Status</th>
                      <th class="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900/50">
                    <tr v-for="item in historyList" :key="item.id" class="hover:bg-blue-50/20 dark:hover:bg-blue-900/5 transition-colors">
                      <td class="px-4 py-3 font-medium whitespace-nowrap">{{ formatDateString(item.request_date) }}</td>
                      <td class="px-4 py-3">
                        <div class="font-semibold text-gray-900 dark:text-white">{{ item.requester_name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.requester_position }}</div>
                      </td>
                      <td class="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 max-w-[150px] truncate" :title="item.recipient">{{ item.recipient }}</td>
                      <td class="px-4 py-3 font-bold text-gray-900 dark:text-white">${{ formatMoney(item.salary_amount) }}</td>
                      <td class="px-4 py-3 text-center">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize" :class="statusClass(item.status)">
                          {{ item.status }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-right">
                        <button type="button" @click="goToLoadForm(item)" class="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1590de] hover:bg-[#1278c2] text-white text-xs font-semibold rounded-lg transition-colors">
                          <Icon icon="mdi:open-in-new" class="w-3.5 h-3.5"/>
                          <span>{{ locale === 'en' ? 'Load Form' : 'ចម្លងទិន្នន័យ' }}</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/store/useAuthStore';
import { useApi } from '~/composables/useApi';
import { useImg } from '~/composables/useImg';

const { locale } = useI18n();
const auth = useAuthStore();

// Setup reactive form state
const form = reactive({
  recipient: 'លោក សំ កុសល (នាយកប្រតិបត្តិ)',
  date: '',
  requesterName: '',
  requesterPosition: '',
  targetViews: 200000,
  actualViews: 0,
  targetInterviews: 4,
  actualInterviews: 0,
  targetArticles: 50,
  actualArticles: 0,
  salaryAmount: null as number | null,
  salaryAmountWords: '',
  references: [
    { category: 'views_proof', images: [] as string[], link: '', uploading: false },
    { category: 'interviews_proof', images: [] as string[], link: '', uploading: false },
    { category: 'articles_proof', images: [] as string[], link: '', uploading: false }
  ] as Array<{ category: string; images: string[]; link: string; uploading: boolean }>
});

const showPreview = ref(false);
const activeImageViewer = ref<string | null>(null);

// Helper function to get KPI period start and end dates based on 24th of month cycle
const getKpiPeriodDates = (targetDate: Date) => {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const day = targetDate.getDate();
  
  let fromYear = year;
  let fromMonth = month;
  if (day < 24) {
    fromMonth = month - 1;
    if (fromMonth < 0) {
      fromMonth = 11;
      fromYear = year - 1;
    }
  }
  
  const fromDate = new Date(fromYear, fromMonth, 24, 0, 0, 0, 0);
  const toYear = fromMonth === 11 ? fromYear + 1 : fromYear;
  const toMonth = (fromMonth + 1) % 12;
  const toDate = new Date(toYear, toMonth, 24, 0, 0, 0, 0);
  
  return { from: fromDate, to: toDate };
};

// Fetch achievements count dynamically from directus API endpoints
const fetchWriterAchievements = async () => {
  if (!auth.user?.id) return;
  
  try {
    // 1. Fetch writer targets and article views
    const writerResponse = await useApi<any>(
      `/items/writers?filter[staff][_eq]=${auth.user.id}&fields=*,remarks.*&deep[remarks][_limit]=-1`,
      { method: 'GET' }
    );
    
    const writer = writerResponse.data?.[0];
    if (writer) {
      if (writer.target) {
        form.targetViews = parseInt(writer.target) || 200000;
      }
      
      const selectedDate = form.date ? new Date(form.date) : new Date();
      const kpiPeriod = getKpiPeriodDates(selectedDate);
      
      const remarksInPeriod = (writer.remarks || []).filter((r: any) => {
        const createdDate = new Date(r.date_created);
        return createdDate >= kpiPeriod.from && createdDate < kpiPeriod.to;
      });
      
      form.actualViews = remarksInPeriod
        .filter((r: any) => !r.pr)
        .reduce((sum: number, r: any) => sum + (parseInt(r.view || '0') || 0), 0);
        
      form.actualArticles = remarksInPeriod.length;
    }
    

    
  } catch (error) {
    console.error('Failed to fetch writer achievements:', error);
  }
};

// Watch logged-in user profile changes to populate fields
watch(() => auth.user, (user) => {
  if (user) {
    form.requesterName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    form.requesterPosition = user.title || 'Business Manager';
    fetchWriterAchievements();
  } else {
    form.requesterName = 'សុខ សំណាង';
    form.requesterPosition = 'Business Manager';
  }
}, { immediate: true });

// Populate default data on mount
onMounted(async () => {
  // Set today's date in input field format
  const today = new Date();
  form.date = today.toISOString().split('T')[0];

  // Pre-fill recipient text
  updateRecipientLabel();
  
  // Load achievements
  await fetchWriterAchievements();
});

// Watch request date change to reload achievements for that specific period
watch(() => form.date, () => {
  fetchWriterAchievements();
});

// Watch locale to update pre-filled values
const updateRecipientLabel = () => {
  if (locale.value === 'en') {
    form.recipient = 'Mr. Sam Kosal (Executive Director)';
  } else {
    form.recipient = 'លោក សំ កុសល (នាយកប្រតិបត្តិ)';
  }
};

// Listen to locale changes
watch(locale, () => {
  updateRecipientLabel();
});

// Format today's date based on locale
const formattedCurrentDate = computed(() => {
  if (!form.date) return '';
  const dateObj = new Date(form.date);
  
  if (locale.value === 'km') {
    const khmerMonths = [
      'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
      'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
    ];
    // Simple Khmer digits conversion
    const toKhmerDigits = (num: number) => {
      const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
      return String(num).split('').map(digit => khmerDigits[parseInt(digit)] || digit).join('');
    };

    const d = toKhmerDigits(dateObj.getDate());
    const m = khmerMonths[dateObj.getMonth()];
    const y = toKhmerDigits(dateObj.getFullYear());

    return `ថ្ងៃទី${d} ខែ${m} ឆ្នាំ${y}`;
  } else {
    return dateObj.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
});

// Return separate day, month, year in Khmer for print preview
const khmerDateDetails = computed(() => {
  if (!form.date) return { day: '.....', month: '..........', year: 'អ...' };
  const dateObj = new Date(form.date);
  const khmerMonths = [
    'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
    'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
  ];
  const toKhmerDigits = (num: number) => {
    const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    return String(num).split('').map(digit => khmerDigits[parseInt(digit)] || digit).join('');
  };

  return {
    day: toKhmerDigits(dateObj.getDate()),
    month: khmerMonths[dateObj.getMonth()],
    year: toKhmerDigits(dateObj.getFullYear())
  };
});

// Target comparison helper for views status
const viewsStatus = computed(() => {
  if (form.actualViews >= form.targetViews) {
    return {
      label: locale.value === 'en' ? 'Target Met' : 'សម្រេចគោលដៅ',
      class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    };
  }
  return {
    label: locale.value === 'en' ? 'In Progress' : 'កំពុងដំណើរការ',
    class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  };
});

// Target comparison helper for interviews status
const interviewsStatus = computed(() => {
  if (form.actualInterviews >= form.targetInterviews) {
    return {
      label: locale.value === 'en' ? 'Target Met' : 'សម្រេចគោលដៅ',
      class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    };
  }
  return {
    label: locale.value === 'en' ? 'In Progress' : 'កំពុងដំណើរការ',
    class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  };
});

// Target comparison helper for articles status
const articlesStatus = computed(() => {
  if (form.actualArticles >= form.targetArticles) {
    return {
      label: locale.value === 'en' ? 'Target Met' : 'សម្រេចគោលដៅ',
      class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    };
  }
  return {
    label: locale.value === 'en' ? 'In Progress' : 'កំពុងដំណើរការ',
    class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  };
});

// Format thousands separator
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num || 0);
};

// Format money with double decimal
const formatMoney = (value: number | null): string => {
  if (value === null) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// References helpers
const addReference = () => {
  form.references.push({ category: 'other', images: [] as string[], link: '', uploading: false });
};

const removeReference = (index: number) => {
  if (form.references.length > 1) {
    const item = form.references[index];
    if (item && item.images) {
      item.images.forEach(img => {
        if (img.startsWith('blob:')) {
          URL.revokeObjectURL(img);
        }
      });
    }
    form.references.splice(index, 1);
  }
};

const hasOtherReferences = computed(() => {
  return form.references.some(r => r.category === 'other');
});

const getRefLinkByCategory = (category: string): string => {
  const item = form.references.find(r => r.category === category);
  return item && item.link ? item.link : '';
};

const getRefImagesByCategory = (category: string): string[] => {
  const item = form.references.find(r => r.category === category);
  return item && item.images ? item.images : [];
};

// Helper to determine image source (local blob/data URL or CMS asset URL)
const getImgSrc = (img: string) => {
  if (!img) return '';
  if (img.startsWith('blob:') || img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://')) {
    return img;
  }
  return useImg(img);
};

// Upload files to Node API /api/upload, show local blob preview immediately,
// then replace with the persistent server URL once the upload resolves.
const handleFileChange = async (e: any, index: number) => {
  const files: FileList = e.target.files;
  if (!files || files.length === 0) return;

  if (!form.references[index].images) {
    form.references[index].images = [];
  }

  // Mark this reference row as uploading
  form.references[index].uploading = true;

  try {
    // 1. Add local blob previews immediately so the user sees the images right away
    const blobUrls: string[] = [];
    const startIdx = form.references[index].images.length;
    for (let i = 0; i < files.length; i++) {
      const blobUrl = URL.createObjectURL(files[i]);
      blobUrls.push(blobUrl);
      form.references[index].images.push(blobUrl);
    }

    // 2. Upload all selected files to the backend in one request
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

    // 3. Replace blob preview URLs with the permanent server URLs
    const serverUrls: string[] = json.data.map((f: any) => f.url);
    serverUrls.forEach((serverUrl, i) => {
      const imgIdx = startIdx + i;
      // Revoke the temporary blob URL
      URL.revokeObjectURL(blobUrls[i]);
      form.references[index].images[imgIdx] = serverUrl;
    });

  } catch (err: any) {
    console.error('Image upload failed:', err);
    // Keep blob URLs as fallback so the user still sees previews
  } finally {
    form.references[index].uploading = false;
    // Reset the file input so the same file can be re-selected if needed
    e.target.value = '';
  }
};

// Remove single image from references index array
const removeReferenceImage = (refIndex: number, imgIndex: number) => {
  const item = form.references[refIndex];
  if (item && item.images) {
    const imgUrl = item.images[imgIndex];
    // Only revoke if it's still a local blob (shouldn't be after upload, but just in case)
    if (imgUrl && imgUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imgUrl);
    }
    item.images.splice(imgIndex, 1);
  }
};

// View image utility
const viewReferenceImage = (fileId: string) => {
  activeImageViewer.value = fileId;
};

// Number to Words Converter helper
const updateAmountWords = () => {
  if (!form.salaryAmount) {
    form.salaryAmountWords = '';
    return;
  }
  form.salaryAmountWords = numberToWords(form.salaryAmount);
};

const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero';
  
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const g = ['', 'Thousand', 'Million', 'Million', 'Billion', 'Trillion'];
  
  const chunk = (n: number) => {
    let str = '';
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += b[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += a[n] + ' ';
    }
    return str.trim();
  };

  let str = '';
  let i = 0;
  let integerPart = Math.floor(num);
  let decimalPart = Math.round((num - integerPart) * 100);

  if (integerPart === 0) {
    str = 'Zero';
  } else {
    while (integerPart > 0) {
      let rem = integerPart % 1000;
      if (rem > 0) {
        str = chunk(rem) + (g[i] ? ' ' + g[i] : '') + ' ' + str;
      }
      integerPart = Math.floor(integerPart / 1000);
      i++;
    }
  }
  
  str = str.trim() + ' Dollars';
  
  if (decimalPart > 0) {
    str += ' and ' + chunk(decimalPart) + ' Cents';
  }
  
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Preview control
const openPreview = () => {
  showPreview.value = true;
};

const closePreview = () => {
  showPreview.value = false;
};

// Form Reset
const resetForm = () => {
  form.recipient = locale.value === 'en' ? 'Mr. Sam Kosal (Executive Director)' : 'លោក សំ កុសល (នាយកប្រតិបត្តិ)';
  const today = new Date();
  form.date = today.toISOString().split('T')[0];
  
  if (auth.user) {
    form.requesterName = `${auth.user.first_name || ''} ${auth.user.last_name || ''}`.trim();
    form.requesterPosition = auth.user.title || 'Business Manager';
  } else {
    form.requesterName = 'សុខ សំណាង';
    form.requesterPosition = 'Business Manager';
  }
  form.actualViews = 0;
  form.actualInterviews = 0;
  form.actualArticles = 0;
  form.salaryAmount = null;
  form.salaryAmountWords = '';
  form.references = [
    { category: 'views_proof', images: [] as string[], link: '', uploading: false },
    { category: 'interviews_proof', images: [] as string[], link: '', uploading: false },
    { category: 'articles_proof', images: [] as string[], link: '', uploading: false }
  ];
};

// Submit Request  saves to Node API then opens preview
const isSubmitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref<string | null>(null);

const FORM_API_BASE = useRuntimeConfig().public.FORM_API_BASE_URL || 'http://localhost:4000';

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  submitError.value = null;
  submitSuccess.value = false;

  try {
    // Build payload  include Directus user credentials from auth store
    const user = auth.user;
    const payload = {
      // Directus user info
      directus_user_id: user?.id ? String(user.id) : '',
      user_email:       user?.email       || '',
      user_first_name:  user?.first_name  || '',
      user_last_name:   user?.last_name   || '',
      user_title:       user?.title       || '',

      // Form fields
      recipient:          form.recipient,
      date:               form.date,
      requester_name:     form.requesterName,
      requester_position: form.requesterPosition,

      // KPI targets & actuals
      target_views:      form.targetViews,
      actual_views:      form.actualViews,
      target_interviews: form.targetInterviews,
      actual_interviews: form.actualInterviews,
      target_articles:   form.targetArticles,
      actual_articles:   form.actualArticles,

      // Salary
      salary_amount:       form.salaryAmount,
      salary_amount_words: form.salaryAmountWords,

      // References  include server image URLs (uploaded to /api/upload) and links
      references: form.references.map((r) => ({
        category: r.category,
        link:     r.link,
        // Filter out any remaining blob: URLs (e.g. if upload failed)
        images: (r.images || []).filter((url) => !url.startsWith('blob:')),
      })),
    };

    const response = await fetch(`${FORM_API_BASE}/api/salary-requests`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.message || `Server error ${response.status}`);
    }

    submitSuccess.value = true;
    console.log(' Salary request saved, id:', json.data?.id);

    // Brief success indicator then open preview
    await new Promise((r) => setTimeout(r, 600));
    openPreview();

  } catch (err: any) {
    submitError.value = err.message || 'Failed to submit. Check API server.';
    console.error('handleSubmit error:', err);
    // Still open preview so user can print even if API is down
    openPreview();
  } finally {
    isSubmitting.value = false;
    // Clear success flag after a moment
    setTimeout(() => { submitSuccess.value = false; }, 3000);
  }
};

// Download-as-PDF state
const isDownloadingPdf = ref(false);

// Download PDF using html2pdf.js (no print dialog)
const downloadPdf = async () => {
  if (isDownloadingPdf.value) return;
  isDownloadingPdf.value = true;
  try {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('printable-document');
    if (!element) return;

    const filename = `Salary-Request-${form.requesterName || 'document'}-${form.date || new Date().toISOString().slice(0,10)}.pdf`;

    await html2pdf()
      .set({
        margin:        0,
        filename,
        image:         { type: 'jpeg', quality: 0.98 },
        html2canvas:   {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          scrollX: 0,
          scrollY: 0,
          letterRendering: true,
          onclone: (clonedDoc: Document) => {
            try {
              const container = clonedDoc.getElementById('printable-document');
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
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      })
      .from(element)
      .save();
  } finally {
    isDownloadingPdf.value = false;
  }
};

// Print utility triggers browser window print and hides wrapper layout
const printDocument = () => {
  window.print();
};

// History Modal State
const showHistoryModal = ref(false);
const historyLoading = ref(false);
const historyError = ref<string | null>(null);
const historyList = ref<any[]>([]);

const fetchHistory = async () => {
  showHistoryModal.value = true;
  historyLoading.value = true;
  historyError.value = null;
  historyList.value = [];

  try {
    const user = auth.user;
    const directus_user_id = user?.id ? String(user.id) : '';
    if (!directus_user_id) {
      throw new Error('User not logged in or ID missing');
    }

    const response = await fetch(`${FORM_API_BASE}/api/salary-requests?user_id=${directus_user_id}`);
    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Failed to fetch history');
    }

    historyList.value = json.data || [];
  } catch (err: any) {
    console.error('fetchHistory error:', err);
    historyError.value = err.message || 'An error occurred while fetching history.';
  } finally {
    historyLoading.value = false;
  }
};

const formatDateString = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const statusClass = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  }
};

const goToLoadForm = (item: any) => {
  showHistoryModal.value = false;
  navigateTo(`/dashboard/bm/salary-request/loadform?id=${item.id}`);
};
</script>

<style scoped>
/* Page Layout animations and transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Printable A4 mock constraints & layouts */
.printable-a4 {
  background-color: #ffffff;
  color: #111827;
  font-family: 'Hanuman', 'Kantumruy Pro', Arial, sans-serif;
  line-height: 1.6;
}
</style>

<style>
/* Unscoped Print CSS */
@media print {
  /* 1. Set @page to A4 with zero margins */
  @page {
    size: A4 portrait;
    margin: 0;
  }

  /* 2. Reset html/body */
  html, body {
    width: 210mm !important;
    height: auto !important;
    overflow: visible !important;
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* 3. Hide ALL direct body children by default */
  body > * {
    display: none !important;
  }

  /* 4. Show ONLY the print modal wrapper (teleported to body) */
  body > #print-modal-wrapper {
    display: block !important;
    position: static !important;
    width: 210mm !important;
    height: auto !important;
    overflow: visible !important;
    background: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
  }

  /* 5. Unclip the inner modal container */
  body > #print-modal-wrapper > * {
    display: block !important;
    position: static !important;
    width: 210mm !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    background: transparent !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* 6. Hide modal chrome: header bar, close button, print button */
  body > #print-modal-wrapper .sticky,
  body > #print-modal-wrapper [class*="gradient"],
  body > #print-modal-wrapper button {
    display: none !important;
  }

  /* 7. Unclip the scrollable modal body that wraps #printable-document */
  body > #print-modal-wrapper .overflow-y-auto,
  body > #print-modal-wrapper .flex-1,
  body > #print-modal-wrapper .flex.flex-col.overflow-hidden {
    display: block !important;
    position: static !important;
    width: 210mm !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    background: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
    flex: none !important;
  }

  /* 8. The printable document wrapper */
  #printable-document {
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

  /* 8b. All direct children of printable-document (the A4 page divs) */
  #printable-document > * {
    overflow: visible !important;
    max-height: none !important;
  }


  /* 9. Each A4 page (fixed, page 1 - letter) */
  .printable-a4 {
    display: block !important;
    width: 210mm !important;
    height: 297mm !important;
    min-height: 297mm !important;
    overflow: hidden !important;
    page-break-after: always !important;
    break-after: page !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    box-shadow: none !important;
    margin: 0 !important;
    padding: 20mm 20mm 38mm 20mm !important;
    position: relative !important;
    background-color: #ffffff !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* 9b. Flow page (page 2+ references)  compound selector wins via higher specificity (0,2,0 > 0,1,0) */
  .printable-a4.printable-a4-flow {
    height: auto !important;
    min-height: 297mm !important;
    max-height: none !important;
    overflow: visible !important;
    page-break-after: auto !important;
    break-after: auto !important;
    page-break-inside: auto !important;
    break-inside: auto !important;
    /* Remove background image in print  tiling causes header/footer to appear mid-content */
    background-image: none !important;
    background-color: #ffffff !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* 10. Last A4 page: no trailing blank sheet */
  .printable-a4:last-of-type {
    page-break-after: avoid !important;
    break-after: avoid !important;
  }

  /* 11. Force images and backgrounds to render */
  #printable-document img {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    visibility: visible !important;
  }

  /* 12. Prevent blank page between heading and table in the flow container */
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
    display: table-header-group !important; /* repeat header on each page */
    page-break-after: avoid !important;
    break-after: avoid !important;
  }

  .printable-a4.printable-a4-flow tbody tr {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .printable-a4.printable-a4-flow td,
  .printable-a4.printable-a4-flow th {
    overflow: visible !important;
    max-height: none !important;
  }
}
</style>

<style>
/* Global overrides for print/PDF and teleported modal to prevent white text in dark mode */
#printable-document,
#printable-document * {
  color-scheme: light !important;
}

#printable-document,
#printable-document *:not(.no-print):not(.no-print *) {
  color: #0f172a !important; /* Force dark text color slate-900 */
}

#printable-document a,
#printable-document a * {
  color: #1d4ed8 !important; /* Force blue links */
}

/* Force border colors */
#printable-document table,
#printable-document th,
#printable-document td {
  border-color: #94a3b8 !important;
}
</style>
