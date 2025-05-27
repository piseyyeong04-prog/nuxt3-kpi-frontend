<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="px-6 py-4 bg-blue-600 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white">AI Room Booking System</h1>
            <p class="text-blue-100 mt-1">Book rooms using natural language</p>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white mb-4">Manual Booking</h2>
            <button @click="showManualModal = true"
              class="mb-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md">
              Booking Manual
            </button>
          </div>
        </div>
        <!-- AI Booking Form -->
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Natural Language Booking</h2>
          <form @submit.prevent="handleAIBooking" class="space-y-4">
            <div>
              <label for="booking-text" class="block text-sm font-medium text-gray-700 mb-2">
                Describe your booking
              </label>
              <textarea id="booking-text" v-model="bookingText"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="3" placeholder="e.g., 'Book meeting room for tomorrow from 2 PM to 4 PM for team standup'"
                required></textarea>
            </div>
            <div class="flex space-x-3">
              <button type="submit" :disabled="isProcessing"
                class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
                <span v-if="!isProcessing">📅 Book with AI</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  Processing...
                </span>
              </button>
              <button @click="askAvailability" :disabled="isProcessing"
                class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
                🔍 Check Availabile time with AI
              </button>
              <button @click="showBookingHelp"
                class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md">
                🤖 Help Me Use This
              </button>


            </div>
          </form>
        </div>
        <!-- Success/Error Messages -->
        <!-- <div v-if="message" :class="messageClass" class="mt-4 p-4 rounded-md">
        {{ message }}
      </div> -->

        <!-- Calendar View -->
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Room Bookings Calendar</h2>
            <div class="flex space-x-2">
              <button @click="changeView('dayGridMonth')"
                :class="currentView === 'dayGridMonth' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
                class="px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 hover:text-white transition-colors">
                Month
              </button>
              <button @click="changeView('dayGridWeek')"
                :class="currentView === 'dayGridWeek' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
                class="px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 hover:text-white transition-colors">
                Week
              </button>
              <button @click="loadBookings" class="text-blue-600 hover:text-blue-800 font-medium px-3 py-1">
                🔄 Refresh
              </button>
            </div>
          </div>

          <div v-if="loading" class="text-center py-8">
            <div class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Loading bookings...
            </div>
          </div>

          <div v-else class="calendar-container">
            <FullCalendar ref="fullCalendar" :options="calendarOptions" />
          </div>
        </div>
      </div>



      <!-- Event Details Modal -->
      <div v-if="selectedEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" data-aos="fade-down">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Booking Details</h3>
            <button @click="selectedEvent = null" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="space-y-6">
            <!-- User Created Info -->
            <div
              v-if="selectedEvent.extendedProps.booking.user_created && typeof selectedEvent.extendedProps.booking.user_created === 'object'"
              class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <!-- <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg> -->
                  <img v-if="selectedEvent.extendedProps.booking.user_created.avatar"
                    :src="useImg(selectedEvent.extendedProps.booking.user_created.avatar)" alt="User Avatar"
                    class="w-8 h-8 rounded-full object-cover">
                </div>
                <div>
                  <p class="font-semibold text-gray-900 leading-tight">
                    {{ selectedEvent.extendedProps.booking.user_created.first_name }}
                    {{ selectedEvent.extendedProps.booking.user_created.last_name }}
                  </p>
                  <p v-if="selectedEvent.extendedProps.booking.user_created.department?.title"
                    class="text-sm text-blue-600 font-medium">
                    {{ selectedEvent.extendedProps.booking.user_created.department.title }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Booking Purpose -->
            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-gray-700 mb-1">Purpose</h4>
                  <p class="text-gray-900 font-medium leading-relaxed">{{ selectedEvent.title }}</p>
                </div>
              </div>
            </div>

            <!-- Date & Time Grid -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Booking Date -->
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
                    <h4 class="text-xs font-medium text-orange-700 uppercase tracking-wide">Date</h4>
                    <p class="text-sm font-semibold text-gray-900 mt-0.5">
                      {{ formatDate(selectedEvent.extendedProps.booking.date) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Booking Time -->
              <div class="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-xs font-medium text-purple-700 uppercase tracking-wide">Time</h4>
                    <p class="text-sm font-semibold text-gray-900 mt-0.5">
                      {{ selectedEvent.extendedProps.booking.start }} - {{ selectedEvent.extendedProps.booking.end }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Booking Status -->
            <div class="bg-white rounded-xl p-4 border-2 border-gray-100 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h4 class="text-sm font-medium text-gray-700">Status</h4>
                </div>
                <span :class="getEnhancedStatusClass(selectedEvent.extendedProps.booking.status)">
                  <span class="flex items-center space-x-1">
                    <span class="w-2 h-2 rounded-full"
                      :class="getStatusDotClass(selectedEvent.extendedProps.booking.status)"></span>
                    <span class="capitalize font-medium">{{ selectedEvent.extendedProps.booking.status }}</span>
                  </span>
                </span>
              </div>
            </div>
          </div>


          <div class="flex space-x-3 mt-6">
            <button @click="editBookingFromEvent(selectedEvent.extendedProps.booking)"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Edit Booking
            </button>
            <button @click="confirmDeleteBookingFromEvent(selectedEvent.extendedProps.booking)"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Delete Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Manual Booking Modal -->
  <div v-if="showManualModal"
    class="fixed inset-0 z-50 bg-black backdrop-blur-md bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl" data-aos="fade-down">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Manual Booking</h3>
        <button @click="showManualModal = false" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleManualBooking" class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label for="modal-date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" id="modal-date" v-model="manualBooking.date" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label for="modal-purpose" class="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
          <input type="text" id="modal-purpose" v-model="manualBooking.purpose" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label for="modal-start" class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input type="time" id="modal-start" v-model="manualBooking.start" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label for="modal-end" class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input type="time" id="modal-end" v-model="manualBooking.end" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div class="md:col-span-2 flex justify-end space-x-3 mt-4">
          <button @click="showManualModal = false" type="button"
            class="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800">
            Cancel
          </button>
          <button type="submit" :disabled="isProcessing"
            class="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400">
            📋 Create Booking
          </button>
        </div>
      </form>
    </div>
  </div>
  <div v-if="showEditModal" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Edit Booking</h3>
        <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="updateBookingData" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="edit-date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" id="edit-date" v-model="editBooking.date" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label for="edit-purpose" class="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
          <input type="text" id="edit-purpose" v-model="editBooking.purpose" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label for="edit-start" class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input type="time" id="edit-start" v-model="editBooking.start" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label for="edit-end" class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input type="time" id="edit-end" v-model="editBooking.end" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div class="md:col-span-2 flex justify-end space-x-3 mt-4">
          <button type="button" @click="showEditModal = false"
            class="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white">📂 Update
            Booking</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions, EventClickArg, DateSelectArg } from '@fullcalendar/core'
import type { Booking, ParsedBookingData } from '~/types/booking'
import Swal from 'sweetalert2'

const { extractBookingInfo } = useGeminiAI()
const { createBooking, getBookings, updateBooking, deleteBooking } = useBooking()
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

// Reactive state
const bookingText = ref('')
const bookings = ref<Booking[]>([])
const loading = ref(false)
const isProcessing = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const selectedEvent = ref<any>(null)
const currentView = ref('dayGridMonth')
const fullCalendar = ref()
const showManualModal = ref(false)

const manualBooking = ref({
  date: '',
  start: '',
  end: '',
  purpose: ''
})

const handleEventClick = (clickInfo: EventClickArg) => {
  selectedEvent.value = clickInfo.event
}

const handleDateSelect = (selectInfo: DateSelectArg) => {
  // Auto-fill manual booking form with selected date
  manualBooking.value.date = selectInfo.startStr
  showManualModal.value = true
}

// Computed
const messageClass = computed(() => ({
  'bg-green-100 border border-green-400 text-green-700': messageType.value === 'success',
  'bg-red-100 border border-red-400 text-red-700': messageType.value === 'error'
}))

const calendarEvents = computed(() => {
  return bookings.value.map(booking => ({
    id: booking.id?.toString(),
    title: booking.purpose,
    start: `${booking.date}T${booking.start}`,
    end: `${booking.date}T${booking.end}`,
    backgroundColor: getEventColor(booking.status),
    borderColor: getEventBorderColor(booking.status),
    extendedProps: {
      booking: booking
    }
  }))
})

// Calendar configuration - Fixed to properly bind events
const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: ''
  },
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  events: calendarEvents.value, // ✅ Fixed: Properly bind to computed events
  eventClick: handleEventClick,
  select: handleDateSelect,
  eventDidMount(info) {
    const status = info.event.extendedProps.booking?.status
    if (status === 'published') {
      info.el.style.backgroundColor = '#059669'
      info.el.style.borderColor = '#047857'
    } else if (status === 'draft') {
      info.el.style.backgroundColor = '#d97706'
      info.el.style.borderColor = '#b45309'
    } else if (status === 'cancelled') {
      info.el.style.backgroundColor = '#dc2626'
      info.el.style.borderColor = '#b91c1c'
    }
  }
}))

