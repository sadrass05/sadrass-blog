<template>
  <div class="article-list-page">
    <div class="page-header">
      <div class="header-content">
        <h1><el-icon name="document" /> 文章列表</h1>
        <p class="page-desc">浏览我的全部文章，发现更多精彩内容</p>
      </div>
      <div class="header-glow"></div>
    </div>

    <div class="page-content">
      <aside class="sidebar">
        <div class="sidebar-section">
          <h3><el-icon name="folder" /> 文章分类</h3>
          <el-tree
            :data="categoryTree"
            :props="treeProps"
            :default-expanded-keys="expandedCategories"
            :highlight-current="true"
            @node-click="handleCategoryClick"
            class="category-tree"
          />
        </div>

        <div class="sidebar-section">
          <h3><el-icon name="bar-chart" /> 统计信息</h3>
          <div class="stats-box">
            <div class="stat-item">
              <span class="stat-value">{{ totalArticles }}</span>
              <span class="stat-label">总文章数</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ publishedArticles }}</span>
              <span class="stat-label">已发布</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ draftArticles }}</span>
              <span class="stat-label">草稿</span>
            </div>
          </div>
        </div>
      </aside>

      <main class="main-content">
        <div class="filter-bar">
          <div class="filter-left">
            <div class="sort-section">
              <span class="filter-label">排序：</span>
              <div class="sort-group">
                <el-select
                  v-model="articleStore.sortBy"
                  class="sort-select"
                  placeholder="选择排序字段"
                >
                  <el-option label="发布时间" value="publishTime" />
                  <el-option label="阅读量" value="views" />
                  <el-option label="更新时间" value="updatedAt" />
                </el-select>
                <el-button
                  @click="toggleSortOrder"
                  class="sort-btn"
                  :class="{ active: articleStore.sortOrder === 'asc' }"
                >
                  <el-icon :name="articleStore.sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'" />
                </el-button>
              </div>
            </div>

            <div class="page-size-section">
              <span class="filter-label">每页：</span>
              <el-select
                v-model="articleStore.pageSize"
                class="page-size-select"
              >
                <el-option :label="'10条'" :value="10" />
                <el-option :label="'20条'" :value="20" />
                <el-option :label="'50条'" :value="50" />
              </el-select>
            </div>
          </div>

          <div class="search-section">
            <div class="search-wrapper">
              <el-icon name="search" class="search-icon" />
              <el-input
                v-model="searchQuery"
                placeholder="搜索文章标题、标签..."
                class="search-input"
                @keyup.enter="handleSearch"
              />
              <el-button 
                v-if="searchQuery" 
                class="clear-btn"
                @click="clearSearch"
              >
                <el-icon name="close" />
              </el-button>
              <el-button 
                class="search-btn"
                @click="handleSearch"
              >
                <el-icon name="search" />
              </el-button>
            </div>
          </div>
        </div>

        <div v-if="articleStore.loading" class="loading-container">
          <el-spinner type="dots" />
        </div>

        <div v-else-if="filteredArticles.length === 0" class="empty-state">
          <el-icon name="file-text" :size="48" />
          <p>暂无文章</p>
        </div>

        <div v-else class="article-list">
          <article
            v-for="article in displayedArticles"
            :key="article.id"
            class="article-card"
            @click="$router.push(`/article/${article.id}`)"
          >
            <div class="article-header">
              <h2 class="article-title">{{ article.title }}</h2>
              <span
                class="status-tag"
                :class="article.status"
              >
                {{ article.status === 'published' ? '已发布' : '草稿' }}
              </span>
            </div>
            
            <div class="article-meta">
              <span class="meta-item">
                <el-icon name="folder" />
                {{ articleStore.getCategoryName(article.categoryId) }}
              </span>
              <span class="meta-item">
                <el-icon name="calendar" />
                {{ article.publishTime || article.createdAt }}
              </span>
              <span class="meta-item">
                <el-icon name="eye" />
                {{ article.views }}
              </span>
            </div>

            <div class="article-tags">
              <el-tag
                v-for="tag in article.tags"
                :key="tag"
                class="article-tag"
              >
                {{ tag }}
              </el-tag>
            </div>

            <p class="article-preview">{{ getPreview(article.content) }}</p>
          </article>
        </div>

        <div v-if="articleStore.totalPages > 1" class="pagination-container">
          <el-pagination
            v-model:current-page="articleStore.currentPage"
            :page-size="articleStore.pageSize"
            :total="filteredArticles.length"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useArticleStore } from '../stores/article'

