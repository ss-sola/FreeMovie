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

  const descShowPos = computed(() => {
    let num = 0
    if (movieStore.region) num++
    if (movieStore.director) num++
    if (movieStore.actor) num++
    if (movieStore.updateTime) num++
    if (movieStore.labelMap) {
      let labels = Object.keys(movieStore.labelMap)
      if (labels.length > 0) num += labels.length
    }
    console.log(num)
    return num >= 2
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
    movieHashTotal,
    descShowPos
  }
})
