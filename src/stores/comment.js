import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCommentStore = defineStore('comment', () => {
  const comments = ref([
    {
      id: 1,
      contentId: 1,
      contentType: 'article',
      content: '非常棒的文章！Vue 3 的组合式API确实很强大，期待更多相关教程。',
      author: '小明',
      email: 'xiaoming@example.com',
      createdAt: '2024-01-15 14:30',
      replies: [
        {
          id: 101,
          commentId: 1,
          content: '同意！我也觉得组合式API更好用。',
          author: '小红',
          email: 'xiaohong@example.com',
          createdAt: '2024-01-15 14:45'
        },
        {
          id: 102,
          commentId: 1,
          content: '感谢支持！会继续更新的。',
          author: '张三',
          email: 'zhangsan@example.com',
          createdAt: '2024-01-15 15:00'
        }
      ]
    },
    {
      id: 2,
      contentId: 2,
      contentType: 'article',
      content: 'TypeScript 的类型体操确实很有挑战性，这篇文章讲解得很清晰！',
      author: '技术爱好者',
      email: 'tech@example.com',
      createdAt: '2024-01-14 16:20',
      replies: []
    },
    {
      id: 3,
      contentId: 3,
      contentType: 'article',
      content: 'Node.js 性能优化的几个点很实用，已经应用到项目中了。',
      author: '后端开发者',
      email: 'backend@example.com',
      createdAt: '2024-01-13 10:15',
      replies: [
        {
          id: 301,
          commentId: 3,
          content: '请问 Redis 缓存策略具体怎么配置？',
          author: '新手小白',
          email: 'newbie@example.com',
          createdAt: '2024-01-13 11:00'
        }
      ]
    },
    {
      id: 4,
      contentId: 1,
      contentType: 'diary',
      content: '今天的日记写得很有感触，加油！',
      author: '读者A',
      email: 'readerA@example.com',
      createdAt: '2024-01-12 20:30',
      replies: []
    },
    {
      id: 5,
      contentId: 4,
      contentType: 'article',
      content: 'CSS Grid 布局终于搞懂了，感谢分享！',
      author: '前端初学者',
      email: 'frontend@example.com',
      createdAt: '2024-01-12 15:45',
      replies: []
    }
  ])

  const loading = ref(false)
  const error = ref(null)

  const allComments = computed(() => {
    return [...comments.value].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )
  })

  const recentComments = computed(() => {
    return allComments.value.slice(0, 5)
  })

  function getCommentsByContent(contentId, contentType) {
    return comments.value.filter(c => 
      c.contentId === parseInt(contentId) && c.contentType === contentType
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  function getCommentCount(contentId, contentType) {
    const contentComments = getCommentsByContent(contentId, contentType)
    return contentComments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0)
  }

  function getAvatar(email) {
    const hash = email ? hashCode(email) : Date.now()
    const colors = [
      '#00d4ff', '#ffb800', '#ff6b35', '#48bb78', 
      '#f56565', '#ed8936', '#ecc94b', '#48bb78',
      '#38b2ac', '#3182ce', '#805ad5', '#d53f8c'
    ]
    const color = colors[Math.abs(hash) % colors.length]
    const initials = email ? email.split('@')[0].slice(0, 2).toUpperCase() : '?'
    return { color, initials }
  }

  function hashCode(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash
  }

  async function addComment(contentId, contentType, content, author, email) {
    loading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const newComment = {
        id: Date.now(),
        contentId: parseInt(contentId),
        contentType,
        content: sanitizeContent(content),
        author: author || '匿名用户',
        email: email || '',
        createdAt: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '-'),
        replies: []
      }
      
      comments.value.push(newComment)
      return newComment
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function addReply(commentId, content, author, email) {
    loading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const comment = comments.value.find(c => c.id === commentId)
      if (!comment) {
        throw new Error('评论不存在')
      }
      
      const newReply = {
        id: Date.now(),
        commentId,
        content: sanitizeContent(content),
        author: author || '匿名用户',
        email: email || '',
        createdAt: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '-')
      }
      
      comment.replies.push(newReply)
      return newReply
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteComment(commentId) {
    loading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      const index = comments.value.findIndex(c => c.id === commentId)
      if (index !== -1) {
        comments.value.splice(index, 1)
        return true
      }
      return false
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteReply(commentId, replyId) {
    loading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      const comment = comments.value.find(c => c.id === commentId)
      if (!comment) {
        throw new Error('评论不存在')
      }
      const replyIndex = comment.replies.findIndex(r => r.id === replyId)
      if (replyIndex !== -1) {
        comment.replies.splice(replyIndex, 1)
        return true
      }
      return false
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  function sanitizeContent(content) {
    if (!content) return ''
    return content
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim()
  }

  return {
    comments,
    loading,
    error,
    allComments,
    recentComments,
    getCommentsByContent,
    getCommentCount,
    getAvatar,
    addComment,
    addReply,
    deleteComment,
    deleteReply
  }
})
