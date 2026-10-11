<script setup lang="ts">
import Carousel from '../envContent/carousel/index.vue'
import SpotNew from './spotNew/index.vue'
import SuccessStories from './successStories/index.vue'
import { ref, reactive, onMounted } from 'vue';
import { reqEnvContentCarouselData, reqEnvContentSpotNewData, reqEnvContentSucessStoriesData } from '@/api/envContent/index';
import type { envContentCarouselResponseDataType, envContentCarouselDataType, pagingCarouselDataType, maxImgData_minImgDataType, envContentSpotNewResponseDataType, envContentSucessStoriesData, envContentSucessStoriesDataResponseDataType } from '@/api/envContent/type'
import img01 from '@/assets/loading.jpg'
import img02 from '@/assets/loading.jpg'

const envContentCarouselData = reactive<envContentCarouselDataType[]>([
    {
        id: 1,
        img: img01,
        title: '碳捕获："千分之四"提倡的使命是改造土壤。',
        date: new Date('2024-07-01T00:00:00.000+00:00'),
        address: 'emir.com'
    },
    {
        id: 2,
        img: img02,
        title: '环保宣传图片2',
        date: new Date('2024-07-02'),
        address: 'emir.com'
    },
    {
        id: 3,
        img: img01,
        title: '环保宣传图片3',
        date: new Date('2024-07-03'),
        address: 'emir.com'
    }
]);

const envContentSpotNewData = reactive<maxImgData_minImgDataType[]>([
    {
        envContentMinImgData: [
            {
                id: 1,
                type: '材料',
                imageUrl: img01,
                title: '碳捕获："千分之四"提倡的使命是改造土壤。',
                date: new Date('2024-07-01T00:00:00.000+00:00'),
                address: 'emir.com',
                ddddd: '碳捕获："千分之四"倡议的使命是改造土壤。'
            },
            {
                id: 2,
                type: '材料',
                imageUrl: img01,
                title: '碳捕获："千分之四"提倡的使命是改造土壤。',
                date: new Date('2024-07-01T00:00:00.000+00:00'),
                address: 'emir.com',
                ddddd: '碳捕获："千分之四"倡议的使命是改造土壤。'
            },
        ],
        envContentMaxImgData:
        {
            id: 1,
            type: '材料',
            imageUrl: img01,
            title: '碳捕获："千分之四"提倡的使命是改造土壤。',
            date: new Date('2024-07-01T00:00:00.000+00:00'),
            address: 'emir.com'
        },
    },
    {
        envContentMinImgData: [
            {
                id: 1,
                type: '材料',
                imageUrl: img01,
                title: '碳捕获："千分之四"提倡的使命是改造土壤。',
                date: new Date('2024-07-01T00:00:00.000+00:00'),
                address: 'emir.com',
                ddddd: '碳捕获："千分之四"倡议的使命是改造土壤。'
            },
            {
                id: 2,
                type: '材料',
                imageUrl: img01,
                title: '碳捕获："千分之四"提倡的使命是改造土壤。',
                date: new Date('2024-07-01T00:00:00.000+00:00'),
                address: 'emir.com',
                ddddd: '碳捕获："千分之四"倡议的使命是改造土壤。'
            },
        ],
        envContentMaxImgData:
        {
            id: 1,
            type: '材料',
            imageUrl: img01,
            title: '碳捕获："千分之四"提倡的使命是改造土壤。',
            date: new Date('2024-07-01T00:00:00.000+00:00'),
            address: 'emir.com'
        },
    },
    {
        envContentMinImgData: [
            {
                id: 1,
                type: '材料',
                imageUrl: img01,
                title: '碳捕获："千分之四"提倡的使命是改造土壤。',
                date: new Date('2024-07-01T00:00:00.000+00:00'),
                address: 'emir.com',
                ddddd: '碳捕获："千分之四"倡议的使命是改造土壤。'
            },
            {
                id: 2,
                type: '材料',
                imageUrl: img01,
                title: '碳捕获："千分之四"提倡的使命是改造土壤。',
                date: new Date('2024-07-01T00:00:00.000+00:00'),
                address: 'emir.com',
                ddddd: '碳捕获："千分之四"倡议的使命是改造土壤。'
            },
        ],
        envContentMaxImgData:
        {
            id: 1,
            type: '材料',
            imageUrl: img01,
            title: '碳捕获："千分之四"提倡的使命是改造土壤。',
            date: new Date('2024-07-01T00:00:00.000+00:00'),
            address: 'emir.com'
        },
    },
])

