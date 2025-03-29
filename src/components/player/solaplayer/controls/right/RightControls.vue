<template>
  <transition name="fade">
    <div
      class="controls right-controls"
      v-show="isShowControls()"
      :class="{ 'controls-visible': isShowControls() }"
    >
      <div class="control-group vertical">
        <!-- <span><i class="iconfont icon-airplaytouping"></i></span> -->
        <span @click="toggleDrawer(true)"><i class="iconfont icon-mti-xiazai2"></i></span>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { isShowControls, toggleDrawer } from '../../action'
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
  gap: 0.8em;
  vertical-align: middle;
  font-size: 1em;
  /* 调整此值可控制文字和图标的大小 */
  line-height: 1.5;
  /* 如有需要可进一步调整行高以细调垂直对齐 */
}
.vertical {
  flex-direction: column;
}
.right-controls {
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
