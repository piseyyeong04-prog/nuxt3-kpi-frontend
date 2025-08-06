// composables/usePullToRefresh.js
import { ref, onMounted, onUnmounted } from 'vue'

export const usePullToRefresh = (onRefresh, options = {}) => {
  const isRefreshing = ref(false)
  const pullDistance = ref(0)
  const isPulling = ref(false)
  
  const {
    threshold = 80,
    resistance = 2.5,
    snapBackDuration = 300,
    refreshIndicatorHeight = 60
  } = options

  let startY = 0
  let currentY = 0
  let touchId = null
  let element = null

  const handleTouchStart = (e) => {
    // Only start if we're at the top of the page and not already refreshing
    if (window.scrollY > 0 || isRefreshing.value) return
    
    const touch = e.touches[0]
    startY = touch.clientY
    touchId = touch.identifier
    isPulling.value = true
    
    // Add transition class removal
    if (element) {
      element.style.transition = 'none'
    }
  }

  const handleTouchMove = (e) => {
    if (!isPulling.value || isRefreshing.value) return
    
    // Find the touch that started the gesture
    const touch = Array.from(e.touches).find(t => t.identifier === touchId)
    if (!touch) return

    currentY = touch.clientY
    const deltaY = currentY - startY

    // Only pull down, and only when at top of page
    if (deltaY > 0 && window.scrollY === 0) {
      e.preventDefault()
      
      // Apply resistance to make it feel natural
      const distance = Math.min(deltaY / resistance, threshold * 1.5)
      pullDistance.value = distance
      
      // Update the visual indicator
      if (element) {
        element.style.transform = `translateY(${distance}px)`
      }
    }
  }

  const handleTouchEnd = (e) => {
    if (!isPulling.value) return
    
    isPulling.value = false
    touchId = null
    
    // Add transition back for smooth snap
    if (element) {
      element.style.transition = `transform ${snapBackDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
    }
    
    if (pullDistance.value >= threshold && !isRefreshing.value) {
      // Trigger refresh
      triggerRefresh()
    } else {
      // Snap back to original position
      resetPull()
    }
  }

  const triggerRefresh = async () => {
    isRefreshing.value = true
    
    // Keep the element at the refresh indicator height during refresh
    if (element) {
      element.style.transform = `translateY(${refreshIndicatorHeight}px)`
    }
    
    try {
      await onRefresh()
    } catch (error) {
      console.error('Refresh failed:', error)
    } finally {
      // Wait a bit to show the refresh animation
      setTimeout(() => {
        isRefreshing.value = false
        resetPull()
      }, 500)
    }
  }

  const resetPull = () => {
    pullDistance.value = 0
    
    if (element) {
      element.style.transform = 'translateY(0)'
      
      // Remove transition after animation completes
      setTimeout(() => {
        if (element) {
          element.style.transition = 'none'
        }
      }, snapBackDuration)
    }
  }

  const init = (targetElement) => {
    element = targetElement || document.body
    
    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
  }

  const cleanup = () => {
    if (element) {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }

  onMounted(() => {
    // Auto-initialize with body element
    init()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    isRefreshing,
    pullDistance,
    isPulling,
    init,
    cleanup,
    triggerRefresh
  }
}