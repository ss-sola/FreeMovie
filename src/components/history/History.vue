<template>
    <div class="history">
        <i @click="showHistory" class="iconfont icon-time"></i>

        <i @click="GRouter.toMine()" class="iconfont icon-wode1"></i>

        <div class="history-contioner" v-show="historyShow">
            <div class="history-main">
                <div class="history-header">
                    <i class="iconfont icon-lishixiao"></i>
                    <strong>我的观影记录</strong>
                </div>
                <div class="history-content">
                    <div @click="playHistory(item)" class="item" v-for="item in historyData">
                        <span class="item-title">{{ item.title }}</span>
                        <span class="item-tag">{{ item.activeNumber }}</span>
                    </div>
                </div>
                <div @click="clearHistory" class="history-clear">清空</div>
            </div>
        </div>
        <Mask v-show="historyShow" @click="hideHistory"></Mask>
    </div>
</template>

<script setup lang="ts">
import { useMovieStore } from '@/stores/movieStore'
import { ref } from 'vue'
import { clearHistory } from './action'
import { useHistoryStore } from '@/stores/historyStore'
import GRouter from '@/router/routes'
import Mask from '@/components/common/Mask.vue'


const historyData = useHistoryStore().playHistory
const historyShow = ref(false)
function showHistory() {
    historyShow.value = true
}
function hideHistory() {
    historyShow.value = false
}
function playHistory(item: IMovie.IMovieSource) {
    GRouter.toPlay()
    hideHistory()
    console.log(historyShow)
    const movieStore = useMovieStore().movieStore
    Object.assign(movieStore, item)
}

</script>

<style scoped>
.history {
    padding: 5px 0 5px 5px;
    position: relative;
}

.history>i {
    font-size: 30px;
    cursor: pointer;
}

.history-contioner {
    position: absolute;
    right: 0;
    width: 310px;
    background-color: #fff;
    z-index: 110;
    border-radius: 8px;
}

.history-main {
    padding: 10px 15px 10px 15px;
}

.history-main>div {
    padding-bottom: 5px;
}

.history-header {
    display: flex;
    align-items: center;
    position: relative;
}

.history-header::before {
    content: '';
    border-left: 1px dashed #dbdee2;
    position: absolute;
    left: 14px;
    bottom: 0;
    height: 50%;
    z-index: -1;
}

.history-header>i {
    font-size: 18px;
    width: 35px;
    text-indent: 5px;
    margin: 0;
    vertical-align: -1px;
    height: 100%;
    color: #e50914;
}

.history-content {
    max-height: 167px;
    overflow-y: auto;
}

.item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 13px;
    padding: 5px 5px 5px 0;
    cursor: pointer;
}

.item::after {
    content: '';
    border-left: 1px dashed #dbdee2;
    position: absolute;
    left: 14px;
    top: 0;
    height: 100%;
    z-index: -1;
}

.item::before {
    content: '';
    /* 必须设置 content 属性，伪元素才会显示 */
    position: absolute;
    top: 0;
    right: 0;
    width: 90%;
    height: 1px;
    /* 边框高度 */
    background-color: #f1f2f3;
    /* 边框颜色 */
}

.item :hover {
    color: #e50914;
    /* 边框颜色 */
}

.item-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #282828;
    padding: 5px 5px 2px 35px;
}

.item-title:hover::before {
    background-color: #e50914;
}

.item-title::before {
    content: '';
    height: 9px;
    width: 9px;
    display: inline-block;
    position: absolute;
    left: 9px;
    border: 1px solid #e50914;
    background: #fff;
    border-radius: 50%;
    top: 11px;
}

.item-tag {
    color: #a0a0a0 !important;
    overflow: hidden;
    max-width: 24%;
    min-width: 18%;
    font-size: 12px;
    text-align: right;
}

.history-clear {
    background: #f3f5f7;
    border-radius: 8px;
    text-align: center;
    padding-bottom: 0 !important;
    padding: 0 10px;
    line-height: 30px;
    height: 30px;
    font-size: 13px;
    cursor: pointer;
}

.history-clear:hover {
    background-color: #ffddd5;
    color: #e50914;
}

::-webkit-scrollbar {
    width: 3px;
    /* 设置滚动条的宽度 */
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    /* 设置滚动条轨道的背景颜色 */
    border-radius: 8px;
}

::-webkit-scrollbar-thumb {
    background: #888;
    /* 设置滚动条滑块的背景颜色 */
}
</style>
