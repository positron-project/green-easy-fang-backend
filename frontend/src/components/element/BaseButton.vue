<script setup lang="ts">
import type { Component } from 'vue'

const props = withDefaults(defineProps<{
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
  size?: 'large' | 'default' | 'small'
  icon?: Component
  loading?: boolean
  disabled?: boolean
  plain?: boolean
  round?: boolean
  circle?: boolean
  text?: boolean
}>(), {
  type: 'primary',
  size: 'large'
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<template>
  <ElButton
    :type="props.type"
    :size="props.size"
    :icon="props.icon"
    :loading="props.loading"
    :disabled="props.disabled"
    :plain="props.plain"
    :round="props.round"
    :circle="props.circle"
    :text="props.text"
    @click="handleClick"
  >
    <slot />
  </ElButton>
</template>
