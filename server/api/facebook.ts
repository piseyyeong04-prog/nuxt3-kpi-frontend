// server/api/facebook.ts
import { defineEventHandler, getQuery, createError } from 'h3';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  const { videoId, page = 'TC' } = getQuery(event) as { videoId?: string, page?: 'TC' | 'BC' | 'HC' };
  const config = useRuntimeConfig();

  if (!videoId) {
    throw createError({ statusCode: 400, message: 'Video ID is required' });
  }

  const pageConfig = config.facebook?.[page];

  if (!pageConfig?.accessToken) {
    throw createError({
      statusCode: 500,
      message: `Facebook access token not configured for page: ${page}`,
    });
  }

  try {
    const response = await $fetch(`https://graph.facebook.com/v22.0/${videoId}`, {
      params: {
        fields: 'id,title,views,post_views,created_time,post_id',
        access_token: pageConfig.accessToken
      }
    });

    return response;
  } catch (error: any) {
    console.error(`[Facebook API - ${page}]`, error);

    if (error?.response?._data?.error?.code === 190) {
      console.error('Access token expired or invalid');
    }

    throw createError({
      statusCode: error?.response?.status || 500,
      message: error?.response?._data?.error?.message || 'Failed to fetch video data',
    });
  }
});
