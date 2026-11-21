import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'blog_avatar'

function loadAvatar() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load avatar from localStorage:', e)
  }
  return null
}

function saveAvatar(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save avatar to localStorage:', e)
  }
}

export const useAvatarStore = defineStore('avatar', () => {
  const avatarData = ref(loadAvatar())

  const avatarUrl = ref('')

  function getAvatarUrl() {
    if (avatarData.value && 
        avatarData.value.base64 && 
        avatarData.value.type && 
        avatarData.value.base64.length > 0) {
      return `data:${avatarData.value.type};base64,${avatarData.value.base64}`
    }
    return null
  }

  function validateImage(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    const maxSize = 5 * 1024 * 1024

    if (!validTypes.includes(file.type)) {
      return { valid: false, message: '请选择 JPG 或 PNG 格式的图片' }
    }

    if (file.size > maxSize) {
      return { valid: false, message: '图片大小不能超过 5MB' }
    }

    return { valid: true, message: '' }
  }

  function resizeImage(file, maxWidth = 300, maxHeight = 300) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          let width = img.width
          let height = img.height

          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob((blob) => {
            const blobReader = new FileReader()
            blobReader.onload = (event) => {
              resolve({
                base64: event.target.result.split(',')[1],
                type: blob.type,
                width,
                height
              })
            }
            blobReader.readAsDataURL(blob)
          }, file.type, 0.9)
        }
        img.onerror = reject
        img.src = e.target.result
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function uploadAvatar(file) {
    const validation = validateImage(file)
    if (!validation.valid) {
      throw new Error(validation.message)
    }

    try {
      const resized = await resizeImage(file)
      avatarData.value = resized
      saveAvatar(resized)
      
      const logEntry = {
        timestamp: new Date().toISOString(),
        action: 'UPLOAD_AVATAR',
        type: resized.type,
        size: file.size
      }
      console.log('[Avatar Store] Uploaded avatar:', logEntry)
      
      try {
        const logs = JSON.parse(localStorage.getItem('blog_avatar_logs') || '[]')
        logs.unshift(logEntry)
        if (logs.length > 20) logs.pop()
        localStorage.setItem('blog_avatar_logs', JSON.stringify(logs))
      } catch (e) {
        console.error('[Avatar Store] Failed to log upload:', e)
      }
      
      return true
    } catch (e) {
      throw new Error('图片处理失败: ' + e.message)
    }
  }

  function deleteAvatar() {
    avatarData.value = null
    saveAvatar(null)
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: 'DELETE_AVATAR'
    }
    console.log('[Avatar Store] Deleted avatar:', logEntry)
    
    try {
      const logs = JSON.parse(localStorage.getItem('blog_avatar_logs') || '[]')
      logs.unshift(logEntry)
      if (logs.length > 20) logs.pop()
      localStorage.setItem('blog_avatar_logs', JSON.stringify(logs))
    } catch (e) {
      console.error('[Avatar Store] Failed to log deletion:', e)
    }
  }

  return {
    avatarData,
    getAvatarUrl,
    validateImage,
    uploadAvatar,
    deleteAvatar
  }
})