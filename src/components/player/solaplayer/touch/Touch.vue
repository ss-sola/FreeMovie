<template>
  <!-- 亮度控制层 -->
  <div
    class="touch-control-overlay"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <transition name="fade">
      <div v-show="options.showBrightness" class="touch-control-overlay__inner">
        <div class="flex-center"><i class="iconfont icon-liangdu"></i></div>
        <div class="flex-center">亮度{{ Math.round(options.brightness * 100) }}%</div>
        <div class="progress-bar">
          <div class="current-progress" :style="{ width: options.brightness * 100 + '%' }"></div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-show="options.showVolume" class="touch-control-overlay__inner">
        <div class="flex-center"><i class="iconfont icon-a-mti-yinliangmti-yuyinshi"></i></div>
        <div class="flex-center">音量{{ Math.round(options.volume * 100) }}%</div>
        <div class="progress-bar">
          <div class="current-progress" :style="{ width: options.volume * 100 + '%' }"></div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-show="options.showProgress" class="touch-control-overlay__inner progress">
        <div class="flex-center">
          <i
            class="iconfont"
            :class="{
              'icon-24gf-backward': options.progress < 0,
              'icon-24gf-forward': options.progress >= 0
            }"
          ></i>
        </div>
        <div class="flex-center">
          {{
            secondsToTime(
              Math.min(Math.max(options.currentTime + options.progress, 0), options.duration)
            )
          }}
          / {{ secondsToTime(options.duration) }}
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onTouchStart, onTouchMove, onTouchEnd } from './index'
import { options } from '../index'
import { secondsToTime } from '../action'
</script>
<style scoped>
/* 亮度控制样式 */
.touch-control-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
}
.flex-center {
  text-align: center;
}
.touch-control-overlay__inner {
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 0.5em 0.8em;
  transform: translate(-50%, -50%);
  width: auto;
  min-width: 6em;
  height: 5.5em;
  background-color: rgba(65, 63, 63, 0.5);
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  font-size: 1em;
  justify-content: space-around;
}
.iconfont {
  font-size: 1.5em;
}
.progress-bar {
  position: relative;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
}
.current-progress {
  height: 0.2em;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  background: #0b50dc;
  z-index: 2;
  transition: width 0.2s;
}
</style>
