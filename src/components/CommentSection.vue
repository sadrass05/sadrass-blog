<template>
  <div class="comment-section">
    <div class="section-header">
      <h3>
        <el-icon name="message" /> 
        评论 ({{ totalComments }})
      </h3>
    </div>

    <div v-if="commentStore.loading" class="loading-container">
      <el-spinner type="dots" />
    </div>

    <div v-else-if="comments.length === 0" class="empty-state">
      <el-icon name="message" :size="48" />
      <p>暂无评论，快来发表第一条评论吧</p>
    </div>

    <div v-else class="comments-list">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="comment-item"
      >
        <div class="comment-avatar">
          <div 
            class="avatar-circle"
            :style="{ background: avatarColors[getAvatarIndex(comment.email)] }"
          >
            {{ getAvatarInitials(comment.email) }}
          </div>
        </div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">{{ comment.author }}</span>
            <span class="comment-time">{{ comment.createdAt }}</span>
          </div>
          <p class="comment-text">{{ comment.content }}</p>
          <div class="comment-actions">
            <button class="action-btn" @click="toggleReply(comment.id)">
              <el-icon name="reply" /> 回复
            </button>
          </div>

          <div v-if="showReplyForm === comment.id" class="reply-form">
            <textarea
              v-model="replyContent"
              placeholder="写下你的回复..."
              class="reply-textarea"
              rows="3"
            ></textarea>
            <div class="reply-form-footer">
              <el-input
                v-model="replyAuthor"
                placeholder="你的名字"
                class="reply-author-input"
              />
              <el-input
                v-model="replyEmail"
                placeholder="邮箱（用于显示头像）"
                class="reply-email-input"
              />
              <el-button type="primary" @click="submitReply(comment.id)">
                回复
              </el-button>
              <el-button @click="showReplyForm = null">取消</el-button>
            </div>
          </div>

          <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
            <div
              v-for="reply in comment.replies"
              :key="reply.id"
              class="reply-item"
            >
              <div class="reply-avatar">
                <div 
                  class="avatar-circle-small"
                  :style="{ background: avatarColors[getAvatarIndex(reply.email)] }"
                >
                  {{ getAvatarInitials(reply.email) }}
                </div>
              </div>
              <div class="reply-content">
                <div class="reply-header">
                  <span class="reply-author">{{ reply.author }}</span>
                  <span class="reply-time">{{ reply.createdAt }}</span>
                </div>
                <p class="reply-text">{{ reply.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="comment-form">
      <h4>发表评论</h4>
      <textarea
        v-model="newComment"
        placeholder="写下你的评论..."
        class="comment-textarea"
        rows="4"
      ></textarea>
      <div class="comment-form-footer">
        <div class="form-group">
          <el-input
            v-model="commentAuthor"
            placeholder="你的名字"
            class="comment-author-input"
          />
        </div>
        <div class="form-group">
          <el-input
            v-model="commentEmail"
            placeholder="邮箱（用于显示头像）"
            class="comment-email-input"
          />
        </div>
        <el-button 
          type="primary" 
          @click="submitComment"
          :loading="commentStore.loading"
        >
          <el-icon name="send" /> 发表评论
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCommentStore } from '../stores/comment'

const props = defineProps({
  contentId: {
    type: [Number, String],
    required: true
  },
  contentType: {
    type: String,
    required: true,
    validator: (value) => ['article', 'diary'].includes(value)
  }
})

const commentStore = useCommentStore()

const newComment = ref('')
const commentAuthor = ref('')
const commentEmail = ref('')
const replyContent = ref('')
const replyAuthor = ref('')
const replyEmail = ref('')
const showReplyForm = ref(null)

const avatarColors = [
  '#00d4ff', '#ffb800', '#ff6b35', '#48bb78', 
  '#f56565', '#ed8936', '#ecc94b', '#38b2ac', 
  '#3182ce', '#805ad5', '#d53f8c', '#718096'
]

const comments = computed(() => {
  return commentStore.getCommentsByContent(props.contentId, props.contentType)
})

const totalComments = computed(() => {
  return commentStore.getCommentCount(props.contentId, props.contentType)
})

function getAvatarIndex(email) {
  if (!email) return Math.floor(Math.random() * avatarColors.length)
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash) % avatarColors.length
}

