<template>
  <div class="about-container">
    <div class="hero-section">
      <div class="hero-glow"></div>
      <div class="profile-card">
        <div class="profile-avatar">
          <img 
            v-if="avatarUrl" 
            :src="avatarUrl" 
            class="avatar-image" 
            alt="头像"
          />
          <el-icon v-else :size="80" name="user" />
        </div>
        <h1 class="profile-name">Galaxy Blog</h1>
        <p class="profile-title">数据分析工程师</p>
        <div class="profile-stats">
          <div class="stat">
            <span class="stat-value">1+</span>
            <span class="stat-label">年开发经验</span>
          </div>
          <div class="stat">
            <span class="stat-value">0</span>
            <span class="stat-label">篇文章</span>
          </div>
          <div class="stat">
            <span class="stat-value">0</span>
            <span class="stat-label">个项目</span>
          </div>
          <div class="stat">
            <span class="stat-value">0</span>
            <span class="stat-label">关注者</span>
          </div>
        </div>
        <div class="profile-actions">
          <el-button 
            type="primary" 
            @click="toggleContactPanel"
            :class="{ active: showContactPanel }"
          >
            <el-icon name="send" /> {{ showContactPanel ? '收起联系信息' : '联系我' }}
          </el-button>
          <el-button 
            @click="handleDownloadResume"
            :disabled="!resumeStore.hasResume || downloadLoading"
            :loading="downloadLoading"
            class="resume-btn"
          >
            <el-icon name="download" /> {{ downloadLoading ? '下载中...' : '下载简历' }}
            <span v-if="resumeStore.latestResume" class="resume-version">v{{ resumeStore.latestResume.version }}</span>
          </el-button>
        </div>
        
        <transition name="slide-fade">
          <div v-if="showContactPanel" class="contact-panel">
            <h3 class="panel-title"><el-icon name="user" /> 联系方式</h3>
            <div class="contact-info">
              <div class="contact-row">
                <el-icon name="send" class="contact-icon" />
                <div class="contact-detail">
                  <span class="contact-label">邮箱</span>
                  <a href="developer@galaxyblog.io" class="contact-value">developer@galaxyblog.io</a>
                </div>
              </div>
              <div class="contact-row">
                <el-icon name="phone" class="contact-icon" />
                <div class="contact-detail">
                  <span class="contact-label">电话</span>
                  <a href="tel:+86188888888" class="contact-value">+86 188 8888 8888</a>
                </div>
              </div>
              <div class="contact-row">
                <el-icon name="location" class="contact-icon" />
                <div class="contact-detail">
                  <span class="contact-label">地址</span>
                  <span class="contact-value">银河市星际大道 77 号</span>
                </div>
              </div>
            </div>
            <div class="social-links">
              <span class="social-label">社交媒体</span>
              <div class="social-icons">
                <a href="#" class="social-link" title="GitHub">
                  <el-icon name="github" />
                </a>
                <a href="#" class="social-link" title="掘金">
                  <el-icon name="globe" />
                </a>
                <a href="#" class="social-link" title="CSDN">
                  <el-icon name="book" />
                </a>
                <a href="#" class="social-link" title="微博">
                  <el-icon name="message" />
                </a>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div class="content-section">
      <div class="main-content">
        <el-card class="content-card">
          <h2 class="section-title"><el-icon name="info" /> 关于我</h2>
          <div class="about-text">
            <p>我是一名数据分析工程师，拥有1年以上的开发经验。热爱探索新技术，乐于分享知识，希望通过这个博客记录我的学习和成长历程。</p>
            <p>我专注于数据分析和可视化，擅长使用Python、R、SQL、Excel、Power BI等工具，同时对机器学习也有一定的经验。喜欢挑战复杂的技术问题，享受解决问题带来的成就感。</p>
          </div>
        </el-card>

        <el-card class="content-card">
          <h2 class="section-title"><el-icon name="award" /> 个人成就</h2>
          <div class="achievements-list">
            <div v-for="(achievement, index) in achievements" :key="index" class="achievement-item">
              <div class="achievement-icon">
                <el-icon :name="achievement.icon" />
              </div>
              <div class="achievement-content">
                <h4>{{ achievement.title }}</h4>
                <p>{{ achievement.description }}</p>
                <span class="achievement-date">{{ achievement.date }}</span>
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="content-card">
          <h2 class="section-title"><el-icon name="timeline" /> 航行历程</h2>
          <div class="timeline">
            <div v-for="(event, index) in timeline" :key="index" class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <h4>{{ event.title }}</h4>
                <span class="timeline-date">{{ event.year }}</span>
                <p>{{ event.description }}</p>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <div class="sidebar">
        <el-card class="sidebar-card">
          <h3 class="sidebar-title"><el-icon name="zap" /> 技能专长</h3>
          <div class="skills-list">
            <div v-for="skill in skills" :key="skill.name" class="skill-item">
              <div class="skill-header">
                <el-icon :name="skill.icon" />
                <span class="skill-name">{{ skill.name }}</span>
              </div>
              <div class="skill-bar">
                <div class="skill-fill" :style="{ width: skill.level + '%' }"></div>
              </div>
              <span class="skill-level">{{ skill.level }}%</span>
            </div>
          </div>
        </el-card>

        <el-card class="sidebar-card">
          <h3 class="sidebar-title"><el-icon name="globe" /> 探索区域</h3>
          <div class="galaxy-map">
            <div class="galaxy-center"></div>
            <div class="galaxy-ring ring1"></div>
            <div class="galaxy-ring ring2"></div>
            <div class="galaxy-ring ring3"></div>
            <div class="explored-point" style="top: 20%; left: 50%;">
              <span class="point-label">太阳系</span>
            </div>
            <div class="explored-point" style="top: 40%; left: 75%;">
              <span class="point-label">Alpha星系</span>
            </div>
            <div class="explored-point" style="top: 65%; left: 30%;">
              <span class="point-label">Epsilon星云</span>
            </div>
            <div class="explored-point" style="top: 75%; left: 65%;">
              <span class="point-label">第七星域</span>
            </div>
          </div>
        </el-card>

        <el-card class="sidebar-card">
          <h3 class="sidebar-title"><el-icon name="link" /> 联系信息</h3>
          <div class="contact-list">
            <div class="contact-item">
              <el-icon name="send" />
              <span>邮箱：developer@galaxyblog.io</span>
            </div>
            <div class="contact-item">
              <el-icon name="phone" />
              <span>联系电话：+86 188888888888</span>
            </div>
            <div class="contact-item">
              <el-icon name="location" />
              <span>地址：银河市星际大道 77 号</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useResumeStore } from '../stores/resume'
