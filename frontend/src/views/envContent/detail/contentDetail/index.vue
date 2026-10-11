<script setup lang="ts">
import type { detailDataType } from '@/api/envContent/detail/type';

// 接受父组件传递过来的数据
defineProps({
    detailData: {
        type: Object as () => detailDataType,
        default: () => ({})
    }
})

</script>

<template>
    <div class="maxbox">
        <div class="mainTitle">{{ detailData.title }}</div>
        <div class="imgBox">
            <img class="img" :src="detailData.image" alt="" loading="lazy">
        </div>
        <div style="font-size: 15px; line-height: 1.6em; margin-bottom: 100px;" class="textContent">
            {{ detailData.message }}
        </div>
    </div>
</template>

<style scoped lang="scss">
.maxbox {
    width: 65%;
    // min-height: 200px;

    .mainTitle {
        width: 100%;
        height: 40px;
        font-size: 24px;
        margin-bottom: 36px;
        border-bottom: 1px solid #000;
    }

    .imgBox {
        width: 100%;
        height: 510px;
        margin-bottom: 36px;

        .img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
}
</style>