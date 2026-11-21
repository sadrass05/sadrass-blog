<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-glow"></div>
        <div class="hero-title">
          <span class="title-prefix">PERSONAL BLOG</span>
          <h1><span class="gradient-text">个人博客</span></h1>
          <p class="hero-subtitle">记录生活点滴，分享技术心得</p>
        </div>
        <div class="hero-actions">
          <el-button type="primary" class="action-btn primary" @click="$router.push('/articles')">
            <el-icon name="file-text" /> 查看文章
          </el-button>
          <el-button class="action-btn secondary" @click="$router.push('/about')">
            <el-icon name="user" /> 关于我
          </el-button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="orbit-container">
          <div class="orbit">
            <div class="galaxy-arm"></div>
            <div class="galaxy-core"></div>
            <div class="galaxy-star" v-for="i in 12" :key="i" :style="{ animationDelay: (i * 0.2) + 's' }"></div>
            <div class="comet"></div>
            <div class="starship">
              <el-icon name="rocket" :size="32" />
            </div>
          </div>
          <div class="satellite sat-1">
            <el-icon name="globe" :size="20" />
          </div>
          <div class="satellite sat-2">
            <el-icon name="cloud" :size="16" />
          </div>
          <div class="satellite sat-3">
            <el-icon name="star" :size="18" />
          </div>
        </div>
        <div class="floating-particles">
          <div class="particle" v-for="i in 20" :key="i" :style="{ 
            left: Math.random() * 100 + '%', 
            top: Math.random() * 100 + '%',
            animationDelay: Math.random() * 5 + 's',
            animationDuration: (3 + Math.random() * 4) + 's'
          }"></div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div class="section-header">
        <h2><el-icon name="sparkles" /> 最新文章</h2>
        <el-button type="text" @click="$router.push('/articles')">查看全部</el-button>
      </div>
      <div class="article-grid">
        <el-card 
          v-for="article in articles" 
          :key="article.id" 
          class="article-card"
          @click="$router.push(`/article/${article.id}`)"
        >
          <div class="article-header">
            <div class="article-icon">
              <el-icon :size="32" :name="article.icon" />
            </div>
            <el-tag :type="article.tagType" class="article-tag">{{ article.tag }}</el-tag>
          </div>
          <h3 class="article-title">{{ article.title }}</h3>
          <p class="article-excerpt">{{ article.excerpt }}</p>
          <div class="article-meta">
            <span class="meta-item"><el-icon name="user" /> {{ article.author }}</span>
            <span class="meta-item"><el-icon name="eye" /> {{ article.views }}</span>
            <span class="meta-item"><el-icon name="calendar" /> {{ article.date }}</span>
          </div>
        </el-card>
      </div>
    </div>

    <div class="content-section">
      <div class="section-header">
        <h2><el-icon name="folder" /> 热门项目</h2>
        <el-button type="text" @click="$router.push('/projects')">查看全部</el-button>
      </div>
      <div class="project-grid">
        <el-card 
          v-for="(project, index) in projects" 
          :key="project.id" 
          :class="[`project-card`, `project-card-${index}`]"
          @click="$router.push(`/project/${project.id}`)"
        >
          <div class="project-icon">
            <el-icon :size="48" :name="project.icon" />
          </div>
          <h3 class="project-title">{{ project.name }}</h3>
          <p class="project-desc">{{ project.description }}</p>
          <div class="project-stats">
            <span class="stat"><el-icon name="star" /> {{ project.stars }}</span>
            <span class="stat"><el-icon name="git-branch" /> {{ project.forks }}</span>
            <span class="stat"><el-icon name="code" /> {{ project.language }}</span>
          </div>
        </el-card>
      </div>
    </div>

    <div class="content-section">
      <div class="section-header">
        <h2><el-icon name="calendar" /> 最新日记</h2>
        <el-button type="text" @click="$router.push('/diary')">查看全部</el-button>
      </div>
      <div class="diary-list">
        <div 
          v-for="diary in diaries" 
          :key="diary.id" 
          class="diary-item"
          @click="$router.push('/diary')"
        >
          <div class="diary-date">
            <span class="date-day">{{ diary.day }}</span>
            <span class="date-month">{{ diary.month }}</span>
          </div>
          <div class="diary-content">
            <h4>{{ diary.title }}</h4>
            <p>{{ diary.content }}</p>
          </div>
          <div class="diary-icon">
            <el-icon :name="diary.icon" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useArticleStore } from '../stores/article'
import { useProjectStore } from '../stores/project'

const articleStore = useArticleStore()
const projectStore = useProjectStore()

