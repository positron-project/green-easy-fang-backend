<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import SuccessStories from './successStoriesDetail/index.vue';
import ContentDetail from '../detail/contentDetail/index.vue';
import Carousel from '../detail/carouselDetail/index.vue';
import { useRoute } from 'vue-router';
import { reqEnvContentSucessStoriesRandomData, reqSpotNewDetailData } from '@/api/envContent/detail';
import type { envContentSucessStoriesData } from '@/api/envContent/type';
import type { detailDataType, detailParamsType, detailResponseDataType } from '@/api/envContent/detail/type';
import img01 from '@/assets/loading.jpg';
import img02 from '@/assets/loading.jpg';
// 获取路由实例
const route = useRoute();

// 接受切换过来的数据
const envContentId = ref<number>();
const envContentName = ref<string>('')

const envContentSuccessStoriesRandomData = ref<envContentSucessStoriesData[]>([
    {
        id: 1,
        imageUrl: img02,
        title: '碳捕获："千分之四"提倡的使命是改造土壤。',
        date: '2024年7月1日',
        address: 'emir.com'
    },
    {
        id: 2,
        imageUrl: img01,
        title: '碳捕获："千分之四"提倡的使命是改造土壤。',
        date: '2024年7月1日',
        address: 'emir.com'
    },
    {
        id: 1,
        imageUrl: img01,
        title: '碳捕获："千分之四"提倡的使命是改造土壤。',
        date: '2024年7月1日',
        address: 'emir.com'
    },
    {
        id: 1,
        imageUrl: img01,
        title: '碳捕获："千分之四"提倡的使命是改造土壤。',
        date: '2024年7月1日',
        address: 'emir.com'
    }
])

const spotNewDetailData = ref<detailDataType>({
    id: 1,
    title: '捕获："千分之四"提倡的使命是改造土壤。',
    date: '2024年7月1日',
    address: 'emir.com',
    imageT: img01,
    image: img01,
    message: '捕获："千分之四"倡议的使命是改造土壤',
})

const getEnvContentSuccessStoriesRandomData = async () => {
    try {
        const res = await reqEnvContentSucessStoriesRandomData();
        if (res.code === 200) {
            envContentSuccessStoriesRandomData.value = res.data;
        }
    } catch (error) {
        console.log(error);
    }
}

// 接口参数
const detailParams = ref<detailParamsType>({
    id: 0,
    type: ''
})

const getSpotNewDetailData = async () => {
    try {
        const res: detailResponseDataType = await reqSpotNewDetailData(detailParams.value);
        if (res.code === 200) {
            spotNewDetailData.value = res.data;
        }
    } catch (error) {
        console.log(error);
    }
}

// 更新数据的函数
const updateDetailData = () => {
    // 从路由参数中获取id
    envContentId.value = Number(route.params.id);
    envContentName.value = route.name as string;
    detailParams.value.id = envContentId.value;
    detailParams.value.type = envContentName.value;
    getSpotNewDetailData();
    getEnvContentSuccessStoriesRandomData();
}

onMounted(() => {
    updateDetailData();
});

// 监听路由参数变化，当路由参数改变时更新数据
watch(() => route.params.id, (newId, oldId) => {
    if (newId !== oldId) {
        updateDetailData();
    }
}, { immediate: true });

</script>

<template>
    <div class="maxBox">
        <div class="carousel">
            <Carousel :detailData="spotNewDetailData"></Carousel>
        </div>
        <div class="moreContent">
            <ContentDetail :detailData="spotNewDetailData"></ContentDetail>
            <SuccessStories :successStoriesData="envContentSuccessStoriesRandomData"></SuccessStories>
        </div>
    </div>
</template>

<style scoped lang="scss">
.maxBox {
    width: 100%;
    height: 100%;

    .carousel {
        width: 100%;
        height: 500px;
    }

    .moreContent {
        display: flex;
        justify-content: space-between;
        width: 70%;
        // min-height: 200px;
        margin-top: 80px;
        margin-left: auto;
        margin-right: auto;
    }
}
</style>