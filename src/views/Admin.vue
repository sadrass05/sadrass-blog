<template>
  <div class="admin-page">
    <div class="admin-header">
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
    </div>

    <div class="admin-content">
      <aside class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="admin-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="dashboard">
            <template #icon><el-icon name="layout-dashboard" /></template>
            <span>数据概览</span>
          </el-menu-item>
          <el-menu-item index="articles">
            <template #icon><el-icon name="document" /></template>
            <span>文章管理</span>
          </el-menu-item>
          <el-menu-item index="categories">
            <template #icon><el-icon name="folder" /></template>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="profile">
            <template #icon><el-icon name="user" /></template>
            <span>个人设置</span>
          </el-menu-item>
          <el-menu-item index="resume">
            <template #icon><el-icon name="file-text" /></template>
            <span>简历管理</span>
          </el-menu-item>
          <el-menu-item index="projects">
            <template #icon><el-icon name="folder-opened" /></template>
            <span>项目管理</span>
          </el-menu-item>
        </el-menu>
      </aside>

      <main class="main-content">
        <div v-if="activeMenu === 'dashboard'" class="dashboard-content">
          <div class="stats-grid">
            <div class="stat-card blue">
              <div class="stat-icon"><el-icon name="document" /></div>
              <div class="stat-info">
                <span class="stat-value">{{ articleStats.total }}</span>
                <span class="stat-label">文章总数</span>
              </div>
            </div>
            <div class="stat-card gold">
              <div class="stat-icon"><el-icon name="calendar" /></div>
              <div class="stat-info">
                <span class="stat-value">{{ articleStats.published }}</span>
                <span class="stat-label">已发布</span>
              </div>
            </div>
            <div class="stat-card orange">
              <div class="stat-icon"><el-icon name="file-text" /></div>
              <div class="stat-info">
                <span class="stat-value">{{ articleStats.draft }}</span>
                <span class="stat-label">草稿</span>
              </div>
            </div>
            <div class="stat-card green">
              <div class="stat-icon"><el-icon name="eye" /></div>
              <div class="stat-info">
                <span class="stat-value">{{ totalViews }}</span>
                <span class="stat-label">总访问量</span>
              </div>
            </div>
          </div>

          <div class="charts-row">
            <div class="chart-card">
              <h3>文章分类分布</h3>
              <div class="category-chart">
                <div
                  v-for="cat in categoryStats"
                  :key="cat.name"
                  class="chart-item"
                >
                  <span class="chart-label">{{ cat.name }}</span>
                  <div class="chart-bar-bg">
                    <div
                      class="chart-bar"
                      :style="{ width: cat.percentage + '%' }"
                      :class="cat.color"
                    ></div>
                  </div>
                  <span class="chart-value">{{ cat.count }}</span>
                </div>
              </div>
            </div>

            <div class="chart-card">
              <h3>最近文章</h3>
              <div class="recent-articles">
                <div
                  v-for="article in recentArticles"
                  :key="article.id"
                  class="recent-item"
                >
                  <div class="recent-title">{{ article.title }}</div>
                  <div class="recent-meta">
                    <span>{{ article.publishTime || article.createdAt }}</span>
                    <span class="status-badge" :class="article.status">
                      {{ article.status === 'published' ? '已发布' : '草稿' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeMenu === 'articles'" class="articles-content">
          <div class="content-header">
            <h2>文章管理</h2>
            <el-button type="primary" @click="$router.push('/admin/article/new')">
              <el-icon name="plus" /> 新建文章
            </el-button>
          </div>

          <div class="filter-bar">
            <el-input
              v-model="searchQuery"
              placeholder="搜索文章标题..."
              class="search-input"
            >
              <template #append>
                <el-button @click="handleSearch">
                  <el-icon name="search" />
                </el-button>
              </template>
            </el-input>

            <el-select
              v-model="filterStatus"
              placeholder="选择状态"
              class="status-filter"
            >
              <el-option label="全部" value="" />
              <el-option label="已发布" value="published" />
              <el-option label="草稿" value="draft" />
            </el-select>

            <el-select
              v-model="filterCategory"
              placeholder="选择分类"
              class="category-filter"
            >
              <el-option label="全部" :value="0" />
              <el-option
                v-for="cat in allCategories"
                :key="cat.id"
                :label="cat.name"
                :value="cat.id"
              />
            </el-select>
          </div>

          <el-table
            :data="filteredArticles"
            border
            class="article-table"
          >
            <el-table-column prop="title" label="标题" min-width="200">
              <template #default="scope">
                <a
                  class="title-link"
                  @click="$router.push(`/admin/article/${scope.row.id}`)"
                >
                  {{ scope.row.title }}
                </a>
              </template>
            </el-table-column>
            <el-table-column prop="categoryId" label="分类" width="120">
              <template #default="scope">
                {{ articleStore.getCategoryName(scope.row.categoryId) }}
              </template>
            </el-table-column>
            <el-table-column prop="publishTime" label="发布时间" width="160">
              <template #default="scope">
                {{ scope.row.publishTime || scope.row.createdAt }}
              </template>
            </el-table-column>
            <el-table-column prop="views" label="阅读量" width="80" />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="scope">
                <el-tag
                  :class="scope.row.status === 'published' ? 'success' : 'warning'"
                >
                  {{ scope.row.status === 'published' ? '已发布' : '草稿' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-button
                  size="small"
                  @click="$router.push(`/admin/article/${scope.row.id}`)"
                >
                  <el-icon name="edit" /> 编辑
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.row.id)"
                >
                  <el-icon name="delete" /> 删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination
              v-model:current-page="currentPage"
              :page-size="pageSize"
              :total="filteredArticles.length"
              layout="total, prev, pager, next, jumper"
            />
          </div>
        </div>

        <div v-if="activeMenu === 'categories'" class="categories-content">
          <div class="content-header">
            <h2>分类管理</h2>
            <el-button type="primary" @click="showAddCategory = true">
              <el-icon name="plus" /> 添加分类
            </el-button>
          </div>

          <div class="category-tree-container">
            <el-tree
              :data="categoryTreeData"
              :props="treeProps"
              :expand-on-click-node="false"
              class="category-tree"
            >
              <template #default="{ node, data }">
                <span class="tree-node">
                  {{ node.label }}
                  <span class="node-count">({{ getArticleCount(data.id) }})</span>
                </span>
                <span class="tree-actions">
                  <el-button
                    size="mini"
                    @click.stop="editCategory(data)"
                  >
                    <el-icon name="edit" />
                  </el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click.stop="deleteCategory(data)"
                  >
                    <el-icon name="delete" />
                  </el-button>
                </span>
              </template>
            </el-tree>
          </div>
        </div>

        <div v-if="activeMenu === 'profile'" class="profile-content">
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

        <div v-if="activeMenu === 'projects'" class="projects-content">
          <div class="content-header">
            <h2>项目管理</h2>
            <el-button type="primary" @click="showAddProject = true">
              <el-icon name="plus" /> 新建项目
            </el-button>
          </div>

          <div class="filter-bar">
            <el-input
              v-model="projectSearchQuery"
              placeholder="搜索项目名称..."
              class="search-input"
            >
              <template #append>
                <el-button @click="handleProjectSearch">
                  <el-icon name="search" />
                </el-button>
              </template>
            </el-input>

            <el-select
              v-model="projectFilterStatus"
              placeholder="选择状态"
              class="status-filter"
            >
              <el-option label="全部" value="" />
              <el-option label="进行中" value="active" />
              <el-option label="已完成" value="completed" />
              <el-option label="规划中" value="planning" />
            </el-select>
          </div>

          <el-table
            :data="filteredProjects"
            border
            class="project-table"
          >
            <el-table-column prop="name" label="项目名称" min-width="200" />
            <el-table-column prop="description" label="描述" min-width="300" />
            <el-table-column prop="language" label="技术栈" width="100" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag
                  :class="scope.row.status === 'active' ? 'success' : scope.row.status === 'completed' ? 'info' : 'warning'"
                >
                  {{ scope.row.status === 'active' ? '进行中' : scope.row.status === 'completed' ? '已完成' : '规划中' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="updated" label="更新时间" width="140" />
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-button
                  size="small"
                  @click="editProject(scope.row)"
                >
                  <el-icon name="edit" /> 编辑
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleProjectDelete(scope.row.id)"
                >
                  <el-icon name="delete" /> 删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination
              v-model:current-page="projectCurrentPage"
              :page-size="projectPageSize"
              :total="filteredProjects.length"
              layout="total, prev, pager, next, jumper"
            />
          </div>
        </div>

        <div v-if="activeMenu === 'resume'" class="resume-content">
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
      </main>
    </div>

    <el-dialog
      title="添加分类"
      :visible.sync="showAddCategory"
      width="400px"
    >
      <el-form :model="categoryForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="categoryForm.name" />
        </el-form-item>
        <el-form-item label="上级分类">
          <el-select v-model="categoryForm.parentId">
            <el-option label="顶级分类" :value="0" />
            <el-option
              v-for="cat in articleStore.categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddCategory = false">取消</el-button>
        <el-button type="primary" @click="addCategory">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      :title="projectForm.id ? '编辑项目' : '添加项目'"
      :visible.sync="showAddProject"
      width="500px"
    >
      <el-form :model="projectForm" label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="projectForm.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目描述">
          <el-textarea v-model="projectForm.description" placeholder="请输入项目描述" :rows="3" />
        </el-form-item>
        <el-form-item label="项目图标">
          <el-select v-model="projectForm.icon" placeholder="选择图标">
            <el-option v-for="icon in projectIcons" :key="icon.value" :label="icon.label" :value="icon.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="技术栈">
          <el-input v-model="projectForm.language" placeholder="请输入技术栈" />
        </el-form-item>
        <el-form-item label="项目状态">
          <el-select v-model="projectForm.status">
            <el-option label="进行中" value="active" />
            <el-option label="已完成" value="completed" />
            <el-option label="规划中" value="planning" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="projectForm.tags" placeholder="多个标签用逗号分隔" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddProject = false">取消</el-button>
        <el-button type="primary" @click="saveProject">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useArticleStore } from '../stores/article'
import { useUserStore } from '../stores/user'
import { useResumeStore } from '../stores/resume'
import { useProjectStore } from '../stores/project'
import { useAvatarStore } from '../stores/avatar'

const articleStore = useArticleStore()
const userStore = useUserStore()
const resumeStore = useResumeStore()
const projectStore = useProjectStore()
const avatarStore = useAvatarStore()

const activeMenu = ref('dashboard')
const avatarInput = ref(null)
const uploadingAvatar = ref(false)
const avatarPreview = ref('')
const fileInput = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const searchQuery = ref('')
const filterStatus = ref('')
const filterCategory = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const showAddCategory = ref(false)
const showAddProject = ref(false)
const projectSearchQuery = ref('')
const projectFilterStatus = ref('')
const projectCurrentPage = ref(1)
const projectPageSize = ref(10)

const projectForm = ref({
  id: null,
  name: '',
  description: '',
  icon: 'folder',
  language: 'Python',
  status: 'active',
  tags: ''
})

const projectIcons = [
  { value: 'folder', label: '文件夹' },
  { value: 'compass', label: '指南针' },
  { value: 'radio', label: '无线电' },
  { value: 'zap', label: '闪电' },
  { value: 'rocket', label: '火箭' },
  { value: 'cpu', label: 'CPU' },
  { value: 'map', label: '地图' },
  { value: 'heart', label: '心脏' },
  { value: 'shield', label: '护盾' },
  { value: 'bar-chart', label: '图表' }
]

const filteredProjects = computed(() => {
  let result = [...projectStore.projects]
  
  if (projectSearchQuery.value) {
    const query = projectSearchQuery.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query))
  }
  
  if (projectFilterStatus.value) {
    result = result.filter(p => p.status === projectFilterStatus.value)
  }
  
  return result.sort((a, b) => new Date(b.updated) - new Date(a.updated))
})

const profileForm = ref({
  username: 'admin',
  email: 'admin@example.com',
  name: '管理员'
})

const categoryForm = ref({
  name: '',
  parentId: 0
})

const treeProps = {
  label: 'name',
  children: 'children'
}

const allCategories = computed(() => {
  const categories = []
  articleStore.categories.forEach(cat => {
    categories.push({ id: cat.id, name: cat.name })
    if (cat.children) {
      cat.children.forEach(child => {
        categories.push({ id: child.id, name: child.name })
      })
    }
  })
  return categories
})

const categoryTreeData = computed(() => {
  return articleStore.categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    children: cat.children
  }))
})

