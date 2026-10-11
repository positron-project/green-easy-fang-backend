<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  title?: string
  width?: string | number
  beforeClose?: (done: () => void) => void
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const handleUpdate = (value: boolean) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <ElDialog
    v-bind="$attrs"
    :model-value="props.modelValue"
    :title="props.title"
    :width="props.width"
    :before-close="props.beforeClose"
    @update:model-value="handleUpdate"
  >
    <slot />
  </ElDialog>
</template>
