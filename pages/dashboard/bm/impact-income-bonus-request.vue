<template>
  <div class="container min-h-screen mx-auto p-4 md:p-6">
    <div class="bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">

      <!-- Header -->
      <div class="relative overflow-hidden p-6 border-b dark:border-gray-800">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-100/30 to-orange-200/30 rounded-full -translate-y-1/2 translate-x-1/3 dark:from-amber-900/10 dark:to-orange-800/10"></div>
        <div class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-100/20 to-orange-100/20 rounded-full translate-y-1/2 -translate-x-1/3"></div>
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
          <div class="flex items-center gap-4">
            <div class="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
              <img src="/logo.png" alt="Baksey Media Logo" class="h-10 w-auto" />
            </div>
            <div class="h-10 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Request for Impact &amp; Income Bonus
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Policy HRPNo_020</p>
            </div>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
            <span>{{ currentDate }}</span>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="p-6 space-y-8">

        <!-- Basic Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input readonly v-model="form.name" type="text" class="block w-full px-4 py-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 transition-all text-sm" />
          </div>
          <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position</label>
            <input readonly v-model="form.position" type="text" class="block w-full px-4 py-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 transition-all text-sm" />
          </div>
          <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
            <input readonly v-model="form.department" type="text" class="block w-full px-4 py-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 transition-all text-sm" />
          </div>
          <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
            <input v-model="form.date" type="date" class="block w-full px-4 py-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 transition-all text-sm" />
          </div>
        </div>

        <!-- Generated Income -->
        <div class="bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800 p-5">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <Icon icon="mdi:currency-usd" class="w-5 h-5 text-white" />
            </div>
            <h3 class="text-base font-bold text-gray-800 dark:text-white">Generated Income &amp; Bonus Breakdown</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Generated Income ($)</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                <input v-model.number="form.generatedIncome" @input="calculateBonus" type="number" step="0.01" placeholder="0.00"
                  class="block w-full pl-8 px-4 py-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 transition-all text-sm" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bonus Income ($)</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                <input v-model.number="form.bonusIncome" @input="calculateBonus" type="number" step="0.01" placeholder="0.00"
                  class="block w-full pl-8 px-4 py-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 transition-all text-sm" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Benefit ($)</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                <input v-model.number="form.benefit" @input="calculateBonus" type="number" step="0.01" placeholder="0.00"
                  class="block w-full pl-8 px-4 py-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 transition-all text-sm" />
              </div>
            </div>
          </div>
          <!-- Total -->
          <div class="mt-4 flex justify-end">
            <div class="bg-white dark:bg-gray-800 rounded-xl px-6 py-3 border border-amber-200 dark:border-amber-700 flex items-center gap-3 shadow-sm">
              <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">Amount Total:</span>
              <span class="text-xl font-bold text-amber-600 dark:text-amber-400">${{ formatMoney(totalAmount) }}</span>
            </div>
          </div>
        </div>

        <!-- References / Proof -->
        <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 px-5 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <Icon icon="mdi:attachment" class="w-5 h-5 text-amber-600" />
              <h3 class="font-semibold text-gray-800 dark:text-white text-sm">Reference of Income Bonus &amp; Policy</h3>
            </div>
            <button type="button" @click="addReference"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-all">
              <Icon icon="mdi:plus" class="w-4 h-4" />
              Add Reference
            </button>
          </div>
          <div class="divide-y divide-gray-100 dark:divide-gray-800">
            <div v-for="(ref, idx) in form.references" :key="idx"
              class="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Description</label>
                  <input v-model="ref.description" type="text" placeholder="e.g. Invoice, Contract, Screenshot..."
                    class="block w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-400/30 transition-all" />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Link (optional)</label>
                  <input v-model="ref.link" type="url" placeholder="https://..."
                    class="block w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-400/30 transition-all" />
                </div>
                <!-- Image upload + previews -->
                <div class="md:col-span-2">
                  <div class="relative">
                    <input type="file" multiple accept="image/*" :disabled="ref.uploading" @change="(e) => handleImages(e, idx)"
                      class="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
                    <div v-if="ref.uploading" class="absolute right-2 top-2 flex items-center gap-1.5 text-xs text-amber-600">
                      <Icon icon="mdi:loading" class="w-4 h-4 animate-spin" />
                      <span>Uploading to server...</span>
                    </div>
                  </div>
                  <div v-if="ref.images.length" class="mt-2 flex flex-wrap gap-2">
                    <div v-for="(img, imgIdx) in ref.images" :key="imgIdx" class="relative group">
                      <img :src="getImgSrc(img)" class="h-16 w-16 object-cover rounded-lg border border-gray-200 shadow-sm" alt="ref" />
                      <button type="button" @click="removeImage(idx, imgIdx)"
                        class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
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
        <div class="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
          <button type="button" @click="resetForm"
            class="group w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700">
            <Icon icon="mdi:refresh" class="w-5 h-5 mr-2 transition-transform group-hover:rotate-180" />
            Reset Form
          </button>
          <button type="button" @click="openPreview"
            class="group w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-amber-300 shadow-sm text-base font-medium rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700">
            <Icon icon="mdi:eye-outline" class="w-5 h-5 mr-2" />
            Preview Document
          </button>
          <button type="submit" @click="openPreview"
            class="group w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all">
            <Icon icon="mdi:send-outline" class="w-5 h-5 mr-2 transition-transform group-hover:translate-x-1" />
            Submit Request
          </button>
        </div>
      </form>
    </div>

    <!-- ====================================================
         PREVIEW MODAL
         ==================================================== -->
    <Teleport to="body">
      <Transition name="fade">
        <div id="bonus-print-modal-wrapper" v-if="showPreview"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          @click.self="closePreview">
          <div class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden transition-all duration-300">

            <!-- Modal Header -->
            <div class="sticky top-0 z-10 bg-red-600 px-6 py-4 flex items-center justify-between text-white">
              <div class="flex items-center gap-2.5">
                <Icon icon="mdi:file-document-outline" class="w-6 h-6 text-white" />
                <h2 class="text-xl font-bold">Official Document Preview</h2>
              </div>
              <div class="flex items-center gap-2">
                <button @click="downloadPdf" :disabled="isDownloadingPdf"
                  class="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center gap-1.5 text-sm font-semibold">
                  <Icon v-if="!isDownloadingPdf" icon="mdi:file-download-outline" class="w-5 h-5" />
                  <Icon v-else icon="mdi:loading" class="w-5 h-5 animate-spin" />
                  {{ isDownloadingPdf ? 'Generating...' : 'Download PDF' }}
                </button>
                <!-- <button @click="printDocument"
                  class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all flex items-center gap-1.5 text-sm font-semibold">
                  <Icon icon="mdi:printer" class="w-5 h-5" />
                  Print / Save PDF
                </button> -->
                <button @click="closePreview"
                  class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center justify-center">
                  <Icon icon="mdi:close" class="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <!-- Modal Body -->
            <div class="overflow-y-auto flex-1 bg-gray-200 dark:bg-gray-950 p-8 flex flex-col items-center gap-8">
              <div id="bonus-printable-document" class="flex flex-col items-center gap-8 bg-transparent">

                <!-- PAGE 1: Impact & Income Bonus Letter -->
                <div class="bg-white text-gray-950 relative overflow-hidden printable-a4 shadow-xl"
                  style="width: 210mm; height: 297mm; padding: 20mm 20mm 38mm 20mm; font-family: 'Times New Roman', Times, serif; background-image: url('/business-cambodia-kpi-bg.png'); background-size: cover; background-repeat: no-repeat; background-position: center;">

                  <!-- Content -->
                  <div class="relative z-10 h-full flex flex-col">

                    <!-- Top row: [logo bg] | Title (center) | Date (right) -->
                    <div class="flex items-center gap-2 mb-1" style="padding-top: 8mm;">
                      <!-- Spacer matching logo width in background -->
                      <div style="min-width: 42mm;"></div>
                      <!-- Title -->
                      <div class="flex-1 text-center">
                        <h1 class="text-lg font-bold text-gray-900 underline decoration-2 underline-offset-4">
                          Request for Impact &amp; income bonus
                        </h1>
                      </div>
                      <!-- Date -->
                      <div class="text-xs text-gray-700 whitespace-nowrap" style="min-width: 36mm; text-align: right;">
                        <span class="font-semibold italic">Date:</span> {{ form.date || '……./……/……' }}
                      </div>
                    </div>

                    <!-- Name / Position / Department (left, below logo) -->
                    <div class="mb-4 text-sm italic text-gray-700 space-y-0.5">
                      <div><span class="font-semibold">Name:</span> {{ form.name || '………………….' }}</div>
                      <div><span class="font-semibold">Position:</span> {{ form.position || '………………' }}</div>
                      <div><span class="font-semibold">Department:</span> {{ form.department || '……………' }}</div>
                    </div>

                    <!-- Salutation -->
                    <div class="text-sm text-gray-800 space-y-2 mb-4">
                      <p>Dear , Mr, Sam Kosal</p>
                      <p class="font-semibold">Subject: Request for Impact and Income Bonus (Policy HRPNo_020)</p>
                      <p>Dear Mr. Sam Kosal,</p>
                      <p class="leading-relaxed">
                        I am writing to formally request the Impact and Income Bonus in accordance with company policy HRPNo_020,
                        based on the achievement of
                        <strong class="text-red-500">${{ form.generatedIncome ? formatMoney(form.generatedIncome) : '.........' }}</strong>
                        in generated income.
                      </p>
                      <p>Below is the breakdown of the requested amount:</p>
                    </div>

                    <!-- Bonus Breakdown Table -->
                    <div class="mb-4">
                      <table class="w-full border border-gray-500 text-sm">
                        <thead>
                          <tr class="bg-red-600 text-white">
                            <th class="border border-gray-500 px-4 py-2 text-center font-bold">Bonus Income</th>
                            <th class="border border-gray-500 px-4 py-2 text-center font-bold">Benefit</th>
                            <th class="border border-gray-500 px-4 py-2 text-center font-bold">Amount Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr class="bg-white">
                            <td class="border border-gray-500 px-4 py-4 text-center font-bold text-gray-900">
                              {{ form.bonusIncome ? '$' + formatMoney(form.bonusIncome) : '' }}
                            </td>
                            <td class="border border-gray-500 px-4 py-4 text-center font-bold text-gray-900">
                              {{ form.benefit ? '$' + formatMoney(form.benefit) : '' }}
                            </td>
                            <td class="border border-gray-500 px-4 py-4 text-center font-bold text-amber-700 text-base">
                              ${{ formatMoney(totalAmount) }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <!-- Body paragraph -->
                    <div class="text-sm text-gray-800 space-y-2 mb-6">
                      <p class="leading-relaxed">
                        This request is being submitted now to address a previous administrative omission during the initial
                        KPI preparation process. I would appreciate your review and approval to ensure this is reconciled
                        according to our standard policy.
                      </p>
                      <p>Thank you for your time and continued support.</p>
                    </div>

                    <!-- Signature Block -->
                    <div class="mt-auto">
                      <table class="w-full border border-gray-500 text-xs">
                        <thead>
                          <tr class="bg-white">
                            <th class="border border-gray-500 px-2 py-2 text-center font-bold text-[10px]">Requested by:</th>
                            <th class="border border-gray-500 px-2 py-2 text-center font-bold text-[10px]">Checked by:</th>
                            <th class="border border-gray-500 px-2 py-2 text-center font-bold text-[10px]">Checked by:</th>
                            <th class="border border-gray-500 px-2 py-2 text-center font-bold text-[10px]">Verified by:</th>
                            <th class="border border-gray-500 px-2 py-2 text-center font-bold text-[10px]">Approved by:</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr class="bg-white">
                            <td class="border border-gray-500 px-2 align-bottom" style="height: 100px;">
                              <div class="pb-1">
                                <div class="border-b border-gray-600 mb-0.5"></div>
                                <p class="font-semibold text-[10px]">{{ form.name || 'Name:……………' }}</p>
                                <p class="text-gray-600 text-[10px]">{{ form.position || 'Position:………' }}</p>
                                <p class="text-gray-500 text-[9px]">Date: {{ form.date || '…/…/……' }}</p>
                              </div>
                            </td>
                            <td class="border border-gray-500 px-2 align-bottom" style="height: 100px;">
                              <div class="pb-1">
                                <div class="border-b border-gray-600 mb-0.5"></div>
                                <p class="font-semibold text-[10px]">Name:…………</p>
                                <p class="text-gray-600 text-[10px]">Position:…………</p>
                                <p class="text-gray-500 text-[9px]">Date: …/…/……</p>
                              </div>
                            </td>
                            <td class="border border-gray-500 px-2 align-bottom" style="height: 100px;">
                              <div class="pb-1">
                                <div class="border-b border-gray-600 mb-0.5"></div>
                                <p class="font-semibold text-[10px]">Ton Sreyphors</p>
                                <p class="text-gray-600 text-[10px]">HR&amp;Admin</p>
                                <p class="text-gray-500 text-[9px]">Date: …/…/……</p>
                              </div>
                            </td>
                            <td class="border border-gray-500 px-2 align-bottom" style="height: 100px;">
                              <div class="pb-1">
                                <div class="border-b border-gray-600 mb-0.5"></div>
                                <p class="font-semibold text-[10px]">Put chansereyrath</p>
                                <p class="text-gray-600 text-[10px]">Acc Manager</p>
                                <p class="text-gray-500 text-[9px]">Date: …/…/……</p>
                              </div>
                            </td>
                            <td class="border border-gray-500 px-2 align-bottom" style="height: 100px;">
                              <div class="pb-1">
                                <div class="border-b border-gray-600 mb-0.5"></div>
                                <p class="font-semibold text-[10px]">Sam Kosal</p>
                                <p class="text-gray-600 text-[10px]">CEO</p>
                                <p class="text-gray-500 text-[9px]">Date: …/…/……</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <!-- PAGE 2+: References & Proof (auto-height, no background) -->
                <div v-if="hasAnyReference"
                  class="bg-white text-gray-950 font-sans printable-a4 printable-a4-flow shadow-xl"
                  style="width: 210mm; min-height: 297mm; padding: 20mm 20mm 20mm 20mm; position: relative;">
                  <div class="space-y-4">
                    <h4 class="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-2">
                      Reference of Income Bonus and Policy
                    </h4>
                    <table class="w-full border border-gray-400 text-xs text-left">
                      <thead>
                        <tr class="bg-gray-100 border-b border-gray-400">
                          <th class="px-4 py-2 border-r border-gray-400 w-1/4">Description</th>
                          <th class="px-4 py-2 border-r border-gray-400 w-1/3">Link</th>
                          <th class="px-4 py-2">Images</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(ref, idx) in form.references" :key="idx" class="border-b border-gray-300">
                          <td class="px-4 py-3 border-r border-gray-400 font-medium align-top">
                            {{ ref.description || '-' }}
                          </td>
                          <td class="px-4 py-3 border-r border-gray-400 align-top font-mono break-all">
                            <a v-if="ref.link" :href="ref.link" target="_blank" class="text-blue-700 hover:underline">{{ ref.link }}</a>
                            <span v-else class="text-gray-400 italic">Not attached</span>
                          </td>
                          <td class="px-4 py-3 align-top">
                            <div v-if="ref.images.length" class="flex flex-wrap gap-2">
                              <img v-for="(img, imgIdx) in ref.images" :key="imgIdx"
                                :src="getImgSrc(img)"
                                class="h-28 w-auto object-contain rounded border border-gray-300"
                                alt="Reference" />
                            </div>
                            <span v-else class="text-gray-400 italic">Not attached</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div><!-- /bonus-printable-document -->
            </div><!-- /modal body -->
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

const FORM_API_BASE = useRuntimeConfig().public.FORM_API_BASE_URL || 'http://localhost:4000';

// ── Form State ─────────────────────────────────────────────────────────────
const form = reactive({
  name: '',
  position: '',
  department: '',
  date: new Date().toISOString().slice(0, 10),
  generatedIncome: null as number | null,
  bonusIncome: null as number | null,
  benefit: null as number | null,
  references: [
    { description: '', link: '', images: [] as string[], uploading: false },
  ] as Array<{ description: string; link: string; images: string[]; uploading: boolean }>,
});

// ── Auth prefill ────────────────────────────────────────────────────────────
onMounted(() => {
  if (auth.user) {
    form.name = `${auth.user.first_name || ''} ${auth.user.last_name || ''}`.trim();
    form.position = auth.user.title || '';
    form.department = auth.user.department?.title || '';
  }
});

// ── Computed ────────────────────────────────────────────────────────────────
const totalAmount = computed(() => {
  return (form.bonusIncome || 0) + (form.benefit || 0);
});

const hasAnyReference = computed(() =>
  form.references.some(r => r.description || r.link || r.images.length)
);

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
});

