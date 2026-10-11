<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Close } from '@element-plus/icons-vue'
import { reqSaveUserInfo } from '@/api/mine';
import type { userInfoDataType } from '@/api/mine/type';
import { cascaderOptions } from '@/components/other/cascaderOptionsData/index'
import { useRouter } from 'vue-router'
import useUserStore from '@/store/user';

// 定义要发射的事件
const emit = defineEmits(['cancelSetting'])

const switchSetting = () => {
    emit('cancelSetting')
}

const userStore = useUserStore();
const router = useRouter()

// 用户初始或默认数据
const initialUserInfo = {
    id: 0,
    avatar: '',
    username: '',
    gender: '',
    region: '',
    regions: ''
};

const userInfoData = ref<userInfoDataType>({
    id: 0,
    avatar: null,
    username: '',
    gender: '',
    region: '',
    regions: '',
    address: '',
});

// 地区选择器的选项
const regionOptions = ref<Array<any>>([])

// 临时用户数据
const tempUserInfo = ref({ ...initialUserInfo });

// 编辑状态
const isEditing = ref(false);

// 保存地区数据
const options = ref(cascaderOptions)

// 进入编辑模式
const enterEditMode = () => {
    isEditing.value = true;
};

// 保存更改
const saveChanges = async () => {
    const reRegion = ref('')
    // 复制除了avatar以外的属性
    const { avatar: tempAvatar, ...otherTempInfo } = tempUserInfo.value;
    Object.assign(userInfoData.value, otherTempInfo);

    if (userInfoData.value.region && userInfoData.value.region.includes('/')) {
        reRegion.value = userInfoData.value.region.replace(/\//g, '');
    }

    const address = reRegion.value + userInfoData.value.regions

    isEditing.value = false;

    // 创建 FormData 对象以支持 multipart/form-data
    const formData = new FormData();

    // 添加所有字段到 FormData
    formData.append('id', userInfoData.value.id.toString());
    formData.append('username', userInfoData.value.username);
    formData.append('gender', userInfoData.value.gender);
    formData.append('region', userInfoData.value.region);
    formData.append('regions', userInfoData.value.regions);
    formData.append('address', address);

    // 如果有头像文件，添加到 FormData
    if (userInfoData.value.avatar instanceof File) {
        formData.append('avatar', userInfoData.value.avatar);
    }

    // 这里可以添加保存到服务器的逻辑
    try {
        const res = await reqSaveUserInfo(formData);
        if (res.code === 200) {
            // 保存成功，更新用户信息
            userStore.getUserInfo();
        }
    } catch (error) {
        console.error('保存用户信息失败', error);
    }
};

// 处理地区选择变化
const handleChange = (value: any[]) => {
    // 将数组转换为字符串，用指定分隔符连接
    const stringValue = value.join('/');
    // 赋值给临时用户数据的region属性
    tempUserInfo.value.region = stringValue;
};

// 昵称限制：按实际显示宽度控制，不超过 150px（中英文混排都生效）
const handleUsernameInput = () => {
    const value = tempUserInfo.value.username || ''
    const maxWidth = 140
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // 与输入框字号保持一致，按像素宽度裁剪
    ctx.font = '16px MiSans, sans-serif'

    let next = ''
    for (const ch of value) {
        const candidate = next + ch
        if (ctx.measureText(candidate).width > maxWidth) break
        next = candidate
    }

    if (next !== value) {
        tempUserInfo.value.username = next
    }
}

const handleAvatarChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file && file.type.startsWith('image/') && file.size < 5 * 1024 * 1024) {
        // 创建Image对象进行压缩
        const img = new Image();

        img.onload = () => {
            // 创建Canvas元素用于压缩
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                console.error('无法获取Canvas上下文');
                return;
            }

            // 设置Canvas尺寸（保持原尺寸）
            canvas.width = img.width;
            canvas.height = img.height;

            // 在Canvas上绘制图片
            ctx.drawImage(img, 0, 0);

            // 将Canvas内容转换为Base64字符串（80%质量）用于预览
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);

            // 将压缩后的Base64字符串赋值给tempUserInfo用于预览
            tempUserInfo.value.avatar = compressedBase64;

            // 将Canvas内容转换为Blob（80%质量）用于上传
            canvas.toBlob((blob) => {
                if (blob) {
                    // 将Blob转换为File对象
                    const compressedFile = new File([blob], 'avatar.jpg', {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });

                    // 直接赋值给userInfoData用于上传
                    userInfoData.value.avatar = compressedFile;
                }
            }, 'image/jpeg', 0.8); // 0.8表示80%质量
        };

        img.onerror = () => {
            console.error('图片加载失败');
        };

        // 使用FileReader读取文件并设置Image源
        const reader = new FileReader();
        reader.onload = (event) => {
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    } else {
        console.warn('请选择有效的图片文件(小于2MB)');
    }
};

