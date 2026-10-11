<script setup lang="ts">
import { ref } from 'vue'
import Login from './login/index.vue'
import Register from './register/index.vue'
import ForgetPassword from './forgetPassword/index.vue'
// import { Close } from '@element-plus/icons-vue'
import type { activeType, loginPrefillType } from './type'

// 定义要发射的事件（模板里通过 $emit 使用）
defineEmits<{
    (e: 'loginSuccess'): void
}>()

// 登录方式切换变量
let active = ref<activeType>('login')
const loginPrefill = ref<{ youxiang: string; password: string } | null>(null)

const handleChildForm = (payload: string | loginPrefillType) => {
    if (typeof payload === 'string') {
        active.value = payload as activeType
        return
    }

    loginPrefill.value = {
        youxiang: payload.youxiang,
        password: payload.password
    }
    active.value = payload.type
}

// 取消按钮的点击事件处理
// const handleCancel = () => {
//     console.log('取消登录')
// }
</script>

<template>
    <!-- <div class="maxBox"> -->
    <div class="box">
        <!-- 取消按钮 -->
        <!-- <button class="cancel-btn" @click="handleCancel">
                <el-icon style="font-size: 15px; font-weight: 500;">
                    <Close />
                </el-icon>
            </button> -->
        <template v-if="active == 'login'">
            <Login @handleForgetPassword="(type: string) => handleChildForm(type as activeType)"
                @handleRegister="(type: string) => handleChildForm(type as activeType)"
                :prefill="loginPrefill"
                @login-success="$emit('loginSuccess')" />
        </template>
        <template v-else-if="active == 'register'">
            <Register @handleLogin="handleChildForm" />
        </template>
        <template v-else-if="active == 'forgetPassword'">
            <ForgetPassword @handleLogin="handleChildForm" />
        </template>
    </div>
    <!-- </div> -->
</template>

<style scoped lang="scss">
.maxBox {
    display: flex;
    justify-content: center;
    background-color: transparent;
    width: 100%;
    height: 100%;

    .box {
        width: 350px;
        height: 420px;
        background-color: #F8F8F9;
        border-radius: 30px;
        padding: 15px;

        // .cancel-btn {
        //     display: flex;
        //     justify-content: center;
        //     align-items: center;
        //     width: 30px;
        //     height: 30px;
        //     border: none;
        //     position: absolute;
        //     top: 240px;
        //     right: 630px;
        //     background: transparent;
        //     color: #fff;
        //     border-radius: 50%;
        //     cursor: pointer;
        //     font-size: 14px;
        //     z-index: 10;
        //     transition: background-color 0.3s ease;

        //     &:hover {
        //         background-color: #888888;
        //     }
        // }
    }
}
</style>