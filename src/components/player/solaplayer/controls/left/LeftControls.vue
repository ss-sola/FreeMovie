<template>
  <transition name="fade">
    <div
      class="controls left-controls"
      v-show="options.showControls && !options.showRightDrawer"
      :class="{ 'controls-visible': options.showControls && !options.showRightDrawer }"
    >
      <div class="control-group vertical">
        <span @click="options.isLocked = !options.isLocked"
          ><i
            class="iconfont"
            :class="{ 'icon-mti-jiemi': !options.isLocked, 'icon-mti-mima': options.isLocked }"
          ></i
        ></span>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { options } from '../../index'
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
.vertical {
  flex-direction: column;
}
.left-controls {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
