import { useSearchStore } from '@/stores/searchStore'
import { usePluginStore } from '@/stores/pluginStroe'
import { putPluginIdToBase } from '@/service/plugin'
function showSelf(index: number) {
  const searchResultStore = useSearchStore()

  searchResultStore.showSelf(index)

  const tabs: HTMLDivElement | null = document.querySelector('.tabs')
  if (!tabs) return
  const tabList = tabs.querySelectorAll('.tab')
  tabs.style.whiteSpace = ''
  tabList[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
}
function showMore() {
  const tabs: HTMLDivElement | null = document.querySelector('.tabs')
  if (!tabs) return
  if (tabs.style.whiteSpace == 'nowrap' || tabs.style.whiteSpace == '') {
    tabs.style.whiteSpace = 'break-spaces'
  } else {
    tabs.style.whiteSpace = ''
  }
}
async function handleRefresh(event: any) {
  const searchStore = useSearchStore()
  const modelData = searchStore.searchResult
  const searchContent = searchStore.searchContent
  for (const item of modelData) {
    if (!item.active) continue
    //item.datas = []
    const pluginModule = usePluginStore().pluginModulesMap[item.pluginId]
    if (pluginModule.search) {
      const resData = (await pluginModule.search(searchContent.content, 1)).data
      putPluginIdToBase(resData, pluginModule)
      item.datas = resData
      item.count = resData.length
    }
  }
  if (event.target) {
    event.target.complete()
  }
}
export { showSelf, showMore, handleRefresh }
