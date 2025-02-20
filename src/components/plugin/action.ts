import { popoverController } from '@ionic/vue'
import Confirm from '@/components/common/Confirm.vue'
import { deletePlugin, updatePlugin } from '@/service/plugin'
async function doRemove(plugin: IPlugin.IPluginModule) {
  const popover = await popoverController.create({
    component: Confirm,
    translucent: true,
    componentProps: {
      title: '确定要删除此插件吗？'
    }
  })

  popover.present()

  const { data } = await popover.onDidDismiss()
  if (data && data.dismissed) {
    deletePlugin(plugin.id)
    Toast('删除成功')
  }
}
async function doUpdate(plugin: IPlugin.IPluginModule) {
  console.log(plugin)
  const url = plugin.srcUrl
  if (!url) {
    Toast('插件更新地址为空')
    return
  }
  const res = await fetch(url)
  if (!res || !res.ok) {
    Toast('更新失败')
    throw new Error('fetch error')
  }
  const content = await res.text()
  await updatePlugin(plugin.id, content)
}

export { doRemove, doUpdate }
