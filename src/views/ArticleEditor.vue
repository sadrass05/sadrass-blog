<template>
  <div class="article-editor-page">
    <div class="editor-header">
      <div class="header-left">
        <el-button @click="$router.push('/admin')">
          <el-icon name="arrow-left" /> 返回
        </el-button>
        <h1>{{ isEdit ? '编辑文章' : '新建文章' }}</h1>
      </div>
      <div class="header-right">
        <el-button @click="saveDraft" :loading="saving">
          <el-icon name="save" /> 保存草稿
        </el-button>
        <el-button 
          type="primary" 
          @click="publishArticle" 
          :loading="publishing"
          v-if="form.status !== 'published'"
        >
          <el-icon name="send" /> 发布文章
        </el-button>
        <el-button 
          type="success" 
          @click="updatePublished" 
          :loading="publishing"
          v-else
        >
          <el-icon name="refresh" /> 更新发布
        </el-button>
      </div>
    </div>

    <div class="editor-content">
      <div class="editor-main">
        <div class="form-section">
          <el-form :model="form" label-width="100px">
            <el-form-item label="文章标题">
              <el-input
                v-model="form.title"
                placeholder="请输入文章标题"
                class="title-input"
              />
            </el-form-item>

            <el-form-item label="文章分类">
              <el-cascader
                v-model="form.categoryId"
                :options="categoryOptions"
                placeholder="请选择分类"
                :show-all-levels="true"
              />
            </el-form-item>

            <el-form-item label="文章标签">
              <el-tag
                v-for="(tag, index) in form.tags"
                :key="index"
                closable
                @close="removeTag(index)"
                class="tag-item"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-model="newTag"
                placeholder="输入标签后按回车添加"
                class="tag-input"
                @keyup.enter="addTag"
              />
            </el-form-item>

            <el-form-item label="文章内容">
              <div class="editor-tabs">
                <el-tabs v-model="activeTab" type="border-card">
                  <el-tab-pane label="Markdown" name="markdown">
                    <textarea
                      v-model="form.content"
                      class="markdown-textarea"
                      placeholder="使用 Markdown 格式编写文章..."
                    ></textarea>
                  </el-tab-pane>
                  <el-tab-pane label="预览" name="preview">
                    <div 
                      class="preview-content"
                      v-html="renderedContent"
                    ></div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-form-item>

            <el-form-item label="状态">
              <el-select v-model="form.status" class="status-select">
                <el-option label="草稿" value="draft" />
                <el-option label="已发布" value="published" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <aside class="editor-sidebar">
        <div class="sidebar-section">
          <h3><el-icon name="info" /> 文章信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">字数统计</span>
              <span class="info-value">{{ wordCount }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">预计阅读时间</span>
              <span class="info-value">{{ readingTime }} 分钟</span>
            </div>
            <div class="info-item">
              <span class="info-label">标签数量</span>
              <span class="info-value">{{ form.tags.length }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3><el-icon name="clock" /> 时间信息</h3>
          <div class="time-info">
            <div class="time-item">
              <span class="time-label">创建时间</span>
              <span class="time-value">{{ form.createdAt || '未创建' }}</span>
            </div>
            <div class="time-item">
              <span class="time-label">更新时间</span>
              <span class="time-value">{{ form.updatedAt || '未更新' }}</span>
            </div>
            <div class="time-item">
              <span class="time-label">发布时间</span>
              <span class="time-value">{{ form.publishTime || '未发布' }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3><el-icon name="settings" /> 快捷操作</h3>
          <div class="quick-actions">
            <el-button size="small" block @click="insertMarkdown('bold')">
              <el-icon name="bold" /> 加粗
            </el-button>
            <el-button size="small" block @click="insertMarkdown('italic')">
              <el-icon name="italic" /> 斜体
            </el-button>
            <el-button size="small" block @click="insertMarkdown('code')">
              <el-icon name="code" /> 代码
            </el-button>
            <el-button size="small" block @click="insertMarkdown('link')">
              <el-icon name="link" /> 链接
            </el-button>
            <el-button size="small" block @click="insertMarkdown('image')">
              <el-icon name="image" /> 图片
            </el-button>
            <el-button size="small" block @click="insertMarkdown('table')">
              <el-icon name="table" /> 表格
            </el-button>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useArticleStore } from '../stores/article'
import { marked } from 'marked'
import { ElMessage } from 'element-plus'

const articleStore = useArticleStore()

const isEdit = ref(false)
const articleId = ref(null)
const saving = ref(false)
const publishing = ref(false)
const activeTab = ref('markdown')
const newTag = ref('')

const form = ref({
  title: '',
  content: '',
  categoryId: [],
  tags: [],
  author: '张三',
  status: 'draft',
  createdAt: null,
  updatedAt: null,
  publishTime: null,
  views: 0
})

marked.setOptions({
  breaks: true,
  gfm: true
})

const categoryOptions = computed(() => {
  return articleStore.categories.map(cat => ({
    value: cat.id,
    label: cat.name,
    children: cat.children?.map(child => ({
      value: child.id,
      label: child.name
    }))
  }))
})

const renderedContent = computed(() => {
  if (!form.value.content) return '<p class="empty-preview">预览区域</p>'
  return marked(form.value.content)
})

const wordCount = computed(() => {
  return form.value.content.replace(/\s/g, '').length
})

const readingTime = computed(() => {
  const wordsPerMinute = 300
  return Math.ceil(wordCount.value / wordsPerMinute) || 1
})

function addTag() {
  const tag = newTag.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
  }
  newTag.value = ''
}

function removeTag(index) {
  form.value.tags.splice(index, 1)
}

function insertMarkdown(type) {
  const textarea = document.querySelector('.markdown-textarea')
  if (!textarea) return
  
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = form.value.content.substring(start, end)
  
  let insertText = ''
  
  switch (type) {
    case 'bold':
      insertText = `**${selectedText || '加粗文字'}**`
      break
    case 'italic':
      insertText = `*${selectedText || '斜体文字'}*`
      break
    case 'code':
      insertText = `\`${selectedText || '代码'}\``
      break
    case 'link':
      insertText = `[${selectedText || '链接文字'}](https://example.com)`
      break
    case 'image':
      insertText = `![图片描述](https://example.com/image.jpg)`
      break
    case 'table':
      insertText = `| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容1 | 内容2 | 内容3 |`
      break
  }
  
  form.value.content = 
    form.value.content.substring(0, start) + 
    insertText + 
    form.value.content.substring(end)
  
  setTimeout(() => {
    textarea.focus()
    const newPos = start + insertText.length
    textarea.setSelectionRange(newPos, newPos)
  }, 0)
}

function saveDraft() {
  saving.value = true
  try {
    if (isEdit.value) {
      articleStore.updateArticle(articleId.value, {
        ...form.value,
        status: 'draft'
      })
    } else {
      articleStore.createArticle({
        ...form.value,
        categoryId: form.value.categoryId[form.value.categoryId.length - 1] || 1
      })
    }
    ElMessage.success('草稿保存成功')
  } catch (e) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

function publishArticle() {
  if (!form.value.title.trim()) {
    ElMessage.warning('请输入文章标题')
    return
  }
  if (!form.value.content.trim()) {
    ElMessage.warning('请输入文章内容')
    return
  }
  
  publishing.value = true
  try {
    if (isEdit.value) {
      articleStore.updateArticle(articleId.value, {
        ...form.value,
        status: 'published',
        categoryId: form.value.categoryId[form.value.categoryId.length - 1] || 1
      })
    } else {
      articleStore.createArticle({
        ...form.value,
        status: 'published',
        categoryId: form.value.categoryId[form.value.categoryId.length - 1] || 1
      })
    }
    ElMessage.success('文章发布成功')
    setTimeout(() => {
      window.location.href = '/admin'
    }, 1500)
  } catch (e) {
    ElMessage.error('发布失败')
  } finally {
    publishing.value = false
  }
}

function updatePublished() {
  publishing.value = true
  try {
    articleStore.updateArticle(articleId.value, {
      ...form.value,
      categoryId: form.value.categoryId[form.value.categoryId.length - 1] || 1
    })
    ElMessage.success('文章更新成功')
  } catch (e) {
    ElMessage.error('更新失败')
  } finally {
    publishing.value = false
  }
}

onMounted(() => {
  const path = window.location.pathname
  const match = path.match(/\/admin\/article\/(\d+)/)
  
  if (match) {
    isEdit.value = true
    articleId.value = match[1]
    const article = articleStore.getArticle(match[1])
    
    if (article) {
      form.value = {
        ...article,
        categoryId: [article.categoryId]
      }
    }
  }
})
</script>

<style scoped>
.article-editor-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.editor-header {
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
  gap: 10px;
}

.editor-content {
  flex: 1;
  display: flex;
  gap: 30px;
  padding: 30px;
}

.editor-main {
  flex: 1;
  min-width: 0;
}

.form-section {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
  padding: 30px;
}

.title-input {
  font-size: 1.25rem;
}

.tag-item {
  background: rgba(255, 184, 0, 0.15);
  color: #ffb800;
  border: none;
  margin-right: 8px;
  margin-bottom: 8px;
}

.tag-input {
  width: 200px;
  margin-top: 10px;
}

.editor-tabs {
  height: 500px;
}

.editor-tabs :deep(.el-tabs__content) {
  height: calc(100% - 54px);
  overflow: auto;
}

.markdown-textarea {
  width: 100%;
  height: 100%;
  resize: none;
  background: rgba(10, 10, 26, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  padding: 20px;
  color: #e2e8f0;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 1rem;
  line-height: 1.6;
}

.markdown-textarea:focus {
  outline: none;
  border-color: #00d4ff;
}

.preview-content {
  height: 100%;
  padding: 20px;
  background: rgba(10, 10, 26, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  color: #e2e8f0;
  line-height: 1.8;
  overflow-y: auto;
}

.preview-content :deep(h1) {
  font-size: 1.5rem;
  color: #fff;
  margin: 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.preview-content :deep(h2) {
  font-size: 1.3rem;
  color: #fff;
  margin: 18px 0;
}

.preview-content :deep(h3) {
  font-size: 1.1rem;
  color: #fff;
  margin: 15px 0;
}

.preview-content :deep(p) {
  margin: 12px 0;
}

.preview-content :deep(code) {
  background: rgba(255, 184, 0, 0.15);
  color: #ffb800;
  padding: 2px 6px;
  border-radius: 4px;
}

.preview-content :deep(pre) {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  padding: 15px;
  overflow-x: auto;
}

.preview-content :deep(blockquote) {
  border-left: 4px solid #00d4ff;
  padding: 10px 15px;
  margin: 15px 0;
  color: #a0aec0;
  background: rgba(0, 212, 255, 0.05);
}

.preview-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
}

.preview-content :deep(th),
.preview-content :deep(td) {
  border: 1px solid rgba(0, 212, 255, 0.2);
  padding: 8px 12px;
}

.preview-content :deep(th) {
  background: rgba(0, 212, 255, 0.1);
  color: #00d4ff;
}

.empty-preview {
  color: #4a5568;
  text-align: center;
  padding: 100px 0;
}

.status-select {
  width: 150px;
}

.editor-sidebar {
  width: 280px;
  flex-shrink: 0;
}

.sidebar-section {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.sidebar-section h3 {
  color: #00d4ff;
  margin: 0 0 15px 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  color: #718096;
  font-size: 0.875rem;
}

.info-value {
  color: #ffb800;
  font-weight: 600;
}

.time-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.time-item {
  display: flex;
  justify-content: space-between;
}

.time-label {
  color: #718096;
  font-size: 0.875rem;
}

.time-value {
  color: #a0aec0;
  font-size: 0.875rem;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

@media (max-width: 900px) {
  .editor-content {
    flex-direction: column;
    padding: 20px;
  }
  
  .editor-sidebar {
    width: 100%;
  }
  
  .editor-tabs {
    height: 400px;
  }
}
</style>
