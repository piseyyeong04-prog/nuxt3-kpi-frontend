<!--pages/dashboord/track-performance-staff/writers/history.vue-->

<template>
  <main class="min-h-screen p-4 sm:p-6">
    <div class="mx-auto max-w-6xl space-y-6">
      <!--Add this after the performance Summary cards and before the per-->
      <section class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Writer Performance History</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Article performance by KPI period</p>
          </div>
          <label class="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 sm:flex-row sm:items-center">
            KPI period
            <select v-model="selectedPeriod" class="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option v-for="(period, key) in periods" :key="key" :value="key">
                {{ period.label }}</option>
              <option v-if="!Object.keys(periods).length" value="">All time</option>
            </select>
          </label>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-700 sm:grid-cols-4">
          <div><span class="font-medium">Period:</span> 
            {{ currentPeriodLabel }}</div>
          <div><span class="font-medium">Articles:</span> 
            {{ periodArticles.length }}</div>
          <div><span class="font-medium">Views (excluding PR):</span> 
            {{ formatNumber(totalViews) }}</div>
          <div><span class="font-medium">Impact articles:</span> 
            {{ impactArticleCount }}</div>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article v-for="card in summaryCards" :key="card.label" class="rounded-xl border border-gray-100 bg-white p-5 shadow dark:border-gray-700 dark:bg-gray-800">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ card.label }}
          </p>
          <p class="mt-2 text-2xl font-bold" :class="card.color">
            {{ card.value }}
          </p>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ currentPeriodLabel }}
          </p>
        </article>
      </section>

      <section class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div class="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Writers</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Targets and article engagement for 
              {{ currentPeriodLabel }}</p>
          </div>
          <div class="flex gap-2">
            <button type="button" :disabled="loading || !writers.length" @click="exportSummary" class="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">Summary CSV</button>
            <button type="button" :disabled="loading || !writers.length" @click="exportDetails" class="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50">Detailed CSV</button>
          </div>
        </div>

        <div v-if="loading" class="p-10 text-center text-gray-500 dark:text-gray-400">Loading writer history…</div>
        <div v-else-if="errorMessage" class="p-10 text-center text-red-600 dark:text-red-400">
          {{ errorMessage }}
        </div>
        <div v-else-if="!writers.length" class="p-10 text-center text-gray-500 dark:text-gray-400">No published writer records found.</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[900px] text-left text-sm dark:text-gray-100">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th class="px-4 py-3">Writer</th><th class="px-4 py-3">Target</th><th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Articles</th><th class="px-4 py-3">Impact articles</th><th class="px-4 py-3">Impact views</th>
                <th class="px-4 py-3">PR views</th><th class="px-4 py-3">Views</th><th class="px-4 py-3">Progress</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="writer in periodWriters" :key="writer.id" class="border-t border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                <td class="px-4 py-3">
                  <p class="font-medium">{{ writerName(writer) }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ writer.user_created?.title || 'N/A' }} · {{ writer.user_created?.department?.title || 'N/A' }}</p>
                </td>
                <td class="px-4 py-3">
                  {{ formatNumber(writer.target || 0) }}
                </td>
                <td class="px-4 py-3"><span class="rounded-full px-2 py-1 text-xs" :class="writerCompleted(writer) ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                  {{ writerCompleted(writer) ? 'Completed' : 'In Progress' }}
                </span></td>
                <td class="px-4 py-3"><button type="button" class="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700" @click="openArticles(writer)">{{ writer.remarks.length }} Articles</button></td>
                <td class="px-4 py-3">
                  {{ writer.remarks.filter(isImpact).length }}
                </td>
                <td class="px-4 py-3">
                  {{ formatNumber(sumViews(writer.remarks.filter(isImpact))) }}
                </td>
                <td class="px-4 py-3">
                  {{ formatNumber(sumViews(writer.remarks.filter(isPr))) }}
                </td>
                <td class="px-4 py-3">
                  {{ formatNumber(sumViews(writer.remarks.filter(article => !isPr(article)))) }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex min-w-28 items-center gap-2">
                    <div class="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-600"><div class="h-2 rounded-full bg-blue-600" :style="{ width: 
                      `${Math.min(writerPercent(writer), 100)}%` }" /></div>
                    <span class="text-xs">{{ writerPercent(writer) }}%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <Transition name="fade">
      <div v-if="showArticles" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="showArticles = false">
        <section class="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-xl bg-white shadow-xl dark:bg-gray-800">
          <header class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
            <div><h2 class="font-semibold text-gray-900 dark:text-white">Articles by {{ selectedWriterName }}</h2><p class="text-sm text-gray-500 dark:text-gray-400">{{ currentPeriodLabel }} · {{ selectedArticles.length }} articles · {{ formatNumber(sumViews(selectedArticles)) }} views</p></div>
            <button type="button" aria-label="Close article history" class="rounded p-2 text-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" @click="showArticles = false">×</button>
          </header>
          <div class="overflow-auto p-4">
            <table class="w-full min-w-[700px] text-left text-sm dark:text-gray-100">
              <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-700 dark:text-gray-300"><tr><th class="px-3 py-2">#</th><th class="px-3 py-2">Title</th><th class="px-3 py-2">Views</th><th class="px-3 py-2">Type</th><th class="px-3 py-2">PR</th><th class="px-3 py-2">Created</th></tr></thead>
              <tbody>
                <tr v-for="(article, index) in selectedArticles" :key="article.id" class="border-t border-gray-100 dark:border-gray-700">
                  <td class="px-3 py-2">{{ index + 1 }}</td>
                  <td class="max-w-md px-3 py-2"><a v-if="article.article_link" :href="article.article_link" target="_blank" rel="noopener noreferrer" class="block truncate text-blue-600 hover:underline">{{ article.title || 'Untitled article' }}</a><span v-else>{{ article.title || 'Untitled article' }}</span></td>
                  <td class="px-3 py-2">{{ formatNumber(article.view || 0) }}</td><td class="px-3 py-2">{{ isImpact(article) ? 'Impact' : 'Simple' }}</td><td class="px-3 py-2">{{ isPr(article) ? 'Yes' : 'No' }}</td><td class="whitespace-nowrap px-3 py-2">{{ formatDate(article.date_created) }}</td>
                </tr>
                <tr v-if="!selectedArticles.length"><td colspan="6" class="p-8 text-center text-gray-500">No articles in this period.</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Transition>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import type { IResponse } from '~/types/api';