const envContentSuccessStoriesData = reactive<envContentSucessStoriesData[]>([
    {
        id: 1,
        imageUrl: img02,
        title: '碳捕获："千分之四"提倡的使命是改造土壤。',
        date: new Date('2024-07-01T00:00:00.000+00:00'),
        address: 'emir.com'
    },
    {
        id: 2,
        imageUrl: img01,
        title: '碳捕获："千分之四"提倡的使命是改造土壤。',
        date: new Date('2024-07-01T00:00:00.000+00:00'),
        address: 'emir.com'
    },
    {
        id: 1,
        imageUrl: img01,
        title: '碳捕获："千分之四"提倡的使命是改造土壤。',
        date: new Date('2024-07-01T00:00:00.000+00:00'),
        address: 'emir.com'
    },
    {
        id: 1,
        imageUrl: img01,
        title: '碳捕获："千分之四"提倡的使命是改造土壤。',
        date: new Date('2024-07-01T00:00:00.000+00:00'),
        address: 'emir.com'
    }
])

const total = ref(1000)
const currentPage = ref(1)
const pageSize = ref(3)

// 分页变化变量
const pagingCarouselData = reactive<pagingCarouselDataType>({
    currentPage: currentPage.value,
    pageSize: 3,
})

const pagingSucessStoriesData = reactive<pagingCarouselDataType>({
    currentPage: currentPage.value,
    pageSize: 4,
})

// 三接口并行请求
const loadAllEnvContentData = () => {
    return Promise.all([
        getEnvContentCarouselResponseData(),
        getEnvContentSpotNewResponseData(),
        getEnvContentSucessStoriesData()
    ])
}

// 分页变化时的处理函数
const handleCurrentChange = (current: number) => {
    currentPage.value = current;
    pagingCarouselData.currentPage = current;
    pagingSucessStoriesData.currentPage = current;
    loadAllEnvContentData()
}

const getEnvContentCarouselResponseData = async () => {
    try {
        const res: envContentCarouselResponseDataType = await reqEnvContentCarouselData(pagingCarouselData);
        if (res.code == 200 && res.data) {
            envContentCarouselData.splice(0, envContentCarouselData.length, ...res.data.data);
            total.value = res.data.total;
            // console.log(res.data.total);
        }
    } catch (error) {
        console.error('请求轮播图数据时发生错误:', error);
    }
}

const getEnvContentSpotNewResponseData = async () => {
    try {
        const res: envContentSpotNewResponseDataType = await reqEnvContentSpotNewData(pagingCarouselData);
        if (res.code == 200 && res.data) {
            console.log(res.data.data);
            envContentSpotNewData.splice(0, envContentSpotNewData.length, ...res.data.data);
        }
    } catch (error) {
        console.error('请求最新消息时发生错误:', error);
    }
}

const getEnvContentSucessStoriesData = async () => {
    try {
        const res: envContentSucessStoriesDataResponseDataType = await reqEnvContentSucessStoriesData(pagingSucessStoriesData);
        if (res.code == 200 && res.data) {
            envContentSuccessStoriesData.splice(0, envContentSuccessStoriesData.length, ...res.data);
        }
    } catch (error) {
        console.error('请求成功案例时发生错误:', error);
    }
}

onMounted(() => {
    loadAllEnvContentData()
});
</script>

<template>
    <div class="maxBox">
        <div class="carousel">
            <Carousel :carousel-data="envContentCarouselData"></Carousel>
        </div>
        <div class="moreContent">
            <SpotNew :spotNewData="envContentSpotNewData"></SpotNew>
            <SuccessStories :SuccessStoriesData="envContentSuccessStoriesData"></SuccessStories>
        </div>
        <div class="pagination-container">
            <el-pagination background layout="pager" :total="total" v-model:current-page="currentPage"
                v-model:page-size="pageSize" @current-change="handleCurrentChange" />
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

    .pagination-container {
        margin-left: 475px;
        margin-top: 36px;
        margin-bottom: 200px;

        :deep(.el-pagination) {
            & li {
                border-radius: 0 !important;
            }

            // 添加鼠标悬浮时的样式
            & li:not(.disabled):hover {
                color: white;
                background-color: #000000;
                border-radius: 0 !important;
            }
        }

        :deep(.el-pagination .is-active) {
            background-color: #000000 !important;
            border-radius: 0 !important;
        }
    }
}
</style>