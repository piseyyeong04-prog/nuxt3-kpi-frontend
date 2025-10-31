<!-- pages/dashboard/booking-room/equipment-request.vue -->
<template>
  <div class="min-h-screen">
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <!-- Calendar View -->
      <div class="p-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/25">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Equipment Request Calendar
              </h2>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <!-- View Toggle Buttons -->
            <div class="inline-flex bg-slate-100 rounded-xl p-1 shadow-inner">
              <button @click="changeView('dayGridMonth')" :class="currentView === 'dayGridMonth'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'"
                class="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ease-out">
                <span class="flex items-center space-x-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Month</span>
                </span>
              </button>

              <button @click="changeView('dayGridWeek')" :class="currentView === 'dayGridWeek'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'"
                class="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ease-out">
                <span class="flex items-center space-x-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Week</span>
                </span>
              </button>
            </div>

            <!-- Refresh Button -->
            <button @click="loadRequests" class="group relative bg-white hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 
             border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 
             font-medium px-4 py-2 rounded-xl shadow-sm hover:shadow-md 
             transition-all duration-200 ease-out transform hover:scale-105">
              <span class="flex items-center space-x-2">
                <svg class="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </span>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-16">
          <div class="text-center">
            <div class="relative">
              <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto">
              </div>
              <div
                class="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-spin mx-auto"
                style="animation-delay: -0.15s; animation-duration: 1s;"></div>
            </div>
            <p class="text-slate-600 font-medium mt-4">Loading equipment requests...</p>
            <p class="text-slate-400 text-sm mt-1">Please wait while we fetch your calendar data</p>
          </div>
        </div>

        <div v-else class="calendar-container">
          <div class="py-2 flex items-center gap-x-2 mb-4">
            <button @click="showManualModal = true"
              class="sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 flex-shrink-0">
              <span class="flex items-center justify-center sm:justify-start space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>New Equipment Request</span>
              </span>
            </button>
          </div>
          <FullCalendar ref="fullCalendar" :options="calendarOptions" />
        </div>
      </div>
    </div>
    
    <!-- Event Details Modal -->
    <div v-if="selectedEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" data-aos="fade-down">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Equipment Request Details</h3>
          <button @click="selectedEvent = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="space-y-6">
          <!-- User Created Info -->
          <div v-if="selectedEvent.extendedProps.request.user_created" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900 leading-tight">
                  {{ selectedEvent.extendedProps.request.user_created.first_name }}
                  {{ selectedEvent.extendedProps.request.user_created.last_name }}
                </p>
                <p v-if="selectedEvent.extendedProps.request.user_created.title" class="text-sm text-blue-600 font-medium">
                  {{ selectedEvent.extendedProps.request.user_created.title }}
                </p>
                <p v-if="selectedEvent.extendedProps.request.user_created.department?.title" class="text-sm text-blue-600 font-medium">
                  {{ selectedEvent.extendedProps.request.user_created.department.title }}
                </p>
              </div>
            </div>
          </div>

          <!-- Date & Time Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Shooting Date -->
            <div class="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                    </path>
                  </svg>
                </div>
                <div>
                  <h4 class="text-xs font-medium text-orange-700 uppercase tracking-wide">Shooting Date</h4>
                  <p class="text-sm font-semibold text-gray-900 mt-0.5">
                    {{ formatDate(selectedEvent.extendedProps.request.shooting_date) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Return Date -->
            <div class="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                    </path>
                  </svg>
                </div>
                <div>
                  <h4 class="text-xs font-medium text-purple-700 uppercase tracking-wide">Return Date</h4>
                  <p class="text-sm font-semibold text-gray-900 mt-0.5">
                    {{ formatDate(selectedEvent.extendedProps.request.return_date) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Shooting Time -->
            <div class="bg-green-50 rounded-xl p-4 border border-green-100">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="text-xs font-medium text-green-700 uppercase tracking-wide">Shooting Time</h4>
                  <p class="text-sm font-semibold text-gray-900 mt-0.5">
                    {{ selectedEvent.extendedProps.request.shooting_time?.name || 'N/A' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Equipment Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Cameras -->
            <div v-if="selectedEvent.extendedProps.request.camera?.length" class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 class="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                </svg>
                Cameras
              </h4>
              <div class="space-y-1">
                <span v-for="camera in selectedEvent.extendedProps.request.camera" :key="camera.id" 
                      class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                  {{ camera.camera_id.name }}
                </span>
              </div>
            </div>

            <!-- Microphones -->
            <div v-if="selectedEvent.extendedProps.request.microphone?.length" class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 class="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
                Microphones
              </h4>
              <div class="space-y-1">
                <span v-for="mic in selectedEvent.extendedProps.request.microphone" :key="mic.id" 
                      class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                  {{ mic.microphone_id.name }}
                </span>
              </div>
            </div>

            <!-- Tripods -->
            <div v-if="selectedEvent.extendedProps.request.tripod?.length" class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 class="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                </svg>
                Tripods
              </h4>
              <div class="space-y-1">
                <span v-for="tripod in selectedEvent.extendedProps.request.tripod" :key="tripod.id" 
                      class="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                  {{ tripod.tripod_id.name }}
                </span>
              </div>
            </div>

            <!-- Gimbals -->
            <div v-if="selectedEvent.extendedProps.request.gimbal?.length" class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 class="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Gimbals
              </h4>
              <div class="space-y-1">
                <span v-for="gimbal in selectedEvent.extendedProps.request.gimbal" :key="gimbal.id" 
                      class="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                  {{ gimbal.gimbal_id.name }}
                </span>
              </div>
            </div>

            <!-- Camera Lens -->
            <div v-if="selectedEvent.extendedProps.request.camera_lens?.length" class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 class="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Camera Lens
              </h4>
              <div class="space-y-1">
                <span v-for="lens in selectedEvent.extendedProps.request.camera_lens" :key="lens.id" 
                      class="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                  {{ lens.camera_lens_id.name }}
                </span>
              </div>
            </div>

            <!-- Lights -->
            <div v-if="selectedEvent.extendedProps.request.light?.length" class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 class="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                Lights
              </h4>
              <div class="space-y-1">
                <span v-for="light in selectedEvent.extendedProps.request.light" :key="light.id" 
                      class="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                  {{ light.light_id.name }}
                </span>
              </div>
            </div>

            <!-- Drones -->
            <div v-if="selectedEvent.extendedProps.request.drone?.length" class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 class="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
                Drones
              </h4>
              <div class="space-y-1">
                <span v-for="drone in selectedEvent.extendedProps.request.drone" :key="drone.id" 
                      class="inline-block bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                  {{ drone.drone_id.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex space-x-3 mt-6">
          <button @click="editRequestFromEvent(selectedEvent.extendedProps.request)"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
            Edit Request
          </button>
          <button @click="confirmDeleteRequestFromEvent(selectedEvent.extendedProps.request)"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
            Delete Request
          </button>
        </div>
      </div>
    </div>

    <!-- Manual Request Modal -->
    <div v-if="showManualModal"
      class="fixed inset-0 z-50 bg-black backdrop-blur-md bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" data-aos="fade-down">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">New Equipment Request</h3>
          <button @click="showManualModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleManualRequest" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="modal-shooting-date" class="block text-sm font-medium text-gray-700 mb-1">
                Shooting Date <span class="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                id="modal-shooting-date" 
                v-model="manualRequest.shooting_date" 
                :min="today"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label for="modal-return-date" class="block text-sm font-medium text-gray-700 mb-1">
                Return Date <span class="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                id="modal-return-date" 
                v-model="manualRequest.return_date" 
                :min="minReturnDateManual"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
              <p v-if="manualRequest.shooting_date" class="text-xs text-gray-500 mt-1">
                Must be after {{ new Date(manualRequest.shooting_date).toLocaleDateString() }}
              </p>
            </div>
          </div>

          <div>
            <label for="modal-shooting-time" class="block text-sm font-medium text-gray-700 mb-1">Shooting Time</label>
            <select id="modal-shooting-time" v-model="manualRequest.shooting_time" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Select shooting time</option>
              <option value="1">Morning</option>
              <option value="2">Afternoon</option>
              <option value="3">Evening</option>
            </select>
          </div>

          <!-- Equipment Selection -->
          <div class="space-y-8">
            <div class="border-b border-gray-200 pb-4">
              <h4 class="text-lg font-semibold text-gray-900 flex items-center">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                Equipment Selection
              </h4>
              <p class="text-sm text-gray-600 mt-1 ml-11">Select the equipment you need for your project</p>
            </div>
            
            <!-- Equipment Categories -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Microphones -->
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                      </svg>
                    </div>
                    <h5 class="text-base font-semibold text-gray-900">Microphones</h5>
                  </div>
                  <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ manualRequest.microphone.length }} selected
                  </span>
                </div>
                
                <div class="space-y-3">
                  <div v-for="microphone in equipmentData.microphones" :key="microphone.id" 
                      class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                    <div class="flex items-center">
                      <input 
                        type="checkbox" 
                        :id="`manual-mic-${microphone.id}`"
                        :value="microphone.id" 
                        v-model="manualRequest.microphone" 
                        class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label :for="`manual-mic-${microphone.id}`" class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ microphone.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Cameras -->
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      </svg>
                    </div>
                    <h5 class="text-base font-semibold text-gray-900">Cameras</h5>
                  </div>
                  <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ manualRequest.camera.length }} selected
                  </span>
                </div>
                
                <div class="space-y-3">
                  <div v-for="camera in equipmentData.cameras" :key="camera.id" 
                      class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                    <div class="flex items-center">
                      <input 
                        type="checkbox" 
                        :id="`manual-cam-${camera.id}`"
                        :value="camera.id" 
                        v-model="manualRequest.camera" 
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label :for="`manual-cam-${camera.id}`" class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ camera.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tripods -->
              <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                      </svg>
                    </div>
                    <h5 class="text-base font-semibold text-gray-900">Tripods</h5>
                  </div>
                  <span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ manualRequest.tripod.length }} selected
                  </span>
                </div>
                
                <div class="space-y-3">
                  <div v-for="tripod in equipmentData.tripods" :key="tripod.id" 
                      class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-yellow-300 transition-colors">
                    <div class="flex items-center">
                      <input 
                        type="checkbox" 
                        :id="`manual-tripod-${tripod.id}`"
                        :value="tripod.id" 
                        v-model="manualRequest.tripod" 
                        class="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                      />
                      <label :for="`manual-tripod-${tripod.id}`" class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ tripod.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Gimbals -->
              <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                    </div>
                    <h5 class="text-base font-semibold text-gray-900">Gimbals</h5>
                  </div>
                  <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ manualRequest.gimbal.length }} selected
                  </span>
                </div>
                
                <div class="space-y-3">
                  <div v-for="gimbal in equipmentData.gimbals" :key="gimbal.id" 
                      class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                    <div class="flex items-center">
                      <input 
                        type="checkbox" 
                        :id="`manual-gimbal-${gimbal.id}`"
                        :value="gimbal.id" 
                        v-model="manualRequest.gimbal" 
                        class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label :for="`manual-gimbal-${gimbal.id}`" class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ gimbal.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Camera Lens -->
              <div class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </div>
                    <h5 class="text-base font-semibold text-gray-900">Camera Lens</h5>
                  </div>
                  <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ manualRequest.camera_lens.length }} selected
                  </span>
                </div>
                
                <div class="space-y-3">
                  <div v-for="lens in equipmentData.cameraLens" :key="lens.id" 
                      class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                    <div class="flex items-center">
                      <input 
                        type="checkbox" 
                        :id="`manual-lens-${lens.id}`"
                        :value="lens.id" 
                        v-model="manualRequest.camera_lens" 
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label :for="`manual-lens-${lens.id}`" class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ lens.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lights -->
              <div class="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                    <h5 class="text-base font-semibold text-gray-900">Lights</h5>
                  </div>
                  <span class="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ manualRequest.light.length }} selected
                  </span>
                </div>
                
                <div class="space-y-3">
                  <div v-for="light in equipmentData.lights" :key="light.id" 
                      class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
                    <div class="flex items-center">
                      <input 
                        type="checkbox" 
                        :id="`manual-light-${light.id}`"
                        :value="light.id" 
                        v-model="manualRequest.light" 
                        class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label :for="`manual-light-${light.id}`" class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ light.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Drones -->
              <div class="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6 border border-cyan-100 lg:col-span-2">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    </div>
                    <h5 class="text-base font-semibold text-gray-900">Drones</h5>
                  </div>
                  <span class="bg-cyan-100 text-cyan-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ manualRequest.drone.length }} selected
                  </span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div v-for="drone in equipmentData.drones" :key="drone.id" 
                      class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-cyan-300 transition-colors">
                    <div class="flex items-center">
                      <input 
                        type="checkbox" 
                        :id="`manual-drone-${drone.id}`"
                        :value="drone.id" 
                        v-model="manualRequest.drone" 
                        class="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                      />
                      <label :for="`manual-drone-${drone.id}`" class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ drone.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showManualModal = false" type="button"
              class="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800">
              Cancel
            </button>
            <button type="submit" :disabled="isProcessing"
              class="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400">
              📋 Create Request
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Request Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Edit Equipment Request</h3>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="updateRequestData" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="edit-shooting-date" class="block text-sm font-medium text-gray-700 mb-1">
                Shooting Date <span class="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                id="edit-shooting-date" 
                v-model="editRequest.shooting_date" 
                :min="today"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label for="edit-return-date" class="block text-sm font-medium text-gray-700 mb-1">
                Return Date <span class="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                id="edit-return-date" 
                v-model="editRequest.return_date" 
                :min="minReturnDateEdit"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
              <p v-if="editRequest.shooting_date" class="text-xs text-gray-500 mt-1">
                Must be after {{ new Date(editRequest.shooting_date).toLocaleDateString() }}
              </p>
            </div>
          </div>

          <div>
            <label for="edit-shooting-time" class="block text-sm font-medium text-gray-700 mb-1">Shooting Time</label>
            <select id="edit-shooting-time" v-model="editRequest.shooting_time" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Select shooting time</option>
              <option value="1">Morning</option>
              <option value="2">Afternoon</option>
              <option value="3">Evening</option>
            </select>
          </div>

          <!-- Equipment Selection for Edit -->
          <div class="space-y-8">
            <div class="border-b border-gray-200 pb-4">
              <h4 class="text-lg font-semibold text-gray-900 flex items-center">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                Equipment Selection
              </h4>
              <p class="text-sm text-gray-600 mt-1 ml-11">Select the equipment you need for your project</p>
            </div>
            
            <!-- Equipment Categories -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Microphones -->
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                      </svg>
                    </div>
                    <h5 class="text-base font-semibold text-gray-900">Microphones</h5>
                  </div>
                  <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ editRequest.microphone.length }} selected
                  </span>
                </div>
                
                <div class="space-y-3">
                  <div v-for="microphone in equipmentData.microphones" :key="microphone.id" 
                      class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                    <div class="flex items-center">
                      <input 
                        type="checkbox" 
                        :id="`edit-mic-${microphone.id}`"
                        :value="microphone.id" 
                        v-model="editRequest.microphone" 
                        class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label :for="`edit-mic-${microphone.id}`" class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ microphone.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Cameras -->
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      </svg>
                    </div>
                    <h5 class="text-base font-semibold text-gray-900">Cameras</h5>
                  </div>
                  <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ editRequest.camera.length }} selected
                  </span>
                </div>
                
                <div class="space-y-3">
                  <div v-for="camera in equipmentData.cameras" :key="camera.id" 
                      class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                    <div class="flex items-center">
                      <input 
                        type="checkbox" 
                        :id="`edit-cam-${camera.id}`"
                        :value="camera.id" 
                        v-model="editRequest.camera" 
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label :for="`edit-cam-${camera.id}`" class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ camera.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tripods -->
              <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                      </svg>
                    </div>
                    <h5 class="text-base font-semibold text-gray-900">Tripods</h5>
                  </div>
                  <span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ editRequest.tripod.length }} selected
                  </span>
                </div>
                
                <div class="space-y-3">
                  <div v-for="tripod in equipmentData.tripods" :key="tripod.id" 
                      class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-yellow-300 transition-colors">
                    <div class="flex items-center">
                      <input 
                        type="checkbox" 
                        :id="`edit-tripod-${tripod.id}`"
                        :value="tripod.id" 
                        v-model="editRequest.tripod" 
                        class="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                      />
                      <label :for="`edit-tripod-${tripod.id}`" class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ tripod.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Gimbals -->
              <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                    </div>
                    <h5 class="text-base font-semibold text-gray-900">Gimbals</h5>
                  </div>
                  <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ editRequest.gimbal.length }} selected
                  </span>
                </div>
                
                <div class="space-y-3">
                  <div v-for="gimbal in equipmentData.gimbals" :key="gimbal.id" 
                      class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                    <div class="flex items-center">
                      <input 
                        type="checkbox" 
                        :id="`edit-gimbal-${gimbal.id}`"
                        :value="gimbal.id" 
                        v-model="editRequest.gimbal" 
                        class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label :for="`edit-gimbal-${gimbal.id}`" class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ gimbal.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Camera Lens -->
              <div class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </div>
                    <h5 class="text-base font-semibold text-gray-900">Camera Lens</h5>
                  </div>
                  <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ editRequest.camera_lens.length }} selected
                  </span>
                </div>
                
                <div class="space-y-3">
                  <div v-for="lens in equipmentData.cameraLens" :key="lens.id" 
                      class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                    <div class="flex items-center">
                      <input 
                        type="checkbox" 
                        :id="`edit-lens-${lens.id}`"
                        :value="lens.id" 
                        v-model="editRequest.camera_lens" 
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label :for="`edit-lens-${lens.id}`" class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ lens.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lights -->
              <div class="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                    <h5 class="text-base font-semibold text-gray-900">Lights</h5>
                  </div>
                  <span class="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ editRequest.light.length }} selected
                  </span>
                </div>
                
                <div class="space-y-3">
                  <div v-for="light in equipmentData.lights" :key="light.id" 
                      class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
                    <div class="flex items-center">
                      <input 
                        type="checkbox" 
                        :id="`edit-light-${light.id}`"
                        :value="light.id" 
                        v-model="editRequest.light" 
                        class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label :for="`edit-light-${light.id}`" class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ light.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Drones -->
              <div class="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6 border border-cyan-100 lg:col-span-2">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    </div>
                    <h5 class="text-base font-semibold text-gray-900">Drones</h5>
                  </div>
                  <span class="bg-cyan-100 text-cyan-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ editRequest.drone.length }} selected
                  </span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div v-for="drone in equipmentData.drones" :key="drone.id" 
                      class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-cyan-300 transition-colors">
                    <div class="flex items-center">
                      <input 
                        type="checkbox" 
                        :id="`edit-drone-${drone.id}`"
                        :value="drone.id" 
                        v-model="editRequest.drone" 
                        class="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                      />
                      <label :for="`edit-drone-${drone.id}`" class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ drone.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showEditModal = false"
              class="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white">Update Request</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions, EventClickArg, DateSelectArg } from '@fullcalendar/core'
