<template>
  <div class="min-h-screen py-10">
    <div class="container mx-auto px-4 max-w-6xl">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Staff Performance History
      </h1>

      <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search editor
        </label>
        <input
          v-model="search"
          type="text"
          placeholder="Type a name"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <select
          v-model="statusFilter"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="missed">Not Completed</option>
          <option value="progress">In Progress</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Month
        </label>
        <select
          v-model="selectedMonth"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3"
        >
          <option v-for="key in periodKeys" :key="key" :value="key">
            {{ kpiPeriods[key].label }}
          </option>
        </select>
      </div>

    </div>


      <!-- Summary cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5 border-l-4 border-indigo-500">
          <p class="text-sm text-gray-500 dark:text-gray-400">Total Videos</p>
          <div class="flex items-center mt-2">
            <Icon icon="fluent:document-16-filled" class="h-8 w-8 text-indigo-500 mr-3" />
            <span class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ summary.videos }}
            </span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5 border-l-4 border-green-500">
          <p class="text-sm text-gray-500 dark:text-gray-400">Completed Targets</p>
          <div class="flex items-center mt-2">
            <Icon icon="fluent-mdl2:completed" class="h-8 w-8 text-green-500 mr-3" />
            <span class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ summary.completed }}
            </span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5 border-l-4 border-rose-500">
          <p class="text-sm text-gray-500 dark:text-gray-400">Not Completed</p>
          <div class="flex items-center mt-2">
            <Icon icon="heroicons:x-circle" class="h-8 w-8 text-rose-500 mr-3" />
            <span class="text-2xl font-bold text-gray-800 dark:text-white">{{ summary.missed }}</span>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-gray-500">Loading...</div>

      <!-- Table -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-300">Name</th>
              <th class="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-300">Target</th>
              <th class="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-300">Videos</th>
              <th class="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
              <th class="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-300">Progress</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
  <template v-for="row in filteredRows" :key="row.id">

    <tr @click="toggleExpand(row.id)"
      class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td class="py-3 px-4 text-gray-900 dark:text-white">
        {{ row.name }}
      </td>
      <td class="py-3 px-4 text-gray-900 dark:text-white">
        {{ row.target }}
      </td>
      <td class="py-3 px-4 font-semibold text-gray-900 dark:text-white">
        {{ row.count }}
      </td>

      <td class="py-3 px-4">
        <span v-if="row.status === 'completed'"
          class="inline-flex items-center px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-medium">
          <Icon icon="heroicons:check-circle" class="h-3 w-3 mr-1" />
          Completed
        </span>
        <span v-else-if="row.status === 'missed'"
          class="inline-flex items-center px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-medium">
          <Icon icon="heroicons:x-circle" class="h-3 w-3 mr-1" />
          Not Completed
        </span>
        <span v-else
          class="inline-flex items-center px-3 py-1.5 bg-amber-500 text-white rounded-full text-xs font-medium">
          <Icon icon="heroicons:clock" class="h-3 w-3 mr-1" />
          In Progress
        </span>
      </td>

      <td class="py-3 px-4">
        <div class="flex items-center space-x-3 min-w-[140px]">
          <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div class="h-2.5 rounded-full transition-all duration-300"
              :class="getProgressBarColor(row.percent)"
              :style="`width: ${Math.min(row.percent, 100)}%`">
            </div>
          </div>
          <div class="text-xs font-bold min-w-[44px] text-right" :class="getPercentClass(row.percent)">
            {{ row.percent }}%
          </div>
          <Icon icon="heroicons:chevron-down"
            class="h-4 w-4 text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': expandedId === row.id }" />
        </div>
      </td>
    </tr>

    <!-- ជួរពង្រីក -->
    <tr v-if="expandedId === row.id">
      <td colspan="5" class="bg-gray-50 dark:bg-gray-900/40 p-4 space-y-6">

        <!-- ប្រវត្តិគ្រប់ខែ -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Month by month</h4>
          <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Month</th>
                  <th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Videos</th>
                  <th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Progress</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="h in historyFor(row.editor)" :key="h.key"
                  :class="{ 'bg-indigo-50 dark:bg-indigo-900/20': h.key === selectedMonth }">
                  <td class="px-4 py-2 text-gray-900 dark:text-white whitespace-nowrap">
                    {{ h.label }}
                  </td>
                  <td class="px-4 py-2 font-semibold text-gray-900 dark:text-white">
                    {{ h.count }} / {{ row.target }}
                  </td>
                  <td class="px-4 py-2">
                    <span v-if="h.status === 'completed'"
                      class="px-2.5 py-1 bg-green-500 text-white rounded-full text-xs font-medium">Completed</span>
                    <span v-else-if="h.status === 'missed'"
                      class="px-2.5 py-1 bg-red-500 text-white rounded-full text-xs font-medium">Not Completed</span>
                    <span v-else
                      class="px-2.5 py-1 bg-amber-500 text-white rounded-full text-xs font-medium">In Progress</span>
                  </td>
                  <td class="px-4 py-2 text-xs font-bold" :class="getPercentClass(h.percent)">
                    {{ h.percent }}%
                  </td>
                </tr>
                <tr v-if="historyFor(row.editor).length === 0">
                  <td colspan="4" class="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                    No history yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- វីដេអូក្នុងខែដែលបានជ្រើស -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Videos in {{ kpiPeriods[selectedMonth]?.label }}
          </h4>
          <p v-if="remarksIn(row.editor, selectedMonth).length === 0"
            class="text-sm text-gray-500 dark:text-gray-400">
            No videos in this month.
          </p>
          <ul v-else
            class="divide-y divide-gray-200 dark:divide-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <li v-for="r in remarksIn(row.editor, selectedMonth)" :key="r.id"
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 py-2">
              <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {{ r.date_created ? format(new Date(r.date_created), 'MMM dd, yyyy p') : 'N/A' }}
              </span>
              <a :href="r.facebook_link" target="_blank" rel="noopener"
                class="text-blue-600 dark:text-blue-400 hover:underline text-sm truncate sm:max-w-md">
                {{ r.facebook_link }}
              </a>
            </li>
          </ul>
        </div>
      </td>
    </tr>
  </template>
