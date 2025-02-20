<template>
  <div class="player" ref="artRef"></div>
</template>
<script setup lang="ts">
import { IonPage } from '@ionic/vue'
import Artplayer from 'artplayer'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'

import { useMovieStore } from '@/stores/movieStore'
import { init } from './index'

Artplayer.CONTEXTMENU = false
//承载player的容器
const artRef = ref<HTMLDivElement | null>(null)
//player实例
let instance: Artplayer | undefined
onMounted(() => {
  if (artRef.value) {
    instance = init(artRef.value)
  }
})
onBeforeUnmount(() => {
  useMovieStore().clearMovieStore()
  if (instance && instance.destroy) {
    instance.destroy(true)
  }
})
</script>
<style scoped>
.player {
  /* max-width: 600px; */
  max-height: 337px;
  /* height: 62vw; */
  aspect-ratio: 16/9;
  overflow-x: hidden;
  margin-bottom: 10px;
  /* transition: transform 0.3s ease; */
  /* 添加过渡效果 */
}

:deep(.art-control-subtitle) {
  padding-right: 5px;
}

:deep(.art-video-player > .art-loading) {
  z-index: 55;
}

:deep(.art-control-subtitle > .art-selector-list) {
  max-height: 160px;
}

:deep(.art-control-aggregate > .art-selector-list) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(calc(100% / 4), 1fr));
  grid-gap: 10px;
  max-width: 260px;
  max-height: 200px;
  position: fixed;
  right: 0;
  left: auto !important;
}

@media (max-width: 500px) {
  :deep(.art-control-aggregate > .art-selector-list) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(calc(100% / 4), 1fr));
    grid-gap: 10px;
    max-width: 200px;
    max-height: 160px;
    position: fixed;
    right: 0;
    left: auto !important;
  }
}

:deep(.art-control-aggregate > .art-selector-list > .art-selector-item) {
  flex-shrink: unset;
  color: #bfbfbf;
  font-size: 13px;
}

:deep(.art-control-aggregate > .art-selector-list > .checked) {
  border: 2px solid #00a1f8;
  border-radius: 5px;
}

:deep(.art-control-subtitle > .art-selector-list > .checked) {
  border: 2px solid #00a1f8;
  border-radius: 5px;
}

:deep(.art-settings) {
  max-height: 160px !important;
}
</style>
