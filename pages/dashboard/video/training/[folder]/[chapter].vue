<template>
  <div class="chapter-page">
    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner" />
    </div>

    <template v-else-if="chapter">
      <div class="chapter-layout">

        <!-- ── LEFT: Main Content ── -->
        <div class="main-content">

          <!-- Breadcrumb -->
          <div class="breadcrumb">
            <NuxtLink to="/dashboard/video/training" class="breadcrumb-link">
              {{ locale === 'en' ? 'All Courses' : 'វគ្គសិក្សាទាំងអស់' }}
            </NuxtLink>
            <span class="breadcrumb-sep">›</span>
            <NuxtLink :to="`/dashboard/video/training/${route.params.folder}`" class="breadcrumb-link">
              {{ locale === 'en' ? (folder?.name_en || 'Course') : (folder?.name_km || 'Course') }}
            </NuxtLink>
            <span class="breadcrumb-sep">›</span>
            <span class="breadcrumb-current">
              {{ locale === 'en' ? chapter.title_en : chapter.title_km }}
            </span>
          </div>

          <!-- Chapter Header -->
          <div class="chapter-header">
            <div class="chapter-icon-wrap">
              <Icon icon="mdi:playlist-play" class="chapter-icon" />
            </div>
            <div class="chapter-meta">
              <h1 class="chapter-title">
                {{ locale === 'en' ? chapter.title_en : chapter.title_km }}
              </h1>
              <p v-if="chapter.description_en || chapter.description_km" class="chapter-desc">
                {{ locale === 'en' ? chapter.description_en : chapter.description_km }}
              </p>
              <div class="chapter-stats">
                <span class="stat-pill">
                  <Icon icon="mdi:play-circle-outline" class="stat-icon" />
                  {{ lessons.length }} {{ locale === 'en' ? 'Lessons' : 'មេរៀន' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Lessons List -->
          <div class="lessons-list">
            <div
              v-for="(lesson, index) in lessons"
              :key="lesson.id"
              :id="`lesson-${lesson.id}`"
              class="lesson-card"
            >
              <!-- Lesson Header Bar -->
              <div class="lesson-header">
                <div class="lesson-number">{{ index + 1 }}</div>
                <div class="lesson-info">
                  <h3 class="lesson-title">
                    {{ locale === 'en' ? lesson.title_en : lesson.title_km }}
                  </h3>
                  <div v-if="lesson.duration" class="lesson-duration">
                    <Icon icon="mdi:clock-outline" class="duration-icon" />
                    {{ lesson.duration }}
                  </div>
                </div>
                <span class="lesson-badge">
                  <Icon icon="mdi:play" class="play-icon" />
                  {{ locale === 'en' ? 'Watch' : 'មើល' }}
                </span>
              </div>

              <!-- Video Player -->
              <div class="video-wrapper">
                <iframe
                  :src="`https://player.vimeo.com/video/${lesson.vimeo_video_id}?badge=0&autopause=0&player_id=0&app_id=58479`"
                  frameborder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  :title="(locale === 'en' ? lesson.title_en : lesson.title_km) || 'Lesson'"
                  class="video-iframe"
                />
              </div>

              <!-- Lesson Description -->
              <div v-if="lesson.description_en || lesson.description_km" class="lesson-desc">
                <p>{{ locale === 'en' ? lesson.description_en : lesson.description_km }}</p>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="!loading && lessons.length === 0" class="empty-state">
            <Icon icon="mdi:video-off-outline" class="empty-icon" />
            <p class="empty-text">{{ locale === 'en' ? 'No lessons yet' : 'មិនទាន់មានមេរៀន' }}</p>
          </div>
        </div>

        <!-- ── RIGHT: Sidebar ── -->
        <aside class="sidebar">
          <div class="sidebar-sticky">

            <!-- Course Info -->
            <div class="sidebar-card sidebar-course-info">
              <NuxtLink to="/dashboard/video/training" class="back-link">
                <Icon icon="mdi:arrow-left" class="back-icon" />
                {{ locale === 'en' ? 'All Courses' : 'វគ្គសិក្សាទាំងអស់' }}
              </NuxtLink>
              <div v-if="folder" class="course-name-block">
                <div class="course-icon-sm">
                  <Icon :icon="folder.icon || 'mdi:book-open-page-variant'" />
                </div>
                <div>
                  <h3 class="course-name">
                    {{ locale === 'en' ? folder.name_en : folder.name_km }}
                  </h3>
                  <p class="course-count">
                    {{ chapters.length }} {{ locale === 'en' ? 'chapters' : 'ជំពូក' }} &middot;
                    {{ totalLessons }} {{ locale === 'en' ? 'lessons' : 'មេរៀន' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Course Content -->
            <div class="sidebar-card sidebar-content-list">
              <div class="content-list-header">
                <Icon icon="mdi:format-list-bulleted" class="list-header-icon" />
                <h3 class="list-header-title">
                  {{ locale === 'en' ? 'Course Content' : 'មាតិកាវគ្គសិក្សា' }}
                </h3>
              </div>

              <div class="content-chapters">
                <div v-for="ch in sidebarChapters" :key="ch.id" class="chapter-item">
                  <!-- Chapter Toggle -->
                  <button
                    @click="toggleSidebarChapter(ch.id)"
                    :class="['chapter-toggle', isCurrentChapter(ch.slug) ? 'is-active' : '']"
                  >
                    <div :class="['chapter-num', isCurrentChapter(ch.slug) ? 'num-active' : '']">
                      <Icon v-if="expandedChapters[ch.id]" icon="mdi:chevron-down" class="chevron" />
                      <span v-else>{{ ch.sortOrder }}</span>
                    </div>
                    <div class="chapter-toggle-info">
                      <p :class="['toggle-title', isCurrentChapter(ch.slug) ? 'toggle-active' : '']">
                        {{ locale === 'en' ? ch.title_en : ch.title_km }}
                      </p>
                      <p class="toggle-count">
                        {{ ch.lessonCount }} {{ locale === 'en' ? 'lessons' : 'មេរៀន' }}
                      </p>
                    </div>
                  </button>

                  <!-- Lessons under chapter -->
                  <Transition name="submenu">
                    <div v-show="expandedChapters[ch.id]" class="lesson-links">
                      <NuxtLink
                        v-for="ls in ch.lessons"
                        :key="ls.id"
                        :to="`/dashboard/video/training/${route.params.folder}/${ch.slug}#lesson-${ls.id}`"
                        :class="['lesson-link', isCurrentChapter(ch.slug) ? 'lesson-link-active' : '']"
                      >
                        <Icon icon="mdi:play-circle-outline" class="lesson-link-icon" />
                        <span class="lesson-link-text">{{ locale === 'en' ? ls.title_en : ls.title_km }}</span>
                      </NuxtLink>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>

          </div>
        </aside>
      </div>
    </template>

    <!-- Not Found -->
    <div v-else class="empty-state">
      <Icon icon="mdi:alert-circle-outline" class="empty-icon" />
      <p class="empty-text">{{ locale === 'en' ? 'Chapter not found' : 'រកមិនឃើញជំពូក' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const route = useRoute()
const { getFolderBySlug, getChaptersByFolder, getChapterBySlug, getLessonsByChapter } = useTraining()

const loading = ref(true)
const folder = ref<any>(null)
const chapter = ref<any>(null)
const lessons = ref<any[]>([])
const chapters = ref<any[]>([])
const sidebarChapters = ref<any[]>([])
const expandedChapters = ref<Record<string, boolean>>({})
const totalLessons = ref(0)

const isCurrentChapter = (slug: string) => {
  return slug === route.params.chapter
}

const toggleSidebarChapter = (chapterId: string) => {
  expandedChapters.value[chapterId] = !expandedChapters.value[chapterId]
}

const fetchData = async () => {
  loading.value = true
  try {
    const folderSlug = route.params.folder as string
    const chapterSlug = route.params.chapter as string

    const [folderData, chaptersData, chapterData, lessonsData] = await Promise.all([
      getFolderBySlug(folderSlug),
      getChaptersByFolder(folderSlug),
      getChapterBySlug(folderSlug, chapterSlug),
      getLessonsByChapter(chapterSlug),
    ])

    folder.value = folderData
    chapters.value = chaptersData
    chapter.value = chapterData
    lessons.value = lessonsData

    const sidebarData: any[] = []
    let lessonTotal = 0

    for (let i = 0; i < chaptersData.length; i++) {
      const ch = chaptersData[i]
      let chLessons: any[] = []
      try {
        chLessons = await getLessonsByChapter(ch.slug)
        lessonTotal += chLessons.length
      } catch (e) {}
      sidebarData.push({
        ...ch,
        sortOrder: i + 1,
        lessonCount: chLessons.length,
        lessons: chLessons,
      })
    }

    sidebarChapters.value = sidebarData
    totalLessons.value = lessonTotal

    if (chapterData) {
      expandedChapters.value[chapterData.id] = true
    }
  } catch (err) {
    console.error('Failed to load chapter:', err)
  } finally {
    loading.value = false
  }
}

watch(() => [route.params.folder, route.params.chapter], fetchData, { immediate: true })
</script>

<style scoped>
/* ── Page Shell ── */
.chapter-page {
  min-height: 100vh;
  background: #f8f9fc;
  padding: 24px 20px 48px;
}

:root.dark .chapter-page {
  background: #0e0f14;
}

/* ── Layout ── */
.chapter-layout {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Loading ── */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e5e7eb;
  border-top-color: #7c3aed;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Breadcrumb ── */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #9ca3af;
  flex-wrap: wrap;
}

.breadcrumb-link {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.15s;
}

.breadcrumb-link:hover {
  color: #7c3aed;
}

.breadcrumb-sep {
  color: #d1d5db;
  font-size: 14px;
}

.breadcrumb-current {
  color: #374151;
  font-weight: 500;
}

:root.dark .breadcrumb-link { color: #6b7280; }
:root.dark .breadcrumb-link:hover { color: #a78bfa; }
:root.dark .breadcrumb-current { color: #d1d5db; }
:root.dark .breadcrumb-sep { color: #374151; }

/* ── Chapter Header ── */
.chapter-header {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 20px 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

:root.dark .chapter-header {
  background: #131520;
  border-color: #1f2333;
}

.chapter-icon-wrap {
  width: 48px;
  height: 48px;
  background: #ede9fe;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

:root.dark .chapter-icon-wrap {
  background: #1e1a3a;
}

.chapter-icon {
  width: 24px;
  height: 24px;
  color: #7c3aed;
}

.chapter-meta {
  flex: 1;
  min-width: 0;
}

.chapter-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px;
  line-height: 1.3;
}

:root.dark .chapter-title { color: #f3f4f6; }

.chapter-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px;
  line-height: 1.5;
}

.chapter-stats {
  display: flex;
  gap: 8px;
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #f3f0ff;
  color: #7c3aed;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 500;
}

:root.dark .stat-pill {
  background: #1e1a3a;
  color: #a78bfa;
}

.stat-icon {
  width: 14px;
  height: 14px;
}

/* ── Lessons List ── */
.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Lesson Card ── */
.lesson-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.lesson-card:hover {
  border-color: #c4b5fd;
}

:root.dark .lesson-card {
  background: #131520;
  border-color: #1f2333;
}

:root.dark .lesson-card:hover {
  border-color: #5b21b6;
}

/* Lesson Header Bar */
.lesson-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid #f3f4f6;
}

:root.dark .lesson-header {
  border-bottom-color: #1f2333;
}

.lesson-number {
  width: 32px;
  height: 32px;
  background: #f3f0ff;
  color: #7c3aed;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

:root.dark .lesson-number {
  background: #1e1a3a;
  color: #a78bfa;
}

.lesson-info {
  flex: 1;
  min-width: 0;
}

.lesson-title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:root.dark .lesson-title { color: #f3f4f6; }

.lesson-duration {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.duration-icon {
  width: 12px;
  height: 12px;
}

.lesson-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #7c3aed;
  background: #f3f0ff;
  padding: 4px 10px;
  border-radius: 6px;
  flex-shrink: 0;
}

:root.dark .lesson-badge {
  background: #1e1a3a;
  color: #a78bfa;
}

.play-icon {
  width: 12px;
  height: 12px;
}

/* Video */
.video-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: #000;
  display: block;
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

/* Lesson Desc */
.lesson-desc {
  padding: 12px 18px;
  border-top: 1px solid #f3f4f6;
}

:root.dark .lesson-desc {
  border-top-color: #1f2333;
}

.lesson-desc p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

/* ── Empty State ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #9ca3af;
}

.empty-icon {
  width: 56px;
  height: 56px;
  opacity: 0.35;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 15px;
  color: #9ca3af;
}

/* ── Sidebar ── */
.sidebar {
  width: 300px;
  flex-shrink: 0;
}

.sidebar-sticky {
  position: sticky;
  top: 80px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
}

:root.dark .sidebar-card {
  background: #131520;
  border-color: #1f2333;
}

/* Course Info Card */
.sidebar-course-info {
  padding: 16px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #7c3aed;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 14px;
  transition: opacity 0.15s;
}

.back-link:hover {
  opacity: 0.7;
}

:root.dark .back-link { color: #a78bfa; }

.back-icon {
  width: 14px;
  height: 14px;
}

.course-name-block {
  display: flex;
  align-items: center;
  gap: 10px;
}

.course-icon-sm {
  width: 36px;
  height: 36px;
  background: #ede9fe;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7c3aed;
  font-size: 18px;
  flex-shrink: 0;
}

:root.dark .course-icon-sm {
  background: #1e1a3a;
  color: #a78bfa;
}

.course-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 2px;
}

:root.dark .course-name { color: #f3f4f6; }

.course-count {
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
}

/* Content List Card */
.content-list-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
}

:root.dark .content-list-header {
  border-bottom-color: #1f2333;
}

.list-header-icon {
  width: 16px;
  height: 16px;
  color: #7c3aed;
  flex-shrink: 0;
}

.list-header-title {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

:root.dark .list-header-title { color: #f3f4f6; }

.content-chapters {
  max-height: calc(100vh - 320px);
  overflow-y: auto;
}

/* Chapter Toggle Row */
.chapter-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
  border-bottom: 1px solid #f3f4f6;
}

:root.dark .chapter-toggle {
  border-bottom-color: #1f2333;
}

.chapter-toggle:last-child {
  border-bottom: none;
}

.chapter-toggle:hover {
  background: #f9fafb;
}

:root.dark .chapter-toggle:hover {
  background: #1a1d2a;
}

.chapter-toggle.is-active {
  background: #faf7ff;
}

:root.dark .chapter-toggle.is-active {
  background: #181330;
}

.chapter-num {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: #f3f4f6;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}

:root.dark .chapter-num {
  background: #232535;
  color: #9ca3af;
}

.chapter-num.num-active {
  background: #7c3aed;
  color: #ffffff;
}

.chevron {
  width: 14px;
  height: 14px;
}

.chapter-toggle-info {
  flex: 1;
  min-width: 0;
}

.toggle-title {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s;
}

:root.dark .toggle-title { color: #d1d5db; }

.toggle-title.toggle-active {
  color: #7c3aed;
}

:root.dark .toggle-title.toggle-active { color: #a78bfa; }

.toggle-count {
  font-size: 11px;
  color: #9ca3af;
  margin: 1px 0 0;
}

/* Lesson links under chapter */
.lesson-links {
  background: #fafafa;
}

:root.dark .lesson-links {
  background: #0f1018;
}

.lesson-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px 9px 44px;
  font-size: 12px;
  color: #6b7280;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  border-bottom: 1px solid #f3f4f6;
}

.lesson-link:last-child {
  border-bottom: none;
}

:root.dark .lesson-link {
  color: #6b7280;
  border-bottom-color: #1a1d28;
}

.lesson-link:hover {
  background: #f3f0ff;
  color: #7c3aed;
}

:root.dark .lesson-link:hover {
  background: #181330;
  color: #a78bfa;
}

.lesson-link.lesson-link-active {
  color: #7c3aed;
}

:root.dark .lesson-link.lesson-link-active { color: #a78bfa; }

.lesson-link-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.lesson-link-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Transitions ── */
.submenu-enter-active,
.submenu-leave-active {
  transition: opacity 0.2s ease, max-height 0.25s ease;
  overflow: hidden;
  max-height: 2000px;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .chapter-layout {
    flex-direction: column;
    align-items: stretch;
  }

  .main-content {
    width: 100%;
  }

  .sidebar {
    width: 100%;
  }

  .sidebar-sticky {
    position: static;
  }

  .content-chapters {
    max-height: 360px;
  }
}

@media (max-width: 640px) {
  .chapter-page {
    padding: 16px 12px 40px;
  }

  .chapter-header {
    padding: 16px;
  }

  .lesson-header {
    padding: 12px 14px;
  }
}
</style>