import type { EquipmentRequest } from '~/types/equipment'
import Swal from 'sweetalert2'
import { useAuthStore } from '~/store/useAuthStore'

const { createEquipmentRequest, getEquipmentRequests, updateEquipmentRequest, deleteEquipmentRequest } = useEquipmentRequest()
const { getMicrophones, getCameras, getTripods, getGimbals, getCameraLens, getLights, getDrones } = useEquipment()

const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
  Swal.fire({
    icon: type,
    title: type === 'success' ? 'Success' : 'Error',
    text: msg,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    position: 'top-end',
    toast: true
  })
}

const today = computed(() =>{
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString().split('T')[0];
})

const minReturnDateManual = computed(() =>{
  if (!manualRequest.value.shooting_date) return today.value;
  const shootingDate = new Date(manualRequest.value.shooting_date);
  shootingDate.setDate(shootingDate.getDate() + 1);
  return shootingDate.toISOString().split('T')[0];
})

const minReturnDateEdit = computed(() => {
  if (!editRequest.value.shooting_date) return today.value
  const shootingDate = new Date(editRequest.value.shooting_date)
  shootingDate.setDate(shootingDate.getDate() + 1)
  return shootingDate.toISOString().split('T')[0]
})

// Reactive state
const requests = ref<EquipmentRequest[]>([])
const loading = ref(false)
const isProcessing = ref(false)

