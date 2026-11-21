import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  async function login(username, password) {
    loading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      if (username === 'admin' && password === 'admin') {
        user.value = {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          name: '管理员',
          avatar: null,
          role: 'admin'
        }
        token.value = 'mock-jwt-token-' + Date.now()
        localStorage.setItem('token', token.value)
        return true
      } else {
        throw new Error('用户名或密码错误')
      }
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  async function fetchUser() {
    if (!token.value) return
    loading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      user.value = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        name: '管理员',
        avatar: null,
        role: 'admin'
      }
    } catch (e) {
      error.value = e.message
      token.value = null
      localStorage.removeItem('token')
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isLoggedIn,
    login,
    logout,
    fetchUser
  }
})
