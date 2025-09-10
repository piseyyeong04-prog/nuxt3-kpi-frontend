// composables/useApi.ts
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '~/store/useAuthStore';
import type { IAPIOption } from '~/types/api';

export const useApi = async <T>(endpoint: string, options: IAPIOption): Promise<T> => {
  const baseUrl = useRuntimeConfig().public.API_BASE_URL;
  const authStore = useAuthStore();

  // Helper function to make the actual API call
  const makeRequest = async (token?: string): Promise<T> => {
    const headers = {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const response = await axios<T>(baseUrl + endpoint, {
        ...options,
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // First attempt with current token
  try {
    const token = authStore.accessToken;
    return await makeRequest(token || undefined);
  } catch (error) {
    const axiosError = error as AxiosError;
    
    // If it's a 401 unauthorized error and we have a refresh token, try to refresh
    if (axiosError.response?.status === 401 && localStorage.getItem('refresh_token')) {
      try {
        console.log('Access token expired, attempting to refresh...');
        const refreshSuccess = await authStore.refresh();
        
        if (refreshSuccess) {
          // Retry the request with the new token
          const newToken = authStore.accessToken;
          return await makeRequest(newToken || undefined);
        } else {
          // Refresh failed, redirect to login
          console.log('Token refresh failed, redirecting to login');
          await navigateTo('/auth');
          throw new Error('Authentication failed');
        }
      } catch (refreshError) {
        console.error('Error during token refresh:', refreshError);
        await navigateTo('/auth');
        throw refreshError;
      }
    }
    
    // For other errors or if we don't have a refresh token, just throw the original error
    throw error;
  }
};

// Optional: Create a separate composable for public API calls that don't need auth
export const usePublicApi = async <T>(endpoint: string, options: IAPIOption): Promise<T> => {
  const baseUrl = useRuntimeConfig().public.API_BASE_URL;

  try {
    const response = await axios<T>(baseUrl + endpoint, options);
    return response.data;
  } catch (error) {
    throw error;
  }
};