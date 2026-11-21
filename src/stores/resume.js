import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useResumeStore = defineStore('resume', () => {
  const resumes = ref([])
  const loading = ref(false)
  const error = ref(null)

  const latestResume = computed(() => {
    if (resumes.value.length === 0) return null
    return resumes.value.reduce((latest, resume) => {
      return new Date(resume.uploadedAt) > new Date(latest.uploadedAt) ? resume : latest
    })
  })

  const hasResume = computed(() => resumes.value.length > 0)

  function validateFile(file) {
    if (!file) {
      return { valid: false, message: '请选择文件' }
    }
    
    const allowedTypes = ['application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, message: '仅支持PDF格式文件' }
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return { valid: false, message: '文件大小不能超过5MB' }
    }

    return { valid: true, message: '' }
  }

  async function uploadResume(file) {
    loading.value = true
    error.value = null

    try {
      const validation = validateFile(file)
      if (!validation.valid) {
        throw new Error(validation.message)
      }

      const arrayBuffer = await file.arrayBuffer()
      const base64Content = Buffer.from(arrayBuffer).toString('base64')

      const newResume = {
        id: Date.now().toString(),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        content: base64Content,
        uploadedAt: new Date().toISOString(),
        version: resumes.value.length + 1
      }

      resumes.value.push(newResume)
      localStorage.setItem('resumes', JSON.stringify(resumes.value))

      return newResume
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  function downloadResume(resume = latestResume.value) {
    if (!resume) {
      throw new Error('没有找到简历文件')
    }

    try {
      const blob = base64ToBlob(resume.content, resume.fileType)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = resume.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      return true
    } catch (e) {
      error.value = e.message
      throw e
    }
  }

  function deleteResume(id) {
    const index = resumes.value.findIndex(r => r.id === id)
    if (index !== -1) {
      resumes.value.splice(index, 1)
      localStorage.setItem('resumes', JSON.stringify(resumes.value))
      return true
    }
    return false
  }

  function loadResumes() {
    try {
      const stored = localStorage.getItem('resumes')
      if (stored) {
        resumes.value = JSON.parse(stored)
      } else {
        resumes.value = [
          {
            id: '1',
            fileName: '杨浩-数据分析工程师简历.pdf',
            fileType: 'application/pdf',
            fileSize: 102400,
            content: generateMockPdfContent(),
            uploadedAt: '2024-01-15T10:30:00.000Z',
            version: 1
          }
        ]
      }
    } catch (e) {
      console.error('Failed to load resumes:', e)
    }
  }

  function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64)
    const byteArrays = []
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512)
      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }
    return new Blob(byteArrays, { type: mimeType })
  }

  function generateMockPdfContent() {
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Resources <<
/Font <<
/F1 4 0 R
>>
>>
/Contents 5 0 R
>>
endobj
4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
5 0 obj
<<
/Length 80
>>
stream
BT
/F1 24 Tf
72 700 Td
(杨浩 - 数据分析工程师简历) Tj
/F1 18 Tf
72 650 Td
(联系方式：yahoo05@nuaa.edu.cn) Tj
72 620 Td
(电话：+86 16651103578) Tj
72 590 Td
(地址：江苏省南京市秦淮区) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000195 00000 n 
0000000280 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
420
%%EOF`
    return Buffer.from(pdfContent).toString('base64')
  }

  return {
    resumes,
    loading,
    error,
    latestResume,
    hasResume,
    validateFile,
    uploadResume,
    downloadResume,
    deleteResume,
    loadResumes
  }
})