import { useAvatarStore } from '../stores/avatar'

const resumeStore = useResumeStore()
const avatarStore = useAvatarStore()

const showContactPanel = ref(false)
const downloadLoading = ref(false)

const avatarUrl = computed(() => avatarStore.getAvatarUrl())

const achievements = ref([
  {
    icon: 'trophy',
    title: '技术博客达人',
    description: '累计发表技术文章128篇，获得广泛好评',
    date: '2024'
  },
  {
    icon: 'award',
    title: '开源贡献者',
    description: '在GitHub上贡献多个开源项目',
    date: '2023'
  },
  {
    icon: 'star',
    title: '技术分享嘉宾',
    description: '多次在技术大会上分享经验',
    date: '2022'
  },
  {
    icon: 'code',
    title: '项目实战经验',
    description: '参与开发多个企业级项目',
    date: '2021'
  }
])

const timeline = ref([
  {
    year: '2019',
    title: '开始学习编程',
    description: '从零基础开始学习前端开发'
  },
  {
    year: '2020',
    title: '第一份工作',
    description: '加入一家互联网公司担任前端工程师'
  },
  {
    year: '2021',
    title: '技术成长',
    description: '深入学习Vue.js和React框架'
  },
  {
    year: '2022',
    title: '开始写博客',
    description: '创建个人博客，分享技术心得'
  },
  {
    year: '2024',
    title: '持续进步',
    description: '不断学习新技术，提升专业能力'
  }
])

