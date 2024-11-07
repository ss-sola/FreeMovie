<template>
  <div ref="contioner" class="contioner">
    <div ref="dragBox" id="dragBox">
      <div v-show="initFinished" ref="spinBox" class="spinBox" id="spinBox">
        <Card class="card" @mouseenter="playSpin(false)" @mouseleave="playSpin(true)"
          v-for="(item, index) in rotationData" :card-style="cardStyle" :data-item="item" :img-lazy="false" :key="index">
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { userRotationStore } from '@/stores/rotationStore'
import { init, cardStyle } from './index'
import { render, playSpin, rotationDataPush } from './action'
import Card from '@/components/card/Card.vue'
const contioner = ref(null)

const rotationData = userRotationStore().rotationData
const initFinished = ref(false)



onMounted(async () => {
  if (contioner.value) {
    await init(contioner.value)
    initFinished.value = true
    render()
  }
})


</script>
<style scoped>
/* perspective指定了观察者与 Z=9 平面的距离，使具有三维位置变换的元素产生透视效果。 */
.contioner {
  height: 100vh;
  /* width: 100vw; */
  overflow: hidden;
  display: flex;
  perspective: 1000px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin: 0 10px 0 10px;
  border-radius: 10px;
}

#dragBox,
.spinBox {
  position: relative;
  display: flex;
  margin: auto;
  transform-style: preserve-3d;
  transform: rotateX(-10deg);
}

.spinBox {
  width: 8vw;
  /* height: 140px; */
  aspect-ratio: 10/13;
  transition:
    transform 2s ease,
    opacity 2s ease;
  transform: rotateY(0deg);
}

.card {
  transform-style: preserve-3d;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0 0 8px #fff;
  image-rendering: pixelated;
}


#dragBox img:hover {
  box-shadow: 0 0 15px #fff;
}


@media (max-width: 420px) {
  .contioner {
    height: 35vh;
  }

  .spinBox {
    width: 12vw;
  }
}
</style>
