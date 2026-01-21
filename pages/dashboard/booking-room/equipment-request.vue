<!-- pages/dashboard/booking-room/equipment-request.vue -->
<template>
  <div class="min-h-screen">
    <div class="bg-white shadow-lg rounded-lg overflow-y-hidden">
      <!-- Calendar View -->
      <div class="p-3">
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
            <!-- View Toggle Buttons removed (Qalendar has native controls) -->
            <div class="hidden"></div>

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
          <ClientOnly>
            <FullCalendar :options="calendarOptions" />
          </ClientOnly>
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
          <div v-if="selectedEvent?.extendedProps?.request?.user_created"
            class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900 leading-tight">
                  {{ selectedEvent.extendedProps.request.user_created.first_name || '' }}
                  {{ selectedEvent.extendedProps.request.user_created.last_name || '' }}
                </p>
                <p v-if="selectedEvent.extendedProps.request.user_created.title"
                  class="text-sm text-blue-600 font-medium">
                  {{ selectedEvent.extendedProps.request.user_created.title }}
                </p>
                <p v-if="selectedEvent.extendedProps.request.user_created.department?.title"
                  class="text-sm text-blue-600 font-medium">
                  {{ selectedEvent.extendedProps.request.user_created.department.title }}
                </p>
              </div>
            </div>
          </div>
          <div v-if="selectedEvent?.extendedProps?.request?.program_name"
            class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z">
                  </path>
                </svg>
              </div>
              <div>
                <p class="text-xs font-medium text-purple-700 uppercase tracking-wide">Program Name</p>
                <p class="font-semibold text-gray-900 leading-tight mt-0.5">
                  {{ selectedEvent.extendedProps.request.program_name }}
                </p>
              </div>
            </div>
          </div>

          <!-- Content Creator & Camera Man -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="selectedEvent?.extendedProps?.request?.content_creator"
              class="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                    </path>
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-medium text-teal-700 uppercase tracking-wide">Content Creator</p>
                  <p class="font-semibold text-gray-900 leading-tight mt-0.5">
                    {{ selectedEvent.extendedProps.request.content_creator.first_name }}
                    {{ selectedEvent.extendedProps.request.content_creator.last_name }}
                  </p>
                </div>
              </div>
            </div>

            <div v-if="selectedEvent?.extendedProps?.request?.camera_man"
              class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z">
                    </path>
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-medium text-amber-700 uppercase tracking-wide">Camera Man</p>
                  <p class="font-semibold text-gray-900 leading-tight mt-0.5">
                    {{ selectedEvent.extendedProps.request.camera_man.first_name }}
                    {{ selectedEvent.extendedProps.request.camera_man.last_name }}
                  </p>
                </div>
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
                    {{ selectedEvent?.extendedProps?.request?.shooting_time?.name || 'N/A' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Equipment Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Cameras -->
            <div v-if="selectedEvent?.extendedProps?.request?.camera?.length"
              class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 class="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z">
                  </path>
                </svg>
                Cameras
              </h4>
              <div class="space-y-1">
                <span v-for="camera in selectedEvent.extendedProps.request.camera" :key="camera.id"
                  class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                  {{ camera?.camera_id?.name || 'Unknown Camera' }}
                </span>
              </div>
            </div>

            <!-- Microphones -->
            <div v-if="selectedEvent?.extendedProps?.request?.microphone?.length"
              class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 class="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z">
                  </path>
                </svg>
                Microphones
              </h4>
              <div class="space-y-1">
                <span v-for="mic in selectedEvent.extendedProps.request.microphone" :key="mic.id"
                  class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                  {{ mic?.microphone_id?.name || 'Unknown Microphone' }}
                </span>
              </div>
            </div>

            <!-- Tripods -->
            <div v-if="selectedEvent?.extendedProps?.request?.tripod?.length"
              class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 class="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z">
                  </path>
                </svg>
                Tripods
              </h4>
              <div class="space-y-1">
                <span v-for="tripod in selectedEvent.extendedProps.request.tripod" :key="tripod.id"
                  class="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                  {{ tripod?.tripod_id?.name || 'Unknown Tripod' }}
                </span>
              </div>
            </div>

            <!-- Gimbals -->
            <div v-if="selectedEvent?.extendedProps?.request?.gimbal?.length"
              class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 class="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                  </path>
                </svg>
                Gimbals
              </h4>
              <div class="space-y-1">
                <span v-for="gimbal in selectedEvent.extendedProps.request.gimbal" :key="gimbal.id"
                  class="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                  {{ gimbal?.gimbal_id?.name || 'Unknown Gimbal' }}
                </span>
              </div>
            </div>

            <!-- Camera Lens -->
            <div v-if="selectedEvent?.extendedProps?.request?.camera_lens?.length"
              class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 class="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                  </path>
                </svg>
                Camera Lens
              </h4>
              <div class="space-y-1">
                <span v-for="lens in selectedEvent.extendedProps.request.camera_lens" :key="lens.id"
                  class="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                  {{ lens?.camera_lens_id?.name || 'Unknown Lens' }}
                </span>
              </div>
            </div>

            <!-- Lights -->
            <div v-if="selectedEvent?.extendedProps?.request?.light?.length"
              class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 class="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z">
                  </path>
                </svg>
                Lights
              </h4>
              <div class="space-y-1">
                <span v-for="light in selectedEvent.extendedProps.request.light" :key="light.id"
                  class="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                  {{ light?.light_id?.name || 'Unknown Light' }}
                </span>
              </div>
            </div>

            <!-- Drones -->
            <div v-if="selectedEvent?.extendedProps?.request?.drone?.length"
              class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 class="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
                Drones
              </h4>
              <div class="space-y-1">
                <span v-for="drone in selectedEvent.extendedProps.request.drone" :key="drone.id"
                  class="inline-block bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                  {{ drone?.drone_id?.name || 'Unknown Drone' }}
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

    <!-- More Events Modal -->
    <div v-if="showMoreEventsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showMoreEventsModal = false">
      <div class="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl"
        data-aos="fade-down">
        <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
          <div>
            <h3 class="text-xl font-bold text-gray-900">Events on {{ formatDate(moreEventsData.date) }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ moreEventsData.events.length }} equipment requests</p>
          </div>
          <button @click="showMoreEventsModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="space-y-3">
          <div v-for="event in moreEventsData.events" :key="event.id"
            class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 hover:shadow-md transition-all cursor-pointer"
            @click="selectedEvent = { extendedProps: { request: event.requestData } }; showMoreEventsModal = false">
            <div class="flex items-start gap-3">
              <span class="text-2xl">{{ event.icon }}</span>
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-gray-900 text-lg">{{ event.programName }}</h4>
                <div class="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ event.dateRange }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ event.shootingTime }}
                  </span>
                </div>
                <div v-if="event.requestData?.user_created" class="mt-2 text-sm text-gray-500">
                  By: {{ event.requestData.user_created.first_name }} {{ event.requestData.user_created.last_name }}
                </div>
              </div>
              <button @click.stop="selectedEvent = { extendedProps: { request: event.requestData } }; showMoreEventsModal = false"
                class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors">
                View Details
              </button>
            </div>
          </div>
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
              <input type="date" id="modal-shooting-date" v-model="manualRequest.shooting_date" :min="today" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="modal-return-date" class="block text-sm font-medium text-gray-700 mb-1">
                Return Date <span class="text-red-500">*</span>
              </label>
              <input type="date" id="modal-return-date" v-model="manualRequest.return_date"
                :min="manualRequest.shooting_date || today" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <p v-if="manualRequest.shooting_date" class="text-xs text-gray-500 mt-1">
                Can be same day or after {{ new Date(manualRequest.shooting_date).toLocaleDateString() }}
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
              <option value="4">Full Day</option>
            </select>
          </div>
          <div>
            <label for="modal-program-name" class="block text-sm font-medium text-gray-700 mb-1">
              Program Name <span class="text-red-500">*</span>
            </label>
            <input type="text" id="modal-program-name" v-model="manualRequest.program_name" required
              placeholder="Enter program name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Content Creator
              </label>
              <SearchableSelect v-model="manualRequest.content_creator" :users="users"
                placeholder="Select content creator (optional)" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Camera Man
              </label>
              <SearchableSelect v-model="manualRequest.camera_man" :users="users"
                placeholder="Select camera man (optional)" />
            </div>
          </div>

          <!-- Equipment Selection -->
          <div class="space-y-8">
            <div class="border-b border-gray-200 pb-4">
              <h4 class="text-lg font-semibold text-gray-900 flex items-center">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z">
                        </path>
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
                      <input type="checkbox" :id="`manual-mic-${microphone.id}`" :value="microphone.id"
                        v-model="manualRequest.microphone"
                        :disabled="!isEquipmentAvailable(microphone.id, 'microphone').available"
                        class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                      <label :for="`manual-mic-${microphone.id}`"
                        class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ microphone.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span v-if="isEquipmentAvailable(microphone.id, 'microphone').available"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                      <div v-else class="flex flex-col items-end">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1">
                          Unavailable
                        </span>
                        <span class="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100 mt-1">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ isEquipmentAvailable(microphone.id, 'microphone').shootingTime}}
                        </span>
                      </div>
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z">
                        </path>
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
                      <input type="checkbox" :id="`manual-cam-${camera.id}`" :value="camera.id"
                        v-model="manualRequest.camera"
                        :disabled="!isEquipmentAvailable(camera.id, 'camera').available"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <label :for="`manual-cam-${camera.id}`"
                        class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ camera.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span v-if="isEquipmentAvailable(camera.id, 'camera').available"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                      <div v-else class="flex flex-col items-end">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1">
                          Unavailable
                        </span>
                        <span class="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100 mt-1">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ isEquipmentAvailable(camera.id, 'camera').shootingTime}}
                        </span>
                      </div>
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z">
                        </path>
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
                      <input type="checkbox" :id="`manual-tripod-${tripod.id}`" :value="tripod.id"
                        v-model="manualRequest.tripod"
                        :disabled="!isEquipmentAvailable(tripod.id, 'tripod').available"
                        class="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded" />
                      <label :for="`manual-tripod-${tripod.id}`"
                        class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ tripod.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span v-if="isEquipmentAvailable(tripod.id, 'tripod').available"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                      <div v-else class="flex flex-col items-end">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1">
                          Unavailable
                        </span>
                        <span class="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100 mt-1">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ isEquipmentAvailable(tripod.id, 'tripod').shootingTime}}
                        </span>
                      </div>
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                        </path>
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
                      <input type="checkbox" :id="`manual-gimbal-${gimbal.id}`" :value="gimbal.id"
                        v-model="manualRequest.gimbal"
                        :disabled="!isEquipmentAvailable(gimbal.id, 'gimbal').available"
                        class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                      <label :for="`manual-gimbal-${gimbal.id}`"
                        class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ gimbal.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span v-if="isEquipmentAvailable(gimbal.id, 'gimbal').available"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                      <div v-else class="flex flex-col items-end">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1">
                          Unavailable
                        </span>
                        <span class="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100 mt-1">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ isEquipmentAvailable(gimbal.id, 'gimbal').shootingTime}}
                        </span>
                      </div>
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                        </path>
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
                      <input type="checkbox" :id="`manual-lens-${lens.id}`" :value="lens.id"
                        v-model="manualRequest.camera_lens"
                        :disabled="!isEquipmentAvailable(lens.id, 'camera_lens').available"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                      <label :for="`manual-lens-${lens.id}`"
                        class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ lens.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span v-if="isEquipmentAvailable(lens.id, 'camera_lens').available"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                      <div v-else class="flex flex-col items-end">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1">
                          Unavailable
                        </span>
                        <span class="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100 mt-1">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ isEquipmentAvailable(lens.id, 'camera_lens').shootingTime}}
                        </span>
                      </div>
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z">
                        </path>
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
                      <input type="checkbox" :id="`manual-light-${light.id}`" :value="light.id"
                        v-model="manualRequest.light"
                        :disabled="!isEquipmentAvailable(light.id, 'light').available"
                        class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                      <label :for="`manual-light-${light.id}`"
                        class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ light.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span v-if="isEquipmentAvailable(light.id, 'light').available"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                      <div v-else class="flex flex-col items-end">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1">
                          Unavailable
                        </span>
                        <span class="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100 mt-1">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ isEquipmentAvailable(light.id, 'light').shootingTime}}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Drones -->
              <div
                class="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6 border border-cyan-100 lg:col-span-2">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
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
                      <input type="checkbox" :id="`manual-drone-${drone.id}`" :value="drone.id"
                        v-model="manualRequest.drone"
                        :disabled="!isEquipmentAvailable(drone.id, 'drone').available"
                        class="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded" />
                      <label :for="`manual-drone-${drone.id}`"
                        class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ drone.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span v-if="isEquipmentAvailable(drone.id, 'drone').available"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                      <div v-else class="flex flex-col items-end">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1">
                          Unavailable
                        </span>
                        <span class="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100 mt-1">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ isEquipmentAvailable(drone.id, 'drone').shootingTime}}
                        </span>
                      </div>
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
              <input type="date" id="edit-shooting-date" v-model="editRequest.shooting_date" :min="today" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="edit-return-date" class="block text-sm font-medium text-gray-700 mb-1">
                Return Date <span class="text-red-500">*</span>
              </label>
              <input type="date" id="edit-return-date" v-model="editRequest.return_date"
                :min="editRequest.shooting_date || today" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <p v-if="editRequest.shooting_date" class="text-xs text-gray-500 mt-1">
                Can be same day or after {{ new Date(editRequest.shooting_date).toLocaleDateString() }}
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
              <option value="4">Full Day</option>
            </select>
          </div>
          <div>
            <label for="edit-program-name" class="block text-sm font-medium text-gray-700 mb-1">
              Program Name <span class="text-red-500">*</span>
            </label>
            <input type="text" id="edit-program-name" v-model="editRequest.program_name" required
              placeholder="Enter program name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Content Creator
              </label>
              <SearchableSelect :key="'cc-' + users.length + '-' + editRequest.content_creator"
                v-model="editRequest.content_creator" :users="users" placeholder="Select content creator (optional)" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Camera Man
              </label>
              <SearchableSelect :key="'cm-' + users.length + '-' + editRequest.camera_man"
                v-model="editRequest.camera_man" :users="users" placeholder="Select camera man (optional)" />
            </div>
          </div>
          <!-- Equipment Selection for Edit -->
          <div class="space-y-8">
            <div class="border-b border-gray-200 pb-4">
              <h4 class="text-lg font-semibold text-gray-900 flex items-center">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z">
                        </path>
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
                      <input type="checkbox" :id="`edit-mic-${microphone.id}`" :value="microphone.id"
                        v-model="editRequest.microphone"
                        :disabled="!isEquipmentAvailable(microphone.id, 'microphone', true).available"
                        class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                      <label :for="`edit-mic-${microphone.id}`"
                        class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ microphone.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                       <span v-if="isEquipmentAvailable(microphone.id, 'microphone', true).available"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                      <div v-else class="flex flex-col items-end">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1">
                          Unavailable
                        </span>
                        <span class="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100 mt-1">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ isEquipmentAvailable(microphone.id, 'microphone', true).shootingTime}}
                        </span>
                      </div>
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z">
                        </path>
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
                      <input type="checkbox" :id="`edit-cam-${camera.id}`" :value="camera.id"
                        v-model="editRequest.camera"
                        :disabled="!isEquipmentAvailable(camera.id, 'camera', true).available"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <label :for="`edit-cam-${camera.id}`"
                        class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ camera.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span v-if="isEquipmentAvailable(camera.id, 'camera', true).available"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Available
                      </span>
                      <div v-else class="flex flex-col items-end">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1">
                          Unavailable
                        </span>
                        <span class="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100 mt-1">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ isEquipmentAvailable(camera.id, 'camera', true).shootingTime}}
                        </span>
                      </div>
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z">
                        </path>
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
                      <input type="checkbox" :id="`edit-tripod-${tripod.id}`" :value="tripod.id"
                        v-model="editRequest.tripod"
                        :disabled="!isEquipmentAvailable(tripod.id, 'tripod', true).available"
                        class="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded" />
                      <label :for="`edit-tripod-${tripod.id}`"
                        class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ tripod.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span v-if="isEquipmentAvailable(tripod.id, 'tripod', true).available"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Available
                      </span>
                      <div v-else class="flex flex-col items-end">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1">
                          Unavailable
                        </span>
                        <span class="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100 mt-1">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ isEquipmentAvailable(tripod.id, 'tripod', true).shootingTime}}
                        </span>
                      </div>
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                        </path>
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
                      <input type="checkbox" :id="`edit-gimbal-${gimbal.id}`" :value="gimbal.id"
                        v-model="editRequest.gimbal"
                        :disabled="!isEquipmentAvailable(gimbal.id, 'gimbal', true).available"
                        class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                      <label :for="`edit-gimbal-${gimbal.id}`"
                        class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ gimbal.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span v-if="isEquipmentAvailable(gimbal.id, 'gimbal', true).available"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Available
                      </span>
                      <div v-else class="flex flex-col items-end">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1">
                          Unavailable
                        </span>
                        <span class="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100 mt-1">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ isEquipmentAvailable(gimbal.id, 'gimbal', true).shootingTime}}
                        </span>
                      </div>
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                        </path>
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
                      <input type="checkbox" :id="`edit-lens-${lens.id}`" :value="lens.id"
                        v-model="editRequest.camera_lens"
                        :disabled="!isEquipmentAvailable(lens.id, 'camera_lens', true).available"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                      <label :for="`edit-lens-${lens.id}`"
                        class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ lens.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span v-if="isEquipmentAvailable(lens.id, 'camera_lens', true).available"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        Available
                      </span>
                      <div v-else class="flex flex-col items-end">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1">
                          Unavailable
                        </span>
                        <span class="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100 mt-1">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ isEquipmentAvailable(lens.id, 'camera_lens', true).shootingTime}}
                        </span>
                      </div>
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z">
                        </path>
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
                      <input type="checkbox" :id="`edit-light-${light.id}`" :value="light.id"
                        v-model="editRequest.light"
                        :disabled="!isEquipmentAvailable(light.id, 'light', true).available"
                        class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                      <label :for="`edit-light-${light.id}`"
                        class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ light.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span v-if="isEquipmentAvailable(light.id, 'light', true).available"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Available
                      </span>
                      <div v-else class="flex flex-col items-end">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1">
                          Unavailable
                        </span>
                        <span class="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100 mt-1">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ isEquipmentAvailable(light.id, 'light', true).shootingTime}}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Drones -->
              <div
                class="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6 border border-cyan-100 lg:col-span-2">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
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
                      <input type="checkbox" :id="`edit-drone-${drone.id}`" :value="drone.id"
                        v-model="editRequest.drone"
                        :disabled="!isEquipmentAvailable(drone.id, 'drone', true).available"
                        class="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded" />
                      <label :for="`edit-drone-${drone.id}`"
                        class="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                        {{ drone.name }}
                      </label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span v-if="isEquipmentAvailable(drone.id, 'drone', true).available"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                        Available
                      </span>
                      <div v-else class="flex flex-col items-end">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1">
                          Unavailable
                        </span>
                        <span class="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100 mt-1">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ isEquipmentAvailable(drone.id, 'drone', true).shootingTime}}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showEditModal = false"
              class="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white">Update
              Request</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-container {
  padding: 1rem;
  background: #fff;
  border-radius: 0.5rem;
  min-height: 600px;
}

