<template>
  <div class="auth-root">
    <!-- Animated Background -->
    <div class="bg-canvas">
      <!-- Grid overlay -->
      <div class="grid-overlay"></div>

      <!-- Floating orbs -->
      <!-- <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div> -->

      <!-- Particle dots -->
      <div class="particles">
        <span v-for="n in 30" :key="n" class="particle" :style="particleStyle(n)"></span>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="auth-container">
      <!-- Left Panel: Branding -->
      <div class="left-panel">
        <!-- Top badge -->
        <div class="brand-badge">
          <span class="badge-dot"></span>
          <span class="badge-text">Digital Innovation 2026</span>
        </div>

        <!-- Logo & Title -->
        <div class="brand-block">
          <div class="logo-wrap">
            <img src="/logo.png" alt="Baksey Logo" class="logo-img" />
            <div class="logo-glow"></div>
          </div>
          <h1 class="brand-title">BAKSEY<span class="brand-dot">.</span></h1>
          <p class="brand-subtitle">KPI Performance Intelligence Platform</p>
        </div>

        <!-- Feature cards -->
        <div class="feature-list">
          <div class="feature-card" v-for="(f, i) in features" :key="i" :style="{ animationDelay: `${i * 0.15}s` }">
            <div class="feature-icon-wrap">
              <Icon :icon="f.icon" class="feature-icon" />
            </div>
            <div>
              <p class="feature-title">{{ f.title }}</p>
              <p class="feature-desc">{{ f.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Year stamp -->
        <div class="year-stamp">
          <span>©</span> 2026 Baksey Media &amp; Technology
        </div>
      </div>

      <!-- Right Panel: Login Form -->
      <div class="right-panel">
        <div class="form-card">
          <!-- Card glow border -->
          <div class="card-glow-border"></div>

          <!-- Header -->
          <div class="form-header">
            <div class="form-tag">
              <Icon icon="heroicons:finger-print" class="tag-icon" />
              <span>Secure Access</span>
            </div>
            <h2 class="form-title">Welcome Back</h2>
            <p class="form-subtitle">Sign in to your intelligence dashboard</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleLogin" class="login-form">
            <!-- Email -->
            <div class="field-group">
              <label for="email" class="field-label">Email Address</label>
              <div class="input-wrap">
                <Icon icon="heroicons:envelope" class="input-icon" />
                <input
                  id="email"
                  type="email"
                  v-model="email"
                  required
                  class="field-input"
                  placeholder="yourname@baksey.com"
                  autocomplete="email"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="field-group">
              <div class="label-row">
                <label for="password" class="field-label">Password</label>
                <NuxtLink to="#" class="forgot-link">Forgot password?</NuxtLink>
              </div>
              <div class="input-wrap">
                <Icon icon="heroicons:lock-closed" class="input-icon" />
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  required
                  class="field-input"
                  placeholder="••••••••"
                  autocomplete="current-password"
                />
                <button type="button" @click="togglePasswordVisibility" class="eye-btn" tabindex="-1">
                  <Icon :icon="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" />
                </button>
              </div>
            </div>

            <!-- Remember me -->
            <div class="remember-row">
              <label class="custom-checkbox">
                <input type="checkbox" v-model="rememberMe" id="remember-me" />
                <span class="checkbox-box">
                  <Icon icon="heroicons:check" class="check-icon" />
                </span>
                <span class="checkbox-label">Keep me signed in for 30 days</span>
              </label>
            </div>

            <!-- Submit -->
            <button type="submit" :disabled="isLoading" class="submit-btn">
              <span v-if="isLoading" class="btn-inner">
                <Icon icon="svg-spinners:ring-resize" class="spinner" />
                Authenticating...
              </span>
              <span v-else class="btn-inner">
                <Icon icon="heroicons:arrow-right-on-rectangle" class="btn-icon" />
                Sign In to Dashboard
              </span>
              <div class="btn-shimmer"></div>
            </button>
          </form>

          <!-- Footer -->
          <div class="form-footer">
            <p>
              Need access?
              <NuxtLink to="#" class="contact-link">Contact Administrator</NuxtLink>
            </p>
            <button type="button" class="download-app-link" @click="showDownloadModal = true">
              <Icon icon="heroicons:arrow-down-tray" class="dl-icon" />
              Download Desktop App
            </button>
            <div class="security-badges">
              <span class="s-badge">
                <Icon icon="heroicons:shield-check" />
                SSL Encrypted
              </span>
              <span class="s-badge">
                <Icon icon="heroicons:lock-closed" />
                MFA Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <DownloadAppModal v-model="showDownloadModal" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '~/store/useAuthStore';

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);
const showPassword = ref(false);
const showDownloadModal = ref(false);

const auth = useAuthStore();

onMounted(() => {
  if (process.client && !localStorage.getItem('kpi-download-popup-dismissed')) {
    setTimeout(() => {
      showDownloadModal.value = true;
    }, 1200);
  }
});

const features = [
  {
    icon: 'heroicons:chart-bar-square',
    title: 'Real-Time KPI Tracking',
    desc: 'Monitor performance metrics live across all departments',
  },
  {
    icon: 'heroicons:shield-check',
    title: 'Enterprise-Grade Security',
    desc: 'Zero-trust architecture with end-to-end encryption',
  },
  {
    icon: 'heroicons:sparkles',
    title: 'AI-Powered Insights',
    desc: 'Intelligent analytics and predictive reporting',
  },
];

const particleStyle = (n: number) => {
  const seed = n * 137.508;
  const x = (seed % 100).toFixed(2);
  const y = ((seed * 1.618) % 100).toFixed(2);
  const size = (2 + (n % 3)).toFixed(0);
  const delay = ((n * 0.37) % 6).toFixed(2);
  const duration = (4 + (n % 5)).toFixed(2);
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  };
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

definePageMeta({
  middleware: [
    function (to, from) {
      if (import.meta.client) {
        if (useAuthStore().user) {
          return navigateTo('/');
        }
      }
    },
  ],
});

onMounted(async () => {
  const token = new URLSearchParams(window.location.search).get('key');
  if (token) {
    localStorage.setItem('refresh_token', token);
    await useAuthStore().refresh();
    if (!useAuthStore().user?.cart) {
      await useApi('/users/' + useAuthStore().user?.id, {
        method: 'PATCH',
        data: { cart: { create: [{}], update: [], delete: [] } },
      });
    }
    document.getElementById('back')?.click();
  }
});

const handleLogin = async () => {
  if (!email.value || !password.value) {
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: 'Please enter both email and password',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      background: '#ffffff',
      color: '#0f172a',
      iconColor: '#ef4444',
      customClass: { popup: 'rounded-xl shadow-lg' },
    });
    return;
  }

  isLoading.value = true;

  try {
    await auth.login({ email: email.value, password: password.value });

    Swal.fire({
      icon: 'success',
      title: 'Login Successful',
      text: 'Redirecting to dashboard...',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      background: '#ffffff',
      color: '#0f172a',
      iconColor: '#10b981',
      customClass: { popup: 'rounded-xl shadow-lg' },
    });

    navigateTo('/');
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Authentication Failed',
      text: error?.response?.data?.errors?.[0]?.message || 'Invalid email or password',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      background: '#ffffff',
      color: '#0f172a',
      iconColor: '#ef4444',
      customClass: { popup: 'rounded-xl shadow-lg' },
    });
  } finally {
    isLoading.value = false;
  }
};

