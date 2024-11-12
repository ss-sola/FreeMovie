<template>
  <div class="header-contioner">
    <form @submit="search()" @submit.native.prevent class="search">
      <input type="text" v-model="useSearchStore().searchContent.content" placeholder="今天想看点什么呢？" />
      <i @click="search()" class="doSearch iconfont icon-search"></i>
    </form>
    <History></History>
  </div>
</template>

<script setup lang="ts">
import History from '@/components/history/History.vue'
import { ref, onMounted } from 'vue'
import { search } from '@/components/header/action'
import { useSearchStore } from '@/stores/searchStore'


</script>
<style scoped>
.header-contioner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3px 5px 5px 5px;
  max-width: 100vw;
  /* overflow-x: hidden; */
  position: sticky;
  top: 0;
  /* 固定在页面顶部 */
  z-index: 100;
  /* 添加模糊效果 */
  background-color: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(10px);

  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
}

.search {
  height: 30px;
  display: flex;
  flex: auto;
  justify-content: center;
  align-items: center;
  border: 2px solid #4ba4f7;
  border-radius: 8px;
  padding: 0 5px;
  max-width: 521px;
}

.search input {
  height: 100%;
  flex: auto;
  border: none;
  background-color: transparent;
  outline: none;
}
</style>
