<template>
  <div class="diary-container">
    <div class="page-header">
      <h1><el-icon name="calendar" /> 日记</h1>
      <p class="page-desc">记录生活的点点滴滴，留下珍贵的回忆</p>
    </div>

    <div class="diary-content">
      <aside class="left-sidebar">
        <div class="sidebar-section">
          <h3><el-icon name="folder" /> 日记目录</h3>
          <div v-if="todayDiaryCount > 0" class="today-count">
            <el-icon name="calendar" size="16" />
            <span>今日共 {{ todayDiaryCount }} 篇日记</span>
          </div>
          
          <div v-if="Object.keys(recentDiaryGroups).length > 0" class="recent-section">
            <div class="section-header">
              <span class="section-title">最近三天</span>
              <span class="section-count">{{ Object.keys(recentDiaryGroups).length }} 天</span>
            </div>
            <div class="directory-list recent-list">
              <div v-for="(group, dateStr) in recentDiaryGroups" :key="dateStr" 
                   class="directory-group recent-group"
                   :class="{ 'today-group': isToday(dateStr), 'expanded': expandedGroup === dateStr }">
                <div 
                  class="directory-header"
                  :class="{ active: isDateSelected(dateStr) }"
                  @click="toggleGroup(dateStr)"
                >
                  <div class="dir-date">
                    <span class="dir-year">{{ formatYear(dateStr) }}</span>
                    <span class="dir-day">{{ formatDayNum(dateStr) }}</span>
                    <span class="dir-month">{{ formatMonthShort(new Date(dateStr)) }}</span>
                  </div>
                  <div class="dir-header-content">
                    <span class="dir-summary">{{ group.length }} 篇日记</span>
                    <span class="dir-preview-text">{{ group[0]?.title }}</span>
                  </div>
                  <div class="dir-count">
                    <el-badge :value="group.length" class="item-badge" />
                    <el-icon 
                      name="chevron-down" 
                      class="expand-icon" 
                      :class="{ rotated: expandedGroup === dateStr }"
                    />
                  </div>
                </div>
                <div class="directory-content">
                  <div 
                    v-for="diary in group"
                    :key="diary.id"
                    class="directory-item"
                    :class="{ active: selectedDiaryId === diary.id }"
                    @click.stop="selectDiaryItem(diary)"
                  >
                    <el-icon name="file-text" size="14" class="item-icon" />
                    <span class="dir-title">{{ diary.title }}</span>
                    <span class="dir-preview">{{ diary.content.slice(0, 25) }}...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="Object.keys(historicalDiaryGroups).length > 0" class="history-section">
            <div class="section-header">
              <span class="section-title">历史日记</span>
              <span class="section-count">共 {{ Object.keys(historicalDiaryGroups).length }} 天</span>
            </div>
            
            <div class="directory-list history-list" ref="directoryListRef" @keydown="handleKeydown">
              <div v-for="(group, dateStr) in currentPageGroups" :key="dateStr" 
                   class="directory-group history-group">
                <div 
                  class="directory-header history-header"
                  :class="{ active: isDateSelected(dateStr) }"
                  @click="navigateToDiary(dateStr)"
                >
                  <div class="dir-date">
                    <span class="dir-year">{{ formatYear(dateStr) }}</span>
                    <span class="dir-day">{{ formatDayNum(dateStr) }}</span>
                    <span class="dir-month">{{ formatMonthShort(new Date(dateStr)) }}</span>
                  </div>
                  <div class="dir-header-content history-content">
                    <span class="dir-summary">{{ group.length }} 篇日记</span>
                    <div class="dir-tags-preview" v-if="getAllTagsForDate(dateStr).length > 0">
                      <el-tag v-for="tag in getAllTagsForDate(dateStr).slice(0, 3)" :key="tag" size="mini" type="info">{{ tag }}</el-tag>
                      <span v-if="getAllTagsForDate(dateStr).length > 3" class="more-tags">+{{ getAllTagsForDate(dateStr).length - 3 }}</span>
                    </div>
                  </div>
                  <div class="dir-count">
                    <el-badge :value="group.length" class="item-badge" />
                  </div>
                </div>
                <div class="history-items">
                  <div 
                    v-for="diary in group"
                    :key="diary.id"
                    class="history-item"
                    :class="{ active: selectedDiaryId === diary.id }"
                    @click="selectDiaryItem(diary)"
                  >
                    <div class="item-tags">
                      <el-tag v-for="tag in diary.tags" :key="tag" size="mini" type="success">{{ tag }}</el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="pagination-control">
              <div class="pagination-info">
                <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
              </div>
              <div class="pagination-buttons">
                <el-button 
                  size="mini" 
                  :disabled="currentPage === 1" 
                  @click="prevPage"
                >
                  <el-icon name="arrow-left" />
                </el-button>
                <el-button 
                  size="mini" 
                  :disabled="currentPage === totalPages" 
                  @click="nextPage"
                >
                  <el-icon name="arrow-right" />
                </el-button>
              </div>
            </div>
            
            <div class="tags-summary-section">
              <div class="section-header">
                <span class="section-title">日记标签汇总</span>
                <span class="section-count">{{ Object.keys(tagSummary).length }} 个标签</span>
              </div>
              <div class="tags-summary">
                <div 
                  v-for="(count, tag) in tagSummary" 
                  :key="tag" 
                  class="tag-item"
                  @click="filterByTag(tag)"
                >
                  <el-tag type="warning" size="small">{{ tag }}</el-tag>
                  <span class="tag-count">{{ count }} 篇</span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="groupedDiaryData && Object.keys(groupedDiaryData).length === 0" class="empty-directory">
            <el-icon name="file-text" :size="32" class="empty-icon" />
            <p>暂无日记记录</p>
          </div>
        </div>

        <div v-if="userStore.isLoggedIn && userStore.user?.role === 'admin'" class="sidebar-section quick-actions">
          <h3><el-icon name="plus" /> 快捷操作</h3>
          <div class="action-main">
            <el-button type="primary" size="large" @click="createDiary">
              <el-icon name="edit" /> 写日记
            </el-button>
          </div>
          <div class="action-secondary">
            <input 
              type="file" 
              id="import-diary" 
              style="display: none" 
              accept=".json"
              @change="handleImport"
            />
            <el-button size="small" @click="triggerImport">
              <el-icon name="upload" /> 导入
            </el-button>
            <el-button size="small" @click="exportDiary">
              <el-icon name="download" /> 导出
            </el-button>
          </div>
        </div>
      </aside>

      <main class="main-content">
        <div class="calendar-wrapper">
          <div class="calendar-header">
            <div class="month-nav">
              <el-button @click="prevMonth">
                <el-icon name="arrow-left" />
              </el-button>
              <span class="current-month">{{ formatFullMonth(selectedDate) }}</span>
              <el-button @click="nextMonth">
                <el-icon name="arrow-right" />
              </el-button>
            </div>
            <el-button type="primary" size="small" @click="goToday">
              <el-icon name="calendar" /> 今天
            </el-button>
          </div>

          <div class="calendar-grid">
            <div class="calendar-weekdays">
              <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
            </div>
            <div class="calendar-days">
              <div
                v-for="(day, index) in calendarDays"
                :key="index"
                class="calendar-day"
                :class="{
                  'other-month': !day.isCurrentMonth,
                  'has-diary': day.hasDiary,
                  'today': day.isToday,
                  'selected': day.isSelected,
                  'empty': !day.day
                }"
                @click="selectDate(day)"
              >
                <span v-if="day.day" class="day-number">{{ day.day }}</span>
                <span v-if="day.hasDiary" class="diary-indicator"></span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showDiaryDetail" class="diary-detail-panel">
          <div class="detail-header">
            <div class="detail-date">
              <span class="detail-year">{{ formatYearFull(selectedDate) }}</span>
              <span class="detail-day">{{ formatDay(selectedDate) }}</span>
              <span class="detail-month">{{ formatMonth(selectedDate) }}</span>
            </div>
            <div v-if="userStore.isLoggedIn && userStore.user?.role === 'admin'" class="detail-actions">
              <el-button size="small" type="primary" @click="createDiary">
                <el-icon name="plus" /> 写一篇
              </el-button>
            </div>
          </div>

          <div v-if="currentDayDiaries.length > 0" class="diary-list">
            <div 
              v-for="diary in currentDayDiaries" 
              :key="diary.id"
              class="diary-card"
              :class="{ active: selectedDiaryId === diary.id }"
              @click="selectDiaryItem(diary)"
            >
              <div class="diary-card-header">
                <h3 class="diary-card-title">{{ diary.title }}</h3>
                <div class="diary-card-actions">
                  <el-button size="mini" @click.stop="editDiaryItem(diary)">
                    <el-icon name="edit" />
                  </el-button>
                  <el-button size="mini" type="danger" @click.stop="deleteDiaryItem(diary)">
                    <el-icon name="delete" />
                  </el-button>
                </div>
              </div>
              <div class="diary-card-tags">
                <el-tag v-for="tag in diary.tags" :key="tag" size="small" type="info">{{ tag }}</el-tag>
              </div>
              <div class="diary-card-body">
                <p>{{ diary.content }}</p>
              </div>
              <div class="diary-card-footer">
                <span class="diary-mood"><el-icon name="smile" :size="14" /> {{ diary.mood }}</span>
                <span class="diary-weather"><el-icon name="cloud" :size="14" /> {{ diary.weather }}</span>
              </div>

              <CommentSection 
                :content-id="diary.id" 
                content-type="diary" 
              />
            </div>
          </div>

          <div v-else class="empty-diary">
            <el-icon name="calendar" :size="48" class="empty-icon" />
            <p class="empty-title">当日无日记</p>
            <p v-if="userStore.isLoggedIn && userStore.user?.role === 'admin'" class="empty-desc">点击右上角按钮写一篇吧</p>
            <p v-else class="empty-desc">暂无日记记录</p>
          </div>
        </div>
      </main>

      <aside class="right-sidebar">
        <div class="sidebar-card">
          <h3><el-icon name="sparkles" /> 今日运势</h3>
          <div class="fortune-content">
            <div class="fortune-item">
              <span class="fortune-label">综合运势</span>
              <div class="fortune-bar">
                <div class="fortune-fill" :style="{ width: fortuneData.overall + '%' }"></div>
              </div>
              <span class="fortune-value">{{ fortuneData.overall }}%</span>
            </div>
            <div class="fortune-item">
              <span class="fortune-label">财运</span>
              <div class="fortune-bar">
                <div class="fortune-fill" :style="{ width: fortuneData.wealth + '%' }"></div>
              </div>
              <span class="fortune-value">{{ fortuneData.wealth }}%</span>
            </div>
            <div class="fortune-item">
              <span class="fortune-label">爱情</span>
              <div class="fortune-bar">
                <div class="fortune-fill" :style="{ width: fortuneData.love + '%' }"></div>
              </div>
              <span class="fortune-value">{{ fortuneData.love }}%</span>
            </div>
            <div class="fortune-item">
              <span class="fortune-label">健康</span>
              <div class="fortune-bar">
                <div class="fortune-fill" :style="{ width: fortuneData.health + '%' }"></div>
              </div>
              <span class="fortune-value">{{ fortuneData.health }}%</span>
            </div>
          </div>
        </div>

        <div class="sidebar-card">
          <h3><el-icon name="sunny" /> 节气</h3>
          <div v-if="isTodaySolarTerm" class="solar-term">
            <div class="term-icon">
              <el-icon :size="48" :name="currentSolarTerm.icon" />
            </div>
            <div class="term-info">
              <span class="term-name">{{ currentSolarTerm.name }}</span>
              <span class="term-date">{{ currentSolarTerm.date }}</span>
            </div>
            <p class="term-desc">{{ currentSolarTerm.description }}</p>
          </div>
          <div v-else class="solar-term-transition">
            <div class="term-item prev-term">
              <div class="term-icon-small">
                <el-icon :size="24" :name="prevSolarTerm.icon" />
              </div>
              <div class="term-info-small">
                <span class="term-label">上个节气</span>
                <span class="term-name-small">{{ prevSolarTerm.name }}</span>
                <span class="term-date-small">{{ prevSolarTerm.date }}</span>
              </div>
            </div>
            <div class="current-date-display">
              <span class="current-date-day">{{ todayDay }}</span>
              <span class="current-date-month">{{ todayMonth }}</span>
            </div>
            <div class="term-item next-term">
              <div class="term-icon-small">
                <el-icon :size="24" :name="nextSolarTerm.icon" />
              </div>
              <div class="term-info-small">
                <span class="term-label">即将到来</span>
                <span class="term-name-small">{{ nextSolarTerm.name }}</span>
                <span class="term-date-small">{{ nextSolarTerm.date }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-card">
          <h3><el-icon name="history" /> 历史上的今天</h3>
          <div class="history-list">
            <div v-for="(event, index) in todayInHistory" :key="index" class="history-item">
              <span class="history-year">{{ event.year }}</span>
              <span class="history-event">{{ event.event }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-card">
          <h3><el-icon name="gift" /> 即将到来的节日</h3>
          <div class="holiday-list">
            <div v-for="(holiday, index) in upcomingHolidays" :key="index" class="holiday-item">
              <div class="holiday-date">
                <span class="holiday-month">{{ holiday.month }}</span>
                <span class="holiday-day">{{ holiday.day }}</span>
              </div>
              <div class="holiday-info">
                <span class="holiday-name">{{ holiday.name }}</span>
                <span class="holiday-days">{{ holiday.daysLeft }}天后</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <el-dialog v-model="showCreateDialog" :title="isEditing ? '编辑日记' : '写日记'" width="500px">
      <el-form :model="newDiary" label-width="80px">
        <el-form-item label="日期">
          <el-date-picker 
            v-model="newDiary.date" 
            type="date" 
            placeholder="选择日期"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="newDiary.title" placeholder="输入日记标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="newDiary.content" rows="8" placeholder="记录今天的心情和故事..." />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="newDiary.tagsInput" placeholder="用逗号分隔多个标签" />
        </el-form-item>
        <el-form-item label="心情">
          <el-select v-model="newDiary.mood">
            <el-option label="开心" value="开心" />
            <el-option label="平静" value="平静" />
            <el-option label="难过" value="难过" />
            <el-option label="兴奋" value="兴奋" />
            <el-option label="疲惫" value="疲惫" />
          </el-select>
        </el-form-item>
        <el-form-item label="天气">
          <el-select v-model="newDiary.weather">
            <el-option label="晴天" value="晴天" />
            <el-option label="阴天" value="阴天" />
            <el-option label="下雨" value="下雨" />
            <el-option label="下雪" value="下雪" />
            <el-option label="多云" value="多云" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="saveDiary">{{ isEditing ? '保存修改' : '保存' }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import CommentSection from '../components/CommentSection.vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const selectedDate = ref(new Date())
const showDiaryDetail = ref(false)
const showCreateDialog = ref(false)
const selectedDiaryDate = ref(null)
const selectedDiaryId = ref(null)
const directoryListRef = ref(null)
const selectedDirIndex = ref(0)
const isEditing = ref(false)
const editingDiaryId = ref(null)
const expandedGroup = ref(null)

const newDiary = reactive({
  date: '',
  title: '',
  content: '',
  tagsInput: '',
  mood: '开心',
  weather: '晴天'
})

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

const defaultDiaryData = [
  {
    id: 'd1',
    date: '2024-01-15',
    title: '新年第一天',
    content: '今天是新年的第一天，阳光明媚，心情格外好。和家人一起吃了团圆饭，聊了很多过去一年的趣事。希望新的一年能够实现自己的目标。',
    tags: ['新年', '家庭'],
    mood: '开心',
    weather: '晴天'
  },
  {
    id: 'd2',
    date: '2024-01-14',
    title: '工作汇报',
    content: '今天做了年度工作汇报，得到了领导的认可。这一年的努力终于有了回报，感觉非常欣慰。晚上和同事们一起聚餐庆祝。',
    tags: ['工作', '成就'],
    mood: '兴奋',
    weather: '多云'
  },
  {
    id: 'd3',
    date: '2024-01-12',
    title: '读书心得',
    content: '读完了《人类简史》这本书，收获很多。书中对人类发展历程的思考很有启发性，让我对未来有了新的思考方向。',
    tags: ['读书', '思考'],
    mood: '平静',
    weather: '阴天'
  },
  {
    id: 'd4',
    date: '2024-01-10',
    title: '健身打卡',
    content: '坚持健身一个月了，体重下降了5斤，体能也明显增强。运动真的能让人心情变好，继续坚持下去！',
    tags: ['健身', '健康'],
    mood: '开心',
    weather: '晴天'
  },
  {
    id: 'd5',
    date: '2024-01-08',
    title: '旅行计划',
    content: '制定了今年的旅行计划，打算去云南和西藏看看。希望能够在忙碌的工作之余，多出去走走，看看不同的风景。',
    tags: ['旅行', '计划'],
    mood: '兴奋',
    weather: '晴天'
  },
  {
    id: 'd6',
    date: '2024-01-15',
    title: '新年聚会',
    content: '晚上和朋友们一起聚会，聊了很多开心的事情，度过了一个愉快的夜晚。',
    tags: ['朋友', '聚会'],
    mood: '开心',
    weather: '晴天'
  }
]

const loadDiaryData = () => {
  try {
    const saved = localStorage.getItem('diary-data')
    if (saved) {
      const data = JSON.parse(saved)
      data.forEach(item => {
        if (!item.id) {
          item.id = generateId()
        }
      })
      return data
    }
  } catch (e) {
    console.error('Failed to load diary data:', e)
  }
  return defaultDiaryData
}

const saveDiaryData = (data) => {
  try {
    localStorage.setItem('diary-data', JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save diary data:', e)
  }
}

const diaryData = ref(loadDiaryData())

const groupedDiaryData = computed(() => {
  const groups = {}
  diaryData.value.forEach(diary => {
    if (!groups[diary.date]) {
      groups[diary.date] = []
    }
    groups[diary.date].push(diary)
  })
  
  const sortedDates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a))
  
  const result = {}
  sortedDates.forEach(date => {
    groups[date].sort((a, b) => new Date(b.date) - new Date(a.date))
    result[date] = groups[date]
  })
  
  return result
})

const getDiariesByDate = (dateStr) => {
  return diaryData.value.filter(d => d.date === dateStr)
}

const getDiaryById = (id) => {
  return diaryData.value.find(d => d.id === id)
}

const currentPage = ref(1)
const pageSize = ref(3)

const recentDiaryGroups = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const result = {}
  Object.keys(groupedDiaryData.value).forEach(dateStr => {
    const date = new Date(dateStr)
    date.setHours(0, 0, 0, 0)
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24))
    if (diffDays >= 0 && diffDays <= 2) {
      result[dateStr] = groupedDiaryData.value[dateStr]
    }
  })
  
  return result
})

