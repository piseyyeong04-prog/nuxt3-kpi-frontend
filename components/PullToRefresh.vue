<!-- components/PullToRefresh.vue -->
<template>
  <div class="pull-to-refresh-container">
    <!-- Refresh Indicator -->
    <div 
      class="refresh-indicator"
      :class="{
        'refresh-indicator--visible': pullDistance > 0,
        'refresh-indicator--active': pullDistance >= 80,
        'refresh-indicator--refreshing': isRefreshing
      }"
      :style="{ transform: `translateY(${Math.min(pullDistance, 100)}px)` }"
    >
      <div class="refresh-content">
        <!-- Loading Spinner -->
        <div 
          v-if="isRefreshing" 
          class="refresh-spinner"
        >
          <svg class="animate-spin h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <!-- Pull Down Arrow -->
        <div 
          v-else
          class="refresh-arrow"
          :class="{ 'refresh-arrow--flip': pullDistance >= 80 }"
        >
          <svg class="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
        
        <!-- Text Indicator -->
        <div class="refresh-text">
          <span v-if="isRefreshing" class="text-emerald-600 font-medium">
            Refreshing...
          </span>
          <span v-else-if="pullDistance >= 80" class="text-emerald-600 font-medium">
            Release to refresh
          </span>
          <span v-else-if="pullDistance > 0" class="text-gray-600">
            Pull down to refresh
          </span>
        </div>
      </div>
    </div>

    <!-- Content Slot -->
    <div class="content-wrapper" ref="contentRef">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePullToRefresh } from '~/composables/usePullToRefresh'

// Props
const props = defineProps({
  onRefresh: {
    type: Function,
    required: true
  },
  threshold: {
    type: Number,
    default: 80
  }
})

// Emit events
const emit = defineEmits(['refresh-start', 'refresh-end'])

// Refs
const contentRef = ref(null)

// Pull to refresh logic
const { isRefreshing, pullDistance, isPulling, init } = usePullToRefresh(
  async () => {
    emit('refresh-start')
    try {
      await props.onRefresh()
    } finally {
      emit('refresh-end')
    }
  },
  {
    threshold: props.threshold,
    resistance: 2.5,
    snapBackDuration: 300,
    refreshIndicatorHeight: 60
  }
)

// Initialize when component mounts
onMounted(() => {
  if (contentRef.value) {
    init(contentRef.value)
  }
})
</script>

<style scoped>
.pull-to-refresh-container {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.refresh-indicator {
  position: fixed;
  top: -80px;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.9));
  backdrop-filter: blur(10px);
  z-index: 1000;
  transition: opacity 0.2s ease;
  opacity: 0;
}

.refresh-indicator--visible {
  opacity: 1;
}

.refresh-indicator--active {
  background: linear-gradient(to bottom, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
}

.refresh-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.refresh-arrow {
  transition: transform 0.2s ease;
}

.refresh-arrow--flip {
  transform: rotate(180deg);
}

.refresh-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-text {
  font-size: 0.875rem;
  text-align: center;
}

.content-wrapper {
  min-height: 100vh;
  transform: translateY(0);
  transition: none;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .refresh-indicator {
    background: linear-gradient(to bottom, rgba(31, 41, 55, 0.95), rgba(31, 41, 55, 0.9));
  }
  
  .refresh-indicator--active {
    background: linear-gradient(to bottom, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.1));
  }
}
</style>