<template>
  <div class="min-h-screen bg-cover bg-center bg-no-repeat py-8 px-4 sm:px-6 lg:px-8 font-sans relative" style="background-image: url('/business-cambodia-kpi-bg.png');">
    <!-- Overlay for better readability if background is too bright/busy -->
    <div class="absolute inset-0 bg-gray-900/10 backdrop-blur-[2px]"></div>

    <div class="relative max-w-4xl mx-auto bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-gray-200/50">
      
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Request for Impact & Income Bonus</h1>
          <p class="text-blue-100 mt-1 text-sm">Policy HRPNo_020</p>
        </div>
        <div class="bg-white/20 p-3 rounded-xl backdrop-blur-sm shadow-inner">
          <Icon icon="mdi:cash-plus" class="w-8 h-8 text-white" />
        </div>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-8">
        
        <!-- Recipient & Date -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-gray-700">Date <span class="text-red-500">*</span></label>
            <input type="date" v-model="form.date" required class="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50/50 text-gray-800" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-gray-700">To (Recipient) <span class="text-red-500">*</span></label>
            <input type="text" v-model="form.recipient" required placeholder="e.g. Mr. Sam Kosal" class="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50/50 text-gray-800" />
          </div>
        </div>

        <div class="border-t border-gray-200 pb-2"></div>

        <!-- Requester Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-gray-700">Requester Name <span class="text-red-500">*</span></label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-gray-400">
                <Icon icon="mdi:account" class="w-5 h-5"/>
              </span>
              <input type="text" v-model="form.name" required placeholder="e.g. Samet Monevong" class="w-full rounded-lg border-gray-300 border pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50/50 text-gray-800" />
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-gray-700">Position <span class="text-red-500">*</span></label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-gray-400">
                <Icon icon="mdi:briefcase-outline" class="w-5 h-5"/>
              </span>
              <input type="text" v-model="form.position" required placeholder="e.g. Manager Video of BM" class="w-full rounded-lg border-gray-300 border pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50/50 text-gray-800" />
            </div>
          </div>
        </div>

        <!-- Bonus Details -->
        <div class="bg-blue-50/60 rounded-xl p-6 border border-blue-100 shadow-sm relative overflow-hidden">
          <div class="absolute -right-4 -top-4 opacity-5 pointer-events-none">
             <Icon icon="mdi:cash-multiple" class="w-32 h-32 text-blue-900" />
          </div>
          <h3 class="text-lg font-bold text-blue-900 mb-4 flex items-center">
            <Icon icon="mdi:calculator-variant-outline" class="w-5 h-5 mr-2" />
            Bonus Calculation
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-gray-800">Total Income Generated <span class="text-red-500">*</span></label>
              <div class="relative">
                <span class="absolute left-3 top-2.5 text-gray-500 font-medium">$</span>
                <input type="number" v-model="form.totalIncome" required placeholder="13800" class="w-full rounded-lg border-gray-300 border pl-8 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-800 shadow-sm" />
              </div>
            </div>
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-gray-800">Benefit Amount Requested <span class="text-red-500">*</span></label>
              <div class="relative">
                <span class="absolute left-3 top-2.5 text-blue-600 font-medium">$</span>
                <input type="number" v-model="form.benefitAmount" required placeholder="200.00" class="w-full rounded-lg border-blue-300 border pl-8 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white font-bold text-blue-700 shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        <!-- Body / Reason -->
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-gray-700">Description / Request Details <span class="text-red-500">*</span></label>
          <textarea v-model="form.description" required rows="5" class="w-full rounded-lg border-gray-300 border px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50/50 text-gray-800 resize-none leading-relaxed" placeholder="I am writing to formally request the Income PR Bonus in accordance with company policy HRPNo_020..."></textarea>
        </div>

        <!-- Workflow Preview -->
        <div class="pt-4 pb-2">
          <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center">
            <Icon icon="mdi:check-decagram" class="w-4 h-4 mr-1 text-gray-400" />
            Approval Workflow
          </h4>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div class="text-center p-3 rounded-xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center">
              <Icon icon="mdi:account-edit-outline" class="w-6 h-6 text-gray-400 mb-1" />
              <p class="text-[10px] text-gray-500 mb-0.5 uppercase font-medium">Requested by</p>
              <p class="text-sm font-bold text-gray-800">Requester</p>
            </div>
            <div class="text-center p-3 rounded-xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center">
              <Icon icon="mdi:account-tie" class="w-6 h-6 text-gray-400 mb-1" />
              <p class="text-[10px] text-gray-500 mb-0.5 uppercase font-medium">Checked by</p>
              <p class="text-sm font-bold text-gray-800">HR & Admin</p>
            </div>
            <div class="text-center p-3 rounded-xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center">
              <Icon icon="mdi:account-tie-voice" class="w-6 h-6 text-gray-400 mb-1" />
              <p class="text-[10px] text-gray-500 mb-0.5 uppercase font-medium">Checked by</p>
              <p class="text-sm font-bold text-gray-800">BC Manager</p>
            </div>
            <div class="text-center p-3 rounded-xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center">
              <Icon icon="mdi:file-document-check-outline" class="w-6 h-6 text-gray-400 mb-1" />
              <p class="text-[10px] text-gray-500 mb-0.5 uppercase font-medium">Verified by</p>
              <p class="text-sm font-bold text-gray-800">Acc Manager</p>
            </div>
            <div class="text-center p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col items-center justify-center shadow-sm">
              <Icon icon="mdi:shield-check" class="w-6 h-6 text-indigo-500 mb-1" />
              <p class="text-[10px] text-indigo-600 mb-0.5 uppercase font-bold">Approved by</p>
              <p class="text-sm font-bold text-indigo-900">CEO</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button type="button" class="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 flex items-center">
            <Icon icon="mdi:close" class="w-5 h-5 mr-1" />
            Cancel
          </button>
          <button type="submit" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/40 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:-translate-y-0.5 flex items-center">
            <Icon icon="mdi:send-circle" class="w-5 h-5 mr-2" />
            Submit Request
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'

const form = reactive({
  date: '',
  recipient: 'Mr. Sam Kosal',
  name: '',
  position: '',
  totalIncome: null as number | null,
  benefitAmount: null as number | null,
  description: 'I am writing to formally request the Income PR Bonus in accordance with company policy HRPNo_020, based on the achievement of generated income.\n\nThis request is being submitted now to address a previous administrative omission during the initial KPI preparation process. I would appreciate your review and approval to ensure this is reconciled according to our standard policy.\n\nThank you for your time and continued support.'
})

onMounted(() => {
  // Automatically set today's date in YYYY-MM-DD format
  const today = new Date()
  form.date = today.toISOString().split('T')[0]
})

const handleSubmit = () => {
  // Logic to post this request to the backend API goes here
  console.log('Sending Income Bonus Request:', form)
  alert('Request for Income Bonus has been submitted successfully for approval!')
}
</script>
