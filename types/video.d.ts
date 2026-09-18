export interface VideoCategory {
  id: string
  name_en: string
  name_km: string
  slug: string
  icon?: string
  sort_order?: number
}

export interface VideoFolder {
  id: string
  category: string | VideoCategory
  name_en: string
  name_km: string
  slug: string
  description_en?: string
  description_km?: string
  sort_order?: number
}

export interface VideoItem {
  id: string
  folder: string | VideoFolder
  title_en?: string
  title_km?: string
  vimeo_video_id: string
  description_en?: string
  description_km?: string
  sort_order?: number
}
