// composables/useFacebookEngagement.ts
import { ref } from 'vue';
import type { FacebookEngagementData, FacebookEngagementResult } from '~/types/facebook';

/**
 * Extracts the Facebook object ID (fbid) from various photo/post URL formats
 */
export const extractFacebookObjectId = (url: string): string => {
  const trimmed = url.trim();

  // Direct numeric ID
  if (/^\d+$/.test(trimmed)) return trimmed;

  // photo.php?fbid=XXXX
  const fbidMatch = trimmed.match(/[?&]fbid=(\d+)/);
  if (fbidMatch) return fbidMatch[1];

  // /photo/?fbid=XXXX
  const photoFbidMatch = trimmed.match(/\/photo\/\?fbid=(\d+)/);
  if (photoFbidMatch) return photoFbidMatch[1];

  // /posts/XXXX
  const postMatch = trimmed.match(/\/posts\/(\d+)/);
  if (postMatch) return postMatch[1];

  // story.php?story_fbid=XXXX
  const storyMatch = trimmed.match(/story_fbid=(\d+)/);
  if (storyMatch) return storyMatch[1];

  // facebook.com/watch?v=XXXX (videos)
  const watchMatch = trimmed.match(/watch\?v=(\d+)/);
  if (watchMatch) return watchMatch[1];

  // /videos/XXXX
  const videoMatch = trimmed.match(/\/videos\/(\d+)/);
  if (videoMatch) return videoMatch[1];

  // pfbid format (encoded post IDs) — can't decode client-side, skip
  // /{page}/photos/{albumId}/{photoId}
  const albumPhotoMatch = trimmed.match(/\/photos\/[^/]+\/(\d+)/);
  if (albumPhotoMatch) return albumPhotoMatch[1];

  return '';
};

/**
 * Parses a multi-line text input into individual Facebook URLs.
 * Handles numbered lists like "1 https://..." or plain URLs, one per line.
 */
export const parseFacebookUrls = (input: string): string[] => {
  return input
    .split('\n')
    .map(line => {
      // Remove leading numbering like "1", "1.", "1 ", "1\t"
      const cleaned = line.replace(/^\s*\d+[\.\):\s]+/, '').trim();
      return cleaned;
    })
    .filter(line => line.length > 0 && line.includes('facebook.com'));
};

export function useFacebookEngagement() {
  const results = ref<FacebookEngagementResult[]>([]);
  const isLoading = ref(false);
  const progress = ref(0);
  const total = ref(0);

  /**
   * Fetch engagement data for a single Facebook object
   */
  const fetchEngagement = async (
    objectId: string,
    page: 'TC' | 'BC' | 'HC' = 'TC'
  ): Promise<FacebookEngagementData | null> => {
    try {
      const response = await $fetch('/api/facebook-engagement', {
        params: { objectId, page },
      });
      return response as FacebookEngagementData;
    } catch (err: any) {
      throw new Error(err?.data?.message || 'Failed to fetch engagement data');
    }
  };

  /**
   * Batch-fetch engagement for an array of Facebook URLs
   */
  const fetchBulkEngagement = async (
    urls: string[],
    page: 'TC' | 'BC' | 'HC' = 'TC'
  ) => {
    isLoading.value = true;
    progress.value = 0;
    total.value = urls.length;
    results.value = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const objectId = extractFacebookObjectId(url);

      if (!objectId) {
        results.value.push({
          url,
          objectId: '',
          status: 'error',
          error: 'Could not extract a valid Facebook object ID from this URL',
        });
      } else {
        try {
          const data = await fetchEngagement(objectId, page);
          results.value.push({
            url,
            objectId,
            status: 'success',
            data: data!,
          });
        } catch (err: any) {
          results.value.push({
            url,
            objectId,
            status: 'error',
            error: err.message || 'Unknown error',
          });
        }
      }

      progress.value = i + 1;

      // Small delay to avoid rate limiting
      if (i < urls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    isLoading.value = false;
  };

  const reset = () => {
    results.value = [];
    progress.value = 0;
    total.value = 0;
    isLoading.value = false;
  };

  return {
    results,
    isLoading,
    progress,
    total,
    fetchEngagement,
    fetchBulkEngagement,
    reset,
  };
}