const selectedEvent = ref<any>(null)
const currentView = ref('dayGridMonth')
const fullCalendar = ref()
const showManualModal = ref(false)
const showEditModal = ref(false)

const manualRequest = ref({
  shooting_date: '',
  return_date: '',
  shooting_time: '',
  microphone: [] as string[],
  camera: [] as string[],
  tripod: [] as string[],
  gimbal: [] as string[],
  camera_lens: [] as string[],
  light: [] as string[],
  drone: [] as string[]
})

const editRequest = ref({
  id: '',
  shooting_date: '',
  return_date: '',
  shooting_time: '',
  microphone: [] as string[],
  camera: [] as string[],
  tripod: [] as string[],
  gimbal: [] as string[],
  camera_lens: [] as string[],
  light: [] as string[],
  drone: [] as string[]
})

const handleEventClick = (clickInfo: EventClickArg) => {
  selectedEvent.value = clickInfo.event
}

const handleDateSelect = (selectInfo: DateSelectArg) => {
  // Auto-fill manual request form with selected date
  manualRequest.value.shooting_date = selectInfo.startStr
  showManualModal.value = true
  loadEquipmentData()
  loadRequests()
}

const handleDateClick = (arg: { dateStr: string }) => {
  manualRequest.value.shooting_date = arg.dateStr
  showManualModal.value = true
  loadEquipmentData()
  loadRequests()
}

