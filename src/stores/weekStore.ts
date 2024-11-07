import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'

export const useWeekStore = defineStore('weekStore', () => {
  const weekData = reactive([]) as IEnvironment.Week[]
  return {
    weekData
  }
})
