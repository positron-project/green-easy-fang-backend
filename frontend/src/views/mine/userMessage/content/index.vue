<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ContentSettingType } from '../../style/mine'
import Release from '../detail/release/index.vue'
import Favorite from '../detail/goodsContent/index.vue'
import Creative from '../detail/creative/index.vue'

const props = defineProps<{
    contentSetting: ContentSettingType
}>()

const localContentSetting = ref(props.contentSetting)

watch(() => props.contentSetting, (newVal) => {
    localContentSetting.value = newVal
})
</script>

<template>
    <div style="width: 100%; height: 100%;" v-if="localContentSetting === '我的发布'">
        <Release />
    </div>
    <div style="width: 100%; height: 100%;" v-else-if="localContentSetting === '我的收藏'">
        <Favorite />
    </div>
    <div style="width: 100%; height: 100%;" v-else-if="localContentSetting === '我的创作'">
        <Creative />
    </div>
</template>

<style scoped lang="scss"></style>