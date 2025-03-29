<template>
  <ion-content class="ion-padding">
    <div class="info">
      <h2 class="blod">新发布版本:{{ infoNew.version }}</h2>

      <p class="blod" v-if="infoNew.content.length > 0">更新简介:</p>
      <div>
        <ul>
          <li v-for="item in infoNew.content" v-html="item"></li>
        </ul>
      </div>
      <p class="blod">下载地址:</p>
      <a target="_blank" :src="infoNew.url">{{ infoNew.url }}</a>
    </div>

    <div class="btn">
      <ion-button @click="confirm">复制</ion-button>
      <ion-button @click="cancel">关闭</ion-button>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonContent, IonButton, popoverController } from '@ionic/vue'
import { Clipboard } from '@capacitor/clipboard'
const info = defineProps({
  infoNew: {
    type: Object,
    default: {}
  }
})

const isConfirmed = ref(false)

const confirm = async () => {
  localStorage.setItem(IConfig.IVersionName, info.infoNew.version)
  const { type, value } = await Clipboard.read()
  if (value != info.infoNew.version) {
    await Clipboard.write({
      string: info.infoNew.url
    })
  }
  isConfirmed.value = true
  dismiss()
}

const cancel = () => {
  isConfirmed.value = false
  dismiss()
}

const dismiss = async () => {
  await popoverController.dismiss({ dismissed: isConfirmed.value })
}
</script>

<style scoped>
.info {
  max-height: 35vh;
  overflow: auto;
}

h2 {
  margin: 0;
}

.btn {
  /* direction: rtl; */
  display: flex;
  justify-content: space-between;
}
</style>
