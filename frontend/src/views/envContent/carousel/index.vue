<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import type { envContentCarouselDataType } from '@/api/envContent/type'
import { formatEnvContentDate } from '@/utils/formatDate'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
    carouselData: envContentCarouselDataType[]
}>()

// 导航到详情页函数
const navigateToDetail = (id: number) => {
    router.push({
        name: 'carouselDetail',
        params: { id }
    })
}

</script>

<template>
    <div class="maxBox">
        <el-carousel trigger="click" :autoplay="false" height="500px" indicator-position="bottom">
            <el-carousel-item v-for="item in props.carouselData" :key="item.id" @click="navigateToDetail(item.id)">
                <img class="img" :src="item.img" alt="" loading="lazy">
                <div class="detailedInformation">
                    <div class="title">{{ item.title }}</div>
                    <div class="date_more">
                        <div class="data">{{ formatEnvContentDate(item.date) }}</div>
                        <div class="divider">|</div>
                        <div class="address">{{ item.address }}</div>
                        <div class="divider">|</div>
                        <p style="color: #fff;">阅读更多</p>
                        <el-icon style="margin-top: 2px; margin-left: 3px;">
                            <ArrowRight />
                        </el-icon>
                    </div>
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<style scoped lang="scss">
.maxBox {
    width: 100%;
    height: 100%;
    cursor: pointer;

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n + 1) {
        background-color: #d3dce6;
    }

    /* 调整轮播图左右切换箭头的大小 */
    :deep(.el-carousel__arrow) {
        background-color: transparent;
        width: 40px;
        height: 40px;
        font-size: 45px;

        &:hover {
            color: #39B54A;
        }
    }

    /* 调整指示器（小圆点）的样式 */
    :deep(.el-carousel__indicator) {
        padding: 12px 6px;

        // 普通状态的指示器样式
        .el-carousel__button {
            width: 8px !important;
            height: 8px !important;
            border-radius: 50% !important;
            background-color: #ffffff !important;
            opacity: 1 !important;
        }

        &.is-active {
            .el-carousel__button {
                background-color: #39B54A !important;
            }
        }
    }

    .img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .detailedInformation {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 730px;
        height: 150px;
        top: 50%;
        /* 将顶部定位在父元素50%的位置 */
        left: 50%;
        /* 保持水平居中的设置 */
        transform: translate(-75%, -50%);
        /* 同时向左和向上移动自身宽高的50% */
        z-index: 10;
        cursor: pointer;

        .title {
            font-size: 58px;
            color: #ffffff;
        }

        .date_more {
            display: flex;
            color: #ffffff;
            font-size: 16px;

            .divider {
                font-size: 12px;
                margin: 0 5px;
            }
        }
    }
}
</style>