const historicalDiaryGroups = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const result = {}
  Object.keys(groupedDiaryData.value).forEach(dateStr => {
    const date = new Date(dateStr)
    date.setHours(0, 0, 0, 0)
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24))
    if (diffDays > 2) {
      result[dateStr] = groupedDiaryData.value[dateStr]
    }
  })
  
  return result
})

const totalPages = computed(() => {
  const count = Object.keys(historicalDiaryGroups.value).length
  return Math.max(1, Math.ceil(count / pageSize.value))
})

const currentPageGroups = computed(() => {
  const historicalDates = Object.keys(historicalDiaryGroups.value).sort((a, b) => new Date(b) - new Date(a))
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  const currentDates = historicalDates.slice(startIndex, endIndex)
  
  const result = {}
  currentDates.forEach(date => {
    result[date] = historicalDiaryGroups.value[date]
  })
  
  return result
})

const getAllTagsForDate = (dateStr) => {
  const diaries = diaryData.value.filter(d => d.date === dateStr)
  const tags = new Set()
  diaries.forEach(diary => {
    diary.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
}

const tagSummary = computed(() => {
  const summary = {}
  diaryData.value.forEach(diary => {
    diary.tags.forEach(tag => {
      if (!summary[tag]) {
        summary[tag] = 0
      }
      summary[tag]++
    })
  })
  const sorted = Object.entries(summary).sort((a, b) => b[1] - a[1])
  const result = {}
  sorted.forEach(([tag, count]) => {
    result[tag] = count
  })
  return result
})

const filterByTag = (tag) => {
  ElMessage.info(`筛选标签: ${tag}`)
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const todayDiaryCount = computed(() => {
  const todayStr = formatDateStr(new Date())
  return diaryData.value.filter(d => d.date === todayStr).length
})

const fortuneData = ref({
  overall: 78,
  wealth: 65,
  love: 85,
  health: 72
})

const solarTerms = [
  { name: '立春', date: '02-04', icon: 'sunny', description: '立春是二十四节气之首，标志着春季的开始。' },
  { name: '雨水', date: '02-18', icon: 'cloud-rain', description: '雨水节气，降雨开始，雨量渐增。' },
  { name: '惊蛰', date: '03-06', icon: 'zap', description: '惊蛰时节，春雷初响，万物复苏。' },
  { name: '春分', date: '03-21', icon: 'sunny', description: '春分，昼夜平分，春色平分。' },
  { name: '清明', date: '04-05', icon: 'wind', description: '清明时节，万物皆洁齐，气清景明。' },
  { name: '谷雨', date: '04-20', icon: 'cloud-rain', description: '谷雨，雨生百谷，利于谷物生长。' },
  { name: '立夏', date: '05-06', icon: 'sunny', description: '立夏标志着夏季的开始。' },
  { name: '小满', date: '05-21', icon: 'droplet', description: '小满时节，麦类作物开始饱满。' },
  { name: '芒种', date: '06-06', icon: 'scissors', description: '芒种，忙着播种，农事繁忙。' },
  { name: '夏至', date: '06-21', icon: 'sunny', description: '夏至是北半球白天最长的一天。' },
  { name: '小暑', date: '07-07', icon: 'flame', description: '小暑开始，天气开始炎热。' },
  { name: '大暑', date: '07-23', icon: 'flame', description: '大暑是一年中最热的时期。' },
  { name: '立秋', date: '08-08', icon: 'wind', description: '立秋标志着秋季的开始。' },
  { name: '处暑', date: '08-23', icon: 'cloud', description: '处暑表示炎热的暑天结束。' },
  { name: '白露', date: '09-08', icon: 'droplet', description: '白露时节，露水变白，天气转凉。' },
  { name: '秋分', date: '09-23', icon: 'moon', description: '秋分，昼夜再次平分。' },
  { name: '寒露', date: '10-08', icon: 'cloud', description: '寒露时节，露水变冷，开始结霜。' },
  { name: '霜降', date: '10-24', icon: 'snowflake', description: '霜降时节，开始降霜。' },
  { name: '立冬', date: '11-08', icon: 'snowflake', description: '立冬标志着冬季的开始。' },
  { name: '小雪', date: '11-22', icon: 'snowflake', description: '小雪时节，开始下雪。' },
  { name: '大雪', date: '12-07', icon: 'snowflake', description: '大雪时节，雪量增多。' },
  { name: '冬至', date: '12-22', icon: 'snowflake', description: '冬至是北半球白天最短的一天。' },
  { name: '小寒', date: '01-06', icon: 'snowflake', description: '小寒是一年中最寒冷时期的开始。' },
  { name: '大寒', date: '01-20', icon: 'snowflake', description: '大寒是一年中最冷的节气。' }
]

const today = new Date()
const todayStr = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

const todayDay = computed(() => today.getDate())
const todayMonth = computed(() => {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', 
                 '七月', '八月', '九月', '十月', '十一月', '十二月']
  return months[today.getMonth()]
})

const currentSolarTerm = computed(() => {
  const term = solarTerms.find(t => t.date === todayStr)
  return term || solarTerms[0]
})

const isTodaySolarTerm = computed(() => {
  return solarTerms.some(t => t.date === todayStr)
})

const prevSolarTerm = computed(() => {
  const todayIdx = solarTerms.findIndex(t => t.date === todayStr)
  if (todayIdx !== -1) {
    return solarTerms[(todayIdx - 1 + 24) % 24]
  }
  
  let prevTerm = solarTerms[solarTerms.length - 1]
  let minDiff = Infinity
  
  for (let i = 0; i < solarTerms.length; i++) {
    const diff = getDayDiff(solarTerms[i].date, todayStr)
    if (diff <= 0 && Math.abs(diff) < minDiff) {
      minDiff = Math.abs(diff)
      prevTerm = solarTerms[i]
    }
  }
  return prevTerm
})

const nextSolarTerm = computed(() => {
  const todayIdx = solarTerms.findIndex(t => t.date === todayStr)
  if (todayIdx !== -1) {
    return solarTerms[(todayIdx + 1) % 24]
  }
  
  let nextTerm = solarTerms[0]
  let minDiff = Infinity
  
  for (let i = 0; i < solarTerms.length; i++) {
    const diff = getDayDiff(solarTerms[i].date, todayStr)
    if (diff > 0 && diff < minDiff) {
      minDiff = diff
      nextTerm = solarTerms[i]
    }
  }
  return nextTerm
})

function getDayDiff(date1, date2) {
  const [m1, d1] = date1.split('-').map(Number)
  const [m2, d2] = date2.split('-').map(Number)
  
  const year1 = m1 <= m2 ? 2024 : 2025
  const year2 = 2024
  
  const dateObj1 = new Date(year1, m1 - 1, d1)
  const dateObj2 = new Date(year2, m2 - 1, d2)
  
  return Math.floor((dateObj1.getTime() - dateObj2.getTime()) / (1000 * 60 * 60 * 24))
}

function compareDate(date1, date2) {
  const [m1, d1] = date1.split('-').map(Number)
  const [m2, d2] = date2.split('-').map(Number)
  if (m1 !== m2) return m1 - m2
  return d1 - d2
}

const historyEvents = {
  '01-01': [{ year: '1912年', event: '中华民国成立' }, { year: '1804年', event: '海地独立' }],
  '04-19': [{ year: '1775年', event: '列克星敦枪声，美国独立战争开始' }, { year: '1933年', event: '罗斯福新政开始' }, { year: '1993年', event: '香港正式宣布取消抵垒政策' }],
  '07-01': [{ year: '1997年', event: '香港回归祖国' }, { year: '1921年', event: '中国共产党成立' }],
  '10-01': [{ year: '1949年', event: '中华人民共和国成立' }, { year: '1907年', event: '新西兰独立' }],
  '12-25': [{ year: '1991年', event: '苏联解体' }, { year: '1948年', event: '以色列建国' }],
}

const todayInHistory = computed(() => {
  return historyEvents[todayStr] || [
    { year: '未知年份', event: '暂无历史记录' }
  ]
})

const holidays = [
  { name: '元旦', date: '01-01' },
  { name: '春节', date: getLunarNewYear(today.getFullYear()) },
  { name: '元宵节', date: getLanternFestival(today.getFullYear()) },
  { name: '妇女节', date: '03-08' },
  { name: '劳动节', date: '05-01' },
  { name: '青年节', date: '05-04' },
  { name: '儿童节', date: '06-01' },
  { name: '建党节', date: '07-01' },
  { name: '建军节', date: '08-01' },
  { name: '中秋节', date: getMidAutumnFestival(today.getFullYear()) },
  { name: '国庆节', date: '10-01' },
  { name: '重阳节', date: getDoubleNinthFestival(today.getFullYear()) }
]

function getLunarNewYear(year) {
  const lunarDates = {
    2024: '02-10', 2025: '01-29', 2026: '02-17', 2027: '02-06', 2028: '01-26'
  }
  return lunarDates[year] || '02-10'
}

function getLanternFestival(year) {
  const dates = {
    2024: '02-24', 2025: '02-12', 2026: '03-02', 2027: '02-19', 2028: '02-08'
  }
  return dates[year] || '02-15'
}

function getMidAutumnFestival(year) {
  const dates = {
    2024: '09-17', 2025: '10-06', 2026: '09-25', 2027: '10-13', 2028: '09-30'
  }
  return dates[year] || '09-15'
}

function getDoubleNinthFestival(year) {
  const dates = {
    2024: '10-11', 2025: '10-30', 2026: '10-19', 2027: '11-07', 2028: '10-26'
  }
  return dates[year] || '10-09'
}

const upcomingHolidays = computed(() => {
  const year = today.getFullYear()
  const result = []
  
  holidays.forEach(holiday => {
    let [month, day] = holiday.date.split('-').map(Number)
    let holidayDate = new Date(year, month - 1, day)
    
    if (holidayDate < today) {
      holidayDate = new Date(year + 1, month - 1, day)
    }
    
    const diffTime = holidayDate.getTime() - today.getTime()
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (daysLeft >= 0 && daysLeft <= 90) {
      result.push({
        name: holiday.name,
        month: `${month}月`,
        day: `${day}日`,
        daysLeft
      })
    }
  })
  
  return result.sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 3)
})

const currentYear = computed(() => selectedDate.value.getFullYear())
const currentMonth = computed(() => selectedDate.value.getMonth())

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const today = new Date()
  
  const days = []
  const startDay = firstDay.getDay()
  
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDay - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    const date = new Date(year, month - 1, day)
    days.push({
      day,
      date,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      hasDiary: hasDiary(date)
    })
  }
  
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day)
    const isToday = isSameDay(date, today)
    const isSelected = showDiaryDetail.value && selectedDiaryDate.value && isSameDay(date, selectedDiaryDate.value)
    
    days.push({
      day,
      date,
      isCurrentMonth: true,
      isToday,
      isSelected,
      hasDiary: hasDiary(date)
    })
  }
  
  const remaining = 42 - days.length
  for (let day = 1; day <= remaining; day++) {
    const date = new Date(year, month + 1, day)
    days.push({
      day,
      date,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      hasDiary: hasDiary(date)
    })
  }
  
  return days
})

