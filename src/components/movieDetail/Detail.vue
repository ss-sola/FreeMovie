<template>
    <div class="detail" v-show="movieStore.id">
        <div class="contioner">
            <div class="info">
                <div class="left">
                    <img :src="movieStore.img" alt="">
                </div>
                <div class="right">
                    <div class="status" v-show="movieStore.playStatus">{{ movieStore.playStatus }}</div>
                    <p class="region" v-show="movieStore.region">地区:{{ movieStore.region }}</p>
                    <p class="director" v-show="movieStore.director">导演:{{ movieStore.director }}</p>
                    <p class="actor" v-show="movieStore.actor">主演:{{ movieStore.actor }}</p>
                    <p class="updateTime" v-show="movieStore.updateTime">更新时间:{{ movieStore.updateTime }}</p>
                    <p class="other" v-for="(key, value) in movieStore.labelMap" :key="key">{{ key }}:{{ value }}</p>
                    <p class="desc" v-if="!store.descShowPos">{{ movieStore.desc }}</p>
                </div>
            </div>
            <p class="desc" v-if="store.descShowPos">{{ movieStore.desc }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMovieStore } from '@/stores/movieStore'

const store = useMovieStore()
const movieStore = store.movieStore

</script>

<style scoped>
.detail {
    margin: 10px;
}

img {
    width: 100%;
    aspect-ratio: 5/7;
    border-radius: 10px;
    background-color: #e9ecef;
}

.info {
    display: flex;
    align-items: flex-start;
}

.right {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
}

.status {
    font-size: 14px;
    font-weight: 600;
}

.region,
.director,
.actor,
.updateTime,
.desc {
    font-size: 14px;
    font-weight: 400;
    color: #6c757d;
}

p {
    margin: 3px 0;
}

.desc {
    text-indent: 2em;
}


.left {
    width: 25vw;
    min-width: 25vw;
}
</style>
