<template>
  <div class="video-download-manager">
    <div v-if="videos.length === 0">当前文件夹没有视频</div>
    <IonList v-else>
      <IonItem v-for="video in videos" :key="video.id">
        <IonThumbnail slot="start">
          <img :src="video.thumbnail" alt="video thumbnail" />
        </IonThumbnail>
        <IonLabel>
          <h3>{{ video.title }}</h3>
          <IonProgressBar :value="video.progress / 100"></IonProgressBar>
        </IonLabel>
        <IonButton
          slot="end"
          color="secondary"
          :disabled="video.isCompleted"
          @click="toggleDownload(video.id)"
        >
          {{ video.isDownloading ? '暂停' : '下载' }}
        </IonButton>
      </IonItem>
    </IonList>
  </div>
</template>

<script setup lang="ts">
import { IonItem, IonLabel, IonList, IonProgressBar, IonThumbnail, IonButton } from '@ionic/vue'
import { computed, ref, onMounted, watch } from 'vue'
import { addVideo, getVideosByFolder, getAllVideos, getAllFolders } from '@/sqlite/folder'
import type { Video } from '@/types/download'

const props = defineProps<{
  folderId: number
}>()

const videos = ref<Video[]>([])
onMounted(async () => {
  videos.value = await getVideosByFolder(props.folderId)
  console.log(videos)
})
// 获取当前文件夹的视频
// const videos = computed(() => {
//   if (props.folderId === null) return [];
//   const folder = foldersStore.allFolders.find((f) => f.id === props.folderId);
//   return folder?.videos || [];
// });

// 保存每个视频的定时器
const intervals = ref<Record<number, number>>({})

// 切换下载状态
const toggleDownload = (videoId: number) => {
  const video = videos.value.find((v) => v.id === videoId)
  if (!video) return

  if (video.isDownloading) {
    // 暂停下载
    video.isDownloading = false
    clearInterval(intervals.value[videoId])
    delete intervals.value[videoId]
  } else {
    // 开始下载
    video.isDownloading = true

    intervals.value[videoId] = window.setInterval(() => {
      if (!video.isDownloading) {
        clearInterval(intervals.value[videoId])
        delete intervals.value[videoId]
        return
      }

      if (video.progress >= 100) {
        video.isDownloading = false
        video.isCompleted = true
        video.progress = 100
        clearInterval(intervals.value[videoId])
        delete intervals.value[videoId]
      } else {
        video.progress += 10 // 每次增加 10%
      }
    }, 500) // 每 500 毫秒更新一次进度
  }
}
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
</style>
