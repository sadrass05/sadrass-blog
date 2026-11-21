<template>
  <div class="project-detail-container">
    <div class="project-header">
      <div class="header-glow"></div>
      <div class="project-icon-large">
        <el-icon :size="64" :name="project.icon" />
      </div>
      <div class="project-info">
        <div class="project-badge" :class="project.status">
          {{ project.status === 'active' ? '进行中' : project.status === 'completed' ? '已完成' : '规划中' }}
        </div>
        <h1 class="project-title">{{ project.name }}</h1>
        <p class="project-desc">{{ project.description }}</p>
      </div>
    </div>

    <div class="project-stats-row">
      <div class="stat-box">
        <el-icon name="star" />
        <span class="stat-value">{{ project.stars }}</span>
        <span class="stat-label">星标</span>
      </div>
      <div class="stat-box">
        <el-icon name="git-branch" />
        <span class="stat-value">{{ project.forks }}</span>
        <span class="stat-label">分叉</span>
      </div>
      <div class="stat-box">
        <el-icon name="code" />
        <span class="stat-value">{{ project.language }}</span>
        <span class="stat-label">语言</span>
      </div>
      <div class="stat-box">
        <el-icon name="clock" />
        <span class="stat-value">{{ project.updated }}</span>
        <span class="stat-label">更新时间</span>
      </div>
    </div>

    <div class="project-content">
      <div class="main-content">
        <el-card class="content-card">
          <h2 class="section-title"><el-icon name="file-text" /> 项目简介</h2>
          <div class="section-content">
            <p>{{ project.description }}</p>
            <p>该项目是银河帝国星际技术研发计划的重要组成部分，旨在开发先进的导航系统，支持大规模星际探索和殖民任务。系统采用最先进的神经网络算法，能够实时处理复杂的星际环境数据，为星舰提供最优航行路线。</p>
          </div>
        </el-card>

        <el-card class="content-card">
          <h2 class="section-title"><el-icon name="list" /> 技术特性</h2>
          <div class="features-list">
            <div v-for="(feature, index) in features" :key="index" class="feature-item">
              <span class="feature-number">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="feature-content">
                <h4>{{ feature.title }}</h4>
                <p>{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="content-card">
          <h2 class="section-title"><el-icon name="code" /> 技术栈</h2>
          <div class="tech-stack">
            <div v-for="tech in techStackItems" :key="tech.name" class="tech-item">
              <el-icon :name="tech.icon" />
              <span class="tech-name">{{ tech.name }}</span>
              <span class="tech-version">{{ tech.version }}</span>
            </div>
          </div>
        </el-card>

        <el-card class="content-card">
          <h2 class="section-title"><el-icon name="trending-up" /> 项目进度</h2>
          <div class="progress-section">
            <div v-for="milestone in milestones" :key="milestone.id" class="milestone-item">
              <div class="milestone-header">
                <span class="milestone-title">{{ milestone.title }}</span>
                <span class="milestone-date">{{ milestone.date }}</span>
              </div>
              <div class="milestone-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: milestone.progress + '%' }"></div>
                </div>
                <span class="progress-text">{{ milestone.progress }}%</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <div class="sidebar">
        <el-card class="sidebar-card">
          <h3 class="sidebar-title"><el-icon name="tags" /> 项目标签</h3>
          <div class="tags-list">
            <el-tag v-for="tag in project.tags" :key="tag" size="medium">{{ tag }}</el-tag>
          </div>
        </el-card>

        <el-card class="sidebar-card">
          <h3 class="sidebar-title"><el-icon name="link" /> 快速链接</h3>
          <div class="links-list">
            <a href="#" class="link-item">
              <el-icon name="github" /> GitHub仓库
            </a>
            <a href="#" class="link-item">
              <el-icon name="file-text" /> 项目文档
            </a>
            <a href="#" class="link-item">
              <el-icon name="bug" /> Issue追踪
            </a>
            <a href="#" class="link-item">
              <el-icon name="users" /> 贡献指南
            </a>
          </div>
        </el-card>

        <el-card class="sidebar-card">
          <h3 class="sidebar-title"><el-icon name="users" /> 核心团队</h3>
          <div class="team-list">
            <div v-for="member in teamMembers" :key="member.name" class="team-item">
              <div class="member-avatar">
                <el-icon name="user" />
              </div>
              <div class="member-info">
                <span class="member-name">{{ member.name }}</span>
                <span class="member-role">{{ member.role }}</span>
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="sidebar-card">
          <h3 class="sidebar-title"><el-icon name="activity" /> 提交活动</h3>
          <div class="activity-chart">
            <div v-for="day in activityData" :key="day.date" class="activity-bar" :style="{ height: day.count * 3 + 'px' }" :title="day.count + ' commits'">
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '../stores/project'

const route = useRoute()
const projectStore = useProjectStore()

const project = ref({
  id: 0,
  name: '',
  description: '',
  icon: 'folder-opened',
  status: 'active',
  stars: '0',
  forks: '0',
  language: '',
  updated: '',
  tags: [],
  techStack: [],
  completedDate: null,
  screenshotUrl: '',
  detailUrl: ''
})

const features = ref([
  {
    title: '实时路径规划',
    description: '基于神经网络的实时路径规划算法，能够在毫秒级别内计算最优航线'
  },
  {
    title: '智能障碍规避',
    description: '自动检测并规避小行星、星云等障碍物，确保航行安全'
  },
  {
    title: '跨星系导航',
    description: '支持跨越多个星系的长距离导航，自动规划跃迁点'
  },
  {
    title: '自适应学习',
    description: '系统能够从航行数据中学习，不断优化导航策略'
  }
])

const techStackItems = computed(() => {
  const techIcons = {
    'Python': 'code',
    'JavaScript': 'code',
    'TypeScript': 'code',
    'C++': 'code',
    'Go': 'code',
    'Rust': 'code',
    'SQL': 'database',
    'PostgreSQL': 'database',
    'Redis': 'database',
    'MongoDB': 'database',
    'TensorFlow': 'cpu',
    'PyTorch': 'cpu',
    'Qiskit': 'cpu',
    'Kubernetes': 'cloud',
    'Docker': 'cloud',
    'Prometheus': 'cloud',
    'Grafana': 'cloud',
    'ROS2': 'cpu',
    'OpenCV': 'image',
    'D3.js': 'bar-chart',
    'ECharts': 'bar-chart',
    'Node.js': 'server',
    'Vue': 'code',
    'Vue 3': 'code',
    'React': 'code',
    'CUDA': 'cpu',
    'ONNX': 'cpu',
    'gRPC': 'link',
    'ZeroMQ': 'link',
    'MQTT': 'link',
    'Substrate': 'box',
    'Solidity': 'code',
    'IPFS': 'cloud',
    'Polkadot': 'link',
    'Arduino': 'cpu',
    'Raspberry Pi': 'cpu',
    'MATLAB': 'cpu',
    'OpenCL': 'cpu',
    'Vulkan': 'cpu',
    'Apache Kafka': 'cloud',
    'PostGIS': 'map'
  }
  
  return project.value.techStack?.map(tech => ({
    name: tech,
    version: '',
    icon: techIcons[tech] || 'code'
  })) || []
})

const milestones = ref([
  { id: 1, title: '基础框架搭建', date: '2024-02-01', progress: 100 },
  { id: 2, title: '核心算法开发', date: '2024-04-01', progress: 75 },
  { id: 3, title: '系统集成测试', date: '2024-06-01', progress: 40 },
  { id: 4, title: '部署上线', date: '2024-08-01', progress: 10 }
])

const teamMembers = ref([
  { name: '张宇航', role: '项目负责人' },
  { name: '李明远', role: '首席工程师' },
  { name: '王思琪', role: 'AI研究员' },
  { name: '陈浩宇', role: '系统架构师' }
])

const activityData = ref([
  { date: '周一', count: 8 },
  { date: '周二', count: 12 },
  { date: '周三', count: 5 },
  { date: '周四', count: 15 },
  { date: '周五', count: 10 },
  { date: '周六', count: 3 },
  { date: '周日', count: 2 }
])

onMounted(() => {
  const projectId = parseInt(route.params.id)
  const foundProject = projectStore.getProject(projectId)
  if (foundProject) {
    project.value = { ...foundProject }
  }
})
</script>

<style scoped>
.project-detail-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}