definePageMeta({ layout: 'custom' });
</script>

<style scoped>
/* ──────────────────────────────────────────────
   FONTS
─────────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

/* ──────────────────────────────────────────────
   ROOT
─────────────────────────────────────────────── */
.auth-root {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: stretch;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  background: #f8fafc;
}

/* ──────────────────────────────────────────────
   ANIMATED BACKGROUND
─────────────────────────────────────────────── */
.bg-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: radial-gradient(ellipse 80% 80% at 20% 40%, rgba(224, 242, 254, 0.4) 0%, #f8fafc 60%),
              radial-gradient(ellipse 60% 60% at 80% 80%, rgba(240, 249, 255, 0.6) 0%, transparent 70%);
}

/* Grid overlay */
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%);
}

/* Glowing orbs */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.25;
  animation: orbFloat 12s ease-in-out infinite alternate;
}
.orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #38bdf8, transparent 70%);
  top: -120px; left: -100px;
  animation-duration: 14s;
}
.orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, #818cf8, transparent 70%);
  bottom: -60px; right: -80px;
  animation-duration: 10s;
  animation-direction: alternate-reverse;
}
.orb-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, #fb923c, transparent 70%);
  top: 40%; left: 55%;
  transform: translate(-50%, -50%);
  animation-duration: 18s;
  opacity: 0.15;
}

