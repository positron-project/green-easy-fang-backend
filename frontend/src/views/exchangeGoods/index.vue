<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GoodsContent from './goodsContent/index.vue'
import LoginModule from '@/components/loginModule/index.vue'

const router = useRouter()
// 控制登录弹窗显示
const showLoginDialog = ref(false)
// 控制显示状态
const showGoods = ref(false)
// 关闭登录弹窗
const handleCloseLogin = () => {
    showLoginDialog.value = false
}
// 登录成功后的回调
const handleLoginSuccess = () => {
    showLoginDialog.value = false
}

// 使用sessionStorage来存储路由状态
const setRouteState = (fromRoute: string) => {
    sessionStorage.setItem('exchangeGoodsFromRoute', fromRoute)
}

const getRouteState = (): string => {
    return sessionStorage.getItem('exchangeGoodsFromRoute') || ''
}

// 监听路由变化
router.beforeEach((_, from) => {
    // 记录上一个路由的名称到sessionStorage
    if (from.name) {
        setRouteState(from.name as string)
    }
})

// 开始匹配方法
const startMatch = () => {
    const token = localStorage.getItem('TOKEN') || ''
    if (!token) {
        showLoginDialog.value = true
        return
    }
    showGoods.value = true
}

// 上传物品方法
const uploadGoods = () => {
    router.push({ name: 'uploadGoods' })

}

onMounted(() => {
    const fromRoute = getRouteState()

    // 从detailGoods返回时，显示商品列表
    if (fromRoute === 'detailGoods') {
        showGoods.value = true
    } else {
        // 从其他路由跳转时，显示firstContent
        showGoods.value = false
    }

    // 清除状态，为下一次路由跳转做准备
    sessionStorage.removeItem('exchangeGoodsFromRoute')
})
</script>

<template>
    <div class="exchangeGoodsMaxBox">
        <div class="firstContent" v-if="!showGoods">
            <div class="firstContent-inner">
                <h1 class="firstContent-title">环保物品交换平台</h1>
                <p class="firstContent-subtitle">发现身边的环保好物，共建绿色生活社区</p>
                <button class="match-button" @click="startMatch">
                    <span class="button-text">开始匹配附近物品</span>
                    <span class="button-icon">🌱</span>
                </button>
            </div>
        </div>
        <div class="goodsContent" v-else>
            <GoodsContent />
        </div>
        <button v-if="showGoods" class="uploadGoods" title="上传物品" @click="uploadGoods">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            <span>上传</span>
        </button>
        <!-- 登录弹窗 -->
        <el-dialog v-model="showLoginDialog" width="350px" :before-close="handleCloseLogin" destroy-on-close
            :show-header="false">
            <LoginModule @login-success="handleLoginSuccess" />
        </el-dialog>
    </div>
</template>

<style scoped lang="scss">
.exchangeGoodsMaxBox {
    width: 100%;
    height: 100%;
    padding-top: 20px;
    background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 50%, #e8f5e8 100%);
    position: relative;

    .goodsContent {
        width: 1104px;
        min-height: 200px;
        background: rgba(255, 255, 255, 0.95);
        margin: 0 auto;
        border-radius: 20px;
        box-shadow: 0 8px 32px rgba(57, 181, 74, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(57, 181, 74, 0.1);
    }

    .uploadGoods {
        position: fixed;
        top: 92%;
        right: 60px;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: linear-gradient(135deg, #39B54A 0%, #2e8b57 100%);
        color: white;
        border: none;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(57, 181, 74, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;

        &:hover {
            transform: translateY(-50%) scale(1.05);
            box-shadow: 0 6px 20px rgba(57, 181, 74, 0.4);
            background: linear-gradient(135deg, #2e8b57 0%, #39B54A 100%);
        }

        &:active {
            transform: translateY(-50%) scale(0.95);
        }

        svg {
            flex-shrink: 0;
        }

        span {
            white-space: nowrap;
        }
    }
}

.firstContent {
    width: 1024px;
    height: 500px;
    margin: 0 auto;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #39B54A 0%, #2e8b57 50%, #228b22 100%);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, rgba(57, 181, 74, 0.1) 0%, rgba(46, 139, 87, 0.2) 50%, rgba(34, 139, 34, 0.1) 100%);
        z-index: 1;
    }

    .firstContent-inner {
        text-align: center;
        color: white;
        z-index: 2;
        position: relative;
        max-width: 600px;
        padding: 0 20px;
    }

    .firstContent-title {
        font-size: 3.5rem;
        font-weight: bold;
        margin-bottom: 20px;
        text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        animation: fadeInUp 1s ease-out;
    }

    .firstContent-subtitle {
        font-size: 1.3rem;
        margin-bottom: 40px;
        opacity: 0.9;
        line-height: 1.6;
        animation: fadeInUp 1s ease-out 0.3s both;
    }

    .match-button {
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.5);
        color: white;
        padding: 16px 40px;
        font-size: 1.2rem;
        border-radius: 50px;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0 auto;
        animation: fadeInUp 1s ease-out 0.6s both;

        &:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.8);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .button-text {
            font-weight: 600;
        }

        .button-icon {
            font-size: 1.4rem;
        }
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>