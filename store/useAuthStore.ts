// store/useAuthStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: Role;
  password: string;
  avatar: string;
  cart?: any;
  address?: any;
  department?: Department;
  signature: string;
  title: string;
};

type Department = {
  text: string;
  value: string;
  id: string;
  title: string;
};

type Role = {
  id: string;
  name: string;
};

type Credentials = {
  email: string;
  password: string;
};

type TokenData = {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix timestamp
};

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const isLoading = ref<boolean>(false);
  const refreshPromise = ref<Promise<boolean> | null>(null);

  // Token expiry helpers
  const TOKEN_EXPIRY_DAYS = 1;
  const getTokenExpiryTime = () => Date.now() + (TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  
  const isTokenExpired = (): boolean => {
    const expiryTime = localStorage.getItem('token_expires_at');
    if (!expiryTime) return true;
    return Date.now() > parseInt(expiryTime);
  };

  const setTokenData = (tokenData: TokenData) => {
    accessToken.value = tokenData.access_token;
    localStorage.setItem('refresh_token', tokenData.refresh_token);
    localStorage.setItem('token_expires_at', tokenData.expires_at.toString());
  };

  const clearTokenData = () => {
    accessToken.value = null;
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
  };

  async function logout() {
    try {
      await useApi('/auth/logout', {
        method: 'POST',
        data: {
          refresh_token: localStorage.getItem('refresh_token'),
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      user.value = null;
      clearTokenData();
      refreshPromise.value = null;
      return navigateTo('/auth');
    }
  }

  async function refresh(): Promise<boolean> {
    // Prevent multiple simultaneous refresh attempts
    if (refreshPromise.value) {
      return refreshPromise.value;
    }

    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      return false;
    }

    // Check if token is expired
    if (isTokenExpired()) {
      console.log('Refresh token expired, redirecting to login');
      clearTokenData();
      await navigateTo('/auth');
      return false;
    }

    refreshPromise.value = (async () => {
      try {
        const refresh_data = await useApi<{ data: TokenData }>('/auth/refresh', {
          method: 'POST',
          headers: { Authorization: '' },
          data: { refresh_token: refreshToken },
        });

        // Set new expiry time (1 day from now)
        const tokenData: TokenData = {
          ...refresh_data.data,
          expires_at: getTokenExpiryTime()
        };

        setTokenData(tokenData);
        
        if (!user.value) {
          await fetchUser();
        }
        
        return true;
      } catch (error) {
        console.error('Token refresh error:', error);
        clearTokenData();
        user.value = null;
        await navigateTo('/auth');
        return false;
      } finally {
        refreshPromise.value = null;
      }
    })();

    return refreshPromise.value;
  }

  async function login(credentials: Credentials) {
    isLoading.value = true;
    try {
      const login = await useApi<{ data: TokenData }>('/auth/login', {
        method: 'POST',
        data: credentials,
      });

      // Set token with expiry time
      const tokenData: TokenData = {
        ...login.data,
        expires_at: getTokenExpiryTime()
      };

      setTokenData(tokenData);
      await fetchUser();
      
      return navigateTo('/');
    } catch (error) {
      return Promise.reject(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUser() {
    try {
      const response = await useApi<{ data: User[] }>(
        `/users?filter[id]=$CURRENT_USER&fields=id,first_name,last_name,email,avatar,role.id,role.name,signature,title,department.id,department.title`,
        {
          method: 'GET',
        }
      );
  
      const currentUser = response.data[0];
      if (currentUser) {
        user.value = currentUser;
        return currentUser;
      } else {
        throw new Error('User not found in response');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async function updateUserProfile(
    updateData: Partial<User>,
    avatarFile?: File,
    signatureFile?: File
  ) {
    if (!user.value) {
      throw new Error('User is not authenticated');
    }

    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);

        const fileRes: any = await useApi('/files', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: formData,
        });

        updateData.avatar = fileRes.data.id;
      }

      if (signatureFile) {
        const signatureForm = new FormData();
        signatureForm.append('file', signatureFile);
      
        const signatureRes = await useApi<{ data: { id: string } }>('/files', {
          method: 'POST',
          headers: {},
          data: signatureForm,
        });
      
        updateData.signature = signatureRes.data.id;
      }
      
      await useApi(`/users/${user.value.id}`, {
        method: 'PATCH',
        data: updateData,
      });
      
      await fetchUser();
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }
  
  async function checkAuth(): Promise<boolean> {
    const hasToken = !!localStorage.getItem('refresh_token');
    
    if (!hasToken) {
      return false;
    }

    // Check if token is expired
    if (isTokenExpired()) {
      console.log('Token expired, clearing auth data');
      clearTokenData();
      return false;
    }

    // If we have a valid token but no access token, refresh it
    if (!accessToken.value) {
      return await refresh();
    }

    // If we don't have user data, fetch it
    if (!user.value) {
      await fetchUser();
    }

    return true;
  }

  // Method to check if we need to refresh token soon (e.g., within 1 hour)
  const shouldRefreshToken = (): boolean => {
    const expiryTime = localStorage.getItem('token_expires_at');
    if (!expiryTime) return false;
    
    const oneHourFromNow = Date.now() + (60 * 60 * 1000);
    return parseInt(expiryTime) < oneHourFromNow;
  };

  return {
    user,
    accessToken,
    isLoading,
    login,
    logout,
    refresh,
    fetchUser,
    checkAuth,
    updateUserProfile,
    isTokenExpired,
    shouldRefreshToken,
  };
});