<template>
  <transition name="fade">
    <!-- 顶部控制栏 -->
    <div
      class="controls top-controls"
      v-show="isShowControls()"
      :class="{ 'controls-visible': isShowControls() }"
    >
      <div class="control-group left">
        <span @click="goBack"><i class="iconfont icon-fanhui1"></i></span>
        <span class="video-title"> {{ movieStore.title }} </span>
        <span>{{ movieStore.activeNumber }}</span>
      </div>
      <div class="control-group right">
        <span class="time">{{
          new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // 使用24小时制
          })
        }}</span>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { isShowControls, toggleFullScreen } from '../../action'
import { options } from '../../index'
import { useMovieStore } from '@/stores/movieStore'

const movieStore = useMovieStore().movieStore
function goBack() {
  console.log(options)
  if (options.isFullScreen) toggleFullScreen()
  else window.history.back()
}
</script>
<style scoped>
.controls {
  position: absolute;
  padding: 10px;
  display: flex;
  opacity: 0;
  z-index: 500;
}

.controls-visible {
  opacity: 1;
}
.control-group {
  display: flex;
  align-items: center;
  gap: 1em;
  vertical-align: middle;
  font-size: 1em;
  /* 调整此值可控制文字和图标的大小 */
  line-height: 1.5;
  /* 如有需要可进一步调整行高以细调垂直对齐 */
}
.top-controls {
  top: 0;
  left: 0;
  right: 0;
  z-index: 600;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(65, 63, 63, 0));
}
</style>
