<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElCarousel, ElCarouselItem, ElButton, ElMessage } from 'element-plus'
import type { exchangeGoodsDataType } from '@/api/exchangeGoods/type'
import { reqIsCollect, reqGoChat } from '@/api/exchangeGoods'
import type { isCollectRequestDataType, goChatDataType } from '@/api/exchangeGoods/type'
import userUseRouter from '@/store/user'

const emit = defineEmits(['close', 'setingIsCollected'])
const userStore = userUseRouter()
const router = useRouter()

const props = defineProps({
    goodsData: {
        type: Object as () => exchangeGoodsDataType,
        default: () => ({})
    }
})

// 收藏商品
const toggleCollect = async (shopId: number, isCollect: boolean) => {
    emit('setingIsCollected', shopId)
    const data: isCollectRequestDataType = {
        shopId: shopId,
        isCollect: !isCollect
    }

    try {
        await reqIsCollect(data)
    } catch (error) {
        console.error('操作失败', error)
    }
}

// 去聊天
const goToChat = async (userId: number) => {
    const data: goChatDataType = {
        senderId: userStore.accountId,
        contactId: userId,
    }
    try {
        const res = await reqGoChat(data)
        if (res.code == 200) {
            router.push({
                path: '/news',
            })
        }
    } catch (error) {
        ElMessage.error('操作失败')
    }
}

// 返回上一页
const goBack = () => {
    emit('close')
}

</script>

<template>
    <div class="detailGoodaMaxBox">
        <div class="detailGoodaBox">
            <!-- 返回按钮 -->
            <div class="back-button" @click="goBack">
                <span class="back-icon">←</span>
                返回
            </div>

            <div v-if="props.goodsData" class="goods-detail-content">
                <!-- 左边：图片轮播 -->
                <div class="goods-images-section">
                    <ElCarousel :interval="5000" height="400px" indicator-position="outside">
                        <ElCarouselItem v-for="(img, index) in props.goodsData.imageUrls" :key="index">
                            <div class="carousel-image-container">
                                <img :src="img" :alt="'商品图片' + (index + 1)" class="carousel-image" />
                            </div>
                        </ElCarouselItem>
                    </ElCarousel>
                </div>

                <!-- 右边：商品信息 -->
                <div class="goods-info-section">
                    <!-- 商品描述 -->
                    <div class="info-item description">
                        <h3 class="info-label">商品描述</h3>
                        <p class="info-content">{{ props.goodsData.shopDetails }}</p>
                    </div>

                    <!-- 地址 -->
                    <div class="info-item address">
                        <h3 class="info-label">所在地址</h3>
                        <p class="info-content">📍 {{ props.goodsData.address }}</p>
                    </div>

                    <!-- 价格 -->
                    <div class="info-item price">
                        <h3 class="info-label">价格</h3>
                        <p class="price-content">{{ props.goodsData.price }}</p>
                    </div>

                    <!-- 操作按钮 -->
                    <div class="action-buttons">
                        <ElButton type="primary" class="chat-button" @click="goToChat(props.goodsData.userId)" size="large">
                            💬 我想要
                        </ElButton>
                        <ElButton :type="props.goodsData.isCollected ? 'success' : 'default'" class="collect-button"
                            @click="toggleCollect(props.goodsData.id, props.goodsData.isCollected)" size="large">
                            {{ props.goodsData.isCollected ? '❤️ 已收藏' : '🤍 收藏' }}
                        </ElButton>
                    </div>
                </div>
            </div>

            <div v-else class="loading-state">
                <p>商品信息加载中...</p>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.detailGoodaMaxBox {
    width: 100%;
    min-height: 200px;
    padding: 20px;
    background: linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%);

    .detailGoodaBox {
        width: 1024px;
        margin: 0 auto;
    }
}

.back-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #39B54A;
    color: white;
    border-radius: 25px;
    cursor: pointer;
    margin-bottom: 30px;
    transition: all 0.3s ease;
    font-weight: 500;

    &:hover {
        background: #2e8b57;
        transform: translateX(-5px);
    }

    .back-icon {
        font-size: 18px;
        font-weight: bold;
    }
}

.goods-detail-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: start;
}

.goods-images-section {
    .carousel-image-container {
        height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f9f9f9;
        border-radius: 12px;
        overflow: hidden;

        .carousel-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    :deep(.el-carousel__indicators) {
        bottom: -30px;
    }

    :deep(.el-carousel__button) {
        background: #39B54A;
    }
}

.goods-info-section {
    display: flex;
    flex-direction: column;
    gap: 30px;

    .info-item {
        padding: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(57, 181, 74, 0.1);
        border-left: 4px solid #39B54A;

        .info-label {
            margin: 0 0 10px 0;
            color: #39B54A;
            font-size: 16px;
            font-weight: 600;
        }

        .info-content {
            margin: 0;
            color: #666;
            line-height: 1.6;
            font-size: 14px;
        }

        &.price {
            .price-content {
                margin: 0;
                color: #39B54A;
                font-size: 28px;
                font-weight: bold;
            }
        }

        &.address {
            .info-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }
        }
    }

    .action-buttons {
        display: flex;
        gap: 15px;
        margin-top: 10px;

        .chat-button {
            flex: 2;
            background: linear-gradient(135deg, #39B54A 0%, #2e8b57 100%);
            border: none;
            font-weight: 600;

            &:hover {
                background: linear-gradient(135deg, #2e8b57 0%, #228b22 100%);
                transform: translateY(-2px);
            }
        }

        .collect-button {
            flex: 1;
            font-weight: 600;

            &:hover {
                transform: translateY(-2px);
            }
        }
    }
}

.loading-state {
    text-align: center;
    padding: 100px 0;
    color: #39B54A;
    font-size: 18px;
}

// 响应式设计
@media (max-width: 1024px) {
    .detailGoodaMaxBox .detailGoodaBox {
        width: 100%;
        padding: 0 20px;
    }

    .goods-detail-content {
        grid-template-columns: 1fr;
        gap: 30px;
    }

    .goods-images-section .carousel-image-container {
        height: 300px;
    }
}

@media (max-width: 768px) {
    .action-buttons {
        flex-direction: column;

        .el-button {
            width: 100%;
        }
    }
}
</style>