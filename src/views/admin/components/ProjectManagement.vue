<template>
  <div class="projects-content">
    <div class="content-header">
      <h2>项目管理</h2>
      <el-button type="primary" @click="openAddProject">
        <el-icon name="plus" /> 新建项目
      </el-button>
    </div>

    <div class="filter-bar">
      <el-input
        v-model="projectSearchQuery"
        placeholder="搜索项目名称..."
        class="search-input"
      >
        <template #append>
          <el-button @click="handleProjectSearch">
            <el-icon name="search" />
          </el-button>
        </template>
      </el-input>

      <el-select
        v-model="projectFilterStatus"
        placeholder="选择状态"
        class="status-filter"
      >
        <el-option label="全部" value="" />
        <el-option label="进行中" value="active" />
        <el-option label="已完成" value="completed" />
        <el-option label="规划中" value="planning" />
      </el-select>
    </div>

    <el-table
      :data="paginatedProjects"
      border
      class="project-table"
    >
      <el-table-column prop="name" label="项目名称" min-width="200" />
      <el-table-column prop="description" label="描述" min-width="300" />
      <el-table-column prop="language" label="技术栈" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag
            :class="scope.row.status === 'active' ? 'success' : scope.row.status === 'completed' ? 'info' : 'warning'"
          >
            {{ scope.row.status === 'active' ? '进行中' : scope.row.status === 'completed' ? '已完成' : '规划中' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updated" label="更新时间" width="140" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button
            size="small"
            @click="editProject(scope.row)"
          >
            <el-icon name="edit" /> 编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleProjectDelete(scope.row.id)"
          >
            <el-icon name="delete" /> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="projectCurrentPage"
        :page-size="projectPageSize"
        :total="filteredProjects.length"
        layout="total, prev, pager, next, jumper"
      />
    </div>

    <el-dialog
      :title="projectForm.id ? '编辑项目' : '添加项目'"
      :visible.sync="showAddProject"
      width="500px"
    >
      <el-form :model="projectForm" label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="projectForm.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目描述">
          <el-textarea v-model="projectForm.description" placeholder="请输入项目描述" :rows="3" />
        </el-form-item>
        <el-form-item label="项目图标">
          <el-select v-model="projectForm.icon" placeholder="选择图标">
            <el-option v-for="icon in projectIcons" :key="icon.value" :label="icon.label" :value="icon.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="技术栈">
          <el-input v-model="projectForm.language" placeholder="请输入技术栈" />
        </el-form-item>
        <el-form-item label="项目状态">
          <el-select v-model="projectForm.status">
            <el-option label="进行中" value="active" />
            <el-option label="已完成" value="completed" />
            <el-option label="规划中" value="planning" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="projectForm.tags" placeholder="多个标签用逗号分隔" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddProject = false">取消</el-button>
        <el-button type="primary" @click="saveProject">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useProjectStore } from '../../../stores/project'

const projectStore = useProjectStore()

const projectSearchQuery = ref('')
const projectFilterStatus = ref('')
const projectCurrentPage = ref(1)
const projectPageSize = ref(10)
const showAddProject = ref(false)

const projectForm = ref({
  id: null,
  name: '',
  description: '',
  icon: 'folder',
  language: 'Python',
  status: 'active',
  tags: ''
})

const projectIcons = [
  { value: 'folder', label: '文件夹' },
  { value: 'compass', label: '指南针' },
  { value: 'radio', label: '无线电' },
  { value: 'zap', label: '闪电' },
  { value: 'rocket', label: '火箭' },
  { value: 'cpu', label: 'CPU' },
  { value: 'map', label: '地图' },
  { value: 'heart', label: '心脏' },
  { value: 'shield', label: '护盾' },
  { value: 'bar-chart', label: '图表' }
]

const filteredProjects = computed(() => {
  let result = [...projectStore.projects]

  if (projectSearchQuery.value) {
    const query = projectSearchQuery.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query))
  }

  if (projectFilterStatus.value) {
    result = result.filter(p => p.status === projectFilterStatus.value)
  }

  return result.sort((a, b) => new Date(b.updated) - new Date(a.updated))
})

const paginatedProjects = computed(() => {
  const start = (projectCurrentPage.value - 1) * projectPageSize.value
  const end = start + projectPageSize.value
  return filteredProjects.value.slice(start, end)
})

function handleProjectSearch() {
  projectCurrentPage.value = 1
}

function openAddProject() {
  projectForm.value = {
    id: null,
    name: '',
    description: '',
    icon: 'folder',
    language: 'Python',
    status: 'active',
    tags: ''
  }
  showAddProject.value = true
}

function editProject(project) {
  projectForm.value = {
    id: project.id,
    name: project.name,
    description: project.description,
    icon: project.icon,
    language: project.language,
    status: project.status,
    tags: project.tags.join(', ')
  }
  showAddProject.value = true
}

async function handleProjectDelete(id) {
  const confirm = await ElMessageBox.confirm(
    '确定要删除这个项目吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )

  if (confirm) {
    projectStore.deleteProject(id)
    ElMessage.success('删除成功')
  }
}

function saveProject() {
  if (!projectForm.value.name.trim()) {
    ElMessage.warning('请输入项目名称')
    return
  }

  if (!projectForm.value.description.trim()) {
    ElMessage.warning('请输入项目描述')
    return
  }

  const tagsArray = projectForm.value.tags.split(',').map(t => t.trim()).filter(t => t)

  if (projectForm.value.id) {
    projectStore.updateProject(projectForm.value.id, {
      name: projectForm.value.name,
      description: projectForm.value.description,
      icon: projectForm.value.icon,
      language: projectForm.value.language,
      status: projectForm.value.status,
      tags: tagsArray.length > 0 ? tagsArray : ['未分类']
    })
    ElMessage.success('更新成功')
  } else {
    projectStore.createProject({
      name: projectForm.value.name,
      description: projectForm.value.description,
      icon: projectForm.value.icon,
      language: projectForm.value.language,
      status: projectForm.value.status,
      tags: tagsArray.length > 0 ? tagsArray : ['未分类']
    })
    ElMessage.success('创建成功')
  }

  showAddProject.value = false
  projectForm.value = {
    id: null,
    name: '',
    description: '',
    icon: 'folder',
    language: 'Python',
    status: 'active',
    tags: ''
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

.status-filter {
  width: 150px;
}

.project-table {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
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
  .status-filter {
    width: 100%;
  }
}
</style>