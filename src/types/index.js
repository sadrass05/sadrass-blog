export interface User {
  id: number
  username: string
  email: string
  name: string
  avatar: string | null
  role: string
}

export interface Article {
  id: number
  title: string
  content: string
  categoryId: number
  tags: string[]
  author: string
  publishTime: string | null
  views: number
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  icon: string
  children?: Category[]
  parentId?: number
}

export interface Comment {
  id: number
  contentId: number
  contentType: 'article' | 'diary'
  content: string
  author: string
  email: string
  createdAt: string
  replies: Reply[]
}

export interface Reply {
  id: number
  commentId: number
  content: string
  author: string
  email: string
  createdAt: string
}

export interface Diary {
  id: string
  date: string
  title: string
  content: string
  tags: string[]
  mood: string
  weather: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: number
  name: string
  description: string
  cover: string
  tags: string[]
  status: 'active' | 'completed' | 'paused'
  githubUrl: string
  demoUrl: string
  createdAt: string
  updatedAt: string
}

export interface FortuneData {
  overall: number
  wealth: number
  love: number
  health: number
}

export interface SolarTerm {
  name: string
  date: string
  description: string
}

export interface Holiday {
  name: string
  date: string
  daysUntil: number
  type: 'solar' | 'lunar'
}

export interface HistoryEvent {
  year: number
  title: string
  description: string
}