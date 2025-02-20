<template>
  <IonPage>
    <SolaPlayer></SolaPlayer>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar
} from '@ionic/vue'
import { defineComponent, onMounted } from 'vue'
import SolaPlayer from '@/components/player/solaplayer/SolaPlayer.vue'
import { analysis } from '@/plugin/webView'
</script>