const articles = computed(() => {
  return articleStore.articles
    .filter(a => a.status === 'published')
    .sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime))
    .slice(0, 3)
    .map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.content.slice(0, 80) + '...',
      author: article.author,
      views: article.views >= 1000 ? (article.views / 1000).toFixed(1) + 'K' : article.views.toString(),
      date: article.publishTime?.split(' ')[0] || article.createdAt?.split(' ')[0] || '',
      tag: articleStore.getCategoryName(article.categoryId),
      tagType: 'success',
      icon: 'file-text'
    }))
})

const projects = computed(() => {
  return projectStore.projects
    .filter(p => p.status === 'active')
    .sort((a, b) => new Date(b.updated) - new Date(a.updated))
    .slice(0, 3)
})

const diaries = computed(() => {
  try {
    const saved = localStorage.getItem('diary_entries')
    if (saved) {
      const entries = JSON.parse(saved)
      return entries
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3)
        .map(entry => ({
          id: entry.id,
          day: new Date(entry.date).getDate().toString().padStart(2, '0'),
          month: new Date(entry.date).toLocaleString('en-US', { month: 'short' }).toUpperCase(),
          title: entry.title || '无题',
          content: entry.content.slice(0, 60) + '...',
          icon: 'book-open'
        }))
    }
  } catch (e) {
    console.error('Failed to load diaries:', e)
  }
  return [
    { id: 1, day: '15', month: 'JAN', title: '今日记事', content: '今天是美好的一天...', icon: 'book-open' },
    { id: 2, day: '14', month: 'JAN', title: '工作记录', content: '完成了重要的项目任务...', icon: 'book-open' },
    { id: 3, day: '13', month: 'JAN', title: '学习笔记', content: '学习了新的技术知识...', icon: 'book-open' }
  ]
})
</script>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 600px;
  padding: 60px 0;
  position: relative;
  overflow: hidden;
}

.hero-section > .hero-bg {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 0 !important;
  background: transparent !important;
  background-color: #0a0a1a !important;
  background: linear-gradient(180deg, #0a0a1a 0%, #050510 50%, #000000 100%) !important;
}

.hero-content {
  flex: 1;
  max-width: 650px;
  position: relative;
  z-index: 2;
}

.hero-glow {
  position: absolute;
  top: -150px;
  left: -150px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(20px);
  animation: hero-glow-pulse 4s ease-in-out infinite;
}

@keyframes hero-glow-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.title-prefix {
  display: block;
  color: var(--neon-blue);
  font-family: var(--font-family-display);
  font-size: 14px;
  letter-spacing: 6px;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.hero-title h1 {
  font-size: 56px;
  font-family: var(--font-family-display);
  margin-bottom: 20px;
  text-shadow: 0 0 40px rgba(0, 212, 255, 0.4);
}

.gradient-text {
  background: linear-gradient(135deg, var(--neon-blue), var(--sun-gold), var(--energy-orange));
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 5s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.hero-subtitle {
  color: var(--text-muted);
  font-size: 20px;
  line-height: 1.8;
  margin-bottom: 40px;
  font-family: var(--font-family-body);
}

.hero-actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 16px 40px;
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

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn:active {
  transform: scale(0.98);
}

.action-btn.primary {
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-blue-dark));
  border: 2px solid transparent;
  color: #fff;
  box-shadow: 
    0 4px 20px rgba(0, 212, 255, 0.4),
    0 0 0 1px rgba(0, 212, 255, 0.1);
}

.action-btn.primary:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 8px 30px rgba(0, 212, 255, 0.6),
    0 0 0 2px rgba(0, 212, 255, 0.2);
  background: linear-gradient(135deg, var(--neon-blue-light), var(--neon-blue));
}

.action-btn.primary:active {
  transform: translateY(-2px) scale(0.98);
}

.action-btn.secondary {
  background: rgba(26, 26, 62, 0.6);
  border: 2px solid rgba(0, 212, 255, 0.6);
  color: var(--neon-blue);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.action-btn.secondary:hover {
  background: rgba(0, 212, 255, 0.15);
  border-color: var(--neon-blue);
  transform: translateY(-4px);
  box-shadow: 
    0 8px 25px rgba(0, 212, 255, 0.3),
    0 0 20px rgba(0, 212, 255, 0.1);
}

.action-btn.secondary:active {
  transform: translateY(-2px) scale(0.98);
}

.hero-visual {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
}

.orbit-container {
  position: relative;
  width: 400px;
  height: 400px;
}

.satellite {
  position: absolute;
  color: var(--neon-blue);
  animation: satellite-orbit 20s linear infinite;
}

.sat-1 {
  animation-duration: 15s;
}

.sat-2 {
  animation-duration: 20s;
  animation-direction: reverse;
}

.sat-3 {
  animation-duration: 25s;
}

@keyframes satellite-orbit {
  from { transform: rotate(0deg) translateX(180px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(180px) rotate(-360deg); }
}

.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particle-float 4s ease-in-out infinite;
}

@keyframes particle-float {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 1; }
  50% { transform: translateY(-30px) translateX(15px); }
  90% { opacity: 1; }
}