import type { IRemark, IWriter } from '~/utils/writers';
import { getKpiPeriodsFromArticles } from '~/utils/writers';
import { formatDate, formatNumber } from '~/utils/format';
import { useAuthStore } from '~/store/useAuthStore';

definePageMeta({ 
  middleware: ['auth', 'role'] 
});

type Period = { label: string; from: Date; to: Date };
type WriterRecord = IWriter & { remarks: IRemark[]; user_created?: IWriter['user_created'] & { department?: { id?: number; title: string } | null } };

const auth = useAuthStore();
const writers = ref<WriterRecord[]>([]);
const staffNames = ref<Record<string, string>>({});
const periods = ref<Record<string, Period>>({});
const selectedPeriod = ref('');
const loading = ref(false);
const errorMessage = ref('');
const showArticles = ref(false);
const selectedWriterId = ref<number | null>(null);
const selectedWriterName = ref('');

const currentPeriodLabel = computed(() => periods.value[selectedPeriod.value]?.label || 'All time');
const periodWriters = computed(() => writers.value.map(writer => ({
  ...writer,
  remarks: filterByPeriod(writer.remarks || []),
}))
);
const periodArticles = computed(() => periodWriters.value.flatMap(
  writer => writer.remarks)
);
const totalViews = computed(() => sumViews(periodArticles.value.filter(
  article => !isPr(article)))
);
const prViews = computed(() => sumViews(
  periodArticles.value.filter(isPr))
);
const impactViews = computed(() => sumViews(periodArticles.value.filter(
  isImpact)))
  ;
const impactArticleCount = computed(() => periodArticles.value.filter(
  isImpact).length
);
const selectedArticles = computed(() => {
  const writer = periodWriters.value.find(item => item.id === selectedWriterId.value);
  return [...(writer?.remarks || [])].sort((a, b) => new Date(b.date_created).getTime()
   - new Date(a.date_created).getTime()
  );
});
const summaryCards = computed(() => [
  { label: 'Writers', value: formatNumber(periodWriters.value.length), color: 'text-indigo-600 dark:text-indigo-400' },
  { label: 'Impact views', value: formatNumber(impactViews.value), color: 'text-red-600 dark:text-red-400' },
  { label: 'Total views', value: formatNumber(totalViews.value), color: 'text-blue-600 dark:text-blue-400' },
  { label: 'PR views', value: formatNumber(prViews.value), color: 'text-green-600 dark:text-green-400' },
]);

function isPr(article: IRemark) { return article.pr === true || String(
  article.pr) === 'true'; }
function isImpact(article: IRemark) { return article.impact_article === 'yes'; 
}
function sumViews(articles: IRemark[]) { return articles.reduce((
  sum, article) => sum + (parseInt(String(
    article.view ?? 0), 10) || 0), 0); 
  }
