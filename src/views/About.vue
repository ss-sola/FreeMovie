<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <ion-title
          ><span @click="GRouter.back()"
            ><i class="iconfont icon-fanhui"></i>&nbsp;关于</span
          ></ion-title
        >
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <iframe
        id="iframeId"
        v-show="isLoaded"
        @load="onIframeLoad"
        src="https://blog.metasola.cn/FreeMovie/关于FreeMovie"
      ></iframe>
    </IonContent>
  </IonPage>
</template>
<script setup lang="ts">
import GRouter from '@/router/routes'
import { IonPage, IonHeader, IonContent, IonToolbar, IonTitle, IonFooter } from '@ionic/vue'
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const isLoaded = ref(false)

const onIframeLoad = () => {
  setTimeout(() => {
    isLoaded.value = true
  }, 500)
}
</script>
<style scoped>
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
