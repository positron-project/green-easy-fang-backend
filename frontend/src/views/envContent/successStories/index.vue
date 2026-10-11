<script setup lang="ts">
import type { envContentSucessStoriesData } from '@/api/envContent/type'
import { formatEnvContentDate } from '@/utils/formatDate'
import { useRouter } from 'vue-router'
import envImg from '@/assets/envContent/envImg.jpg'

const router = useRouter()
const props = defineProps<{
    SuccessStoriesData: envContentSucessStoriesData[]
}>()

// 导航到详情页函数
const navigateToDetail = (id: number) => {
    router.push({
        name: 'successStoriesDetail',
        params: { id }
    })
}
</script>

<template>
    <div class="maxbox">
        <div class="mainTitle">
            成功案例
        </div>
        <div class="content">
            <div v-for="item in props.SuccessStoriesData" :key="item.id" class="contentItem">
                <div @click="navigateToDetail(item.id)" style="text-decoration: none; color: inherit; cursor: pointer;">
                    <div class="img_more">
                        <div class="imgBox">
                            <img class="img" :src="item.imageUrl" alt="" loading="lazy">
                        </div>
                        <div class="moreInformation">
                            <div style="font-size: 16px; line-height: 1.333em; margin-bottom: 6px; cursor: pointer;"
                                class="title">{{ item.title }}</div>
                            <div style="font-size: 12px; color: #8b8b8b; margin-bottom: 4px;" class="date">{{
                                formatEnvContentDate(item.date) }}
                            </div>
                            <div style="font-size: 12px; color: #8b8b8b;" class="address">通过 {{ item.address }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="envImgBox">
                <img class="envImg" :src="envImg" alt="" loading="lazy">
            </div>
            <div class="mainTitle">
                关于我们
            </div>
            <div style="margin-top: 36px;" class="aboutUs">
                <div style="font-weight: 600; margin-bottom: 15px;" class="title">我们相信二手交易的力量</div>
                <div style="font-size: 15px; line-height: 1.6em;" class="text">
                    “如果持续过度消费新品，到2050年，因生产新品而产生的资源浪费与碳排放，将超出地球可承载的极限。”
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.maxbox {
    width: 32%;
    min-height: 200px;

    .mainTitle {
        width: 100%;
        height: 40px;
        font-size: 24px;
        margin-bottom: 36px;
        border-bottom: 1px solid #000;
    }

    .content {
        width: 100%;

        .contentItem {
            width: 100%;
            height: 80px;
            margin-bottom: 18px;

            .img_more {
                display: flex;
                width: 100%;
                height: 100%;

                &:hover .imgBox .img {
                    transform: scale(1.15);
                }

                .imgBox {
                    width: 123px;
                    height: 80px;
                    margin-right: 24px;
                    cursor: pointer;
                    flex-shrink: 0;
                    overflow: hidden;

                    .img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: transform 0.5s ease;
                    }
                }
            }
        }
    }

    .envImgBox {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 394px;

        .envImg {
            width: 247px;
            height: 247px;
            border-radius: 50%;
            object-fit: cover;
        }
    }
}
</style>