const loadEquipmentData = async () => {
  try {
    const [microphones, cameras, tripods, gimbals, cameraLens, lights, drones] = await Promise.all([
      getMicrophones(),
      getCameras(),
      getTripods(),
      getGimbals(),
      getCameraLens(),
      getLights(),
      getDrones()
    ])

    equipmentData.value = {
      microphones,
      cameras,
      tripods,
      gimbals,
      cameraLens,
      lights,
      drones
    }
  } catch (error) {
    console.error('Error loading equipment data:', error)
    showMessage('Failed to load equipment data.', 'error')
  }
}

const equipmentData = ref({
  microphones: [] as Array<{ id: number; name: string }>,
  cameras: [] as Array<{ id: number; name: string }>,
  tripods: [] as Array<{ id: number; name: string }>,
  gimbals: [] as Array<{ id: number; name: string }>,
  cameraLens: [] as Array<{ id: number; name: string }>,
  lights: [] as Array<{ id: number; name: string }>,
  drones: [] as Array<{ id: number; name: string }>
})

const calendarEvents = computed(() => {
  return requests.value.map(request => {
    // Create title with equipment summary
    const equipmentTypes = []
    if (request.camera?.length) equipmentTypes.push(`📷 ${request.camera.length}`)
    if (request.microphone?.length) equipmentTypes.push(`🎤 ${request.microphone.length}`)
    if (request.tripod?.length) equipmentTypes.push(`📹 ${request.tripod.length}`)
    if (request.gimbal?.length) equipmentTypes.push(`🎬 ${request.gimbal.length}`)
    if (request.camera_lens?.length) equipmentTypes.push(`🔍 ${request.camera_lens.length}`)
    if (request.light?.length) equipmentTypes.push(`💡 ${request.light.length}`)
    if (request.drone?.length) equipmentTypes.push(`🚁 ${request.drone.length}`)
    
    const title = `${request.user_created.first_name} ${request.user_created.last_name} - ${equipmentTypes.join(' ')}`
    
    return {
      id: request.id?.toString(),
      title: title,
      start: request.shooting_date,
      end: request.return_date,
      backgroundColor: '#059669',
      borderColor: '#047857',
      extendedProps: {
        request: request
      }
    }
  })
})

