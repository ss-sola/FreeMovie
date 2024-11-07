<template>
    <IonPage>
        <ion-content class="ion-padding">
            <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>

            <p>Pull this content down to trigger the refresh.</p>
        </ion-content>
    </IonPage>
</template>
  
<script setup lang="ts">
import { IonContent, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar } from '@ionic/vue';
import { defineComponent } from 'vue';

const handleRefresh = (event: CustomEvent) => {
    console.log(1111)
};
</script>