import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePluginStore = defineStore('plugintore', () => {
  const pluginModules: IPlugin.IPluginModule[] = reactive([])
  const pluginModulesMap = computed(() => {
    return pluginModules.reduce(
      (prev, curr) => {
        prev[curr.id] = curr
        return prev
      },
      {} as Record<string, IPlugin.IPluginModule>
    )
  })
  const clearPluginModules = () => {
    pluginModules.splice(0, pluginModules.length)
  }
  return {
    pluginModules,
    pluginModulesMap,
    clearPluginModules
  }
})