const selectedDiary = computed(() => {
  if (!selectedDiaryDate.value) return null
  const dateStr = formatDateStr(selectedDiaryDate.value)
  
  if (selectedDiaryId.value) {
    return diaryData.value.find(d => d.id === selectedDiaryId.value)
  }
  
  const diaries = diaryData.value.filter(d => d.date === dateStr)
  return diaries.length > 0 ? diaries[0] : null
})

const currentDayDiaries = computed(() => {
  if (!selectedDiaryDate.value) return []
  const dateStr = formatDateStr(selectedDiaryDate.value)
  return diaryData.value.filter(d => d.date === dateStr).sort((a, b) => new Date(b.date) - new Date(a.date))
})

function hasDiary(date) {
  const dateStr = formatDateStr(date)
  return diaryData.value.some(d => d.date === dateStr)
}

function isSameDay(date1, date2) {
  if (!date1 || !date2) return false
  return date1.toDateString() === date2.toDateString()
}

function isToday(dateStr) {
  const today = new Date()
  const date = new Date(dateStr)
  return isSameDay(today, date)
}

function isDateSelected(dateStr) {
  if (!selectedDiaryDate.value) return false
  return formatDateStr(selectedDiaryDate.value) === dateStr
}

function formatDateStr(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDayNum(dateStr) {
  return new Date(dateStr).getDate()
}

function formatDay(date) {
  return date.getDate()
}

function formatMonth(date) {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', 
                 '七月', '八月', '九月', '十月', '十一月', '十二月']
  return months[date.getMonth()] + ' ' + date.getFullYear()
}

