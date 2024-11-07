import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMovieStore = defineStore('movieStore', () => {
  const movieStore = reactive({
    url: '',
    platform: '',
    title: '',
    id: '',
    img: '',
    activeNumber: '',
    activeLine: '',
    line: {},
    playStatus: 'Choose what you like...'
  }) as IMovie.IMovieSource
  const movieHashLine = computed(() => {
    return `${movieStore.platform}_${movieStore.id}`
  })
  const movieHashTotal = computed(() => {
    return `${movieStore.platform}_${movieStore.id}_${movieStore.activeLine}`
  })
  const movieHash = computed(() => {
    return `${movieStore.platform}_${movieStore.id}_${movieStore.activeLine}_${movieStore.activeNumber}`
  })
  function clearMovieStore() {
    movieStore.url = ''
    movieStore.platform = ''
    movieStore.title = ''
    movieStore.id = ''
    movieStore.img = ''
    movieStore.activeNumber = ''
    movieStore.activeLine = ''
    movieStore.line = {}
    movieStore.playStatus = 'Choose what you like...'
  }
  return {
    clearMovieStore,
    movieStore,
    movieHash,
    movieHashLine,
    movieHashTotal
  }
})
