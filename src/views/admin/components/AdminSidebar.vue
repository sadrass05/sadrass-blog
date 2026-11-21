<template>
  <aside class="sidebar">
    <el-menu
      :default-active="activeMenu"
      class="admin-menu"
      @select="handleMenuSelect"
    >
      <el-menu-item index="dashboard">
        <template #icon><el-icon name="layout-dashboard" /></template>
        <span>数据概览</span>
      </el-menu-item>
      <el-menu-item index="articles">
        <template #icon><el-icon name="document" /></template>
        <span>文章管理</span>
      </el-menu-item>
      <el-menu-item index="categories">
        <template #icon><el-icon name="folder" /></template>
        <span>分类管理</span>
      </el-menu-item>
      <el-menu-item index="profile">
        <template #icon><el-icon name="user" /></template>
        <span>个人设置</span>
      </el-menu-item>
      <el-menu-item index="resume">
        <template #icon><el-icon name="file-text" /></template>
        <span>简历管理</span>
      </el-menu-item>
      <el-menu-item index="projects">
        <template #icon><el-icon name="folder-opened" /></template>
        <span>项目管理</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script setup>
const props = defineProps({
  activeMenu: {
    type: String,
    default: 'dashboard'
  }
})

const emit = defineEmits(['menu-select'])

function handleMenuSelect(key) {
  emit('menu-select', key)
}
</script>

<style scoped>
.sidebar {
  width: 200px;
  background: rgba(26, 26, 62, 0.9);
  border-right: 1px solid rgba(0, 212, 255, 0.2);
}

.admin-menu {
  border-right: none;
}

.admin-menu :deep(.el-menu-item) {
  color: #a0aec0;
}

.admin-menu :deep(.el-menu-item.is-active) {
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
}
</style>