function formatMonthShort(date) {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', 
                 '7月', '8月', '9月', '10月', '11月', '12月']
  return months[date.getMonth()]
}

function formatYear(dateStr) {
  return new Date(dateStr).getFullYear()
}

function formatYearFull(date) {
  return date.getFullYear()
}

function formatFullMonth(date) {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', 
                 '七月', '八月', '九月', '十月', '十一月', '十二月']
  return `${date.getFullYear()}年${months[date.getMonth()]}`
}

function selectDate(day) {
  if (!day.day) return
  
  selectedDiaryDate.value = day.date
  selectedDiaryId.value = null
  selectedDate.value = day.date
  showDiaryDetail.value = true
}

function navigateToDiary(dateStr) {
  selectedDiaryDate.value = new Date(dateStr)
  selectedDiaryId.value = null
  selectedDate.value = new Date(dateStr)
  showDiaryDetail.value = true
}

function selectDiaryItem(diary) {
  selectedDiaryId.value = diary.id
  selectedDiaryDate.value = new Date(diary.date)
  selectedDate.value = new Date(diary.date)
  showDiaryDetail.value = true
}

function prevMonth() {
  const year = currentYear.value
  const month = currentMonth.value
  if (month === 0) {
    selectedDate.value = new Date(year - 1, 11, 1)
  } else {
    selectedDate.value = new Date(year, month - 1, 1)
  }
}

