<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqGetCreativeList, reqDeleteCreative } from '@/api/mine'
import useUserStore from '@/store/user'
import type { creativeListDataType, creativeListDataResponesDataType } from '@/api/mine/type'

const userStore = useUserStore()

// 模拟数据
const creativeList = ref<creativeListDataType[]>([]);

// 获取用户创作列表数据
const getCreativeList = async () => {
    try {
        const res: creativeListDataResponesDataType = await reqGetCreativeList(userStore.accountId)
        // console.log(res.data);
        if (res.code === 200) {
            creativeList.value = res.data
        }
    } catch (error) {
        console.error('获取用户创作列表数据时发生错误:', error);
    }
}

// 删除创作
const handleDelete = async (creativeId: number) => {
    console.log(creativeId);
    // 这里可以调用删除API
    try {
        const res = await reqDeleteCreative(creativeId)
        if (res.code === 200) {
            // 删除成功后，刷新创作列表
            getCreativeList()
        }
    } catch (error) {
        console.error('删除创作时发生错误:', error);
    }
}

onMounted(() => {
    getCreativeList()
})
</script>

<template>
    <div class="creativeMaxBox">
        <div class="creativeList">
            <div v-for="item in creativeList" :key="item.id" class="imgBox">
                <img class="img" :src="item.img" alt="创作图片">
                <div class="type">
                    {{ item.type }}
                </div>
                <div class="title">
                    {{ item.detail }}
                </div>
                <!-- 操作按钮 -->
                <div class="action-buttons">
                    <button class="btn delete-btn" @click="handleDelete(item.id)" title="删除">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.creativeMaxBox {
    width: 100%;
    height: 100%;
    overflow: hidden;
    -ms-overflow-style: none;
    scrollbar-width: none;
    overflow-y: auto;

    .creativeList {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 17px;
        padding: 10px;
    }

    .imgBox {
        width: 100%;
        height: 150px;
        border-radius: 6px;
        overflow: hidden;
        position: relative;

        .type {
            position: absolute;
            top: 10px;
            left: 10px;
            font-size: 12px;
            color: rgb(57, 181, 74);
        }

        .title {
            position: absolute;
            bottom: 10px;
            left: 10px;
            font-size: 14px;
            width: calc(100% - 50px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        // 操作按钮容器
        .action-buttons {
            position: absolute;
            top: 10px;
            right: 10px;
            display: flex;
            gap: 8px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        // 按钮样式
        .btn {
            position: relative;
            width: 32px;
            height: 32px;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);

            &.delete-btn {
                background: rgba(244, 67, 54, 0.9);
                color: white;

                &:hover {
                    background: rgba(244, 67, 54, 1);
                    transform: scale(1.1);
                }
            }

            &.edit-btn {
                background: rgba(33, 150, 243, 0.9);
                color: white;

                &:hover {
                    background: rgba(33, 150, 243, 1);
                    transform: scale(1.1);
                }
            }
        }

        &:hover {
            .img {
                transform: scale(1.2);
            }

            .action-buttons {
                opacity: 1;
            }
        }

        .img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
    }
}
</style>