// Methods
// const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
//   message.value = msg
//   messageType.value = type
//   setTimeout(() => {
//     message.value = ''
//   }, 5000)
// }

const getEventColor = (status: string) => {
  switch (status) {
    case 'published': return '#059669'
    case 'draft': return '#d97706'
    case 'cancelled': return '#dc2626'
    default: return '#6b7280'
  }
}

const getEventBorderColor = (status: string) => {
  switch (status) {
    case 'published': return '#047857'
    case 'draft': return '#b45309'
    case 'cancelled': return '#b91c1c'
    default: return '#4b5563'
  }
}

const changeView = (viewName: string) => {
  currentView.value = viewName
  if (fullCalendar.value) {
    const calendarApi = fullCalendar.value.getApi()
    calendarApi.changeView(viewName)
  }
}

const askAvailability = async () => {
  if (!bookingText.value.trim()) return;

  isProcessing.value = true;
  try {
    const parsed: ParsedBookingData = await extractBookingInfo(bookingText.value);

    const bufferMs = 60 * 1000; // 1 minute
    const slotDuration = 30 * 60 * 1000; // 30 minutes

    const requestedStart = new Date(`${parsed.date}T${parsed.start_time}`).getTime();
    const requestedEnd = new Date(`${parsed.date}T${parsed.end_time}`).getTime();
    const now = Date.now();

    if (requestedEnd <= requestedStart) {
      showMessage('⚠️ End time must be after start time.', 'error');
      isProcessing.value = false;
      return;
    }

    if (requestedStart < now) {
      showMessage('⏳ You cannot check availability for past times.', 'error');
      isProcessing.value = false;
      return;
    }

    const dayBookings = bookings.value
      .filter(b => b.date === parsed.date)
      .map(b => ({
        start: new Date(`${b.date}T${b.start}`).getTime(),
        end: new Date(`${b.date}T${b.end}`).getTime(),
        purpose: b.purpose
      }))
      .sort((a, b) => a.start - b.start);

    const conflicts = dayBookings.filter(b =>
      requestedStart < b.end + bufferMs && requestedEnd > b.start - bufferMs
    );

    if (conflicts.length > 0) {
      const details = conflicts
        .map(b => `• ${formatTime(b.start)} – ${formatTime(b.end)}<br><i>${b.purpose}</i>`)
        .join('<br><br>');

      // ✅ Suggest next available slot after requestedEnd
      let nextSlotStart = requestedEnd;
      let nextSlotEnd = nextSlotStart + slotDuration;

      while (dayBookings.some(b => nextSlotStart < b.end + bufferMs && nextSlotEnd > b.start - bufferMs)) {
        nextSlotStart = nextSlotEnd;
        nextSlotEnd = nextSlotStart + slotDuration;
      }

      const nextSlotStr = `${formatTime(nextSlotStart)} – ${formatTime(nextSlotEnd)}`;

      Swal.fire({
        icon: 'error',
        title: 'Time Conflict!',
        html: `
          <div style="text-align: left; font-size: 14px;">
            That time overlaps with existing bookings:<br><br>
            ${details}
            <br><br>
            👉 <b>Next available slot:</b><br>${nextSlotStr}
          </div>
        `,
        confirmButtonText: 'OK',
        width: '34em'
      });
    } else {
      showMessage('✅ That time is available!', 'success');
    }

  } catch (error) {
    console.error('AI Availability Check error:', error);
    showMessage('❌ Failed to check availability. Please try again.', 'error');
  } finally {
    isProcessing.value = false;
  }
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};





