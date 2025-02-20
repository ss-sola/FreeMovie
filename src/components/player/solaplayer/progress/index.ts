import { ref, onMounted, onBeforeUnmount, computed, type Ref } from 'vue'
import { player, options } from '../index'




export const currentPercentage = computed(() => {
    return (options.currentTime / options.duration) * 100 || 0
})
export const bufferedPercentage = computed(() => {
    return (options.bufferedEnd / options.duration) * 100 || 0
})

export function seekVideo(e: MouseEvent) {
    const progressContainer = document.querySelector('.progress-bar') as HTMLDivElement

    options.currentTime =
        ((e.clientX - progressContainer.offsetLeft) / progressContainer.clientWidth) * options.duration
    player.currentTime(options.currentTime)
}