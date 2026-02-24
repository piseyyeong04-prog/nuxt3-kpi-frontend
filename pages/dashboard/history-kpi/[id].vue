<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuthStore } from '~/store/useAuthStore';
import type { IResponse } from '~/types/api';

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const kpiId = computed(() => route.params.id as string);

// Types
interface Reference {
  image: string | null;
  link: string;
}

interface Activity {
  name: string;
  bonusFee: number | null;
  amount: number | null;
  client: string;
  project_price: number | null;
  type_bonus_fee: string | null;
  total: number | null;
  references: Reference[];
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  title?: string;
  email?: string;
}

interface Department {
  id: string;
  title: string;
}

interface KpiItem {
  id: string;
  name: string;
  department: Department;
  category: string;
  totalBonusAmount: number;
  activities: Activity[];
  requestedBy: User;
  checkedBy: User;
  verifiedBy: User;
  approvedBy: User;
  reference?: string;
  status: string;
  date_created: string;
  date_updated: string;
}

// State
const kpiDetail = ref<KpiItem | null>(null);
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');

// Format money with thousand separators
const formatMoney = (
  value: number | string,
  { currency: _currency = 'USD', locale = 'en-US', minimumFractionDigits = 2 } = {}
): string => {
  const num =
    typeof value === 'string'
      ? parseFloat(value.replace(/[^0-9.\\-]/g, '')) || 0
      : value || 0;

  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits
  }).format(num);
};