function nextMonth() {
  const year = currentYear.value
  const month = currentMonth.value
  if (month === 11) {
    selectedDate.value = new Date(year + 1, 0, 1)
  } else {
    selectedDate.value = new Date(year, month + 1, 1)
  }
}

function goToday() {
  selectedDate.value = new Date()
}

function toggleGroup(dateStr) {
  if (expandedGroup.value === dateStr) {
    expandedGroup.value = null
  } else {
    expandedGroup.value = dateStr
    navigateToDiary(dateStr)
  }
}

function createDiary() {
  newDiary.date = new Date()
  newDiary.title = ''
  newDiary.content = ''
  newDiary.tagsInput = ''
  newDiary.mood = '开心'
  newDiary.weather = '晴天'
  isEditing.value = false
  editingDiaryId.value = null
  showCreateDialog.value = true
}

function disabledDate(date) {
  return date > new Date()
}

function createDiaryForDate() {
  createDiary()
}

function editDiary() {
  if (selectedDiary.value) {
    editDiaryItem(selectedDiary.value)
  }
}

function editDiaryItem(diary) {
  newDiary.date = new Date(diary.date)
  newDiary.title = diary.title
  newDiary.content = diary.content
  newDiary.tagsInput = diary.tags.join(', ')
  newDiary.mood = diary.mood
  newDiary.weather = diary.weather
  isEditing.value = true
  editingDiaryId.value = diary.id
  showCreateDialog.value = true
}

