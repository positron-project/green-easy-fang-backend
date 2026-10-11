<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue'
import type { maxImgData_minImgDataType } from '@/api/envContent/type'
import { formatEnvContentDate } from '@/utils/formatDate'

const props = defineProps<{
    spotNewData: maxImgData_minImgDataType[]
}>()

const router = useRouter();

const navigateToMinImgDetail = (id: number) => {
    router.push({
        name: 'spotNewMinImgDetail',
        params: { id }
    });
};

const navigateToMaxImgDetail = (id: number) => {
    router.push({
        name: 'spotNewMaxImgDetail',
        params: { id }
    });
};
</script>

<template>
    <div class="maxbox">
        <div class="mainTitle">最新消息</div>
        <div v-for="item in props.spotNewData" class="content">
            <div v-for="items in item.envContentMinImgData" :key="items.id" class="minImgContent">
                <div @click="navigateToMinImgDetail(items.id)" style="cursor: pointer; width: 100%; display: flex;">
                    <div class="minImgBox">
                        <img class="minImg" :src="items.imageUrl" alt="" loading="lazy">
                    </div>
                    <div class="moreInformation">
                        <div style="color: #8b8b8b; font-size: 12px; margin-bottom: 12px;" class="type">{{ items.type }}
                        </div>
                        <div style="font-size: 21px; margin-bottom: 12px; line-height: 1.1em;" class="title">
                            {{ items.title }}</div>
                        <div style="font-size: 15px;  margin-bottom: 12px; line-height: 1.6em;" class="describe">
                            {{ items.ddddd }}</div>
                        <div class="date_more">
                            <div class="data">{{ formatEnvContentDate(items.date) }}</div>
                            <div style="margin: 0 5px; font-size: 10px;" class="divider">|</div>
                            <div class="address">via washington.edu</div>
                            <div style="margin: 0 5px; font-size: 10px;" class="divider">|</div>
                            <p>阅读更多</p>
                            <el-icon style="margin-top: 2px; margin-left: 3px;">
                                <ArrowRight />
                            </el-icon>
                        </div>
                    </div>
                </div>
            </div>
            <div @click="navigateToMaxImgDetail(item.envContentMaxImgData.id)"
                style="cursor: pointer; width: 100%; display: flex;">
                <div class="maxImgContent">
                    <div class="maxImgBox">
                        <img class="maxImg" :src="item.envContentMaxImgData.imageUrl" alt="" loading="lazy">
                        <div class="imageFooter">
                            <div style="margin-bottom: 10px; font-size: 12px; line-height: 1.2em;" class="type">{{
                                item.envContentMaxImgData.type }}</div>
                            <div style="margin-bottom: 12px; font-size: 21px; line-height: 1.2em;" class="title">
                                {{ item.envContentMaxImgData.title }}</div>
                            <div class="date_more">
                                <div class="data">{{ formatEnvContentDate(item.envContentMaxImgData.date) }}</div>
                                <div style="margin: 0 5px; font-size: 10px;" class="divider">|</div>
                                <div class="address">via washington.edu</div>
                                <div style="margin: 0 5px; font-size: 10px;" class="divider">|</div>
                                <p>阅读更多</p>
                                <el-icon style="margin-top: 2px; margin-left: 3px;">
                                    <ArrowRight />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
        border-bottom: 1px solid #000;
    }

    .content {

        .minImgContent {
            display: flex;
            width: 100%;
            height: 267px;
            padding: 36px 0;
            border-bottom: 1px solid #000;

            &:hover .minImgBox .minImg {
                transform: scale(1.1);
            }

            .minImgBox {
                width: 300px;
                height: 195px;
                cursor: pointer;
                flex-shrink: 0;
                overflow: hidden;

                .minImg {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;

                }
            }

            .moreInformation {
                width: 100%;
                padding-left: 24px;

                .date_more {
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    color: #8b8b8b;

                    a {
                        color: #8b8b8b;
                        text-decoration: none;

                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }
            }
        }

        .maxImgContent {
            width: 100%;
            height: 548px;
            padding: 36px 0;
            border-bottom: 1px solid #000;

            .maxImgBox {
                width: 100%;
                height: 100%;
                cursor: pointer;
                flex-shrink: 0;
                overflow: hidden;
                position: relative;

                &:hover .maxImg {
                    transform: scale(1.1);
                }

                .maxImg {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }

                .imageFooter {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    padding: 18px 0 18px 24px;
                    width: 100%;
                    height: 112px;
                    background: rgba(255, 255, 255, 0.4);
                    transition: background-color 0.5s ease;

                    .date_more {
                        display: flex;
                        align-items: center;
                        font-size: 12px;
                        line-height: 1.2em;

                        a {
                            color: #000;
                            text-decoration: none;

                            &:hover {
                                text-decoration: underline;
                            }
                        }
                    }
                }

                &:hover .imageFooter {
                    background: rgba(255, 255, 255, 0.6);
                }
            }
        }
    }
}
</style>