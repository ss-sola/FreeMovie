<template>
  <div class="video-download-manager">
    <IonList>
      <IonItem v-for="video in videos" :key="video.id" @click="toggleDownload(video.id)">
        <IonThumbnail slot="start">
          <img :src="video.img" alt="video thumbnail" />
        </IonThumbnail>
        <IonLabel>
          <h3>{{ video.title }}</h3>
          <IonProgressBar
            v-if="!video.isCompleted"
            :buffer="1"
            :value="video.progress"
          ></IonProgressBar>
        </IonLabel>
      </IonItem>
    </IonList>
  </div>
</template>

<script setup lang="ts">
import { IonItem, IonLabel, IonList, IonProgressBar, IonThumbnail, IonButton } from '@ionic/vue'
import { computed, ref, onMounted, watch } from 'vue'
import { videos, initVideos } from '.'
import { toggleDownload } from './action'
const props = defineProps<{
  folderId: number
}>()

onMounted(async () => {
  initVideos(props.folderId)
})
</script>

<style scoped>
.video-download-manager {
  padding: 16px;
  background-color: #f8f9fa;
  border-top: 1px solid #ddd;
}

ion-list {
  margin-top: 16px;
}

ion-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

ion-label h3 {
  font-size: 16px;
  margin: 0;
}

ion-progress-bar {
  margin-top: 8px;
}
ion-progress-bar::part(stream) {
  background-image: radial-gradient(ellipse at center, #e475f3 0%, #e475f3 30%, transparent 30%);
}
</style>
