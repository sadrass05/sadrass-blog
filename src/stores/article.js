import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import kbArticles from '../data/kb-articles.json'

const STORAGE_KEY = 'blog_articles'

// Phase 6-5：知识库发布的文章（由 工具/publish_blog.py 生成），与本地文章合并展示
const KB_ARTICLES = Array.isArray(kbArticles) ? kbArticles : []

function mergeKbArticles(list) {
  const titles = new Set(list.map(a => a.title))
  return [...list, ...KB_ARTICLES.filter(a => !titles.has(a.title))]
}

function loadArticles() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const savedArticles = JSON.parse(saved)
      const hasAllFields = savedArticles.length > 0 && 'screenshotUrl' in savedArticles[0]
      if (hasAllFields) {
        return mergeKbArticles(savedArticles)
      }
    }
  } catch (e) {
    console.error('Failed to load articles from localStorage:', e)
  }
  return mergeKbArticles([
    {
      id: 1,
      title: 'Vue 3 组合式 API 详解',
      summary: '本文详细介绍 Vue 3 的组合式 API，包括 ref、reactive、computed 等核心概念，帮助开发者更好地组织组件逻辑。',
      content: `# Vue 3 组合式 API 详解

## 一、什么是组合式 API

组合式 API（Composition API）是 Vue 3 引入的一组基于函数的 API，它允许我们使用函数来组织组件逻辑。与传统的选项式 API 相比，组合式 API 提供了更灵活的代码组织方式，特别适合处理复杂的组件逻辑。

## 二、核心概念

### 2.1 ref 和 reactive

\`ref\` 用于创建响应式的基本类型数据：

\`\`\`javascript
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0
count.value++
console.log(count.value) // 1
\`\`\`

\`reactive\` 用于创建响应式的对象：

\`\`\`javascript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  name: 'Vue'
})
\`\`\`

### 2.2 computed 计算属性

计算属性会根据依赖自动更新：

\`\`\`javascript
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed(() => {
  return \`\${firstName.value} \${lastName.value}\`
})
\`\`\`

## 三、生命周期钩子

组合式 API 提供了以下生命周期钩子：

| 选项式 API | 组合式 API |
|-----------|-----------|
| beforeCreate | setup() |
| created | setup() |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |

## 四、实践建议

1. 将相关逻辑提取到自定义 Hook 中
2. 使用 ref 处理基本类型，使用 reactive 处理对象
3. 合理使用 watch 和 watchEffect
4. 保持 setup 函数简洁，将复杂逻辑提取出去

## 五、总结

组合式 API 为 Vue 3 带来了更灵活的代码组织方式，特别适合处理复杂的组件逻辑。通过合理使用，我们可以编写出更易维护、更易测试的代码。`,
      categoryId: 1,
      tags: ['Vue', 'JavaScript', '前端', '组合式API'],
      author: '张三',
      publishTime: '2024-01-15 10:30',
      views: 1256,
      status: 'published',
      createdAt: '2024-01-15 10:30',
      updatedAt: '2024-01-15 10:30',
      screenshotUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Vue3%20Composition%20API%20code%20editor%20interface%20dark%20theme&image_size=landscape_16_9',
      detailUrl: '/article/1'
    },
    {
      id: 2,
      title: 'TypeScript 类型体操入门',
      summary: '从基础到高级，全面讲解 TypeScript 类型系统的核心特性，包括类型推断、条件类型、映射类型等高级技巧。',
      content: `# TypeScript 类型体操入门

## 一、类型体操简介

类型体操是指在 TypeScript 中利用类型系统进行复杂类型运算的技巧。通过类型体操，我们可以实现类型安全检查、自动推断、代码提示等强大功能，大大提升开发体验和代码质量。

## 二、基础类型操作

### 2.1 类型推断

TypeScript 可以自动推断变量类型：

\`\`\`typescript
const name = 'Hello' // string
const age = 25 // number
const isActive = true // boolean
\`\`\`

### 2.2 类型断言

使用 \`as\` 进行类型断言：

\`\`\`typescript
const strLength = (str: string | null) => {
  return (str as string).length
}
\`\`\`

## 三、高级类型技巧

### 3.1 条件类型

\`\`\`typescript
type IsString<T> = T extends string ? true : false

type A = IsString<string> // true
type B = IsString<number> // false
\`\`\`

### 3.2 映射类型

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
\`\`\`

### 3.3 工具类型

TypeScript 内置了丰富的工具类型：

- Partial<T>: 所有属性可选
- Required<T>: 所有属性必填
- Pick<T, K>: 选择特定属性
- Omit<T, K>: 排除特定属性
- Record<K, T>: 构造对象类型

## 四、实战案例

### 4.1 类型安全的事件处理

\`\`\`typescript
type EventType = 'click' | 'hover' | 'focus'

type EventHandler<E extends EventType> = 
  E extends 'click' ? (e: MouseEvent) => void :
  E extends 'hover' ? (e: MouseEvent) => void :
  (e: Event) => void

function on<E extends EventType>(event: E, handler: EventHandler<E>) {
  document.addEventListener(event, handler as any)
}
\`\`\`

## 五、最佳实践

1. 优先使用类型推断，避免过度使用 any
2. 合理使用工具类型，简化类型定义
3. 创建可复用的类型定义
4. 使用类型体操来提升代码安全性

通过类型体操，我们可以实现复杂的类型安全检查和自动推断，让 TypeScript 真正发挥出它的威力。`,
      categoryId: 1,
      tags: ['TypeScript', '前端', '类型系统', '类型体操'],
      author: '张三',
      publishTime: '2024-01-14 14:20',
      views: 892,
      status: 'published',
      createdAt: '2024-01-14 14:20',
      updatedAt: '2024-01-14 14:20',
      screenshotUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=TypeScript%20code%20type%20definitions%20abstract%20coding&image_size=landscape_16_9',
      detailUrl: '/article/2'
    },
    {
      id: 3,
      title: 'Node.js 性能优化指南',
      summary: '深入讲解 Node.js 应用性能优化的各种技巧，包括异步编程优化、内存管理、缓存策略等。',
      content: `# Node.js 性能优化指南

## 一、性能监控

### 1.1 使用 Node.js 内置工具

\`\`\`bash
node --inspect app.js
\`\`\`

### 1.2 第三方监控工具

- PM2: 进程管理和监控
- New Relic: APM 监控
- Datadog: 性能追踪
- Clinic.js: 诊断工具

## 二、代码优化

### 2.1 异步编程优化

避免回调地狱，使用 async/await：

\`\`\`javascript
async function fetchData() {
  const data = await fetch('/api/data')
  return data.json()
}
\`\`\`

### 2.2 内存管理

注意及时释放不再使用的对象引用：

\`\`\`javascript
// 避免闭包内存泄漏
let cache = null
function processData(data) {
  cache = data // 长时间保持引用
  // 使用后及时清理
  setTimeout(() => { cache = null }, 1000)
}
\`\`\`

## 三、资源优化

### 3.1 缓存策略

使用 Redis 进行数据缓存：

\`\`\`javascript
const Redis = require('ioredis')
const redis = new Redis()

async function getCachedData(key, fetcher, ttl = 3600) {
  const cached = await redis.get(key)
  if (cached) {
    return JSON.parse(cached)
  }
  const data = await fetcher()
  await redis.setex(key, ttl, JSON.stringify(data))
  return data
}
\`\`\`

### 3.2 连接池

复用数据库连接，减少连接开销：

\`\`\`javascript
const { Pool } = require('pg')
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000
})

async function query(text, params) {
  const client = await pool.connect()
  try {
    return await client.query(text, params)
  } finally {
    client.release()
  }
}
\`\`\`

## 四、架构优化

### 4.1 使用 Stream

处理大文件时使用 Stream：

\`\`\`javascript
const fs = require('fs')
const { Transform } = require('stream')

const readStream = fs.createReadStream('large-file.txt')
const writeStream = fs.createWriteStream('output.txt')

const transform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase())
    callback()
  }
})

readStream.pipe(transform).pipe(writeStream)
\`\`\`

## 五、性能调优清单

1. 使用缓存减少数据库查询
2. 优化数据库查询，添加索引
3. 使用连接池管理数据库连接
4. 实现流式处理大文件
5. 使用 Worker Threads 处理 CPU 密集型任务
6. 启用 Gzip 压缩
7. 实现请求限流
8. 定期清理内存和缓存

性能优化是一个持续的过程，需要不断监控和调优。通过系统性的优化方法，我们可以将 Node.js 应用的性能提升到新的高度。`,
      categoryId: 2,
      tags: ['Node.js', '后端', '性能优化', '缓存'],
      author: '张三',
      publishTime: '2024-01-13 09:00',
      views: 654,
      status: 'published',
      createdAt: '2024-01-13 09:00',
      updatedAt: '2024-01-13 09:00',
      screenshotUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Node.js%20performance%20monitoring%20dashboard%20data%20charts&image_size=landscape_16_9',
      detailUrl: '/article/3'
    },
    {
      id: 4,
      title: 'CSS Grid 布局实战',
      summary: '全面介绍 CSS Grid 布局系统，从基础概念到高级技巧，帮助你快速掌握现代化网页布局。',
      content: `# CSS Grid 布局实战

## 一、Grid 基础

### 1.1 基本概念

Grid 布局是一种二维布局系统：

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
\`\`\`

### 1.2 网格线

网格线从 1 开始编号：

\`\`\`css
.item {
  grid-column: 1 / 3;
  grid-row: 2;
}
\`\`\`

## 二、高级技巧

### 2.1 命名网格线

\`\`\`css
.container {
  grid-template-columns: 
    [sidebar-start] 200px 
    [sidebar-end content-start] 1fr 
    [content-end];
}

.sidebar {
  grid-column: sidebar-start / sidebar-end;
}

.content {
  grid-column: content-start / content-end;
}
\`\`\`

### 2.2 自动填充

\`\`\`css
.container {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
\`\`\`

## 三、响应式设计

结合媒体查询实现响应式布局：

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .container {
    grid-template-columns: 1fr;
  }
}
\`\`\`

## 四、实战案例：卡片布局

\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.card {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## 五、Grid 与 Flexbox 选择

- **Grid**: 二维布局（行和列）
- **Flexbox**: 一维布局（行或列）

两者可以结合使用，发挥各自优势。`,
      categoryId: 1,
      tags: ['CSS', '前端', '布局', 'Grid'],
      author: '张三',
      publishTime: '2024-01-12 16:45',
      views: 523,
      status: 'published',
      createdAt: '2024-01-12 16:45',
      updatedAt: '2024-01-12 16:45',
      screenshotUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=CSS%20Grid%20layout%20design%20wireframe%20interface&image_size=landscape_16_9',
      detailUrl: '/article/4'
    },
    {
      id: 5,
      title: 'Docker 容器化部署实践',
      summary: '从 Docker 基础到 Kubernetes 部署，全面讲解容器化技术在实际项目中的应用。',
      content: `# Docker 容器化部署实践

## 一、Docker 基础

### 1.1 Dockerfile 编写

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
\`\`\`

### 1.2 docker-compose 编排

\`\`\`yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
      - redis
  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-data:/var/lib/postgresql/data
  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data

volumes:
  postgres-data:
  redis-data:
\`\`\`

## 二、多阶段构建

减少镜像体积：

\`\`\`dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["node", "server.js"]
\`\`\`

## 三、Kubernetes 部署

### 3.1 Deployment

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: myapp:latest
        ports:
        - containerPort: 3000
\`\`\`

### 3.2 Service

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
spec:
  selector:
    app: web-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
\`\`\`

## 四、最佳实践

- 使用多阶段构建
- 最小化镜像层数
- 使用 .dockerignore
- 安全扫描镜像
- 日志收集和监控
- 资源限制设置

通过系统化的容器化实践，我们可以实现应用的快速部署、弹性伸缩和环境一致性。`,
      categoryId: 3,
      tags: ['Docker', 'DevOps', '部署', 'Kubernetes'],
      author: '张三',
      publishTime: '2024-01-11 11:30',
      views: 789,
      status: 'published',
      createdAt: '2024-01-11 11:30',
      updatedAt: '2024-01-11 11:30',
      screenshotUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Docker%20containers%20Kubernetes%20cluster%20tech%20infographic&image_size=landscape_16_9',
      detailUrl: '/article/5'
    },
    {
      id: 6,
      title: 'React Hooks 完全指南',
      summary: '深入解析 React Hooks 的使用方法，包括 useState、useEffect、自定义 Hooks 等核心概念。',
      content: `# React Hooks 完全指南

## 一、useState

\`\`\`javascript
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  )
}
\`\`\`

## 二、useEffect

\`\`\`javascript
import { useEffect, useState } from 'react'

function DataFetcher() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
  }, [])
  
  return <div>{data?.content}</div>
}
\`\`\`

## 三、自定义 Hooks

\`\`\`javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })
  
  const setValue = value => {
    setStoredValue(value)
    window.localStorage.setItem(key, JSON.stringify(value))
  }
  
  return [storedValue, setValue]
}
\`\`\`

## 四、性能优化

使用 useMemo 和 useCallback 避免不必要的重渲染：

\`\`\`javascript
import { useMemo, useCallback } from 'react'

const MemoizedComponent = ({ items, filter }) => {
  const filteredItems = useMemo(() => {
    return items.filter(item => item.includes(filter))
  }, [items, filter])

  const handleClick = useCallback((item) => {
    console.log(item)
  }, [])

  return (
    <div>
      {filteredItems.map(item => (
        <div key={item} onClick={() => handleClick(item)}>
          {item}
        </div>
      ))}
    </div>
  )
}
\`\`\`

## 五、React 18 新特性

- useTransition: 标记非紧急更新
- useDeferredValue: 延迟更新非关键值
- useId: 生成唯一 ID
- useSyncExternalStore: 订阅外部 store

Hooks 彻底改变了 React 的编程范式，让我们能够更简洁、更高效地编写组件逻辑。`,
      categoryId: 1,
      tags: ['React', '前端', 'Hooks', '性能优化'],
      author: '张三',
      publishTime: '2024-01-10 15:00',
      views: 1123,
      status: 'published',
      createdAt: '2024-01-10 15:00',
      updatedAt: '2024-01-10 15:00',
      screenshotUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=React%20Hooks%20code%20snippets%20programming%20interface&image_size=landscape_16_9',
      detailUrl: '/article/6'
    },
    {
      id: 7,
      title: '机器学习入门：从理论到实践',
      summary: '从零开始学习机器学习，包括监督学习、非监督学习、深度学习等核心概念，并提供 Python 代码实例。',
      content: `# 机器学习入门：从理论到实践

## 一、机器学习简介

机器学习是人工智能的一个分支，通过让计算机从数据中学习规律来完成任务。主要分为监督学习、非监督学习、强化学习等类别。

## 二、监督学习

### 2.1 线性回归

\`\`\`python
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# 准备数据
X = np.array([[1, 1], [1, 2], [2, 2], [2, 3]])
y = np.dot(X, np.array([1, 2])) + 3

# 训练模型
model = LinearRegression().fit(X, y)
print(f"系数: {model.coef_}")
print(f"截距: {model.intercept_}")
\`\`\`

### 2.2 逻辑回归

\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris
from sklearn.metrics import accuracy_score

iris = load_iris()
X, y = iris.data, iris.target

model = LogisticRegression(max_iter=200)
model.fit(X, y)

predictions = model.predict(X)
print(f"准确率: {accuracy_score(y, predictions):.2f}")
\`\`\`

## 三、神经网络基础

\`\`\`python
import tensorflow as tf
from tensorflow import keras

# 构建模型
model = keras.Sequential([
    keras.layers.Dense(128, activation='relu', input_shape=(784,)),
    keras.layers.Dense(10, activation='softmax')
])

# 编译模型
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# 训练模型
model.fit(x_train, y_train, epochs=10, validation_split=0.2)
\`\`\`

## 四、实践项目

### 4.1 图像分类

使用 CNN 实现手写数字识别：

\`\`\`python
model = keras.Sequential([
    keras.layers.Reshape((28, 28, 1), input_shape=(784,)),
    keras.layers.Conv2D(32, 3, activation='relu'),
    keras.layers.MaxPooling2D(2),
    keras.layers.Flatten(),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dense(10, activation='softmax')
])
\`\`\`

## 五、学习路径

1. 数学基础：线性代数、微积分、概率统计
2. 编程基础：Python、NumPy、Pandas
3. 机器学习基础：Scikit-learn
4. 深度学习：TensorFlow/PyTorch
5. 实战项目：Kaggle 竞赛

机器学习是一个需要持续学习的领域，通过理论与实践相结合，你将逐步掌握这门技术。`,
      categoryId: 4,
      tags: ['机器学习', 'AI', 'Python', '深度学习'],
      author: '李四',
      publishTime: '2024-01-09 10:00',
      views: 1567,
      status: 'published',
      createdAt: '2024-01-09 10:00',
      updatedAt: '2024-01-09 10:00',
      screenshotUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=machine%20learning%20AI%20neural%20networks%20data%20visualization&image_size=landscape_16_9',
      detailUrl: '/article/7'
    },
    {
      id: 8,
      title: 'MongoDB 数据库设计与优化',
      summary: '全面介绍 MongoDB 的数据建模、索引优化、查询性能调优等最佳实践。',
      content: `# MongoDB 数据库设计与优化

## 一、数据模型设计

### 1.1 嵌入文档 vs 引用

**嵌入文档**适合一对一关系：

\`\`\`javascript
{
  _id: ObjectId('...'),
  name: 'John',
  address: {
    city: 'Beijing',
    street: 'Main Street'
  }
}
\`\`\`

**引用**适合一对多关系：

\`\`\`javascript
{
  _id: ObjectId('...'),
  userId: ObjectId('...'),
  posts: [ObjectId('...'), ObjectId('...')]
}
\`\`\`

### 1.2 数组设计

\`\`\`javascript
{
  _id: ObjectId('...'),
  title: 'Post',
  tags: ['tech', 'blog'],
  comments: [
    { author: 'user1', content: 'Great post!', createdAt: ISODate() }
  ]
}
\`\`\`

## 二、索引优化

### 2.1 创建索引

\`\`\`javascript
db.users.createIndex({ email: 1 })
db.posts.createIndex({ createdAt: -1 })
\`\`\`

### 2.2 复合索引

\`\`\`javascript
db.orders.createIndex({ userId: 1, createdAt: -1 })
\`\`\`

### 2.3 索引分析

使用 explain() 分析查询性能：

\`\`\`javascript
db.orders.find({ userId: ObjectId('...') }).explain('executionStats')
\`\`\`

## 三、聚合管道

\`\`\`javascript
db.orders.aggregate([
  { 
    $match: { 
      status: 'completed',
      createdAt: { $gte: new Date('2024-01-01') }
    }
  },
  {
    $group: {
      _id: '$userId',
      totalAmount: { $sum: '$amount' },
      orderCount: { $sum: 1 }
    }
  },
  {
    $sort: { totalAmount: -1 }
  },
  {
    $limit: 10
  }
])
\`\`\`

## 四、性能调优

1. 分析慢查询日志
2. 合理设计数据模型
3. 创建适当的索引
4. 使用聚合管道优化复杂查询
5. 合理配置 WiredTiger 缓存
6. 使用分片进行水平扩展

MongoDB 是一个强大的 NoSQL 数据库，但要发挥其最佳性能，需要良好的设计和持续的优化。`,
      categoryId: 2,
      tags: ['MongoDB', '数据库', '后端', '性能优化'],
      author: '张三',
      publishTime: '2024-01-08 14:30',
      views: 456,
      status: 'published',
      createdAt: '2024-01-08 14:30',
      updatedAt: '2024-01-08 14:30',
      screenshotUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=MongoDB%20database%20data%20structures%20query%20visualization&image_size=landscape_16_9',
      detailUrl: '/article/8'
    },
    {
      id: 9,
      title: '现代前端工程化最佳实践',
      summary: '从零搭建完整的前端工程，包括 Webpack/Vite 配置、代码规范、CI/CD 等。',
      content: `# 现代前端工程化最佳实践

## 一、项目初始化

### 1.1 使用 Vite

\`\`\`bash
npm create vite@latest my-project -- --template vue-ts
cd my-project
npm install
npm run dev
\`\`\`

### 1.2 目录结构

\`\`\`
src/
├── assets/          # 静态资源
├── components/      # 通用组件
├── composables/     # 组合式函数
├── layouts/         # 布局组件
├── router/          # 路由配置
├── stores/          # 状态管理
├── styles/          # 样式文件
├── types/           # TypeScript 类型
├── utils/           # 工具函数
├── views/           # 页面组件
├── App.vue
└── main.ts
\`\`\`

## 二、代码规范

### 2.1 ESLint 配置

\`\`\`javascript
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/explicit-function-return-type': 'off'
  }
}
\`\`\`

## 三、CI/CD 流程

### 3.1 GitHub Actions

\`\`\`yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run lint
    - run: npm run type-check
    - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
\`\`\`

## 四、性能优化

1. 代码分割和懒加载
2. Tree Shaking
3. 图片优化和 CDN
4. 缓存策略
5. 关键资源预加载

良好的工程化实践可以显著提升开发效率和代码质量，是每个前端工程师必备的技能。`,
      categoryId: 1,
      tags: ['前端', '工程化', 'Vite', 'CI/CD'],
      author: '李四',
      publishTime: '2024-01-07 09:15',
      views: 890,
      status: 'published',
      createdAt: '2024-01-07 09:15',
      updatedAt: '2024-01-07 09:15',
      screenshotUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=frontend%20development%20code%20editor%20workspace%20interface&image_size=landscape_16_9',
      detailUrl: '/article/9'
    },
    {
      id: 10,
      title: '量子计算基础概念',
      summary: '介绍量子计算的核心概念，包括量子比特、量子叠加、量子纠缠等，并探讨其应用前景。',
      content: `# 量子计算基础概念

## 一、量子比特

经典比特只能处于 0 或 1 两种状态之一，而量子比特（Qubit）可以同时处于多个状态的叠加：

\`|ψ⟩ = α|0⟩ + β|1⟩\`

其中 α 和 β 是复数，满足 \`|α|² + |β|² = 1\`。

## 二、量子叠加

量子叠加允许量子比特同时处于多个状态，这是量子计算并行性的基础。一个有 n 个量子比特的系统可以同时处理 2ⁿ 个状态。

## 三、量子纠缠

量子纠缠是量子力学中最神奇的现象之一。两个纠缠的量子比特之间存在非局域关联：无论它们相隔多远，测量其中一个会立即影响另一个的状态。

## 四、量子门

与经典逻辑门类似，量子门用于操作量子比特：

- **Hadamard 门**: 创建叠加态
- **Pauli-X 门**: 类似经典 NOT 门
- **Pauli-Y/Z 门**: 旋转量子态
- **CNOT 门**: 受控 NOT 门

## 五、量子算法

### 5.1 Shor 算法

Shor 算法可以在多项式时间内分解大整数，这对当前的 RSA 加密构成了潜在威胁。

### 5.2 Grover 算法

Grover 算法提供了二次加速的搜索算法，适用于数据库搜索等场景。

## 六、应用前景

1. **密码学**: 量子密钥分发、后量子密码学
2. **药物发现**: 模拟分子结构
3. **金融**: 投资组合优化
4. **材料科学**: 发现新材料
5. **AI**: 加速机器学习

量子计算虽然仍处于早期阶段，但它的潜力巨大，值得持续关注和学习。`,
      categoryId: 5,
      tags: ['量子计算', '前沿技术', '科普', '计算机科学'],
      author: '王五',
      publishTime: '2024-01-06 16:00',
      views: 678,
      status: 'published',
      createdAt: '2024-01-06 16:00',
      updatedAt: '2024-01-06 16:00',
      screenshotUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=quantum%20computing%20futuristic%20technology%20abstract%20concept&image_size=landscape_16_9',
      detailUrl: '/article/10'
    }
  ])
}

