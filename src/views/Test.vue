<template>
  <ion-page>
    <!-- 头部导航栏 -->
    <ion-header>
      <ion-toolbar>
        <ion-title>长按多选</ion-title>
        <ion-buttons slot="end" v-if="isSelecting">
          <ion-button @click="cancelSelection" color="danger">取消</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- 内容区域 -->
    <ion-content>
      <ion-list>
        <ion-item
          v-for="item in options"
          :key="item.value"
          @touchstart="startPress(item.value)"
          @touchend="endPress"
        >
          <div
            @click="toggleSelect(item.value)"
            class="item-container"
            :class="{ active: isSelecting }"
          >
            <!-- 左侧多选框 -->
            <div class="checkbox-wrapper">
              <ion-checkbox
                :checked="selected.includes(item.value)"
                @click.stop="toggleSelect(item.value)"
              />
            </div>

            <!-- 右侧内容 -->
            <ion-label>{{ item.label }}</ion-label>
          </div>
        </ion-item>
      </ion-list>
    </ion-content>

    <!-- 底部操作栏（多选模式下显示） -->
    <ion-footer v-if="isSelecting">
      <ion-toolbar>
        <!-- 全选按钮 -->
        <ion-checkbox slot="start" :checked="isAllSelected" @ionChange="toggleSelectAll"
          >全选</ion-checkbox
        >

        <!-- 删除按钮 -->
        <ion-button
          slot="end"
          color="danger"
          @click="deleteSelected"
          :disabled="selected.length === 0"
        >
          删除 ({{ selected.length }})
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
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

// 数据列表
const options = ref([
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
  { label: '葡萄', value: 'grape' },
  { label: '菠萝', value: 'pineapple' }
])

// 选中的项
const selected = ref<string[]>([])

// 是否进入多选模式
const isSelecting = ref(false)

// 计算是否已全选
const isAllSelected = computed(() => selected.value.length === options.value.length)

// 长按定时器
let pressTimer: NodeJS.Timeout | null = null

// 监听长按，进入多选模式
const startPress = (value: string) => {
  pressTimer = setTimeout(() => {
    isSelecting.value = true
    if (!selected.value.includes(value)) {
      selected.value.push(value)
    }
  }, 500) // 500ms 长按触发
}

// 取消长按
const endPress = () => {
  if (pressTimer) clearTimeout(pressTimer)
}

// 切换选中状态
const toggleSelect = (value: string) => {
  if (!isSelecting.value) return // 非多选模式下不处理
  console.log(value, selected.value)
  if (selected.value.includes(value)) {
    selected.value = selected.value.filter((item) => item !== value)
  } else {
    selected.value.push(value)
  }
}

// 切换全选状态
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selected.value = []
  } else {
    selected.value = options.value.map((item) => item.value)
  }
}

// 退出多选模式
const cancelSelection = () => {
  isSelecting.value = false
  selected.value = []
}

// 删除选中项
const deleteSelected = () => {
  options.value = options.value.filter((item) => !selected.value.includes(item.value))
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
</style>
