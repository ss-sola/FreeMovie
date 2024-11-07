<template>
    <div @click="play(dataItem)" class="card">
        <img v-if="imgLazy" v-lazy="dataItem.img" :style="cardStyle.img" alt="" />
        <img v-else :src="dataItem.img" :style="cardStyle.img" alt="" />
        <p :title="dataItem.title" :style="cardStyle.p">{{ dataItem.title }}</p>
        <span :style="cardStyle.span">{{ dataItem.tag }}</span>

    </div>
</template>

<script setup lang="ts">
import { play } from './action'
const props = defineProps({
    dataItem: {
        type: Object as () => IMovie.IMovieBase,
        default: () => ({})
    },
    cardStyle: {
        type: Object,
        default: () => ({})
    },
    imgLazy: {
        type: Boolean,
        default: true
    }
})

</script>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
}

.card>img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    aspect-ratio: 5/7;
    background-color: #e9ecef;
}

.card>p {
    text-align: center;
    color: #555;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    margin: 5px 0 0 0;
}

.card>span {
    position: absolute;
    bottom: 25px;
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    padding: 0 7px;
    border-radius: 10px;
    margin-right: 5px;
    margin-left: 5px;
}
</style>
