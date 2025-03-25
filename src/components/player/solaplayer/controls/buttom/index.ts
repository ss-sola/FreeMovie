import { player, options } from '../../index'
import { ScreenOrientation } from '@capacitor/screen-orientation'
import { useMovieStore } from '@/stores/movieStore'
//player.src({ type: 'application/x-mpegURL', src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' })



export function nextNumber() {
    const movieStore = useMovieStore().movieStore
    if (!movieStore.activeLine || !movieStore.line) return
    const total = movieStore.line[movieStore.activeLine].total
    for (let i = 0; i < total.length; i++) {
        if (total[i].html != movieStore.activeNumber) continue
        if (i == total.length - 1) {
            Toast(`已经是最后一集了`)
            return
        }
        movieStore.activeNumber = total[i + 1].html
        break
    }

}
export function beforeNumber() {
    const movieStore = useMovieStore().movieStore
    if (!movieStore.activeLine || !movieStore.line) return
    const total = movieStore.line[movieStore.activeLine].total
    for (let i = 0; i < total.length; i++) {
        if (total[i].html != movieStore.activeNumber) continue
        if (i == 0) {
            Toast(`没有上一集`)
            return
        }
        movieStore.activeNumber = total[i - 1].html
        break
    }

}
let i = 2
let speed = [0.5, 1.0, 1.5, 2.0]
export function switchSpeed() {
    options.playbackRate = speed[i++ % speed.length]
    player.playbackRate(options.playbackRate)

}