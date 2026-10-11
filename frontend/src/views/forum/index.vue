<script setup lang="ts">
import ForumContent from './forumContent/index.vue'
import MoreCreative from './moreCreative/index.vue'
</script>

<template>
    <div class="maxBox">
        <div class="forumContent">
            <ForumContent></ForumContent>
        </div>
        <div class="moreCreative">
            <MoreCreative></MoreCreative>
        </div>
    </div>
</template>

<style scoped lang="scss">
.maxBox {
    display: flex;
    width: 100%;
    height: 100%;

    .forumContent {
        flex: 1;
        margin-right: 10px;
    }

    .moreCreative {
        width: 300px;
        margin-top: 50px;
        position: sticky;
        top: 150px;
        /* 距离顶部20px时开始固定 */
        align-self: flex-start;
        /* 确保sticky定位生效 */
        max-height: calc(100vh - 40px);
        /* 限制最大高度，避免超出屏幕 */
        overflow-y: auto;
        /* 如果内容过多，允许内部滚动 */
    }
}
</style>