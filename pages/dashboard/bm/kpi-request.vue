<!-- pages/dashboard/request/index.vue -->
<template>
  <div class="container min-h-screen mx-auto p-4 md:p-6">
    <div
      class="bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
      v-motion-slide-visible-once="{
        initial: { opacity: 0, y: 50 },
        visibleOnce: { opacity: 1, y: 0, transition: { duration: 600 } }
      }">
      <!-- Modern Header with Brand Identity -->
      <div class="relative overflow-hidden p-6 border-b dark:border-gray-800">
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-indigo-200/30 rounded-full -translate-y-1/2 translate-x-1/3 dark:from-blue-900/10 dark:to-indigo-800/10">
        </div>
        <div
          class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-100/20 to-indigo-100/20 rounded-full translate-y-1/2 -translate-x-1/3 dark:from-blue-900/5 dark:to-indigo-800/5">
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
          <div class="flex items-center gap-4">
            <div class="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
              <img src="/logo.png" alt="Bakseys Media Logo" class="h-10 w-auto" />
            </div>
            <div class="h-10 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {{ locale === 'en' ? 'Commission Request' : 'លិខិតស្នើសុំកម្រៃជើងសារ' }}
            </h1>
          </div>

          <div class="flex items-center gap-3">
            <div v-if="selectedCommission?.thumbnail" class="relative">
              <div class="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/10 rounded-lg animate-pulse"></div>
              <img :src="useImg(selectedCommission.thumbnail)"
                class="relative w-12 h-12 rounded-lg object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                alt="Commission" />
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{{ currentDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="p-6 space-y-8">
        <!-- Smart Card-Based Main Form -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md dark:hover:bg-gray-800/70">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ locale === 'en' ? 'Name' : 'ឈ្មោះ' }}
            </label>
            <input readonly v-model="form.name" type="text" class="block w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-sm 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30 transition-all" />
          </div>

          <div
            class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md dark:hover:bg-gray-800/70">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ locale === 'en' ? 'Department' : 'ដេប៉ាតឺម៉ង់' }}
            </label>
            <div class="relative">
              <input readonly v-model="form.departmentTitle" type="text" class="block w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-sm 
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30 transition-all" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md dark:hover:bg-gray-800/70">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ locale === 'en' ? 'Title' : 'ប្រភេទ' }}
            </label>
            <input v-model="form.category" type="text" class="block w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-sm 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30 transition-all" />
          </div>

          <div
            class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md dark:hover:bg-gray-800/70">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ locale === 'en' ? 'Total Bonus Amount' : 'ចំនួនប្រាក់រង្វាន់សរុប' }}
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 dark:text-gray-400">$</span>
              <input readonly v-model.number="form.totalBonusAmount" type="number" step="any" class="block w-full pl-10 px-4 py-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white shadow-sm 
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30 transition-all" />
            </div>
          </div>
        </div>

        <!-- Activity Table with Modern Glass Morphism Styling -->
        <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-sm">
          <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            <table class="w-full">
              <thead class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                <tr>
                  <th
                    class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {{ locale === 'en' ? 'Activity' : 'សកម្មភាព' }}
                  </th>
                  <th
                    class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {{ locale === 'en' ? 'Bonus Fee' : 'ប្រាក់រង្វាន់' }}
                  </th>
                  <th
                    class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {{ locale === 'en' ? 'Amount' : 'ចំនួន' }}
                  </th>
                  <th
                    class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {{ locale === 'en' ? 'Client' : 'អតិថិជន' }}
                  </th>
                  <th
                    class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {{ locale === 'en' ? 'Project Price' : 'តម្លៃគម្រោង' }}
                  </th>
                  <!-- <th
                      class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      {{ locale === 'en' ? 'Fee (%)' : 'កម្រៃសេវា (%)' }}
                    </th> -->
                  <th
                    class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {{ locale === 'en' ? 'Total' : 'សរុប' }}
                  </th>
                  <!-- references.image -->
                  <th
                    class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {{ locale === 'en' ? 'References Image' : 'រូបភាពយោង' }}
                  </th>
                  <th
                    class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {{ locale === 'en' ? 'References Link' : 'តំណភ្ជាប់ឯកសារយោង' }}
                  </th>
                  <th
                    class="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 w-20">
                    <span class="sr-only">{{ locale === 'en' ? 'Actions' : 'សកម្មភាព' }}</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                <tr v-for="(activity, index) in form.activities" :key="index"
                  class="transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-900/10" v-motion-fade-visible="{
                    initial: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 300, delay: index * 100 } }
                  }">
                  <td class="px-4 py-3">
                    <input v-model="activity.name" type="text" placeholder="Enter activity"
                      class="w-full px-3 py-2 rounded-md border border-gray-200 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30 transition-all text-sm" />
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <select v-model="activity.type_bonus_fee" @change="calculateBonusFee(index)"
                        class="px-2 py-2 rounded-md border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30 transition-all text-sm w-16">
                        <option value="$">$</option>
                        <option value="%">%</option>
                      </select>
                      <input v-model.number="activity.bonusFee" type="number" step="any" placeholder="0.00"
                        class="w-full px-3 py-2 rounded-md border border-gray-200 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30 transition-all text-sm" @input="calculateBonusFee(index)" />
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <input v-model.number="activity.amount" type="number" step="any" placeholder="0"
                      class="w-full px-3 py-2 rounded-md border border-gray-200 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30 transition-all text-sm" @input="calculateBonusFee(index)" />
                  </td>

                  <td class="px-4 py-3">
                    <div class="relative">
                      <!-- <select v-model="activity.clients"
                          class="w-full px-3 py-2 rounded-md appearance-none border border-gray-200 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30 transition-all text-sm"
                          @change="handleClientChange($event, index)">
                          <option value="" disabled>{{ locale === 'en' ? 'Select Client' : 'ជ្រើសរើសអតិថិជន' }}</option>
                          <option value="none">{{ locale === 'en' ? 'None' : 'អត់មាន' }}</option>
                          <option value="add_new">+ {{ locale === 'en' ? 'Add New Client' : 'បន្ថែមអតិថិជនថ្មី' }}
                          </option>
                          <option v-for="client in availableClients" :key="client.id" :value="client.name">
                            {{ client.name }}
                          </option>
                        </select> -->
                      <input v-model.number="activity.client" type="text" placeholder="client"
                        class="w-full px-3 py-2 rounded-md border border-gray-200 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30 transition-all text-sm" />
                      <!-- <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
                            </path>
                          </svg>
                        </div> -->

                      <!-- <div v-if="showNewClientInput[index]"
                          class="absolute z-10 mt-2 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-2"
                          v-motion-slide-visible="{
                            initial: { opacity: 0, y: -10 },
                            visible: { opacity: 1, y: 0, transition: { duration: 200 } }
                          }">
                          <div class="flex">
                            <input v-model="newClientNames[index]" type="text" placeholder="Enter new client name"
                              class="w-full rounded-l-md border border-gray-200 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700
                                  focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30 transition-all text-sm" @keyup.enter="addNewClient(index)" />
                            <button type="button" @click="addNewClient(index)" class="bg-green-500 text-white px-3 py-2 rounded-r-md hover:bg-green-600 transition-colors
                                  flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-400">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                              </svg>
                            </button>
                          </div>
                        </div> -->
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="relative">
                      <span
                        class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">$</span>
                      <input v-model.number="activity.project_price" type="number" step="any" placeholder="0"
                        @input="calculateBonusFee(index)"
                        class="w-full pl-8 px-3 py-2 rounded-md border border-gray-200 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30 transition-all text-sm" />
                    </div>
                  </td>
                  <!-- <td class="px-4 py-3">
                      <div class="relative">
                        <input v-model.number="activity.feeCharge" type="number" placeholder="0"
                          class="w-full px-3 py-2 rounded-md border border-gray-200 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30 transition-all text-sm" @input="calculateBonusFee(index)" />
                        <div class="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                          <span class="text-gray-500 dark:text-gray-400">%</span>
                        </div>
                      </div>
                    </td> -->
                  <td class="px-4 py-3">
                    <div class="relative">
                      <span
                        class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">$</span>
                      <input v-model.number="activity.total" type="number" step="any" readonly
                        class="w-full pl-8 px-3 py-2 rounded-md border border-gray-200 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-700 text-sm" />
                    </div>
                  </td>
                  <!-- References Section for each Activity Row -->
                  <td class="px-4 py-3">
                    <div class="space-y-2">
                      <div v-for="(reference, refIndex) in activity.references || []" :key="refIndex"
                        class="flex items-center gap-2">
                        <div class="relative group flex-1">
                          <input type="file" @change="(e) => handleFileChange(e, index, refIndex)" class="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all" />
                          <div v-if="reference.image" class="mt-1 flex items-center">
                            <img :src="useImg(reference.image)" class="h-8 w-8 object-cover rounded" alt="Reference" />
                            <span class="ml-2 text-xs text-gray-500 dark:text-gray-400 truncate">{{
                              getImageName(reference.image) }}</span>
                          </div>
                        </div>
                        <button v-if="activity.references && activity.references.length > 1" type="button"
                          @click="removeReference(index, refIndex)"
                          class="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                      <button type="button" @click="addReference(index)"
                        class="inline-flex items-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        {{ locale === 'en' ? 'Add Reference' : 'បន្ថែមឯកសារយោង' }}
                      </button>
                    </div>
                  </td>

                  <!-- References Link Section -->
                  <td class="px-4 py-3">
                    <div class="space-y-2">
                      <div v-for="(reference, refIndex) in activity.references || []" :key="refIndex"
                        class="flex items-center gap-2">
                        <input type="text" v-model="reference.link" placeholder="Enter reference link" class="flex-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700
            focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30 transition-all text-sm" />
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button type="button" @click="removeActivity(index)"
                      class="inline-flex items-center justify-center p-2 rounded-full text-red-500 hover:text-white hover:bg-red-500 transition-all focus:outline-none focus:ring-2 focus:ring-red-400">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="form.activities.length > 1" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                        </path>
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 font-medium">
                  <td colspan="4" class="px-4 py-4 text-right text-gray-700 dark:text-gray-300">
                    {{ locale === 'en' ? 'Total:' : 'សរុប:' }}
                  </td>
                  <td class="px-4 py-4 font-bold text-blue-600 dark:text-blue-400 text-right">
                    ${{ formatMoney(totalProjectPrice) }}
                  </td>
                  <td class="px-4 py-4 font-bold text-blue-600 dark:text-blue-400 text-right">
                    ${{ formatMoney(totaltotal) }}
                  </td>
                  <td colspan="3" class="px-4 py-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 px-4 py-4">
            <button type="button" @click="addActivity" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                </path>
              </svg>
              {{ locale === 'en' ? 'Add Activity' : 'បន្ថែមសកម្មភាព' }}
            </button>
          </div>
        </div>

        <!-- Approvers Section with Cards -->
        <div class="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ locale === 'en' ? 'Approvals' : 'ការអនុម័ត' }}
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="(approver, index) in approvers.filter(a => visibleApprovers[a])" :key="index"
              class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
              v-motion-slide-visible="{
                initial: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 300, delay: index * 150 } }
              }">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="{
                    'bg-green-100 dark:bg-green-900/30': form[approver].name,
                    'bg-gray-100 dark:bg-gray-700': !form[approver].name,
                  }">
                    <span class="w-3 h-3 rounded-full" :class="{
                      'bg-green-500': form[approver].name,
                      'bg-gray-300 dark:bg-gray-500': !form[approver].name
                    }"></span>
                  </div>
                  <h3 class="font-semibold capitalize text-gray-800 dark:text-white text-sm">
                    {{ formatApproverTitle(approver) }}
                  </h3>
                </div>
                <button type="button" @click="toggleApprover(approver)"
                  class="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors"
                  :title="locale === 'en' ? 'Remove' : 'លុប'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
              </div>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {{ locale === 'en' ? 'Name' : 'ឈ្មោះ' }}
                  </label>
                  <input readonly v-model="form[approver].name" type="text"
                    class="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white text-sm" />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {{ locale === 'en' ? 'Position' : 'តួនាទី' }}
                  </label>
                  <input readonly v-model="form[approver].position" type="text"
                    class="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white text-sm" />
                </div>
              </div>
            </div>
          </div>

          <!-- Show hidden approvers as buttons to add them back -->
          <div v-if="approvers.some(a => !visibleApprovers[a])" class="mt-4 flex flex-wrap gap-2">
            <button v-for="approver in approvers.filter(a => !visibleApprovers[a])" :key="approver" type="button"
              @click="toggleApprover(approver)"
              class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                </path>
              </svg>
              {{ formatApproverTitle(approver) }}
            </button>
          </div>
        </div>
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4" v-motion-slide-visible-once="{
          initial: { opacity: 0, y: 20 },
          visibleOnce: { opacity: 1, y: 0, transition: { duration: 400 } }
        }">
          <button type="button" @click="resetForm" class="group w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 
                  focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all
                  dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700">
            <svg class="w-5 h-5 mr-2 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
              </path>
            </svg>
            {{ locale === 'en' ? 'Reset Form' : 'កំណត់ឡើងវិញ' }}
          </button>
          <button type="button" @click="showPreview = true" class="group w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-indigo-300 shadow-sm text-base font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all
                  dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700 dark:hover:bg-indigo-900/50">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
              </path>
            </svg>
            {{ locale === 'en' ? 'Preview Document' : 'មើលឯកសារ' }}
          </button>
          <button type="submit" class="group w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all">
            <svg class="w-5 h-5 mr-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
              </path>
            </svg>
            {{ locale === 'en' ? 'Submit Request' : 'ដាក់ស្នើសុំ' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Preview Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showPreview" class="fixed inset-0 z-50 overflow-y-auto" @click.self="showPreview = false">
          <div class="flex min-h-screen items-center justify-center p-4">
            <!-- Backdrop -->
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="showPreview = false">
            </div>

            <!-- Modal Content -->
            <div
              class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
              v-motion-pop-visible="{
                initial: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1, transition: { duration: 300 } }
              }">

              <!-- Modal Header -->
              <div
                class="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                      </path>
                    </svg>
                  </div>
                  <h2 class="text-xl font-bold text-white">
                    {{ locale === 'en' ? 'Document Preview' : 'មើលឯកសារជាមុន' }}
                  </h2>
                </div>
                <div class="flex items-center gap-2">
                  <button @click="printDocument"
                    class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z">
                      </path>
                    </svg>
                    {{ locale === 'en' ? 'Print' : 'បោះពុម្ព' }}
                  </button>
                  <button @click="showPreview = false"
                    class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                      </path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Document Content -->
              <div
                class="overflow-y-auto max-h-[calc(90vh-80px)] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:bg-gray-800 p-8">
                <div id="printable-document" class="bg-white mx-auto relative overflow-hidden"
                  style="width: 210mm; min-height: 297mm; padding: 20mm; box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.15), 0 10px 30px rgba(0,0,0,0.1);">

                  <!-- Background Image at 100% opacity -->
                  <div class="absolute inset-0 pointer-events-none">
                    <img src="/business-cambodia-kpi-bg.png" alt="" class="w-full h-full object-cover" />
                  </div>

                  <!-- Content Wrapper with relative positioning -->
                  <div class="relative z-10">

                    <!-- Header with Logo and Title -->
                    <div class="flex items-start justify-between mb-6">

                      <div class="flex-1 text-center">
                        <h1 class="text-xl font-bold text-gray-900  decoration-2 underline-offset-4">
                          {{ locale === 'en' ? 'Request Commission Letter' : 'លិខិតស្នើសុំបើកប្រាក់កម្រៃជើងសារ' }}
                        </h1>
                      </div>
                    </div>

                    <!-- Basic Information -->
                    <div class="mb-6 space-y-1 text-sm">
                      <div class="flex">
                        <span class="font-bold w-48">{{ locale === 'en' ? 'Name:' : 'ឈ្មោះ:' }}</span>
                        <span>{{ form.name }}</span>
                      </div>
                      <div class="flex">
                        <span class="font-bold w-48">{{ locale === 'en' ? 'Team:' : 'ក្រុម:' }}</span>
                        <span>{{ form.departmentTitle }}</span>
                      </div>
                      <div class="flex">
                        <span class="font-bold w-48">{{ locale === 'en' ? 'Total Bonus Amount:' :
                          'ចំនួនប្រាក់រង្វាន់សរុប:' }}</span>
                        <span class="font-bold text-gray-900">{{ formatMoney(form.totalBonusAmount, {
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
                          <tr class=" bg-red-500 border-t-2 border-black">
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
                          <tr v-for="(activity, index) in form.activities" :key="index" class="bg-white">
                            <td class="border-2 border-black px-3 py-2">{{ activity.name || '' }}</td>
                            <td class="border-2 border-black px-3 py-2 text-center">{{ activity.amount || '' }}</td>
                            <td class="border-2 border-black px-3 py-2">{{ activity.client || '' }}</td>
                            <td class="border-2 border-black px-3 py-2 text-right">{{ activity.project_price ?
                              formatMoney(activity.project_price, { minimumFractionDigits: 2 }) : '' }}</td>
                            <td class="border-2 border-black px-3 py-2 text-right">{{ activity.bonusFee ?
                              activity.bonusFee + (activity.type_bonus_fee || '$') : '' }}</td>
                            <td class="border-2 border-black px-3 py-2 text-right">{{ activity.total ?
                              formatMoney(activity.total, { minimumFractionDigits: 2 }) : '' }}</td>
                          </tr>
                          <!-- Add empty rows to fill space if needed -->
                          <tr v-for="n in Math.max(0, 3 - form.activities.length)" :key="'empty-' + n" class="bg-white">
                            <td class="border-2 border-black px-3 py-8">&nbsp;</td>
                            <td class="border-2 border-black px-3 py-8">&nbsp;</td>
                            <td class="border-2 border-black px-3 py-8">&nbsp;</td>
                            <td class="border-2 border-black px-3 py-8">&nbsp;</td>
                            <td class="border-2 border-black px-3 py-8">&nbsp;</td>
                            <td class="border-2 border-black px-3 py-8">&nbsp;</td>
                          </tr>
                          <!-- Total Row -->
                          <tr class="bg-transparent border-t-4 border-black">
                            <td colspan="3" class="border-2 border-black px-3 py-2 text-right font-bold"></td>
                            <td class="border-2 border-black px-3 py-2 text-right font-bold text-gray-900">
                              {{ formatMoney(totalProjectPrice, { minimumFractionDigits: 2 }) }}$
                            </td>
                            <td class="border-2 border-black px-3 py-2 text-right font-bold"></td>
                            <td class="border-2 border-black px-3 py-2 text-right font-bold text-gray-900">
                              {{ formatMoney(totaltotal, { minimumFractionDigits: 2 }) }}$
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
                            <th v-if="visibleApprovers.checkedBy"
                              class="border-2 border-black px-3 py-2 font-bold text-center" :class="{
                                'w-1/4': approvers.filter(a => visibleApprovers[a]).length === 4,
                                'w-1/3': approvers.filter(a => visibleApprovers[a]).length === 3,
                                'w-1/2': approvers.filter(a => visibleApprovers[a]).length === 2,
                                'w-full': approvers.filter(a => visibleApprovers[a]).length === 1
                              }">
                              {{ locale === 'en' ? 'Checked By' : 'ត្រួតពិនិត្យដោយ' }}
                            </th>
                            <th v-if="visibleApprovers.verifiedBy"
                              class="border-2 border-black px-3 py-2 font-bold text-center" :class="{
                                'w-1/4': approvers.filter(a => visibleApprovers[a]).length === 4,
                                'w-1/3': approvers.filter(a => visibleApprovers[a]).length === 3,
                                'w-1/2': approvers.filter(a => visibleApprovers[a]).length === 2,
                                'w-full': approvers.filter(a => visibleApprovers[a]).length === 1
                              }">
                              {{ locale === 'en' ? 'Verified by:' : 'ផ្ទៀងផ្ទាត់ដោយ:' }}
                            </th>
                            <th v-if="visibleApprovers.approvedBy"
                              class="border-2 border-black px-3 py-2 font-bold text-center" :class="{
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
                                  <p class="font-semibold">{{ form.requestedBy.name }}</p>
                                  <p class="text-gray-600">{{ form.requestedBy.position }}</p>
                                  <p class="text-gray-600 mt-1 whitespace-nowrap">{{ locale === 'en' ? 'Date' :
                                    'កាលបរិច្ឆេទ' }}: {{ currentDate }}</p>
                                </div>
                              </div>
                            </td>
                            <td v-if="visibleApprovers.checkedBy" class="border-2 border-black px-3 align-bottom"
                              style="height: 128px; vertical-align: bottom;">
                              <div class="signature-cell">
                                <div class="text-xs">
                                  <p class="font-semibold">{{ form.checkedBy.name }}</p>
                                  <p class="text-gray-600">{{ form.checkedBy.position }}</p>
                                  <p class="text-gray-600 mt-1 whitespace-nowrap">{{ locale === 'en' ? 'Date' :
                                    'កាលបរិច្ឆេទ' }}: {{ currentDate }}</p>
                                </div>
                              </div>
                            </td>
                            <td v-if="visibleApprovers.verifiedBy" class="border-2 border-black px-3 align-bottom"
                              style="height: 128px; vertical-align: bottom;">
                              <div class="signature-cell">
                                <div class="text-xs">
                                  <p class="font-semibold">{{ form.verifiedBy.name }}</p>
                                  <p class="text-gray-600">{{ form.verifiedBy.position }}</p>
                                  <p class="text-gray-600 mt-1 whitespace-nowrap">{{ locale === 'en' ? 'Date' :
                                    'កាលបរិច្ឆេទ' }}: {{ currentDate }}</p>
                                </div>
                              </div>
                            </td>
                            <td v-if="visibleApprovers.approvedBy" class="border-2 border-black px-3 align-bottom"
                              style="height: 128px; vertical-align: bottom;">
                              <div class="signature-cell">
                                <div class="text-xs">
                                  <p class="font-semibold">{{ form.approvedBy.name }}</p>
                                  <p class="text-gray-600">{{ form.approvedBy.position }}</p>
                                  <p class="text-gray-600 mt-1 whitespace-nowrap">{{ locale === 'en' ? 'Date' :
                                    'កាលបរិច្ឆេទ' }}: {{ currentDate }}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <!-- References Section -->
                    <div class="mb-8"
                      v-if="form.activities.some(activity => activity.references && activity.references.length > 0 && activity.references.some(ref => ref.image))">
                      <h3 class="text-sm font-bold text-gray-900 mb-3">
                        {{ locale === 'en' ? 'References' : 'ឯកសារយោង' }}
                      </h3>
                      <div class="grid grid-cols-3 gap-4">
                        <template v-for="(activity, activityIndex) in form.activities" :key="activityIndex">
                          <template v-for="(reference, refIndex) in activity.references"
                            :key="`${activityIndex}-${refIndex}`">
                            <div v-if="reference.image" class="reference-image-wrapper">
                              <img :src="useImg(reference.image)"
                                :alt="`Reference ${activityIndex + 1}-${refIndex + 1}`"
                                class="h-32 w-auto object-cover max-w-full" style="max-height: 128px; height: 128px;" />
                              <!-- <p class="text-xs text-gray-600 mt-1 text-center">{{ activity.name || `Activity
                                ${activityIndex + 1}` }}</p> -->
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
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ICampaign } from '~/types/campaigns';
import type { Commission } from '~/types/commission';
import Swal from 'sweetalert2';
import { useAuthStore } from '~/store/useAuthStore';
import { useRouter } from 'vue-router';
import type { IResponse } from '~/types/api';

const { t, locale } = useI18n();
const router = useRouter();
const auth = useAuthStore();

// Format money with thousand separators
const formatMoney = (
  value: number | string,
  { currency: _currency = 'USD', locale = 'en-US', minimumFractionDigits = 2 } = {}
): string => {
  const num =
    typeof value === 'string'
      ? parseFloat(value.replace(/[^0-9.\-]/g, '')) || 0
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

// Fetch campaigns from API
const campangs: ICampaign[] = (
  await (<Promise<IResponse<ICampaign[]>>>(
    useApi(
      `/items/campaigns?fields=*,client.*,client.category.*`,
      { method: 'GET' }
    )
  ))
).data;

// Fetch commission data from API
const formCommision = (
  await (<Promise<IResponse<Commission[]>>>(
    useApi(
      `/items/baksey?filter[status]=published&fields=*,department.id,department.title,verifiedBy.id,verifiedBy.first_name,verifiedBy.last_name,verifiedBy.title,staff.id,staff.directus_users_id.id,staff.directus_users_id.first_name,staff.directus_users_id.title,staff.directus_users_id.last_name,staff.directus_users_id.email,checkBy.id,checkBy.first_name,checkBy.last_name,checkBy.title,approvedBy.id,approvedBy.first_name,approvedBy.last_name,approvedBy.title`,
      { method: 'GET' }
    )
  ))
).data;

// Store for custom added clients
const customClients = ref<{ id: string; name: string }[]>([]);

// Computed property to combine both API clients and custom added clients
const availableClients = computed(() => {
  return [...campangs, ...customClients.value];
});

// Track which rows have the "add new client" input showing
const showNewClientInput = ref<Record<number, boolean>>({});

// Store new client names being typed
const newClientNames = ref<Record<number, string>>({});




// =============================
// Helper to extract image name from path
const getImageName = (imagePath: string | { id: string }) => {
  if (!imagePath) return '';
  // If imagePath is an object with id, return a short version of the ID
  if (typeof imagePath === 'object' && 'id' in imagePath) {
    return imagePath.id.substring(0, 8) + '...';
  }
  // If it's a string path, get the filename
  const parts = String(imagePath).split('/');
  return parts[parts.length - 1];
};

// Add a new reference to an activity
const addReference = (activityIndex: number) => {
  if (!form.value.activities[activityIndex].references) {
    form.value.activities[activityIndex].references = [];
  }

  form.value.activities[activityIndex].references.push({
    image: null,
    link: '',
  });
};

// Remove a reference from an activity
const removeReference = (activityIndex: number, referenceIndex: number) => {
  form.value.activities[activityIndex].references.splice(referenceIndex, 1);
};

// Handle file upload for a specific reference
const handleFileChange = async (event: Event, activityIndex: number, referenceIndex: number) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];

  try {
    // Ensure references array exists
    if (!form.value.activities[activityIndex].references) {
      form.value.activities[activityIndex].references = [];
    }

    // This will depend on how you handle file uploads
    // 1. Upload the file
    const formData = new FormData();
    formData.append('file', file);

    const response = await useApi<{ data: { id: string } }>('/files', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // 2. Set the image ID in the reference
    if (response && response.data && response.data.id) {
      form.value.activities[activityIndex].references[referenceIndex].image = response.data.id;
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    Swal.fire({
      title: locale.value === 'en' ? 'Error' : 'មានបញ្ហា',
      text: locale.value === 'en' ? 'Failed to upload file' : 'បរាជ័យក្នុងការផ្ទុកឡើងឯកសារ',
      icon: 'error',
    });
  }
};





// =============================
// Define types
interface Activity {
  name: string;
  bonusFee: number;
  amount: number;
  client: string;
  total: number;
  project_price: number;
  type_bonus_fee: string;
  references: Array<{
    image: string | null;
    link: string;
  }>;
}

interface Person {
  id?: string;
  name: string;
  position: string;
}

interface KPIForm {
  name: string;
  departmentTitle: string; // New field to store department title for display
  department: string;
  category: string;
  totalBonusAmount: number;
  activities: Activity[];
  requestedBy: Person;
  checkedBy: Person;
  verifiedBy: Person;
  approvedBy: Person;
  reference?: string;
}

// API submission format with just IDs
interface KPISubmission {
  name: string;
  department: string;
  category: string;
  totalBonusAmount: number | string; // Changed to allow string
  activities: Activity[];
  requestedBy: string;
  checkedBy: string;
  verifiedBy: string;
  approvedBy: string;
  reference?: string;
}

const approvers = ['requestedBy', 'checkedBy', 'verifiedBy', 'approvedBy'] as const;

// Track which approvers are visible
const visibleApprovers = ref({
  requestedBy: true,
  checkedBy: true,
  verifiedBy: true,
  approvedBy: true
});

// Toggle approver visibility
const toggleApprover = (approver: string) => {
  visibleApprovers.value[approver as keyof typeof visibleApprovers.value] = !visibleApprovers.value[approver as keyof typeof visibleApprovers.value];
};

// Format approver titles for display
const formatApproverTitle = (approver: string) => {
  const titles = {
    requestedBy: locale.value === 'en' ? 'Requested By' : 'ស្នើសុំដោយ',
    checkedBy: locale.value === 'en' ? 'Checked By' : 'ត្រួតពិនិត្យដោយ',
    verifiedBy: locale.value === 'en' ? 'Verified By' : 'ផ្ទៀងផ្ទាត់ដោយ',
    approvedBy: locale.value === 'en' ? 'Approved By' : 'អនុម័តដោយ'
  };

  return titles[approver as keyof typeof titles] || approver.replace(/([A-Z])/g, ' $1').trim();
};
// Initialize form with department ID instead of title
const form: Ref<KPIForm> = ref({
  name: auth.user?.first_name + ' ' + auth.user?.last_name || '',
  department: auth.user?.department?.id || '', // Changed to use ID instead of title
  departmentTitle: auth.user?.department?.title || '', // Keep title for display purposes
  category: auth.user?.title || '',
  totalBonusAmount: 0,
  activities: [{
    name: '',
    bonusFee: 0,
    amount: 1,
    client: '',
    project_price: 0,
    type_bonus_fee: '$',
    total: 0,
    references: [{ image: null, link: '' }]
  }],
  requestedBy: {
    name: auth.user?.first_name + ' ' + auth.user?.last_name || '',
    position: auth.user?.title || '',
    id: auth.user?.id ? String(auth.user.id) : ''
  },
  checkedBy: {
    id: '',
    name: '',
    position: ''
  },
  verifiedBy: {
    id: '',
    name: '',
    position: ''
  },
  approvedBy: {
    id: '',
    name: '',
    position: ''
  },
  reference: ''
});

// Preview modal state
const showPreview = ref(false);

// Generate document number based on date and user
const generateDocNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const userId = auth.user?.id ? String(auth.user.id).padStart(4, '0') : '0000';
  return `CR-${year}${month}${day}-${userId}`;
};

// Print document function
const printDocument = () => {
  const printContent = document.getElementById('printable-document');
  if (!printContent) return;

  // Clone the content
  const clonedContent = printContent.cloneNode(true) as HTMLElement;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Commission Request - ${generateDocNumber()}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          @page {
            size: A4;
            margin: 0;
          }
          
          @media print {
            html, body {
              width: 210mm;
              height: 297mm;
              margin: 0;
              padding: 0;
            }
            
            /* Force background images to print */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.5;
            color: #1f2937;
            background: white;
            margin: 0;
            padding: 0;
            width: 210mm;
            height: 297mm;
          }
          
          .print-container {
            width: 210mm;
            height: 297mm;
            position: relative;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: white;
          }
          
          /* Background image as img tag */
          .bg-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 210mm;
            height: 297mm;
            z-index: 0;
            object-fit: cover;
            opacity: 1;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Content wrapper */
          .content-wrapper {
            position: relative;
            width: 210mm;
            height: 297mm;
            padding: 20mm;
            z-index: 1;
          }
          
          /* Hide the original background div */
          .absolute.inset-0.pointer-events-none {
            display: none !important;
          }
          
          /* Table styles */
          table {
            border-collapse: collapse;
            width: 100%;
            font-size: 14px;
            margin: 0;
            background: transparent;
          }
          
          th, td {
            border: 2px solid #000 !important;
            padding: 8px 12px;
          }
          
          th {
            font-weight: bold;
            text-align: center;
          }
          
          tbody tr {
            background: white !important;
          }
          
          .bg-red-500 {
            background-color: #ef4444 !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .bg-white {
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .bg-transparent {
            background-color: transparent !important;
          }
          
          .border-2 {
            border-width: 2px !important;
          }
          
          .border-black {
            border-color: #000 !important;
          }
          
          .border-t-2 {
            border-top-width: 2px !important;
          }
          
          .border-t-4 {
            border-top-width: 4px !important;
          }
          
          .font-bold {
            font-weight: 700;
          }
          
          .font-semibold {
            font-weight: 600;
          }
          
          .text-right {
            text-align: right;
          }
          
          .text-center {
            text-align: center;
          }
          
          .text-gray-900 {
            color: #111827;
          }
          
          .text-gray-600 {
            color: #4b5563;
          }
          
          .mb-6 {
            margin-bottom: 1.5rem;
          }
          
          .mb-8 {
            margin-bottom: 2rem;
          }
          
          .mb-3 {
            margin-bottom: 0.75rem;
          }
          
          .mt-1 {
            margin-top: 0.25rem;
          }
          
          .flex {
            display: flex;
          }
          
          .flex-col {
            flex-direction: column;
          }
          
          .justify-between {
            justify-content: space-between;
          }
          
          .items-start {
            align-items: flex-start;
          }
          
          .flex-1 {
            flex: 1;
          }
          
          .space-y-1 > * + * {
            margin-top: 0.25rem;
          }
          
          .w-48 {
            width: 12rem;
          }
          
          .w-1\\/4 {
            width: 25%;
          }
          
          h1 {
            font-size: 1.25rem;
            font-weight: bold;
            margin: 0;
            text-decoration: underline;
            text-decoration-thickness: 2px;
            text-underline-offset: 4px;
          }
          
          h3 {
            font-size: 0.875rem;
            font-weight: bold;
          }
          
          .h-32 {
            height: 8rem;
          }
          
          .align-top {
            vertical-align: top;
          }
          
          .text-xs {
            font-size: 0.75rem;
          }
          
          .text-sm {
            font-size: 0.875rem;
          }
          
          .px-3 {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          
          .py-2 {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }
          
          .py-8 {
            padding-top: 2rem;
            padding-bottom: 2rem;
          }
          
          .grid {
            display: grid;
          }
          
          .grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          
          .gap-4 {
            gap: 1rem;
          }
          
          .h-32 {
            height: 8rem;
          }
          
          .object-cover {
            object-fit: cover;
          }
          
          .relative {
            position: relative;
          }
          
          /* Ensure images in references section display properly */
          img:not(.bg-image) {
            max-width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <img src="${window.location.origin}/business-cambodia-kpi-bg.png" alt="" class="bg-image" />
          <div class="content-wrapper">
            ${clonedContent.innerHTML}
          </div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 1000);
};



// Calculate total bonus fee
const totaltotal = computed(() => {
  return form.value.activities.reduce((sum, activity) => sum + (activity.total || 0), 0);
});

const totalProjectPrice = computed(() => {
  return form.value.activities.reduce((sum, activity) => sum + (Number(activity.project_price) || 0), 0);
});
// Create a mapping of department IDs to titles for the dropdown
const departmentMapping = computed(() => {
  return formCommision
    .filter(commission => commission.department?.id && commission.department?.title)
    .reduce((map, commission) => {
      map[commission.department.id] = commission.department.title;
      return map;
    }, {} as Record<string, string>);
});
// Create a reactive departments list for department dropdown with both ID and title
const availableDepartments = computed(() => {
  return formCommision
    .filter(commission => commission.department?.id && commission.department?.title)
    .map(commission => ({
      id: commission.department.id,
      title: commission.department.title
    }));
});


// Debug function to help troubleshoot
const logDebugInfo = () => {
  console.log('User auth info:', auth.user);
  console.log('Current form department:', form.value.department);
  console.log('Available commission departments:', formCommision.map(c => c.department?.title));
};

// Function to calculate bonus fee for an activity
const calculateBonusFee = (index: number) => {
  const activity = form.value.activities[index];

  if (activity.type_bonus_fee === '%') {
    activity.total = (activity.project_price * (activity.bonusFee / 100)) * activity.amount;
  } else {
    activity.total = activity.bonusFee * activity.amount;
  }

  // Update total bonus amount
  form.value.totalBonusAmount = totaltotal.value;
};

// Handle change in the client dropdown
const handleClientChange = (event: Event, index: number) => {
  const select = event.target as HTMLSelectElement;

  if (select.value === 'add_new') {
    // Show the input field for adding a new client
    showNewClientInput.value[index] = true;
    // Reset the selected value temporarily
    form.value.activities[index].client = '';
  } else {
    // Hide the input field
    showNewClientInput.value[index] = false;
  }
};

// Add a new client to the list
const addNewClient = (index: number) => {
  const newClientName = newClientNames.value[index]?.trim();

  if (newClientName) {
    // Create a unique ID for the new client
    const newId = `custom-${Date.now()}`;

    // Add to custom clients list
    customClients.value.push({
      id: newId,
      name: newClientName
    });

    // Set the new client as the selected value
    form.value.activities[index].client = newClientName;

    // Reset and hide the input
    newClientNames.value[index] = '';
    showNewClientInput.value[index] = false;
  }
};

// Separate function to update approvers for better organization
// Separate function to update approvers based on department ID
const updateApprovers = (departmentId: string) => {
  if (!departmentId) return;

  console.log('Updating approvers for department ID:', departmentId);

  // Find commission record by department ID
  const departmentCommission = formCommision.find(commission =>
    commission.department?.id === Number(departmentId)
  );

  if (departmentCommission) {
    console.log('Found matching commission record:', departmentCommission);

    // Set department title for display
    form.value.departmentTitle = departmentCommission.department?.title || '';

    // Update checkedBy
    if (departmentCommission.checkBy) {
      form.value.checkedBy.id = departmentCommission.checkBy.id;
      form.value.checkedBy.name = `${departmentCommission.checkBy.first_name} ${departmentCommission.checkBy.last_name}`;
      form.value.checkedBy.position = departmentCommission.checkBy.title || '';
    }

    // Update verifiedBy
    if (departmentCommission.verifiedBy) {
      form.value.verifiedBy.id = departmentCommission.verifiedBy.id;
      form.value.verifiedBy.name = `${departmentCommission.verifiedBy.first_name} ${departmentCommission.verifiedBy.last_name}`;
      form.value.verifiedBy.position = departmentCommission.verifiedBy.title || '';
    }

    // Update approvedBy
    if (departmentCommission.approvedBy) {
      form.value.approvedBy.id = departmentCommission.approvedBy.id;
      form.value.approvedBy.name = `${departmentCommission.approvedBy.first_name} ${departmentCommission.approvedBy.last_name}`;
      form.value.approvedBy.position = departmentCommission.approvedBy.title || '';
    }
  } else {
    console.warn('No matching department found in commission records for ID:', departmentId);

    // If no matching department is found, reset approver fields
    form.value.departmentTitle = ''; // Clear display title too
    form.value.checkedBy = { name: '', position: '', id: '' };
    form.value.verifiedBy = { name: '', position: '', id: '' };
    form.value.approvedBy = { name: '', position: '', id: '' };
  }
};


const selectedCommission = computed(() => {
  if (!form.value.department) return null;
  return formCommision.find(c =>
    c.department?.id === Number(form.value.department)
  );
});

// Add a new activity row
const addActivity = () => {
  form.value.activities.push({
    name: '',
    bonusFee: 0,
    amount: 0,
    client: '',
    project_price: 0,
    type_bonus_fee: '$',
    total: 0,
    references: [{ image: null, link: '' }]
  });
};

// Remove an activity row
const removeActivity = (index: number) => {
  if (form.value.activities.length > 1) {
    form.value.activities.splice(index, 1);
  } else {
    // Clear the single row instead of removing it
    form.value.activities[0] = {
      name: '',
      bonusFee: 0,
      amount: 0,
      client: '',
      project_price: 0,
      type_bonus_fee: '$',
      // feeCharge: 0,
      total: 0,
      references: [{ image: null, link: '' }]
    };
  }

  // Recalculate total
  form.value.totalBonusAmount = totaltotal.value;
};
const resetForm = () => {
  form.value = {
    name: auth.user?.first_name + ' ' + auth.user?.last_name || '',
    department: auth.user?.department?.id || '', // Department ID
    departmentTitle: auth.user?.department?.title || '', // Department title
    category: '',
    totalBonusAmount: 0,
    activities: [{
      name: '',
      bonusFee: 0,
      amount: 0,
      client: '',
      project_price: 0,
      type_bonus_fee: '$',
      total: 0,
      references: [{ image: null, link: '' }]
    }],
    requestedBy: {
      name: auth.user?.first_name + ' ' + auth.user?.last_name || '',
      position: auth.user?.title || '',
      id: auth.user?.id ? String(auth.user.id) : ''
    },
    checkedBy: {
      id: '',
      name: '',
      position: ''
    },
    verifiedBy: {
      id: '',
      name: '',
      position: ''
    },
    approvedBy: {
      id: '',
      name: '',
      position: ''
    },
    reference: ''
  };

  // Reset custom clients
  customClients.value = [];
  showNewClientInput.value = {};
  newClientNames.value = {};
};

// Prepare data for API submission (only including IDs for approvers)
const prepareFormData = (): KPISubmission => {
  return {
    name: form.value.name,
    department: form.value.department,
    category: form.value.category,
    totalBonusAmount: form.value.totalBonusAmount,
    activities: form.value.activities,
    // Only send IDs for the approvers
    requestedBy: form.value.requestedBy.id || '',
    checkedBy: form.value.checkedBy.id || '',
    verifiedBy: form.value.verifiedBy.id || '',
    approvedBy: form.value.approvedBy.id || '',
    reference: form.value.reference
  };
};

// Submit form to API
const submitForm = async () => {
  try {
    // Validate form
    if (!form.value.name || !form.value.department) {
      return Swal.fire({
        title: locale.value === 'en' ? 'Validation Error' : 'កំហុសការផ្ទៀងផ្ទាត់',
        text: locale.value === 'en' ? 'Please fill in all required fields' : 'សូមបំពេញគ្រប់វាលដែលត្រូវការ',
        icon: 'error'
      });
    }

    // Check for empty activities
    const hasEmptyActivity = form.value.activities.some(a => !a.name);
    if (hasEmptyActivity) {
      return Swal.fire({
        title: locale.value === 'en' ? 'Validation Error' : 'កំហុសការផ្ទៀងផ្ទាត់',
        text: locale.value === 'en' ? 'All activities must have a name' : 'សកម្មភាពទាំងអស់ត្រូវតែមានឈ្មោះ',
        icon: 'error'
      });
    }

    // Show loading indicator
    Swal.fire({
      title: locale.value === 'en' ? 'Submitting...' : 'កំពុងដាក់ស្នើ...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Prepare data with only IDs for approvers
    const submissionData = prepareFormData();

    // Defensive parsing for string-typed fields in Directus
    submissionData.totalBonusAmount = String(submissionData.totalBonusAmount) as any;

    console.log('[KPI CREATE] POST payload:', submissionData);

    // Send data to API
    const response = await useApi<{ data: { id: string } }>('/items/kpi', {
      method: 'POST',
      data: submissionData
    });

    // Show success message
    Swal.fire({
      title: locale.value === 'en' ? 'Success!' : 'ជោគជ័យ!',
      text: locale.value === 'en' ? 'Your commission request has been submitted successfully' : 'សំណើកម្រៃជើងសាររបស់អ្នកត្រូវបានដាក់ស្នើដោយជោគជ័យ',
      icon: 'success',
      confirmButtonText: locale.value === 'en' ? 'View Requests' : 'មើលសំណើ'
    }).then((result) => {
      if (result.isConfirmed) {
        // Navigate to commission requests list by id
        const commissionId = (response as { data: { id: string } }).data.id;
        router.push(`/dashboard/history-kpi/${commissionId}`);
      }
    });

    // Reset form
    resetForm();

  } catch (error) {
    console.error('Error submitting form:', error);
    Swal.fire({
      title: locale.value === 'en' ? 'Error' : 'មានបញ្ហា',
      text: locale.value === 'en' ? 'An error occurred while submitting your request' : 'មានកំហុសកើតឡើងពេលដាក់ស្នើសុំរបស់អ្នក',
      icon: 'error'
    });
  }
};

// Modify onMounted to use department ID
onMounted(() => {
  logDebugInfo();

  // If user department ID is available, select it by default
  if (auth.user?.department?.id) {
    const userDepartmentId = auth.user.department.id;
    const matchingDept = formCommision.find(
      commission => commission.department?.id === Number(userDepartmentId)
    );

    if (matchingDept) {
      form.value.department = userDepartmentId;
      form.value.departmentTitle = matchingDept.department?.title || '';
      updateApprovers(userDepartmentId);
    }
  }
});
// Watch for department ID changes
watch(() => form.value.department, (newDepartmentId) => {
  if (newDepartmentId) {
    updateApprovers(newDepartmentId);
  }
});
definePageMeta({
  middleware: ['auth', 'expo']
});
</script>

<style scoped>
/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
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
