import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import Artplayer from 'artplayer'
import { useMovieStore } from './movieStore'
import type { ComputedRef } from 'vue'

export const useArtplayerStore = defineStore('artplayerStore', () => {
  const movieStore = useMovieStore().movieStore

  let lastCheckedLineDom = ref<Element>()
  let lastCheckedDom = ref<Element>()

  let lineSelector: ComputedRef<IMovie.ILineItemValue[]> = computed(() => {
    if (!movieStore.line) return []

    return Object.values(movieStore.line)
  })
  let totalSelector: ComputedRef<IMovie.ITotalItem[]> = computed(() => {
    if (!movieStore.activeLine || !movieStore.line) return []
    return movieStore.line[movieStore.activeLine].total
  })

  return {
    lastCheckedLineDom,
    lastCheckedDom,
    totalSelector,
    lineSelector
  }
})
