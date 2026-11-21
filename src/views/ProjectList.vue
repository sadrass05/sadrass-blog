<template>
  <div class="project-list-container">
    <div class="page-header">
      <h1><el-icon name="folder-opened" /> 项目列表</h1>
      <p class="page-desc">展示我的个人项目，分享技术成果</p>
    </div>

    <div class="filter-section">
      <div class="search-box">
        <el-input 
          v-model="searchQuery" 
          placeholder="搜索项目..."
          prefix-icon="search"
        />
      </div>
      <div class="category-filter">
        <el-select 
          v-model="selectedCategory" 
          placeholder="选择分类"
          class="filter-select"
        >
          <el-option label="全部项目" value="" />
          <el-option label="导航系统" value="navigation" />
          <el-option label="能源系统" value="energy" />
          <el-option label="通讯系统" value="communication" />
          <el-option label="人工智能" value="ai" />
        </el-select>
      </div>
      <div class="sort-selector">
        <el-select 
          v-model="sortBy" 
          placeholder="排序方式"
          class="filter-select"
        >
          <el-option label="最新更新" value="updated" />
          <el-option label="最多星标" value="stars" />
          <el-option label="最多分叉" value="forks" />
        </el-select>
      </div>
    </div>

    <div class="project-stats">
      <div class="stat-item">
        <span class="stat-icon"><el-icon name="folder" /></span>
        <span class="stat-value">{{ filteredProjects.length }}</span>
        <span class="stat-label">项目总数</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon"><el-icon name="star" /></span>
        <span class="stat-value">{{ totalStars }}</span>
        <span class="stat-label">总星标数</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon"><el-icon name="git-branch" /></span>
        <span class="stat-value">{{ totalForks }}</span>
        <span class="stat-label">总分叉数</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon"><el-icon name="code" /></span>
        <span class="stat-value">{{ languages.length }}</span>
        <span class="stat-label">技术栈</span>
      </div>
    </div>

    <div class="project-grid">
      <el-card 
        v-for="project in filteredProjects" 
        :key="project.id" 
        class="project-card"
        @click="$router.push(`/project/${project.id}`)"
      >
        <div class="project-header">
          <div class="project-icon">
            <el-icon :size="48" :name="project.icon" />
          </div>
          <div class="project-badge" :class="project.status">
            {{ project.status === 'active' ? '进行中' : project.status === 'completed' ? '已完成' : '规划中' }}
          </div>
        </div>
        <h3 class="project-title">{{ project.name }}</h3>
        <p class="project-desc">{{ project.description }}</p>
        <div class="project-meta">
          <div class="meta-row">
            <span class="meta-item"><el-icon name="star" /> {{ project.stars }}</span>
            <span class="meta-item"><el-icon name="git-branch" /> {{ project.forks }}</span>
            <span class="meta-item"><el-icon name="code" /> {{ project.language }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-item"><el-icon name="clock" /> {{ project.updated }}</span>
          </div>
        </div>
        <div class="project-tags">
          <el-tag v-for="tag in project.tags" :key="tag" size="small">{{ tag }}</el-tag>
        </div>
      </el-card>
    </div>

    <div class="pagination-section">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[9, 18, 27]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalProjects"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '../stores/project'

const projectStore = useProjectStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('updated')
const currentPage = ref(1)
const pageSize = ref(9)

const projects = computed(() => projectStore.projects)

const filteredProjects = computed(() => {
  let result = projects.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    )
  }
  
  if (selectedCategory.value) {
    const catMap = {
      'navigation': ['导航'],
      'energy': ['能源'],
      'communication': ['通讯'],
      'ai': ['AI', '神经网络']
    }
    result = result.filter(p => p.tags.some(t => catMap[selectedCategory.value].includes(t)))
  }
  
  if (sortBy.value === 'updated') {
    result = [...result].sort((a, b) => new Date(b.updated) - new Date(a.updated))
  } else if (sortBy.value === 'stars') {
    result = [...result].sort((a, b) => parseInt(b.stars) - parseInt(a.stars))
  } else if (sortBy.value === 'forks') {
    result = [...result].sort((a, b) => parseInt(b.forks) - parseInt(a.forks))
  }
  
  return result
})

const totalProjects = computed(() => filteredProjects.value.length)

const totalStars = computed(() => {
  return projects.value.reduce((sum, p) => sum + parseInt(p.stars), 0).toLocaleString()
})

const totalForks = computed(() => {
  return projects.value.reduce((sum, p) => sum + parseInt(p.forks), 0).toLocaleString()
})

const languages = computed(() => {
  const langs = new Set(projects.value.map(p => p.language))
  return Array.from(langs)
})

const handleSizeChange = (val) => {
  pageSize.value = val
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}
</script>

<style scoped>
.project-list-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}



.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #fff;
  font-family: 'Orbitron', sans-serif;
  font-size: 32px;
  margin: 0 0 10px;
}

.page-header h1 el-icon {
  color: #00d4ff;
}

.page-desc {
  color: #718096;
  font-size: 16px;
  margin: 0;
}

.filter-section {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-box .el-input__wrapper {
  background: rgba(13, 13, 36, 0.8);
  border-color: rgba(0, 212, 255, 0.3);
}

.filter-select {
  min-width: 150px;
}

.project-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(26, 26, 62, 0.6);
  padding: 15px 20px;
  border-radius: 12px;
  border: 1px solid rgba(0, 212, 255, 0.2);
}

.stat-icon {
  color: #00d4ff;
  font-size: 20px;
}

.stat-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #ffb800;
}

.stat-label {
  color: #718096;
  font-size: 13px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
}

.project-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 212, 255, 0.4);
  box-shadow: 0 15px 40px rgba(0, 212, 255, 0.15);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.project-icon {
  color: #ffb800;
}

.project-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.project-badge.active {
  background: rgba(46, 204, 113, 0.15);
  color: #2ecc71;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.project-badge.completed {
  background: rgba(52, 152, 219, 0.15);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.3);
}

.project-badge.planning {
  background: rgba(255, 184, 0, 0.15);
  color: #ffb800;
  border: 1px solid rgba(255, 184, 0, 0.3);
}

.project-title {
  color: #fff;
  font-family: 'Orbitron', sans-serif;
  font-size: 18px;
  margin-bottom: 10px;
}

.project-desc {
  color: #718096;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.meta-row {
  display: flex;
  gap: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #4a5568;
  font-size: 13px;
}

.meta-item el-icon {
  color: #00d4ff;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

@media (max-width: 768px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
  
  .project-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>