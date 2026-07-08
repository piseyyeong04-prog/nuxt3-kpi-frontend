import type { TrainingFolder, TrainingChapter, TrainingLesson } from '~/types/training'

export const useTraining = () => {
  const getFolders = async () => {
    try {
      const response = await useApi<{ data: TrainingFolder[] }>(
        `/items/training_folders?sort=sort_order&fields=id,name_en,name_km,slug,description_en,description_km,icon,sort_order`,
        { method: 'GET' }
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  const getFolderBySlug = async (slug: string) => {
    try {
      const response = await useApi<{ data: TrainingFolder[] }>(
        `/items/training_folders?filter[slug][_eq]=${slug}&fields=id,name_en,name_km,slug,description_en,description_km,icon,sort_order`,
        { method: 'GET' }
      )
      return response.data?.[0] || null
    } catch (error) {
      throw error
    }
  }

  const getChaptersByFolder = async (folderSlug: string) => {
    try {
      const response = await useApi<{ data: TrainingChapter[] }>(
        `/items/training_chapters?filter[folder][slug][_eq]=${folderSlug}&sort=sort_order&fields=id,title_en,title_km,slug,description_en,description_km,sort_order`,
        { method: 'GET' }
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  const getChapterBySlug = async (folderSlug: string, chapterSlug: string) => {
    try {
      const response = await useApi<{ data: TrainingChapter[] }>(
        `/items/training_chapters?filter[folder][slug][_eq]=${folderSlug}&filter[slug][_eq]=${chapterSlug}&fields=id,title_en,title_km,slug,description_en,description_km,sort_order`,
        { method: 'GET' }
      )
      return response.data?.[0] || null
    } catch (error) {
      throw error
    }
  }

  const getLessonsByChapter = async (chapterSlug: string) => {
    try {
      const response = await useApi<{ data: TrainingLesson[] }>(
        `/items/training_lessons?filter[chapter][slug][_eq]=${chapterSlug}&sort=sort_order&fields=id,title_en,title_km,vimeo_video_id,description_en,description_km,duration,sort_order`,
        { method: 'GET' }
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  return {
    getFolders,
    getFolderBySlug,
    getChaptersByFolder,
    getChapterBySlug,
    getLessonsByChapter,
  }
}
