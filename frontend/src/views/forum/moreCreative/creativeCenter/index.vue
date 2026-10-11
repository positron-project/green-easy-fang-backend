<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reqCreateContent } from '@/api/forum'
import type { submitCreativeCenterDataType } from '@/api/forum/type'
import useUserStore from '@/store/user'

const userStore = useUserStore()
const router = useRouter()

// 初始表单数据
const initialFormData: submitCreativeCenterDataType = {
    userId: userStore.id || 0, // 用户ID
    type: '', // 内容类型
    title: '', // 标题
    detail: '', // 描述
    source: '', // 来源
    image: new File([], '') // 图片文件
}

// 表单数据（添加完整类型定义）
const formData = ref<submitCreativeCenterDataType>({ ...initialFormData })

// 处理图片上传
const handleImageUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0]

        // 文件大小检查（最大5MB）
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            ElMessage.error('图片大小不能超过5MB')
            target.value = '' // 清空文件选择
            return
        }

        // 文件类型检查
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
        if (!allowedTypes.includes(file.type)) {
            ElMessage.error('只支持 JPG、PNG 格式的图片')
            target.value = '' // 清空文件选择
            return
        }

        formData.value.image = file

        // 预览图片
        const reader = new FileReader()
        reader.onload = (e) => {
            const imgElement = document.querySelector('.forumItemImg') as HTMLImageElement
            if (imgElement && e.target) {
                imgElement.src = e.target.result as string
            }
        }
        reader.readAsDataURL(file)
    }
}

// 表单验证
const validateForm = () => {
    // 验证内容类型
    if (!formData.value.type.trim()) {
        ElMessage.error('请输入内容类型')
        return false
    }

    // 验证标题
    if (!formData.value.title.trim()) {
        ElMessage.error('请输入标题')
        return false
    }

    if (formData.value.title.trim().length < 2) {
        ElMessage.error('标题至少需要2个字符')
        return false
    }

    if (formData.value.title.trim().length > 50) {
        ElMessage.error('标题不能超过50个字符')
        return false
    }

    // 验证描述
    if (!formData.value.detail.trim()) {
        ElMessage.error('请输入内容描述')
        return false
    }

    if (formData.value.detail.trim().length < 10) {
        ElMessage.error('描述至少需要10个字符')
        return false
    }

    if (formData.value.detail.trim().length > 500) {
        ElMessage.error('描述不能超过500个字符')
        return false
    }

    // 验证图片（可选，但推荐上传）
    if (!formData.value.image) {
        return ElMessageBox.confirm(
            '您还没有上传图片，确定要继续提交吗？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        ).then(() => true).catch(() => false)
    }

    return true
}

// 图片压缩函数
const compressImage = (file: File, maxWidth = 1920, quality = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        // 检查Canvas上下文是否获取成功
        if (!ctx) {
            reject(new Error('无法获取Canvas上下文'))
            return
        }

        // 设置图片加载超时（10秒）
        const loadTimeout = setTimeout(() => {
            URL.revokeObjectURL(img.src)
            reject(new Error('图片加载超时'))
        }, 10000)

        img.onload = () => {
            clearTimeout(loadTimeout)

            // 计算压缩后的尺寸
            let width = img.width
            let height = img.height

            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width)
                width = maxWidth
            }

            canvas.width = width
            canvas.height = height

            // 绘制压缩后的图片
            ctx.drawImage(img, 0, 0, width, height)

            // 转换为Blob
            canvas.toBlob((blob) => {
                if (blob) {
                    // 创建新的File对象
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    })
                    // 释放URL对象
                    URL.revokeObjectURL(img.src)
                    console.log('图片压缩成功，原始大小:', file.size, '压缩后大小:', compressedFile.size)
                    resolve(compressedFile)
                } else {
                    // 释放URL对象
                    URL.revokeObjectURL(img.src)
                    reject(new Error('图片压缩失败：无法生成Blob'))
                }
            }, 'image/jpeg', quality)
        }

        img.onerror = () => {
            clearTimeout(loadTimeout)
            // 释放URL对象
            URL.revokeObjectURL(img.src)
            reject(new Error('图片加载失败：请检查图片格式'))
        }

        img.src = URL.createObjectURL(file)
    })
}

// 返回上一页
const goBack = () => {
    router.go(-1)
}

