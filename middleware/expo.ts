// middleware/expo.ts
import { useAuthStore } from "~/store/useAuthStore";

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server-side to prevent hydration issues
  if (process.server) return;
  
  const auth = useAuthStore();
  
  // Check if user is authenticated
  if (!auth.user) {
    return navigateTo('/login');
  }

  // Define role IDs
  const expoManagerId = "2305032d-25f1-47bd-a12c-a50b593bb708";
  
  // Check if user is Expo Manager
  const isExpoManager = auth.user.role.id === expoManagerId;
  
  // If user is Expo Manager
  if (isExpoManager) {
    // Only allow access to booking-room pages
    if (!to.path.includes('/dashboard/booking-room')) {
      return navigateTo('/access-denied');
    }
  }
  
  // Everyone else (Admin, HR, other roles) can access all pages
});