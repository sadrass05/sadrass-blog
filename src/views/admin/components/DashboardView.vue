<template>
  <div class="dashboard-content">
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
</template>

<script setup>
import { computed } from 'vue'
import { useArticleStore } from '../../../stores/article'

const articleStore = useArticleStore()

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
</script>

<style scoped>
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

.stat-info {
  display: flex;
  flex-direction: column;
}

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

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-row {
    grid-template-columns: 1fr;
  }
}
</style>