function saveArticles(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save articles to localStorage:', e)
  }
}

export const useArticleStore = defineStore('article', () => {
  const articles = ref(loadArticles())

  const categories = ref([
    {
      id: 1,
      name: '前端开发',
      icon: 'code',
      children: [
        { id: 11, name: 'Vue.js', parentId: 1 },
        { id: 12, name: 'React', parentId: 1 },
        { id: 13, name: 'TypeScript', parentId: 1 },
        { id: 14, name: 'CSS', parentId: 1 }
      ]
    },
    {
      id: 2,
      name: '后端开发',
      icon: 'server',
      children: [
        { id: 21, name: 'Node.js', parentId: 2 },
        { id: 22, name: '数据库', parentId: 2 },
        { id: 23, name: 'API设计', parentId: 2 }
      ]
    },
    {
      id: 3,
      name: 'DevOps',
      icon: 'cloud',
      children: [
        { id: 31, name: 'Docker', parentId: 3 },
        { id: 32, name: 'CI/CD', parentId: 3 },
        { id: 33, name: 'Git', parentId: 3 }
      ]
    },
    {
      id: 4,
      name: 'AI/机器学习',
      icon: 'cpu',
      children: [
        { id: 41, name: '机器学习', parentId: 4 },
        { id: 42, name: '深度学习', parentId: 4 },
        { id: 43, name: 'Python', parentId: 4 }
      ]
    },
    {
      id: 5,
      name: '前沿技术',
      icon: 'sparkles',
      children: [
        { id: 51, name: '量子计算', parentId: 5 },
        { id: 52, name: 'Web3', parentId: 5 },
        { id: 53, name: '元宇宙', parentId: 5 }
      ]
    },
    {
      id: 6,
      name: '知识库',
      icon: 'notebook',
      children: [
        { id: 61, name: '项目复盘', parentId: 6 },
        { id: 62, name: '技术概念', parentId: 6 }
      ]
    }
  ])

  const loading = ref(false)
  const error = ref(null)

  const currentPage = ref(1)
  const pageSize = ref(10)
  const sortBy = ref('publishTime')
  const sortOrder = ref('desc')
  const selectedCategory = ref(null)

  const filteredArticles = computed(() => {
    let result = [...articles.value]
    
    if (selectedCategory.value) {
      const categoryIds = getCategoryIds(selectedCategory.value)
      result = result.filter(a => categoryIds.includes(a.categoryId))
    }
    
    result.sort((a, b) => {
      const aVal = a[sortBy.value]
      const bVal = b[sortBy.value]
      if (sortOrder.value === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
    
    return result
  })

  const totalPages = computed(() => {
    return Math.ceil(filteredArticles.value.length / pageSize.value)
  })

  const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredArticles.value.slice(start, end)
  })

  function getCategoryIds(categoryId) {
    const ids = [categoryId]
    const category = categories.value.find(c => c.id === categoryId)
    if (category && category.children) {
      ids.push(...category.children.map(c => c.id))
    }
    return ids
  }

  function getCategoryName(categoryId) {
    for (const category of categories.value) {
      if (category.id === categoryId) return category.name
      if (category.children) {
        const child = category.children.find(c => c.id === categoryId)
        if (child) return child.name
      }
    }
    return '未分类'
  }

  function getArticle(id) {
    return articles.value.find(a => a.id === parseInt(id))
  }

  async function fetchArticles() {
    loading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  function createArticle(article) {
    const newArticle = {
      id: Date.now(),
      ...article,
      status: 'draft',
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      publishTime: null,
      views: 0,
      screenshotUrl: article.screenshotUrl || '',
      detailUrl: article.detailUrl || ''
    }
    articles.value.unshift(newArticle)
    saveArticles(articles.value)
    return newArticle
  }

  function updateArticle(id, updates) {
    const index = articles.value.findIndex(a => a.id === parseInt(id))
    if (index !== -1) {
      articles.value[index] = {
        ...articles.value[index],
        ...updates,
        updatedAt: new Date().toLocaleString()
      }
      if (updates.status === 'published' && !articles.value[index].publishTime) {
        articles.value[index].publishTime = new Date().toLocaleString()
      }
      saveArticles(articles.value)
      return articles.value[index]
    }
    return null
  }

  function deleteArticle(id) {
    const index = articles.value.findIndex(a => a.id === parseInt(id))
    if (index !== -1) {
      const deleted = articles.value.splice(index, 1)[0]
      saveArticles(articles.value)
      return deleted
    }
    return null
  }

  function incrementViews(id) {
    const article = articles.value.find(a => a.id === parseInt(id))
    if (article) {
      article.views++
      saveArticles(articles.value)
    }
  }

  return {
    articles,
    categories,
    loading,
    error,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    selectedCategory,
    filteredArticles,
    totalPages,
    paginatedArticles,
    getCategoryName,
    getArticle,
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    incrementViews,
    getCategoryIds
  }
})