.sun-container {
  position: relative;
  width: 200px;
  height: 200px;
}

.sun {
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, #ffc733 0%, #ff6b35 50%, #ffb800 100%);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 
    0 0 60px rgba(255, 184, 0, 0.6),
    0 0 120px rgba(255, 107, 53, 0.4),
    0 0 200px rgba(255, 184, 0, 0.2);
  animation: sun-pulse 4s ease-in-out infinite;
}

@keyframes sun-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.05); }
}

.sun-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(255, 184, 0, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  animation: sun-rotate 20s linear infinite;
}

@keyframes sun-rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.orbit {
  position: relative;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, 
    rgba(147, 51, 234, 0.3) 0%, 
    rgba(99, 102, 241, 0.2) 20%, 
    rgba(59, 130, 246, 0.1) 40%, 
    transparent 70%);
  overflow: hidden;
  animation: galaxy-rotate 40s linear infinite;
  box-shadow: 
    inset 0 0 60px rgba(147, 51, 234, 0.3),
    inset 0 0 120px rgba(99, 102, 241, 0.2),
    0 0 80px rgba(147, 51, 234, 0.2);
}

@keyframes galaxy-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.galaxy-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(255, 184, 0, 0.8) 20%, 
    rgba(147, 51, 234, 0.6) 50%, 
    transparent 70%);
  border-radius: 50%;
  animation: core-pulse 3s ease-in-out infinite;
  box-shadow: 
    0 0 30px rgba(255, 184, 0, 0.8),
    0 0 60px rgba(147, 51, 234, 0.6),
    0 0 100px rgba(99, 102, 241, 0.4);
}

@keyframes core-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.85; }
}

.galaxy-arm {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 50%;
}

.galaxy-arm::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: conic-gradient(from 0deg, 
    transparent 0deg,
    rgba(147, 51, 234, 0.3) 30deg,
    rgba(99, 102, 241, 0.2) 60deg,
    rgba(59, 130, 246, 0.15) 90deg,
    transparent 120deg,
    transparent 180deg,
    rgba(147, 51, 234, 0.25) 210deg,
    rgba(99, 102, 241, 0.18) 240deg,
    rgba(59, 130, 246, 0.12) 270deg,
    transparent 300deg);
  border-radius: 50%;
  animation: arm-rotate 60s linear infinite reverse;
}

@keyframes arm-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.galaxy-star {
  position: absolute;
  border-radius: 50%;
  background: white;
  animation: star-twinkle 2s ease-in-out infinite;
}

.galaxy-star:nth-child(3) { width: 2px; height: 2px; top: 20%; left: 45%; animation-delay: 0s; }
.galaxy-star:nth-child(4) { width: 3px; height: 3px; top: 35%; left: 70%; animation-delay: 0.3s; }
.galaxy-star:nth-child(5) { width: 2px; height: 2px; top: 55%; left: 75%; animation-delay: 0.6s; }
.galaxy-star:nth-child(6) { width: 4px; height: 4px; top: 70%; left: 60%; animation-delay: 0.9s; }
.galaxy-star:nth-child(7) { width: 2px; height: 2px; top: 65%; left: 35%; animation-delay: 1.2s; }
.galaxy-star:nth-child(8) { width: 3px; height: 3px; top: 45%; left: 25%; animation-delay: 1.5s; }
.galaxy-star:nth-child(9) { width: 2px; height: 2px; top: 30%; left: 30%; animation-delay: 1.8s; }
.galaxy-star:nth-child(10) { width: 3px; height: 3px; top: 50%; left: 85%; animation-delay: 0.4s; }
.galaxy-star:nth-child(11) { width: 2px; height: 2px; top: 80%; left: 45%; animation-delay: 0.7s; }
.galaxy-star:nth-child(12) { width: 4px; height: 4px; top: 25%; left: 65%; animation-delay: 1.1s; }

@keyframes star-twinkle {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

.comet {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  animation: comet-move 8s linear infinite;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.8), 0 0 20px rgba(0, 212, 255, 0.4);
}

.comet::after {
  content: '';
  position: absolute;
  width: 60px;
  height: 4px;
  background: linear-gradient(to right, rgba(0, 212, 255, 0.6), transparent);
  border-radius: 2px;
  transform: rotate(-45deg);
  transform-origin: left center;
}

@keyframes comet-move {
  0% { top: 10%; left: 90%; opacity: 0; }
  10% { opacity: 1; }
  50% { top: 60%; left: 30%; opacity: 1; }
  90% { opacity: 1; }
  100% { top: 80%; left: -10%; opacity: 0; }
}

.starship {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #00d4ff;
  animation: starship-float 3s ease-in-out infinite;
}

