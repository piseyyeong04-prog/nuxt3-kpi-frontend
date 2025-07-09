import { ref } from 'vue';
import type { Ref } from 'vue';
import type { FacebookVideoData } from '~/types/facebook';

export function useFacebookVideo() {
  const videoData: Ref<FacebookVideoData | null> = ref(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Fetch Facebook video data from a selected page
   * @param videoId - Facebook video ID
   * @param page - Page code (TC | BC | HC)
   */
  const fetchVideoData = async (videoId: string, page: 'TC' | 'BC' | 'HC' = 'TC') => {
    if (!videoId) {
      error.value = 'Video ID is required';
      return;
    }

    loading.value = true;
    error.value = null;
    videoData.value = null;

    try {
      const response = await $fetch(`/api/facebook`, {
        params: { videoId, page }
      });
      videoData.value = response as FacebookVideoData;
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to fetch video data';
      console.error('Error fetching Facebook video data:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    videoData,
    loading,
    error,
    fetchVideoData
  };
}
