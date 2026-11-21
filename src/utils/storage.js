export function getStorage(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key)
    if (value === null) return defaultValue
    return JSON.parse(value)
  } catch (e) {
    console.error('Error reading from localStorage:', e)
    return defaultValue
  }
}

export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    console.error('Error writing to localStorage:', e)
    return false
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (e) {
    console.error('Error removing from localStorage:', e)
    return false
  }
}

export function clearStorage() {
  try {
    localStorage.clear()
    return true
  } catch (e) {
    console.error('Error clearing localStorage:', e)
    return false
  }
}

export function hasStorage(key) {
  try {
    return localStorage.getItem(key) !== null
  } catch (e) {
    return false
  }
}