@keyframes starship-float {
  0%, 100% { transform: translate(-50%, -50%) translateY(0) rotate(0deg); }
  25% { transform: translate(-50%, -50%) translateY(-10px) rotate(2deg); }
  50% { transform: translate(-50%, -50%) translateY(-5px) rotate(0deg); }
  75% { transform: translate(-50%, -50%) translateY(-12px) rotate(-2deg); }
}

.content-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  letter-spacing: 2px;
}

.section-header h2 el-icon {
  color: #ffb800;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.article-card {
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 212, 255, 0.15);
}

.article-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
  transition: left var(--transition-slow);
}

.article-card:hover::before {
  left: 100%;
}

.article-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(0, 212, 255, 0.4);
  box-shadow: 
    0 20px 50px rgba(0, 212, 255, 0.2),
    0 0 30px rgba(0, 212, 255, 0.1);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.article-icon {
  color: var(--neon-blue);
  transition: transform var(--transition-normal);
}

.article-card:hover .article-icon {
  transform: scale(1.2) rotate(5deg);
}

.article-title {
  color: var(--text-primary);
  font-family: var(--font-family-display);
  font-size: 18px;
  margin-bottom: 12px;
  line-height: 1.4;
  transition: color var(--transition-fast);
}

.article-card:hover .article-title {
  color: var(--neon-blue);
}

.article-excerpt {
  color: #718096;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #4a5568;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.project-card {
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 184, 0, 0.15);
}

.project-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(255, 184, 0, 0.1), transparent 30deg);
  transition: transform 0.8s ease-out;
}

/* 第一个卡片：起始角度0°，顺时针旋转180°，较慢速度 */
.project-card-0::before {
  background: conic-gradient(from 0deg, transparent, rgba(255, 184, 0, 0.15), transparent 30deg);
  transform: rotate(0deg);
}

.project-card-0:hover::before {
  transform: rotate(180deg);
  transition: transform 1.2s ease-out;
}

/* 第二个卡片：起始角度120°，逆时针旋转90°，中等速度 */
.project-card-1::before {
  background: conic-gradient(from 120deg, transparent, rgba(0, 212, 255, 0.15), transparent 30deg);
  transform: rotate(120deg);
}

.project-card-1:hover::before {
  transform: rotate(30deg);
  transition: transform 0.9s ease-out;
}

/* 第三个卡片：起始角度240°，顺时针旋转270°，较快速度 */
.project-card-2::before {
  background: conic-gradient(from 240deg, transparent, rgba(46, 204, 113, 0.15), transparent 30deg);
  transform: rotate(240deg);
}

.project-card-2:hover::before {
  transform: rotate(510deg);
  transition: transform 0.6s ease-out;
}

.project-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(255, 184, 0, 0.4);
  box-shadow: 
    0 20px 50px rgba(255, 184, 0, 0.2),
    0 0 30px rgba(255, 184, 0, 0.1);
}

.project-icon {
  color: var(--sun-gold);
  margin-bottom: 15px;
  transition: all var(--transition-normal);
}

.project-card:hover .project-icon {
  transform: scale(1.3) rotate(-5deg);
  filter: drop-shadow(0 0 15px rgba(255, 184, 0, 0.5));
}

.project-title {
  color: var(--text-primary);
  font-family: var(--font-family-display);
  font-size: 18px;
  margin-bottom: 12px;
  transition: color var(--transition-fast);
}

.project-card:hover .project-title {
  color: var(--sun-gold);
}

.project-desc {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
}

.project-stats {
  display: flex;
  justify-content: center;
  gap: 25px;
}

.project-stats .stat {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-disabled);
  font-size: 14px;
  transition: color var(--transition-fast);
}

.project-card:hover .project-stats .stat {
  color: var(--text-muted);
}

.project-stats .stat el-icon {
  color: var(--neon-blue);
}

.diary-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.diary-item {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(26, 26, 62, 0.6);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(0, 212, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.diary-item:hover {
  background: rgba(26, 26, 62, 0.8);
  border-color: rgba(0, 212, 255, 0.3);
  transform: translateX(5px);
}

.diary-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.date-day {
  font-family: 'Orbitron', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #00d4ff;
}

.date-month {
  color: #4a5568;
  font-size: 12px;
  letter-spacing: 2px;
}

.diary-content {
  flex: 1;
}

.diary-content h4 {
  color: #fff;
  margin-bottom: 5px;
  font-family: 'Rajdhani', sans-serif;
}

.diary-content p {
  color: #718096;
  font-size: 14px;
  margin: 0;
}

.diary-icon {
  color: #ffb800;
  font-size: 20px;
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    min-height: auto;
  }
  
  .hero-title h1 {
    font-size: 32px;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .hero-visual {
    margin-top: 40px;
  }
  
  .article-grid,
  .project-grid {
    grid-template-columns: 1fr;
  }
  
  .diary-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>