const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today title',
    center: '',
    right: ''
  },
  selectable: true,
  unselectAuto: false,
  dateClick: handleDateClick,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  events: calendarEvents.value,
  eventClick: handleEventClick,
  select: handleDateSelect,
  eventDidMount(info) {
    info.el.style.backgroundColor = '#059669'
    info.el.style.borderColor = '#047857'
  }
}))

const changeView = (viewName: string) => {
  currentView.value = viewName
  if (fullCalendar.value) {
    const calendarApi = fullCalendar.value.getApi()
    calendarApi.changeView(viewName)
  }
}

const handleManualRequest = async () => {
  // Validate dates BEFORE setting isProcessing
  const shootingDate = new Date(manualRequest.value.shooting_date)
  const returnDate = new Date(manualRequest.value.return_date)
  const nowDate = new Date()
  nowDate.setHours(0, 0, 0, 0)
  shootingDate.setHours(0, 0, 0, 0)
  returnDate.setHours(0, 0, 0, 0)

  // Check if shooting date is in the past
  if (shootingDate < nowDate) {
    showMessage('❌ Shooting date cannot be in the past.', 'error')
    return
  }

  // Check if return date is after shooting date
  if (returnDate <= shootingDate) {
    showMessage('❌ Return date must be after the shooting date.', 'error')
    return
  }

  isProcessing.value = true
  try {
    const requestData = {
      shooting_date: manualRequest.value.shooting_date,
      return_date: manualRequest.value.return_date,
      shooting_time: parseInt(manualRequest.value.shooting_time),
      microphone: manualRequest.value.microphone.map(id => ({ microphone_id: parseInt(id) })),
      camera: manualRequest.value.camera.map(id => ({ camera_id: parseInt(id) })),
      tripod: manualRequest.value.tripod.map(id => ({ tripod_id: parseInt(id) })),
      gimbal: manualRequest.value.gimbal.map(id => ({ gimbal_id: parseInt(id) })),
      camera_lens: manualRequest.value.camera_lens.map(id => ({ camera_lens_id: parseInt(id) })),
      light: manualRequest.value.light.map(id => ({ light_id: parseInt(id) })),
      drone: manualRequest.value.drone.map(id => ({ drone_id: parseInt(id) })),
      status: 'published'
    }

    await createEquipmentRequest(requestData as any)
    showMessage('✅ Equipment request created successfully!', 'success')
    
    // Reset form
    manualRequest.value = {
      shooting_date: '',
      return_date: '',
      shooting_time: '',
      microphone: [],
      camera: [],
      tripod: [],
      gimbal: [],
      camera_lens: [],
      light: [],
      drone: []
    }
    
    showManualModal.value = false
    await loadRequests()
    
    const auth = useAuthStore()
    const currentUser = auth.user
    
    await sendTelegramMessage(
      `📋 <b>New Equipment Request</b>\n\n` +
      `<b>Requested by:</b> ${currentUser?.first_name ?? 'N/A'} ${currentUser?.last_name ?? ''}\n` +
      `<b>Department:</b> ${currentUser?.department?.title ?? 'N/A'}\n` +
      `<b>Shooting Date:</b> ${requestData.shooting_date}\n` +
      `<b>Return Date:</b> ${requestData.return_date}\n` +
      `<b>Equipment:</b> ${getEquipmentSummary(requestData)}\n` +
      `<b>Status:</b> ${requestData.status}`
    )

  } catch (error) {
    console.error('Manual request error:', error)
    showMessage('❌ Failed to create equipment request.', 'error')
  } finally {
    isProcessing.value = false
  }
}

