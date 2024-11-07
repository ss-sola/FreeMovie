import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
const historyJson = localStorage.getItem('solamovie-history') || '[]'

export const useHistoryStore = defineStore('historyStore', () => {
  let playHistory: IMovie.IMovieSource[] = reactive(JSON.parse(historyJson))
  playHistory = playHistory.slice(0, 15)
  function sliceHistory() {
    playHistory = playHistory.slice(0, 15)
  }
  return {
    playHistory,
    sliceHistory
  }
})
