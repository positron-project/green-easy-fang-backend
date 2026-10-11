<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { pagingDIYDataType, taskDIYDataResponesDataType , taskDIYDataType } from '@/api/task/type'
import { reqTaskDIY } from '@/api/task/index'
import img01 from '@/assets/loading.jpg'

// DIY项目数据
const taskDIYData = ref<taskDIYDataType[]>([
    {
        id: 1,
        title: '废旧塑料瓶改造花盆',
        materials: '废旧塑料瓶、剪刀、颜料、画笔',
        tools: '剪刀、热熔胶枪、尺子',
        steps: [
            '清洗塑料瓶并晾干',
            '裁剪成合适形状',
            '装饰美化',
            '添加排水孔'
        ],
        detailUrl: '#',
        image: img01
    },
    {
        id: 2,
        title: '旧衣物改造环保袋',
        materials: '旧T恤、剪刀、针线',
        tools: '剪刀、缝纫机、尺子',
        steps: [
            '裁剪T恤成方形',
            '缝合底部和两侧',
            '制作提手',
            '装饰美化'
        ],
        detailUrl: '#',
        image: img01
    },
    {
        id: 3,
        title: '纸箱制作收纳盒',
        materials: '废旧纸箱、胶水、包装纸',
        tools: '剪刀、美工刀、尺子',
        steps: [
            '测量并裁剪纸箱',
            '组装成盒子形状',
            '粘贴包装纸装饰',
            '添加分隔板'
        ],
        detailUrl: '#',
        image: img01
    },
    {
        id: 4,
        title: '玻璃瓶制作花瓶',
        materials: '玻璃瓶、麻绳、装饰物',
        tools: '剪刀、热熔胶枪',
        steps: [
            '清洗玻璃瓶并晾干',
            '缠绕麻绳装饰',
            '粘贴装饰物',
            '完成美化'
        ],
        detailUrl: '#',
        image: img01
    }
])

const total = ref(100)
const currentPage = ref(1)
const pageSize = ref(4)

// 分页变化变量
const pagingCarouselData = ref<pagingDIYDataType>({
    currentPage: currentPage.value,
    pageSize: 4,
})

// 分页变化时的处理函数
const handleCurrentChange = (current: number) => {
    currentPage.value = current;
    pagingCarouselData.value.currentPage = current;
    getDIYProjects()
}

const getDIYProjects = async () => {
    try {
        const res: taskDIYDataResponesDataType = await reqTaskDIY(pagingCarouselData.value)
        if (res.code === 200) {
            taskDIYData.value = res.data.data
            total.value = res.data.total
        }
    } catch (error) {
        console.log(error)
    }
}

onMounted(() => {
    getDIYProjects()
})

</script>

<template>
    <div class="DIYMaxBox">
        <div v-for="item in taskDIYData" :key="item.id" class="DIYContentItem">
            <div class="imgBox">
                <img :src="item.image" :alt="item.title">
            </div>
            <div class="DIYContenDetail">
                <div class="title">
                    {{ item.title }}
                </div>
                <div class="content-section">
                    <div class="section-title">材料：</div>
                    <div class="section-content">{{ item.materials }}</div>
                </div>
                <div class="content-section">
                    <div class="section-title">工具：</div>
                    <div class="section-content">{{ item.tools }}</div>
                </div>
                <div class="content-section">
                    <div class="section-title">简要步骤：</div>
                    <div class="section-content">
                        <span v-for="(step, index) in item.steps" :key="index">
                            {{ index + 1 }}. {{ step }}<br>
                        </span>
                    </div>
                </div>
                <div class="link-section">
                    <a :href="item.detailUrl" class="detail-link" target="_blank" rel="noopener noreferrer">点击查看详细教程</a>
                </div>
            </div>
        </div>
    </div>
    <div class="pagination-container">
        <el-pagination background layout="pager" :total="total" v-model:current-page="currentPage"
            v-model:page-size="pageSize" @current-change="handleCurrentChange" />
    </div>
</template>

<style scoped lang="scss">
.DIYMaxBox {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;

    .DIYContentItem {
        width: 500px;
        height: 400px;
        margin-bottom: 24px;
        position: relative;

        .DIYContenDetail {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: rgba(255, 255, 255, 0.9);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;

            .title {
                font-size: 20px;
                font-weight: 600;
                color: #0a0a0a;
                margin-bottom: 15px;
            }

            .content-section {
                margin-bottom: 10px;

                .section-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #39B54A;
                    margin-bottom: 5px;
                }

                .section-content {
                    font-size: 13px;
                    color: #8d8d8d;
                    line-height: 1.4;
                }
            }

            .link-section {
                margin-top: auto;

                .detail-link {
                    display: inline-block;
                    padding: 8px 16px;
                    background: #39B54A;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                    font-size: 14px;
                    transition: background 0.3s ease;

                    &:hover {
                        background: #2d8c3a;
                    }
                }
            }
        }

        &:hover .DIYContenDetail {
            opacity: 1;
            pointer-events: auto;
        }

        &:hover .imgBox img {
            transform: scale(1.1);
        }

        .imgBox {
            width: 100%;
            height: 100%;
            cursor: pointer;
            flex-shrink: 0;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.5s ease;
            }
        }
    }
}

.pagination-container {
    margin-left: 352px;
    margin-top: 36px;
    margin-bottom: 100px;

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
</style>