function getAvatarInitials(email) {
  if (!email) return '?'
  const name = email.split('@')[0]
  return name.slice(0, 2).toUpperCase()
}

function toggleReply(commentId) {
  showReplyForm.value = showReplyForm.value === commentId ? null : commentId
}

async function submitComment() {
  if (!newComment.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }
  
  const result = await commentStore.addComment(
    props.contentId,
    props.contentType,
    newComment.value,
    commentAuthor.value,
    commentEmail.value
  )
  
  if (result) {
    ElMessage.success('评论发表成功')
    newComment.value = ''
    commentAuthor.value = ''
    commentEmail.value = ''
  } else {
    ElMessage.error('评论发表失败')
  }
}

async function submitReply(commentId) {
  if (!replyContent.value.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }
  
  const result = await commentStore.addReply(
    commentId,
    replyContent.value,
    replyAuthor.value || commentAuthor.value,
    replyEmail.value || commentEmail.value
  )
  
  if (result) {
    ElMessage.success('回复成功')
    replyContent.value = ''
    showReplyForm.value = null
  } else {
    ElMessage.error('回复失败')
  }
}

const { ElMessage } = await import('element-plus')
</script>

<style scoped>
.comment-section {
  margin-top: 40px;
}

.section-header h3 {
  color: #00d4ff;
  font-size: 1.25rem;
  margin: 0 0 25px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 30px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #718096;
}

.empty-state p {
  margin-top: 15px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
}

.comment-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
}

.avatar-circle-small {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 0.8rem;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.comment-author {
  color: #fff;
  font-weight: 600;
}

.comment-time {
  color: #718096;
  font-size: 0.85rem;
}

.comment-text {
  color: #a0aec0;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.comment-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: #00d4ff;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background 0.2s;
}

.action-btn:hover {
  background: rgba(0, 212, 255, 0.1);
}

.reply-form {
  margin-top: 15px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.reply-textarea {
  width: 100%;
  resize: none;
  background: rgba(10, 10, 26, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 6px;
  padding: 12px;
  color: #e2e8f0;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.reply-textarea:focus {
  outline: none;
  border-color: #00d4ff;
}

.reply-form-footer {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.reply-author-input,
.reply-email-input {
  width: 150px;
}

.replies-list {
  margin-top: 15px;
  padding-left: 30px;
  border-left: 2px solid rgba(0, 212, 255, 0.2);
}

.reply-item {
  display: flex;
  gap: 12px;
  padding: 15px 0;
  border-bottom: 1px dashed rgba(0, 212, 255, 0.1);
}

.reply-item:last-child {
  border-bottom: none;
}

.reply-content {
  flex: 1;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.reply-author {
  color: #00d4ff;
  font-weight: 500;
  font-size: 0.9rem;
}

.reply-time {
  color: #718096;
  font-size: 0.8rem;
}

.reply-text {
  color: #a0aec0;
  line-height: 1.5;
  margin: 0;
  font-size: 0.9rem;
}

.comment-form {
  margin-top: 30px;
  padding: 25px;
  background: rgba(26, 26, 62, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
}

.comment-form h4 {
  color: #fff;
  margin: 0 0 15px 0;
}

.comment-textarea {
  width: 100%;
  resize: none;
  background: rgba(10, 10, 26, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  padding: 15px;
  color: #e2e8f0;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 15px;
}

.comment-textarea:focus {
  outline: none;
  border-color: #00d4ff;
}

.comment-form-footer {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 150px;
  max-width: 200px;
}

.comment-author-input,
.comment-email-input {
  width: 100%;
}

@media (max-width: 768px) {
  .comment-item {
    flex-direction: column;
    gap: 12px;
  }
  
  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .reply-form-footer {
    flex-direction: column;
    align-items: stretch;
  }
  
  .reply-author-input,
  .reply-email-input {
    width: 100%;
  }
  
  .comment-form-footer {
    flex-direction: column;
    align-items: stretch;
  }
  
  .replies-list {
    padding-left: 15px;
  }
}
</style>
