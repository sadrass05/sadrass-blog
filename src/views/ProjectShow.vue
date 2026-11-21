<template>
  <div class="project-show-page">
    <el-card class="project-card">
      <div class="project-header">
        <div class="project-icon">
          <el-icon :size="64" :name="project.icon" />
        </div>
        <div class="project-info">
          <h1>{{ project.name }}</h1>
          <div class="project-badge" :class="project.status">
            {{ getStatusText(project.status) }}
          </div>
        </div>
      </div>
      
      <div class="project-description">
        <p>{{ project.description }}</p>
      </div>
      
      <div class="project-meta">
        <div class="tech-stack">
          <h3>技术栈</h3>
          <el-tag v-for="tech in project.techStack" :key="tech" size="medium">{{ tech }}</el-tag>
        </div>
        
        <div class="project-stats">
          <div class="stat-item">
            <el-icon name="star" />
            <span>{{ project.stars }}</span>
            <span class="label">Stars</span>
          </div>
          <div class="stat-item">
            <el-icon name="git-commit" />
            <span>{{ project.forks }}</span>
            <span class="label">Forks</span>
          </div>
          <div class="stat-item">
            <el-icon name="eye" />
            <span>{{ project.views }}</span>
            <span class="label">Views</span>
          </div>
        </div>
      </div>
      
      <div class="project-links">
        <el-button type="primary" @click="openLink(project.githubUrl)">
          <el-icon name="github" />
          GitHub
        </el-button>
        <el-button @click="openLink(project.demoUrl)">
          <el-icon name="globe" />
          在线演示
        </el-button>
      </div>
      
      <div class="project-details">
        <div class="detail-section">
          <h3>项目简介</h3>
          <p>{{ project.intro }}</p>
        </div>
        
        <div class="detail-section">
          <h3>功能特性</h3>
          <ul>
            <li v-for="feature in project.features" :key="feature">{{ feature }}</li>
          </ul>
        </div>
        
        <div class="detail-section">
          <h3>开发背景</h3>
          <p>{{ project.background }}</p>
        </div>
      </div>
    </el-card>
    
    <div class="related-projects">
      <h3>相关项目</h3>
      <div class="related-grid">
        <el-card 
          v-for="related in relatedProjects" 
          :key="related.id" 
          class="related-card"
          @click="$router.push(`/project/${related.id}`)"
        >
          <div class="related-icon">
            <el-icon :size="32" :name="related.icon" />
          </div>
          <h4>{{ related.name }}</h4>
          <p>{{ related.description.slice(0, 50) }}...</p>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectId = parseInt(route.params.id)

const project = ref({
  id: 1,
  name: '',
  description: '',
  techStack: [],
  status: 'active',
  stars: 0,
  forks: 0,
  views: 0,
  icon: 'folder-opened',
  githubUrl: '',
  demoUrl: '',
  intro: '',
  features: [],
  background: ''
})

