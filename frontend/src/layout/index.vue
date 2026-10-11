<script setup lang="ts">
import Navbar from '@/layout/navbar/index.vue'
import Main from '@/layout/main/index.vue'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import useUserStore from '@/store/user'
import { useWebSocketStore } from '@/store/websocket'

const userStore = useUserStore()
const wsStore = useWebSocketStore()

const tryConnect = () => {
    const token = localStorage.getItem('TOKEN')
    const accountId = Number(userStore.accountId) || 0
    if (token && accountId > 0) {
        wsStore.connect(accountId)
    } else {
        wsStore.disconnect()
    }
}

// 登录态变化时建立/关闭 WebSocket，整站保持一条连接
watch(
    () => [userStore.accountId, localStorage.getItem('TOKEN')] as const,
    () => tryConnect(),
    { immediate: true }
)

// 挂载时再尝试一次，避免 watch 早于 getUserInfo 完成
onMounted(() => {
    tryConnect()
})

// 创建响应式状态来跟踪是否已滚动
const isScrolled = ref(false)

// 处理滚动事件的函数
const handleScroll = () => {
    // 使用requestAnimationFrame确保平滑过渡
    requestAnimationFrame(() => {
        isScrolled.value = window.scrollY > 50;
    });
}

// 组件挂载时添加滚动监听
onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    // 初始化时检查一次滚动位置
    handleScroll()
})

// 组件卸载时移除滚动监听
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
    <div class="layout_container">
        <!-- 使用动态class绑定滚动状态，并将状态传递给navbar -->
        <div class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
            <navbar :is-scrolled="isScrolled"></navbar>
        </div>
        <!-- main区域的margin-top也要根据navbar高度动态调整 -->
        <div class="main" :class="{ 'main-scrolled': isScrolled }">
            <Main></Main>
        </div>
    </div>
</template>

<style scoped lang="scss">
.layout_container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;

    .navbar {
        width: 100%;
        height: 180px;
        flex-shrink: 0;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        // 添加过渡效果使高度变化更平滑
        transition: height 0.3s ease;

        // 滚动后的样式
        &.navbar-scrolled {
            height: 100px;
        }
    }

    .main {
        flex: 1;
        // 初始margin-top与navbar高度一致
        margin-top: 180px;
        // 添加过渡效果使margin变化更平滑
        transition: margin-top 0.3s ease;

        // 滚动后调整margin-top以适应navbar新高度
        &.main-scrolled {
            margin-top: 100px;
        }
    }
}
</style>