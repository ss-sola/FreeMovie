<template>
  <transition name="fade">
    <div
      class="controls bottom-controls"
      v-show="isShowControls()"
      :class="{ 'controls-visible': isShowControls() }"
    >
      <div class="control-group left">
        <span @click="beforeNumber"><i class="iconfont icon-prev"></i></span>

        <span @click="togglePlay"
          ><i
            class="iconfont"
            :class="{ 'icon-bofang': !options.isPlaying, 'icon-bofang2': options.isPlaying }"
          ></i
        ></span>

        <span @click="nextNumber"><i class="iconfont icon-xiayiji"></i></span>
      </div>
      <div class="control-group right">
        <span @click="switchSpeed">x{{ options.playbackRate }}</span>
        <span @click="toggleDrawer()">选集</span>
        <span @click="toggleFullScreen">
          <i
            class="iconfont"
            :class="{
              'icon-quanping': !options.isFullScreen,
              'icon-xiaoping': options.isFullScreen
            }"
          >
          </i>
        </span>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { isShowControls, toggleFullScreen, togglePlay, toggleDrawer } from '../../action'
import { options } from '../../index'
import { switchSpeed, nextNumber, beforeNumber } from './index'
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
.bottom-controls {
  bottom: 0;
  left: 0;
  right: 0;
  height: 3em;
  z-index: 600;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(rgba(65, 63, 63, 0), rgba(0, 0, 0, 0.8));
}
</style>
