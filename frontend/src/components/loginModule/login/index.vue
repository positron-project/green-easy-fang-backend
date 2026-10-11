<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { loginDataType } from '@/api/login/type'
import useUserStore from '@/store/user'
import { ElMessage } from 'element-plus'

// 定义要发射的事件
const emit = defineEmits<{
    (e: 'handleRegister', type: string): void
    (e: 'handleForgetPassword', type: string): void
    (e: 'loginSuccess'): void
}>()

const props = defineProps<{
    prefill?: {
        youxiang: string
        password: string
    } | null
}>()

// 表单引用，用于手动触发表单验证
const formRef = ref()

// 创建userStore实例
const userStore = useUserStore()

const loginData = reactive<loginDataType>({
    youxiang: '',
    password: ''
})

watch(
    () => props.prefill,
    (newPrefill) => {
        if (!newPrefill) return
        loginData.youxiang = newPrefill.youxiang
        loginData.password = newPrefill.password
    },
    { immediate: true }
)

const handleLogin = async () => {
    // 先进行表单验证
    if (!formRef.value) return;
    try {
        await formRef.value.validate();
        const res = await userStore.userLogin(loginData);
        if (res === 'ok') {
            userStore.youxiang = loginData.youxiang
            // 先拉取并写入用户信息（accountId 等），再关弹窗，避免第一次登录时被判定为未登录
            await userStore.getUserInfo();
            ElMessage({ message: '登录成功', type: 'success' });
            emit('loginSuccess');
        }
    } catch (error: any) {
        console.error('登录失败:', error);
        ElMessage({
            message: error.message || '登录失败，请检查账号密码',
            type: 'error'
        });
    }
}

// 表单验证规则
const rules = reactive({
    youxiang: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
    ]
})

// 切换表单类型
const switchRegisterForm = (type: string) => {
    emit('handleRegister', type)
}
const switchForgetPasswordForm = (type: string) => {
    emit('handleForgetPassword', type)
}
</script>

<template>
    <div class="maxBox">
        <el-form ref="formRef" class="form" :rules="rules" :model="loginData">
            <div class="title_register">
                <div class="title">登录</div>
                <div class="register" @click="switchRegisterForm('register')">
                    <p>注册</p>
                </div>
            </div>
            <el-form-item prop="youxiang" label="邮箱地址">
                <el-input v-model="loginData.youxiang" />
            </el-form-item>
            <el-form-item prop="password" label="密码">
                <el-input type="password" v-model="loginData.password" />
            </el-form-item>
            <div class="forgetPasswoed" @click="switchForgetPasswordForm('forgetPassword')">
                <p>忘记了密码？</p>
            </div>
            <button type="button" @click="handleLogin" class="button">
                <p>登录</p>
            </button>
        </el-form>
    </div>
</template>

<style scoped lang="scss">
.maxBox {
    width: 100%;
    height: 100%;

    .form {
        width: 100%;
        height: 100%;
        padding: 5px;

        .title_register {
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .title {
                font-size: 18px;
            }

            .register {
                width: 70px;
                height: 36px;
                border: 1.5px solid #000;
                border-radius: 25px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                transition: all 0.3s ease;

                &:hover {
                    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
                    transform: scale(1.03);
                }

                p {
                    font-size: 14px;
                }
            }
        }

        .el-form-item {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        :deep(.el-form-item__label) {
            color: #000;
            margin-left: 0;
        }

        :deep(.el-form-item__label-wrap) {
            margin-left: 0 !important;
        }

        :deep(.el-form-item__content) {
            width: 100%;
        }

        :deep(.el-input) {
            height: 48px;
        }

        .forgetPasswoed {
            display: flex;
            justify-content: flex-end;
            font-size: 14px;
            margin: 25px 0;
            cursor: pointer;
        }

        .button {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #222222;
            border: none;
            color: #fff;
            border-radius: 30px;
            font-size: 18px;
            margin-top: 20px;
            width: 100%;
            height: 48px;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
                transform: scale(1.02);
            }
        }
    }
}
</style>