<template>
  <div class="download-page">
    <div class="download-shell">
      <!-- Header -->
      <header class="download-header">
        <NuxtLink to="/" class="back-link">
          <Icon icon="mdi:arrow-left" class="w-5 h-5" />
          <span>Back to app</span>
        </NuxtLink>

        <div class="brand-row">
          <div class="brand-mark">
            <Icon icon="mdi:desktop-classic" class="brand-icon" />
          </div>
          <div>
            <h1 class="page-title">{{ t('title') }}</h1>
            <p class="page-subtitle">{{ t('subtitle') }}</p>
          </div>
        </div>
      </header>

      <!-- Detected device -->
      <section class="detect-card">
        <div class="detect-left">
          <span class="detect-pill">
            <Icon icon="mdi:laptop" class="w-4 h-4" />
            {{ t('detected') }}
          </span>
          <p class="detect-device">{{ deviceLabel }}</p>
          <p class="detect-hint" v-if="recommended">{{ t('recommendedFile') }}: {{ recommended.filename }}</p>
          <p class="detect-hint" v-else>{{ t('unknownHint') }}</p>
        </div>

        <a v-if="recommended" :href="downloadUrl(recommended.filename)" :download="recommended.filename" class="primary-btn">
          <Icon :icon="recommended.icon" class="w-5 h-5" />
          {{ t('downloadFor') }} {{ recommended.title }}
          <Icon icon="mdi:download" class="w-5 h-5" />
        </a>
        <a v-else href="#all-downloads" class="primary-btn primary-btn-muted">
          <Icon icon="mdi:download" class="w-5 h-5" />
          {{ t('chooseManually') }}
        </a>
      </section>

      <!-- OS tabs -->
      <section id="all-downloads" class="download-section">
        <div class="section-head">
          <h2 class="section-title">{{ t('allDownloads') }}</h2>
          <span class="version-badge">{{ t('version') }} 1.0.0</span>
        </div>

        <div class="os-group" v-for="group in groupedReleases" :key="group.os">
          <div class="os-head">
            <Icon :icon="group.icon" class="os-icon" />
            <h3 class="os-title">{{ group.label }}</h3>
            <span v-if="group.os === detected.os" class="match-badge">{{ t('yourDevice') }}</span>
          </div>

          <div class="release-grid">
            <a
              v-for="release in group.releases"
              :key="release.id"
              :href="downloadUrl(release.filename)"
              :download="release.filename"
              class="release-card"
              :class="{ 'release-card-active': recommended?.id === release.id }"
            >
              <div class="release-top">
                <Icon :icon="release.icon" class="release-icon" />
                <span v-if="recommended?.id === release.id" class="recommended-badge">{{ t('recommended') }}</span>
              </div>
              <p class="release-title">{{ release.title }}</p>
              <p class="release-subtitle">{{ release.subtitle }}</p>
              <p class="release-size">{{ release.sizeLabel }}</p>
              <span class="release-action">
                <Icon icon="mdi:download" class="w-4 h-4" />
                {{ t('download') }}
              </span>
            </a>
          </div>
        </div>
      </section>

      <!-- Install notes -->
      <section class="notes-section">
        <h2 class="section-title">{{ t('installNotes') }}</h2>

        <div class="note-card">
          <div class="note-icon"><Icon icon="mdi:apple" /></div>
          <div>
            <h3>macOS</h3>
            <p>{{ t('macNote') }}</p>
            <code>xattr -dr com.apple.quarantine /Applications/KPI\ System\ Baksey.app</code>
          </div>
        </div>

        <div class="note-card">
          <div class="note-icon"><Icon icon="mdi:microsoft-windows" /></div>
          <div>
            <h3>Windows</h3>
            <p>{{ t('winNote') }}</p>
          </div>
        </div>

        <div class="note-card">
          <div class="note-icon"><Icon icon="mdi:linux" /></div>
          <div>
            <h3>Ubuntu / Linux</h3>
            <p>{{ t('linuxNote') }}</p>
            <code>chmod +x kpi-desktop && ./kpi-desktop</code>
          </div>
        </div>
      </section>

      <footer class="download-footer">
        <p>{{ t('footer') }}</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'

definePageMeta({ layout: false })

type OS = 'mac' | 'windows' | 'linux' | 'unknown'
type Arch = 'universal' | 'x64' | 'arm64' | 'unknown'

interface Release {
  id: string
  os: OS
  arch: Arch
  title: string
  subtitle: string
  icon: string
  url: string
  filename: string
  sizeLabel: string
}

