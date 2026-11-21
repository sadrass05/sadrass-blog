<template>
  <el-footer class="footer-bar">
    <div class="footer-glow-top"></div>
    
    <div class="footer-container">
      <div class="footer-section brand-section">
        <div class="footer-logo">
          <div class="logo-icon-wrapper">
            <el-icon name="rocket" :size="32" />
          </div>
          <span class="logo-text">GALAXY<span class="logo-accent">BLOG</span></span>
        </div>
        <p class="footer-desc">探索宇宙，发现无限可能</p>
        <p class="footer-tagline">记录技术成长，分享编程心得</p>
        <div class="social-links">
          <a href="#" class="social-link" title="GitHub">
            <el-icon name="github" :size="20" />
          </a>
          <a href="#" class="social-link" title="CSDN">
            <el-icon name="book-open" :size="20" />
          </a>
          <a href="#" class="social-link" title="掘金">
            <el-icon name="sparkles" :size="20" />
          </a>
          <a href="#" class="social-link" title="微信">
            <el-icon name="message-circle" :size="20" />
          </a>
        </div>
      </div>
      
      <div class="footer-section">
        <h4 class="section-title">快速导航</h4>
        <ul class="nav-list">
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/articles">技术文章</router-link></li>
          <li><router-link to="/diary">每日日记</router-link></li>
          <li><router-link to="/projects">项目展示</router-link></li>
          <li><router-link to="/about">关于作者</router-link></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4 class="section-title">技术栈</h4>
        <ul class="tech-list">
          <li><span class="tech-tag">Vue 3</span></li>
          <li><span class="tech-tag">TypeScript</span></li>
          <li><span class="tech-tag">Element Plus</span></li>
          <li><span class="tech-tag">Node.js</span></li>
          <li><span class="tech-tag">MongoDB</span></li>
          <li><span class="tech-tag">Docker</span></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4 class="section-title">联系我</h4>
        <ul class="contact-list">
          <li>
            <el-icon name="mail" />
            <a href="mailto:developer@galaxyblog.io">developer@galaxyblog.io</a>
          </li>
          <li>
            <el-icon name="phone" />
            <span>+86 188-8888-8888</span>
          </li>
          <li>
            <el-icon name="map-marker" />
            <span>银河市星际大道 77 号</span>
          </li>
        </ul>
        <div class="newsletter">
          <p class="newsletter-label">订阅更新</p>
          <div class="newsletter-input-wrapper">
            <el-input 
              v-model="email" 
              placeholder="输入邮箱" 
              class="newsletter-input"
              size="small"
            />
            <el-button size="small" class="subscribe-btn">订阅</el-button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="copyright">
        <el-icon name="shield" />
        <span>&copy; 2026 GALAXY BLOG. All rights reserved.</span>
      </div>
      <div class="powered">
        <span>Built with </span>
        <el-icon name="heart" class="heart-icon" />
        <span> by </span>
        <span class="gradient-text">Starship Team</span>
      </div>
    </div>
    
    <div class="footer-glow-bottom"></div>
    
    <div class="footer-particles">
      <div class="particle" v-for="i in 15" :key="i" :style="{ 
        left: Math.random() * 100 + '%', 
        bottom: Math.random() * 50 + '%',
        animationDelay: Math.random() * 3 + 's'
      }"></div>
    </div>
  </el-footer>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const email = ref('')
</script>

<style scoped>
.footer-bar {
  background: linear-gradient(180deg, rgba(13, 13, 36, 0.98) 0%, rgba(10, 10, 26, 0.99) 100%);
  padding: 50px 20px 40px;
  border-top: 1px solid rgba(0, 212, 255, 0.15);
  position: relative;
  width: 100%;
  box-sizing: border-box;
  margin-top: 60px;
  overflow: hidden;
}

.footer-glow-top {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.6), transparent);
  animation: glow-pulse 4s ease-in-out infinite;
}

.footer-glow-bottom {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 184, 0, 0.5), transparent);
  animation: glow-pulse 4s ease-in-out infinite reverse;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.9; }
}

.footer-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.footer-particles .particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: footer-float 3s ease-in-out infinite;
}

@keyframes footer-float {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0; }
  50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
}

.footer-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 35px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
  position: relative;
  z-index: 1;
}

.brand-section {
  grid-column: span 1;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.logo-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.25), rgba(255, 184, 0, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--neon-blue);
  animation: logo-spin 10s linear infinite;
}

@keyframes logo-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.logo-text {
  font-family: var(--font-family-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 2px;
}

.logo-accent {
  color: var(--sun-gold);
}

.footer-desc {
  color: var(--neon-blue);
  font-family: var(--font-family-body);
  font-size: 16px;
  margin-bottom: 8px;
  font-weight: 500;
}

.footer-tagline {
  color: var(--text-muted);
  font-family: var(--font-family-body);
  font-size: 14px;
  margin-bottom: 20px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.2);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  text-decoration: none;
}

.social-link:hover {
  background: rgba(0, 212, 255, 0.25);
  border-color: var(--neon-blue);
  color: var(--neon-blue);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
}

.section-title {
  color: var(--neon-blue);
  font-family: var(--font-family-display);
  font-size: 14px;
  letter-spacing: 2px;
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  margin-bottom: 12px;
}

.nav-list a {
  color: var(--text-muted);
  text-decoration: none;
  font-family: var(--font-family-body);
  font-size: 15px;
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.nav-list a::before {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--text-disabled);
  transition: all var(--transition-fast);
}

.nav-list a:hover {
  color: var(--neon-blue);
  padding-left: 8px;
}

.nav-list a:hover::before {
  background: var(--neon-blue);
  box-shadow: 0 0 10px var(--neon-blue);
}

.tech-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tech-tag {
  padding: 6px 14px;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: var(--radius-full);
  color: var(--text-muted);
  font-size: 13px;
  transition: all var(--transition-fast);
}

.tech-tag:hover {
  background: rgba(0, 212, 255, 0.2);
  border-color: var(--neon-blue);
  color: var(--neon-blue);
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  margin-bottom: 20px;
}

.contact-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-muted);
  font-family: var(--font-family-body);
  font-size: 14px;
  margin-bottom: 12px;
}

.contact-list el-icon {
  color: var(--sun-gold);
}

.contact-list a {
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.contact-list a:hover {
  color: var(--neon-blue);
}

.newsletter {
  margin-top: 15px;
}

.newsletter-label {
  color: var(--text-muted);
  font-size: 13px;
  margin-bottom: 10px;
}

.newsletter-input-wrapper {
  display: flex;
  gap: 8px;
}

.newsletter-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: var(--radius-md);
}

.subscribe-btn {
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-blue-dark));
  border: none;
  border-radius: var(--radius-md);
  color: white;
  transition: all var(--transition-fast);
}

.subscribe-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 25px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.copyright {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-disabled);
  font-size: 13px;
}

.copyright el-icon {
  color: var(--neon-blue);
}

.powered {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-disabled);
  font-size: 13px;
}

.heart-icon {
  color: var(--danger-red);
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.gradient-text {
  background: linear-gradient(135deg, var(--neon-blue), var(--sun-gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
}

@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .brand-section {
    text-align: center;
  }
  
  .footer-logo {
    justify-content: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .tech-list {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .footer-bar {
    padding: 35px 15px 30px;
  }
  
  .logo-text {
    font-size: 18px;
  }
  
  .logo-accent {
    display: block;
  }
}
</style>