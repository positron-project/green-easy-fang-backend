<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { taskListDataType } from '@/api/task/type'
import { reqGetTaskList } from '@/api/task'
import type { taskListDataResponesDataType } from '@/api/task/type'
import { ElMessageBox } from 'element-plus'

// 定义子传父事件
const emit = defineEmits<{
    wakeUpAi: [title: string]
}>()


// 任务数据数组
const taskListData = ref<taskListDataType>({
    commonList: [
        { id: 1, title: '节约用水', accomplishText: '节约用水是一种简单而有效的方式，通过减少不必要的用水，来节省成本并保护环境。' },
        { id: 2, title: '垃圾分类', accomplishText: '垃圾分类是一种简单而有效的方式，通过将不同的物品分类，来减少环境污染。' },
        { id: 3, title: '减少用电', accomplishText: '减少用电是一种简单而有效的方式，通过减少不必要的用电，来节省成本并保护环境。' },
        { id: 4, title: '绿色出行', accomplishText: '绿色出行是一种简单而有效的方式，通过选择绿色交通方式，来减少环境污染。' },
        { id: 5, title: '植树造林', accomplishText: '植树造林是一种简单而有效的方式，通过植树造林，来保护环境。' }
    ],
    notSpotList: [
        { id: 6, title: '减少交通', accomplishText: '减少交通是一种简单而有效的方式，通过减少不必要的交通，来节省成本并保护环境。' },
        { id: 7, title: '节约用水', accomplishText: '节约用水是一种简单而有效的方式，通过减少不必要的用水，来节省成本并保护环境。' },
        { id: 8, title: '垃圾分类', accomplishText: '垃圾分类是一种简单而有效的方式，通过将不同的物品分类，来减少环境污染。' },
        { id: 9, title: '减少用电', accomplishText: '减少用电是一种简单而有效的方式，通过减少不必要的用电，来节省成本并保护环境。' },
        { id: 10, title: '绿色出行', accomplishText: '绿色出行是一种简单而有效的方式，通过选择绿色交通方式，来减少环境污染。' },
        { id: 11, title: '植树造林', accomplishText: '植树造林是一种简单而有效的方式，通过植树造林，来保护环境。' }
    ],
    hideList: [
        { id: 12, title: '减少交通', accomplishText: '减少交通是一种简单而有效的方式，通过减少不必要的交通，来节省成本并保护环境。' },
        { id: 13, title: '节约用水', accomplishText: '节约用水是一种简单而有效的方式，通过减少不必要的用水，来节省成本并保护环境。' },
        { id: 14, title: '垃圾分类', accomplishText: '垃圾分类是一种简单而有效的方式，通过将不同的物品分类，来减少环境污染。' },
        { id: 15, title: '减少用电', accomplishText: '减少用电是一种简单而有效的方式，通过减少不必要的用电，来节省成本并保护环境。' },
        { id: 16, title: '绿色出行', accomplishText: '绿色出行是一种简单而有效的方式，通过选择绿色交通方式，来减少环境污染。' },
        { id: 17, title: '植树造林', accomplishText: '植树造林是一种简单而有效的方式，通过植树造林，来保护环境。' }
    ]
})

// 使用对象存储所有按钮的状态
const buttonStates = ref<Record<number, number>>({})

// 为每个按钮创建状态管理函数
const getButtonState = (buttonId: number) => {
    if (!buttonStates.value[buttonId]) {
        buttonStates.value[buttonId] = 0
    }

    const clickCount = buttonStates.value[buttonId]

    if (clickCount === 0) return 'default'
    if (clickCount === 1) return 'first'
    if (clickCount === 2) return 'second'
    return 'disabled'
}

const isButtonDisabled = (buttonId: number) => {
    return (buttonStates.value[buttonId] || 0) >= 3
}

const getButtonText = (buttonId: number) => {
    const clickCount = buttonStates.value[buttonId] || 0

    if (clickCount === 0) return '去完成'
    if (clickCount === 1) return '完成'
    if (clickCount === 2) return '已完成'
    return '已结束'
}

// 显示任务完成提示框
const showTaskCompletionDialog = (buttonId: number) => {
    // 查找对应的任务数据
    const allTasks = [
        ...taskListData.value.commonList,
        ...taskListData.value.notSpotList,
        ...taskListData.value.hideList
    ]
    const task = allTasks.find(t => t.id === buttonId)

    if (task && task.accomplishText) {
        // 弹出提示框显示任务完成信息
        ElMessageBox.alert(task.accomplishText, '任务完成')
    }
}