const config = useRuntimeConfig()
const downloadBase = String(config.public.DOWNLOAD_BASE_URL || '/downloads').replace(/\/+$/, '')
const downloadUrl = (filename: string) => `${downloadBase}/${filename}`

const releases: Release[] = [
  {
    id: 'mac-universal',
    os: 'mac',
    arch: 'universal',
    title: 'macOS',
    subtitle: 'Universal — Apple Silicon & Intel',
    icon: 'mdi:apple',
    url: '/downloads/KPI-System-Baksey-macOS-universal.zip',
    filename: 'KPI-System-Baksey-macOS-universal.zip',
    sizeLabel: '~30 MB',
  },
  {
    id: 'windows-x64',
    os: 'windows',
    arch: 'x64',
    title: 'Windows',
    subtitle: '64-bit (Intel / AMD)',
    icon: 'mdi:microsoft-windows',
    url: '/downloads/KPI-System-Baksey-windows-x64.exe',
    filename: 'KPI-System-Baksey-windows-x64.exe',
    sizeLabel: '~27 MB',
  },
  {
    id: 'windows-arm64',
    os: 'windows',
    arch: 'arm64',
    title: 'Windows on ARM',
    subtitle: '64-bit ARM',
    icon: 'mdi:microsoft-windows',
    url: '/downloads/KPI-System-Baksey-windows-arm64.exe',
    filename: 'KPI-System-Baksey-windows-arm64.exe',
    sizeLabel: '~26 MB',
  },
  {
    id: 'linux-x64',
    os: 'linux',
    arch: 'x64',
    title: 'Linux x64',
    subtitle: 'Ubuntu 22.04 / 24.04+',
    icon: 'mdi:linux',
    url: '/downloads/KPI-System-Baksey-linux-amd64.tar.gz',
    filename: 'KPI-System-Baksey-linux-amd64.tar.gz',
    sizeLabel: '~15 MB',
  },
  {
    id: 'linux-arm64',
    os: 'linux',
    arch: 'arm64',
    title: 'Linux ARM64',
    subtitle: 'Ubuntu 22.04 / 24.04+',
    icon: 'mdi:linux',
    url: '/downloads/KPI-System-Baksey-linux-arm64.tar.gz',
    filename: 'KPI-System-Baksey-linux-arm64.tar.gz',
    sizeLabel: '~15 MB',
  },
]

const osGroups = [
  { os: 'mac' as OS, label: 'macOS', icon: 'mdi:apple' },
  { os: 'windows' as OS, label: 'Windows', icon: 'mdi:microsoft-windows' },
  { os: 'linux' as OS, label: 'Linux', icon: 'mdi:linux' },
]

const detected = ref<{ os: OS; arch: Arch }>({ os: 'unknown', arch: 'unknown' })
const recommended = ref<Release | null>(null)

const deviceLabel = computed(() => {
  if (detected.value.os === 'unknown') return t('unknownDevice')
  const osLabel = detected.value.os === 'mac'
    ? 'macOS'
    : detected.value.os === 'windows'
      ? 'Windows'
      : 'Linux'
  if (detected.value.os === 'mac') return `${osLabel} (Universal)`
  const archLabel = detected.value.arch === 'arm64' ? 'ARM64' : 'x64'
  return `${osLabel} ${archLabel}`
})

const groupedReleases = computed(() =>
  osGroups.map((group) => ({
    ...group,
    releases: releases.filter((release) => release.os === group.os),
  })),
)

function detectOS(): OS {
  const ua = navigator.userAgent || ''
  const platform = (navigator as any).platform || ''

  if (/Mac|iPhone|iPad|iPod/i.test(platform) || /Mac OS X/i.test(ua)) return 'mac'
  if (/Win/i.test(platform) || /Windows/i.test(ua)) return 'windows'
  if (/Linux|X11/i.test(platform) || (/Linux/i.test(ua) && !/Android/i.test(ua))) return 'linux'
  return 'unknown'
}

async function detectArch(): Promise<Arch> {
  const uaData = (navigator as any).userAgentData
  if (uaData?.getHighEntropyValues) {
    try {
      const values = await uaData.getHighEntropyValues(['architecture', 'bitness'])
      const arch = String(values.architecture || '').toLowerCase()
      if (arch.includes('arm')) return 'arm64'
      if (arch.includes('x86')) return 'x64'
    } catch {
      // Fall through to the user-agent heuristic.
    }
  }

  const ua = navigator.userAgent || ''
  const platform = (navigator as any).platform || ''
  if (/arm64|aarch64/i.test(ua) || /arm/i.test(platform)) return 'arm64'
  return 'x64'
}