const editRequestFromEvent = (request: EquipmentRequest) => {
  editRequest.value = {
    id: request.id!.toString(),
    shooting_date: request.shooting_date,
    return_date: request.return_date,
    shooting_time: request.shooting_time.id.toString(),
    // map to related IDs (fallback to item.id to satisfy TS and mixed shapes)
    microphone: request.microphone?.map((m: any) => (m?.microphone_id?.id ?? m?.id)?.toString()) || [],
    camera: request.camera?.map((c: any) => (c?.camera_id?.id ?? c?.id)?.toString()) || [],
    tripod: request.tripod?.map((t: any) => (t?.tripod_id?.id ?? t?.id)?.toString()) || [],
    gimbal: request.gimbal?.map((g: any) => (g?.gimbal_id?.id ?? g?.id)?.toString()) || [],
    camera_lens: request.camera_lens?.map((cl: any) => (cl?.camera_lens_id?.id ?? cl?.id)?.toString()) || [],
    light: request.light?.map((l: any) => (l?.light_id?.id ?? l?.id)?.toString()) || [],
    drone: request.drone?.map((d: any) => (d?.drone_id?.id ?? d?.id)?.toString()) || []
  }
  selectedEvent.value = null
  loadEquipmentData()
  showEditModal.value = true
}