const articleStore = useArticleStore()
const searchQuery = ref('')
const expandedCategories = ref([1, 2, 3])

const treeProps = {
  label: 'name',
  children: 'children'
}

const categoryTree = computed(() => {
  return articleStore.categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    children: cat.children
  }))
})

const totalArticles = computed(() => articleStore.articles.length)
const publishedArticles = computed(() => 
  articleStore.articles.filter(a => a.status === 'published').length
)
const draftArticles = computed(() => 
  articleStore.articles.filter(a => a.status === 'draft').length
)

const filteredArticles = computed(() => {
  let result = articleStore.filteredArticles
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(a => 
      a.title.toLowerCase().includes(query) ||
      a.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  return result
})

const displayedArticles = computed(() => {
  const start = (articleStore.currentPage - 1) * articleStore.pageSize
  const end = start + articleStore.pageSize
  return filteredArticles.value.slice(start, end)
})

function getPreview(content) {
  const text = content.replace(/[#*`]/g, '').substring(0, 150)
  return text + (content.length > 150 ? '...' : '')
}

function handleCategoryClick(data) {
  if (articleStore.selectedCategory === data.id) {
    articleStore.selectedCategory = null
  } else {
    articleStore.selectedCategory = data.id
  }
  articleStore.currentPage = 1
}

function toggleSortOrder() {
  articleStore.sortOrder = articleStore.sortOrder === 'asc' ? 'desc' : 'asc'
}

function handleSearch() {
  articleStore.currentPage = 1
}

function clearSearch() {
  searchQuery.value = ''
  articleStore.currentPage = 1
}

function handleSizeChange(val) {
  articleStore.pageSize = val
  articleStore.currentPage = 1
}

onMounted(() => {
  articleStore.fetchArticles()
})
</script>

<style scoped>
.article-list-page {
  min-height: 100vh;
}

.page-header {
  position: relative;
  padding: 40px 20px;
  text-align: center;
  background: linear-gradient(135deg, rgba(26, 26, 62, 0.9) 0%, rgba(10, 10, 26, 0.95) 100%);
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.header-content h1 {
  font-size: 2.5rem;
  color: #fff;
  margin: 0 0 10px 0;
}

.page-desc {
  color: #8892a6;
  margin: 0;
}

.header-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00d4ff, transparent);
}

.page-content {
  display: flex;
  gap: 30px;
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
}

.sidebar-section {
  background: linear-gradient(135deg, rgba(26, 26, 62, 0.9), rgba(18, 18, 46, 0.95));
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(15px);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.sidebar-section h3 {
  color: #00d4ff;
  margin: 0 0 15px 0;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-section h3 i {
  color: var(--sun-gold);
}

.category-tree {
  --el-tree-node-hover-bg-color: rgba(0, 212, 255, 0.15);
  --el-tree-node-current-bg-color: rgba(0, 212, 255, 0.25);
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 8px;
}

.category-tree :deep(.el-tree-node__content) {
  background: transparent;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.category-tree :deep(.el-tree-node__content:hover) {
  background: rgba(0, 212, 255, 0.1);
}

.category-tree :deep(.el-tree-node__label) {
  color: #a0aec0;
  font-weight: 500;
}

.category-tree :deep(.el-tree-node.is-current > .el-tree-node__content) {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.25), rgba(0, 212, 255, 0.15));
  border: 1px solid rgba(0, 212, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);
}

.category-tree :deep(.el-tree-node.is-current > .el-tree-node__content .el-tree-node__label) {
  color: #00d4ff;
  font-weight: 600;
}

.stats-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffb800;
}

.stat-label {
  color: #718096;
  font-size: 0.875rem;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 18px 28px;
  background: linear-gradient(135deg, rgba(26, 26, 62, 0.9), rgba(18, 18, 46, 0.95));
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: var(--radius-lg);
  margin-bottom: 24px;
  flex-wrap: wrap;
  backdrop-filter: blur(15px);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-label {
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 0;
}

.sort-select,
.page-size-select {
  width: 140px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5));
  border: 1px solid rgba(0, 212, 255, 0.25);
  border-radius: var(--radius-md) 0 0 var(--radius-md);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.sort-select:hover,
.page-size-select:hover {
  border-color: rgba(0, 212, 255, 0.4);
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.15);
}

.sort-select:focus,
.page-size-select:focus {
  border-color: var(--neon-blue);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.25);
}