function pickRelease(os: OS, arch: Arch): Release | null {
  if (os === 'mac') return releases.find((release) => release.id === 'mac-universal') ?? null
  if (os === 'unknown') return null

  return (
    releases.find((release) => release.os === os && release.arch === arch) ??
    releases.find((release) => release.os === os && release.arch === 'x64') ??
    null
  )
}

onMounted(async () => {
  const os = detectOS()
  let arch: Arch = await detectArch()
  if (os === 'mac') arch = 'universal'

  detected.value = { os, arch }
  recommended.value = pickRelease(os, arch)
})

const labels = {
  en: {
    title: 'Download KPI System Baksey',
    subtitle: 'Native desktop app for macOS, Windows and Linux.',
    detected: 'Detected device',
    unknownDevice: 'Unknown device',
    unknownHint: 'Choose the correct installer for your computer below.',
    recommendedFile: 'Recommended file',
    downloadFor: 'Download for',
    chooseManually: 'Choose manually',
    allDownloads: 'All downloads',
    version: 'Version',
    yourDevice: 'Your device',
    recommended: 'Recommended',
    download: 'Download',
    installNotes: 'Installation notes',
    macNote: 'Unzip the download, then drag the app into Applications. If macOS blocks it, right-click the app and choose Open, or run:',
    winNote: 'Run the installer. WebView2 is installed automatically if it is missing.',
    linuxNote: 'Extract the archive, make the binary executable, then run it. Install the GTK/WebKit runtime first (libgtk-3-0 and libwebkit2gtk-4.1-0 on Ubuntu).',
    footer: 'KPI System Baksey — choose the build that matches your computer.',
  },
  km: {
    title: 'ទាញយក KPI System Baksey',
    subtitle: 'កម្មវិធីកុំព្យូទ័រសម្រាប់ macOS, Windows និង Linux។',
    detected: 'ឧបករណ៍ដែលបានរកឃើញ',
    unknownDevice: 'មិនស្គាល់ឧបករណ៍',
    unknownHint: 'សូមជ្រើសរើសកម្មវិធីត្រឹមត្រូវសម្រាប់កុំព្យូទ័ររបស់អ្នកខាងក្រោម។',
    recommendedFile: 'ឯកសារដែលណែនាំ',
    downloadFor: 'ទាញយកសម្រាប់',
    chooseManually: 'ជ្រើសរើសដោយខ្លួនឯង',
    allDownloads: 'ការទាញយកទាំងអស់',
    version: 'កំណែ',
    yourDevice: 'ឧបករណ៍របស់អ្នក',
    recommended: 'ណែនាំ',
    download: 'ទាញយក',
    installNotes: 'ការណែនាំដំឡើង',
    macNote: 'សូមបើកឯកសារ zip បន្ទាប់មកអូសកម្មវិធីទៅ Applications។ ប្រសិនបើ macOS បិទខ្ទប់ សូមចុចស្តាំលើកម្មវិធី ហើយជ្រើស Open ឬដំណើរការ៖',
    winNote: 'ដំណើរការឯកសារដំឡើង។ WebView2 នឹងត្រូវដំឡើងដោយស្វ័យប្រវត្តិប្រសិនបើខ្វះ។',
    linuxNote: 'សូមពន្លាឯកសារ ធ្វើឱ្យ binary អាចដំណើរការ បន្ទាប់មកដំណើរការវា។ សូមដំឡើង GTK/WebKit runtime ជាមុនសិន។',
    footer: 'KPI System Baksey — ជ្រើសរើសកំណែដែលត្រូវនឹងកុំព្យូទ័ររបស់អ្នក។',
  },
}

const locale = ref<'en' | 'km'>('en')
const t = (key: keyof typeof labels.en) => labels[locale.value][key] ?? labels.en[key]

onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('locale')
    if (saved === 'km' || saved === 'en') locale.value = saved
  }
})
</script>

<style scoped>
.download-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #f8fafc;
  color: #0f172a;
}

:global(.dark) .download-page {
  background: #020617;
  color: #e2e8f0;
}

.download-shell {
  position: relative;
  z-index: 1;
  max-width: 70rem;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}

