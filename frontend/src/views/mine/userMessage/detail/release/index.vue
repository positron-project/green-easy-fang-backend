<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { exchangeGoodsDataType } from '@/api/exchangeGoods/type'
import { reqGetReleaseList, reqDeleteRelease } from '@/api/mine/index'
import ModifyGoods from '../goods&release/modifyGoods/index.vue'

// 控制详细商品页面是否显示
const isDetailGoodsVisible = ref<boolean>(false)
// 待发布商品数据
const editGoodsData = ref<exchangeGoodsDataType>()

// 环保物品数据
const exchangeGoodsData = ref<exchangeGoodsDataType[]>([])

const getReleaseListData = async () => {
    try {
        const res = await reqGetReleaseList()
        // console.log(res.data);
        if (res.code === 200) {
            exchangeGoodsData.value = res.data
        }
    } catch (error) {
        console.log(error)
    }
}

const handleDelete = async (id: number) => {
    try {
        const res = await reqDeleteRelease(id)
        if (res.code === 200) {
            getReleaseListData()
        }
    } catch (error) {
        console.log(error)
    }
}

const handleEdit = (editData: exchangeGoodsDataType) => {
    isDetailGoodsVisible.value = true
    editGoodsData.value = editData
}

const handleModalClose = () => {
    isDetailGoodsVisible.value = false
    getReleaseListData()
}

onMounted(() => {
    getReleaseListData()
})

</script>

<template>
    <div class="eco-goods-container">
        <div v-show="!isDetailGoodsVisible" class="goods-grid">
            <div v-for="item in exchangeGoodsData" :key="item.id" class="goods-item">
                <!-- 商品图片 -->
                <div class="goods-image-container">
                    <img :src="item.imageUrls[0]" class="goods-image" />
                </div>

                <!-- 商品信息区域 -->
                <div class="goods-info-area">
                    <div class="goods-price-text">￥{{ item.price }}</div>
                    <div class="goods-description-text">{{ item.shopDetails }}</div>
                </div>

                <!-- 操作按钮 -->
                <div class="action-buttons">
                    <button class="btn delete-btn" @click="handleDelete(item.id)" title="删除">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                    </button>
                    <button class="btn edit-btn" @click="handleEdit(item)" title="修改">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <ModifyGoods v-show="isDetailGoodsVisible" @updateVisible="handleModalClose"
            :editData="editGoodsData" />
    </div>
</template>

<style scoped lang="scss">
.eco-goods-container {
    padding: 20px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.goods-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    padding: 20px 0;

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
}

.goods-item {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(57, 181, 74, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;
    aspect-ratio: 1.3 / 1;
    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(57, 181, 74, 0.2);
    }
}

.goods-image-container {
    position: relative;
    width: 100%;
    flex: 1;
    overflow: hidden;

    .goods-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: all 0.5s ease;
    }

    &:hover .goods-image {
        transform: scale(1.1);
    }
}

.goods-info-area {
    padding: 15px;
    border-top: 1px solid #f0f0f0;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f9f9f9;
}

.goods-price-text {
    color: #39B54A;
    font-weight: bold;
    font-size: 20px;
}

.goods-description-text {
    font-size: 0.9rem;
    color: #666;
    line-height: 1.4;
    flex: 1;
    margin-left: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    white-space: nowrap;
}

// 响应式设计
@media (max-width: 768px) {
    .eco-goods-container {
        padding: 10px;

        .page-title {
            font-size: 2rem;
        }

        .page-subtitle {
            font-size: 1rem;
        }
    }

    .goods-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
    }

    .goods-image-container {
        height: 180px;
    }
}

@media (max-width: 480px) {
    .goods-grid {
        grid-template-columns: 1fr;
    }
}
</style>