@keyframes orbFloat {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, 40px) scale(1.08); }
}

/* Particles */
.particles { position: absolute; inset: 0; }
.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(14, 165, 233, 0.35);
  animation: particlePulse 5s ease-in-out infinite;
}
@keyframes particlePulse {
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1); }
}

/* ──────────────────────────────────────────────
   AUTH CONTAINER
─────────────────────────────────────────────── */
.auth-container {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  max-width: 1280px;
  margin: auto;
  min-height: 100vh;
}

/* ──────────────────────────────────────────────
   LEFT PANEL
─────────────────────────────────────────────── */
.left-panel {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px 56px;
  flex: 1;
}

@media (min-width: 1024px) {
  .left-panel { display: flex; }
}

/* Brand badge */
.brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(14, 165, 233, 0.08);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 100px;
  padding: 6px 16px;
  width: fit-content;
  animation: fadeSlideDown 0.6s ease both;
}
.badge-dot {
  width: 8px; height: 8px;
  background: #0ea5e9;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(14, 165, 233, 0.5);
  animation: blink 2s ease-in-out infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.badge-text {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  /* color: #0284c7; */
}

/* Brand block */
.brand-block {
  animation: fadeSlideUp 0.7s 0.1s ease both;
}
.logo-wrap {
  position: relative;
  display: inline-flex;
  margin-bottom: 20px;
}
.logo-img {
  height: 52px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05));
}
.logo-glow {
  position: absolute;
  inset: -8px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.15), transparent 70%);
  border-radius: 50%;
}
.brand-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 56px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
  background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}
.brand-dot { 
  color: #0ea5e9; 
  -webkit-text-fill-color: #0ea5e9; 
}
.brand-subtitle {
  font-size: 15px;
  color: #64748b;
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1.5; 
  max-width: 320px;
}

/* Feature list */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
}
.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(226, 232, 240, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 18px 20px;
  animation: fadeSlideUp 0.6s ease both;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01);
}
.feature-card:hover {
  border-color: rgba(56, 189, 248, 0.4);
  background: rgba(255, 255, 255, 0.9);
  transform: translateX(4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
}
.feature-icon-wrap {
  flex-shrink: 0;
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border: 1px solid rgba(186, 230, 253, 0.8);
  border-radius: 10px;
}
.feature-icon {
  width: 20px; height: 20px;
  color: #0284c7;
}
.feature-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}
.feature-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}

/* Year stamp */
.year-stamp {
  font-size: 12px;
  color: #94a3b8;
  letter-spacing: 0.02em;
}

/* ──────────────────────────────────────────────
   RIGHT PANEL
─────────────────────────────────────────────── */
.right-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  flex: 1;
}

/* Form card */
.form-card {
  position: relative;
  width: 100%;
  max-width: 460px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 28px;
  padding: 44px 40px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.02),
    0 20px 40px -8px rgba(15, 23, 42, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 1);
  animation: fadeIn 0.8s ease both;
  overflow: hidden;
}

/* Glow border */
.card-glow-border {
  position: absolute;
  inset: -1px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.3), transparent 50%, rgba(129, 140, 248, 0.2));
  z-index: -1;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  padding: 1px;
  pointer-events: none;
}

/* Form header */
.form-header {
  margin-bottom: 32px;
  animation: fadeSlideDown 0.6s 0.1s ease both;
}
.form-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0284c7;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 5px 12px;
  border-radius: 100px;
  margin-bottom: 20px;
}
.tag-icon { width: 14px; height: 14px; }

.form-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
  line-height: 1.1;
}
.form-subtitle {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
}