.download-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  width: fit-content;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0284c7;
  text-decoration: none;
}
.back-link:hover { color: #0369a1; }

.brand-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  background: #0284c7;
  color: white;
  box-shadow: 0 12px 30px rgba(14, 165, 233, 0.25);
}
.brand-icon { width: 1.75rem; height: 1.75rem; }

.page-title {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
}
.page-subtitle {
  margin: 0.3rem 0 0;
  color: #64748b;
  font-size: 0.95rem;
}
:global(.dark) .page-subtitle { color: #94a3b8; }

.detect-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 1.25rem;
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(14px);
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
}
:global(.dark) .detect-card {
  background: rgba(15, 23, 42, 0.7);
  border-color: rgba(51, 65, 85, 0.8);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
}

.detect-left { min-width: 15rem; }
.detect-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: rgba(14, 165, 233, 0.12);
  color: #0284c7;
}
.detect-device {
  margin: 0.6rem 0 0.25rem;
  font-size: 1.3rem;
  font-weight: 800;
}
.detect-hint {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
  word-break: break-all;
}
:global(.dark) .detect-hint { color: #94a3b8; }

.primary-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.25rem;
  border-radius: 0.9rem;
  background: #0284c7;
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  box-shadow: 0 14px 30px rgba(14, 165, 233, 0.28);
  transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}
.primary-btn:hover {
  transform: translateY(-1px);
  background: #0369a1;
  box-shadow: 0 18px 36px rgba(14, 165, 233, 0.34);
}
.primary-btn-muted {
  background: #e2e8f0;
  color: #0f172a;
  box-shadow: none;
}
:global(.dark) .primary-btn-muted { background: #1e293b; color: #e2e8f0; }

.download-section { margin-top: 2.5rem; }
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.section-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
}
.version-badge {
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
  background: rgba(2, 132, 199, 0.12);
  color: #0284c7;
}

.os-group { margin-bottom: 1.75rem; }
.os-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.os-icon { width: 1.25rem; height: 1.25rem; color: #0ea5e9; }
.os-title { margin: 0; font-size: 1rem; font-weight: 700; }
.match-badge {
  margin-left: 0.25rem;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.65rem;
  font-weight: 700;
  background: rgba(2, 132, 199, 0.12);
  color: #0284c7;
}

.release-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 0.9rem;
}

.release-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.1rem;
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
:global(.dark) .release-card {
  background: rgba(15, 23, 42, 0.55);
  border-color: rgba(51, 65, 85, 0.8);
}
.release-card:hover {
  transform: translateY(-2px);
  border-color: rgba(14, 165, 233, 0.55);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.1);
}
.release-card-active {
  border-color: rgba(2, 132, 199, 0.6);
  box-shadow: 0 16px 34px rgba(2, 132, 199, 0.14);
}

.release-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.release-icon { width: 1.5rem; height: 1.5rem; color: #0ea5e9; }
.recommended-badge {
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(2, 132, 199, 0.12);
  color: #0284c7;
}
.release-title { margin: 0.4rem 0 0; font-weight: 800; }
.release-subtitle { margin: 0; font-size: 0.78rem; color: #64748b; }
:global(.dark) .release-subtitle { color: #94a3b8; }
.release-size { margin: 0.35rem 0 0; font-size: 0.72rem; color: #94a3b8; }
.release-action {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.7rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: #0284c7;
}

.notes-section { margin-top: 2.5rem; }
.note-card {
  display: flex;
  gap: 0.9rem;
  padding: 1rem 1.1rem;
  margin-top: 0.7rem;
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(255, 255, 255, 0.55);
}
:global(.dark) .note-card {
  background: rgba(15, 23, 42, 0.45);
  border-color: rgba(51, 65, 85, 0.7);
}
.note-icon {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.7rem;
  background: rgba(14, 165, 233, 0.12);
  color: #0284c7;
  flex-shrink: 0;
}
.note-card h3 { margin: 0 0 0.2rem; font-size: 0.9rem; font-weight: 800; }
.note-card p { margin: 0; font-size: 0.8rem; color: #64748b; }
:global(.dark) .note-card p { color: #94a3b8; }
.note-card code {
  display: block;
  margin-top: 0.5rem;
  padding: 0.45rem 0.6rem;
  border-radius: 0.5rem;
  background: #0f172a;
  color: #bae6fd;
  font-size: 0.72rem;
  overflow-x: auto;
  white-space: nowrap;
}

.download-footer {
  margin-top: 3rem;
  text-align: center;
  font-size: 0.75rem;
  color: #94a3b8;
}
</style>
