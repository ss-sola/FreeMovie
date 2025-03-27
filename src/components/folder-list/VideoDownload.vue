<template>
  <div class="video-download-manager">
    <MultiSelectList v-model:items="videos" :title="folderName" @delete="deleteData">
      <template #item="{ item, isSelecting }">
        <div class="item-solt" @click="!isSelecting && toggleDownload(item.id)">
          <IonThumbnail slot="start">
            <img :src="item.img" alt="video thumbnail" />
          </IonThumbnail>
          <div class="info-main">
            <h5 class="title">{{ item.title }}</h5>
            <div class="info-sub">
              <span class="play-icon" @click.stop="nativeToPlay(item)"
                ><i class="iconfont icon-bofang"></i>播放</span
              >
              <span style="color: #95afc0">{{ item.isDownloading ? '下载中' : '已暂停' }}</span>
            </div>
            <IonProgressBar
              v-if="!item.isCompleted"
              :buffer="1"
              :value="item.progress"
            ></IonProgressBar>
          </div>
        </div>
      </template>
    </MultiSelectList>
  </div>
</template>

<script setup lang="ts">
import { IonItem, IonLabel, IonList, IonProgressBar, IonThumbnail, IonCard } from '@ionic/vue'
import MultiSelectList from '@/components/multi-select/MultiSelect.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted, watch } from 'vue'
import { videos, initVideos } from '.'
import { toggleDownload, nativeToPlay } from './action'
import type { Video } from '@/types/download'
import { deleteVideos } from '@/service/video'
import { Downloader } from '@/plugin/downloader'
const props = defineProps<{
  folderId: number
}>()
const route = useRoute()
const folderName = route.params.folderName as string
onMounted(async () => {
  initVideos(props.folderId)
})

const deleteData = async (data: Video[]) => {
  data.forEach(async (video) => {
    await Downloader.pause({ id: video.id })
  })

  await deleteVideos(data)
  initVideos(props.folderId)
  console.log(data)
}
</script>

<style scoped>
.video-download-manager {
  padding: 16px;
  background-color: #f8f9fa;
  border-top: 1px solid #ddd;
}
img {
  padding: 0.1em 0;
  border-radius: 0.5em;
}
ion-progress-bar {
  margin-bottom: 8px;
}
ion-progress-bar::part(stream) {
  background-image: radial-gradient(ellipse at center, #e475f3 0%, #e475f3 30%, transparent 30%);
}
.title {
  margin: 0.5em 0 0 0;
}
.info-main {
  flex: 1;
  padding-left: 0.5em;
}
.info-sub > span {
  font-size: 0.7em;
  color: #0075ff;
  margin-right: 0.5em;
}
</style>
