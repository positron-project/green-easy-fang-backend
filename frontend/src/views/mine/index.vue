<script setup lang="ts">
import { ref } from 'vue'
import type { ContentSettingType } from '../mine/style/mine'
import ContentNav from './contentNav/index.vue'
import UserMessage from './userMessage/index.vue'
import UserSetting from './userSetting/index.vue'

const contentSetting = ref<ContentSettingType>('我的发布')

const showSetting = ref(false)

const switchEmits = () => {
  showSetting.value = true
}

const cancelEmits = () => {
  showSetting.value = false
}

const emitsShowSetting = (type: ContentSettingType) => {
  contentSetting.value = type
}
</script>

<template>
  <div class="bottom">
    <div class="left">
      <ContentNav @changeSetting="switchEmits" @changeShowSetting="emitsShowSetting" />
    </div>
    <div class="right">
      <UserMessage :content-setting="contentSetting" />
    </div>
  </div>
  <!-- 这是个人资料 -->
  <div v-if="showSetting" class="mask"></div>
  <div v-if="showSetting" class="setting">
    <UserSetting @cancelSetting="cancelEmits" />
  </div>
</template>

<style scoped lang="scss">
.bottom {
  display: flex;
  padding: 45px 80px;
  width: 100%;
  height: 100%;
  background-color: #F5F7F9;

  .left {
    width: 210px;
  }

  .right {
    border-radius: 40px;
    width: calc(100% - 200px);
    height: 520px;
  }
}

.setting {
  position: fixed;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  pointer-events: auto;
}
</style>