</tbody>
        </table>

        <div v-if="filteredRows.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
          No editors match these filters.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import type { IResponse } from '~/types/api';
import { getPercentClass, getProgressBarColor, type IEditor } from '~/utils/editors';

const loading = ref(false);
const editors = ref<IEditor[]>([]);
const staffMembers = ref<Record<string, string>>({});
const selectedMonth = ref('');
const search = ref('');
const statusFilter = ref('all');
const expandedId = ref<string | number | null>(null);

const getUserName = (staffId: string): string => {
  return staffMembers.value[staffId] || 'Unknown';
};

// ---------- ខែ KPI ----------
const kpiPeriods = computed<Record<string, any>>(() => {
  const allRemarks = editors.value.flatMap(e =>
    (e.remarks || []).map((r: any) => ({
      ...r,
      date_created: typeof r.date_created === 'string'
        ? r.date_created
        : r.date_created instanceof Date
          ? r.date_created.toISOString()
          : ''
    }))
  );
  return getKpiPeriodsFromEditors(allRemarks) || {};
});

const periodKeys = computed(() => 
  Object.keys(kpiPeriods.value).sort().reverse());

watch(periodKeys, (keys) => {
  if (keys.length && !keys.includes(selectedMonth.value)) {
    selectedMonth.value = keys[0];
  }
}, { immediate: true });

// ---------- វីដេអូក្នុងខែ ----------
const remarksIn = (editor: IEditor, key: string): any[] => {
  const period = kpiPeriods.value[key];
  if (!period) return [];
  return (editor.remarks || []).filter((r: any) => {
    const created = new Date(r.date_created);
    return created >= period.from && created <= period.to;
  });
};

// ---------- ភាគរយ និងស្ថានភាព ----------
const percentFor = (count: number, target: number): number =>
  target > 0 ? Math.round((count / target) * 1000) / 10 : 0;

const statusFor = (count: number, target: number, key: string) => {
  if (target > 0 && count >= target) return 'completed';
  const period = kpiPeriods.value[key];
  if (period && period.to < new Date()) return 'missed';
  return 'progress';
};

const rows = computed(() => {
  return editors.value.map(editor => {
    const target = Number(editor.target) || 0;
    const count = remarksIn(editor, selectedMonth.value).length;
    return {
      id: editor.id,
      editor,
      name: getUserName(editor.staff as any),
      target,
      count,
      percent: percentFor(count, target),
      status: statusFor(count, target, selectedMonth.value)
    };
  });
});

// ---------- Filter និង summary ----------
const filteredRows = computed(() => {
  const q = search.value.trim().toLowerCase();
  return rows.value.filter(row => {
    const matchStatus = statusFilter.value === 'all' || row.status === statusFilter.value;
    const matchName = !q || row.name.toLowerCase().includes(q);
    return matchStatus && matchName;
  });
});

const summary = computed(() => ({
  videos: filteredRows.value.reduce((sum, row) => sum + row.count, 0),
  completed: filteredRows.value.filter(row => row.status === 'completed').length,
  missed: filteredRows.value.filter(row => row.status === 'missed').length
}));

// ចុចម្តងបើក ចុចម្តងទៀតបិទ
const toggleExpand = (id: string | number) => {
  expandedId.value = expandedId.value === id ? null : id;
};

// ប្រវត្តិគ្រប់ខែរបស់ editor ម្នាក់
const historyFor = (editor: IEditor) => {
  const target = Number(editor.target) || 0;
  return periodKeys.value
    .map(key => {
      const count = remarksIn(editor, key).length;
      return {
        key,
        label: kpiPeriods.value[key].label,
        count,
        percent: percentFor(count, target),
        status: statusFor(count, target, key)
      };
    })
    // លាក់ខែដែលគ្មានវីដេអូ ហើយក៏មិនមែនខែដែលខកខាន
    .filter(h => h.count > 0 || h.status === 'missed');
};
// ---------- ទាញទិន្នន័យ ----------
const fetchHistory = async () => {
  loading.value = true;
  try {
    const res = await useApi(
      '/items/editors?fields=*,remarks.*,user_created.*,user_created.department.title&limit=100&deep[remarks][_limit]=-1',
      { method: 'GET' }
    ) as IResponse<IEditor[]>;
    editors.value = res.data || [];

    const staffRes = await useApi(
      '/users?limit=100', { method: 'GET' }) as IResponse<any>;
    (staffRes.data || []).forEach((s: any) => {
      if (s.first_name && s.last_name) {
        staffMembers.value[s.id] = `${s.first_name} ${s.last_name}`;
      }
    });
  } catch (error) {
    console.error(error);
    Swal.fire({ title: 'Error', 
      text: 'Failed to load data', 
      icon: 'error' });
  } finally {
    loading.value = false;
  }
};

definePageMeta({ middleware: ['auth', 'role'] });

onMounted(fetchHistory);
</script>