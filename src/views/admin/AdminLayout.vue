<template>
  <div class="admin-page">
    <AdminHeader @logout="handleLogout" />

    <div class="admin-content">
      <AdminSidebar
        :active-menu="activeMenu"
        @menu-select="handleMenuSelect"
      />

      <main class="main-content">
        <DashboardView v-if="activeMenu === 'dashboard'" />
        <ArticleManagement v-if="activeMenu === 'articles'" />
        <CategoryManagement v-if="activeMenu === 'categories'" />
        <ProfileSettings v-if="activeMenu === 'profile'" />
        <ProjectManagement v-if="activeMenu === 'projects'" />
        <ResumeManagement v-if="activeMenu === 'resume'" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import AdminHeader from './components/AdminHeader.vue'
import AdminSidebar from './components/AdminSidebar.vue'
import DashboardView from './components/DashboardView.vue'
import ArticleManagement from './components/ArticleManagement.vue'
import CategoryManagement from './components/CategoryManagement.vue'
import ProfileSettings from './components/ProfileSettings.vue'
import ProjectManagement from './components/ProjectManagement.vue'
import ResumeManagement from './components/ResumeManagement.vue'

const router = useRouter()
const userStore = useUserStore()
const activeMenu = ref('dashboard')

function handleMenuSelect(key) {
  activeMenu.value = key
}

function handleLogout() {
  userStore.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-content {
  flex: 1;
  display: flex;
}

.main-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}
</style>