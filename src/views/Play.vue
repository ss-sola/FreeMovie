<template>
    <IonPage class="full">
        <Header></Header>
        <ArtPlayer />
        <Detail></Detail>
        <SearchRes></SearchRes>
    </IonPage>
</template>

<script setup lang="ts">
import { IonPage } from '@ionic/vue';
import Header from '@/components/header/Header.vue';
import ArtPlayer from '@/components/player/ArtPlayer.vue'
import Detail from '@/components/movieDetail/Detail.vue'
import SearchRes from '@/components/searchRes/SearchRes.vue'
import { onIonViewWillEnter, onIonViewDidEnter, onIonViewWillLeave } from '@ionic/vue'
import Artplayer from 'artplayer'
onIonViewWillLeave(() => {
    Artplayer.instances.forEach((item) => {
        item.pause()
    })
})
// onIonViewDidEnter(() => {
//     console.log('view进入')
// })
// onIonViewWillLeave(() => {
//     console.log('view离开')
// })

</script>

<style scoped></style>
