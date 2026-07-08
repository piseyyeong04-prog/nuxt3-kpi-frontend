export interface TrainingFolder {
  id: string
  name_en: string
  name_km: string
  slug: string
  description_en?: string
  description_km?: string
  icon?: string
  sort_order?: number
}

export interface TrainingChapter {
  id: string
  folder: string | TrainingFolder
  title_en: string
  title_km: string
  slug: string
  description_en?: string
  description_km?: string
  sort_order?: number
}

export interface TrainingLesson {
  id: string
  chapter: string | TrainingChapter
  title_en: string
  title_km: string
  vimeo_video_id: string
  description_en?: string
  description_km?: string
  duration?: string
  sort_order?: number
}
