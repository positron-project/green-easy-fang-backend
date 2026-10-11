<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { exchangeGoodsDataType } from '@/api/exchangeGoods/type'
import { reqExchangeGoodsData } from '@/api/exchangeGoods'
import type { exchangeGoodsResponseDataType } from '@/api/exchangeGoods/type'
import DetailGoods from '@/views/exchangeGoods/detailGoods/index.vue'
import useUserStore from '@/store/user'
import { ElMessage } from 'element-plus'
import img01 from '@/assets/loading.jpg'

// 控制详细商品页面是否显示
const isDetailGoodsVisible = ref<boolean>(false)
// 详细商品数据
const detailGoodsData = ref<exchangeGoodsDataType>()

const userStore = useUserStore()

// 环保物品数据
const exchangeGoodsData = ref<exchangeGoodsDataType[]>([
    {
        id: 1,
        userId: 6,
        imageUrls: [img01, img01, img01],
        address: '北京市海淀区',
        shopDetails: '可重复使用的环保购物袋，采用有机棉材质',
        price: 29.9,
        isCollected: false,
    },
    {
        id: 2,
        userId: 1,
        imageUrls: [img01, img01, img01],
        address: '北京市海淀区',
        shopDetails: '可重复使用的环保购物袋，采用有机棉材质',
        price: 29.9,
        isCollected: false,
    },
    {
        id: 3,
        userId: 1,
        imageUrls: [img01, img01, img01],
        address: '北京市海淀区',
        shopDetails: '可重复使用的环保购物袋，采用有机棉材质',
        price: 29.9,
        isCollected: false,
    },
])

// 跳转到商品详情页
const goToGoodsDetail = (item: exchangeGoodsDataType) => {
    isDetailGoodsVisible.value = true
    detailGoodsData.value = item
}

const getExchangeGoodsData = async () => {
    if (userStore.regions=='' || userStore.region=='') {
        ElMessage.error('请先设置地区和详细地址，才能查找附近商品')
        return
    }
    try {
        const res: exchangeGoodsResponseDataType = await reqExchangeGoodsData()
        // console.log(res.data);
        if (res.code === 200) {
            exchangeGoodsData.value = res.data
        }
    } catch (error) {
        console.log(error)
    }
}

const setIsCollected = (shopId: number) => {
    const item = exchangeGoodsData.value.find((item) => item.id === shopId)
    if (item) {
        item.isCollected = !item.isCollected
    }
}

onMounted(() => {
    getExchangeGoodsData()
})

</script>

<template>
    <div class="eco-goods-container">
        <div v-show="!isDetailGoodsVisible" class="goods-grid">
            <div v-for="item in exchangeGoodsData" :key="item.id" class="goods-item" @click="goToGoodsDetail(item)">
                <!-- 商品图片 -->
                <div class="goods-image-container">
                    <img :src="item.imageUrls[0]" class="goods-image" />
                </div>

                <!-- 商品信息区域 -->
                <div class="goods-info-area">
                    <div class="goods-price-text">￥{{ item.price }}</div>
                    <div class="goods-description-text">{{ item.shopDetails }}</div>
                </div>
            </div>
        </div>
        <DetailGoods v-show="isDetailGoodsVisible" @close="isDetailGoodsVisible = false"
            :goods-data="detailGoodsData" @setingIsCollected="setIsCollected" />
    </div>
</template>

<style scoped lang="scss">
.eco-goods-container {
    padding: 20px;
    width: 100%;
    margin: 0 auto;
}

.goods-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    padding: 20px 0;
}

.goods-item {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(57, 181, 74, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;
    aspect-ratio: 1 / 1;
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