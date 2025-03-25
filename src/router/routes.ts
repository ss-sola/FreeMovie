import router from './index'

export class GRouter {
  toSearch() {
    router.push('/search')
  }
  toSearchRes() {
    if (location.pathname.includes('play')) return
    router.push('/play')
  }
  async toPlay() {
    await router.push('/play')
  }
  back() {
    router.back()
  }
  toPluginManager() {
    router.push('/plugin')
  }
  toMine() {
    router.push('/mine')
  }
  toAbout() {
    router.push('/about')
  }
  toFolder() {
    router.push('/folderList/0/根文件夹')
  }
}
const EC = new GRouter()

export default EC