// 提交表单
const submitForm = async () => {
    // 表单验证
    const isValid = await validateForm()
    if (!isValid) {
        return
    }

    try {
        let finalImage: File

        // 处理图片：如果有图片则压缩，否则使用空文件
        if (formData.value.image) {
            // 压缩图片（大于1MB的图片才压缩）
            if (formData.value.image.size > 1024 * 1024) {
                finalImage = await compressImage(formData.value.image)
            } else {
                finalImage = formData.value.image
            }
        } else {
            finalImage = new File([], 'empty.jpg')
        }

        // 创建FormData对象用于文件上传
        const formDataToSubmit = new FormData()

        // 添加文本字段
        formDataToSubmit.append('userId', String(userStore.accountId))
        formDataToSubmit.append('type', formData.value.type)
        formDataToSubmit.append('title', formData.value.title)
        formDataToSubmit.append('detail', formData.value.detail)
        formDataToSubmit.append('source', formData.value.source)

        // 添加图片文件（如果有）
        if (finalImage && finalImage.size > 0) {
            formDataToSubmit.append('image', finalImage)
        }

        // 调用API接口上传数据
        const res = await reqCreateContent(formDataToSubmit)
        if (res.code === 200) {
            ElMessage.success('环保内容提交成功！请等待审核结果。')
        } else {
            ElMessage.error('环保内容提交失败！')
        }

        // 清空表单
        formData.value = { ...initialFormData }

        // 清空图片预览
        const imgElement = document.querySelector('.forumItemImg') as HTMLImageElement
        if (imgElement) {
            imgElement.src = ''
        }

    } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('提交失败，请稍后重试')
    }
}

</script>

<template>
    <div class="forumItem">
        <div class="forumItemMessage">
            <!-- 返回按钮 -->
            <button @click="goBack" class="back-btn">
                ← 返回
            </button>

            <div class="message">
                <input v-model="formData.type" placeholder="请输入内容类型（如：环保知识、活动分享等）"
                    style="color: #39B54A; margin-bottom: 6px; font-size: 14px; width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                    class="messageType">

                <input v-model="formData.title" placeholder="请输入标题"
                    style="font-size: 1.5rem; line-height: 2rem; margin-bottom: 12px; width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;"
                    class="messageTitle">

                <textarea v-model="formData.detail" placeholder="请输入内容描述"
                    style="font-size: 1rem; line-height: 1.5rem; color: #8b8b8b; margin-bottom: 16px; width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; resize: none; min-height: 80px;"
                    class="messageDescribe"></textarea>

                <div style="display: flex; align-items: center; gap: 12px; justify-content: space-between;">
                    <input v-model="formData.source" placeholder="请输入来源（可选）"
                        style="font-size: .875rem; line-height: 1.25rem; flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                        class="messageSource">

                    <button @click="submitForm"
                        style="background-color: #39B54A; color: white; border: none; padding: 8px 24px; border-radius: 4px; cursor: pointer; font-size: .875rem; white-space: nowrap; min-width: 80px;"
                        class="submitBtn">
                        提交
                    </button>
                </div>
            </div>
        </div>

        <div class="forumItemImgBox">
            <div
                style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 12px;">
                <img class="forumItemImg" src="" style="max-height: 80%; max-width: 80%; object-fit: cover;">

                <label
                    style="background-color: #39B54A; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: .875rem;">
                    上传图片
                    <input type="file" accept="image/*" @change="handleImageUpload" style="display: none;">
                </label>

                <div style="font-size: .75rem; color: #666;">
                    支持 JPG、PNG 格式，最大 5MB(可选)
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.forumItem {
    display: flex;
    margin: 0 auto;
    margin-top: 50px;
    width: 1382px;
    height: 500px;
    /* 增加高度以适应表单 */
    background-color: #F4F6F5;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .forumItemMessage {
        display: flex;
        align-items: center;
        justify-content: end;
        width: 50%;
        height: 100%;
        padding: 24px;
        position: relative;

        .back-btn {
            position: absolute;
            top: 24px;
            left: 72px;
            background-color: #39B54A;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
            z-index: 10;

            &:hover {
                background-color: #2e8b3e;
                transform: translateY(-1px);
            }

            &:active {
                transform: translateY(0);
            }
        }

        .message {
            width: 572px;
            min-height: 50px;
            margin-right: 24px;

            .messageType {
                resize: none;

                &:focus {
                    outline: none;
                    border-color: #39B54A;
                    box-shadow: 0 0 0 2px rgba(57, 181, 74, 0.2);
                }
            }

            .messageTitle {
                &:focus {
                    outline: none;
                    border-color: #39B54A;
                    box-shadow: 0 0 0 2px rgba(57, 181, 74, 0.2);
                }
            }

            .messageDescribe {
                resize: none;

                &:focus {
                    outline: none;
                    border-color: #39B54A;
                    box-shadow: 0 0 0 2px rgba(57, 181, 74, 0.2);
                }
            }

            .messageSource {
                &:focus {
                    outline: none;
                    border-color: #39B54A;
                    box-shadow: 0 0 0 2px rgba(57, 181, 74, 0.2);
                }
            }

            .submitBtn {
                transition: all 0.3s ease;

                &:hover {
                    background-color: #2e8b3e;
                    transform: translateY(-1px);
                }

                &:active {
                    transform: translateY(0);
                }
            }
        }
    }

    .forumItemImgBox {
        flex: 1;
        height: 100%;
        overflow: hidden;
        padding: 24px;

        .forumItemImg {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 4px;
            border: 2px dashed #ddd;
            background-color: #f9f9f9;
        }

        label {
            transition: all 0.3s ease;

            &:hover {
                background-color: #2e8b3e;
                transform: translateY(-1px);
            }
        }
    }
}

/* 输入框通用样式 */
input,
textarea {
    font-family: inherit;

    &::placeholder {
        color: #999;
    }
}
</style>