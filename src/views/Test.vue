<template>
  <MultiSelectList
    v-model:items="items"
    title="多选列顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶表"
    @select="onSelect"
    @cancel="onCancel"
    @delete="deleteVideo"
  >
    <template #item="{ item }">
      <div>{{ item.label }}</div>
    </template>
  </MultiSelectList>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import MultiSelectList from '@/components/multi-select/MultiSelect.vue'

const items = ref([
  { label: '苹果十大的那十大大苏打盛大的大苏打的是大苏打的', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
  { label: '葡萄', value: 'grape' },
  { label: '菠萝', value: 'pineapple' }
])

const onSelect = (selectedItems: string[]) => {
  console.log('选中的项:', selectedItems)
}

const onCancel = () => {
  console.log('已取消多选模式')
}
const deleteVideo = (data: any[]) => {
  items.value = items.value.filter((item) => !data.map((item) => item.value).includes(item.value))
  console.log(data)
}
</script>
