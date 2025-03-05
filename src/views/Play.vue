<template>
  <IonPage>
    <Header></Header>
    <IonContent>
      <SolaPlayer></SolaPlayer>
      <Detail></Detail>
      <SearchRes></SearchRes>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import Header from '@/components/header/Header.vue'
import Detail from '@/components/movie-detail/Detail.vue'
import SearchRes from '@/components/search-res/SearchRes.vue'
import { onIonViewWillLeave } from '@ionic/vue'
import SolaPlayer from '@/components/player/solaplayer/SolaPlayer.vue'
import { player } from '@/components/player/solaplayer/index'
onIonViewWillLeave(() => {
  player.pause()
})
// onIonViewDidEnter(() => {
//     console.log('view进入')
// })
// onIonViewWillLeave(() => {
//     console.log('view离开')
// })
</script>

<style scoped></style>
