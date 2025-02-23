<template>
  <ion-fab id="open-action-sheet" vertical="bottom" horizontal="end">
    <ion-fab-button>
      <ion-icon :icon="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>
  <ion-action-sheet
    @willDismiss="openPopover($event)"
    trigger="open-action-sheet"
    header="安装插件"
    :buttons="actionSheetButtons"
  ></ion-action-sheet>

  <ion-popover :is-open="popoverOpen" @didDismiss="popoverOpen = false">
    <ion-card>
      <ion-card-header>
        <ion-card-title>安装插件</ion-card-title>
      </ion-card-header>

      <ion-card-content>
        <ion-input
          label="请输入url"
          v-model="urlValue"
          inputmode="url"
          type="url"
          :autofocus="true"
          :clear-input="true"
          label-placement="floating"
          fill="outline"
          error-text="不是合法的url"
        ></ion-input>
      </ion-card-content>

      <div class="bottom">
        <ion-button @click="networkInstall" fill="clear">确认</ion-button>
        <ion-button @click="popoverOpen = false" fill="clear">取消</ion-button>
      </div>
    </ion-card>
  </ion-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  IonIcon,
  IonFab,
  IonFabButton,
  IonActionSheet,
  IonInput,
  IonPopover,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/vue'
import { add } from 'ionicons/icons'
import { actionSheetButtons } from './index'
import { didPresent, networkInstallPlugin } from './action'

const popoverOpen = ref(false)
const urlValue = ref('https://blog.metasola.cn/freemovie/source.json')
function openPopover(e: CustomEvent) {
  didPresent(e, { popoverOpen })
}

async function networkInstall() {
  let res = await networkInstallPlugin(urlValue.value)
  if (res) popoverOpen.value = false
}
</script>

<style scoped>
ion-fab {
  position: fixed;
  right: 20px;
  bottom: 50px;
}

:deep(.action-sheet-group) {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

:deep(.action-sheet-title) {
  min-height: unset;
  text-align: center;
  border-bottom: 1px solid #e0e0d0;
}

ion-card {
  margin: 0;
}

ion-card-header {
  text-align: center;
  border-bottom: 1px solid #e0e0d0;
  margin: 16px;
  padding: 0;
}

ion-input {
  min-height: 44px !important;
}

.bottom {
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
}
</style>