function deleteDiaryItem(diary) {
  const index = diaryData.value.findIndex(d => d.id === diary.id)
  if (index !== -1) {
    diaryData.value.splice(index, 1)
    saveDiaryData(diaryData.value)
    if (selectedDiaryId.value === diary.id) {
      selectedDiaryId.value = null
    }
    ElMessage.success('日记已删除')
  }
}

function saveDiary() {
  const tags = newDiary.tagsInput.split(',').map(t => t.trim()).filter(t => t)
  const selectedDateStr = formatDateStr(newDiary.date)
  const dateDiaries = getDiariesByDate(selectedDateStr)
  
  if (isEditing.value && editingDiaryId.value) {
    const index = diaryData.value.findIndex(d => d.id === editingDiaryId.value)
    if (index !== -1) {
      diaryData.value[index] = {
        ...diaryData.value[index],
        date: selectedDateStr,
        title: newDiary.title || '无题',
        content: newDiary.content,
        tags: tags.length > 0 ? tags : ['日记'],
        mood: newDiary.mood,
        weather: newDiary.weather
      }
    }
    
    diaryData.value.sort((a, b) => new Date(b.date) - new Date(a.date))
    saveDiaryData(diaryData.value)
    showCreateDialog.value = false
    ElMessage.success('日记修改成功')
  } else {
    const newEntry = {
      id: generateId(),
      date: selectedDateStr,
      title: newDiary.title || '无题',
      content: newDiary.content,
      tags: tags.length > 0 ? tags : ['日记'],
      mood: newDiary.mood,
      weather: newDiary.weather
    }
    
    diaryData.value.unshift(newEntry)
    saveDiaryData(diaryData.value)
    showCreateDialog.value = false
    showDiaryDetail.value = true
    selectedDiaryDate.value = newDiary.date
    selectedDiaryId.value = newEntry.id
    selectedDate.value = newDiary.date
    
    if (dateDiaries.length > 0) {
      ElMessage.success(`日记保存成功！${selectedDateStr} 已有 ${dateDiaries.length + 1} 条日记`)
    } else {
      ElMessage.success('日记保存成功')
    }
  }
}

function deleteDiary() {
  if (selectedDiary.value) {
    const index = diaryData.value.findIndex(d => d.id === selectedDiary.value.id)
    if (index !== -1) {
      diaryData.value.splice(index, 1)
      saveDiaryData(diaryData.value)
      showDiaryDetail.value = false
      selectedDiaryDate.value = null
      selectedDiaryId.value = null
      ElMessage.success('日记已删除')
    }
  }
}

function exportDiary() {
  const data = JSON.stringify(diaryData.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'diary-backup.json'
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('日记已导出')
}

function triggerImport() {
  document.getElementById('import-diary').click()
}

function handleImport(event) {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result)
      
      if (!Array.isArray(importedData)) {
        ElMessage.error('导入文件格式错误')
        return
      }
      
      importedData.forEach(item => {
        const existingIndex = diaryData.value.findIndex(d => d.date === item.date)
        if (existingIndex !== -1) {
          diaryData.value[existingIndex] = item
        } else {
          diaryData.value.push(item)
        }
      })
      
      diaryData.value.sort((a, b) => new Date(b.date) - new Date(a.date))
      saveDiaryData(diaryData.value)
      ElMessage.success(`成功导入 ${importedData.length} 条日记`)
    } catch (e) {
      ElMessage.error('导入失败，请确保文件格式正确')
      console.error('Import error:', e)
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}

function handleKeydown(e) {
  if (diaryData.value.length === 0) return
  
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedDirIndex.value = (selectedDirIndex.value + 1) % diaryData.value.length
    navigateToDiary(diaryData.value[selectedDirIndex.value].date)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedDirIndex.value = (selectedDirIndex.value - 1 + diaryData.value.length) % diaryData.value.length
    navigateToDiary(diaryData.value[selectedDirIndex.value].date)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    navigateToDiary(diaryData.value[selectedDirIndex.value].date)
  }
}

onMounted(() => {
  const today = new Date()
  const todayStr = formatDateStr(today)
  const todayDiary = diaryData.value.find(d => d.date === todayStr)
  if (todayDiary) {
    selectedDiaryDate.value = today
    showDiaryDetail.value = true
  }
})

</script>

<style scoped>
.diary-container {
  min-height: 100vh;
  position: relative;
  z-index: 1;
}



.page-header {
  padding: 30px 20px;
  text-align: center;
  background: linear-gradient(135deg, rgba(26, 26, 62, 0.95) 0%, rgba(10, 10, 26, 0.98) 100%);
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.page-header h1 {
  font-size: 2rem;
  color: #fff;
  margin: 0 0 10px 0;
}

.page-desc {
  color: #8892a6;
  margin: 0;
}

.diary-content {
  display: grid;
  grid-template-columns: 360px 1fr 260px;
  gap: 25px;
  padding: 30px;
  max-width: 1800px;
  margin: 0 auto;
}

.left-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-section {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
  padding: 20px;
}

.sidebar-section.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-main {
  display: flex;
  justify-content: center;
  align-items: center;
}

.action-main .el-button {
  width: 100%;
  height: 48px;
  font-size: 1rem;
  font-weight: 600;
  padding: 0 24px;
  border-radius: 10px;
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.action-main .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
}

.action-secondary {
  display: flex;
  gap: 10px;
}

.action-secondary .el-button {
  flex: 1;
  height: 36px;
  font-size: 0.85rem;
  padding: 0 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 212, 255, 0.2);
  color: #a0aec0;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.action-secondary .el-button:hover {
  background: rgba(0, 212, 255, 0.1);
  color: #00d4ff;
  border-color: rgba(0, 212, 255, 0.4);
}

