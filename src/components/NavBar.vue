<template>
  <el-header class="nav-bar">
    <div class="nav-container">
      <div class="logo" @click="$router.push('/')">
        <div class="logo-icon">
          <el-icon name="rocket" :size="32" />
        </div>
        <span class="logo-text">GALAXY<span class="logo-accent">BLOG</span></span>
      </div>

      <el-menu 
        :default-active="activeMenu" 
        class="nav-menu desktop-menu"
        mode="horizontal"
        router
      >
        <el-menu-item index="/">
          <template #icon><el-icon name="house" /></template>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/articles">
          <template #icon><el-icon name="document" /></template>
          <span>文章</span>
        </el-menu-item>
        <el-menu-item index="/diary">
          <template #icon><el-icon name="calendar" /></template>
          <span>日记</span>
        </el-menu-item>
        <el-menu-item index="/projects">
          <template #icon><el-icon name="folder-opened" /></template>
          <span>项目</span>
        </el-menu-item>
        <el-menu-item index="/about">
          <template #icon><el-icon name="user" /></template>
          <span>关于我</span>
        </el-menu-item>
        <el-menu-item index="/admin">
          <template #icon><el-icon name="setting" /></template>
          <span>管理</span>
        </el-menu-item>
      </el-menu>

      <button class="menu-toggle" @click="toggleMobileMenu">
        <el-icon :name="isMobileMenuOpen ? 'close' : 'menu'" />
      </button>
    </div>
    <div class="nav-glow"></div>

    <div class="mobile-overlay" :class="{ active: isMobileMenuOpen }" @click="closeMobileMenu"></div>
    
    <el-menu 
      :default-active="activeMenu" 
      class="mobile-menu"
      :class="{ open: isMobileMenuOpen }"
      mode="vertical"
      router
    >
      <div class="mobile-menu-header">
        <span class="mobile-menu-title">导航菜单</span>
        <button class="mobile-close-btn" @click="closeMobileMenu">
          <el-icon name="close" />
        </button>
      </div>
      <div class="mobile-menu-divider"></div>
      <el-menu-item index="/">
        <template #icon><el-icon name="house" /></template>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/articles">
        <template #icon><el-icon name="document" /></template>
        <span>文章</span>
      </el-menu-item>
      <el-menu-item index="/diary">
        <template #icon><el-icon name="calendar" /></template>
        <span>日记</span>
      </el-menu-item>
      <el-menu-item index="/projects">
        <template #icon><el-icon name="folder-opened" /></template>
        <span>项目</span>
      </el-menu-item>
      <el-menu-item index="/about">
        <template #icon><el-icon name="user" /></template>
        <span>关于我</span>
      </el-menu-item>
      <el-menu-item index="/admin">
        <template #icon><el-icon name="setting" /></template>
        <span>管理</span>
      </el-menu-item>
      <div class="mobile-menu-footer">
        <p class="footer-text">探索宇宙，发现无限可能</p>
      </div>
    </el-menu>
  </el-header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isMobileMenuOpen = ref(false)

const activeMenu = computed(() => route.path)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  updateBodyScroll()
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  updateBodyScroll()
}

const updateBodyScroll = () => {
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}

const handleResize = () => {
  if (window.innerWidth >= 768) {
    isMobileMenuOpen.value = false
    updateBodyScroll()
  }
}

watch(() => route.path, () => {
  closeMobileMenu()
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.nav-bar {
  background: linear-gradient(180deg, rgba(10, 10, 26, 0.98) 0%, rgba(13, 13, 36, 0.95) 100%);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  box-shadow: 
    0 0 30px rgba(0, 212, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.nav-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.8), transparent);
  animation: glow-pulse 3s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo-icon {
  color: #00d4ff;
  animation: star-rotate 8s linear infinite;
}

@keyframes star-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.logo-text {
  color: #fff;
  font-family: 'Orbitron', sans-serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 3px;
}

.logo-accent {
  color: #ffb800;
}

.nav-menu.desktop-menu {
  flex: 1;
  justify-content: flex-end;
  background: transparent;
  border: none;
}

.nav-menu.desktop-menu .el-menu-item {
  color: var(--text-muted);
  border-radius: var(--radius-md);
  margin: 0 6px;
  padding: 0 18px;
  font-family: var(--font-family-body);
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 1px;
  transition: all var(--transition-fast);
}

.nav-menu.desktop-menu .el-menu-item:hover,
.nav-menu.desktop-menu .el-menu-item.is-active {
  background: rgba(0, 212, 255, 0.15);
  color: var(--neon-blue);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.25);
  transform: translateY(-2px);
}

.menu-toggle {
  display: none;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: var(--neon-blue);
  padding: 10px 14px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.menu-toggle:hover {
  background: rgba(0, 212, 255, 0.2);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
}

.mobile-overlay {
  display: none;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 998;
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.mobile-overlay.active {
  display: block;
  opacity: 1;
}

.mobile-menu {
  position: fixed;
  top: 60px;
  right: -280px;
  width: 280px;
  height: calc(100vh - 60px);
  background: linear-gradient(180deg, rgba(10, 10, 26, 0.995) 0%, rgba(13, 13, 36, 0.99) 100%);
  border-left: 1px solid rgba(0, 212, 255, 0.2);
  z-index: 999;
  transition: right var(--transition-normal);
  flex-direction: column;
  padding: 0;
  margin: 0;
}

.mobile-menu.open {
  right: 0;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.15);
}

.mobile-menu-title {
  color: var(--neon-blue);
  font-family: var(--font-family-display);
  font-size: 16px;
  letter-spacing: 2px;
}

.mobile-close-btn {
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: var(--neon-blue);
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.mobile-close-btn:hover {
  background: rgba(0, 212, 255, 0.2);
}

.mobile-menu-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent);
  margin: 0 20px;
}

.mobile-menu .el-menu-item {
  color: var(--text-muted);
  border-radius: 0;
  margin: 0;
  padding: 16px 24px;
  font-family: var(--font-family-body);
  font-size: 16px;
  transition: all var(--transition-fast);
  border-left: 3px solid transparent;
}

.mobile-menu .el-menu-item:hover,
.mobile-menu .el-menu-item.is-active {
  background: rgba(0, 212, 255, 0.1);
  color: var(--neon-blue);
  border-left-color: var(--neon-blue);
  padding-left: 30px;
}

.mobile-menu-footer {
  margin-top: auto;
  padding: 24px;
  border-top: 1px solid rgba(0, 212, 255, 0.15);
}

.footer-text {
  color: var(--text-disabled);
  font-size: 13px;
  text-align: center;
  margin: 0;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 15px;
  }
  
  .logo-text {
    font-size: 18px;
    letter-spacing: 2px;
  }
  
  .menu-toggle {
    display: block;
  }
  
  .desktop-menu {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 12px;
  }
  
  .logo-text {
    font-size: 16px;
    letter-spacing: 1px;
  }
  
  .logo-accent {
    display: none;
  }
}
</style>