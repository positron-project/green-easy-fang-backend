<script setup lang="ts">
import { ref, reactive } from 'vue'
import { reqRegister, reqRegister_code } from '@/api/login/index'
import type { registerDataType, registerResponsetDataType } from '@/api/login/type'
import { onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import type { loginPrefillType } from '../type'

// 定义要发射的事件
const emit = defineEmits<{
    (e: 'handleLogin', payload: string | loginPrefillType): void
}>()

// 切换表单类型
const switchLoginForm = (type: string | loginPrefillType) => {
    emit('handleLogin', type)
}

// 表单引用，用于手动触发表单验证
const formRef = ref()

const registerData = reactive<registerDataType>({
    youxiang: '',
    password: '',
    code: ''
})

// 倒计时相关状态
const countdown = ref(0)
const timer = ref<number | null>(null)
const isCounting = ref(false)

const handleRegister = async () => {
    if (!formRef.value) return;
    try {
        await formRef.value.validate();
        const res: registerResponsetDataType = await reqRegister(registerData)
        // console.log("res",res);
        if (res.code === 200) {
            ElMessage({ message: '注册成功', type: 'success' })
            switchLoginForm({
                type: 'login',
                youxiang: registerData.youxiang,
                password: registerData.password
            })
        } else {
            ElMessage.error('注册失败:检查邮箱和验证码是否正确')
        }
    } catch (err) {
        console.log(err)
    }
}

// 获取验证码
const getVerifyCode = async () => {
    // 先验证邮箱是否填写正确
    if (!registerData.youxiang) {
        ElMessage.error('请先输入邮箱地址')
        return
    }
    try {
        formRef.value.validateField('youxiang')
        await reqRegister_code(registerData)
        ElMessage({ message: '验证码发送成功', type: 'success' })
    } catch (err) {
        console.log(err)
        return
    }
    // 开始倒计时
    startCountdown()
}

// 开始倒计时
const startCountdown = () => {
    isCounting.value = true
    countdown.value = 60

    // 清除之前的定时器
    if (timer.value) {
        clearInterval(timer.value)
    }

    timer.value = window.setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--
        } else {
            isCounting.value = false
            if (timer.value) {
                clearInterval(timer.value)
                timer.value = null
            }
        }
    }, 1000)
}

// 清理定时器
const cleanupTimer = () => {
    if (timer.value) {
        clearInterval(timer.value)
        timer.value = null
    }
}

// 组件卸载时清理定时器
onBeforeUnmount(cleanupTimer)

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
</script>

<template>
    <div class="maxBox">
        <el-form ref="formRef" class="form" :rules="rules" :model="registerData">
            <div class="title_register">
                <div class="title">注册</div>
                <div class="register" @click="switchLoginForm('login')">
                    <p>登录</p>
                </div>
            </div>
            <el-form-item prop="youxiang" label="邮箱地址">
                <el-input v-model="registerData.youxiang" />
            </el-form-item>
            <el-form-item prop="password" label="密码">
                <el-input type="password" v-model="registerData.password" />
            </el-form-item>
            <el-form-item prop="code" label="验证码">
                <div class="inputCode"
                    style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
                    <el-input style="width: 180px;" v-model="registerData.code" />
                    <div class="getCode" style="cursor: pointer;" @click="getVerifyCode">
                        <p>{{ isCounting ? `${countdown}秒后重新获取` : '获取验证码' }}</p>
                    </div>
                </div>
            </el-form-item>
            <button type="button" @click="handleRegister" class="button">
                <p>注册</p>
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