.sidebar-section h3 {
  color: #00d4ff;
  margin: 0 0 15px 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.today-count {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 212, 255, 0.05) 100%);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  margin-bottom: 12px;
  color: #00d4ff;
  font-size: 0.9rem;
  font-weight: 500;
}

.directory-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 500px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-right: 8px;
}

.directory-group {
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 12px;
  background: rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.directory-group.today-group {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 212, 255, 0.05) 100%);
  border: 1px solid rgba(0, 212, 255, 0.2);
}

.directory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.directory-header:hover {
  background: rgba(0, 212, 255, 0.15);
}

.directory-header.active {
  background: rgba(0, 212, 255, 0.2);
}

.directory-group.today-group .directory-header {
  background: rgba(0, 212, 255, 0.15);
}

.directory-group.today-group .directory-header.active {
  background: rgba(0, 212, 255, 0.25);
}

.dir-header-content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.dir-summary {
  display: block;
  font-size: 0.75rem;
  color: #4a5568;
  margin-bottom: 3px;
}

.dir-preview-text {
  display: block;
  font-size: 0.85rem;
  color: #a0aec0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expand-icon {
  color: #718096;
  transition: transform 0.3s ease;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.directory-content {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-100%);
  visibility: hidden;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: rgba(0, 0, 0, 0.2);
  padding: 0;
  margin: 0;
  border: none;
}

.directory-group.expanded .directory-content {
  max-height: 500px;
  opacity: 1;
  transform: translateY(0);
  visibility: visible;
  padding: 8px 0;
  animation: tapePullOut 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes tapePullOut {
  0% {
    opacity: 0;
    transform: translateY(-15px);
    max-height: 0;
    padding: 0;
  }
  60% {
    opacity: 0.9;
    transform: translateY(-5px);
    padding: 4px 0;
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    max-height: 500px;
    padding: 8px 0;
  }
}

.directory-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.directory-item:last-child {
  border-bottom: none;
}

.directory-item:hover {
  background: rgba(0, 212, 255, 0.1);
}

.directory-item.active {
  background: rgba(0, 212, 255, 0.15);
}

.item-icon {
  color: #00d4ff;
  flex-shrink: 0;
}

.dir-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 55px;
}

.dir-year {
  font-size: 0.8rem;
  color: #fff;
  margin-bottom: 4px;
  font-weight: 500;
}

.dir-day {
  font-size: 1.5rem;
  font-weight: 700;
  color: #00d4ff;
}

.dir-month {
  font-size: 0.9rem;
  color: #fff;
  font-weight: 500;
}

.dir-content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.dir-title {
  display: block;
  color: #fff;
  font-size: 0.9rem;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dir-preview {
  display: block;
  font-size: 0.8rem;
  color: #718096;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dir-count {
  display: flex;
  align-items: center;
}

.dir-sub-items {
  background: rgba(0, 0, 0, 0.15);
  padding: 8px 0;
}

.dir-more {
  padding: 6px 12px;
  color: #4a5568;
  font-size: 0.75rem;
  font-style: italic;
  text-align: center;
  cursor: pointer;
  transition: color 0.2s ease;
}

.dir-more:hover {
  color: #00d4ff;
}

.dir-sub-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px 8px 70px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #a0aec0;
}

.dir-sub-item:hover {
  background: rgba(0, 212, 255, 0.1);
  color: #00d4ff;
}

.dir-sub-item.active {
  background: rgba(0, 212, 255, 0.15);
  color: #00d4ff;
}

