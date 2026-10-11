<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { reqCommentData } from '@/api/forum'
import type { commentDataType, commentResponseDataType, sendCommentDataType } from '@/api/forum/type'
import { reqSendComment } from '@/api/forum'
import useUserStore from '@/store/user'
import { formatEnvContentDate } from '@/utils/formatDate'
import img02 from '@/assets/loading.jpg'

const userStore = useUserStore()

// 接收父组件传递的评论id
const props = defineProps({
    commentId: Number
})

const commentData = reactive<commentDataType[]>([
])

// 评论内容响应式数据
const commentText = ref('')
// textarea引用
const textareaRef = ref<HTMLTextAreaElement>()
// 容器引用
const commentAreaRef = ref<HTMLDivElement>()
const commentTotal = ref<number>(0)

const getCommentData = async () => {
    // 检查commentId是否有效
    if (!props.commentId || props.commentId <= 0) {
        console.warn('无效的评论ID:', props.commentId);
        return;
    }

    try {
        const res: commentResponseDataType = await reqCommentData(props.commentId)
        if (res.code === 200 && res.data) {
            commentData.splice(0, commentData.length, ...res.data.data)
            commentTotal.value = res.data.total
        } else {
            console.error('获取评论数据失败:', res.message);
        }
    } catch (error) {
        console.error('请求评论数据时发生错误:', error);
    }
}

// 监听props.commentId变化，确保准确触发数据获取
watch(() => props.commentId, (newCommentId) => {
    // 确保只有在新ID有效且不为空时才触发请求
    if (newCommentId) {
        getCommentData()
    }
}, {
    immediate: true, // 组件挂载时立即执行一次
    deep: true // 深度监听确保对象变化也能被捕获
})

// 自动调整textarea高度的函数
const autoResize = () => {
    if (textareaRef.value) {
        // 重置高度以获取正确的scrollHeight
        textareaRef.value.style.height = 'auto'
        // 设置新高度为scrollHeight
        textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
    }
}

// 发送评论的函数
const sendComment = () => {
    // 这里可以添加发送评论的逻辑
    if (!commentText.value.trim()) {
        ElMessage.warning('请输入评论内容')
        return
    }

    const sendData: sendCommentDataType = {
        userName: userStore.username,
        userHeadImg: userStore.avatar,
        address: userStore.region,
        userId: userStore.id,
        postId: props.commentId!,
        content: commentText.value.trim()
    }

    // 发送评论
    sendCommentData(sendData)
    // console.log('发送评论:', commentText.value)
    // 发送后清空输入框并重置高度
    commentText.value = ''
    nextTick(() => {
        if (textareaRef.value) {
            textareaRef.value.style.height = 'auto'
        }
    })
}

const sendCommentData = async (sendData: sendCommentDataType) => {
    try {
        const res = await reqSendComment(sendData)
        console.log('发送评论响应:', res);
        if (res.code === 200) {
            ElMessage.success('评论发送成功')
            // 刷新评论数据
            getCommentData()
        } else {
            ElMessage.error(res.message || '评论发送失败')
        }
    } catch (error) {
        console.error('发送评论时发生错误:', error);
    }
}

// 自定义滚轮速度处理函数
const handleWheel = (e: WheelEvent) => {
    if (!commentAreaRef.value) return

    // 阻止默认滚动行为
    e.preventDefault()

    // 计算新的滚动位置 - 设置滚动速度倍率为3（可以根据需要调整）
    const multiplier = 3
    const scrollAmount = e.deltaY * multiplier

    // 应用自定义滚动
    commentAreaRef.value.scrollTop += scrollAmount
}

// 组件挂载时添加事件监听
onMounted(() => {
    if (commentAreaRef.value) {
        // 启用被动监听以提高性能，但在需要阻止默认行为时设置为false
        commentAreaRef.value.addEventListener('wheel', handleWheel, { passive: false })
    }
    // getCommentData()
})

