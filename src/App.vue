<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { App } from '@capacitor/app'
import IndexAlert from '@/components/common/IndexAlert.vue'
import { alertController, popoverController } from '@ionic/vue'

checkVersion()
//版本检查
async function checkVersion() {
  try {
    const infoNew = await (await fetch(IConfig.InfoUrl)).json()
    const newVersion = infoNew.version
    const info = await App.getInfo()
    const activeVersion = info.version
    if (!Array.isArray(infoNew.content)) {
      infoNew.content = []
    }
    if (activeVersion !== newVersion) {
      const fVersion = localStorage.getItem(IConfig.IVersionName)
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
