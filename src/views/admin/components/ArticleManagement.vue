<template>
  <div class="articles-content">
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
      :data="paginatedArticles"
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
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useArticleStore } from '../../../stores/article'

const articleStore = useArticleStore()

const searchQuery = ref('')
const filterStatus = ref('')
const filterCategory = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

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

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredArticles.value.slice(start, end)
})

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
</script>

<style scoped>
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

@media (max-width: 900px) {
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