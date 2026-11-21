<template>
  <div class="categories-content">
    <div class="content-header">
      <h2>分类管理</h2>
      <el-button type="primary" @click="showAddCategory = true">
        <el-icon name="plus" /> 添加分类
      </el-button>
    </div>

    <div class="category-tree-container">
      <el-tree
        :data="categoryTreeData"
        :props="treeProps"
        :expand-on-click-node="false"
        class="category-tree"
      >
        <template #default="{ node, data }">
          <span class="tree-node">
            {{ node.label }}
            <span class="node-count">({{ getArticleCount(data.id) }})</span>
          </span>
          <span class="tree-actions">
            <el-button
              size="mini"
              @click.stop="editCategory(data)"
            >
              <el-icon name="edit" />
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click.stop="deleteCategory(data)"
            >
              <el-icon name="delete" />
            </el-button>
          </span>
        </template>
      </el-tree>
    </div>

    <el-dialog
      title="添加分类"
      :visible.sync="showAddCategory"
      width="400px"
    >
      <el-form :model="categoryForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="categoryForm.name" />
        </el-form-item>
        <el-form-item label="上级分类">
          <el-select v-model="categoryForm.parentId">
            <el-option label="顶级分类" :value="0" />
            <el-option
              v-for="cat in articleStore.categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddCategory = false">取消</el-button>
        <el-button type="primary" @click="addCategory">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useArticleStore } from '../../../stores/article'

const articleStore = useArticleStore()

const showAddCategory = ref(false)
const categoryForm = ref({
  name: '',
  parentId: 0
})

const treeProps = {
  label: 'name',
  children: 'children'
}

const categoryTreeData = computed(() => {
  return articleStore.categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    children: cat.children
  }))
})

function getArticleCount(categoryId) {
  const ids = articleStore.getCategoryIds(categoryId)
  return articleStore.articles.filter(a => ids.includes(a.categoryId)).length
}

function editCategory(data) {
  ElMessage.info('编辑功能开发中')
}

function deleteCategory(data) {
  ElMessage.warning('分类删除需要先删除关联文章')
}

function addCategory() {
  if (!categoryForm.value.name.trim()) {
    ElMessage.warning('请输入分类名称')
    return
  }

  if (categoryForm.value.parentId === 0) {
    articleStore.categories.push({
      id: Date.now(),
      name: categoryForm.value.name,
      children: []
    })
  } else {
    const parent = articleStore.categories.find(c => c.id === categoryForm.value.parentId)
    if (parent) {
      parent.children.push({
        id: Date.now(),
        name: categoryForm.value.name,
        parentId: parent.id
      })
    }
  }

  showAddCategory.value = false
  categoryForm.value = { name: '', parentId: 0 }
  ElMessage.success('添加成功')
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

.category-tree-container {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
  padding: 25px;
}

.category-tree {
  --el-tree-node-hover-bg-color: rgba(0, 212, 255, 0.1);
}

.category-tree :deep(.el-tree-node__content) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.tree-node {
  color: #a0aec0;
}

.node-count {
  color: #718096;
  font-size: 0.8rem;
}

.tree-actions {
  display: flex;
  gap: 5px;
}
</style>