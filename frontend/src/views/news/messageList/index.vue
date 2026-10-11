<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { chatListDataType } from '@/api/news/type'
import { reqIsFollowing } from '@/api/news'
import { useWebSocketStore } from '@/store/websocket'

const wsStore = useWebSocketStore()

const props = withDefaults(
    defineProps<{
        chatList: chatListDataType[]
        /** 当前在线的联系人 contactId 列表，用于显示绿点/在线状态 */
        onlineContactIds?: number[]
    }>(),
    { onlineContactIds: () => [] }
)

// 使用WebSocket存储的在线状态
const isOnline = (contactId: number) => wsStore.isUserOnline(contactId)

// 在线状态变化处理
const handleOnlineStatusChange = (_onlineUsers: number[]) => {
}

onMounted(() => {
    wsStore.registerOnlineStatusHandler(handleOnlineStatusChange)
    // 连接后请求在线用户列表
    if (wsStore.connectionStatus === 'connected') {
        wsStore.requestOnlineUsers()
    }
})

onUnmounted(() => {
    wsStore.unregisterOnlineStatusHandler(handleOnlineStatusChange)
})

const emit = defineEmits(['sendUserId', 'updateFollow'])

// 当前选中的聊天项ID
const selectedChatId = ref<number | null>(null)

// 关注/取消关注函数
const toggleFollow = async (item: chatListDataType) => {
    // 通知父组件更新
    emit('updateFollow', item.contactId)
    try {
        await reqIsFollowing(item.contactId);
    } catch (error) {
        console.error('关注/取消关注用户时发生错误:', error);
    }
}

// 选中聊天项函数
const selectChat = (item: chatListDataType) => {
    selectedChatId.value = item.id
    emit('sendUserId', item)
}

// 监听chatList变化，当有数据时默认选中第一个
watch(() => props.chatList, (newChatList) => {
    if (newChatList.length > 0) {
        const firstItem = newChatList[0]
        if (firstItem && firstItem.id != null) {
            // 避免重复触发
            if (selectedChatId.value !== firstItem.id) {
                selectedChatId.value = firstItem.id
                emit('sendUserId', firstItem)
            }
        }
    }
}, {
    immediate: true, // 立即执行一次，处理初始数据
    deep: true       // 深度监听，确保数据变化能被捕获
})

</script>

<template>
    <div class="xbox">
        <div class="title">
            <p>聊天列表</p>
        </div>
        <div class="nav">
            <div v-for="item in props.chatList" :key="item.id" class="list"
                :class="{ 'selected': selectedChatId === item.id }"
                :style="{ backgroundColor: item.isFollowing ? '#F0F8FF' : 'transparent' }" @click="selectChat(item)">
                <div class="img_name">
                    <div class="avatar-wrap">
                        <img class="img" :src="item.contactAvatar" alt="">
                        <span class="status-dot" :class="{ 'online': isOnline(item.contactId) }"></span>
                    </div>
                    <div class="p_name">
                        <div class="name-row">
                            <span class="name">{{ item.contactName }}</span>
                            <span class="online-label" :class="{ 'online': isOnline(item.contactId) }">
                                {{ isOnline(item.contactId) ? '在线' : '离线' }}
                            </span>
                        </div>
                        <button class="follow-btn" :class="{ 'following': item.isFollowing }"
                            @click.stop="toggleFollow(item)">
                            {{ item.isFollowing ? '已关注' : '关注' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.xbox {
    width: 100%;
    height: 100%;

    .title {
        display: flex;
        align-items: center;
        width: 100%;
        height: 50px;

        p {
            margin-left: 25px;
            font-size: 18px;
        }
    }

    .nav {
        width: 100%;
        height: calc(100% - 50px);
        border-radius: 0 0 0 30px;

        .list {
            display: flex;
            align-items: center;
            padding: 0 25px;
            width: 100%;
            height: 80px;
            cursor: pointer;
            transition: all 0.3s ease;
            border-left: 3px solid transparent;

            &:hover {
                background-color: #F5F5F5;
            }

            &.selected {
                background-color: #E8F5E8 !important;
                border-left: 3px solid #4CAF50;
                box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
                transform: translateX(2px);

                .img_name {
                    .img {
                        border: 2px solid #4CAF50;
                    }
                }

                .p_name {
                    .name {
                        color: #2E7D32;
                        font-weight: 600;
                    }
                }
            }

            .img_name {
                display: flex;
                align-items: center;
                width: 70%;
                height: 100%;

                .avatar-wrap {
                    position: relative;
                    margin-right: 8px;
                }

                .img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color: azure;
                    object-fit: cover;
                }

                .status-dot {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    border: 2px solid #fff;
                    background: #c0c0c0;
                }

                .status-dot.online {
                    background: #4CAF50;
                }

                .p_name {
                    flex: 1;
                    display: flex;
                    padding: 20px 0;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;

                    .name-row {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }

                    .name {
                        font-size: 14px;
                    }

                    .online-label {
                        font-size: 11px;
                        color: #999;
                    }

                    .online-label.online {
                        color: #4CAF50;
                    }

                    .follow-btn {
                        border: 1px solid #4CAF50;
                        background: white;
                        color: #4CAF50;
                        border-radius: 15px;
                        font-size: 12px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        width: 50px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        &:hover {
                            background: #4CAF50;
                            color: white;
                            transform: scale(1.05);
                        }

                        &.following {
                            background: #4CAF50;
                            color: white;
                            border-color: #4CAF50;
                        }
                    }
                }
            }

            .pic {
                width: 55px;
                height: 55px;
                border-radius: 10px;
                background-color: bisque;
                object-fit: cover;
            }

        }
    }
}
</style>