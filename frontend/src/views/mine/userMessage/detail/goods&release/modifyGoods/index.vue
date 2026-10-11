<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import useUserStore from '@/store/user'
import { ElMessage, ElButton, ElInput, ElUpload } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { reqUpdateGoods } from '@/api/exchangeGoods'
import type { uploadExchangeGoodsDataType, exchangeGoodsDataType } from '@/api/exchangeGoods/type'
import { ArrowLeft } from '@element-plus/icons-vue'
import { reqAIEvaluate } from '@/api/exchangeGoods/index'

// 接收父组件传递的待修改商品数据
const props = defineProps({
    editData: {
        type: Object as () => exchangeGoodsDataType,
        default: () => ({})
    }
})

// 控制登录弹窗显示
const showEvaluateDialog = ref(false)
// 保存后端存储id
const backendId = ref<number>(0)
// 估价状态
const evaluateStatus = ref<string>('请等待AI评估物品价值')
// 接受ai评估结果
const messages = ref<string>('')
// 设置请求状态
const isRequesting = ref<boolean>(false)
const emit = defineEmits(['updateVisible'])
const useStore = useUserStore()

// 监听父组件传递的待修改商品数据变化
watch(() => props.editData, (newVal) => {
    if (newVal.id) {
        // 填充表单数据
        formData.value.id = newVal.id || 0
        formData.value.userId = newVal.userId || 0
        formData.value.shopDetails = newVal.shopDetails || ''
        formData.value.price = newVal.price || null
        formData.value.address = newVal.address || ''
        formData.value.images = newVal.imageUrls || []
        // 清空“本次新上传”列表，避免保存后再打开时与后端返回的 URL 重复显示
        imageUrls.value = []
    }
})

// 返回上一页
const goBack = () => {
    imageUrls.value = [] // 离开时清空本次新上传，避免再次打开时重复显示
    emit('updateVisible')
}

// 新上传的图片（File 对象）
const imageUrls = ref<File[]>([])

// 表单数据
const formData = ref<uploadExchangeGoodsDataType>({
    id: 0,
    userId: 0,
    shopDetails: '',
    price: null as number | null,  // 这会显示为空
    address: '',
    images: [] as File[] | string[],
})

const handleImageUpload = (uploadFile: any) => {
    // 检查参数格式，兼容不同情况
    const file = uploadFile.raw || uploadFile.file || uploadFile

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        ElMessage.error('请选择图片文件')
        return false
    }

    // 检查文件大小（限制5MB）
    if (file.size > 5 * 1024 * 1024) {
        ElMessage.error('图片大小不能超过5MB')
        return false
    }

    // 检查图片数量限制（已有 + 新上传合计最多 4 张）
    const totalCount = formData.value.images.length + imageUrls.value.length
    if (totalCount >= 4) {
        ElMessage.error('最多只能上传4张图片')
        return false
    }

    // 新上传的 File 存入 imageUrls，用于展示和提交
    imageUrls.value.push(file)
    // formData.value.images.push(file)
    ElMessage.success('图片上传成功')
    return false
}

// 用于展示的图片列表：已有图片(URL) + 新上传(File)
const displayImages = computed(() => [...formData.value.images, ...imageUrls.value])

// 删除图片（index 对应 displayImages 的下标）
const removeImage = (index: number) => {
    const existingCount = formData.value.images.length
    if (index < existingCount) {
        formData.value.images.splice(index, 1)
    } else {
        imageUrls.value.splice(index - existingCount, 1)
    }
}

