<template>
  <div class="article-detail-page">
    <div class="reading-progress">
      <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <div v-if="articleStore.loading" class="loading-container">
      <el-spinner type="dots" />
    </div>

    <template v-else-if="article">
      <div class="article-header">
        <div class="header-bg"></div>
        <div class="header-glow"></div>
        <div class="header-content">
          <div class="article-meta-top">
            <span class="category-badge">
              <el-icon name="folder" />
              {{ articleStore.getCategoryName(article.categoryId) }}
            </span>
            <span class="status-tag" :class="article.status">
              {{ article.status === 'published' ? '已发布' : '草稿' }}
            </span>
          </div>
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
            <span class="meta-item">
              <el-icon name="user" />
              {{ article.author }}
            </span>
            <span class="meta-item">
              <el-icon name="calendar" />
              {{ article.publishTime || article.createdAt }}
            </span>
            <span class="meta-item">
              <el-icon name="eye" />
              {{ article.views }}
            </span>
            <span class="meta-item">
              <el-icon name="clock" />
              {{ readingTime }} 分钟阅读
            </span>
          </div>
          <div class="article-tags">
            <el-tag
              v-for="tag in article.tags"
              :key="tag"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>

      <div class="article-content-wrapper">
        <aside class="toc-sidebar" :class="{ 'toc-fixed': showFixedToc }">
          <div class="toc-header">
            <h3><el-icon name="list" /> 文章目录</h3>
          </div>
          <nav class="toc-nav">
            <ul class="toc-list">
              <li
                v-for="(item, index) in tocItems"
                :key="index"
                class="toc-item"
                :class="{ active: activeHeading === item.id, [`level-${item.level}`]: true }"
                @click="scrollToHeading(item.id)"
              >
                {{ item.text }}
              </li>
            </ul>
          </nav>
        </aside>

        <main class="article-content">
          <div 
            ref="contentRef"
            class="markdown-content"
            v-html="renderedContent"
          ></div>
        </main>
      </div>

      <div class="article-footer">
        <div class="share-section">
          <span class="share-label">分享文章</span>
          <div class="share-buttons">
            <el-button size="small" type="primary">
              <el-icon name="share" /> 分享
            </el-button>
            <el-button size="small">
              <el-icon name="like" /> 点赞
            </el-button>
          </div>
        </div>
        <div class="author-section">
          <div class="author-avatar">
            <el-icon :size="48" name="user" />
          </div>
          <div class="author-info">
            <h4>{{ article.author }}</h4>
            <p>前端开发者 / 技术博主</p>
          </div>
          <el-button size="small" type="primary">
            <el-icon name="user-plus" /> 关注
          </el-button>
        </div>
      </div>

      <CommentSection 
        :content-id="article.id" 
        content-type="article" 
      />

      <el-button
        v-show="showBackTop"
        class="back-top-btn"
        @click="scrollToTop"
      >
        <el-icon name="arrow-up" />
      </el-button>
    </template>

    <div v-else class="not-found">
      <el-icon name="file-text" :size="64" />
      <h2>文章未找到</h2>
      <p>该文章可能已被删除或不存在</p>
      <el-button @click="$router.push('/articles')">返回文章列表</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useArticleStore } from '../stores/article'
import { marked } from 'marked'
import hljs from 'highlight.js'
import CommentSection from '../components/CommentSection.vue'

marked.setOptions({
  breaks: true,
  gfm: true
})

const articleStore = useArticleStore()
const article = ref(null)
const contentRef = ref(null)
const activeHeading = ref('')
const showFixedToc = ref(false)
const showBackTop = ref(false)
const progressPercent = ref(0)

const renderedContent = computed(() => {
  if (!article.value) return ''
  return marked(article.value.content)
})

const tocItems = computed(() => {
  if (!article.value) return []
  
  const content = article.value.content
  const headingRegex = /^(#{1,3})\s+(.+)$/gm
  const items = []
  let match
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    items.push({ level, text, id })
  }
  
  return items
})

const readingTime = computed(() => {
  if (!article.value) return 0
  const wordsPerMinute = 300
  const wordCount = article.value.content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
})

function scrollToHeading(id) {
  activeHeading.value = id
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleScroll() {
  if (!contentRef.value) return
  
  const headings = contentRef.value.querySelectorAll('h1, h2, h3')
  let currentHeading = ''
  
  headings.forEach(heading => {
    const rect = heading.getBoundingClientRect()
    if (rect.top <= 150) {
      currentHeading = heading.id
    }
  })
  
  activeHeading.value = currentHeading
  showFixedToc.value = window.scrollY > 300
  showBackTop.value = window.scrollY > 500

  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progressPercent.value = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
}

onMounted(async () => {
  const id = window.location.pathname.split('/').pop()
  article.value = articleStore.getArticle(id)
  
  if (article.value) {
    articleStore.incrementViews(id)
  }
  
  await nextTick()
  
  document.querySelectorAll('pre code').forEach(block => {
    hljs.highlightElement(block)
  })
  
  const headings = document.querySelectorAll('.markdown-content h1, .markdown-content h2, .markdown-content h3')
  headings.forEach((heading, index) => {
    let id = heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (document.getElementById(id)) {
      id = id + '-' + index
    }
    heading.id = id
  })
  
  window.addEventListener('scroll', handleScroll)
})

watch(() => article.value, async () => {
  await nextTick()
  document.querySelectorAll('pre code').forEach(block => {
    hljs.highlightElement(block)
  })
})
</script>

<style scoped>
.article-detail-page {
  min-height: 100vh;
  position: relative;
}

.reading-progress {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--neon-blue), var(--sun-gold));
  transition: width var(--transition-fast);
  box-shadow: 0 0 10px var(--neon-blue);
}

