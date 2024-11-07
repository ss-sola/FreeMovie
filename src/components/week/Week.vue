<template>
  <div class="top">
    <h2 class="top-left">追番周表</h2>
    <div class="top-right">
      <span :class="{ active: item.active }" @click="chooseWeek(index)" v-for="(item, index) in weekData">{{ item.week
      }}</span>
    </div>
  </div>
  <div class="main" v-for="item in weekData" v-show="item.active">
    <Card v-slide-in v-for="(dataItem, index) in item.dataList" :data-item="dataItem" :key="index"></Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWeekStore } from '@/stores/weekStore'
import { chooseWeek } from './action';
import { init } from './index'
import Card from '@/components/card/Card.vue'

const weekData = useWeekStore().weekData

init()

</script>
<style scoped>
.top {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.top-left {
  margin: 0;
}

.active {
  border-radius: 6px;
  background: #fff;
  font-weight: 700;
  color: #e50914;
}

.top-right {
  background: #e9ecef;
  border-radius: 8px;
  padding: 3px;
  overflow: auto;
  display: flex;
  justify-content: inherit;
}

.top-right>span {
  padding: 0 1.5vw;
  line-height: 34px;
  font-size: 14px;
  display: inline-block;
  border-radius: 8px;
  cursor: pointer;
}

.top-right>span:hover {
  color: #e50914;
}

@media (max-width: 420px) {
  .top-left {
    display: none;
  }

  .top-right {
    flex-grow: 1;
  }
}
</style>