const projects = {
  1: {
    id: 1,
    name: '个人博客系统',
    description: '基于 Vue 3 + Vite 构建的现代化博客平台，支持文章管理、评论系统、响应式设计',
    techStack: ['Vue 3', 'Vite', 'Element Plus', 'Vue Router'],
    status: 'active',
    stars: 128,
    forks: 35,
    views: 2560,
    icon: 'folder-opened',
    githubUrl: 'https://github.com/example/blog',
    demoUrl: 'https://blog.example.com',
    intro: '这是一个功能完整的个人博客系统，采用现代化的技术栈构建，具有良好的用户体验和响应式设计。',
    features: [
      '支持 Markdown 文章编辑',
      '评论系统支持',
      '响应式布局设计',
      '文章分类和标签',
      '搜索功能',
      '文章阅读统计'
    ],
    background: '作为一名开发者，我一直想拥有一个自己的博客来记录技术心得和生活感悟。市面上虽然有很多博客平台，但我希望能够完全掌控自己的数据和样式，所以决定从零开始构建这个博客系统。'
  },
  2: {
    id: 2,
    name: '在线代码编辑器',
    description: '支持多种编程语言的在线代码编辑工具，支持语法高亮、代码格式化',
    techStack: ['React', 'Monaco Editor', 'Node.js', 'Express'],
    status: 'active',
    stars: 256,
    forks: 68,
    views: 5120,
    icon: 'code',
    githubUrl: 'https://github.com/example/code-editor',
    demoUrl: 'https://editor.example.com',
    intro: '一个功能强大的在线代码编辑器，支持多种编程语言，具有语法高亮、代码格式化、实时预览等功能。',
    features: [
      '支持 20+ 种编程语言',
      '智能代码补全',
      '代码格式化',
      '实时预览',
      '代码分享功能',
      '深色/浅色主题'
    ],
    background: '在学习和工作中，经常需要分享代码片段或者在线调试代码。现有的在线编辑器要么功能不够完善，要么加载速度慢，所以我决定开发一个轻量级但功能强大的在线代码编辑器。'
  },
  3: {
    id: 3,
    name: '数据分析平台',
    description: '数据可视化与分析的综合平台，支持多种图表类型和数据导出',
    techStack: ['Vue 3', 'ECharts', 'Python', 'Django'],
    status: 'active',
    stars: 189,
    forks: 42,
    views: 3840,
    icon: 'database',
    githubUrl: 'https://github.com/example/data-analysis',
    demoUrl: 'https://analytics.example.com',
    intro: '一个综合性的数据分析平台，支持多种数据源接入和丰富的图表展示，帮助用户快速洞察数据价值。',
    features: [
      '多种数据源支持',
      '20+ 图表类型',
      '数据导出功能',
      '自定义报表',
      '数据钻取分析',
      '定时任务'
    ],
    background: '数据可视化是数据分析的重要环节。在工作中，我发现现有的数据分析工具要么过于复杂难以上手，要么功能受限。于是我开发了这个平台，旨在提供一个简单易用但功能强大的数据分析解决方案。'
  },
  4: {
    id: 4,
    name: '电商管理系统',
    description: '完整的电商后台管理解决方案，包含商品管理、订单管理、用户管理',
    techStack: ['Vue 3', 'Element Plus', 'Node.js', 'MongoDB'],
    status: 'completed',
    stars: 312,
    forks: 89,
    views: 6240,
    icon: 'globe',
    githubUrl: 'https://github.com/example/ecommerce-admin',
    demoUrl: 'https://admin.example.com',
    intro: '一个完整的电商后台管理系统，提供商品、订单、用户等核心模块的管理功能。',
    features: [
      '商品管理',
      '订单管理',
      '用户管理',
      '数据统计',
      '权限管理',
      '日志记录'
    ],
    background: '电商业务的快速发展需要一个高效的后台管理系统来支撑日常运营。这个项目是我在电商行业工作期间积累的经验总结，希望能够帮助更多开发者快速搭建电商后台。'
  }
}

const relatedProjects = ref([
  { id: 2, name: '在线代码编辑器', description: '支持多种编程语言的在线代码编辑工具', icon: 'code' },
  { id: 3, name: '数据分析平台', description: '数据可视化与分析的综合平台', icon: 'database' },
  { id: 4, name: '电商管理系统', description: '完整的电商后台管理解决方案', icon: 'globe' }
])

const getStatusText = (status) => {
  const texts = {
    active: '进行中',
    completed: '已完成',
    paused: '暂停'
  }
  return texts[status] || status
}

const openLink = (url) => {
  window.open(url, '_blank')
}

onMounted(() => {
  project.value = projects[projectId] || projects[1]
  relatedProjects.value = Object.values(projects).filter(p => p.id !== project.value.id).slice(0, 3)
})
</script>

<style scoped>
.project-show-page {
  max-width: 800px;
  margin: 0 auto;
}

.project-card {
  margin-bottom: 40px;
}

.project-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.project-icon {
  color: #667eea;
}

.project-info {
  flex: 1;
}

.project-info h1 {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.project-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
}

.project-badge.active {
  background: #d4edda;
  color: #155724;
}

.project-badge.completed {
  background: #e8f4fd;
  color: #3498db;
}

.project-description {
  margin-bottom: 30px;
}

.project-description p {
  font-size: 16px;
  color: #34495e;
  line-height: 1.8;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.tech-stack h3 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.tech-stack .el-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.project-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stat-item .el-icon {
  font-size: 24px;
  color: #667eea;
}

.stat-item span:first-of-type {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.stat-item .label {
  font-size: 14px;
  color: #95a5a6;
}

.project-links {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.project-details {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.detail-section h3 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #667eea;
}

.detail-section p {
  color: #7f8c8d;
  line-height: 1.8;
  font-size: 15px;
}

.detail-section ul {
  list-style: none;
  padding: 0;
}

.detail-section li {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  color: #34495e;
  position: relative;
  padding-left: 20px;
}

.detail-section li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.related-projects {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.related-projects h3 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.related-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.related-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.related-icon {
  color: #667eea;
  margin-bottom: 10px;
}

.related-card h4 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.related-card p {
  color: #7f8c8d;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .project-header {
    flex-direction: column;
    text-align: center;
  }
  
  .project-info h1 {
    font-size: 24px;
  }
  
  .project-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .project-stats {
    margin-top: 20px;
  }
  
  .project-links {
    flex-direction: column;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>