const handleAIBooking = async () => {
  if (!bookingText.value.trim()) return;

  isProcessing.value = true;
  try {
    const parsed: ParsedBookingData = await extractBookingInfo(bookingText.value);

    const bufferMs = 60 * 1000;
    const slotDuration = 30 * 60 * 1000;

    const requestedStart = new Date(`${parsed.date}T${parsed.start_time}`).getTime();
    const requestedEnd = new Date(`${parsed.date}T${parsed.end_time}`).getTime();
    const now = Date.now();

    if (requestedEnd <= requestedStart) {
      showMessage('⚠️ End time must be after start time.', 'error');
      isProcessing.value = false;
      return;
    }

    if (requestedStart < now) {
      showMessage('⏳ Cannot book past time.', 'error');
      isProcessing.value = false;
      return;
    }

    const dayBookings = bookings.value
      .filter(b => b.date === parsed.date)
      .map(b => ({
        start: new Date(`${b.date}T${b.start}`).getTime(),
        end: new Date(`${b.date}T${b.end}`).getTime(),
        purpose: b.purpose
      }))
      .sort((a, b) => a.start - b.start);

    const conflicts = dayBookings.filter(b =>
      requestedStart < b.end + bufferMs && requestedEnd > b.start - bufferMs
    );

    if (conflicts.length > 0) {
      const details = conflicts
        .map(b => `• ${formatTime(b.start)} – ${formatTime(b.end)}<br><i>${b.purpose}</i>`)
        .join('<br><br>');

      let nextSlotStart = requestedEnd;
      let nextSlotEnd = nextSlotStart + slotDuration;

      while (dayBookings.some(b => nextSlotStart < b.end + bufferMs && nextSlotEnd > b.start - bufferMs)) {
        nextSlotStart = nextSlotEnd;
        nextSlotEnd = nextSlotStart + slotDuration;
      }

      const nextSlotStr = `${formatTime(nextSlotStart)} – ${formatTime(nextSlotEnd)}`;

      Swal.fire({
        icon: 'error',
        title: 'Time Conflict!',
        html: `
          <div style="text-align: left; font-size: 14px;">
            That time overlaps with existing bookings:<br><br>
            ${details}
            <br><br>
            👉 <b>Next available slot:</b><br>${nextSlotStr}
          </div>
        `,
        confirmButtonText: 'OK',
        width: '34em'
      });

      isProcessing.value = false;
      return;
    }

    const booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'> = {
      date: parsed.date,
      start: parsed.start_time,
      end: parsed.end_time,
      purpose: bookingText.value,
      status: 'published'
    };

    await createBooking(booking);
    showMessage('✅ Booking created successfully using AI!', 'success');
    bookingText.value = '';
    await loadBookings();
  } catch (error) {
    console.error('AI Booking error:', error);
    showMessage('❌ Failed to create booking.', 'error');
  } finally {
    isProcessing.value = false;
  }
};



