<script setup lang="ts">
import { EditPen, Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import LoginModule from '@/components/loginModule/index.vue'

const router = useRouter()

// 控制登录弹窗显示
const showLoginDialog = ref(false)

const navigateToCreate = async () => {
    const token = localStorage.getItem('TOKEN') || ''
    if (!token) {
        // 如果没有token，显示登录弹窗
        showLoginDialog.value = true
        return
    }
    router.push({ name: 'forumCreate' })
}

// 登录成功后的回调
const handleLoginSuccess = () => {
    showLoginDialog.value = false
    // 登录成功后跳转到创作页面
    router.push({ name: 'forumCreate' })
}

// 关闭登录弹窗
const handleCloseLogin = () => {
    showLoginDialog.value = false
}

</script>

<template>
    <div class="creativeMaxBox">
        <div class="creativeCenter">
            <div class="icon_icon_creativeTitle">
                <el-icon>
                    <EditPen />
                </el-icon>
                <div style="margin-left: 5px;" class="creativeTitleText">
                    创作中心
                </div>
            </div>
            <div class="creativePredicative">
                <div style="font-size: 15px; line-height: 21px;" class="text_1">开启你的绿易坊创作之旅</div>
                <div style="font-size: 12px; color: rgb(145, 150, 161); margin-top: 6px;" class="text_1">快来成为环保创作者吧～
                </div>
            </div>
            <div @click="navigateToCreate" class="creativeButton">
                <div style="display: flex;" class="icon_buttonText">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    <div style="margin-left: 5px;" class="buttonText">
                        开始创作
                    </div>
                </div>
            </div>
        </div>

        <!-- 登录弹窗 -->
        <el-dialog v-model="showLoginDialog" width="350px" :before-close="handleCloseLogin" destroy-on-close
            :show-header="false">
            <LoginModule @login-success="handleLoginSuccess" />
        </el-dialog>
    </div>
</template>

<style scoped lang="scss">
.creativeMaxBox {
    width: 100%;
    // height: 100%;
    background-color: #F4F6F5;

    .creativeCenter {
        width: 100%;
        height: 196px;
        padding: 0 14px;

        .icon_icon_creativeTitle {
            width: 100%;
            height: 52px;
            display: flex;
            align-items: center;

        }

        .creativePredicative {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 100%;
            height: 68px;
            padding: 0 14px;
            margin-bottom: 16px;
            background-color: #F9F9FA;
        }

        .creativeButton {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            width: 100%;
            height: 40px;
            border-radius: 4px;
            font-size: 14px;
            color: #39B54A;
            border: 1px solid #39B54A;

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