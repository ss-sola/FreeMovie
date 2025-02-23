/// <reference path="./types/config.d.ts" />
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index'
import { Capacitor } from '@capacitor/core'
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite'
//全局css
import './assets/css/me.css'
import './assets/icon/iconfont.css'
//懒加载
import VueLazyload from 'vue-lazyload'
import { initAll } from './utils/initAll'
import vSlidein from '@/utils/vInstructions/vSlideIn'
import { defineCustomElements } from '@ionic/pwa-elements/loader'

import { IonicVue } from '@ionic/vue'
/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

const platform = Capacitor.getPlatform()
customElements.define('jeep-sqlite', JeepSqlite)

defineCustomElements(window)

const app = createApp(App)
app.use(VueLazyload, {
  preLoad: 0,
  error: '',
  loading: '',
  attempt: 1
})
app.use(IonicVue)
app.use(createPinia())
app.use(router)

if (platform == 'web') {
  window.addEventListener('DOMContentLoaded', async () => {
    const jeepEl = document.createElement('jeep-sqlite')
    document.body.appendChild(jeepEl)
    await customElements.whenDefined('jeep-sqlite')
  })
}
app.directive('slideIn', vSlidein)

initAll()
  .then(router.isReady)
  .then(() => {
    app.mount('#app')
  })
  .catch(() => {
    app.mount('#app')
  })
