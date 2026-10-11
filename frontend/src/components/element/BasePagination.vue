<script setup lang="ts">
const props = defineProps<{
  total: number
  currentPage: number
  pageSize: number
}>()

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'current-change', value: number): void
}>()

const handleCurrentChange = (page: number) => {
  emit('update:currentPage', page)
  emit('current-change', page)
}

const handlePageSizeChange = (size: number) => {
  emit('update:pageSize', size)
}
</script>

<template>
  <el-pagination
    background
    layout="pager"
    :total="props.total"
    :current-page="props.currentPage"
    :page-size="props.pageSize"
    @update:current-page="handleCurrentChange"
    @update:page-size="handlePageSizeChange"
  />
</template>
