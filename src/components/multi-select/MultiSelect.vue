<template>
  <ion-page>
    <!-- 头部导航栏 -->
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="primary" @click="router.back()">返回</ion-button>
        </ion-buttons>
        <ion-title class="align-center">{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button :class="{ trans: !isSelecting }" color="primary" @click="cancelSelection"
            >取消</ion-button
          >
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- 内容区域 -->
    <ion-content>
      <ion-list>
        <ion-item
          v-for="item in items"
          :key="item.value"
          @touchstart="startPress(item.value)"
          @touchend="endPress"
          style="--padding-start: 0"
        >
          <div
            @click="toggleSelect(item.value)"
            class="item-container"
            :class="{ active: isSelecting }"
          >
            <!-- 左侧多选框 -->
            <div v-show="isSelecting" class="checkbox-wrapper">
              <ion-checkbox :checked="selected.includes(item.value)" />
            </div>

            <!-- 右侧内容插槽 -->
            <slot name="item" :isSelecting="isSelecting" :item="item">{{ item.label }}</slot>
          </div>
        </ion-item>
      </ion-list>
    </ion-content>

    <!-- 底部操作栏 -->
    <ion-footer v-if="isSelecting">
      <ion-toolbar style="--padding-start: 1em; --padding-end: 1em">
        <!-- 全选按钮 -->
        <ion-checkbox
          slot="start"
          label-placement="end"
          :checked="isAllSelected"
          @ionChange="toggleSelectAll"
          >全选</ion-checkbox
        >

        <!-- 删除按钮 -->
        <span slot="end" class="delete-label" @click="deleteSelected">
          删除 ({{ selected.length }})
        </span>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonButtons,
  IonFooter
} from '@ionic/vue'

// Props
const props = defineProps<{
  items: any[] // 数据列表s
  title?: string // 标题
}>()

// Emits
const emit = defineEmits<{
  (e: 'delete', value: any[]): void
  (e: 'select', value: string[]): void
  (e: 'cancel'): void
}>()

const router = useRouter()

// 选中的项
const selected = ref<string[]>([])

// 是否进入多选模式
const isSelecting = ref(false)

// 计算是否已全选
const isAllSelected = computed(() => selected.value.length === props.items.length)

// 长按定时器
let pressTimer: NodeJS.Timeout | null = null

// 监听长按，进入多选模式
const startPress = (value: string) => {
  pressTimer = setTimeout(() => {
    isSelecting.value = true
    if (!selected.value.includes(value)) {
      selected.value.push(value)
      emit('select', selected.value)
    }
  }, 500) // 500ms 长按触发
}

// 取消长按
const endPress = () => {
  if (pressTimer) clearTimeout(pressTimer)
}

// 切换选中状态
const toggleSelect = (value: string) => {
  if (!isSelecting.value) return
  if (selected.value.includes(value)) {
    selected.value = selected.value.filter((item) => item !== value)
  } else {
    selected.value.push(value)
  }
  emit('select', selected.value)
}

// 切换全选状态
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selected.value = []
  } else {
    selected.value = props.items.map((item) => item.value)
  }
  emit('select', selected.value)
}

// 退出多选模式
const cancelSelection = () => {
  isSelecting.value = false
  selected.value = []
  emit('cancel')
}

// 删除选中项
const deleteSelected = () => {
  const updatedItems = props.items.filter((item) => selected.value.includes(item.value))
  emit('delete', updatedItems)
  selected.value = []
  if (updatedItems.length == props.items.length) {
    cancelSelection()
  }
}
</script>

<style scoped>
ion-item {
  --inner-padding-end: 0;
  overflow: hidden;
}

/* 多选模式下的容器 */
.item-container {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  transition: transform 0.3s ease;
}

/* 动态向右移动内容 */
.item-container.active {
  transform: translateX(1em);
}

/* 左侧多选框，使用 flex 控制布局 */
.checkbox-wrapper {
  margin-right: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* 激活状态显示多选框 */
.item-container.active .checkbox-wrapper {
  opacity: 1;
}

/* 删除标签样式 */
.delete-label {
  color: var(--ion-color-danger);
  cursor: pointer;
  font-weight: bold;
}

.align-center {
  text-align: center;
}
.trans {
  opacity: 0;
}
</style>
