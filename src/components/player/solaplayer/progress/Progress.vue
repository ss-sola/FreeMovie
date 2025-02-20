<template>
  <div
    ref="progressContainer"
    class="progress-container"
    :class="{ 'progress-container-bottom': !isShowControls() }"
    @click="seekVideo"
  >
    <span class="currentTime" v-if="isShowControls()">{{
      secondsToTime(options.currentTime)
    }}</span>

    <div class="progress-bar">
      <!-- 缓冲进度 -->
      <div class="buffered-progress" :style="{ width: bufferedPercentage + '%' }"></div>
      <!-- 播放进度 -->
      <div class="current-progress" :style="{ width: currentPercentage + '%' }"></div>
      <!-- 拖动滑块 -->
      <div class="progress-thumb" :style="{ left: currentPercentage + '%' }"></div>
    </div>
    <span class="durationTime" v-if="isShowControls()">{{ secondsToTime(options.duration) }}</span>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { isShowControls, secondsToTime } from '../action'
import { options } from '../index'
import { seekVideo, currentPercentage, bufferedPercentage } from './index'
</script>
<style scoped>
/* 进度条 */
.progress-container {
  position: absolute;
  bottom: 3em; /* 根据底部控制栏高度调整 */
  left: 0;
  right: 0;
  z-index: 600;
  cursor: pointer;
  display: flex;
  gap: 0.5em;
  align-items: center;
  transition: opacity 0.3s ease;
}
.progress-container-bottom {
  bottom: 0;
}
.progress-bar {
  position: relative;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
}

.buffered-progress {
  position: absolute;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  transition: width 0.2s;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.current-progress {
  position: absolute;
  height: 100%;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  background: #0b50dc;
  z-index: 2;
  transition: width 0.2s;
}

.progress-thumb {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #0b50dc;
  border-radius: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  opacity: 0;
  transition: opacity 0.2s;
}

.progress-container:hover .progress-thumb {
  opacity: 1;
}
</style>
