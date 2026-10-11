<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChatContent from './chatContent/index.vue'
import MessageList from './messageList/index.vue'
import type { chatListDataType, chatListDataResponseDataType } from '@/api/news/type'
import { reqChatListData } from '@/api/news'
import useUserStore from '@/store/user'
import { useWebSocketStore } from '@/store/websocket'

const userStore = useUserStore();
const wsStore = useWebSocketStore();
const selectedUserData = ref<chatListDataType>()

const chatListData = ref<chatListDataType[]>([])

// 获取聊天列表数据
const getChatListData = async () => {
  try {
    const res: chatListDataResponseDataType = await reqChatListData(userStore.accountId);
    if (res.code == 200 && res.data) {
      chatListData.value = res.data;
      console.log("chatListData.value",chatListData.value);
    }
  } catch (error) {
    console.error('请求聊天列表数据时发生错误:', error);
  }
}

// 更新关注状态函数
const updateFollow = (userId: number) => {
  const user = chatListData.value.find(item => item.contactId === userId);
  if (user) {
    user.isFollowing = !user.isFollowing;
  }
}

// 选中的用户数据
const sendUserId = (userData: chatListDataType) => {
  selectedUserData.value = userData
}

// 组件挂载时获取聊天列表数据并连接WebSocket
onMounted(() => {
  const token = localStorage.getItem('TOKEN')
  if (token && userStore.accountId) {
    getChatListData();
    // 连接WebSocket（全局单例，如果已连接则复用）
    wsStore.connect(userStore.accountId)
  }
});

// 注意：WebSocket连接是全局的，不应该在组件卸载时断开
// 连接会在应用级别统一管理（如用户退出登录时）

</script>

<template>
  <div class="box">
    <div class="news">
      <div class="message">
        <MessageList :chatList="chatListData" @sendUserId="sendUserId" @updateFollow="updateFollow" />
      </div>
      <div class="content">
        <ChatContent :userData="selectedUserData" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  padding-top: 30px;
  background-color: #DCDCDC;
  display: flex;
  justify-content: center;

  .news {
    display: flex;
    width: 70%;
    height: 90%;
    border-radius: 15px;
    background-color: #fff;

    .message {
      width: 25%;
      height: 100%;
    }

    .content {
      width: 75%;
      height: 100%;
      border-radius: 0 30px 30px 0;
    }
  }
}
</style>