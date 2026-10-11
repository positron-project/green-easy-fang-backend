<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import CommentArea from './commentArea/index.vue'
import type { forumResponseDataType, forumDataType } from "@/api/forum/type";
import { reqContentData } from "@/api/forum";
import defaultForumImg from '@/assets/loading.jpg';
import img02 from '@/assets/loading.jpg';

const forumData = ref<forumDataType[]>([
    {
        id: 1,
        type: '能源',
        navType: '精选',
        title: '巴基斯坦需要自主规划清洁能源未来',
        detail: '中国生产的低价电池正推动长期饱受停电困扰的巴基斯坦实现能源转型，但有人担心废旧电池的处理和无法跟上发展速度的人群，泽山·纳西尔写道。',
        source: '泽山·纳西尔',
        numberPeople: 123,
        img: defaultForumImg,
    },
    {
        id: 2,
        type: '环保',
        navType: '精选',
        title: '城市绿化行动：让生活更美好',
        detail: '城市绿化不仅能美化环境，还能改善空气质量，降低城市热岛效应。本文探讨了城市绿化的多种方式及其带来的环境和社会价值。',
        source: '环保周刊',
        numberPeople: 89,
        img: img02,
    },
    {
        id: 4,
        type: '可持续发展',
        navType: '精选',
        title: '循环经济模式下的企业转型',
        detail: '越来越多的企业开始采用循环经济模式，通过废物再利用和资源高效利用来降低成本并减少环境影响。这一转变为企业带来了新的发展机遇。',
        source: '经济观察',
        numberPeople: 156,
        img: defaultForumImg,
    }
]);

// 当前激活的分类
const activeCategory = ref('choiceness');

// 记录每个forumItem的评论区显示状态
const showCommentMap = reactive<Record<number, boolean>>({});

// 记录当前激活的论坛项ID
const activeForumItemId = ref<number | null>(null);

const navType = ref<string>(activeCategory.value);

const commentId = ref<number>();
// 切换分类的方法
const switchCategory = (category: string) => {
    activeCategory.value = category;
    navType.value = category;
    // 根据分类调用对应的请求函数
    getContentData();
};

// 分类配置数组
const categories = [
    { key: 'choiceness', label: '精选' },
    { key: 'hot', label: '热门' },
    { key: 'international', label: '国际' },
    { key: 'user', label: '用户' },
];

const getContentData = async () => {
    try {
        const res: forumResponseDataType = await reqContentData(navType.value);
        if (res.code == 200 && res.data) {
            forumData.value = res.data;
        }
    } catch (error) {
        console.error('请求论坛数据时发生错误:', error);
    }
}

// 切换指定item的评论区显示状态
const toggleComment = async (itemId: number) => {
    // 如果点击的是当前已激活的项，则关闭评论区域
    if (activeForumItemId.value === itemId) {
        showCommentMap[itemId] = false;
        activeForumItemId.value = null;
        return;
    }

    // 保存之前的激活项ID
    const previousActiveId = activeForumItemId.value;

    // 设置新的激活项
    activeForumItemId.value = itemId;

    // 先显示之前被隐藏的图片（如果有的话）
    if (previousActiveId !== null) {
        showCommentMap[previousActiveId] = false;
    }

    // 先设置commentId，确保数据更新完成
    commentId.value = itemId;

    // 等待Vue的响应式更新完成
    await nextTick();

    // 然后显示评论区域
    showCommentMap[itemId] = true;
    // console.log(commentId.value);
};

onMounted(() => {
    getContentData();
});
</script>

<template>
    <div class="maxForumBox">
        <!-- 导航分类 -->
        <div class="navCategory">
            <div v-for="category in categories" :key="category.key" class="navItem"
                :class="{ active: activeCategory === category.key }" @click="switchCategory(category.key)">
                {{ category.label }}
            </div>
        </div>
        <div v-for="item in forumData" :key="item.id" class="forumItem">
            <div class="forumItemMessage" @click.stop="toggleComment(item.id)">
                <div class="message">
                    <div style="color: #39B54A; margin-bottom: 6px; font-size: 14px; margin-left: 4px;"
                        class="messageType">
                        {{ item.type }}
                    </div>
                    <div style="font-size: 2.5rem; line-height: 3rem; margin-bottom: 8px;" class="messageTitle">
                        {{ item.title }}
                    </div>
                    <div style="font-size: 1rem; line-height: 1.5rem; color: #8b8b8b; margin-bottom: 16px;"
                        class="messageDescribe">
                        {{ item.detail }}
                    </div>
                    <div style="display: flex;" class="">
                        <div style="font-size: .875rem; line-height: 1.25rem;" class="messageSource">
                            {{ item.source }}
                        </div>
                        <div style="color: #8b8b8b; margin-left: 12px; font-size: .875rem; line-height: 1.25rem;"
                            class="numberPeople">{{ item.numberPeople }}人看过</div>
                    </div>
                </div>
            </div>
            <div class="forumItemImgBox">
                <CommentArea :comment-id="commentId" v-if="showCommentMap[item.id]" :item-id="item.id" />
                <img v-else class="forumItemImg" :src="item.img || defaultForumImg"
                    :alt="item.title || '论坛图片'">
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.maxForumBox {
    width: 100%;
    // min-height: 200px;

    .navCategory {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        padding-left: 220px;

        .navItem {
            font-size: 20px;
            cursor: pointer;
            margin-right: 36px;

            &:hover {
                color: #39B54A;
            }

            &.active {
                color: #39B54A;
            }
        }
    }

    .forumItem {
        display: flex;
        width: 100%;
        height: 420px;
        cursor: pointer;
        background-color: #F4F6F5;
        margin-bottom: 20px;

        &:hover .forumItemImgBox .forumItemImg {
            transform: scale(1.1);
        }

        .forumItemMessage {
            display: flex;
            align-items: center;
            justify-content: end;
            width: 50%;
            height: 100%;

            .message {
                width: 572px;
                min-height: 50px;
                margin-right: 24px;
            }
        }

        .forumItemImgBox {
            flex: 1;
            height: 100%;
            overflow: hidden;

            .forumItemImg {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: all 0.5s ease;
            }
        }
    }
}
</style>