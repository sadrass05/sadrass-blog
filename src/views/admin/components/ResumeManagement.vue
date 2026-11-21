<template>
  <div class="resume-content">
    <div class="content-header">
      <h2>简历管理</h2>
    </div>

    <div class="resume-upload-section">
      <el-card class="upload-card">
        <h3>上传简历</h3>
        <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
          <input
            ref="fileInput"
            type="file"
            accept=".pdf"
            class="file-input"
            @change="handleFileSelect"
          />
          <div class="upload-icon">
            <el-icon name="upload" :size="48" />
          </div>
          <p>点击或拖拽 PDF 文件到此处上传</p>
          <p class="upload-hint">仅支持 PDF 格式，最大 5MB</p>
        </div>
        <div v-if="uploading" class="upload-progress">
          <el-progress :percentage="uploadProgress" />
        </div>
      </el-card>
    </div>

    <div class="resume-list-section">
      <h3>简历版本列表</h3>
      <el-table
        :data="resumeStore.resumes"
        border
        class="resume-table"
      >
        <el-table-column prop="fileName" label="文件名" min-width="200" />
        <el-table-column prop="fileSize" label="文件大小" width="120">
          <template #default="scope">
            {{ formatFileSize(scope.row.fileSize) }}
          </template>
        </el-table-column>
        <el-table-column prop="uploadedAt" label="上传时间" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.uploadedAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本" width="80">
          <template #default="scope">
            <el-tag type="success">v{{ scope.row.version }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="downloadResume(scope.row)"
            >
              <el-icon name="download" /> 下载
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteResume(scope.row.id)"
            >
              <el-icon name="delete" /> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="resumeStore.resumes.length === 0" class="empty-state">
        <el-icon name="file-text" :size="48" />
        <p>暂无简历文件，请上传</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useResumeStore } from '../../../stores/resume'

const resumeStore = useResumeStore()

const fileInput = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)

onMounted(() => {
  resumeStore.loadResumes()
})

function triggerFileInput() {
  fileInput.value?.click()
}

function handleDrop(event) {
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

function handleFileSelect(event) {
  const files = event.target?.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

async function handleFile(file) {
  const validation = resumeStore.validateFile(file)
  if (!validation.valid) {
    ElMessage.error(validation.message)
    return
  }

  uploading.value = true
  uploadProgress.value = 0

  try {
    const progressInterval = setInterval(() => {
      uploadProgress.value += Math.random() * 30
      if (uploadProgress.value > 90) {
        uploadProgress.value = 90
      }
    }, 200)

    await resumeStore.uploadResume(file)

    clearInterval(progressInterval)
    uploadProgress.value = 100

    setTimeout(() => {
      uploading.value = false
      uploadProgress.value = 0
    }, 500)

    ElMessage.success('简历上传成功')
  } catch (error) {
    ElMessage.error(`上传失败：${error.message}`)
    uploading.value = false
    uploadProgress.value = 0
  }
}

function downloadResume(resume) {
  try {
    resumeStore.downloadResume(resume)
    ElMessage.success('简历下载成功')
  } catch (error) {
    ElMessage.error(`下载失败：${error.message}`)
  }
}

async function deleteResume(id) {
  const confirm = await ElMessageBox.confirm(
    '确定要删除这份简历吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )

  if (confirm) {
    const success = resumeStore.deleteResume(id)
    if (success) {
      ElMessage.success('删除成功')
    } else {
      ElMessage.error('删除失败')
    }
  }
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

function formatDateTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
</script>

<style scoped>
.resume-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.content-header h2 {
  color: #fff;
  margin: 0;
}

.resume-upload-section {
  margin-bottom: 20px;
}

.upload-card {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
}

.upload-card h3 {
  color: #00d4ff;
  margin: 0 0 20px 0;
  font-size: 1rem;
}

.upload-area {
  border: 2px dashed rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(0, 212, 255, 0.05);
}

.upload-area:hover {
  border-color: #00d4ff;
  background: rgba(0, 212, 255, 0.1);
}

.file-input {
  display: none;
}

.upload-icon {
  color: #00d4ff;
  margin-bottom: 15px;
}

.upload-area p {
  color: #a0aec0;
  margin: 0 0 8px 0;
}

.upload-hint {
  font-size: 0.875rem;
  color: #4a5568 !important;
}

.upload-progress {
  margin-top: 20px;
}

.resume-list-section h3 {
  color: #00d4ff;
  margin: 0 0 20px 0;
  font-size: 1rem;
}

.resume-table {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #4a5568;
}

.empty-state el-icon {
  margin-bottom: 15px;
}
</style>