.project-header {
  display: flex;
  gap: 30px;
  background: linear-gradient(145deg, rgba(26, 26, 62, 0.9), rgba(13, 13, 36, 0.95));
  padding: 40px;
  border-radius: 16px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
}

.header-glow {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.project-icon-large {
  color: #ffb800;
  flex-shrink: 0;
}

.project-info {
  flex: 1;
}

.project-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 15px;
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
  font-size: 32px;
  margin-bottom: 15px;
}

.project-desc {
  color: #718096;
  font-size: 16px;
  line-height: 1.6;
}

.project-stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(13, 13, 36, 0.8);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(0, 212, 255, 0.2);
}

.stat-box el-icon {
  color: #00d4ff;
  font-size: 24px;
}

.stat-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #ffb800;
}

.stat-label {
  color: #718096;
  font-size: 13px;
}

.project-content {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 30px;
}

.content-card {
  background: rgba(13, 13, 36, 0.8);
  margin-bottom: 25px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #00d4ff;
  font-family: 'Orbitron', sans-serif;
  font-size: 18px;
  margin-bottom: 20px;
}

.section-title el-icon {
  color: #ffb800;
}

.section-content p {
  color: #718096;
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 15px;
}

.section-content p:last-child {
  margin-bottom: 0;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  gap: 15px;
}

