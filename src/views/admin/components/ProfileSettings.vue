<template>
  <div class="profile-content">
    <div class="profile-card avatar-card">
      <h3><el-icon name="user" /> 头像管理</h3>
      <div class="avatar-upload-container">
        <div class="avatar-preview">
          <img
            v-if="avatarPreview"
            :src="avatarPreview"
            class="avatar-image"
            alt="头像预览"
          />
          <div v-else class="avatar-placeholder">
            <el-icon name="user" :size="48" />
            <span>暂无头像</span>
          </div>
        </div>
        <div class="avatar-actions">
          <el-button
            type="primary"
            @click="triggerAvatarUpload"
            :loading="uploadingAvatar"
          >
            <el-icon name="upload" /> 上传头像
          </el-button>
          <el-button
            v-if="avatarPreview"
            type="danger"
            @click="handleDeleteAvatar"
          >
            <el-icon name="delete" /> 删除头像
          </el-button>
        </div>
        <div class="avatar-hint">
          <el-icon name="info" :size="14" />
          <span>支持 JPG/PNG 格式，大小不超过 5MB</span>
        </div>
        <input
          ref="avatarInput"
          type="file"
          accept="image/jpeg,image/png"
          class="avatar-file-input"
          @change="handleAvatarFile"
        />
      </div>
    </div>

    <div class="profile-card">
      <h3><el-icon name="setting" /> 个人信息</h3>
      <el-form :model="profileForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="profileForm.username" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="profileForm.email" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="profileForm.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveProfile">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useAvatarStore } from '../../../stores/avatar'

const avatarStore = useAvatarStore()

const avatarInput = ref(null)
const uploadingAvatar = ref(false)
const avatarPreview = ref('')

const profileForm = ref({
  username: 'admin',
  email: 'admin@example.com',
  name: '管理员'
})

onMounted(() => {
  avatarPreview.value = avatarStore.getAvatarUrl()
})

function triggerAvatarUpload() {
  avatarInput.value?.click()
}

async function handleAvatarFile(event) {
  const files = event.target?.files
  if (!files || files.length === 0) return

  const file = files[0]

  const validation = avatarStore.validateImage(file)
  if (!validation.valid) {
    ElMessage.error(validation.message)
    event.target.value = ''
    return
  }

  uploadingAvatar.value = true

  try {
    await avatarStore.uploadAvatar(file)
    avatarPreview.value = avatarStore.getAvatarUrl()
    ElMessage.success('头像上传成功')
  } catch (e) {
    ElMessage.error('头像上传失败: ' + e.message)
  } finally {
    uploadingAvatar.value = false
    event.target.value = ''
  }
}

async function handleDeleteAvatar() {
  const confirm = await ElMessageBox.confirm(
    '确定要删除头像吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )

  if (confirm) {
    avatarStore.deleteAvatar()
    avatarPreview.value = ''
    ElMessage.success('头像已删除')
  }
}

function saveProfile() {
  ElMessage.success('保存成功')
}
</script>

<style scoped>
.profile-content {
  max-width: 600px;
}

.profile-card {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
  padding: 25px;
}

.profile-card h3 {
  color: #00d4ff;
  margin: 0 0 20px 0;
}

.avatar-card {
  margin-bottom: 20px;
}

.avatar-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.avatar-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(0, 212, 255, 0.3);
  background: rgba(26, 26, 62, 0.8);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #4a5568;
}

.avatar-placeholder el-icon {
  margin-bottom: 8px;
}

.avatar-placeholder span {
  font-size: 0.875rem;
}

.avatar-actions {
  display: flex;
  gap: 10px;
}

.avatar-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #718096;
  font-size: 0.875rem;
}

.avatar-file-input {
  display: none;
}
</style>