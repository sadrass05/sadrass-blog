# 个人博客系统

基于 Vue 3 + Vite + Element Plus 构建的现代化个人博客系统，采用科幻主题设计风格。

## 功能特性

### 📄 文章管理
- 文章列表展示（支持分类筛选、分页、排序）
- 文章详情查看（Markdown 渲染、代码高亮）
- 文章编辑（富文本编辑器、实时预览）
- 文章分类管理

### 📅 日记模块
- 交互式日历表格
- 日记目录（支持分页浏览）
- 日记创建、编辑、删除
- 日记导入/导出备份功能
- 今日运势、节气、历史事件、节假日展示

### 🚀 项目展示
- 项目列表展示
- 项目详情页
- 项目统计数据

### 💬 评论系统
- 文章和日记评论支持
- 多级评论回复
- 评论头像自动生成
- 最新评论展示

### 🔒 后台管理
- 文章管理（新建、编辑、删除）
- 用户登录验证

## 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **图标**: Element Plus Icons
- **代码高亮**: highlight.js
- **Markdown**: marked

## 项目结构

```
src/
├── components/          # 公共组件
│   ├── NavBar.vue       # 导航栏
│   ├── FooterBar.vue    # 页脚
│   └── CommentSection.vue # 评论组件
├── views/              # 页面视图
│   ├── Home.vue        # 首页
│   ├── ArticleList.vue # 文章列表
│   ├── ArticleDetail.vue # 文章详情
│   ├── ArticleEditor.vue # 文章编辑
│   ├── Diary.vue       # 日记页面
│   ├── ProjectList.vue # 项目列表
│   ├── ProjectDetail.vue # 项目详情
│   ├── ProjectShow.vue # 项目展示
│   ├── About.vue       # 关于我
│   └── Admin.vue       # 后台管理
├── router/             # 路由配置
│   └── index.js
├── stores/             # 状态管理
│   ├── article.js      # 文章数据
│   ├── comment.js      # 评论数据
│   └── user.js         # 用户数据
├── utils/              # 工具函数
│   ├── date.js         # 日期处理
│   ├── string.js       # 字符串处理
│   ├── storage.js      # 本地存储
│   └── index.js
├── data/               # 静态数据
│   ├── solarTerms.js   # 节气数据
│   ├── holidays.js     # 节假日数据
│   ├── historyEvents.js # 历史事件
│   └── fortune.js      # 运势数据
├── types/              # 类型定义
│   └── index.js
├── App.vue
├── main.js
└── style.css           # 全局样式
```

## 安装与运行

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 开发模式

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 设计风格

### 配色方案
- **主色调**: 深邃宇宙黑 (#0a0a1a)
- **辅助色**: 星际蓝 (#1a1a3e)
- **科技色**: 霓虹蓝 (#00d4ff)
- **点缀色**: 太阳金 (#ffb800)
- **能量色**: 能量橙 (#ff6b35)

### 设计元素
- 星空背景动画
- 霓虹发光效果
- 能量波动动画
- 星舰外壳纹理

## 路由配置

| 路径 | 名称 | 说明 | 权限 |
|------|------|------|------|
| / | Home | 首页 | 公开 |
| /articles | ArticleList | 文章列表 | 公开 |
| /article/:id | ArticleDetail | 文章详情 | 公开 |
| /diary | Diary | 日记 | 公开 |
| /projects | ProjectList | 项目列表 | 公开 |
| /project/:id | ProjectDetail | 项目详情 | 公开 |
| /about | About | 关于我 | 公开 |
| /admin | Admin | 后台管理 | 需要登录 |
| /admin/article/new | ArticleCreate | 新建文章 | 需要登录 |
| /admin/article/:id | ArticleEdit | 编辑文章 | 需要登录 |

## 登录信息

- **用户名**: admin
- **密码**: admin

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## License

MIT