/* FullCalendar Custom Styling */
:deep(.fc) {
  font-family: system-ui, -apple-system, sans-serif;
}

:deep(.fc-toolbar-title) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

:deep(.fc-button) {
  background-color: #3b82f6;
  border-color: #3b82f6;
  text-transform: capitalize;
  font-weight: 500;
}

:deep(.fc-button:hover) {
  background-color: #2563eb;
  border-color: #2563eb;
}

:deep(.fc-button-active) {
  background-color: #1d4ed8 !important;
  border-color: #1d4ed8 !important;
}

:deep(.fc-day-today) {
  background-color: #dbeafe !important;
}

/* Event styling */
:deep(.fc-event) {
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.875rem;
  white-space: nowrap !important;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Multi-day event spanning */
:deep(.fc-daygrid-event-harness) {
  display: block !important;
  /* width: 100% !important; */
  height: auto !important;
  overflow: visible !important;
}

:deep(.fc-daygrid-event) {
  display: block !important;
  position: relative;
  margin: 1px 0;
  padding: 2px 4px;
  overflow: hidden;
  white-space: nowrap !important;
  text-overflow: ellipsis;
}

:deep(.fc-daygrid-day-events) {
  overflow: visible !important;
  max-height: none !important;
}

/* Week view styling */
:deep(.fc-col-header-cell) {
  font-weight: 600;
  padding: 12px 4px;
  background-color: #f9fafb;
}

:deep(.fc-daygrid-day-number) {
  padding: 4px;
  font-weight: 500;
}
</style>

<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
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
// ✅ Helper function to check for date range overlaps
const checkDateRangeConflict = (
  newStart: string,
  newEnd: string,
  existingRequests: EquipmentRequest[],
  excludeId?: string
) => {
  const newStartDate = new Date(newStart).getTime()
  const newEndDate = new Date(newEnd).getTime()

  const conflicts = existingRequests
    .filter(req => req.id?.toString() !== excludeId) // Exclude current request when editing
    .filter(req => {
      const existingStart = new Date(req.shooting_date).getTime()
      const existingEnd = new Date(req.return_date).getTime()

      // Check if date ranges overlap (Inclusive check to match calendar view)
      // return newStartDate < existingEnd && newEndDate > existingStart
      return newStartDate <= existingEnd && newEndDate >= existingStart
    })
    .map(req => ({
      program_name: req.program_name,
      shooting_date: req.shooting_date,
      return_date: req.return_date,
      user: `${req.user_created?.first_name} ${req.user_created?.last_name}`
    }))

  return conflicts
}

// ✅ Helper function to format dates for display
const formatDateRange = (start: string, end: string) => {
  const startDate = new Date(start)
  const endDate = new Date(end)

  return `${startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })} - ${endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })}`
}

// ✅ Helper function to check if shooting times conflict
// Full Day (4) conflicts with Morning (1), Afternoon (2), Evening (3), and Full Day (4)
const doShootingTimesConflict = (time1: number, time2: number): boolean => {
  // Full Day conflicts with everything
  if (time1 === 4 || time2 === 4) return true
  // Same time slot conflicts
  return time1 === time2
}

// ✅ Helper function to check for EQUIPMENT conflicts
// Checks if same specific equipment is booked at overlapping dates AND shooting times
const checkEquipmentConflicts = (
  newRequest: {
    shooting_date: string,
    return_date: string,
    shooting_time: string | number,
    microphone: string[] | any[],
    camera: string[] | any[],
    tripod: string[] | any[],
    gimbal: string[] | any[],
    camera_lens: string[] | any[],
    light: string[] | any[],
    drone: string[] | any[]
  },
  existingRequests: EquipmentRequest[],
  excludeId?: string
) => {
  const conflicts: Array<{
    equipmentType: string,
    equipmentName: string,
    conflictingProgram: string,
    conflictingUser: string,
    conflictingDate: string,
    conflictingTime: string
  }> = []

  const newStartDate = new Date(newRequest.shooting_date).getTime()
  const newEndDate = new Date(newRequest.return_date).getTime()
  const newShootingTime = typeof newRequest.shooting_time === 'string'
    ? parseInt(newRequest.shooting_time)
    : newRequest.shooting_time

  // Shooting time names for display
  const shootingTimeNames: Record<number, string> = {
    1: 'Morning',
    2: 'Afternoon',
    3: 'Evening',
    4: 'Full Day'
  }

  // Helper to extract equipment IDs from the new request format (string[])
  const getNewEquipmentIds = (items: string[] | any[]): number[] => {
    return items.map(item => {
      if (typeof item === 'string') return parseInt(item)
      if (typeof item === 'number') return item
      return item?.id || 0
    }).filter(id => id > 0)
  }

  // Helper to extract equipment IDs from existing request format (nested objects)
  const getExistingEquipmentIds = (items: any[] | undefined, idField: string): number[] => {
    if (!items) return []
    return items.map(item => {
      const nestedObj = item?.[idField]
      if (nestedObj?.id) return nestedObj.id
      if (typeof nestedObj === 'number') return nestedObj
      if (item?.id) return item.id
      return 0
    }).filter(id => id > 0)
  }

  // Equipment type configurations
  const equipmentTypes = [
    { key: 'microphone', field: 'microphone_id', label: 'Microphone', dataKey: 'microphones' },
    { key: 'camera', field: 'camera_id', label: 'Camera', dataKey: 'cameras' },
    { key: 'tripod', field: 'tripod_id', label: 'Tripod', dataKey: 'tripods' },
    { key: 'gimbal', field: 'gimbal_id', label: 'Gimbal', dataKey: 'gimbals' },
    { key: 'camera_lens', field: 'camera_lens_id', label: 'Camera Lens', dataKey: 'cameraLens' },
    { key: 'light', field: 'light_id', label: 'Light', dataKey: 'lights' },
    { key: 'drone', field: 'drone_id', label: 'Drone', dataKey: 'drones' }
  ]

  // Check each existing request
  for (const existingReq of existingRequests) {
    if (excludeId && existingReq.id?.toString() === excludeId) continue

    const existingStart = new Date(existingReq.shooting_date).getTime()
    const existingEnd = new Date(existingReq.return_date).getTime()
    const existingShootingTime = existingReq.shooting_time?.id || existingReq.shooting_time

    // Check if dates overlap
    const datesOverlap = newStartDate <= existingEnd && newEndDate >= existingStart
    if (!datesOverlap) continue

    // Check if shooting times conflict
    if (!doShootingTimesConflict(newShootingTime, existingShootingTime as number)) continue

    // Check equipment conflicts
    for (const eqType of equipmentTypes) {
      const newIds = getNewEquipmentIds((newRequest as any)[eqType.key] || [])
      const existingIds = getExistingEquipmentIds((existingReq as any)[eqType.key], eqType.field)
      const conflictingIds = newIds.filter(id => existingIds.includes(id))

      for (const conflictId of conflictingIds) {
        const eqData = (equipmentData.value as any)[eqType.dataKey] || []
        const equipment = eqData.find((eq: any) => eq.id === conflictId)
        const equipmentName = equipment?.name || `ID: ${conflictId}`

        conflicts.push({
          equipmentType: eqType.label,
          equipmentName: equipmentName,
          conflictingProgram: existingReq.program_name || 'Unknown',
          conflictingUser: `${existingReq.user_created?.first_name || ''} ${existingReq.user_created?.last_name || ''}`.trim() || 'Unknown',
          conflictingDate: existingReq.shooting_date,
          conflictingTime: shootingTimeNames[existingShootingTime as number] || 'Unknown'
        })
      }
    }
  }

  return conflicts
}

// Helper function to check if a specific equipment is available
const isEquipmentAvailable = (
  equipmentId: number,
  equipmentType: 'microphone' | 'camera' | 'tripod' | 'gimbal' | 'camera_lens' | 'light' | 'drone',
  isEdit: boolean = false
) => {
  // Get the request data based on whether we're in create or edit mode
  const requestData = isEdit ? editRequest.value : manualRequest.value
  
  // If dates or shooting time are not set, consider available
  if (!requestData.shooting_date || !requestData.return_date || !requestData.shooting_time) {
    return { available: true, bookedBy: null, bookedFor: null, shootingTime: null }
  }

  const newStartDate = new Date(requestData.shooting_date).getTime()
  const newEndDate = new Date(requestData.return_date).getTime()
  const newShootingTime = typeof requestData.shooting_time === 'string'
    ? parseInt(requestData.shooting_time)
    : requestData.shooting_time

  // Equipment type to field mapping
  const fieldMap: Record<string, string> = {
    microphone: 'microphone_id',
    camera: 'camera_id',
    tripod: 'tripod_id',
    gimbal: 'gimbal_id',
    camera_lens: 'camera_lens_id',
    light: 'light_id',
    drone: 'drone_id'
  }

  const idField = fieldMap[equipmentType]

  // Check all existing requests for conflicts
  for (const existingReq of requests.value) {
    // Skip the current request when editing
    if (isEdit && existingReq.id?.toString() === requestData.id) continue

    const existingStart = new Date(existingReq.shooting_date).getTime()
    const existingEnd = new Date(existingReq.return_date).getTime()
    const existingShootingTime = existingReq.shooting_time?.id || existingReq.shooting_time

    // Check if dates overlap
    const datesOverlap = newStartDate <= existingEnd && newEndDate >= existingStart
    if (!datesOverlap) continue

    // Check if shooting times conflict
    if (!doShootingTimesConflict(newShootingTime, existingShootingTime as number)) continue

    // Check if this specific equipment is in the existing request
    const equipmentArray = (existingReq as any)[equipmentType]
    if (!equipmentArray || !Array.isArray(equipmentArray)) continue

    const hasConflict = equipmentArray.some((item: any) => {
      const itemId = item?.[idField]?.id || item?.[idField]
      return itemId === equipmentId
    })

    if (hasConflict) {
      const shootingTimeNames: Record<number, string> = {
        1: 'Morning',
        2: 'Afternoon',
        3: 'Evening',
        4: 'Full Day'
      }
      
      return {
        available: false,
        bookedBy: `${existingReq.user_created?.first_name || ''} ${existingReq.user_created?.last_name || ''}`.trim() || 'Unknown',
        bookedFor: existingReq.program_name || 'Unknown Program',
        shootingTime: shootingTimeNames[existingShootingTime as number] || 'Unknown'
      }
    }
  }

  return { available: true, bookedBy: null, bookedFor: null, shootingTime: null }
}

// ========================
const today = computed(() => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString().split('T')[0];
})