function filterByPeriod(articles: IRemark[]) {
  const period = periods.value[selectedPeriod.value];
  if (!period) return articles;
  return articles.filter(article => {
    const date = new Date(article.date_created);
    return !Number.isNaN(date.getTime()) && date >= period.from && date < period.to;
  });
}
function writerName(writer: WriterRecord) {
  const mapped = staffNames.value[String(writer.staff)];
  if (mapped) return mapped;
  const createdBy = [writer.user_created?.first_name, writer.user_created?.last_name].filter(Boolean).join(' ');
  return createdBy || [auth.user?.first_name, auth.user?.last_name].filter(
    Boolean).join(' ') || 'Unknown';
}
function writerCompleted(writer: WriterRecord) {
  return writer.status === 'completed' || sumViews(writer.remarks.filter(
    article => !isPr(article))) >= (parseInt(String(writer.target || 0), 10) || 0);
}
function writerPercent(writer: WriterRecord) {
  const target = parseInt(String(writer.target || 0), 10) || 0;
  return target > 0 ? Math.round(sumViews(writer.remarks.filter(
    article => !isPr(article))) / target * 100) : 0;
}
function openArticles(writer: WriterRecord) {
  selectedWriterId.value = writer.id;
  selectedWriterName.value = writerName(writer);
  showArticles.value = true;
}

watch(writers, list => {
  const articles = list.flatMap(writer => (
    writer.remarks || []).map(article => ({ date_created: String(
      article.date_created) }))
    );
  periods.value = getKpiPeriodsFromArticles(articles);
  const latest = Object.keys(periods.value).sort((a, b) => 
    periods.value[b].from.getTime() - periods.value[a].from.getTime())[0] || '';
    
  if (!periods.value[selectedPeriod.value]) 
      selectedPeriod.value = latest;
}, { immediate: true }
);

async function fetchAll<T>(url: string): Promise<T[]> {
  const results: T[] = [];
  const limit = 100;
  let offset = 0;

  while (true) {
    const response = await useApi<IResponse<T[]>>(
      `${url}&limit=${limit}&offset=${offset}`,
       { method: 'GET' }
      );

    const batch = response?.data || [];
    results.push(...batch);
    if (batch.length < limit) return results;
    offset += limit;  //បង្កើនទីតាំងចាប់ផ្តើមទាញ Data
  }
}

async function loadHistory() {
  loading.value = true;
  errorMessage.value = '';
  try {
    writers.value = await fetchAll<WriterRecord>(
      '/items/writers?filter[status][_eq]=published&fields=*,remarks.*,user_created.*,user_created.department.*&deep[remarks][_limit]=-1'
    );
    try {
      const staff = await fetchAll<any>(
        '/users?fields=id,first_name,last_name'
      );
      staffNames.value = Object.fromEntries(
        staff
          .filter(person => person.first_name || person.last_name)
          .map(person => [
            String(person.id), 
            [person.first_name, person.last_name]
              .filter(Boolean)
              .join(' ')
            ])
      );
    } catch (error) {
      console.warn(
        'Could not load staff names; using writer record names instead.', 
        error
      );
    }
  } catch (error) {
    console.error('Failed to load writer history:', error);
    errorMessage.value =
     'Could not load writer history. Please try again.';
  } finally {
    loading.value = false;
  }
}

function downloadCsv(rows: Record<string, unknown>[], filename: string) {
  const csv = Papa.unparse(rows);
  saveAs(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }), 
  `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
}

function exportSummary() {
  downloadCsv(
    periodWriters.value.map(writer => ({
    Writer: writerName(writer), 
    Position: writer.user_created?.title || 'N/A', 
    Department: writer.user_created?.department?.title || 'N/A',
    Period: currentPeriodLabel.value, 
    Target: writer.target || 0, 
    Status: writerCompleted(writer) 
      ? 'Completed' 
      : 'In Progress',
    Articles: writer.remarks.length, 
    'Impact articles': writer.remarks.filter(isImpact).length,
    'Impact views': sumViews(writer.remarks.filter(isImpact)), 
    'PR views': sumViews(writer.remarks.filter(isPr)),
    'Total views (excluding PR)': sumViews(
      writer.remarks.filter(article => !isPr(article))
    ),
  })), 
  'writer-performance-summary'
);

}
function exportDetails() {
  downloadCsv(
    periodWriters.value.flatMap(           //flatMap បញ្ចូល Array ទាំងនោះឱ្យទៅជាផ្ទៃតែមួយ
      writer => writer.remarks.map(article => ({
        Writer: writerName(writer),
        Department: 
          writer.user_created?.department?.title || 'N/A', 
        Period: currentPeriodLabel.value,
        Title: article.title || 'Untitled article', 
        Link: article.article_link || '', 
        Views: parseInt(String(article.view ?? 0), 10) || 0,
        Type: isImpact(article) ? 'Impact' : 'Simple', 
        PR: isPr(article) ? 'Yes' : 'No', 
      Created: formatDate(article.date_created),
  }))
), 
  'writer-performance-articles'
);
}

onMounted(loadHistory);
</script>

<style scoped>
.fade-enter-active, 
.fade-leave-active { 
  transition: opacity 0.2s ease; }
.fade-enter-from, 
.fade-leave-to { 
  opacity: 0; }
</style>
