<script setup lang="ts">
import { constantRoute } from "@/router/routers";
import { useRouter, useRoute } from 'vue-router'
import { computed, ref } from 'vue';
import logoImg from '@/assets/logo/greenGuard.png';

// 接收父组件传递的滚动状态
const props = defineProps<{
    isScrolled: boolean
}>()

const $router = useRouter()
const router = useRouter()
// 获取当前路由实例
const route = useRoute()

const currentPath = computed(() => route.path)

const goRoute = (path: string) => {
    $router.push(path)
}

const navigateToCreate = () => {
    const token = localStorage.getItem('TOKEN') || ''
    if (!token) {
        // 如果没有token，显示登录弹窗
        showLoginDialog.value = true
        return
    }
    router.push({ name: 'mine' })
}

const handleNavClick = (path: string) => {
    if (path === '/mine') {
        navigateToCreate()
    } else {
        goRoute(path)
    }
}

// 控制登录弹窗显示
const showLoginDialog = ref(false)

// 登录成功后的回调
const handleLoginSuccess = () => {
    showLoginDialog.value = false
    router.push({ name: 'envContent' })
}

// 关闭登录弹窗
const handleCloseLogin = () => {
    showLoginDialog.value = false
}

</script>

<template>
    <div class="maxBox">
        <div class="logo">
            <!-- 使用父组件传递的isScrolled状态 -->
            <img class="img" :class="{ 'scrolled': props.isScrolled }" :src="logoImg" alt="">
        </div>
        <div class="nav">
            <!-- 使用v-for循环显示导航项 -->
            <template v-for="item in constantRoute" :key="item.name">
                <!-- 有子路由 -->
                <template v-for="items in item.children" :key="items.path">
                    <div v-if="!items.meta?.hidden" class="item" :class="{ 'active': currentPath === items.path }"
                        @click="handleNavClick(items.path)">
                        <p>{{ items.meta?.title || '' }}</p>
                    </div>
                </template>
            </template>
        </div>

        <!-- 登录弹窗 -->
        <el-dialog v-model="showLoginDialog" width="350px" :before-close="handleCloseLogin" destroy-on-close
            :show-header="false">
            <LoginModule @login-success="handleLoginSuccess" />
        </el-dialog>
    </div>
</template>

<style scoped lang="scss">
.maxBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    background-color: #F8F8F9;

    .logo {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .img {
        margin-top: 20px;
        width: clamp(140px, 16vw, 228px);
        height: auto;
        aspect-ratio: 19 / 7;
        object-fit: contain;
        // 添加过渡效果使样式变化更平滑
        transition: all 0.3s ease;

        // 滚动时的样式
        &.scrolled {
            margin-top: 10px;
            width: clamp(84px, 8vw, 114px);
        }
    }

    .nav {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        width: 450px;

        .item {
            text-align: center;
            cursor: pointer;
            width: 75px;
            font-size: 14px;

            &:hover {
                color: #39B54A;
            }

            // 选中状态的样式
            &.active {
                color: #39B54A;
            }
        }
    }
}

:deep(.el-dialog) {
    padding: 0 !important;
    border-radius: 30px;
    margin-top: 300px;
}

:deep(.el-dialog__body) {
    width: 350px !important;
    padding: 0 !important;
}

:deep(.el-dialog__header) {
    display: none !important;
}
</style>