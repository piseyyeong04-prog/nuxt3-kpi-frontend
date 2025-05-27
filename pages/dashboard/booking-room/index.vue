<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="relative">
      <!-- Blur Overlay -->
      <div class="absolute inset-0 z-10 backdrop-blur-sm bg-white/30 dark:bg-gray-900/50 flex  justify-center rounded-lg">
        <div class="text-center  h-96 p-8 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-xl transform transition-all duration-500 hover:scale-105 border-2 border-red-500 dark:border-red-400">
          <Icon icon="mdi:clock-time-four-outline" class="text-6xl text-red-500 mb-4 animate-pulse" />
          <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-3">Coming Soon!</h2>
          <p class="text-xl text-gray-700 dark:text-gray-300">This feature AI Booking Room will be available soon</p>
          <div class="mt-6">
            <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
              <Icon icon="mdi:bell" class="inline-block mr-2" />
              Come Back Later
            </button>
          </div>
        </div>     
      </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="px-6 py-4 bg-blue-600 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white">AI Room Booking System</h1>
          <p class="text-blue-100 mt-1">Book rooms using natural language</p>
          </div>
          <div class=" ">
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
            </div>
          </form>
        </div>

        <!-- Manual Booking Form -->
        <!-- <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Manual Booking</h2>
          <form @submit.prevent="handleManualBooking" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" id="date" v-model="manualBooking.date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required />
            </div>
            <div>
              <label for="purpose" class="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
              <input type="text" id="purpose" v-model="manualBooking.purpose"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Meeting purpose" required />
            </div>
            <div>
              <label for="start-time" class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input type="time" id="start-time" v-model="manualBooking.start"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required />
            </div>
            <div>
              <label for="end-time" class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input type="time" id="end-time" v-model="manualBooking.end"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required />
            </div>
            <div class="md:col-span-2">
              <button type="submit" :disabled="isProcessing"
                class="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
                📋 Create Booking
              </button>
            </div>
          </form>
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

      <!-- Success/Error Messages -->
      <div v-if="message" :class="messageClass" class="mt-4 p-4 rounded-md">
        {{ message }}
      </div>

      <!-- Event Details Modal -->
      <div v-if="selectedEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Booking Details</h3>
            <button @click="selectedEvent = null" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700">Purpose</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedEvent.title }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Date</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedEvent.extendedProps.booking.date) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Time</label>
              <p class="mt-1 text-sm text-gray-900">
                {{ selectedEvent.extendedProps.booking.start }} - {{ selectedEvent.extendedProps.booking.end }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <span :class="getStatusClass(selectedEvent.extendedProps.booking.status)">
                {{ selectedEvent.extendedProps.booking.status }}
              </span>
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
<div v-if="showManualModal" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
  <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
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
</div>

</template>

<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions, EventClickArg, DateSelectArg } from '@fullcalendar/core'
import type { Booking, ParsedBookingData } from '~/types/booking'

const { extractBookingInfo } = useGeminiAI()
const { createBooking, getBookings, updateBooking, deleteBooking } = useBooking()

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

const manualBooking = ref({
  date: '',
  start: '',
  end: '',
  purpose: ''
})
const handleEventClick = (clickInfo: EventClickArg) => {
  selectedEvent.value = clickInfo.event
}
const showManualModal = ref(false)

const handleDateSelect = (selectInfo: DateSelectArg) => {
  // Auto-fill manual booking form with selected date
  manualBooking.value.date = selectInfo.startStr

  // Scroll to manual booking form
  const formElement = document.querySelector('#date')
  formElement?.scrollIntoView({ behavior: 'smooth' })
}
// Calendar configuration
const calendarOptions = ref<CalendarOptions>({
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
  events: [],
  eventClick: handleEventClick,
  select: handleDateSelect,
  eventDidMount: (info) => {
    // Add custom styling based on booking status
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
})

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

// Methods
const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

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

const updateCalendarEvents = () => {
  if (fullCalendar.value) {
    const calendarApi = fullCalendar.value.getApi()
    calendarApi.removeAllEvents()
    calendarApi.addEventSource(calendarEvents.value)
  }
}

const changeView = (viewName: string) => {
  currentView.value = viewName
  if (fullCalendar.value) {
    const calendarApi = fullCalendar.value.getApi()
    calendarApi.changeView(viewName)
  }
}



const handleAIBooking = async () => {
  if (!bookingText.value.trim()) return

  isProcessing.value = true
  try {
    const parsed: ParsedBookingData = await extractBookingInfo(bookingText.value)

    const booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'> = {
      date: parsed.date,
      start: parsed.start_time,
      end: parsed.end_time,
      purpose: bookingText.value,
      status: 'published'
    }

    await createBooking(booking)

    showMessage('Booking created successfully using AI!', 'success')
    bookingText.value = ''
    await loadBookings()
  } catch (error) {
    console.error('AI Booking error:', error)
    showMessage('Failed to create booking. Please try again or use manual booking.', 'error')
  } finally {
    isProcessing.value = false
  }
}

const handleManualBooking = async () => {
  isProcessing.value = true
  try {
    const booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'> = {
      ...manualBooking.value,
      status: 'published'
    }

    await createBooking(booking)

    showMessage('Booking created successfully!', 'success')
    manualBooking.value = { date: '', start: '', end: '', purpose: '' }
    await loadBookings()
  } catch (error) {
    console.error('Manual booking error:', error)
    showMessage('Failed to create booking. Please try again.', 'error')
  } finally {
    isProcessing.value = false
  }
}

const loadBookings = async () => {
  loading.value = true
  try {
    bookings.value = await getBookings()
    updateCalendarEvents()
  } catch (error) {
    console.error('Error loading bookings:', error)
    showMessage('Failed to load bookings.', 'error')
  } finally {
    loading.value = false
  }
}

const editBookingFromEvent = (booking: Booking) => {
  manualBooking.value = {
    date: booking.date,
    start: booking.start,
    end: booking.end,
    purpose: booking.purpose
  }

  selectedEvent.value = null

  // Scroll to form
  const formElement = document.querySelector('#date')
  formElement?.scrollIntoView({ behavior: 'smooth' })
}

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

const editBooking = (booking: Booking) => {
  manualBooking.value = {
    date: booking.date,
    start: booking.start,
    end: booking.end,
    purpose: booking.purpose
  }

  const formElement = document.querySelector('#date')
  formElement?.scrollIntoView({ behavior: 'smooth' })
}

const confirmDeleteBooking = async (booking: Booking) => {
  if (!booking.id) return

  if (confirm(`Are you sure you want to delete the booking "${booking.purpose}"?`)) {
    try {
      await deleteBooking(booking.id)
      showMessage('Booking deleted successfully!', 'success')
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

// Watchers
watch(calendarEvents, () => {
  updateCalendarEvents()
}, { deep: true })

// Initialize
onMounted(() => {
  loadBookings()
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
</style>