// 提交表单
const submitForm = async () => {
    if (!formData.value.shopDetails || !formData.value.price || !formData.value.address) {
        ElMessage.error('请填写完整信息')
        return
    }

    const totalImages = formData.value.images.length + imageUrls.value.length
    if (totalImages === 0) {
        ElMessage.error('请至少上传一张图片')
        return
    }

    try {
        // 创建FormData对象
        const formDataToSend = new FormData()
        // const imageUrlsStr = imageUrls.value.join(',')

        // 添加文本字段
        formDataToSend.append('id', formData.value.id.toString())
        formDataToSend.append('userId', formData.value.userId.toString())
        formDataToSend.append('shopDetails', formData.value.shopDetails)
        formDataToSend.append('address', formData.value.address)
        formDataToSend.append('price', formData.value.price.toString())

        const existingUrls = formData.value.images.filter((x): x is string => typeof x === 'string')
        formDataToSend.append('imageUrls', existingUrls.join(','))

        // 处理新上传的图片文件（文件流），imageUrls 里存的是新选的 File
        imageUrls.value.forEach((file) => {
            if (file instanceof File) {
                formDataToSend.append('images', file)
            }
        })

        // for (let [key, value] of formDataToSend.entries()) {
        //     if (value instanceof File) {
        //         console.log(`FormData字段: ${key}`, {
        //             fileName: value.name,
        //             fileSize: value.size,
        //             fileType: value.type
        //         })
        //     } else {
        //         console.log(`FormData字段: ${key}`, value)
        //     }
        // }

        // 调用API提交数据
        const response = await reqUpdateGoods(formDataToSend)

        if (response.code === 200) {
            ElMessage.success('物品修改成功！')
            // 返回
            goBack()

            // 重置表单
            formData.value = {
                id: 0,
                userId: useStore.id,
                shopDetails: '',
                price: null as number | null,
                address: '',
                images: []
            }
        } else {
            ElMessage.error(response.message || '上传失败')
        }
    } catch (error) {
        console.error('上传失败:', error)
    }
}

// AI估价功能
const handleAiEstimate = async () => {
    const totalForAi = formData.value.images.length + imageUrls.value.length
    if (!formData.value.shopDetails && totalForAi === 0) {
        ElMessage.warning('请先填写物品描述和至少上传一张图片，AI才能进行估价')
        return
    }
    showEvaluateDialog.value = true

    try {
        // 创建FormData对象
        const formDataToSend = new FormData()
        // 添加文本字段
        formDataToSend.append('description', formData.value.shopDetails)
        // 只提交 File 对象（新上传的在 imageUrls，已有的可能在 formData.images 里是 URL 字符串）
        const filesToSend = [
            ...formData.value.images.filter((f): f is File => f instanceof File),
            ...imageUrls.value
        ]
        filesToSend.forEach((file) => formDataToSend.append('images[]', file))
        // 调用AI评估物品
        const res = await reqAIEvaluate(formDataToSend)
        console.log(res.data)
        if (res.code === 200) {
            backendId.value = res.data.id
            // 调用AI评估物品推理
            getAIEvaluateReasoning()
        }
    } catch (error) {
        console.error('AI分析失败:', error)
    }
}

// 获取AI评估推理
const getAIEvaluateReasoning = () => {
    if (isRequesting.value) {
        console.warn('已有请求在进行中，忽略重复请求')
        return
    }

    // 设置请求状态
    isRequesting.value = true
    // 修改为路径参数格式，与后端接口匹配
    const eventSource = new EventSource(`/api/ai/chat/stream/${backendId.value}`)

    let accumulatedContent = ''

    // SSE 连接建立
    eventSource.onopen = () => {
        console.log('SSE连接已建立')
    }

    // SSE 消息接收
    eventSource.onmessage = (event) => {
        try {
            // 后端返回的是纯文本流，直接累积内容
            const data = event.data
            // 累积消息内容
            accumulatedContent += data
            messages.value = accumulatedContent

        } catch (error) {
            // 如果处理失败，尝试直接使用原始数据
            accumulatedContent += event.data
            messages.value = accumulatedContent
        }
    }

    // SSE 连接关闭处理
    eventSource.addEventListener('close', () => {
        console.log('SSE连接正常关闭')
        eventSource.close()
        evaluateStatus.value = 'AI估价已完成'
        isRequesting.value = false
    })

    // SSE 错误处理
    eventSource.onerror = (error) => {
        console.error('SSE连接错误:', error)
        eventSource.close()
        evaluateStatus.value = 'AI估价已完成'
        isRequesting.value = false
    }
}

