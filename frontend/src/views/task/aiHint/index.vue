<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import aiAvatar from '@/assets/aiPeople/envProtectionAss.png'
import type { aiHintMessageType } from '@/api/task/type'
import useUserStore from '@/store/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

const props = defineProps<{
    initialTitle: string
    messages: aiHintMessageType[]
}>()

// 请求状态控制
const isRequesting = ref(false)

// 监听initialTitle变化，自动发送消息
watch(() => props.initialTitle, (newTitle, oldTitle) => {
    // 只有当新值不为空且与旧值不同时才发送消息
    if (newTitle && newTitle.trim() && newTitle !== oldTitle && !isRequesting.value) {
        // 延迟发送，确保组件已经渲染完成
        setTimeout(() => {
            const userMessage = ref<aiHintMessageType>({
                id: messages.value.length + 1,
                type: 'user',
                name: userStore.username || '环保卫士',
                avatar: userStore.avatar,
                content: newTitle,
            })
            messages.value.push(userMessage.value)
            // 自动发送消息
            sendMessageToServer(newTitle)
        }, 50)
    }
}, {
    immediate: true // 立即执行一次，处理初始值
})

// 对话数据
const messages = ref<aiHintMessageType[]>([
])

// 用户输入
const userInput = ref('')

// 发送消息
const sendMessage = () => {
    const token = localStorage.getItem("TOKEN") || '';
    if (!token) {
        ElMessage.error('请先登录')
        return
    }
    if (!userInput.value.trim() || isRequesting.value) return

    // 添加用户消息
    const userMessage = ref<aiHintMessageType>({
        id: messages.value.length + 1,
        type: 'user',
        name: userStore.username,
        avatar: userStore.avatar,
        content: userInput.value,
    })
    messages.value.push(userMessage.value)

    // 清空输入框
    const inputContent = userInput.value
    userInput.value = ''

    sendMessageToServer(inputContent)
    scrollToBottom()
}

// 发送消息到后端（支持 SSE 流式响应）
const sendMessageToServer = async (content: string) => {
    // 检查是否已有请求在进行中
    if (isRequesting.value) {
        console.warn('已有请求在进行中，忽略重复请求')
        return
    }

    // 设置请求状态
    isRequesting.value = true

    // 创建AI消息占位符
    const aiMessageId = messages.value.length + 1
    const aiMessage: aiHintMessageType = {
        id: aiMessageId,
        type: 'ai',
        name: '小绿',
        avatar: aiAvatar,
        content: '小绿正在思考...',
    }
    messages.value.push(aiMessage)
    scrollToBottom()
    const token = localStorage.getItem("TOKEN") || '';
    // 修改为路径参数格式，与后端接口匹配
    const eventSource = new EventSource(`/api/ai/chat/stream/${userStore.accountId}/${encodeURIComponent(content)}/${encodeURIComponent(token)}`)

    let accumulatedContent = ''

    // SSE 连接建立
    eventSource.onopen = () => {
        // 更新消息状态
        const messageIndex = messages.value.findIndex(msg => msg.id === aiMessageId)
        if (messageIndex !== -1) {
            if (messages.value[messageIndex]) {
                messages.value[messageIndex].content = '小绿正在回答...'
            }
            scrollToBottom()
        }
    }

    // SSE 消息接收
    eventSource.onmessage = (event) => {
        try {
            // 后端返回的是纯文本流，直接累积内容
            const data = event.data

            // 累积消息内容
            accumulatedContent += data

            // 实时更新消息内容
            const messageIndex = messages.value.findIndex(msg => msg.id === aiMessageId)
            if (messageIndex !== -1) {
                if (messages.value[messageIndex]) {
                    // 将换行符 \\n 转换为 HTML 换行标签 <br>
                    messages.value[messageIndex].content = accumulatedContent.replace(/\n/g, '<br>')
                }
                scrollToBottom()
            }
        } catch (error) {
            // 如果处理失败，尝试直接使用原始数据
            accumulatedContent += event.data
            const messageIndex = messages.value.findIndex(msg => msg.id === aiMessageId)
            if (messageIndex !== -1) {
                if (messages.value[messageIndex]) {
                    messages.value[messageIndex].content = accumulatedContent
                }
                scrollToBottom()
            }
        }
    }

    // SSE 错误处理（包含连接关闭检测和流完成检测）
    eventSource.onerror = () => {
        // 关闭连接
        eventSource.close()
        // 重置请求状态
        isRequesting.value = false
    }
}