.back-top-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-blue-dark));
  border: none;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
  transition: all var(--transition-normal);
  z-index: 1000;
}

.back-top-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 30px rgba(0, 212, 255, 0.6);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.article-header {
  position: relative;
  padding: 60px 20px;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(26, 26, 62, 0.95) 0%, rgba(10, 10, 26, 0.98) 100%);
}

.header-content {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.article-meta-top {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
  border-radius: 20px;
  font-size: 0.875rem;
}

.status-tag {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
}

.status-tag.published {
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
}

.status-tag.draft {
  background: rgba(255, 184, 0, 0.2);
  color: #ffb800;
}

.article-title {
  font-size: 2.5rem;
  color: #fff;
  margin: 0 0 20px 0;
  line-height: 1.3;
}

.article-meta {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #718096;
  font-size: 0.9rem;
}

.article-tags {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.tag-item {
  background: rgba(255, 184, 0, 0.15);
  color: #ffb800;
  border: none;
}

.article-content-wrapper {
  display: flex;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.toc-sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 100px;
}

.toc-fixed {
  position: fixed;
  top: 100px;
  right: calc((100% - 1200px) / 2 + 20px);
}

.toc-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.15);
}

.toc-header h3 {
  color: var(--neon-blue);
  font-size: 1rem;
  font-family: var(--font-family-display);
  letter-spacing: 2px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.toc-nav {
  background: rgba(26, 26, 62, 0.85);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: var(--radius-lg);
  padding: 16px;
  max-height: 450px;
  overflow-y: auto;
  backdrop-filter: blur(10px);
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  padding: 10px 14px;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  font-size: 0.875rem;
  position: relative;
}

.toc-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: var(--neon-blue);
  border-radius: 2px;
  transition: height var(--transition-fast);
}

.toc-item:hover {
  background: rgba(0, 212, 255, 0.1);
  color: var(--neon-blue);
  padding-left: 18px;
}

.toc-item:hover::before {
  height: 60%;
}

.toc-item.active {
  background: rgba(0, 212, 255, 0.15);
  color: var(--neon-blue);
  padding-left: 18px;
}

.toc-item.active::before {
  height: 100%;
}

.toc-item.level-2 {
  padding-left: 32px;
  font-size: 0.825rem;
}

.toc-item.level-2.active,
.toc-item.level-2:hover {
  padding-left: 36px;
}

.toc-item.level-3 {
  padding-left: 52px;
  font-size: 0.775rem;
  color: var(--text-disabled);
}

.toc-item.level-3.active,
.toc-item.level-3:hover {
  padding-left: 56px;
  color: var(--text-muted);
}

.article-content {
  flex: 1;
  min-width: 0;
}

.markdown-content {
  background: rgba(26, 26, 62, 0.6);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
  padding: 40px;
  color: #e2e8f0;
  line-height: 1.8;
}

.markdown-content :deep(h1) {
  font-size: 1.8rem;
  color: #fff;
  margin: 30px 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.markdown-content :deep(h2) {
  font-size: 1.5rem;
  color: #fff;
  margin: 25px 0 15px 0;
}

.markdown-content :deep(h3) {
  font-size: 1.25rem;
  color: #fff;
  margin: 20px 0 12px 0;
}

.markdown-content :deep(p) {
  margin: 15px 0;
}

.markdown-content :deep(a) {
  color: #00d4ff;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(code) {
  background: rgba(255, 184, 0, 0.15);
  color: #ffb800;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

.markdown-content :deep(pre) {
  background: rgba(10, 10, 26, 0.9);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
  margin: 20px 0;
}

.markdown-content :deep(pre code) {
  background: none;
  color: #e2e8f0;
  padding: 0;
  font-size: 0.875rem;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #00d4ff;
  padding-left: 20px;
  margin: 20px 0;
  color: #a0aec0;
  background: rgba(0, 212, 255, 0.05);
  padding: 15px 20px;
  border-radius: 0 8px 8px 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 30px;
  margin: 15px 0;
}

.markdown-content :deep(li) {
  margin: 8px 0;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid rgba(0, 212, 255, 0.2);
  padding: 12px 15px;
  text-align: left;
}

.markdown-content :deep(th) {
  background: rgba(0, 212, 255, 0.1);
  color: #00d4ff;
  font-weight: 600;
}

.markdown-content :deep(tr:nth-child(even)) {
  background: rgba(0, 0, 0, 0.2);
}

.markdown-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 15px 0;
}

.markdown-content :deep(hr) {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent);
  margin: 30px 0;
}

.article-footer {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
}

.share-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
  margin-bottom: 30px;
}

.share-label {
  color: #a0aec0;
}

.share-buttons {
  display: flex;
  gap: 10px;
}

.author-section {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
}

.author-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d4ff, #ffb800);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a0a1a;
}

.author-info {
  flex: 1;
}

.author-info h4 {
  color: #fff;
  margin: 0 0 5px 0;
}

.author-info p {
  color: #718096;
  margin: 0;
}

.not-found {
  text-align: center;
  padding: 80px 20px;
  color: #718096;
}

.not-found h2 {
  color: #fff;
  margin: 20px 0 10px 0;
}

@media (max-width: 900px) {
  .article-content-wrapper {
    flex-direction: column;
  }
  
  .toc-sidebar {
    width: 100%;
    position: static;
    order: 2;
  }
  
  .toc-fixed {
    position: static;
    right: auto;
  }
  
  .article-content {
    order: 1;
  }
  
  .markdown-content {
    padding: 25px;
  }
  
  .article-title {
    font-size: 1.8rem;
  }
  
  .article-meta {
    gap: 15px;
  }
}
</style>
