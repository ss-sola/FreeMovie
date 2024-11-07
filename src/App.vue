<template>
  <!-- <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" v-if="route.meta.keepAlive" :key="route.path" />
    </keep-alive>
    <component :is="Component" v-if="!route.meta.keepAlive" :keey="route.path" />
  </router-view> -->
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { useRoute, RouterView } from 'vue-router'
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { App } from '@capacitor/app'
import IndexAlert from '@/components/common/IndexAlert.vue'
import { alertController, popoverController } from '@ionic/vue'

checkVersion()
//版本检查
async function checkVersion() {
  try {
    const infoNew = await (await fetch(IConfig.InfoUrl)).json()
    // const infoNew = {
    //   version: '1.0.1',
    //   name: 'FreeMovie',
    //   description: 'FreeMovie',
    //   author: 'FreeMovie',
    //   url: 'https://blog.metasola.cn/freemovie/FreeMovie.apk',
    //   license: 'MIT',
    //   content: '1.0.0版本<br>1.0.0版本发布1.0.0版本发布1.0.0版本发布1.0.0版本发布1.0.0版本发布1.0.0版本发布1.0.0版本发布1.0.0版本发布1.0.0版本发布1.0.0版本发布1.0.0版本发布1.0.0版本发布发布'
    // }
    const newVersion = infoNew.version
    const info = await App.getInfo()
    const activeVersion = info.version
    if (activeVersion !== newVersion) {
      const fVersion = localStorage.getItem("freemovie_version")
      if (fVersion == newVersion) return
      presentAlert(infoNew)
    }
  } catch (error) {
    console.error(error)
  }

  async function presentAlert(infoNew?: any) {
    const popover = await popoverController.create({
      component: IndexAlert,
      translucent: true,
      componentProps: {
        infoNew: infoNew
      }
    })

    popover.present()
  }
}

</script>
<style scoped></style>
