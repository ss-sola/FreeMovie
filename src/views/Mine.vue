<template>
  <IonPage>
    <IonContent>
      <Bubble class="aur"></Bubble>
      <div class="content">
        <!-- <ion-item :detail="true">
          <ion-label>
            <h3>基础设置</h3>
          </ion-label>
        </ion-item> -->
        <ion-item @click="GRouter.toPluginManager()" :detail="true">
          <ion-label>
            <h3>插件管理</h3>
          </ion-label>
        </ion-item>
        <ion-item @click="GRouter.toFolder()" :detail="true">
          <ion-label>
            <h3>下载管理</h3>
          </ion-label>
        </ion-item>
        <ion-item @click="GRouter.toAbout()" :detail="true">
          <ion-label>
            <h3>关于</h3>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-checkbox @ionChange="checkUp" v-model="check">
            <ion-label>
              <h3>开发者模式</h3>
            </ion-label>
          </ion-checkbox>
        </ion-item>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonItem, IonLabel, IonCheckbox, IonContent } from '@ionic/vue'
import Bubble from '@/components/common/Bubble.vue'
import GRouter from '@/router/routes'
import VConsole from 'vconsole'

let vConsole: any = null
const check = ref(false)
function checkUp(value: any) {
  if (check.value) {
    vConsole = new VConsole()
  } else {
    vConsole.destroy()
  }
}
</script>

<style scoped>
.aur {
  height: 35%;
  width: 100vw;
  overflow: hidden;
}

.content {
  padding-top: 25px;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;

  background: #fff;
  transform: translateY(-25px);
}
</style>
