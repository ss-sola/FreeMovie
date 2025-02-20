<template>
  <div
    class="overlay"
    v-show="options.showRightDrawer"
    @click="options.showRightDrawer = !options.showRightDrawer"
  ></div>
  <div class="drawer right-drawer" :class="{ 'drawer-visible': options.showRightDrawer }">
    <div class="drawer-content">
      <div class="drawer-header">
        <span
          class="line-item"
          :class="{
            'active-line': selectedLine ? selectedLine == key : key == movieStore.activeLine
          }"
          v-for="(value, key) in movieStore.line"
          :key="key"
          @click="handleLineClick(key)"
          >{{ key }}</span
        >
      </div>
      <div
        class="drawer-body"
        v-for="(value, key) in movieStore.line"
        v-show="selectedLine ? selectedLine == key : key == movieStore.activeLine"
      >
        <span
          class="episode-item"
          :class="{
            'active-number': movieStore.activeNumber == item.html && key == movieStore.activeLine
          }"
          v-for="(item, index) in value.total"
          :key="index"
          @click="handleNumberClick(key, item.html)"
          >{{ item.html }}</span
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue'
import { options } from '../index'
import { useMovieStore } from '@/stores/movieStore'

const movieStore = useMovieStore().movieStore
const selectedLine: Ref<string | number, string | number> = ref('')

function handleLineClick(key: string | number) {
  selectedLine.value = key
}
function handleNumberClick(key: string | number, number: string) {
  movieStore.activeLine = key as string
  movieStore.activeNumber = number
}
</script>
<style scoped>
/* 遮罩 */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  /* 半透明背景 */
  z-index: 900;
}

/* 抽屉基础样式 */
.drawer {
  position: absolute;
  top: 0;
  bottom: 0;
  /* 可根据需求修改宽度 */
  background: rgba(0, 0, 0, 0.4);
  box-shadow: -2em 0 4em rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;
  overflow-y: auto;
  z-index: 1000;
}

/* 右侧抽屉 */
.right-drawer {
  right: 0;
  width: 60%;
  transform: translateX(100%);
  /* 默认隐藏 */
}

/* 当抽屉可见时 */
.right-drawer.drawer-visible {
  transform: translateX(0);
}

/* 抽屉内容内边距 */
.drawer-content {
  padding: 0 0.2em 0 1em;
  height: 100%;
  font-size: 0.8em;
}

/* 抽屉头部样式 */
.drawer-header {
  border-bottom: 0.1em solid #164da6;
  height: 3em;
  line-height: 3em;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  align-items: center;
  gap: 1em;
}

/* 仅隐藏滚动条（适用于 Webkit 浏览器，如 Chrome） */
.drawer-header::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 */
}
.line-item {
  display: flex;
  align-items: center;
  text-align: center;
  padding: 0 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
/* 抽屉主体样式 */
.drawer-body {
  padding: 10px 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  overflow-y: auto;
  height: calc(100% - 3em);
  gap: 0.5em;
}

/* 每个集数项目样式 */
.episode-item {
  width: 4.5em;
  text-align: center;
  padding: 0.3em;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* 滚动条整体样式 */
*::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度 */
  height: 6px; /* 滚动条高度（横向滚动条） */
  border-radius: 10px;
}

/* 滚动条轨道 */
*::-webkit-scrollbar-track {
  background: #0a3e68; /* 轨道背景颜色 */
}

/* 滚动条滑块 */
*::-webkit-scrollbar-thumb {
  background: #1c7dcc; /* 滑块颜色 */
  border-radius: 10px;
}

.active-line {
  color: #1c7dcc;
}
.active-number {
  border: 1px solid #1c7dcc;
  color: #1c7dcc;
}
</style>