const handleManualBooking = async () => {
  isProcessing.value = true;
  try {
    const bufferMs = 60 * 1000;
    const slotDuration = 30 * 60 * 1000;

    const requestedStart = new Date(`${manualBooking.value.date}T${manualBooking.value.start}`).getTime();
    const requestedEnd = new Date(`${manualBooking.value.date}T${manualBooking.value.end}`).getTime();
    const now = Date.now();

    if (requestedEnd <= requestedStart) {
      showMessage('⚠️ End time must be after start time.', 'error');
      isProcessing.value = false;
      return;
    }

    if (requestedStart < now) {
      showMessage('⏳ Cannot book past time.', 'error');
      isProcessing.value = false;
      return;
    }

    const dayBookings = bookings.value
      .filter(b => b.date === manualBooking.value.date)
      .map(b => ({
        start: new Date(`${b.date}T${b.start}`).getTime(),
        end: new Date(`${b.date}T${b.end}`).getTime(),
        purpose: b.purpose
      }))
      .sort((a, b) => a.start - b.start);

    const conflicts = dayBookings.filter(b =>
      requestedStart < b.end + bufferMs && requestedEnd > b.start - bufferMs
    );

    if (conflicts.length > 0) {
      const details = conflicts
        .map(b => `• ${formatTime(b.start)} – ${formatTime(b.end)}<br><i>${b.purpose}</i>`)
        .join('<br><br>');

      let nextSlotStart = requestedEnd;
      let nextSlotEnd = nextSlotStart + slotDuration;

      while (dayBookings.some(b => nextSlotStart < b.end + bufferMs && nextSlotEnd > b.start - bufferMs)) {
        nextSlotStart = nextSlotEnd;
        nextSlotEnd = nextSlotStart + slotDuration;
      }

      const nextSlotStr = `${formatTime(nextSlotStart)} – ${formatTime(nextSlotEnd)}`;

      Swal.fire({
        icon: 'error',
        title: 'Time Conflict!',
        html: `
          <div style="text-align: left; font-size: 14px;">
            That time overlaps with existing bookings:<br><br>
            ${details}
            <br><br>
            👉 <b>Next available slot:</b><br>${nextSlotStr}
          </div>
        `,
        confirmButtonText: 'OK',
        width: '34em'
      });

      isProcessing.value = false;
      return;
    }

    const booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'> = {
      ...manualBooking.value,
      status: 'published'
    };

    await createBooking(booking);
    showMessage('✅ Booking created successfully!', 'success');
    manualBooking.value = { date: '', start: '', end: '', purpose: '' };
    showManualModal.value = false;
    await loadBookings();
  } catch (error) {
    console.error('Manual booking error:', error);
    showMessage('❌ Failed to create booking.', 'error');
  } finally {
    isProcessing.value = false;
  }
};



