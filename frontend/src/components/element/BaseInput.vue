<script setup lang="ts">
const props = defineProps<{
  modelValue: string | number | null
  placeholder?: string
  maxlength?: number | string
  type?: string
  rows?: number
  width?: string | number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
}>()

const handleUpdate = (value: string | number | null) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <ElInput
    v-bind="$attrs"
    :model-value="props.modelValue"
    :placeholder="props.placeholder"
    :maxlength="props.maxlength"
    :type="props.type"
    :rows="props.rows"
    :width="props.width"
    @update:model-value="handleUpdate"
  />
</template>
