<template>
  <IonPage>
    <IonContent>
      <MultiSelectList v-model:items="childFolders" :title="folderName" @delete="deleteData">
        <template #item="{ item, isSelecting }">
          <div class="item-solt" @click="!isSelecting && navigateToFolder(item.id, item.name)">
            {{ item.name }}
          </div>
        </template>
      </MultiSelectList>

      <VideoDownload v-if="hasParent" :folderId="currentFolderId" />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IonPage, IonItem, IonLabel, IonContent, IonIcon, IonList, IonButton } from '@ionic/vue'
import { getSubFolders, addFolder, getAllFolders } from '@/sqlite/folder'
import MultiSelectList from '@/components/multi-select/MultiSelect.vue'
import VideoDownload from '@/components/folder-list/VideoDownload.vue'
import type { Folder, Video } from '@/types/download'
import { deleteFolders } from '@/service/video'
const route = useRoute()
const router = useRouter()
const currentFolderId = ref(Number(route.params.id))
const childFolders = ref<Folder[]>([])
// 当前文件夹名称
const folderName = computed(() =>
  route.params.folderName ? (route.params.folderName as string) : '下载目录'
)

// 是否有父文件夹
const hasParent = computed(() => currentFolderId.value !== 0)

// 新建文件夹
const createNewFolder = async () => {
  const name = prompt('请输入文件夹名称：')
  if (name) {
    await addFolder(name, currentFolderId.value) // 添加新文件夹
    fetchFolder() // 重新加载文件夹列表
  }
}
const deleteData = async (data: Folder[]) => {
  await deleteFolders(data)
  fetchFolder()
  console.log(data)
}

// 加载当前文件夹数据
const fetchFolder = async () => {
  childFolders.value = await getSubFolders(currentFolderId.value || 0)
}
// 进入子文件夹
const navigateToFolder = (folderId: number, name: string) => {
  router.push({ name: 'FolderList', params: { id: folderId, folderName: name } })
}
// 初始化
onMounted(async () => {
  await fetchFolder() // 加载当前文件夹数据
})
</script>

<style scoped>
.page-header {
  padding: 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-header h1 {
  margin: 0;
  margin-left: 16px;
  font-size: 18px;
  font-weight: bold;
}

ion-icon {
  color: #666;
}
</style>
