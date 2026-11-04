<template>
  <Teleport to="body">
    <Transition name="dl-fade">
      <div v-if="modelValue" class="dl-overlay" @click.self="close">
        <div class="dl-modal">
          <button class="dl-close" type="button" aria-label="Close" @click="close">
            <Icon icon="mdi:close" />
          </button>

          <div class="dl-hero">
            <div class="dl-app-icon">
              <Icon icon="mdi:desktop-classic" />
            </div>
            <div>
              <h2 class="dl-title">Get the Desktop App</h2>
              <p class="dl-subtitle">Faster access, native printing and offline-ready performance.</p>
            </div>
          </div>

          <div class="dl-detect">
            <span class="dl-detect-label">
              <Icon icon="mdi:laptop" class="w-4 h-4" />
              Detected device
            </span>
            <strong class="dl-device">{{ deviceLabel }}</strong>
            <span v-if="recommended" class="dl-file">{{ recommended.filename }}</span>
          </div>

          <a
            v-if="recommended"
            :href="downloadUrl(recommended.filename)"
            :download="recommended.filename"
            class="dl-primary"
            @click="markDownloaded"
          >
            <Icon :icon="recommended.icon" class="w-5 h-5" />
            Download for {{ recommended.title }}
            <Icon icon="mdi:download" class="w-5 h-5" />
          </a>

          <a v-else href="/download" class="dl-primary dl-primary-muted" @click="close">
            <Icon icon="mdi:download" class="w-5 h-5" />
            Choose your installer
          </a>

          <div class="dl-links">
            <NuxtLink to="/download" class="dl-link" @click="close">See all versions</NuxtLink>
            <span class="dl-dot">•</span>
            <span class="dl-version">Version 1.0.0</span>
          </div>

          <label class="dl-remember">
            <input v-model="dontShowAgain" type="checkbox" />
            <span>Don't show this again</span>
          </label>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (event: 'update:modelValue', value: boolean): void }>()

type OS = 'mac' | 'windows' | 'linux' | 'unknown'
type Arch = 'universal' | 'x64' | 'arm64' | 'unknown'

interface Release {
  id: string
  os: OS
  arch: Arch
  title: string
  icon: string
  url: string
  filename: string
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
    icon: 'mdi:apple',
    url: '/downloads/KPI-System-Baksey-macOS-universal.zip',
    filename: 'KPI-System-Baksey-macOS-universal.zip',
  },
  {
    id: 'windows-x64',
    os: 'windows',
    arch: 'x64',
    title: 'Windows',
    icon: 'mdi:microsoft-windows',
    url: '/downloads/KPI-System-Baksey-windows-x64.exe',
    filename: 'KPI-System-Baksey-windows-x64.exe',
  },
  {
    id: 'windows-arm64',
    os: 'windows',
    arch: 'arm64',
    title: 'Windows on ARM',
    icon: 'mdi:microsoft-windows',
    url: '/downloads/KPI-System-Baksey-windows-arm64.exe',
    filename: 'KPI-System-Baksey-windows-arm64.exe',
  },
  {
    id: 'linux-x64',
    os: 'linux',
    arch: 'x64',
    title: 'Linux x64',
    icon: 'mdi:linux',
    url: '/downloads/KPI-System-Baksey-linux-amd64.tar.gz',
    filename: 'KPI-System-Baksey-linux-amd64.tar.gz',
  },
  {
    id: 'linux-arm64',
    os: 'linux',
    arch: 'arm64',
    title: 'Linux ARM64',
    icon: 'mdi:linux',
    url: '/downloads/KPI-System-Baksey-linux-arm64.tar.gz',
    filename: 'KPI-System-Baksey-linux-arm64.tar.gz',
  },
]

const detected = ref<{ os: OS; arch: Arch }>({ os: 'unknown', arch: 'unknown' })
const recommended = ref<Release | null>(null)
const dontShowAgain = ref(false)

const deviceLabel = computed(() => {
  if (detected.value.os === 'unknown') return 'Unknown device'
  if (detected.value.os === 'mac') return 'macOS (Universal)'
  const osLabel = detected.value.os === 'windows' ? 'Windows' : 'Linux'
  const archLabel = detected.value.arch === 'arm64' ? 'ARM64' : 'x64'
  return `${osLabel} ${archLabel}`
})

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
      // Ignore and fall back.
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

function close() {
  if (dontShowAgain.value) {
    localStorage.setItem('kpi-download-popup-dismissed', '1')
  }
  emit('update:modelValue', false)
}

function markDownloaded() {
  localStorage.setItem('kpi-download-popup-dismissed', '1')
}

watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) return
    localStorage.removeItem('kpi-download-popup-dismissed')
  },
)

onMounted(async () => {
  const os = detectOS()
  const arch = os === 'mac' ? 'universal' : await detectArch()
  detected.value = { os, arch }
  recommended.value = pickRelease(os, arch)
})
</script>

<style scoped>
.dl-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(2, 6, 23, 0.62);
  backdrop-filter: blur(6px);
}

.dl-modal {
  position: relative;
  width: 100%;
  max-width: 28rem;
  padding: 1.6rem;
  border-radius: 1.25rem;
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 30px 80px rgba(2, 6, 23, 0.35);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

:global(.dark) .dl-modal {
  background: #0f172a;
  color: #e2e8f0;
  border-color: rgba(51, 65, 85, 0.8);
}

.dl-close {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 9999px;
  background: rgba(148, 163, 184, 0.16);
  color: inherit;
  cursor: pointer;
  transition: background 0.2s;
}
.dl-close:hover { background: rgba(148, 163, 184, 0.3); }

.dl-hero {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1rem;
  padding-right: 1.5rem;
}

.dl-app-icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.9rem;
  flex-shrink: 0;
  background: linear-gradient(135deg, #0284c7, #0ea5e9, #38bdf8);
  color: white;
  box-shadow: 0 10px 24px rgba(14, 165, 233, 0.28);
}
.dl-app-icon :deep(svg) { width: 1.5rem; height: 1.5rem; }

.dl-title { margin: 0; font-size: 1.15rem; font-weight: 800; }
.dl-subtitle { margin: 0.2rem 0 0; font-size: 0.8rem; color: #64748b; }
:global(.dark) .dl-subtitle { color: #94a3b8; }

.dl-detect {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 1rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.8rem;
  background: rgba(14, 165, 233, 0.08);
  border: 1px solid rgba(14, 165, 233, 0.18);
}
.dl-detect-label {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #0284c7;
}
.dl-device { font-size: 1rem; font-weight: 800; }
.dl-file { font-size: 0.7rem; color: #64748b; word-break: break-all; }
:global(.dark) .dl-file { color: #94a3b8; }

.dl-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 0.8rem;
  background: linear-gradient(135deg, #0284c7, #0ea5e9, #38bdf8);
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(14, 165, 233, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: transform 0.2s, box-shadow 0.3s;
}
.dl-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
.dl-primary-muted {
  background: #e2e8f0;
  color: #0f172a;
  box-shadow: none;
}

.dl-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 0.9rem;
  font-size: 0.75rem;
}
.dl-link { color: #0284c7; font-weight: 600; text-decoration: none; }
.dl-link:hover { text-decoration: underline; }
.dl-dot { color: #94a3b8; }
.dl-version { color: #64748b; }

.dl-remember {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #64748b;
  cursor: pointer;
}
.dl-remember input { accent-color: #0ea5e9; }

.dl-fade-enter-active,
.dl-fade-leave-active { transition: opacity 0.2s ease; }
.dl-fade-enter-from,
.dl-fade-leave-to { opacity: 0; }
</style>
