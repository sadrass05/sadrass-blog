<template>
  <div class="app-container">
    <div class="starfield"></div>
    <nav-bar />
    <main class="main-content">
      <router-view />
    </main>
    <footer-bar />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  background: var(--cosmic-black);
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }
}
</style>