// 滚动到底部
const scrollToBottom = () => {
    const container = document.querySelector('.messages-container')
    if (container) {
        container.scrollTop = container.scrollHeight
    }
}

onMounted(() => {
    messages.value = props.messages
})

</script>

<template>
    <div class="aiHintMaxBox">
        <!-- 聊天头部 -->
        <div class="chat-header">
            <div class="ai-info">
                <img :src="aiAvatar" alt="小绿" class="header-avatar">
                <div class="ai-details">
                    <div class="ai-name">小绿 - 环保助手</div>
                </div>
            </div>
        </div>

        <!-- 消息列表 -->
        <div class="messages-container">
            <div v-for="message in messages" :key="message.id" class="message"
                :class="{ 'user-message': message.type === 'user', 'ai-message': message.type === 'ai' }">
                <div class="message-avatar">
                    <img :src="message.avatar" :alt="message.name" />
                </div>
                <div class="message-content">
                    <div class="message-info">
                        <span class="message-name">{{ message.name }}</span>
                    </div>
                    <div class="message-text" v-html="message.content"></div>
                </div>
            </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-container">
            <el-input v-model="userInput" placeholder="输入你想了解的环保问题..." @keyup.enter="sendMessage" class="message-input">
                <template #append>
                    <el-button @click="sendMessage" type="success" :disabled="!userInput.trim()">
                        <p style=" color: #3c763d; font-size: 14px; font-weight: 600;">发送</p>
                    </el-button>
                </template>
            </el-input>
        </div>
    </div>
</template>

<style scoped lang="scss">
.aiHintMaxBox {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.chat-header {
    padding: 16px 20px;
    background: linear-gradient(90deg, #1e7e34, #39B54A);
    color: white;
    border-radius: 8px 8px 0 0;

    .ai-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .header-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid white;
        }

        .ai-details {
            .ai-name {
                font-size: 16px;
                font-weight: 600;
            }
        }
    }
}

.messages-container {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;

    &::-webkit-scrollbar {
        display: none;
    }

    .message {
        display: flex;
        gap: 12px;
        max-width: 80%;

        &.user-message {
            align-self: flex-end;
            flex-direction: row-reverse;

            .message-content {
                background: linear-gradient(135deg, #39B54A, #6edc8c);
                color: white;

                .message-info {
                    justify-content: flex-end;
                }
            }
        }

        &.ai-message {
            align-self: flex-start;

            .message-content {
                background: white;
                border: 1px solid #e0e0e0;
            }
        }

        .message-avatar {
            img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: cover;
            }
        }

        .message-content {
            padding: 12px 16px;
            border-radius: 18px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

            .message-info {
                display: flex;
                align-items: center;
                margin-bottom: 4px;

                .message-name {
                    font-size: 12px;
                    font-weight: 600;
                }
            }

            .message-text {
                font-size: 14px;
                line-height: 1.4;
                word-break: break-word;
                text-align: left;
            }
        }
    }
}

.input-container {
    padding: 20px;
    border-top: 1px solid #e0e0e0;
    background: white;

    .message-input {
        .el-input-group__append {
            background: #39B54A;
            border-color: #39B54A;

            .el-button {
                color: white;

                &:hover {
                    background: #5BCE74;
                }
            }
        }
    }
}
</style>