const loadBookings = async () => {
  loading.value = true
  try {
    bookings.value = await getBookings()
  } catch (error) {
    console.error('Error loading bookings:', error)
    showMessage('Failed to load bookings.', 'error')
  } finally {
    loading.value = false
  }
}

// const editBookingFromEvent = (booking: Booking) => {
//   manualBooking.value = {
//     date: booking.date,
//     start: booking.start,
//     end: booking.end,
//     purpose: booking.purpose
//   }

//   selectedEvent.value = null
//   showManualModal.value = true
// }

const confirmDeleteBookingFromEvent = async (booking: Booking) => {
  if (!booking.id) return

  if (confirm(`Are you sure you want to delete the booking "${booking.purpose}"?`)) {
    try {
      await deleteBooking(booking.id)
      showMessage('Booking deleted successfully!', 'success')
      selectedEvent.value = null
      await loadBookings()
    } catch (error) {
      console.error('Delete booking error:', error)
      showMessage('Failed to delete booking.', 'error')
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

const getStatusClass = (status: string) => {
  switch (status) {
    case 'published':
      return 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs'
    case 'draft':
      return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs'
    case 'cancelled':
      return 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs'
    default:
      return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs'
  }
}
const getEnhancedStatusClass = (status: string) => {
  const baseClasses = 'px-3 py-2 rounded-full text-sm font-medium border'
  switch (status) {
    case 'published':
      return `${baseClasses} text-green-700 bg-green-50 border-green-200 shadow-sm`
    case 'draft':
      return `${baseClasses} text-amber-700 bg-amber-50 border-amber-200 shadow-sm`
    case 'cancelled':
      return `${baseClasses} text-red-700 bg-red-50 border-red-200 shadow-sm`
    default:
      return `${baseClasses} text-gray-700 bg-gray-50 border-gray-200 shadow-sm`
  }
}

const getStatusDotClass = (status: string) => {
  switch (status) {
    case 'published': return 'bg-green-500'
    case 'draft': return 'bg-amber-500'
    case 'cancelled': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

// ===================edit booking modal ===================

const showEditModal = ref(false)
const editBooking = ref({
  id: '',
  date: '',
  start: '',
  end: '',
  purpose: ''
})
const updateBookingData = async () => {
  isProcessing.value = true;
  try {
    const bufferMs = 60 * 1000;
    const slotDuration = 30 * 60 * 1000;

    const requestedStart = new Date(`${editBooking.value.date}T${editBooking.value.start}`).getTime();
    const requestedEnd = new Date(`${editBooking.value.date}T${editBooking.value.end}`).getTime();
    const now = Date.now();

    if (requestedEnd <= requestedStart) {
      showMessage('⚠️ End time must be after start time.', 'error');
      isProcessing.value = false;
      return;
    }

    if (requestedStart < now) {
      showMessage('⏳ Cannot update to a past time.', 'error');
      isProcessing.value = false;
      return;
    }

    const dayBookings = bookings.value
      .filter(b => b.date === editBooking.value.date && b.id !== editBooking.value.id) // Exclude current booking
      .map(b => ({
        start: new Date(`${b.date}T${b.start}`).getTime(),
        end: new Date(`${b.date}T${b.end}`).getTime(),
        purpose: b.purpose
      }))
      .sort((a, b) => a.start - b.start);

    const conflicts = dayBookings.filter(b =>
      requestedStart < b.end + bufferMs && requestedEnd > b.start - bufferMs
    );

    if (conflicts.length > 0) {
      const details = conflicts
        .map(b => `• ${formatTime(b.start)} – ${formatTime(b.end)}<br><i>${b.purpose}</i>`)
        .join('<br><br>');

      let nextSlotStart = requestedEnd;
      let nextSlotEnd = nextSlotStart + slotDuration;

      while (dayBookings.some(b => nextSlotStart < b.end + bufferMs && nextSlotEnd > b.start - bufferMs)) {
        nextSlotStart = nextSlotEnd;
        nextSlotEnd = nextSlotStart + slotDuration;
      }

      const nextSlotStr = `${formatTime(nextSlotStart)} – ${formatTime(nextSlotEnd)}`;

      Swal.fire({
        icon: 'error',
        title: 'Time Conflict!',
        html: `
          <div style="text-align: left; font-size: 14px;">
            That time overlaps with existing bookings:<br><br>
            ${details}
            <br><br>
            👉 <b>Next available slot:</b><br>${nextSlotStr}
          </div>
        `,
        confirmButtonText: 'OK',
        width: '34em'
      });

      isProcessing.value = false;
      return;
    }

    const updatedData = {
      date: editBooking.value.date,
      start: editBooking.value.start,
      end: editBooking.value.end,
      purpose: editBooking.value.purpose,
    };

    await updateBooking(editBooking.value.id, updatedData);
    showMessage('✅ Booking updated successfully!', 'success');
    showEditModal.value = false;
    await loadBookings();
  } catch (error) {
    console.error('Update booking error:', error);
    showMessage('❌ Failed to update booking.', 'error');
  } finally {
    isProcessing.value = false;
  }
};

const editBookingFromEvent = (booking: Booking) => {
  editBooking.value = {
    id: booking.id!,
    date: booking.date,
    start: booking.start,
    end: booking.end,
    purpose: booking.purpose
  }
  selectedEvent.value = null
  showEditModal.value = true
}
// ====================end edit booking modal ===================

// ==================== function ask ai for help ===================
const showBookingHelp = () => {
  Swal.fire({
    icon: 'info',
    title: '🤖 How to Use Booking System',
    html: `
      <div style="text-align: left; font-size: 15px; line-height: 1.6;">
        <b>🔍 Check Availability</b><br>
        Ask something like:<br>
        <code>"Is the room free on June 1st from 10am to 11am?"</code><br><br>

        <b>📅 Book with AI</b><br>
        Just type:<br>
        <code>"Book a room on Monday from 2pm to 4pm for team meeting"</code><br><br>

        <b>📝 Manual Booking</b><br>
        Click "Booking Manual" to enter details yourself.<br><br>

        ⚠️ The system will help avoid overlaps and suggest the next available time slot if your request conflicts with existing bookings.
      </div>
    `,
    confirmButtonText: 'Got it!',
    width: '34em'
  });
};

// =====================end function ask ai for help ===================
// Initialize
onMounted(() => {
  loadBookings()
})
definePageMeta({
  middleware: 'auth',
});
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

.swal2-footer-text-left {
  white-space: pre-wrap;
  text-align: left;
  font-family: monospace;
}
</style>