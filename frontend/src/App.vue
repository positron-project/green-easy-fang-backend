<script setup lang="ts">
</script>

<template>
  <!-- 添加路由过渡效果 -->
  <transition name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
</template>

<style scoped lang="scss">
/* 路由过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>