// 获取图片URL
const getImageUrl = (file: File): string => {
    return URL.createObjectURL(file)
}

// 重置表单
const resetForm = () => {
    formData.value = {
        id: 0,
        userId: useStore.accountId,
        shopDetails: '',
        price: 0,
        address: '',
        images: []
    }
    ElMessage.info('表单已重置')
}

// 关闭估价弹窗
const handleCloseEvaluate = () => {
    showEvaluateDialog.value = false
}

onMounted(() => {
})

</script>

<template>
    <div class="upload-goods-container">
        <div class="upload-goods-box">
            <!-- 页面头部区域 -->
            <div class="page-header-section">
                <!-- 返回按钮 -->
                <div class="back-button-container">
                    <ElButton type="primary" :icon="ArrowLeft" @click="goBack" class="back-button">
                        返回
                    </ElButton>
                </div>

                <!-- 页面标题 -->
                <div class="page-header">
                    <h1 class="page-title">上传环保物品</h1>
                    <p class="page-subtitle">分享你的环保好物，共建绿色社区</p>
                </div>
            </div>

            <!-- 上传表单 -->
            <div class="upload-form">
                <!-- 左边：图片上传区域 -->
                <div class="upload-images-section">
                    <h3 class="section-title">物品图片</h3>
                    <div class="images-container">
                        <!-- 已上传的图片预览 -->
                        <div v-for="(file, index) in displayImages" :key="index" class="image-preview">
                            <img :src="typeof file === 'string' ? file : getImageUrl(file as File)"
                                :alt="'物品图片' + (index + 1)" />
                            <div class="image-actions">
                                <ElButton type="danger" size="small" @click="removeImage(index)">删除</ElButton>
                            </div>
                        </div>

                        <!-- 上传按钮 -->
                        <ElUpload class="upload-button" :auto-upload="false" :show-file-list="false"
                            :on-change="handleImageUpload" accept="image/*">
                            <ElButton type="primary" :icon="Plus" size="large">
                                上传图片
                            </ElButton>
                        </ElUpload>
                    </div>
                    <p class="upload-tips">支持 JPG、PNG 格式，最多上传 4 张图片</p>
                </div>

                <!-- 右边：表单信息区域 -->
                <div class="form-info-section">
                    <!-- 物品描述 -->
                    <div class="form-item">
                        <label class="form-label">物品描述</label>
                        <ElInput v-model="formData.shopDetails" type="textarea" :rows="4"
                            placeholder="请详细描述物品的特点、材质、使用情况等" maxlength="200" show-word-limit />
                    </div>

                    <!-- 价格 -->
                    <div class="form-item">
                        <label class="form-label">价格</label>
                        <div class="price-input-group">
                            <ElInput v-model="formData.price" placeholder="请输入价格" maxlength="20" />
                            <ElButton type="primary" class="ai-estimate-btn" @click="handleAiEstimate">
                                🤖 AI估价
                            </ElButton>
                        </div>
                    </div>

                    <!-- 地址 -->
                    <div class="form-item">
                        <label class="form-label">所在地址</label>
                        <ElInput v-model="formData.address" placeholder="请输入物品所在地址" maxlength="100" />
                    </div>

                    <!-- 操作按钮 -->
                    <div class="form-actions">
                        <ElButton type="primary" @click="submitForm" size="large" class="submit-button">
                            🌱 修改物品
                        </ElButton>
                        <ElButton @click="resetForm" size="large" class="reset-button">
                            重置
                        </ElButton>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog v-model="showEvaluateDialog" width="450px" :before-close="handleCloseEvaluate"
            :title="evaluateStatus">
            <div class="ai-evaluate-result">
                <p>{{ messages || 'AI正在分析中...' }}</p>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped lang="scss">
