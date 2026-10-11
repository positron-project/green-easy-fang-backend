<script setup lang="ts">
const props = withDefaults(defineProps<{
  autoUpload?: boolean
  showFileList?: boolean
  accept?: string
  onChange?: (uploadFile: any, uploadFiles: any[]) => void
}>(), {
  autoUpload: false,
  showFileList: false
})

const emit = defineEmits<{
  (e: 'change', uploadFile: any, uploadFiles: any[]): void
}>()

const handleChange = (uploadFile: any, uploadFiles: any[]) => {
  if (props.onChange) {
    props.onChange(uploadFile, uploadFiles)
  }
  emit('change', uploadFile, uploadFiles)
}
</script>

<template>
  <ElUpload
    v-bind="$attrs"
    :auto-upload="props.autoUpload"
    :show-file-list="props.showFileList"
    :accept="props.accept"
    :on-change="handleChange"
  >
    <slot />
  </ElUpload>
</template>