.sort-btn {
  padding: 10px 16px;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: var(--neon-blue);
  transition: all 0.3s ease;
  font-weight: 500;
}

.sort-btn:hover {
  background: rgba(0, 212, 255, 0.2);
  border-color: rgba(0, 212, 255, 0.5);
  transform: translateY(-1px);
}

.sort-btn.active {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(0, 212, 255, 0.2));
  border-color: var(--neon-blue);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.35);
  font-weight: 600;
}

.search-section {
  flex-shrink: 0;
}

.search-wrapper {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: var(--radius-lg);
  padding: 0 12px;
  transition: all var(--transition-fast);
}

.search-wrapper:focus-within {
  border-color: var(--neon-blue);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
}

.search-icon {
  color: var(--text-disabled);
  margin-right: 8px;
}

.search-input {
  width: 280px;
  border: none;
  background: transparent;
}

.clear-btn {
  padding: 8px;
  color: var(--text-muted);
  transition: all var(--transition-fast);
}

.clear-btn:hover {
  color: var(--danger-red);
}

.search-btn {
  padding: 10px 16px;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-blue-dark));
  border: none;
  border-radius: var(--radius-md);
  margin-left: 8px;
  transition: all var(--transition-fast);
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #718096;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-card {
  background: rgba(26, 26, 62, 0.85);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: var(--radius-lg);
  padding: 24px;
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.article-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.08), transparent);
  transition: left var(--transition-slow);
}

.article-card:hover::before {
  left: 100%;
}

.article-card:hover {
  border-color: rgba(0, 212, 255, 0.4);
  transform: translateY(-4px);
  box-shadow: 
    0 12px 40px rgba(0, 212, 255, 0.18),
    0 0 20px rgba(0, 212, 255, 0.1);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.article-title {
  font-size: 1.25rem;
  color: #fff;
  margin: 0;
  flex: 1;
  line-height: 1.4;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 15px;
}

.status-tag.published {
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
}

.status-tag.draft {
  background: rgba(255, 184, 0, 0.2);
  color: #ffb800;
}

.article-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #718096;
  font-size: 0.875rem;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.article-tag {
  background: rgba(255, 184, 0, 0.1);
  color: #ffb800;
  border: none;
  font-size: 0.75rem;
}

.article-preview {
  color: #a0aec0;
  margin: 0;
  line-height: 1.6;
  font-size: 0.9rem;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 30px 0;
}

:deep(.el-pagination) {
  --el-pagination-button-bg-color: linear-gradient(135deg, rgba(26, 26, 62, 0.9), rgba(18, 18, 46, 0.95));
  --el-pagination-button-text-color: #a0aec0;
  --el-pagination-button-hover-bg-color: rgba(0, 212, 255, 0.25);
  --el-pagination-button-active-bg-color: linear-gradient(135deg, rgba(0, 212, 255, 0.35), rgba(0, 212, 255, 0.25));
  --el-pagination-button-active-text-color: #00d4ff;
  --el-pagination-border-radius: 8px;
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next),
:deep(.el-pagination .el-pager li) {
  background: linear-gradient(135deg, rgba(26, 26, 62, 0.9), rgba(18, 18, 46, 0.95));
  border: 1px solid rgba(0, 212, 255, 0.2);
  color: var(--text-primary);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

:deep(.el-pagination .btn-prev:hover),
:deep(.el-pagination .btn-next:hover),
:deep(.el-pagination .el-pager li:hover) {
  background: rgba(0, 212, 255, 0.2);
  border-color: rgba(0, 212, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.25);
}

:deep(.el-pagination .btn-prev:active),
:deep(.el-pagination .btn-next:active),
:deep(.el-pagination .el-pager li:active) {
  transform: translateY(0) scale(0.98);
}

:deep(.el-pagination .el-pager li.is-active) {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.4), rgba(0, 212, 255, 0.3));
  border-color: var(--neon-blue);
  color: #00d4ff;
  font-weight: 600;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
}

:deep(.el-pagination .btn-prev:disabled),
:deep(.el-pagination .btn-next:disabled) {
  opacity: 0.4;
  cursor: not-allowed;
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

:deep(.el-pagination .btn-prev:disabled:hover),
:deep(.el-pagination .btn-next:disabled:hover) {
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .page-content {
    flex-direction: column;
    padding: 20px;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    max-width: none;
  }
}
</style>