const skills = ref([
  { name: 'Vue.js', icon: 'code', level: 95 },
  { name: 'React', icon: 'code', level: 90 },
  { name: 'JavaScript', icon: 'code', level: 95 },
  { name: 'CSS/SCSS', icon: 'palette', level: 88 },
  { name: 'Node.js', icon: 'server', level: 80 }
])

const toggleContactPanel = () => {
  showContactPanel.value = !showContactPanel.value
}

const handleDownloadResume = async () => {
  if (!resumeStore.hasResume) {
    ElMessage.warning('暂无可用的简历文件')
    return
  }

  downloadLoading.value = true
  
  try {
    const success = await resumeStore.downloadResume()
    if (success) {
      ElMessage.success('简历下载成功！')
    }
  } catch (error) {
    ElMessage.error(`下载失败：${error.message}`)
  } finally {
    downloadLoading.value = false
  }
}

onMounted(() => {
  resumeStore.loadResumes()
})
</script>

<style scoped>
.about-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}



.hero-section {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;
}

.hero-glow {
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%);
  border-radius: 50%;
}

.profile-card {
  background: linear-gradient(145deg, rgba(26, 26, 62, 0.9), rgba(13, 13, 36, 0.95));
  padding: 50px;
  border-radius: 20px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  text-align: center;
  position: relative;
  z-index: 1;
  max-width: 500px;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 212, 255, 0.15);
  border-radius: 50%;
  margin: 0 auto 25px;
  color: #00d4ff;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  color: #fff;
  font-family: 'Orbitron', sans-serif;
  font-size: 32px;
  margin-bottom: 10px;
}

.profile-title {
  color: #ffb800;
  font-size: 16px;
  margin-bottom: 30px;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #ffb800;
}

.stat-label {
  color: #718096;
  font-size: 12px;
  margin-top: 5px;
}

.profile-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.profile-actions .el-button {
  padding: 14px 36px;
  font-size: 16px;
  font-weight: 600;
  border-radius: var(--radius-lg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
}

.profile-actions .el-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.profile-actions .el-button:hover::before {
  left: 100%;
}

.profile-actions .el-button:active {
  transform: scale(0.98);
}

.profile-actions .el-button--primary {
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-blue-dark));
  border: 2px solid transparent;
  color: #fff;
  box-shadow: 
    0 4px 20px rgba(0, 212, 255, 0.4),
    0 0 0 1px rgba(0, 212, 255, 0.1);
}

.profile-actions .el-button--primary:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 8px 30px rgba(0, 212, 255, 0.6),
    0 0 0 2px rgba(0, 212, 255, 0.2);
  background: linear-gradient(135deg, var(--neon-blue-light), var(--neon-blue));
}

.profile-actions .el-button--primary:active {
  transform: translateY(-2px) scale(0.98);
}

.profile-actions .el-button--primary.active {
  background: linear-gradient(135deg, var(--energy-orange), var(--energy-orange-light));
  box-shadow: 
    0 4px 20px rgba(255, 107, 53, 0.4),
    0 0 0 1px rgba(255, 107, 53, 0.1);
}

.profile-actions .el-button--primary.active:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 8px 30px rgba(255, 107, 53, 0.6),
    0 0 0 2px rgba(255, 107, 53, 0.2);
}

.resume-btn {
  position: relative;
  background: linear-gradient(135deg, rgba(26, 26, 62, 0.9), rgba(18, 18, 46, 0.95));
  border: 2px solid rgba(255, 184, 0, 0.5);
  color: var(--sun-gold);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.resume-btn:hover:not(:disabled) {
  background: rgba(255, 184, 0, 0.15);
  border-color: var(--sun-gold);
  transform: translateY(-4px);
  box-shadow: 
    0 8px 25px rgba(255, 184, 0, 0.3),
    0 0 20px rgba(255, 184, 0, 0.1);
}

.resume-btn:active:not(:disabled) {
  transform: translateY(-2px) scale(0.98);
}

.resume-btn.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
  color: var(--text-disabled);
}