const articleStats = computed(() => {
  const total = articleStore.articles.length
  const published = articleStore.articles.filter(a => a.status === 'published').length
  const draft = total - published
  return { total, published, draft }
})

const totalViews = computed(() => {
  return articleStore.articles.reduce((sum, a) => sum + a.views, 0)
})

const categoryStats = computed(() => {
  const colors = ['blue', 'gold', 'orange', 'green']
  return articleStore.categories.map((cat, index) => {
    const ids = [cat.id, ...(cat.children?.map(c => c.id) || [])]
    const count = articleStore.articles.filter(a => ids.includes(a.categoryId)).length
    return {
      name: cat.name,
      count,
      percentage: articleStats.value.total > 0 ? (count / articleStats.value.total * 100).toFixed(0) : 0,
      color: colors[index % colors.length]
    }
  })
})

const recentArticles = computed(() => {
  return [...articleStore.articles]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

const filteredArticles = computed(() => {
  let result = [...articleStore.articles]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(a => a.title.toLowerCase().includes(query))
  }
  
  if (filterStatus.value) {
    result = result.filter(a => a.status === filterStatus.value)
  }
  
  if (filterCategory.value > 0) {
    const ids = articleStore.getCategoryIds(filterCategory.value)
    result = result.filter(a => ids.includes(a.categoryId))
  }
  
  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

function getArticleCount(categoryId) {
  const ids = articleStore.getCategoryIds(categoryId)
  return articleStore.articles.filter(a => ids.includes(a.categoryId)).length
}

function handleMenuSelect(key) {
  activeMenu.value = key
}

function handleSearch() {
  currentPage.value = 1
}

async function handleDelete(id) {
  const confirm = await ElMessageBox.confirm(
    '确定要删除这篇文章吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  
  if (confirm) {
    articleStore.deleteArticle(id)
    ElMessage.success('删除成功')
  }
}

function handleLogout() {
  userStore.logout()
  window.location.href = '/'
}

function editCategory(data) {
  ElMessage.info('编辑功能开发中')
}

function deleteCategory(data) {
  ElMessage.warning('分类删除需要先删除关联文章')
}

function addCategory() {
  if (!categoryForm.value.name.trim()) {
    ElMessage.warning('请输入分类名称')
    return
  }
  
  if (categoryForm.value.parentId === 0) {
    articleStore.categories.push({
      id: Date.now(),
      name: categoryForm.value.name,
      children: []
    })
  } else {
    const parent = articleStore.categories.find(c => c.id === categoryForm.value.parentId)
    if (parent) {
      parent.children.push({
        id: Date.now(),
        name: categoryForm.value.name,
        parentId: parent.id
      })
    }
  }
  
  showAddCategory.value = false
  categoryForm.value = { name: '', parentId: 0 }
  ElMessage.success('添加成功')
}

function saveProfile() {
  ElMessage.success('保存成功')
}

function handleProjectSearch() {
  projectCurrentPage.value = 1
}

function editProject(project) {
  projectForm.value = {
    id: project.id,
    name: project.name,
    description: project.description,
    icon: project.icon,
    language: project.language,
    status: project.status,
    tags: project.tags.join(', ')
  }
  showAddProject.value = true
}

async function handleProjectDelete(id) {
  const confirm = await ElMessageBox.confirm(
    '确定要删除这个项目吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  
  if (confirm) {
    projectStore.deleteProject(id)
    ElMessage.success('删除成功')
  }
}

function saveProject() {
  if (!projectForm.value.name.trim()) {
    ElMessage.warning('请输入项目名称')
    return
  }
  
  if (!projectForm.value.description.trim()) {
    ElMessage.warning('请输入项目描述')
    return
  }

  const tagsArray = projectForm.value.tags.split(',').map(t => t.trim()).filter(t => t)
  
  if (projectForm.value.id) {
    projectStore.updateProject(projectForm.value.id, {
      name: projectForm.value.name,
      description: projectForm.value.description,
      icon: projectForm.value.icon,
      language: projectForm.value.language,
      status: projectForm.value.status,
      tags: tagsArray.length > 0 ? tagsArray : ['未分类']
    })
    ElMessage.success('更新成功')
  } else {
    projectStore.createProject({
      name: projectForm.value.name,
      description: projectForm.value.description,
      icon: projectForm.value.icon,
      language: projectForm.value.language,
      status: projectForm.value.status,
      tags: tagsArray.length > 0 ? tagsArray : ['未分类']
    })
    ElMessage.success('创建成功')
  }
  
  showAddProject.value = false
  projectForm.value = {
    id: null,
    name: '',
    description: '',
    icon: 'folder',
    language: 'Python',
    status: 'active',
    tags: ''
  }
}

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

onMounted(() => {
  userStore.fetchUser()
  resumeStore.loadResumes()
  avatarPreview.value = avatarStore.getAvatarUrl()
})
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}



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

.admin-content {
  flex: 1;
  display: flex;
}

.sidebar {
  width: 200px;
  background: rgba(26, 26, 62, 0.9);
  border-right: 1px solid rgba(0, 212, 255, 0.2);
}

.admin-menu {
  border-right: none;
}

.admin-menu :deep(.el-menu-item) {
  color: #a0aec0;
}

.admin-menu :deep(.el-menu-item.is-active) {
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
}

.main-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-card.blue :deep(.el-icon) { color: #00d4ff; }
.stat-card.gold :deep(.el-icon) { color: #ffb800; }
.stat-card.orange :deep(.el-icon) { color: #ff6b35; }
.stat-card.green :deep(.el-icon) { color: #48bb78; }

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-card.blue .stat-icon { background: rgba(0, 212, 255, 0.15); }
.stat-card.gold .stat-icon { background: rgba(255, 184, 0, 0.15); }
.stat-card.orange .stat-icon { background: rgba(255, 107, 53, 0.15); }
.stat-card.green .stat-icon { background: rgba(72, 187, 120, 0.15); }

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffb800;
}

.stat-label {
  color: #718096;
  font-size: 0.875rem;
}

.charts-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.chart-card {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
  padding: 25px;
}

.chart-card h3 {
  color: #00d4ff;
  margin: 0 0 20px 0;
  font-size: 1rem;
}

.category-chart {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.chart-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chart-label {
  width: 80px;
  color: #a0aec0;
  font-size: 0.875rem;
}

.chart-bar-bg {
  flex: 1;
  height: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  overflow: hidden;
}

.chart-bar {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.chart-bar.blue { background: #00d4ff; }
.chart-bar.gold { background: #ffb800; }
.chart-bar.orange { background: #ff6b35; }
.chart-bar.green { background: #48bb78; }

.chart-value {
  width: 40px;
  text-align: right;
  color: #fff;
  font-weight: 600;
}

.recent-articles {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recent-item {
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.recent-title {
  color: #fff;
  margin-bottom: 8px;
}

.recent-meta {
  display: flex;
  justify-content: space-between;
  color: #718096;
  font-size: 0.875rem;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
}

.status-badge.published {
  background: rgba(72, 187, 120, 0.2);
  color: #48bb78;
}

.status-badge.draft {
  background: rgba(255, 184, 0, 0.2);
  color: #ffb800;
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

.filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input {
  width: 300px;
}

.status-filter,
.category-filter {
  width: 150px;
}

.article-table {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
}

.article-table :deep(.el-table__header-wrapper) {
  background: rgba(0, 212, 255, 0.1);
}

.article-table :deep(.el-table__header-cell) {
  color: #00d4ff;
}

.article-table :deep(.el-table__body-row) {
  color: #a0aec0;
}

.title-link {
  color: #00d4ff;
  cursor: pointer;
}

.title-link:hover {
  text-decoration: underline;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.category-tree-container {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
  padding: 25px;
}

.category-tree {
  --el-tree-node-hover-bg-color: rgba(0, 212, 255, 0.1);
}

.category-tree :deep(.el-tree-node__content) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.tree-node {
  color: #a0aec0;
}

.node-count {
  color: #718096;
  font-size: 0.8rem;
}

.tree-actions {
  display: flex;
  gap: 5px;
}

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

.resume-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
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

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-row {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .admin-content {
    flex-direction: column;
  }
  
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input,
  .status-filter,
  .category-filter {
    width: 100%;
  }
}
</style>
