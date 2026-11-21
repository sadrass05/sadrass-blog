<template>
  <header class="admin-header">
    <div class="header-left">
      <el-icon name="layout-dashboard" :size="32" />
      <h1>后台管理</h1>
    </div>
    <div class="header-right">
      <div class="user-info">
        <el-icon name="user" :size="24" />
        <span>管理员</span>
      </div>
      <el-button type="danger" @click="handleLogout">
        <el-icon name="log-out" /> 退出
      </el-button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '../../../stores/user'

const emit = defineEmits(['logout'])
const router = useRouter()
const userStore = useUserStore()

async function handleLogout() {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    userStore.logout()
    router.push('/admin/login')
  } catch {
  }
}
</script>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgba(26, 26, 62, 0.95);
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left h1 {
  color: #fff;
  margin: 0;
  font-size: 1.5rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a0aec0;
}
</style>