// ── Methods ─────────────────────────────────────────────────────────────────
const calculateBonus = () => {
  // Auto-calculate bonus income as 1% of generated income if not manually set
};

const formatMoney = (val: number | null | undefined) => {
  if (!val && val !== 0) return '0.00';
  return Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Reference CRUD
const addReference = () => {
  form.references.push({ description: '', link: '', images: [], uploading: false });
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
    // 1. Create previews immediately using temporary object URLs
    const filesArray = Array.from(files);
    const blobUrls = filesArray.map((file) => URL.createObjectURL(file));
    const startIdx = refItem.images.length;

    // Push local previews
    blobUrls.forEach((blobUrl) => {
      refItem.images.push(blobUrl);
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
      if (refItem.images[imgIdx] !== undefined) {
        refItem.images[imgIdx] = serverUrl;
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
  if (src.startsWith('data:') || src.startsWith('http')) return src;
  return useImg(src);
};

const resetForm = () => {
  form.generatedIncome = null;
  form.bonusIncome = null;
  form.benefit = null;
  form.date = new Date().toISOString().slice(0, 10);
  form.references = [{ description: '', link: '', images: [], uploading: false }];
};

const submitForm = () => {
  console.log('Submitted:', JSON.stringify(form));
};

// ── Preview / Print / Download ───────────────────────────────────────────────
const showPreview = ref(false);

const openPreview = () => { showPreview.value = true; };
const closePreview = () => { showPreview.value = false; };

const printDocument = () => { window.print(); };

const isDownloadingPdf = ref(false);
const downloadPdf = async () => {
  if (isDownloadingPdf.value) return;
  isDownloadingPdf.value = true;
  try {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('bonus-printable-document');
    if (!element) return;
    const filename = `Impact-Income-Bonus-${form.name || 'request'}-${form.date}.pdf`;
    await html2pdf()
      .set({
        margin: 0,
        filename,
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
              const container = clonedDoc.getElementById('bonus-printable-document');
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
      .from(element)
      .save();
  } finally {
    isDownloadingPdf.value = false;
  }
};
</script>

<style scoped>
/* ── Transitions ─────────────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

/* ── Screen A4 preview ───────────────────────────────────────────── */
.printable-a4 {
  box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.15);
}

/* ── Print styles ────────────────────────────────────────────────── */
@media print {
  @page {
    size: A4 portrait;
    margin: 0;
  }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    height: auto !important;
    overflow: visible !important;
  }

  body > * { display: none !important; }

  body > #bonus-print-modal-wrapper {
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

  body > #bonus-print-modal-wrapper > * {
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

  body > #bonus-print-modal-wrapper .sticky,
  body > #bonus-print-modal-wrapper button { display: none !important; }

  body > #bonus-print-modal-wrapper .overflow-y-auto,
  body > #bonus-print-modal-wrapper .flex-1 {
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

  #bonus-printable-document {
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

  #bonus-printable-document > * {
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

  #bonus-printable-document img {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    visibility: visible !important;
  }
}
</style>

<style>
/* Global overrides for print/PDF and teleported modal to prevent white text in dark mode */
#bonus-printable-document,
#bonus-printable-document * {
  color-scheme: light !important;
}

#bonus-printable-document,
#bonus-printable-document *:not(.no-print):not(.no-print *) {
  color: #0f172a !important; /* Force dark text color slate-900 */
}

#bonus-printable-document a,
#bonus-printable-document a * {
  color: #1d4ed8 !important; /* Force blue links */
}

/* Force border colors */
#bonus-printable-document table,
#bonus-printable-document th,
#bonus-printable-document td {
  border-color: #94a3b8 !important;
}
</style>