.dir-sub-item .sub-title {
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dir-more {
  padding: 4px 12px 4px 70px;
  color: #4a5568;
  font-size: 0.75rem;
  font-style: italic;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.calendar-wrapper {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
  padding: 25px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.month-nav {
  display: flex;
  align-items: center;
  gap: 15px;
}

.month-nav .el-button {
  background: linear-gradient(135deg, rgba(26, 26, 62, 0.8) 0%, rgba(10, 10, 26, 0.9) 100%) !important;
  border: 1px solid rgba(0, 212, 255, 0.2) !important;
  color: #00d4ff !important;
  border-radius: 6px !important;
  transition: all 0.3s ease !important;
}

.month-nav .el-button:hover {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 212, 255, 0.03) 100%) !important;
  border-color: rgba(0, 212, 255, 0.4) !important;
}

.current-month {
  font-size: 1.25rem;
  color: #fff;
  font-weight: 600;
}

.calendar-grid {
  display: flex;
  flex-direction: column;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 10px;
}

.weekday {
  text-align: center;
  padding: 10px;
  color: #718096;
  font-size: 0.875rem;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.calendar-day:hover {
  background: rgba(0, 212, 255, 0.15);
}

.calendar-day.other-month {
  opacity: 0.3;
}

.calendar-day.has-diary {
  background: rgba(255, 184, 0, 0.25);
  border: 1px solid rgba(255, 184, 0, 0.5);
  box-shadow: 0 0 10px rgba(255, 184, 0, 0.2);
}

.calendar-day.today {
  border: 2px solid #00d4ff;
}

.calendar-day.selected {
  background: rgba(0, 212, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
}

.calendar-day.empty {
  background: transparent;
  cursor: default;
}

.day-number {
  font-size: 0.9rem;
  color: #fff;
}

.diary-indicator {
  position: absolute;
  bottom: 4px;
  width: 6px;
  height: 6px;
  background: #ffb800;
  border-radius: 50%;
}

.diary-detail-panel {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
  padding: 25px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.detail-date {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.detail-day {
  font-size: 3rem;
  font-weight: 700;
  color: #00d4ff;
}

.detail-month {
  color: #718096;
  font-size: 1.1rem;
}

.detail-title {
  color: #fff;
  font-size: 1.5rem;
  margin: 0 0 15px 0;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.detail-body {
  color: #a0aec0;
  line-height: 1.8;
}

.detail-body p {
  margin: 0;
}

.detail-footer {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  color: #718096;
}

.diary-detail-panel {
  margin-top: 25px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.detail-date {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.detail-year {
  font-size: 1.5rem;
  font-weight: 700;
  color: #00d4ff;
}

.detail-day {
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.detail-month {
  font-size: 1.2rem;
  color: #718096;
}

.detail-actions {
  display: flex;
  gap: 10px;
}

.diary-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.diary-card {
  background: rgba(26, 26, 62, 0.9);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.diary-card:hover {
  border-color: rgba(0, 212, 255, 0.4);
  box-shadow: 0 4px 20px rgba(0, 212, 255, 0.1);
}

.diary-card.active {
  border-color: #00d4ff;
  background: rgba(0, 212, 255, 0.08);
}

.diary-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.diary-card-title {
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.diary-card-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.diary-card:hover .diary-card-actions,
.diary-card.active .diary-card-actions {
  opacity: 1;
}

.diary-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.diary-card-body {
  margin-bottom: 15px;
}

.diary-card-body p {
  color: #e2e8f0;
  font-size: 1rem;
  line-height: 1.8;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.diary-card-footer {
  display: flex;
  gap: 20px;
  color: #718096;
  font-size: 0.875rem;
}

.diary-mood,
.diary-weather {
  display: flex;
  align-items: center;
  gap: 5px;
}

.empty-diary {
  text-align: center;
  padding: 60px 20px;
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
}

.empty-diary .empty-icon {
  color: #718096;
  margin-bottom: 15px;
}

.empty-title {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.empty-desc {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
}

.right-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
  padding: 20px;
}

.sidebar-card h3 {
  color: #00d4ff;
  margin: 0 0 15px 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.fortune-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fortune-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.fortune-label {
  width: 50px;
  color: #a0aec0;
  font-size: 0.85rem;
}

.fortune-bar {
  flex: 1;
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.fortune-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff, #ffb800);
  border-radius: 4px;
}

.fortune-value {
  width: 40px;
  text-align: right;
  color: #ffb800;
  font-size: 0.85rem;
  font-weight: 600;
}

.solar-term {
  text-align: center;
}

.term-icon {
  color: #ffb800;
  margin-bottom: 10px;
}

.term-name {
  display: block;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
}

.term-date {
  display: block;
  color: #718096;
  font-size: 0.85rem;
  margin-bottom: 10px;
}

.term-desc {
  color: #a0aec0;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
}

.solar-term-transition {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.term-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.term-icon-small {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 184, 0, 0.15);
  border-radius: 8px;
  color: #ffb800;
}

.term-info-small {
  flex: 1;
}

.term-label {
  display: block;
  font-size: 0.7rem;
  color: #4a5568;
  margin-bottom: 2px;
}

.term-name-small {
  display: block;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
}

.term-date-small {
  display: block;
  font-size: 0.75rem;
  color: #718096;
}

.current-date-display {
  text-align: center;
  padding: 10px 0;
  border-top: 1px dashed rgba(0, 212, 255, 0.2);
  border-bottom: 1px dashed rgba(0, 212, 255, 0.2);
}

.current-date-day {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #00d4ff;
}

.current-date-month {
  display: block;
  font-size: 0.85rem;
  color: #718096;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  gap: 10px;
}

.history-year {
  color: #ffb800;
  font-weight: 600;
  font-size: 0.85rem;
}

.history-event {
  color: #a0aec0;
  font-size: 0.85rem;
}

.holiday-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.holiday-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.holiday-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 45px;
}

.holiday-month {
  font-size: 0.75rem;
  color: #718096;
}

.holiday-day {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffb800;
}

.holiday-info {
  flex: 1;
}

.holiday-name {
  display: block;
  color: #fff;
  font-size: 0.9rem;
}

.holiday-days {
  color: #718096;
  font-size: 0.8rem;
}

@media (max-width: 1300px) {
  .diary-content {
    grid-template-columns: 280px 1fr 250px;
    max-width: 1400px;
  }
}

@media (max-width: 1100px) {
  .diary-content {
    grid-template-columns: 280px 1fr;
  }
  
  .right-sidebar {
    display: none;
  }
}

.recent-section {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
}

.history-section {
  margin-top: 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px 12px;
  background: rgba(0, 212, 255, 0.05);
  border-radius: 6px;
}

.section-title {
  color: #00d4ff;
  font-size: 0.85rem;
  font-weight: 600;
}

.section-count {
  color: #718096;
  font-size: 0.8rem;
}

.recent-list {
  max-height: none;
  overflow: visible;
}

.history-list {
  max-height: 350px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
}

.directory-group.history-group {
  margin-bottom: 15px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.15);
  padding: 2px;
}

.history-header {
  padding: 12px 14px;
  background: rgba(0, 0, 0, 0.2);
}

.history-content {
  flex: 1;
  min-width: 0;
}

.dir-tags-preview {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.more-tags {
  font-size: 0.75rem;
  color: #718096;
}

.history-items {
  padding: 10px 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
}

.history-item {
  padding: 8px 0;
  border-bottom: 1px dashed rgba(0, 212, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-item:last-child {
  border-bottom: none;
}

.history-item:hover {
  background: rgba(0, 212, 255, 0.05);
  margin-left: 5px;
}

.history-item.active {
  background: rgba(0, 212, 255, 0.1);
  border-radius: 4px;
  padding-left: 10px;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tags-summary-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(0, 212, 255, 0.1);
}

.tags-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 0;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-item:hover {
  background: rgba(255, 184, 0, 0.15);
  transform: translateY(-2px);
}

.tag-count {
  font-size: 0.75rem;
  color: #a0aec0;
}

.pagination-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 212, 255, 0.1);
}

.pagination-info {
  color: #718096;
  font-size: 0.8rem;
}

.pagination-buttons {
  display: flex;
  gap: 6px;
}

:deep(.pagination-buttons .el-button),
:deep(.pagination-buttons .el-button.el-button--mini),
:deep(.pagination-buttons .el-button.is-disabled),
:deep(.pagination-buttons .el-button.el-button--mini.is-disabled) {
  background: transparent !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  color: #00d4ff !important;
  border-radius: 0 !important;
  padding: 4px 8px !important;
  margin: 0 !important;
  min-width: auto !important;
  height: auto !important;
  line-height: 1 !important;
  transition: all 0.3s ease !important;
  font-size: 24px !important;
}

:deep(.pagination-buttons .el-button:hover:not(:disabled)),
:deep(.pagination-buttons .el-button.el-button--mini:hover:not(:disabled)) {
  background: rgba(0, 212, 255, 0.15) !important;
  color: #4de8ff !important;
  transform: scale(1.2);
}

:deep(.pagination-buttons .el-button.is-disabled),
:deep(.pagination-buttons .el-button.el-button--mini.is-disabled) {
  background: transparent !important;
  border: none !important;
  color: #4a5568 !important;
  cursor: not-allowed !important;
  opacity: 0.4;
  transform: none !important;
}

.empty-directory {
  text-align: center;
  padding: 30px 20px;
  color: #718096;
}

.empty-directory .empty-icon {
  margin-bottom: 10px;
}

.empty-directory p {
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .diary-content {
    grid-template-columns: 1fr;
    padding: 20px;
  }
  
  .left-sidebar {
    order: 2;
  }
  
  .main-content {
    order: 1;
  }
  
  .calendar-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>