// 唤醒小绿AI,给用户提示
const wakeUpGreenAI = (buttonId: number) => {
    const allTasks = [
        ...taskListData.value.commonList,
        ...taskListData.value.notSpotList,
        ...taskListData.value.hideList
    ]
    const task = allTasks.find(t => t.id === buttonId)

    if (task) {
        const title = '怎么' + task.title
        // 子传父：向父组件发射事件
        emit('wakeUpAi', title)
    }
}

const handleButtonClick = (buttonId: number) => {
    if (isButtonDisabled(buttonId)) return

    const oldClickCount = buttonStates.value[buttonId] || 0
    buttonStates.value[buttonId] = oldClickCount + 1

    const newClickCount = buttonStates.value[buttonId]

    if (oldClickCount === 0 && newClickCount === 1) {
        // 唤醒小绿AI,给用户提示
        wakeUpGreenAI(buttonId)
    } else if (oldClickCount === 1 && newClickCount === 2) {
        // 当用户完成任务时（从"完成"状态变为"已完成"状态）弹出提示框
        showTaskCompletionDialog(buttonId)
    }
}

const getTaskListData = async () => {
    try {
        const res: taskListDataResponesDataType = await reqGetTaskList()
        if (res.code === 200) {
            taskListData.value = res.data
        }
    } catch (error) {
        console.log(error);
    }
}



onMounted(() => {
    getTaskListData()
})

</script>

<template>
    <div class="taskListMaxBox">
        <div class="commonTask">
            <div class="taskTitle">
                举手之劳
            </div>
            <div class="TaskList" v-for="task in taskListData.commonList" :key="task.id">
                <div class="title">{{ task.title }}</div>
                <button class="task-btn" :class="getButtonState(task.id)" @click="handleButtonClick(task.id)"
                    :disabled="isButtonDisabled(task.id)">{{ getButtonText(task.id) }}
                </button>
            </div>
        </div>
        <div class="notSpotTask">
            <div style="background-color: #F16110;" class="taskTitle">
                微小改变
            </div>
            <div style="border: 2px solid #F16110;" class="TaskList" v-for="task in taskListData.notSpotList"
                :key="task.id">
                <div class="title">{{ task.title }}</div>
                <button class="task-btn" :class="getButtonState(task.id)" @click="handleButtonClick(task.id)"
                    :disabled="isButtonDisabled(task.id)">{{ getButtonText(task.id) }}
                </button>
            </div>
        </div>
        <div class="hideTask">
            <div style="background-color: #8129F1;" class="taskTitle">
                隐藏任务
            </div>
            <div style="border: 2px solid #8129F1;" class="TaskList" v-for="task in taskListData.hideList"
                :key="task.id">
                <div class="title">{{ task.title }}</div>
                <button class="task-btn" :class="getButtonState(task.id)" @click="handleButtonClick(task.id)"
                    :disabled="isButtonDisabled(task.id)">{{ getButtonText(task.id) }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.taskListMaxBox {
    width: 100%;
    min-height: 200px;
    display: flex;
    // background-color: transparent;
}

.commonTask,
.notSpotTask,
.hideTask {
    flex: 1;
    min-height: 100px;
    padding: 20px;

    .taskTitle {
        width: 100%;
        height: 48px;
        margin-bottom: 26px;
        padding-left: 20px;
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        line-height: 48px;
        border-radius: 12px;
        background-color: #1085f1;
    }

    .TaskList {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 48px;
        margin-top: 18px;
        border: 2px solid #1085f1;
        border-radius: 10px;
        padding: 0 20px;

        .title {
            font-size: 18px;
            font-weight: 600;
        }

        .task-btn {
            border: none;
            width: 70px;
            border-radius: 6px;
            padding: 8px 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 12px;
        }

        /* 默认状态 - 绿色 */
        .task-btn.default {
            background-color: #39B54A;
            color: white;

            &:hover {
                background-color: #2e8b3d;
            }

            &:active {
                background-color: #247830;
            }
        }

        /* 第一次点击状态 - 橙色 */
        .task-btn.first {
            background-color: #F16110;
            color: white;

            &:hover {
                background-color: #d9530f;
            }

            &:active {
                background-color: #b8450c;
            }
        }

        /* 第二次点击状态 - 紫色 */
        .task-btn.second {
            background-color: #8129F1;
            color: white;

            &:hover {
                background-color: #6a1bb5;
            }

            &:active {
                background-color: #531593;
            }
        }

        /* 禁用状态 - 灰色 */
        .task-btn.disabled {
            background-color: #cccccc;
            color: #666666;
            cursor: not-allowed;

            &:hover,
            &:active {
                background-color: #cccccc;
            }
        }
    }
}
</style>