.upload-goods-container {
    position: fixed;
    top: 180px;
    /* 避开navbar高度 */
    left: 0;
    width: 100vw;
    height: calc(100vh - 180px);
    /* 减去navbar高度 */
    background: linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%);
    z-index: 999;
    overflow-y: auto;

    .upload-goods-box {
        width: 1024px;
        margin: 0 auto;
    }
}

.page-header-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
    gap: 20px;
}

.back-button-container {
    flex-shrink: 0;

    .back-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 8px;
        padding: 10px 20px;
        font-weight: 600;
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        &:active {
            transform: translateY(0);
        }
    }
}

.page-header {
    text-align: center;
    flex: 1;

    .page-title {
        color: #39B54A;
        font-size: 2.5rem;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .page-subtitle {
        color: #666;
        font-size: 1.1rem;
    }
}

.upload-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(57, 181, 74, 0.1);
}

.upload-images-section {
    .section-title {
        color: #39B54A;
        font-size: 1.2rem;
        margin-bottom: 20px;
        font-weight: 600;
    }

    .images-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-bottom: 10px;
    }

    .image-preview {
        position: relative;
        border: 2px dashed #39B54A;
        border-radius: 8px;
        overflow: hidden;
        aspect-ratio: 1;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .image-actions {
            position: absolute;
            top: 5px;
            right: 5px;
        }
    }

    .upload-button {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px dashed #39B54A;
        border-radius: 8px;
        aspect-ratio: 1;
        transition: all 0.3s ease;

        &:hover {
            border-color: #2e8b57;
            transform: scale(1.05);
        }
    }

    .upload-tips {
        color: #999;
        font-size: 0.9rem;
        text-align: center;
        margin-top: 10px;
    }
}

.form-info-section {
    .price-input-group {
        display: flex;
        gap: 10px;
        align-items: center;

        :deep(.el-input) {
            flex: 1;
        }

        .ai-estimate-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 8px;
            padding: 12px 16px;
            font-weight: 600;
            white-space: nowrap;
            transition: all 0.3s ease;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            }

            &:active {
                transform: translateY(0);
            }
        }
    }

    display: flex;
    flex-direction: column;
    gap: 25px;

    .form-item {
        .form-label {
            display: block;
            color: #39B54A;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 1rem;
        }

        :deep(.el-input) {
            .el-input__wrapper {
                border-radius: 8px;
                border: 1px solid #e0e0e0;

                &:hover {
                    border-color: #39B54A;
                }

                &.is-focus {
                    border-color: #39B54A;
                    box-shadow: 0 0 0 1px #39B54A;
                }
            }
        }

        :deep(.el-textarea) {
            .el-textarea__inner {
                border-radius: 8px;
                border: 1px solid #e0e0e0;

                &:hover {
                    border-color: #39B54A;
                }

                &:focus {
                    border-color: #39B54A;
                    box-shadow: 0 0 0 1px #39B54A;
                }
            }
        }
    }

    .form-actions {
        display: flex;
        gap: 15px;
        margin-top: 20px;

        .submit-button {
            flex: 2;
            background: linear-gradient(135deg, #39B54A 0%, #2e8b57 100%);
            border: none;
            font-weight: 600;

            &:hover {
                background: linear-gradient(135deg, #2e8b57 0%, #228b22 100%);
                transform: translateY(-2px);
            }
        }

        .reset-button {
            flex: 1;
            font-weight: 600;

            &:hover {
                transform: translateY(-2px);
            }
        }
    }
}

// 响应式设计
@media (max-width: 1024px) {
    .upload-goods-container .upload-goods-box {
        width: 100%;
        padding: 0 20px;
    }

    .upload-form {
        grid-template-columns: 1fr;
        gap: 30px;
    }

    .images-container {
        grid-template-columns: repeat(3, 1fr) !important;
    }
}

@media (max-width: 768px) {
    .page-header .page-title {
        font-size: 2rem;
    }

    .upload-form {
        padding: 20px;
    }

    .images-container {
        grid-template-columns: repeat(2, 1fr) !important;
    }

    .form-actions {
        flex-direction: column;

        .el-button {
            width: 100%;
        }
    }
}
</style>