.feature-number {
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #00d4ff;
  min-width: 35px;
}

.feature-content h4 {
  color: #fff;
  margin-bottom: 5px;
}

.feature-content p {
  color: #718096;
  font-size: 14px;
  margin: 0;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 212, 255, 0.1);
  padding: 10px 15px;
  border-radius: 8px;
}

.tech-item el-icon {
  color: #00d4ff;
}

.tech-name {
  color: #fff;
}

.tech-version {
  color: #4a5568;
  font-size: 12px;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.milestone-item {
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 10px;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.milestone-title {
  color: #fff;
  font-weight: 600;
}

.milestone-date {
  color: #4a5568;
  font-size: 13px;
}

.milestone-progress {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(74, 85, 104, 0.5);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff, #ffb800);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-text {
  color: #00d4ff;
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  min-width: 40px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: rgba(13, 13, 36, 0.9);
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #00d4ff;
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  margin-bottom: 15px;
}

.sidebar-title el-icon {
  color: #ffb800;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #718096;
  text-decoration: none;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.link-item:hover {
  background: rgba(0, 212, 255, 0.1);
  color: #00d4ff;
}

.link-item el-icon {
  color: #00d4ff;
}

.team-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.team-item {
  display: flex;
  gap: 12px;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.team-item:hover {
  background: rgba(0, 212, 255, 0.1);
}

.member-avatar {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 212, 255, 0.15);
  border-radius: 50%;
  color: #00d4ff;
}

.member-info {
  display: flex;
  flex-direction: column;
}

.member-name {
  color: #fff;
  font-weight: 600;
}

.member-role {
  color: #4a5568;
  font-size: 12px;
}

.activity-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 80px;
  padding-top: 15px;
}

.activity-bar {
  width: 12%;
  background: linear-gradient(180deg, #00d4ff, rgba(0, 212, 255, 0.3));
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}

@media (max-width: 900px) {
  .project-content {
    grid-template-columns: 1fr;
  }
  
  .project-header {
    flex-direction: column;
    text-align: center;
  }
  
  .project-title {
    font-size: 24px;
  }
}
</style>