// 组件卸载时移除事件监听，防止内存泄漏
onUnmounted(() => {
    if (commentAreaRef.value) {
        commentAreaRef.value.removeEventListener('wheel', handleWheel)
    }
})
</script>

<template>
    <div class="commentAreaWrapper" ref="commentAreaRef">
        <div class="selfHeadImg_input">
            <img style="width: 40px; height: 40px; object-fit: cover; border-radius: 3px;"
                :src="img02" alt="">
            <textarea class="textarea" placeholder="让观点如清洁能源，让对话滋养共生" style="flex: 1; margin: 0 10px;" rows="1"
                v-model="commentText" @input="autoResize" ref="textareaRef"></textarea>
            <button style="background-color: #39B54A;" class="sendButton" @click="sendComment">发送</button>
        </div>
        <div class="commentList">
            <div class="commemtTotal">
                <p>{{ commentTotal }} 条评论</p>
            </div>
            <div v-for="item in commentData" :key="item.id" class="commentItem">
                <img style="width: 24px; height: 24px; object-fit: cover; border-radius: 1px; margin-right: 10px;"
                    :src="item.userHeadImg" alt="">
                <div class="userIssue">
                    <div style="margin-bottom: 4px; color: rgb(55, 58, 64); font-weight: bold; font-size: 15px;"
                        class="userName">{{ item.userName }}
                    </div>
                    <div style="margin-bottom: 4px; color: rgb(55, 58, 64); font-size: 15px;line-height: 21px;"
                        class="commentContent">
                        {{ item.content }}
                    </div>
                    <div style="display: flex; align-items: center; font-size: 14px; color: rgb(145, 150, 161);"
                        class="commentTime_area">
                        <div class="time">{{ formatEnvContentDate(item.createTime) }}</div>
                        <div class=""> · </div>
                        <div class="area">{{ item.address }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.commentAreaWrapper {
    width: 100%;
    height: 100%;
    padding: 10px;
    border: 1px solid #EBECED;
    overflow-y: auto;
    background-color: #fff;
    -ms-overflow-style: none;
    scrollbar-width: none;

    /* 优化滚动性能 */
    scroll-behavior: auto;
    /* 确保不会有默认的平滑滚动延迟 */
    -webkit-overflow-scrolling: touch;
    /* 改善移动设备上的滚动体验 */

    .selfHeadImg_input {
        display: flex;
        align-items: flex-start;
        /* 调整为顶部对齐，以便textarea自动调整时按钮位置正确 */
        gap: 10px;
        /* 增加元素间间距 */
        padding: 10px 0;
        /* 增加上下内边距 */

        .textarea {
            min-height: 40px;
            max-height: 120px;
            /* 设置最大高度限制 */
            border-radius: 3px;
            border: 1px solid #ccc;
            padding: 8px;
            resize: none;
            /* 禁用手动调整大小 */
            font-family: inherit;
            font-size: 14px;
            line-height: 1.5;
            overflow-y: auto;
            box-sizing: border-box;
        }

        /* 隐藏textarea的滚动条，同时保留滚动功能 */
        .textarea::-webkit-scrollbar {
            display: none;
        }

        .textarea {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        .sendButton {
            height: 40px;
            padding: 0 15px;
            background-color: #1890ff;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 14px;
            flex-shrink: 0;
            /* 防止按钮被压缩 */
        }

        .sendButton:hover {
            background-color: #40a9ff;
        }
    }

    .commentList {
        width: 100%;
        margin-top: 10px;
        border: 1px solid #EBECED;
        border-radius: 3px;

        .commemtTotal {
            width: 100%;
            height: 54px;
            line-height: 54px;
            padding-left: 20px;
            border-bottom: 1px solid rgb(235, 236, 237);

            p {
                font-size: 15px;
                color: rgb(55, 58, 64);
                font-weight: 600;
            }
        }

        .commentItem {
            display: flex;
            align-items: flex-start;
            width: 100%;
            min-height: 0;
            padding: 10px 0 14px 20px;
            box-sizing: border-box;

            .userIssue {
                flex: 1;
                min-width: 0;
            }
        }
    }
}
</style>