.resume-btn.is-disabled:hover {
  transform: none;
  box-shadow: none;
}

.resume-version {
  margin-left: 5px;
  font-size: 12px;
  color: #ffb800;
  background: rgba(255, 184, 0, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
}

.contact-panel {
  margin-top: 25px;
  padding: 25px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 15px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #00d4ff;
  font-family: 'Orbitron', sans-serif;
  font-size: 16px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.contact-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 184, 0, 0.15);
  border-radius: 10px;
  color: #ffb800;
  flex-shrink: 0;
}

.contact-detail {
  display: flex;
  flex-direction: column;
}

.contact-label {
  font-size: 12px;
  color: #4a5568;
  margin-bottom: 3px;
}

.contact-value {
  font-size: 15px;
  color: #e2e8f0;
  text-decoration: none;
  transition: color 0.3s;
}

.contact-value:hover {
  color: #00d4ff;
}

.social-links {
  padding-top: 15px;
  border-top: 1px solid rgba(0, 212, 255, 0.1);
}

.social-label {
  font-size: 12px;
  color: #4a5568;
  margin-bottom: 12px;
  display: block;
}

.social-icons {
  display: flex;
  gap: 15px;
}

.social-link {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 10px;
  color: #718096;
  text-decoration: none;
  transition: all 0.3s;
  border: 1px solid rgba(0, 212, 255, 0.2);
}

.social-link:hover {
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(0, 212, 255, 0.3);
}

.content-section {
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

.about-text p {
  color: #718096;
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 15px;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.achievement-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.achievement-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 184, 0, 0.15);
  border-radius: 10px;
  color: #ffb800;
  flex-shrink: 0;
}

.achievement-content h4 {
  color: #fff;
  margin-bottom: 5px;
}

.achievement-content p {
  color: #718096;
  font-size: 14px;
  margin-bottom: 8px;
}

.achievement-date {
  color: #4a5568;
  font-size: 12px;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #00d4ff, rgba(0, 212, 255, 0.3));
  border-radius: 1px;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -26px;
  top: 5px;
  width: 16px;
  height: 16px;
  background: #00d4ff;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.timeline-content h4 {
  color: #fff;
  margin-bottom: 5px;
}

.timeline-date {
  color: #ffb800;
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  margin-right: 15px;
}

.timeline-content p {
  color: #718096;
  font-size: 14px;
  margin-top: 8px;
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

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.skill-header el-icon {
  color: #00d4ff;
}

.skill-name {
  color: #fff;
}

.skill-bar {
  height: 6px;
  background: rgba(74, 85, 104, 0.5);
  border-radius: 3px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff, #ffb800);
  border-radius: 3px;
}

.skill-level {
  color: #00d4ff;
  font-family: 'Orbitron', sans-serif;
  font-size: 12px;
  text-align: right;
}

.galaxy-map {
  position: relative;
  width: 100%;
  height: 200px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
  border-radius: 12px;
}

.galaxy-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #ffb800 0%, rgba(255, 184, 0, 0.3) 100%);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(255, 184, 0, 0.5);
}

.galaxy-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px dashed rgba(0, 212, 255, 0.2);
  border-radius: 50%;
}

.ring1 {
  width: 60px;
  height: 60px;
}

.ring2 {
  width: 100px;
  height: 100px;
}

.ring3 {
  width: 140px;
  height: 140px;
}

.explored-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #00d4ff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.point-label {
  position: absolute;
  left: 15px;
  top: -8px;
  font-size: 10px;
  color: #718096;
  white-space: nowrap;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #718096;
  font-size: 14px;
}

.contact-item el-icon {
  color: #ffb800;
}

@media (max-width: 900px) {
  .content-section {
    grid-template-columns: 1fr;
  }
  
  .profile-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .profile-actions {
    flex-direction: column;
  }
}
</style>