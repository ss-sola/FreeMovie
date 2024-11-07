import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'

export const userRotationStore = defineStore('rotationStore', () => {
  const rotationStore = {
    speed: 20,
    tX: 0,
    tY: 0
  } as IEnvironment.Rotation
  const rotationData = reactive([]) as IMovie.IMovieItem[]
  return {
    rotationStore,
    rotationData
  }
})
