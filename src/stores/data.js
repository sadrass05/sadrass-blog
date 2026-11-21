import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEYS = {
  articles: 'blog_articles',
  projects: 'blog_projects',
  diary: 'diary-data',
  resume: 'blog_resume',
  avatar: 'blog_avatar',
  comments: 'blog_comments'
}

export const useDataStore = defineStore('data', () => {
  const lastBackupTime = ref(null)
  const backupHistory = ref([])

  const saveData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      logOperation('save', key, data.length)
      return true
    } catch (e) {
      console.error(`Failed to save ${key}:`, e)
      logOperation('save_failed', key, null, e.message)
      return false
    }
  }

  const loadData = (key, defaultValue = []) => {
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const data = JSON.parse(saved)
        logOperation('load', key, data.length)
        return data
      }
    } catch (e) {
      console.error(`Failed to load ${key}:`, e)
      logOperation('load_failed', key, null, e.message)
    }
    logOperation('load_default', key, defaultValue.length)
    return defaultValue
  }

  const deleteData = (key) => {
    try {
      localStorage.removeItem(key)
      logOperation('delete', key, 0)
      return true
    } catch (e) {
      console.error(`Failed to delete ${key}:`, e)
      logOperation('delete_failed', key, null, e.message)
      return false
    }
  }

  const createBackup = () => {
    try {
      const backup = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        data: {}
      }

      Object.keys(STORAGE_KEYS).forEach(key => {
        const value = localStorage.getItem(STORAGE_KEYS[key])
        if (value) {
          backup.data[key] = JSON.parse(value)
        }
      })

      const backupKey = `blog_backup_${backup.id}`
      localStorage.setItem(backupKey, JSON.stringify(backup))

      backupHistory.value.unshift({
        id: backup.id,
        timestamp: backup.timestamp,
        size: JSON.stringify(backup).length
      })

      if (backupHistory.value.length > 10) {
        const oldBackup = backupHistory.value.pop()
        localStorage.removeItem(`blog_backup_${oldBackup.id}`)
      }

      lastBackupTime.value = backup.timestamp
      logOperation('backup', 'all', backupHistory.value.length)
      return backup
    } catch (e) {
      console.error('Failed to create backup:', e)
      logOperation('backup_failed', 'all', null, e.message)
      return null
    }
  }

  const restoreBackup = (backupId) => {
    try {
      const backupKey = `blog_backup_${backupId}`
      const backupData = localStorage.getItem(backupKey)
      
      if (!backupData) {
        throw new Error('Backup not found')
      }

      const backup = JSON.parse(backupData)
      
      Object.keys(backup.data).forEach(key => {
        if (STORAGE_KEYS[key]) {
          const backupValue = backup.data[key]
          if (backupValue !== null && backupValue !== undefined) {
            localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(backupValue))
          }
        }
      })

      logOperation('restore', 'all', Object.keys(backup.data).length)
      return true
    } catch (e) {
      console.error('Failed to restore backup:', e)
      logOperation('restore_failed', 'all', null, e.message)
      return false
    }
  }

  const deleteBackup = (backupId) => {
    try {
      const backupKey = `blog_backup_${backupId}`
      localStorage.removeItem(backupKey)
      backupHistory.value = backupHistory.value.filter(b => b.id !== backupId)
      logOperation('delete_backup', backupId, 0)
      return true
    } catch (e) {
      console.error('Failed to delete backup:', e)
      return false
    }
  }

  const validateData = () => {
    const results = {}
    Object.keys(STORAGE_KEYS).forEach(key => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS[key])
        if (saved) {
          JSON.parse(saved)
          results[key] = { valid: true, message: 'OK' }
        } else {
          results[key] = { valid: true, message: 'Empty (using defaults)' }
        }
      } catch (e) {
        results[key] = { valid: false, message: e.message }
      }
    })
    return results
  }

  const exportAllData = () => {
    try {
      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        data: {}
      }

      Object.keys(STORAGE_KEYS).forEach(key => {
        const value = localStorage.getItem(STORAGE_KEYS[key])
        if (value) {
          exportData.data[key] = JSON.parse(value)
        }
      })

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `blog-backup-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      logOperation('export', 'all', Object.keys(exportData.data).length)
      return true
    } catch (e) {
      console.error('Failed to export data:', e)
      logOperation('export_failed', 'all', null, e.message)
      return false
    }
  }

  const importData = (jsonString) => {
    try {
      const importData = JSON.parse(jsonString)
      
      if (!importData.data) {
        throw new Error('Invalid backup format')
      }

      createBackup()

      Object.keys(importData.data).forEach(key => {
        if (STORAGE_KEYS[key]) {
          const importValue = importData.data[key]
          if (importValue !== null && importValue !== undefined) {
            localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(importValue))
          }
        }
      })

      logOperation('import', 'all', Object.keys(importData.data).length)
      return true
    } catch (e) {
      console.error('Failed to import data:', e)
      logOperation('import_failed', 'all', null, e.message)
      return false
    }
  }

  const logOperation = (action, key, count, error = null) => {
    const log = {
      timestamp: new Date().toISOString(),
      action,
      key,
      count,
      error
    }
    
    const logs = JSON.parse(localStorage.getItem('blog_operation_logs') || '[]')
    logs.unshift(log)
    
    if (logs.length > 100) {
      logs.pop()
    }
    
    localStorage.setItem('blog_operation_logs', JSON.stringify(logs))
  }

  const getOperationLogs = () => {
    return JSON.parse(localStorage.getItem('blog_operation_logs') || '[]')
  }

  const clearLogs = () => {
    localStorage.removeItem('blog_operation_logs')
  }

  return {
    lastBackupTime,
    backupHistory,
    saveData,
    loadData,
    deleteData,
    createBackup,
    restoreBackup,
    deleteBackup,
    validateData,
    exportAllData,
    importData,
    getOperationLogs,
    clearLogs,
    STORAGE_KEYS
  }
})