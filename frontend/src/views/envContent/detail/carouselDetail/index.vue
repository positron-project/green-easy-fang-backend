<script setup lang="ts">
import type { detailDataType } from '@/api/envContent/detail/type'
import { formatEnvContentDate } from '@/utils/formatDate'

// 接受父组件传递过来的数据
defineProps({
    detailData: {
        type: Object as () => detailDataType,
        default: () => ({})
    }
})

</script>

<template>
    <div class="maxBox">
        <img class="img" :src="detailData.image" alt="" loading="lazy">
        <div class="detailedInformation">
            <div class="title">{{ detailData.title }}</div>
            <div class="date_more">
                <div class="data">{{ formatEnvContentDate(detailData.date) }}</div>
                <div class="divider">|</div>
                <div class="address">{{ detailData.address }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.maxBox {
    width: 100%;
    height: 100%;
    position: relative;

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