<template>
    <div class="tab-contioner">
        <div class="tabs">
            <span v-for="(val, i) in modelData" @click="showSelf(i)" :class="{ active: val.active }" class="tab">{{
                `${val.name}(${val.count})` }}</span>
        </div>
        <span @click="showMore" class="tab-more">
            <i class="iconfont icon-gengduo"></i>
        </span>
    </div>
    <ion-content class="ion-padding">
        <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
            <ion-refresher-content pulling-text="Pull to refresh" refreshing-spinner="circles"
                refreshing-text="Refreshing..."></ion-refresher-content>
        </ion-refresher>
        <div class="main" v-for="(activeData, index) in modelData" v-show="activeData.active" :key="index">
            <Card v-slide-in v-for="(dataItem, aIndex) in activeData.datas" :data-item="dataItem" :key="aIndex"></Card>
            <div class="empty" v-if="activeData.datas.length == 0">
                <Empty></Empty>
            </div>
        </div>

    </ion-content>
</template>

<script setup lang="ts">
import { IonContent, IonRefresher, IonRefresherContent } from '@ionic/vue';
import Card from '@/components/card/Card.vue'
import Empty from '@/components/common/Empty.vue'
import { useSearchStore } from '@/stores/searchStore';
import { showSelf, showMore, handleRefresh } from './action'

const searchResultStore = useSearchStore()
const modelData = searchResultStore.searchResult

</script>

<style scoped>
.card img {
    aspect-ratio: 69/111;
    background-color: #E9ECEF;
}

.tab-contioner {
    margin: 0 10px;
    border-radius: 5px;
    background: #e9ecef;
    overflow: hidden;
    display: flex;
}

.tabs {
    flex-grow: 1;
    white-space: nowrap;
    border-radius: 8px;
    padding: 3px;
    overflow-x: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;

}

.tabs::-webkit-scrollbar {
    display: none;
}

.tab {
    display: inline-block;
    cursor: pointer;
    padding: 0 15px;
    line-height: 34px;
    font-size: 14px;
    border-radius: 8px;
    widows: 50px;
}


.active {
    border-radius: 6px;
    background: #fff;
    font-weight: 700;
    color: #e50914;
}

.tab:hover {
    color: #e50914;
}

.tab-more {
    z-index: 50;
    background: aquamarine;
    display: flex;
    align-items: center;
    padding: 0 5px;
    background: #fff;
    box-shadow: 1px 1px 1px rgb(0 0 0 / 1%), -4px -1px 6px #fff;
}

.main {
    padding: 0;
}

.empty {
    position: absolute;
    left: 0px;
}
</style>
