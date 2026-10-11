<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import useUserStore from '@/store/user'
import { useWebSocketStore } from '@/store/websocket'
import type { chatListDataType, WebSocketMessage, historyResponseDataType, messageType } from '@/api/news/type'
import { watch } from 'vue'
import { reqGetHistory } from '@/api/news'
import img01 from '@/assets/loading.jpg'

const props = defineProps<{
  userData?: chatListDataType
}>()

const userStore = useUserStore()
const wsStore = useWebSocketStore()

// 聊天消息列表
const messages = ref<messageType[]>([])

// 输入的消息内容
const inputMessage = ref('')

watch(() => props.userData, () => {
  updateCurrentChat()
  if (props.userData) loadHistoryMessages()
})

// 更新当前聊天对象
const updateCurrentChat = () => {
  if (props.userData) {
    currentChat.value.id = props.userData.contactId
    currentChat.value.name = props.userData.contactName
    currentChat.value.avatar = props.userData.contactAvatar
    messages.value = []
  }
}

// 当前聊天对象信息
const currentChat = ref({
  id: 2,
  name: '环保小卫士',
  avatar: img01
})

// 仅当消息属于当前会话时写入列表（由全局 WebSocket store 回调）
const handleReceivedMessage = (messageData: WebSocketMessage) => {
  if (messageData.receiverId !== userStore.accountId || messageData.senderId !== currentChat.value.id) {
    return
  }
  const newMessage: messageType = {
    senderId: messageData.senderId,
    type: 'other',
    avatar: currentChat.value.avatar,
    name: currentChat.value.name,
    content: messageData.content,
  }
  messages.value.push(newMessage)
  scrollToBottom()
}

// 发送消息（走全局 WebSocket）
const sendMessage = () => {
  if (!inputMessage.value.trim()) return
  if (wsStore.connectionStatus !== 'connected') {
    console.warn('WebSocket未连接，无法发送消息')
    return
  }
  try {
    wsStore.send({
      senderId: userStore.accountId,
      receiverId: currentChat.value.id,
      content: inputMessage.value.trim(),
    })
    const newMessage: messageType = {
      type: 'user',
      avatar: userStore.avatar,
      name: userStore.username,
      senderId: userStore.accountId,
      content: inputMessage.value.trim(),
    }
    messages.value.push(newMessage)
    inputMessage.value = ''
    scrollToBottom()
  } catch (error) {
    console.error('发送消息失败:', error)
  }
}

// 加载历史消息
const loadHistoryMessages = async () => {
  try {
    const res: historyResponseDataType = await reqGetHistory(userStore.accountId, currentChat.value.id)
    if (res.code === 200) {
      const formattedMessages: messageType[] = res.data.map((item) => {
        if (item.senderId === userStore.accountId) {
          return {
            senderId: item.senderId,
            type: 'user',
            avatar: userStore.avatar,
            name: userStore.username,
            content: item.content,
          }
        } else {
          return {
            senderId: item.senderId,
            type: 'other',
            avatar: currentChat.value.avatar,
            name: currentChat.value.name,
            content: item.content,
          }
        }
      })
      messages.value = formattedMessages
      scrollToBottom()
    }
  } catch (error) {
    console.error('加载历史消息失败:', error)
  }
}

onMounted(() => {
  updateCurrentChat()
  if (props.userData) loadHistoryMessages()
  wsStore.registerMessageHandler(handleReceivedMessage)
  // console.log("currentChat.value.id",currentChat.value.id);
})

onUnmounted(() => {
  wsStore.unregisterMessageHandler(handleReceivedMessage)
})

// 滚动到底部
const scrollToBottom = () => {
  const chatContainer = document.getElementById('chat-container')
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight
  }
}

// 处理回车键发送
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

</script>

<template>
  <div class="chat-content">
    <!-- 聊天消息区域 -->
    <div id="chat-container" class="chat-messages">
      <div v-for="message in messages" :key="message.senderId" class="message-item"
        :class="{ 'user-message': message.type === 'user', 'other-message': message.type === 'other' }">
        <img :src="message.avatar" :alt="message.name" class="message-avatar" />
        <div class="message-content">
          <div class="message-header">
            <span class="sender-name">{{ message.name }}</span>
          </div>
          <div class="message-bubble">
            {{ message.content }}
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input-area">
      <div class="input-container">
        <textarea v-model="inputMessage" placeholder="输入消息..." class="message-input" @keypress="handleKeyPress"
          rows="1"></textarea>
        <button class="send-btn" :disabled="!inputMessage.trim() || wsStore.connectionStatus !== 'connected'"
          @click="sendMessage">
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fff8 0%, #f0f8f0 100%);
  border-radius: 0 30px 30px 0;
  overflow: hidden;

  .chat-messages {
    flex: 1 1 auto;
    padding: 20px 25px;
    overflow-y: auto;
    background: #f8fff8;
    min-height: 0;
    /* 关键修复：允许flex子元素收缩 */
    height: 0;
    /* 强制flex容器计算可用空间 */

    .message-item {
      display: flex;
      margin-bottom: 20px;
      animation: fadeIn 0.3s ease;

      &.user-message {
        flex-direction: row-reverse;

        .message-content {
          align-items: flex-end;

          .message-bubble {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            border-radius: 18px 18px 0 18px;
          }
        }
      }

      &.other-message {
        .message-bubble {
          background: white;
          color: #333;
          border: 1px solid #e0e0e0;
          border-radius: 18px 18px 18px 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
      }

      .message-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        margin: 0 12px;
        border: 2px solid #e8f5e8;
      }

      .message-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        max-width: 60%;

        .message-header {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          gap: 10px;

          .sender-name {
            font-size: 14px;
            font-weight: 600;
            color: #4CAF50;
          }
        }

        .message-bubble {
          padding: 12px 16px;
          font-size: 14px;
          line-height: 1.4;
          word-wrap: break-word;
          position: relative;

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            width: 8px;
            height: 8px;
            background: inherit;
          }
        }
      }
    }
  }

  .chat-input-area {
    padding: 20px 25px;
    background: white;
    border-top: 1px solid #e8f5e8;
    flex-shrink: 0;
    /* 关键修复：防止输入区域被压缩 */

    .input-container {
      display: flex;
      align-items: flex-end;
      gap: 12px;

      .message-input {
        flex: 1;
        border: 1px solid #e0e0e0;
        border-radius: 20px;
        padding: 12px 16px;
        font-size: 14px;
        resize: none;
        outline: none;
        transition: all 0.3s ease;
        background: #f8fff8;
        max-height: 120px;

        &:focus {
          border-color: #4CAF50;
          box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
        }

        &::placeholder {
          color: #aaa;
        }
      }

      .send-btn {
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        border: none;
        border-radius: 20px;
        padding: 12px 24px;
        color: white;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 80px;

        &:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
        }

        &:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
      }
    }
  }
}

// 动画效果
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 滚动条样式
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1e1c1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #4CAF50;
}

// 响应式设计
@media (max-width: 768px) {
  .chat-content {
    .chat-messages {
      padding: 15px 20px;

      .message-item {
        .message-content {
          max-width: 70%;
        }
      }
    }

    .chat-input-area {
      padding: 15px 20px;
    }
  }
}
</style>