import type { VideoCategory, VideoFolder, VideoItem } from '~/types/video'

export const useVideoEvaluate = () => {
  const getCategories = async () => {
    try {
      const response = await useApi<{ data: VideoCategory[] }>(
        `/items/video_categories?sort=sort_order&fields=id,name_en,name_km,slug,icon,sort_order`,
        { method: 'GET' }
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  const getCategoryBySlug = async (slug: string) => {
    try {
      const response = await useApi<{ data: VideoCategory[] }>(
        `/items/video_categories?filter[slug][_eq]=${slug}&fields=id,name_en,name_km,slug,icon,sort_order`,
        { method: 'GET' }
      )
      return response.data?.[0] || null
    } catch (error) {
      throw error
    }
  }

  const getFoldersByCategory = async (categorySlug: string) => {
    try {
      const response = await useApi<{ data: VideoFolder[] }>(
        `/items/video_folders?filter[category][slug][_eq]=${categorySlug}&sort=sort_order&fields=id,name_en,name_km,slug,description_en,description_km,sort_order`,
        { method: 'GET' }
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  const getFolderBySlug = async (categorySlug: string, folderSlug: string) => {
    try {
      const response = await useApi<{ data: VideoFolder[] }>(
        `/items/video_folders?filter[category][slug][_eq]=${categorySlug}&filter[slug][_eq]=${folderSlug}&fields=id,name_en,name_km,slug,description_en,description_km,sort_order`,
        { method: 'GET' }
      )
      return response.data?.[0] || null
    } catch (error) {
      throw error
    }
  }

  const getVideosByFolder = async (folderSlug: string) => {
    try {
      const response = await useApi<{ data: VideoItem[] }>(
        `/items/videos?filter[folder][slug][_eq]=${folderSlug}&sort=sort_order&fields=id,title_en,title_km,vimeo_video_id,description_en,description_km,sort_order`,
        { method: 'GET' }
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  return {
    getCategories,
    getCategoryBySlug,
    getFoldersByCategory,
    getFolderBySlug,
    getVideosByFolder,
  }
}
