<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-icon">
            <el-icon name="lock" :size="48" />
          </div>
          <h1>管理员登录</h1>
          <p>请输入您的账号信息</p>
        </div>

        <el-form :model="loginForm" class="login-form" label-position="top" @submit.prevent="handleLogin">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              prefix-icon="user"
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="lock"
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item>
            <el-button 
              type="primary" 
              class="login-btn"
              :loading="loading"
              @click="handleLogin"
            >
              <el-icon name="log-in" /> 登录
            </el-button>
          </el-form-item>

        </el-form>

        <div v-if="error" class="error-message">
          <el-icon name="warning" /> {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const loginForm = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    error.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const success = await userStore.login(loginForm.username, loginForm.password)
    
    if (success) {
      ElMessage.success('登录成功')
      router.push('/admin')
    } else {
      error.value = userStore.error || '登录失败'
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(10, 10, 26, 0.95) 0%, rgba(26, 26, 62, 0.9) 50%, rgba(10, 10, 26, 0.95) 100%);
  position: relative;
}

.login-page::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 20px;
}

.login-card {
  background: rgba(10, 10, 26, 0.85);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 
    0 0 40px rgba(0, 212, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.login-header {
  text-align: center;
  margin-bottom: 35px;
}

.logo-icon {
  color: #00d4ff;
  margin-bottom: 15px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.login-header h1 {
  color: #fff;
  font-family: 'Orbitron', sans-serif;
  font-size: 28px;
  margin-bottom: 8px;
}

.login-header p {
  color: #718096;
  font-size: 14px;
}

.login-form {
  margin-bottom: 20px;
}

.login-form .el-form-item {
  margin-bottom: 20px;
  margin-top: 0;
  padding: 0;
}

.login-form .el-form-item__content {
  width: 100%;
}

.login-form .el-input {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 10px;
  width: 100%;
}

.login-form .el-input__wrapper {
  padding: 0 15px;
  height: 48px;
}

.login-form .el-input__inner {
  color: #fff;
  background: transparent;
  height: 100%;
  line-height: 48px;
}

.login-form .el-input__prefix {
  color: #00d4ff;
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  background: linear-gradient(135deg, #00d4ff 0%, #1a1a3e 100%);
  border: none;
  border-radius: 10px;
  transition: all 0.3s;
}

.login-btn:hover {
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
  transform: translateY(-2px);
}

.login-hint {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 12px;
  color: #4a5568;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #f56565;
  font-size: 14px;
  padding: 12px;
  background: rgba(245, 101, 101, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(245, 101, 101, 0.3);
}
</style>