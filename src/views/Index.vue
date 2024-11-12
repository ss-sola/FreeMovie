<template>
  <IonPage>
    <div class="placeholder">&nbsp;</div>
    <IonContent>
      <Header></Header>
      <Rotation></Rotation>
      <Week></Week>
    </IonContent>

  </IonPage>
</template>

<script setup lang="ts">
import Header from '@/components/header/Header.vue';
import Rotation from '@/components/rotation/Rotation.vue';
import Week from '@/components/week/Week.vue';
import { IonPage, IonHeader, IonContent, IonToolbar } from '@ionic/vue';


</script>

<style scoped>
.placeholder {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(10px);
}
</style>