// 组件挂载时，直接从store的state中获取默认数据
onMounted(() => {
    Object.assign(tempUserInfo.value, userStore);
});

</script>

<template>
    <div class="user-info-container">
        <div class="cancel" @click="switchSetting">
            <Close />
        </div>
        <!-- 展示状态 -->
        <div v-if="!isEditing" class="info-display">
            <div class="info-item">
                <span class="label">头像</span>
                <div class="avatar-container">
                    <img :src="tempUserInfo.avatar" class="avatar">
                </div>
            </div>

            <div class="info-item">
                <span class="label">昵称</span>
                <span class="value username-value">{{ tempUserInfo.username }}</span>
            </div>

            <div class="info-item">
                <span class="label">性别</span>
                <span class="value">{{ tempUserInfo.gender }}</span>
            </div>

            <div class="info-item">
                <span class="label">地区</span>
                <span class="value">{{ tempUserInfo.region }}</span>
            </div>

            <div class="info-item">
                <span class="label">详细地址</span>
                <span class="value">{{ tempUserInfo.regions || '未设置' }}</span>
            </div>

            <button class="edit-btn" @click="enterEditMode">编辑</button>
            <button class="logout-btn" @click="userStore.userLogout(); router.push('/envContent'); switchSetting()">退出登录</button>
        </div>

        <!-- 编辑状态 -->
        <div v-else class="info-edit">
            <div class="info-item">
                <span class="label">头像</span>
                <div class="avatar-container">
                    <img :src="tempUserInfo.avatar" class="avatar">
                    <input type="file" accept="image/*" @change="handleAvatarChange" class="avatar-upload">
                </div>
            </div>

            <div class="info-item">
                <span class="label">昵称</span>
                <input type="text" v-model="tempUserInfo.username" class="edit-input username-input"
                    @input="handleUsernameInput">
            </div>

            <div class="info-item">
                <span class="label">性别</span>
                <div class="gender-options">
                    <label>
                        <input type="radio" v-model="tempUserInfo.gender" value="男"> 男
                    </label>
                    <label>
                        <input type="radio" v-model="tempUserInfo.gender" value="女"> 女
                    </label>
                </div>
            </div>

            <div class="info-item">
                <span class="label">地区</span>
                <el-cascader v-model="regionOptions" :options="options" @change="handleChange" style="width: 360px;"
                    :popper-class="'custom-cascader-popper'" :placeholder="tempUserInfo.region" />
            </div>

            <div class="info-item">
                <span class="label">详细地址</span>
                <input type="text" v-model="tempUserInfo.regions" class="edit-input" placeholder="请输入详细地址">
            </div>
            <button class="save-btn" @click="saveChanges">保存</button>
            <button class="logout-btn" @click="userStore.userLogout(); router.push('/envContent'); switchSetting()">退出登录</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.user-info-container {
    position: relative;
    width: 500px;
    margin: 20px auto;
    padding: 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    font-family: 'MiSans', -apple-system, sans-serif;

    .cancel {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 20px;
        height: 20px;
        cursor: pointer;
    }

    .info-item {
        display: flex;
        align-items: center;
        padding: 16px 0;
        border-bottom: 1px solid #f0f0f0;
    }

    .label {
        width: 100px;
        color: #666;
        font-size: 16px;
    }

    .value {
        flex: 1;
        color: #333;
        font-size: 16px;
    }

    .avatar-container {
        position: relative;
        width: 80px;
        height: 80px;

        .avatar {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }

        .avatar-upload {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
        }
    }

    .edit-input,
    .provinces-select {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-size: 16px;
        outline: none;

        &:focus {
            border-color: #ff6700;
        }
    }

    /* 控制el-select下拉列表的高度 */
    .province-popper .el-select-dropdown__wrap {
        max-height: 200px;
        /* 设置下拉列表最大高度 */
    }

    .gender-options {
        flex: 1;
        display: flex;
        gap: 20px;

        label {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 16px;
        }
    }
}

.edit-btn,
.save-btn {
    display: block;
    width: 100%;
    margin-top: 30px;
    padding: 14px;
    background: #ff6700;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
        background: #ff8533;
    }
}

.username-value {
    display: inline-block;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.username-input {
    width: 150px !important;
    max-width: 150px !important;
    flex: none !important;
}

.logout-btn {
    display: block;
    width: 100%;
    margin-top: 12px;
    padding: 12px;
    background: transparent;
    color: #999;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;

    &:hover {
        color: #666;
        border-color: #ccc;
    }
}

/* 控制cascader组件的高度 */
:deep(.el-cascader__wrapper) {
    height: 40px !important;
    line-height: 40px !important;
}

:deep(.el-input__inner) {
    height: 40px !important;
}

/* 修改cascader组件选中时的边框颜色 */
:deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px rgba(255, 133, 51, 1) inset !important;
}
</style>