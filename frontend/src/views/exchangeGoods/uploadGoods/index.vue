<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useUserStore from '@/store/user'
import { ElMessage, ElButton } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { BaseButton, BaseUpload, BaseInput, BaseDialog } from '@/components/element'
import { reqUploadContent, reqAIEvaluate } from '@/api/exchangeGoods'
import type { uploadExchangeGoodsDataType } from '@/api/exchangeGoods/type'
import { MagicStick } from '@element-plus/icons-vue'
import { House } from '@element-plus/icons-vue'

const useStore = useUserStore()

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
// 表单数据
const formData = ref<uploadExchangeGoodsDataType>({
    id: 0,
    userId: 0,
    shopDetails: '',
    price: null as number | null,  // 这会显示为空
    address: '',
    images: [] as File[],
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

    // 检查图片数量限制
    if (formData.value.images.length >= 4) {
        ElMessage.error('最多只能上传4张图片')
        return false
    }

    // 直接将File对象添加到数组中
    formData.value.images.push(file)
    ElMessage.success('图片上传成功')
    return false
}

// 删除图片
const removeImage = (index: number) => {
    formData.value.images.splice(index, 1)
}

// 提交表单
const submitForm = async () => {
    if (!formData.value.shopDetails || !formData.value.price || !formData.value.address) {
        ElMessage.error('请填写完整信息')
        return
    }

    if (formData.value.images.length === 0) {
        ElMessage.error('请至少上传一张图片')
        return
    }

    try {
        // 创建FormData对象
        const formDataToSend = new FormData()

        // 添加文本字段
        formDataToSend.append('userId', formData.value.userId.toString())
        formDataToSend.append('shopDetails', formData.value.shopDetails)
        formDataToSend.append('address', formData.value.address)
        formDataToSend.append('price', formData.value.price.toString())

        // 添加图片文件（直接使用File对象）
        formData.value.images.forEach((file) => {
            // 使用数组格式的字段名，确保后端能接收多个文件
            formDataToSend.append('images[]', file)
        })

        // 调用API提交数据
        const response = await reqUploadContent(formDataToSend)

        if (response.code === 200) {
            ElMessage.success('物品上传成功！')

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
        ElMessage.error('上传失败，请重试')
    }
}

// AI估价功能
const handleAiEstimate = async () => {
    if (!formData.value.shopDetails && formData.value.images.length === 0) {
        ElMessage.warning('请先填写物品描述和至少上传一张图片，AI才能进行估价')
        return
    }
    showEvaluateDialog.value = true

    try {
        // 创建FormData对象
        const formDataToSend = new FormData()
        // 添加文本字段
        formDataToSend.append('description', formData.value.shopDetails)
        // 添加图片文件（直接使用File对象）
        formData.value.images.forEach((file) => {
            // 使用数组格式的字段名，确保后端能接收多个文件
            formDataToSend.append('images', file)
        })
        // 调用AI评估物品
        const res = await reqAIEvaluate(formDataToSend)
        if (res.code === 200) {
            backendId.value = res.data
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
    const eventSource = new EventSource(`/api/valuation/stream/${backendId.value}`)

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

            // 检查是否是流结束标记
            if (data === '[DONE]') {
                eventSource.close()
                evaluateStatus.value = 'AI估价已完成'
                isRequesting.value = false
                return
            }
            // 累积消息内容
            accumulatedContent += data
            // 实时更新消息内容，移除条件判断
            // 将换行符 \\n 转换为 HTML 换行标签 <br>
            messages.value = accumulatedContent.replace(/\n/g, '<br>')
        } catch (error) {
            // 如果处理失败，尝试直接使用原始数据
            accumulatedContent += event.data
            // 在错误处理中也进行换行符转换
            messages.value = accumulatedContent.replace(/\n/g, '<br>')
            console.error('处理消息时出错:', error)
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
    evaluateStatus.value = '请等待AI评估物品价值'
    messages.value = ''
}

onMounted(() => {
    formData.value.address = useStore.region + useStore.regions
    if (formData.value.address && formData.value.address.includes('/')) {
        formData.value.address = formData.value.address.replace(/\//g, '');
    }
    formData.value.userId = useStore.accountId
})

</script>

<template>
    <div class="upload-goods-container">
        <div class="upload-goods-box">
            <!-- 页面标题 -->
            <div class="page-header">
                <h1 class="page-title">上传环保物品</h1>
                <p class="page-subtitle">分享你的环保好物，共建绿色社区</p>
            </div>

            <!-- 上传表单 -->
            <div class="upload-form">
                <!-- 左边：图片上传区域 -->
                <div class="upload-images-section">
                    <h3 class="section-title">物品图片</h3>
                    <div class="images-container">
                        <!-- 已上传的图片预览 -->
                        <div v-for="(file, index) in formData.images" :key="index" class="image-preview">
                            <img :src="getImageUrl(file as File)" :alt="'物品图片' + (index + 1)" />
                            <div class="image-actions">
                                <ElButton type="danger" size="small" @click="removeImage(index)">删除</ElButton>
                            </div>
                        </div>

                        <!-- 上传按钮 -->
                        <BaseUpload class="upload-button" :on-change="handleImageUpload" accept="image/*">
                            <BaseButton :icon="Plus">
                                上传图片
                            </BaseButton>
                        </BaseUpload>
                    </div>
                    <p class="upload-tips">支持 JPG、PNG 格式，最多上传 4 张图片</p>
                </div>

                <!-- 右边：表单信息区域 -->
                <div class="form-info-section">
                    <!-- 物品描述 -->
                    <div class="form-item">
                        <label class="form-label">物品描述</label>
                        <BaseInput v-model="formData.shopDetails" :type="'textarea'" :rows="4"
                            placeholder="请详细描述物品的特点、材质、使用情况、预期价格等" :maxlength="200" />
                    </div>

                    <!-- 价格 -->
                    <div class="form-item">
                        <label class="form-label">价格</label>
                        <div class="price-input-group">
                            <BaseInput v-model="formData.price" placeholder="请输入价格" maxlength="20" />
                            <BaseButton class="ai-estimate-btn" @click="handleAiEstimate">
                                <el-icon style="margin-right: 4px">
                                    <MagicStick />
                                </el-icon>
                                AI估价
                            </BaseButton>
                        </div>
                    </div>

                    <!-- 地址 -->
                    <div class="form-item">
                        <label class="form-label">所在地址</label>
                        <BaseInput v-model="formData.address" placeholder="请输入物品所在地址" :maxlength="100" />
                    </div>

                    <!-- 操作按钮 -->
                    <div class="form-actions">
                            <BaseButton @click="submitForm" class="submit-button">
                                <el-icon style="margin-right: 4px">
                                    <House />
                                </el-icon>
                                发布物品
                            </BaseButton>
                        <BaseButton @click="resetForm" class="reset-button">
                            重置
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>
        <BaseDialog v-model="showEvaluateDialog" :width="550" :before-close="handleCloseEvaluate"
            :title="evaluateStatus">
            <div class="ai-evaluate-result">
                <p style="font-size: 1.1rem; line-height: 1.6;" v-html="messages"></p>
            </div>
        </BaseDialog>
    </div>
</template>

<style scoped lang="scss">
.upload-goods-container {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%);

    .upload-goods-box {
        width: 1024px;
        margin: 0 auto;
    }
}

.page-header {
    text-align: center;
    margin-bottom: 40px;

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