// Format date as "26th /March/2025"
const currentDate = computed(() => {
  const date = new Date();
  const day = 24;
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();

  // Add ordinal suffix
  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${getOrdinal(day)}/${month}/${year}`;
});

// Helper functions
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale.value === 'en' ? 'en-US' : 'km-KH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (err) {
    console.error('Error formatting date:', err);
    return dateString;
  }
};

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'requested': 'Requested',
    'checked': 'Checked',
    'verified': 'Verified',
    'approved': 'Approved',
    'canceled': 'Canceled'
  };
  return statusMap[status] || status;
};

const formatStatusKhmer = (status: string) => {
  const statusMap: Record<string, string> = {
    'requested': 'បានស្នើសុំ',
    'checked': 'បានត្រួតពិនិត្យ',
    'verified': 'បានផ្ទៀងផ្ទាត់',
    'approved': 'បានអនុម័ត',
    'canceled': 'បានបោះបង់'
  };
  return statusMap[status] || status;
};

const getStatusTextColor = (status: string) => {
  const colorMap: Record<string, string> = {
    'requested': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    'checked': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    'verified': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'approved': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'canceled': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const calculateTotal = (activities: Activity[]): number => {
  return activities.reduce((sum, activity) => {
    const total = activity.total !== null && activity.total !== undefined ? Number(activity.total) : 0;
    return sum + (isNaN(total) ? 0 : total);
  }, 0);
};

// Get formatted username
const formatUser = (user: User | null | undefined) => {
  if (!user) return '-';
  return `${user.first_name} ${user.last_name}`;
};

const formatUserPosition = (user: User | null | undefined) => {
  if (!user || !user.title) return '';
  return user.title;
};

// API Calls
const fetchKpiDetail = async () => {
  loading.value = true;
  error.value = false;

  try {
    if (!auth.user?.id) {
      throw new Error('User is not authenticated');
    }

    // API request
    const response = await useApi<IResponse<KpiItem>>(
      `/items/kpi/${kpiId.value}?fields=*,` +
      `department.id,department.title,` +
      `activities.*,activities.references.*,` +
      `verifiedBy.id,verifiedBy.first_name,verifiedBy.last_name,verifiedBy.title,` +
      `requestedBy.id,requestedBy.first_name,requestedBy.last_name,requestedBy.title,` +
      `checkedBy.id,checkedBy.first_name,checkedBy.last_name,checkedBy.title,` +
      `approvedBy.id,approvedBy.first_name,approvedBy.last_name,approvedBy.title`,
      {
        method: 'GET'
      }
    );

    if (response && response.data) {
      // Ensure all number fields are properly parsed
      if (response.data.activities) {
        response.data.activities = response.data.activities.map(activity => ({
          ...activity,
          bonusFee: activity.bonusFee !== null ? Number(activity.bonusFee) : 0,
          amount: activity.amount !== null ? Number(activity.amount) : 0,
          project_price: activity.project_price !== null ? Number(activity.project_price) : 0,
          type_bonus_fee: activity.type_bonus_fee || '$',
          total: activity.total !== null ? Number(activity.total) : 0
        }));
      }

      kpiDetail.value = response.data;
    } else {
      throw new Error('Failed to load data');
    }
  } catch (err: any) {
    console.error('Error fetching KPI detail:', err);
    error.value = true;
    errorMessage.value = err.message || 'An unexpected error occurred';
  } finally {
    loading.value = false;
  }
};

const cancelRequest = async (id: string) => {
  try {
    const result = await Swal.fire({
      title: locale.value === 'en' ? 'Cancel Request?' : 'បោះបង់សំណើ?',
      text: locale.value === 'en' ? 'Are you sure you want to cancel this commission request?' : 'តើអ្នកពិតជាចង់បោះបង់សំណើកម្រៃជើងសារនេះមែនទេ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: locale.value === 'en' ? 'Yes, cancel it!' : 'បាទ/ចាស បោះបង់វា!',
      cancelButtonText: locale.value === 'en' ? 'No, keep it' : 'ទេ រក្សាទុកវា'
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: locale.value === 'en' ? 'Processing...' : 'កំពុងដំណើរការ...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    await useApi(`/items/kpi/${id}`, {
      method: 'PATCH',
      data: {
        status: 'canceled'
      }
    });

    Swal.fire({
      title: locale.value === 'en' ? 'Canceled!' : 'បានបោះបង់!',
      text: locale.value === 'en' ? 'Your request has been canceled.' : 'សំណើរបស់អ្នកត្រូវបានបោះបង់។',
      icon: 'success'
    });

    await fetchKpiDetail();
  } catch (err: any) {
    console.error('Error canceling request:', err);
    Swal.fire({
      title: locale.value === 'en' ? 'Error' : 'បញ្ហា',
      text: err.message || (locale.value === 'en' ? 'Failed to cancel request' : 'បរាជ័យក្នុងការបោះបង់សំណើ'),
      icon: 'error'
    });
  }
};

const printDocument = () => {
  window.print();
};

// Computed for visible approvers
const visibleApprovers = computed(() => {
  if (!kpiDetail.value) return { requestedBy: true, checkedBy: true, verifiedBy: true, approvedBy: true };

  return {
    requestedBy: !!kpiDetail.value.requestedBy,
    checkedBy: !!kpiDetail.value.checkedBy,
    verifiedBy: !!kpiDetail.value.verifiedBy,
    approvedBy: !!kpiDetail.value.approvedBy
  };
});

const approvers = ['requestedBy', 'checkedBy', 'verifiedBy', 'approvedBy'] as const;

// Initialize
onMounted(() => {
  fetchKpiDetail();
});

definePageMeta({
  middleware: 'auth',
});
</script>

<template>
  <div class="container min-h-screen mx-auto p-4 md:p-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl text-center">
      <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
        </path>
      </svg>
      <h3 class="mt-4 text-lg font-medium text-red-800 dark:text-red-200">{{ locale === 'en' ? 'Error Loading Data' :
        'មានបញ្ហាក្នុងការផ្ទុកទិន្នន័យ' }}</h3>
      <p class="mt-2 text-red-700 dark:text-red-300">{{ errorMessage }}</p>
      <button @click="fetchKpiDetail"
        class="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors">
        {{ locale === 'en' ? 'Try Again' : 'ព្យាយាមម្តងទៀត' }}
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="kpiDetail"
      class="bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
      <!-- Header with Actions -->
      <div
        class="relative overflow-hidden p-6 border-b dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-4">
            <NuxtLink to="/dashboard/history-kpi"
              class="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18">
                </path>
              </svg>
              {{ locale === 'en' ? 'Back' : 'ត្រឡប់' }}
            </NuxtLink>
            <div class="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ kpiDetail.category }}</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ kpiDetail.department?.title || kpiDetail.department
                || '' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span
              :class="`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusTextColor(kpiDetail.status)}`">
              {{ locale === 'en' ? formatStatus(kpiDetail.status) : formatStatusKhmer(kpiDetail.status) }}
            </span>
            <button @click="printDocument"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z">
                </path>
              </svg>
              {{ locale === 'en' ? 'Print' : 'បោះពុម្ព' }}
            </button>
            <button v-if="kpiDetail.status === 'pending' || kpiDetail.status === 'requested'"
              @click="cancelRequest(kpiDetail.id)"
              class="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              {{ locale === 'en' ? 'Cancel' : 'បោះបង់' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Document Preview (Direct on Page) -->
      <div class="bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:bg-gray-800 p-8">
        <div id="printable-document" class="bg-white mx-auto relative overflow-hidden"
          style="width: 210mm; min-height: 297mm; padding: 20mm; box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.15), 0 10px 30px rgba(0,0,0,0.1);">

          <!-- Background Image -->
          <div class="absolute inset-0 pointer-events-none">
            <img src="/business-cambodia-kpi-bg.png" alt="" class="w-full h-full object-cover" />
          </div>

          <!-- Content Wrapper -->
          <div class="relative z-10">
            <!-- Header -->
            <div class="flex items-start justify-between mb-6">
              <div class="flex-1 text-center">
                <h1 class="text-xl font-bold text-gray-900 decoration-2 underline-offset-4">
                  {{ locale === 'en' ? 'Request Commission Letter' : 'លិខិតស្នើសុំបើកប្រាក់កម្រៃជើងសារ' }}
                </h1>
              </div>
            </div>

            <!-- Basic Information -->
            <div class="mb-6 space-y-1 text-sm">
              <div class="flex">
                <span class="font-bold w-48">{{ locale === 'en' ? 'Name:' : 'ឈ្មោះ:' }}</span>
                <span>{{ kpiDetail.name || (kpiDetail.requestedBy ? formatUser(kpiDetail.requestedBy) : '') }}</span>
              </div>
              <div class="flex">
                <span class="font-bold w-48">{{ locale === 'en' ? 'Team:' : 'ក្រុម:' }}</span>
                <span>{{ kpiDetail.department?.title || (typeof kpiDetail.department === 'string' ? kpiDetail.department
                  : '') }}</span>
              </div>
              <div class="flex">
                <span class="font-bold w-48">{{ locale === 'en' ? 'Total Bonus Amount:' : 'ចំនួនប្រាក់រង្វាន់សរុប:'
                  }}</span>
                <span class="font-bold text-gray-900">{{ formatMoney(kpiDetail.totalBonusAmount, {
                  minimumFractionDigits: 2
                }) }}$</span>
              </div>
              <div class="flex">
                <span class="font-bold w-48">{{ locale === 'en' ? 'Date:' : 'កាលបរិច្ឆេទ:' }}</span>
                <span>{{ currentDate }}</span>
              </div>
            </div>

            <!-- Activities Table -->
            <div class="mb-8">
              <table class="w-full border-2 border-black text-sm">
                <thead>
                  <tr class="bg-red-500 border-t-2 border-black">
                    <th class="border-2 border-black px-3 py-2 font-bold text-center">
                      {{ locale === 'en' ? 'Activity' : 'សកម្មភាព' }}
                    </th>
                    <th class="border-2 border-black px-3 py-2 font-bold text-center">
                      {{ locale === 'en' ? 'Bonus articles' : 'អត្ថបទរង្វាន់' }}
                    </th>
                    <th class="border-2 border-black px-3 py-2 font-bold text-center">
                      {{ locale === 'en' ? 'Clients' : 'អតិថិជន' }}
                    </th>
                    <th class="border-2 border-black px-3 py-2 font-bold text-center">
                      {{ locale === 'en' ? 'Project Price' : 'តម្លៃគម្រោង' }}
                    </th>
                    <th class="border-2 border-black px-3 py-2 font-bold text-center">
                      {{ locale === 'en' ? 'Bonus fee' : 'កម្រៃជើងសារ' }}
                    </th>
                    <th class="border-2 border-black px-3 py-2 font-bold text-center">
                      {{ locale === 'en' ? 'Total' : 'សរុប' }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(activity, index) in kpiDetail.activities" :key="index" class="bg-white">
                    <td class="border-2 border-black px-3 py-2">{{ activity.name || '' }}</td>
                    <td class="border-2 border-black px-3 py-2 text-center">{{ activity.amount || '' }}</td>
                    <td class="border-2 border-black px-3 py-2">{{ activity.client || '' }}</td>
                    <td class="border-2 border-black px-3 py-2 text-right">{{ activity.project_price ?
                      formatMoney(activity.project_price, { minimumFractionDigits: 2 }) : '' }}</td>
                    <td class="border-2 border-black px-3 py-2 text-right">{{ activity.bonusFee ? activity.bonusFee +
                      (activity.type_bonus_fee || '$') : '' }}</td>
                    <td class="border-2 border-black px-3 py-2 text-right">{{ activity.total ?
                      formatMoney(activity.total, { minimumFractionDigits: 2 }) : '' }}</td>
                  </tr>
                  <!-- Add empty rows to fill space if needed -->
                  <tr v-for="n in Math.max(0, 3 - kpiDetail.activities.length)" :key="'empty-' + n" class="bg-white">
                    <td class="border-2 border-black px-3 py-8">&nbsp;</td>
                    <td class="border-2 border-black px-3 py-8">&nbsp;</td>
                    <td class="border-2 border-black px-3 py-8">&nbsp;</td>
                    <td class="border-2 border-black px-3 py-8">&nbsp;</td>
                    <td class="border-2 border-black px-3 py-8">&nbsp;</td>
                    <td class="border-2 border-black px-3 py-8">&nbsp;</td>
                  </tr>
                  <!-- Total Row -->
                  <tr class="bg-transparent border-t-4 border-black">
                    <td colspan="5" class="border-2 border-black px-3 py-2 text-right font-bold"></td>
                    <td class="border-2 border-black px-3 py-2 text-right font-bold text-gray-900">
                      {{ formatMoney(calculateTotal(kpiDetail.activities), { minimumFractionDigits: 2 }) }}$
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Signature Section -->
            <div class="mb-8">
              <table class="w-full border-2 border-black text-sm">
                <thead>
                  <tr class="bg-white">
                    <th v-if="visibleApprovers.requestedBy"
                      class="border-2 border-black px-3 py-2 font-bold text-center" :class="{
                        'w-1/4': approvers.filter(a => visibleApprovers[a]).length === 4,
                        'w-1/3': approvers.filter(a => visibleApprovers[a]).length === 3,
                        'w-1/2': approvers.filter(a => visibleApprovers[a]).length === 2,
                        'w-full': approvers.filter(a => visibleApprovers[a]).length === 1
                      }">
                      {{ locale === 'en' ? 'Requested by:' : 'ស្នើសុំដោយ:' }}
                    </th>
                    <th v-if="visibleApprovers.checkedBy" class="border-2 border-black px-3 py-2 font-bold text-center"
                      :class="{
                        'w-1/4': approvers.filter(a => visibleApprovers[a]).length === 4,
                        'w-1/3': approvers.filter(a => visibleApprovers[a]).length === 3,
                        'w-1/2': approvers.filter(a => visibleApprovers[a]).length === 2,
                        'w-full': approvers.filter(a => visibleApprovers[a]).length === 1
                      }">
                      {{ locale === 'en' ? 'Checked By' : 'ត្រួតពិនិត្យដោយ' }}
                    </th>
                    <th v-if="visibleApprovers.verifiedBy" class="border-2 border-black px-3 py-2 font-bold text-center"
                      :class="{
                        'w-1/4': approvers.filter(a => visibleApprovers[a]).length === 4,
                        'w-1/3': approvers.filter(a => visibleApprovers[a]).length === 3,
                        'w-1/2': approvers.filter(a => visibleApprovers[a]).length === 2,
                        'w-full': approvers.filter(a => visibleApprovers[a]).length === 1
                      }">
                      {{ locale === 'en' ? 'Verified by:' : 'ផ្ទៀងផ្ទាត់ដោយ:' }}
                    </th>
                    <th v-if="visibleApprovers.approvedBy" class="border-2 border-black px-3 py-2 font-bold text-center"
                      :class="{
                        'w-1/4': approvers.filter(a => visibleApprovers[a]).length === 4,
                        'w-1/3': approvers.filter(a => visibleApprovers[a]).length === 3,
                        'w-1/2': approvers.filter(a => visibleApprovers[a]).length === 2,
                        'w-full': approvers.filter(a => visibleApprovers[a]).length === 1
                      }">
                      {{ locale === 'en' ? 'Approved by:' : 'អនុម័តដោយ:' }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="bg-white">
                    <td v-if="visibleApprovers.requestedBy" class="border-2 border-black px-3 align-bottom"
                      style="height: 128px; vertical-align: bottom;">
                      <div class="signature-cell">
                        <div class="text-xs">
                          <p class="font-semibold">{{ formatUser(kpiDetail.requestedBy) }}</p>
                          <p class="text-gray-600">{{ formatUserPosition(kpiDetail.requestedBy) }}</p>
                          <p class="text-gray-600 mt-1 whitespace-nowrap">{{ locale === 'en' ? 'Date' : 'កាលបរិច្ឆេទ'
                            }}: {{ currentDate }}</p>
                        </div>
                      </div>
                    </td>
                    <td v-if="visibleApprovers.checkedBy" class="border-2 border-black px-3 align-bottom"
                      style="height: 128px; vertical-align: bottom;">
                      <div class="signature-cell">
                        <div class="text-xs">
                          <p class="font-semibold">{{ formatUser(kpiDetail.checkedBy) }}</p>
                          <p class="text-gray-600">{{ formatUserPosition(kpiDetail.checkedBy) }}</p>
                          <p class="text-gray-600 mt-1 whitespace-nowrap">{{ locale === 'en' ? 'Date' : 'កាលបរិច្ឆេទ'
                            }}: {{ currentDate }}</p>
                        </div>
                      </div>
                    </td>
                    <td v-if="visibleApprovers.verifiedBy" class="border-2 border-black px-3 align-bottom"
                      style="height: 128px; vertical-align: bottom;">
                      <div class="signature-cell">
                        <div class="text-xs">
                          <p class="font-semibold">{{ formatUser(kpiDetail.verifiedBy) }}</p>
                          <p class="text-gray-600">{{ formatUserPosition(kpiDetail.verifiedBy) }}</p>
                          <p class="text-gray-600 mt-1 whitespace-nowrap">{{ locale === 'en' ? 'Date' : 'កាលបរិច្ឆេទ'
                            }}: {{ currentDate }}</p>
                        </div>
                      </div>
                    </td>
                    <td v-if="visibleApprovers.approvedBy" class="border-2 border-black px-3 align-bottom"
                      style="height: 128px; vertical-align: bottom;">
                      <div class="signature-cell">
                        <div class="text-xs">
                          <p class="font-semibold">{{ formatUser(kpiDetail.approvedBy) }}</p>
                          <p class="text-gray-600">{{ formatUserPosition(kpiDetail.approvedBy) }}</p>
                          <p class="text-gray-600 mt-1 whitespace-nowrap">{{ locale === 'en' ? 'Date' : 'កាលបរិច្ឆេទ'
                            }}: {{ currentDate }}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- References Section -->
            <div class="mb-8"
              v-if="kpiDetail.activities.some(activity => activity.references && activity.references.length > 0 && activity.references.some(ref => ref.image))">
              <h3 class="text-sm font-bold text-gray-900 mb-3">
                {{ locale === 'en' ? 'References' : 'ឯកសារយោង' }}
              </h3>
              <div class="grid grid-cols-3 gap-4">
                <template v-for="(activity, activityIndex) in kpiDetail.activities" :key="activityIndex">
                  <template v-for="(reference, refIndex) in activity.references" :key="`${activityIndex}-${refIndex}`">
                    <div v-if="reference.image" class="reference-image-wrapper">
                      <img :src="useImg(reference.image)" :alt="`Reference ${activityIndex + 1}-${refIndex + 1}`"
                        class="h-32 w-auto object-cover max-w-full" style="max-height: 128px; height: 128px;" />
                    </div>
                  </template>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
<style>
/* Print styles */
@media print {

  /* Hide everything by default */
  body:has(#printable-document) * {
    visibility: hidden !important;
  }

  /* Show only the printable document */
  body:has(#printable-document) #printable-document,
  body:has(#printable-document) #printable-document * {
    visibility: visible !important;
  }

  /* Position the document for printing */
  body:has(#printable-document) #printable-document {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 210mm !important;
    margin: 0 !important;
    padding: 20mm !important;
    background: white !important;
    box-shadow: none !important;
  }

  /* Overwrite ancestor scroll rules so they don't clip the page */
  body:has(#printable-document),
  body:has(#printable-document) #__nuxt,
  body:has(#printable-document) .overflow-y-auto,
  body:has(#printable-document) .container {
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    position: static !important;
  }

  /* Hide the background wrapper and layout shells explicitly */
  body:has(#printable-document) header:not(#printable-document header),
  body:has(#printable-document) nav,
  body:has(#printable-document) aside,
  body:has(#printable-document) .no-print {
    display: none !important;
  }

  /* Ensure signature cells maintain bottom alignment in print */
  body:has(#printable-document) td.align-bottom {
    vertical-align: bottom !important;
  }

  body:has(#printable-document) .signature-cell {
    display: block !important;
  }

  /* Constrain reference images to match preview size */
  body:has(#printable-document) .reference-image-wrapper {
    max-width: 100%;
    overflow: hidden;
  }

  body:has(#printable-document) .reference-image-wrapper img {
    max-height: 128px !important;
    height: 128px !important;
    width: auto !important;
    object-fit: cover !important;
  }

  /* Ensure tables print correctly */
  body:has(#printable-document) table {
    page-break-inside: avoid;
  }
}
</style>
```