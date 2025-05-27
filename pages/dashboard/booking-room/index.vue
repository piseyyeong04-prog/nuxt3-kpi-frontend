<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="relative">
     <div class="absolute inset-0 z-10 backdrop-blur-sm bg-white/30 dark:bg-gray-900/50 flex items-center justify-center rounded-lg">
        <div class="text-center p-8 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-xl transform transition-all duration-500 hover:scale-105 border-2 border-red-500 dark:border-red-400">
          <Icon icon="mdi:clock-time-four-outline" class="text-6xl text-red-500 mb-4 animate-pulse" />
          <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-3">Coming Soon!</h2>
          <p class="text-xl text-gray-700 dark:text-gray-300">This feature will be available soon</p>
          <div class="mt-6">
            <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
              <Icon icon="mdi:bell" class="inline-block mr-2" />
              Come Back Later
            </button>
          </div>
        </div>     
      </div>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="px-6 py-4 bg-blue-600">
          <h1 class="text-2xl font-bold text-white">AI Room Booking System</h1>
          <p class="text-blue-100 mt-1">Book rooms using natural language</p>
        </div>

        <!-- AI Booking Form -->
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Natural Language Booking</h2>
          <form @submit.prevent="handleAIBooking" class="space-y-4">
            <div>
              <label for="booking-text" class="block text-sm font-medium text-gray-700 mb-2">
                Describe your booking
              </label>
              <textarea
                id="booking-text"
                v-model="bookingText"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="e.g., 'Book meeting room for tomorrow from 2 PM to 4 PM for team standup'"
                required
              ></textarea>
            </div>
            <div class="flex space-x-3">
              <button
                type="submit"
                :disabled="isProcessing"
                class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                <span v-if="!isProcessing">📅 Book with AI</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Manual Booking Form -->
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Manual Booking</h2>
          <form @submit.prevent="handleManualBooking" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                id="date"
                v-model="manualBooking.date_created"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label for="purpose" class="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
              <input
                type="text"
                id="purpose"
                v-model="manualBooking.purpose"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Meeting purpose"
                required
              />
            </div>
            <div>
              <label for="start-time" class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                id="start-time"
                v-model="manualBooking.start"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />  
            </div>
            <div>
              <label for="end-time" class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                id="end-time"
                v-model="manualBooking.end"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div class="md:col-span-2">
              <button
                type="submit"
                :disabled="isProcessing"
                class="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                📋 Create Booking
              </button>
            </div>
          </form>
        </div>

        <!-- Bookings List -->
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Current Bookings</h2>
            <button
              @click="loadBookings"
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              🔄 Refresh
            </button>
          </div>

          <div v-if="loading" class="text-center py-8">
            <div class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading bookings...
            </div>
          </div>

          <div v-else-if="bookings.length === 0" class="text-center py-8 text-gray-500">
            No bookings found. Create your first booking above!
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="booking in bookings"
              :key="booking.id"
              class="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">{{ booking.purpose }}</h3>
                  <div class="mt-2 text-sm text-gray-600 space-y-1">
                    <p>📅 <strong>Date:</strong> {{ formatDate(booking.date) }}</p>
                    <p>🕐 <strong>Time:</strong> {{ booking.start }} - {{ booking.end }}</p>
                    <p>📊 <strong>Status:</strong> 
                      <span :class="getStatusClass(booking.status)">
                        {{ booking.status }}
                      </span>
                    </p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="editBooking(booking)"
                    class="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit booking"
                  >
                    ✏️
                  </button>
                  <button
                    @click="confirmDeleteBooking(booking)"
                    class="text-red-600 hover:text-red-800 p-1"
                    title="Delete booking"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div
        v-if="message"
        :class="messageClass"
        class="mt-4 p-4 rounded-md"
      >
        {{ message }}
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Booking, ParsedBookingData } from '~/types/booking';

const { extractBookingInfo } = useGeminiAI();
const { createBooking, getBookings, updateBooking, deleteBooking } = useBooking();

// Reactive state
const bookingText = ref('');
const bookings = ref<Booking[]>([]);
const loading = ref(false);
const isProcessing = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

const manualBooking = ref({
  date_created: '',
  start: '',
  end: '',
  purpose: ''
});

// Computed
const messageClass = computed(() => ({
  'bg-green-100 border border-green-400 text-green-700': messageType.value === 'success',
  'bg-red-100 border border-red-400 text-red-700': messageType.value === 'error'
}));

// Methods
const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 5000);
};

const handleAIBooking = async () => {
  if (!bookingText.value.trim()) return;

  isProcessing.value = true;
  try {
    // Extract booking information using Gemini AI
    const parsed: ParsedBookingData = await extractBookingInfo(bookingText.value);
    
    // Create booking
    const booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'> = {
      date: parsed.date,
      start: parsed.start_time,
      end: parsed.end_time,
      purpose: bookingText.value,
      status: 'published'
    };

    await createBooking(booking);
    
    showMessage('Booking created successfully using AI!', 'success');
    bookingText.value = '';
    await loadBookings();
  } catch (error) {
    console.error('AI Booking error:', error);
    showMessage('Failed to create booking. Please try again or use manual booking.', 'error');
  } finally {
    isProcessing.value = false;
  }
};

const handleManualBooking = async () => {
  isProcessing.value = true;
  try {
    const booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'> = {
      ...manualBooking.value,
      status: 'published',
      date: ''
    };

    await createBooking(booking);
    
    showMessage('Booking created successfully!', 'success');
    manualBooking.value = { date_created: '', start: '', end: '', purpose: '' };
    await loadBookings();
  } catch (error) {
    console.error('Manual booking error:', error);
    showMessage('Failed to create booking. Please try again.', 'error');
  } finally {
    isProcessing.value = false;
  }
};

const loadBookings = async () => {
  loading.value = true;
  try {
    bookings.value = await getBookings();
  } catch (error) {
    console.error('Error loading bookings:', error);
    showMessage('Failed to load bookings.', 'error');
  } finally {
    loading.value = false;
  }
};

const editBooking = (booking: Booking) => {
  // Simple edit - populate manual form
  manualBooking.value = {
    date_created: booking.date,
    start: booking.start,
    end: booking.end,
    purpose: booking.purpose
  };
  
  // Scroll to form
  const formElement = document.querySelector('form');
  formElement?.scrollIntoView({ behavior: 'smooth' });
};

const confirmDeleteBooking = async (booking: Booking) => {
  if (!booking.id) return;
  
  if (confirm(`Are you sure you want to delete the booking "${booking.purpose}"?`)) {
    try {
      await deleteBooking(booking.id);
      showMessage('Booking deleted successfully!', 'success');
      await loadBookings();
    } catch (error) {
      console.error('Delete booking error:', error);
      showMessage('Failed to delete booking.', 'error');
    }
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'published':
      return 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs';
    case 'draft':
      return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs';
    case 'cancelled':
      return 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs';
    default:
      return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs';
  }
};

// Initialize
onMounted(() => {
  loadBookings();
});
</script>