const updateRequestData = async () => {
  // Validate dates BEFORE setting isProcessing
  const shootingDate = new Date(editRequest.value.shooting_date)
  const returnDate = new Date(editRequest.value.return_date)
  const nowDate = new Date()
  nowDate.setHours(0, 0, 0, 0)
  shootingDate.setHours(0, 0, 0, 0)
  returnDate.setHours(0, 0, 0, 0)

  // Check if shooting date is in the past
  if (shootingDate < nowDate) {
    showMessage('❌ Shooting date cannot be in the past.', 'error')
    return
  }

  // Check if return date is after shooting date
  if (returnDate <= shootingDate) {
    showMessage('❌ Return date must be after the shooting date.', 'error')
    return
  }

  isProcessing.value = true
  try {
    const updatedData = {
      shooting_date: editRequest.value.shooting_date,
      return_date: editRequest.value.return_date,
      shooting_time: parseInt(editRequest.value.shooting_time),
      // send junction objects like create()
      microphone: editRequest.value.microphone.map(id => ({ microphone_id: parseInt(id) })),
      camera: editRequest.value.camera.map(id => ({ camera_id: parseInt(id) })),
      tripod: editRequest.value.tripod.map(id => ({ tripod_id: parseInt(id) })),
      gimbal: editRequest.value.gimbal.map(id => ({ gimbal_id: parseInt(id) })),
      camera_lens: editRequest.value.camera_lens.map(id => ({ camera_lens_id: parseInt(id) })),
      light: editRequest.value.light.map(id => ({ light_id: parseInt(id) })),
      drone: editRequest.value.drone.map(id => ({ drone_id: parseInt(id) }))
    }

    // Cast to any to avoid TypeScript type checking issues
    await updateEquipmentRequest(editRequest.value.id, updatedData as any)
    showMessage('✅ Equipment request updated successfully!', 'success')
    showEditModal.value = false
    await loadRequests()
  } catch (error) {
    console.error('Update request error:', error)
    showMessage('❌ Failed to update equipment request.', 'error')
  } finally {
    isProcessing.value = false
  }
}

