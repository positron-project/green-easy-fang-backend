<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TaskList from './taskList/index.vue'
import AiHint from './aiHint/index.vue'
import DIY from './DIY/index.vue'
import type { aiHintMessageType, aiHistoryDataResponesDataType } from '@/api/task/type'
import { reqAiHistory } from '@/api/task'
import useUserStore from '@/store/user'
import aiAvatar from '@/assets/aiPeople/envProtectionAss.png'
import taskLogoImg from '@/assets/logo/task_logo.png'
import diyLogoImg from '@/assets/logo/DIY_logo.png'

const userStore = useUserStore()
const dialogVisible = ref(false)
const aiHintTitle = ref('')
// 对话数据
const messagesHistory = ref<aiHintMessageType[]>([
])

const wakeUpAi = (title: string) => {
    dialogVisible.value = true
    aiHintTitle.value = title
}

// 获取智能助手历史记录
const getAiHistory = async () => {
    try {
        const res: aiHistoryDataResponesDataType = await reqAiHistory(userStore.accountId)
        if (res.code === 200) {
            messagesHistory.value = res.data.map((item, index) => ({
                id: index + 1,
                type: item.type as 'user' | 'ai',
                name: item.type === 'user' ? userStore.username : '小绿',
                avatar: item.type === 'user' ? userStore.avatar : aiAvatar,
                content: item.text,
            }))
        }
    } catch (error) {
        console.error('获取智能助手历史记录失败:', error)
    }
}

onMounted(() => {
    getAiHistory()
})

</script>

<template>
    <div class="taskMaxBox">
        <div class="envTaskHead">
            <img style="width: 47px; height: 80px;" :src="taskLogoImg" alt="">
            <div style="font-size: 28px; font-weight: 600; line-height: 32px; margin-top: 10px;">
                规划、行动、改变
            </div>
            <div style="font-size: 18px; font-weight: 400; line-height: 32px; margin-top: 10px; width: 500px;">
                以一份绿色、低碳的日程安排开启美好一天，让每个微小的选择，共同守护地球的未来。
            </div>
        </div>
        <div class="envTaskContent">
            <TaskList @wakeUpAi="wakeUpAi"></TaskList>
        </div>
        <div @click="dialogVisible = true" class="aiHint">
            <img style="width: 100%; height: 100%; object-fit: cover;" :src="aiAvatar" alt="">
        </div>
        <el-dialog v-model="dialogVisible" width="700">
            <template #footer>
                <div style="width: 100%; height: 500px;" class="dialog-footer">
                    <AiHint :initial-title="aiHintTitle" :messages="messagesHistory"></AiHint>
                </div>
            </template>
        </el-dialog>
        <div class="taskDIYMaxBox">
            <div class="DIYHead" style="display: flex; flex-direction: column; align-items: center;">
                <img style="width: 160px; height: 93px; margin-bottom: 15px;" :src="diyLogoImg"
                    alt="">
                <div style="font-size: 28px; font-weight: 600; line-height: 32px; margin-top: 10px;">
                    你自己试试看吧，你能做到的!
                </div>
                <div style="font-size: 18px; font-weight: 400; line-height: 32px; margin-top: 10px;">
                    无数DIY达人的经验证明，定期记录自己的制作历程能大幅提升完成作品的成功率。
                </div>
            </div>
            <div class="DIYContent">
                <DIY></DIY>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.taskMaxBox {
    width: 100%;
    min-height: 200px;
    padding-top: 20px;
    position: relative;

    .envTaskHead {
        width: 1024px;
        min-height: 200px;
        margin: 0 auto;
    }

    .envTaskContent {
        width: 1024px;
        min-height: 200px;
        margin: 15px auto;
        background: linear-gradient(to right, #1e7e34, #39B54A, #6edc8c);
        border-radius: 20px;
    }

    .aiHint {
        position: fixed;
        top: 640px;
        right: 100px;
        width: 150px;
        height: 150px;
        z-index: 1000;
    }

    .taskDIYMaxBox {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        min-height: 500px;
        background: linear-gradient(to bottom left, #b4d5f4, #cce7f9, #eaeff2);
        border-radius: 40px 40px 0 0;
        padding-top: 30px;

        .DIYContent {
            width: 1024px;
            min-height: 200px;
            margin: 20px auto;
        }
    }
}
</style>