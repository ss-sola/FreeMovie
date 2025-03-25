<template>
  <div class="video-container" @click="showControls">
    <video
      id="myVideo"
      ref="videoRef"
      preload="auto"
      class="video-js vjs-default-skin vjs-big-play-centered"
    ></video>

    <!-- 顶部控制栏 -->
    <TopControls></TopControls>

    <!-- 新增的进度条部分 -->
    <Progress></Progress>

    <!-- 底部控制栏 -->
    <ButtomControls></ButtomControls>

    <!-- 左侧控制栏 -->
    <LeftControls></LeftControls>

    <!-- 右侧控制栏 -->
    <RightControls></RightControls>

    <!-- 右边抽屉 -->
    <Drawer></Drawer>

    <!-- 亮度控制层 -->
    <Touch></Touch>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, type Ref } from 'vue'
import type VideoJsPlayer from 'video.js/dist/types/player'
import 'video.js/dist/video-js.css'

import { showControls } from './action'
import TopControls from './controls/top/TopControls.vue'
import Progress from './progress/Progress.vue'
import Drawer from './drawer/Drawer.vue'
import Touch from './touch/Touch.vue'
import ButtomControls from './controls/buttom/ButtomControls.vue'
import LeftControls from './controls/left/LeftControls.vue'
import RightControls from './controls/right/RightControls.vue'
import { initPlayer } from '.'
import { switchVideoSource } from './action'

let player: VideoJsPlayer
onMounted(async () => {
  player = initPlayer()
  // switchVideoSource(await getVideoObjectURL())
})
onBeforeUnmount(() => {
  if (player) {
    player.dispose()
  }
})
</script>

<style scoped>
.video-container {
  position: relative;
  /* width: 500px;
  height: 300px; */
  aspect-ratio: 16/9;
  color: aliceblue;
  overflow: hidden;
  font-size: 1em;
}

.video-js {
  width: 100%;
  height: 100%;
  aspect-ratio: 16/9;
}
</style>