/* Login form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Field */
.field-group { display: flex; flex-direction: column; gap: 8px; }
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  letter-spacing: 0.01em;
}
.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.forgot-link {
  font-size: 12px;
  font-weight: 500;
  color: #0ea5e9;
  text-decoration: none;
  transition: color 0.2s;
}
.forgot-link:hover { color: #0284c7; }

.download-app-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.65rem;
  padding: 0.5rem 0.9rem;
  border-radius: 0.55rem;
  border: 1px solid rgba(14, 165, 233, 0.35);
  color: #0284c7;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
}
.download-app-link:hover {
  background: rgba(14, 165, 233, 0.08);
  border-color: rgba(14, 165, 233, 0.6);
}
.dl-icon { width: 15px; height: 15px; }

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 14px;
  width: 18px; height: 18px;
  color: #94a3b8;
  pointer-events: none;
  transition: color 0.3s, transform 0.3s;
  flex-shrink: 0;
}
.field-input {
  width: 100%;
  padding: 13px 14px 13px 42px;
  background: #fdfdfd;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  color: #0f172a;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
  outline: none;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.01);
}
.field-input::placeholder { color: #94a3b8; }
.field-input:hover {
  border-color: #cbd5e1;
}
.field-input:focus {
  border-color: #38bdf8;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.15), inset 0 2px 4px rgba(0,0,0,0.01);
}
.field-input:focus + .input-icon,
.input-wrap:focus-within .input-icon { 
  color: #0ea5e9;
  transform: scale(1.05);
}

/* Eye button */
.eye-btn {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
}
.eye-btn:hover { 
  color: #0ea5e9; 
  background: #f0f9ff; 
}
.eye-btn svg { width: 17px; height: 17px; }

/* Autofill override for light mode */
.field-input:-webkit-autofill,
.field-input:-webkit-autofill:hover,
.field-input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 40px #f8fafc inset !important;
  -webkit-text-fill-color: #0f172a !important;
  caret-color: #0f172a;
  border-color: #38bdf8 !important;
}

/* Checkbox */
.remember-row { display: flex; align-items: center; }
.custom-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}
.custom-checkbox input { display: none; }
.checkbox-box {
  width: 18px; height: 18px;
  border-radius: 5px;
  border: 1.5px solid #cbd5e1;
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}
.check-icon {
  width: 11px; height: 11px;
  color: #ffffff;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.custom-checkbox input:checked ~ .checkbox-box {
  background: #0ea5e9;
  border-color: #0ea5e9;
}
.custom-checkbox input:checked ~ .checkbox-box .check-icon {
  opacity: 1;
  transform: scale(1);
}
.checkbox-label {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

/* Submit button */
.submit-btn {
  position: relative;
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  overflow: hidden;
  background: linear-gradient(135deg, #0284c7, #0ea5e9, #38bdf8);
  color: #fff;
  letter-spacing: 0.02em;
  transition: transform 0.2s, box-shadow 0.3s, opacity 0.3s;
  box-shadow: 0 4px 14px rgba(14, 165, 233, 0.3), inset 0 1px 0 rgba(255,255,255,0.2);
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.4), inset 0 1px 0 rgba(255,255,255,0.2);
}
.submit-btn:active:not(:disabled) { transform: translateY(0); }
.submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

.btn-inner {
  display: flex; align-items: center; justify-content: center;
  gap: 10px; position: relative; z-index: 1;
}
.btn-icon { width: 18px; height: 18px; }
.spinner { width: 18px; height: 18px; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Shimmer */
.btn-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}
@keyframes shimmer {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}

/* Form footer */
.form-footer {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  animation: fadeIn 0.6s 0.4s ease both;
}
.form-footer p {
  font-size: 13px;
  color: #64748b;
}
.contact-link {
  color: #0ea5e9;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}
.contact-link:hover { color: #0284c7; }

.security-badges {
  display: flex;
  gap: 10px;
}
.s-badge {
  display: flex; align-items: center; gap: 5px;
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 100px;
  padding: 5px 14px;
  letter-spacing: 0.03em;
}
.s-badge svg { width: 13px; height: 13px; color: #0ea5e9; }

/* ──────────────────────────────────────────────
   ANIMATIONS
─────────────────────────────────────────────── */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeSlideDown {
  from { opacity: 0; transform: translateY(-16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ──────────────────────────────────────────────
   RESPONSIVE
─────────────────────────────────────────────── */
@media (max-width: 640px) {
  .form-card {
    padding: 32px 24px;
    border-radius: 20px;
    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05);
  }
  .form-title { font-size: 28px; }
}
</style>