const minReturnDateManual = computed(() => {
  // ✅ FIX: Allow return date to be same day or after shooting date
  if (!manualRequest.value.shooting_date) return today.value
  return manualRequest.value.shooting_date // Same day is now allowed
})

const minReturnDateEdit = computed(() => {
  // ✅ FIX: Allow return date to be same day or after shooting date
  if (!editRequest.value.shooting_date) return today.value
  return editRequest.value.shooting_date // Same day is now allowed
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
const showMoreEventsModal = ref(false)
const moreEventsData = ref<{ date: string; events: any[] }>({ date: '', events: [] })

const manualRequest = ref({
  shooting_date: '',
  return_date: '',
  shooting_time: '',
  program_name: '',
  content_creator: null as string | null,  // UUID string
  camera_man: null as string | null,        // UUID string
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
  program_name: '',
  content_creator: null as string | null,  // UUID string
  camera_man: null as string | null,        // UUID string
  microphone: [] as string[],
  camera: [] as string[],
  tripod: [] as string[],
  gimbal: [] as string[],
  camera_lens: [] as string[],
  light: [] as string[],
  drone: [] as string[]
})

// Users have UUID string IDs
const users = ref<Array<{ id: string; first_name: string; last_name: string }>>([])

// Add this function to load users
const loadUsers = async () => {
  try {
    const response = await useApi<{ data: Array<{ id: string; first_name: string; last_name: string }> }>(
      '/users?fields=id,first_name,last_name&limit=-1',
      { method: 'GET' }
    )
    users.value = response.data
  } catch (error) {
    console.error('Error loading users:', error)
  }
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
    // Load users for content creator and camera man dropdowns
    await loadUsers()

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

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  firstDay: 1, // Start week from Monday (0 = Sunday, 1 = Monday)
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek'
  },
  events: [
    ...requests.value.map(request => {
    // Normalize dates
    const normalize = (d: string) => {
      if (!d) return ''
      return d.toString().split('T')[0]
    }

    const startStr = normalize(request.shooting_date)
    const endStr = normalize(request.return_date)

    // Calculate end date for FullCalendar (exclusive)
    // FullCalendar requires the end date to be the day AFTER the last day
    // Use manual string manipulation to avoid timezone issues
    const endParts = endStr.split('-')
    const endYear = parseInt(endParts[0])
    const endMonth = parseInt(endParts[1]) - 1 // JS months are 0-indexed
    const endDay = parseInt(endParts[2])
    
    const endDate = new Date(endYear, endMonth, endDay)
    endDate.setDate(endDate.getDate() + 1)
    
    const endStrExclusive = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`

    // Map shooting time
    const shootingTimeText = request.shooting_time?.name || 'Full Day'

    // Assign icon based on primary equipment type
    let icon = '🎥'
    if (request.camera?.length) {
      icon = '📷'
    } else if (request.drone?.length) {
      icon = '🚁'
    } else if (request.light?.length) {
      icon = '💡'
    } else if (request.microphone?.length) {
      icon = '🎤'
    } else if (request.gimbal?.length) {
      icon = '🎬'
    }

    return {
      id: request.id?.toString(),
      title: `${icon} ${request.program_name || 'Untitled'} - ${shootingTimeText}`,
      start: startStr,
      end: endStrExclusive, // FullCalendar uses exclusive end dates
      allDay: true, // Important: marks this as an all-day event for proper spanning
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
      textColor: '#fff',
      extendedProps: {
        request: request,
        programName: request.program_name || 'Untitled Project',
        shootingTime: shootingTimeText,
        icon: icon,
        dateRange: (() => {
          const formatShort = (dateStr: string) => {
            const d = new Date(dateStr)
            return `${d.getMonth() + 1}/${d.getDate()}`
          }
          const start = formatShort(startStr)
          const end = formatShort(endStr)
          return start === end ? start : `${start} → ${end}`
        })()
      }
    }
  })
  ],
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  displayEventTime: false,
  displayEventEnd: false,
  eventDisplay: 'block', // This ensures events display as blocks that can span
  height: 'auto',
  eventMaxStack: 3, // Enable native spanning behavior
  eventClick: (info: any) => {
    const request = info.event.extendedProps.request
    if (request) {
      selectedEvent.value = { extendedProps: { request } }
    }
  },
  dateClick: (info: any) => {
    const clickedDate = info.dateStr
    const selectedDate = new Date(clickedDate)
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)

    if (selectedDate >= todayDate) {
      manualRequest.value.shooting_date = clickedDate
      manualRequest.value.return_date = clickedDate
      loadEquipmentData()
      showManualModal.value = true
    } else {
      showMessage('Cannot book for past dates', 'error')
    }
  }
}))

// Event handlers are now integrated into calendarOptions



const changeView = (viewName: string) => {
  // No longer needed for Qalendar internal state, but keeping for compatibility if referenced
  currentView.value = viewName
}
// 📌 Custom Telegram Message Formatter with Khmer text and emojis
const formatTelegramMessage = (requestData: any, requestNumber: string = 'N/A') => {
  const auth = useAuthStore()
  const currentUser = auth.user

  // Calculate number of days between shooting and return date
  const shootingDate = new Date(requestData.shooting_date)
  const returnDate = new Date(requestData.return_date)
  const daysDiff = Math.ceil((returnDate.getTime() - shootingDate.getTime()) / (1000 * 60 * 60 * 24))

  // Format dates as MM/DD/YYYY
  const formatDateKh = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
  }

  // Map shooting time ID to Khmer text
  const shootingTimeMap: { [key: number]: string } = {
    1: 'ព្រឹក (Morning)',
    2: 'រសៀល (Afternoon)',
    3: 'ល្ងាច (Evening)',
  }
  const shootingTimeName = shootingTimeMap[requestData.shooting_time] || 'ពេញមួយថ្ងៃ'

  // Get content creator name
  const contentCreatorName = requestData.content_creator
    ? users.value.find(u => u.id === requestData.content_creator)?.first_name || 'N/A'
    : 'N/A'

  // Get camera man name
  const cameraManName = requestData.camera_man
    ? users.value.find(u => u.id === requestData.camera_man)?.first_name || 'N/A'
    : 'N/A'

  // Build equipment list with actual equipment names
  const equipmentList: string[] = []

  if (requestData.microphone?.length) {
    const micNames = requestData.microphone
      .map((m: any) => equipmentData.value.microphones.find(mic => mic.id === parseInt(m.microphone_id))?.name)
      .filter(Boolean)
      .join(', ')
    equipmentList.push(`🔸 🎤 Microphone: ${micNames}`)
  }

  if (requestData.camera?.length) {
    const camNames = requestData.camera
      .map((c: any) => equipmentData.value.cameras.find(cam => cam.id === parseInt(c.camera_id))?.name)
      .filter(Boolean)
      .join(', ')
    equipmentList.push(`🔸 📷 Camera: ${camNames}`)
  }

  if (requestData.tripod?.length) {
    const tripodNames = requestData.tripod
      .map((t: any) => equipmentData.value.tripods.find(trip => trip.id === parseInt(t.tripod_id))?.name)
      .filter(Boolean)
      .join(', ')
    equipmentList.push(`🔸 📹 Tripod: ${tripodNames}`)
  }

  if (requestData.gimbal?.length) {
    const gimbalNames = requestData.gimbal
      .map((g: any) => equipmentData.value.gimbals.find(gim => gim.id === parseInt(g.gimbal_id))?.name)
      .filter(Boolean)
      .join(', ')
    equipmentList.push(`🔸 🤖 Gimbal: ${gimbalNames}`)
  }

  if (requestData.camera_lens?.length) {
    const lensNames = requestData.camera_lens
      .map((l: any) => equipmentData.value.cameraLens.find(lens => lens.id === parseInt(l.camera_lens_id))?.name)
      .filter(Boolean)
      .join(', ')
    equipmentList.push(`🔸 🔍 Camera Lens: ${lensNames}`)
  }

  if (requestData.light?.length) {
    const lightNames = requestData.light
      .map((l: any) => equipmentData.value.lights.find(light => light.id === parseInt(l.light_id))?.name)
      .filter(Boolean)
      .join(', ')
    equipmentList.push(`🔸 💡 Light: ${lightNames}`)
  }

  if (requestData.drone?.length) {
    const droneNames = requestData.drone
      .map((d: any) => equipmentData.value.drones.find(drone => drone.id === parseInt(d.drone_id))?.name)
      .filter(Boolean)
      .join(', ')
    equipmentList.push(`🔸 🚁 Drone: ${droneNames}`)
  }

  // Get base URL dynamically from current window location
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'undefined'

  // Build the formatted message
  return `🎬 ${currentUser?.first_name || 'N/A'} បានស្នើសុំថត
📄 លេខរៀងស្នើសុំ៖ ${requestNumber}
📅 ថ្ងៃទី: ${formatDateKh(requestData.shooting_date)} ➡️ ${formatDateKh(requestData.return_date)}
🕒 ថតពេល៖ ${shootingTimeName}
📆 ថតចំនួន៖ ${daysDiff} ថ្ងៃ
━━━━━━━━━━━━━━━
🎥 ព័ត៌មានកម្មវិធី
• 📑 Program Name: ${requestData.program_name || 'N/A'}
• 👨‍💻 Content Creator: ${contentCreatorName}
• 🎥 Cameraman: ${cameraManName}
━━━━━━━━━━━━━━━
🛠️ បានស្នើសុំឧបករណ៏៖
${equipmentList.join('\n')}
━━━━━━━━━━━━━━━
🔗 ចូលមើលកាលវិភាគនៅ ${baseUrl}/dashboard/booking-room/equipment-request`
}

const handleManualRequest = async () => {
  // ✅ Validate dates BEFORE setting isProcessing
  const shootingDate = new Date(manualRequest.value.shooting_date)
  const returnDate = new Date(manualRequest.value.return_date)
  const nowDate = new Date()
  nowDate.setHours(0, 0, 0, 0)
  shootingDate.setHours(0, 0, 0, 0)
  returnDate.setHours(0, 0, 0, 0)

  // ✅ Check if shooting date is in the past
  if (shootingDate < nowDate) {
    showMessage('❌ Shooting date cannot be in the past.', 'error')
    return
  }

  // ✅ FIX: Allow same day return, only check if return is before shooting
  if (returnDate < shootingDate) {
    showMessage('❌ Return date cannot be before the shooting date.', 'error')
    return
  }

  // ✅ Check for EQUIPMENT conflicts (same equipment at same date/time)
  const equipmentConflicts = checkEquipmentConflicts(
    manualRequest.value,
    requests.value
  )

  if (equipmentConflicts.length > 0) {
    // Group conflicts by equipment for cleaner display
    const conflictDetails = equipmentConflicts
      .map(c => `
        <div style="margin-bottom: 10px; padding: 8px; background: #fef2f2; border-radius: 6px;">
          <b>🔴 ${c.equipmentType}: ${c.equipmentName}</b><br>
          &nbsp;&nbsp;Already booked for: <b>${c.conflictingProgram}</b><br>
          &nbsp;&nbsp;Date: ${c.conflictingDate} (${c.conflictingTime})<br>
          &nbsp;&nbsp;By: <i>${c.conflictingUser}</i>
        </div>
      `)
      .join('')

    await Swal.fire({
      icon: 'error',
      title: '⚠️ Equipment Conflict!',
      html: `
        <div style="text-align: left; font-size: 13px; max-height: 400px; overflow-y: auto;">
          <p style="margin-bottom: 12px;">The following equipment is already booked at the same time:</p>
          ${conflictDetails}
          <p style="margin-top: 12px; font-weight: bold; color: #dc2626;">
            Please choose different equipment or a different time slot.
          </p>
        </div>
      `,
      confirmButtonText: 'OK, I\'ll Change',
      confirmButtonColor: '#dc2626',
      width: '36em'
    })
    return // Exit early if equipment conflicts found
  }

  // ✅ Now set isProcessing after all validations pass
  isProcessing.value = true

  try {
    const requestData = {
      shooting_date: manualRequest.value.shooting_date,
      return_date: manualRequest.value.return_date,
      shooting_time: parseInt(manualRequest.value.shooting_time),
      program_name: manualRequest.value.program_name,
      content_creator: manualRequest.value.content_creator,
      camera_man: manualRequest.value.camera_man,
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
      program_name: '',
      content_creator: null,
      camera_man: null,
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
    // 🎯 Generate request number (you can customize this logic)
    const requestNumber = `${requests.value.length + 1}${['st', 'nd', 'rd'][requests.value.length] || 'th'}`

    // 📨 Send formatted Telegram message
    await sendTelegramMessage(formatTelegramMessage(requestData, requestNumber))


  } catch (error) {
    console.error('Manual request error:', error)
    showMessage('❌ Failed to create equipment request.', 'error')
  } finally {
    isProcessing.value = false
  }
}

const editRequestFromEvent = async (request: EquipmentRequest) => {
  // First load equipment data and users (wait for it to complete)
  await loadEquipmentData()

  // Then populate the form with the request data
  editRequest.value = {
    id: request.id!.toString(),
    shooting_date: request.shooting_date,
    return_date: request.return_date,
    shooting_time: request.shooting_time?.id?.toString() || '',
    program_name: request.program_name || '',
    // Extract user IDs - handle different response structures (UUIDs are strings)
    content_creator: (() => {
      console.log('DEBUG content_creator raw:', request.content_creator)
      if (request.content_creator?.id) {
        const id = String(request.content_creator.id)
        console.log('DEBUG content_creator ID:', id)
        return id
      }
      if (typeof request.content_creator === 'string') {
        return request.content_creator
      }
      return null
    })(),
    camera_man: (() => {
      console.log('DEBUG camera_man raw:', request.camera_man)
      if (request.camera_man?.id) {
        const id = String(request.camera_man.id)
        console.log('DEBUG camera_man ID:', id)
        return id
      }
      if (typeof request.camera_man === 'string') {
        return request.camera_man
      }
      return null
    })(),
    // Map equipment IDs
    microphone: request.microphone?.map((m: any) => (m?.microphone_id?.id ?? m?.id)?.toString()).filter(Boolean) || [],
    camera: request.camera?.map((c: any) => (c?.camera_id?.id ?? c?.id)?.toString()).filter(Boolean) || [],
    tripod: request.tripod?.map((t: any) => (t?.tripod_id?.id ?? t?.id)?.toString()).filter(Boolean) || [],
    gimbal: request.gimbal?.map((g: any) => (g?.gimbal_id?.id ?? g?.id)?.toString()).filter(Boolean) || [],
    camera_lens: request.camera_lens?.map((cl: any) => (cl?.camera_lens_id?.id ?? cl?.id)?.toString()).filter(Boolean) || [],
    light: request.light?.map((l: any) => (l?.light_id?.id ?? l?.id)?.toString()).filter(Boolean) || [],
    drone: request.drone?.map((d: any) => (d?.drone_id?.id ?? d?.id)?.toString()).filter(Boolean) || []
  }

  console.log('DEBUG editRequest set:', {
    content_creator: editRequest.value.content_creator,
    camera_man: editRequest.value.camera_man,
    users_count: users.value.length
  })

  // Close the view modal
  selectedEvent.value = null

  // Wait for Vue to update, then open edit modal
  await nextTick()
  showEditModal.value = true
}

const updateRequestData = async () => {
  // ✅ Validate dates BEFORE setting isProcessing
  const shootingDate = new Date(editRequest.value.shooting_date)
  const returnDate = new Date(editRequest.value.return_date)
  const nowDate = new Date()
  nowDate.setHours(0, 0, 0, 0)
  shootingDate.setHours(0, 0, 0, 0)
  returnDate.setHours(0, 0, 0, 0)

  // ✅ Check if shooting date is in the past
  if (shootingDate < nowDate) {
    showMessage('❌ Shooting date cannot be in the past.', 'error')
    return // Exit early
  }

  // ✅ Check if return date is after shooting date
  if (returnDate < shootingDate) {
    showMessage('❌ Return date must be after the shooting date.', 'error')
    return // Exit early
  }

  // ✅ Check for EQUIPMENT conflicts (same equipment at same date/time)
  const equipmentConflicts = checkEquipmentConflicts(
    editRequest.value,
    requests.value,
    editRequest.value.id // Exclude current request from conflict check
  )

  if (equipmentConflicts.length > 0) {
    const conflictDetails = equipmentConflicts
      .map(c => `
        <div style="margin-bottom: 10px; padding: 8px; background: #fef2f2; border-radius: 6px;">
          <b>🔴 ${c.equipmentType}: ${c.equipmentName}</b><br>
          &nbsp;&nbsp;Already booked for: <b>${c.conflictingProgram}</b><br>
          &nbsp;&nbsp;Date: ${c.conflictingDate} (${c.conflictingTime})<br>
          &nbsp;&nbsp;By: <i>${c.conflictingUser}</i>
        </div>
      `)
      .join('')

    await Swal.fire({
      icon: 'error',
      title: '⚠️ Equipment Conflict!',
      html: `
        <div style="text-align: left; font-size: 13px; max-height: 400px; overflow-y: auto;">
          <p style="margin-bottom: 12px;">The following equipment is already booked at the same time:</p>
          ${conflictDetails}
          <p style="margin-top: 12px; font-weight: bold; color: #dc2626;">
            Please choose different equipment or a different time slot.
          </p>
        </div>
      `,
      confirmButtonText: 'OK, I\'ll Change',
      confirmButtonColor: '#dc2626',
      width: '36em'
    })
    return // Exit early if equipment conflicts found
  }

  // ✅ Now set isProcessing after all validations pass
  isProcessing.value = true

  try {
    const updatedData = {
      shooting_date: editRequest.value.shooting_date,
      return_date: editRequest.value.return_date,
      shooting_time: parseInt(editRequest.value.shooting_time),
      program_name: editRequest.value.program_name,
      content_creator: editRequest.value.content_creator,
      camera_man: editRequest.value.camera_man,
      microphone: editRequest.value.microphone.map(id => ({ microphone_id: parseInt(id) })),
      camera: editRequest.value.camera.map(id => ({ camera_id: parseInt(id) })),
      tripod: editRequest.value.tripod.map(id => ({ tripod_id: parseInt(id) })),
      gimbal: editRequest.value.gimbal.map(id => ({ gimbal_id: parseInt(id) })),
      camera_lens: editRequest.value.camera_lens.map(id => ({ camera_lens_id: parseInt(id) })),
      light: editRequest.value.light.map(id => ({ light_id: parseInt(id) })),
      drone: editRequest.value.drone.map(id => ({ drone_id: parseInt(id) }))
    }

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

    // ⭐ Force calendar to refresh
    nextTick(() => {
      const api = fullCalendar.value?.getApi()
      api?.refetchEvents()
    })

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
  loadEquipmentData() // Load equipment data on mount
})

// ✅ Watch for shooting time changes and automatically unselect unavailable equipment
watch(() => manualRequest.value.shooting_time, (newTime, oldTime) => {
  // Only run if shooting time actually changed and both dates are set
  if (!manualRequest.value.shooting_date || !manualRequest.value.return_date) return
  if (newTime === oldTime) return

  // Check each equipment type and unselect any that are now unavailable
  const equipmentTypes: Array<{ key: keyof typeof manualRequest.value, type: 'microphone' | 'camera' | 'tripod' | 'gimbal' | 'camera_lens' | 'light' | 'drone' }> = [
    { key: 'microphone', type: 'microphone' },
    { key: 'camera', type: 'camera' },
    { key: 'tripod', type: 'tripod' },
    { key: 'gimbal', type: 'gimbal' },
    { key: 'camera_lens', type: 'camera_lens' },
    { key: 'light', type: 'light' },
    { key: 'drone', type: 'drone' }
  ]

  for (const eqType of equipmentTypes) {
    const selectedItems = manualRequest.value[eqType.key] as string[]
    if (!selectedItems || selectedItems.length === 0) continue

    // Filter out equipment that is no longer available
    const stillAvailable = selectedItems.filter(id => {
      const availability = isEquipmentAvailable(parseInt(id), eqType.type, false)
      return availability.available
    })

    // Update the selection if some items became unavailable
    if (stillAvailable.length !== selectedItems.length) {
      (manualRequest.value[eqType.key] as string[]) = stillAvailable
    }
  }
})

// ✅ Watch for shooting time changes in edit modal
watch(() => editRequest.value.shooting_time, (newTime, oldTime) => {
  if (!editRequest.value.shooting_date || !editRequest.value.return_date) return
  if (newTime === oldTime) return

  const equipmentTypes: Array<{ key: keyof typeof editRequest.value, type: 'microphone' | 'camera' | 'tripod' | 'gimbal' | 'camera_lens' | 'light' | 'drone' }> = [
    { key: 'microphone', type: 'microphone' },
    { key: 'camera', type: 'camera' },
    { key: 'tripod', type: 'tripod' },
    { key: 'gimbal', type: 'gimbal' },
    { key: 'camera_lens', type: 'camera_lens' },
    { key: 'light', type: 'light' },
    { key: 'drone', type: 'drone' }
  ]

  for (const eqType of equipmentTypes) {
    const selectedItems = editRequest.value[eqType.key] as string[]
    if (!selectedItems || selectedItems.length === 0) continue

    const stillAvailable = selectedItems.filter(id => {
      const availability = isEquipmentAvailable(parseInt(id), eqType.type, true)
      return availability.available
    })

    if (stillAvailable.length !== selectedItems.length) {
      (editRequest.value[eqType.key] as string[]) = stillAvailable
    }
  }
})

definePageMeta({
  middleware: 'auth',
})
</script>