const getEquipmentSummary = (data: any) => {
  const summary: string[] = []
  if (data.camera?.length) summary.push(`📷 Cameras: ${data.camera.length}`)
  if (data.microphone?.length) summary.push(`🎤 Microphones: ${data.microphone.length}`)
  if (data.tripod?.length) summary.push(`📹 Tripods: ${data.tripod.length}`)
  if (data.gimbal?.length) summary.push(`🎬 Gimbals: ${data.gimbal.length}`)
  if (data.camera_lens?.length) summary.push(`🔍 Lenses: ${data.camera_lens.length}`)
  if (data.light?.length) summary.push(`💡 Lights: ${data.light.length}`)
  if (data.drone?.length) summary.push(`🚁 Drones: ${data.drone.length}`)
  return summary.join(', ') || 'None'
}

const loadRequests = async () => {
  loading.value = true
  try {
    requests.value = await getEquipmentRequests()
  } catch (error) {
    console.error('Error loading equipment requests:', error)
    showMessage('Failed to load equipment requests.', 'error')
  } finally {
    loading.value = false
  }
}

const confirmDeleteRequestFromEvent = async (request: EquipmentRequest) => {
  if (!request.id) return

  if (confirm(`Are you sure you want to delete this equipment request?`)) {
    try {
      await deleteEquipmentRequest(request.id.toString())
      showMessage('Equipment request deleted successfully!', 'success')
      selectedEvent.value = null
      await loadRequests()
    } catch (error) {
      console.error('Delete request error:', error)
      showMessage('Failed to delete equipment request.', 'error')
    }
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const sendTelegramMessage = async (text: string) => {
  try {
    await $fetch(`https://api.telegram.org/bot8387097831:AAGUvNCJPqfWP0-P6FQZmaImny_oJTNaV7g/sendMessage`, {
      method: 'POST',
      body: {
        chat_id: '-1002740135200',
        text: text,
        parse_mode: 'HTML'
      }
    })
  } catch (error) {
    console.error('Failed to send Telegram message:', error)
  }
}

// Initialize
onMounted(() => {
  loadRequests()
  if (window.innerWidth <= 640) {
    changeView('dayGridWeek')
  }
})

definePageMeta({
  middleware: 'auth',
})
</script>

<style scoped>
.calendar-container {
  min-height: 600px;
}

:deep(.fc-event) {
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.875rem;
}

:deep(.fc-daygrid-event) {
  margin: 1px 0;
  padding: 2px 4px;
}

:deep(.fc-event-title) {
  font-weight: 500;
}

:deep(.fc-toolbar-title) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

:deep(.fc-button-primary) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

:deep(.fc-button-primary:hover) {
  background-color: #2563eb;
  border-color: #2563eb;
}

:deep(.fc-today-button) {
  background-color: #059669;
  border-color: #059669;
}

:deep(.fc-today-button:hover) {
  background-color: #047857;
  border-color: #047857;
}

:deep(.fc-daygrid-day-events) {
  max-height: 60px;
  overflow-y: auto;
  scrollbar-width: none;
}

@media (max-width: 640px) {
  .calendar-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  :deep(.fc) {
    min-width: 600px;
  }
}
</style>