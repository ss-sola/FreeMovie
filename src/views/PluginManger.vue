<template>
    <IonPage>
        <IonHeader>
            <ion-toolbar>
                <ion-title><span @click="GRouter.back()"><i class="iconfont icon-fanhui"></i>&nbsp;插件管理</span></ion-title>
            </ion-toolbar>
        </IonHeader>
        <IonContent>
            <PluginCard v-for="plugin in pluginModules" :key="plugin.name" :plugin="plugin"></PluginCard>
            <Fab></Fab>
            <Empty v-if="pluginModules.length == 0"></Empty>
        </IonContent>

    </IonPage>
</template>

<script setup lang="ts">
import Empty from '@/components/common/Empty.vue';
import PluginCard from '@/components/plugin/PluginCard.vue';
import Fab from '@/components/plugin/fab/FabPlugin.vue';
import { IonPage, IonHeader, IonContent, IonToolbar, IonTitle, IonIcon, IonFab, IonFabButton } from '@ionic/vue';
import { add } from 'ionicons/icons';
import GRouter from '@/router/routes'
import { ref, reactive } from 'vue';
import { usePluginStore } from '@/stores/pluginStroe'
const pluginModules = usePluginStore().pluginModules

</script>

<style scoped>
ion-title {
    padding-inline: 10px;
}



ion-fab::after {
    content: '';
    /* 必须的，即使没有内容 */
    position: absolute;
    /* 绝对定位 */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    z-index: -1;
    /* 将伪元素置于div下方 */
    /* 使用box-shadow创建发光效果 */
    box-shadow: 0 0 15px 5px rgba(52, 152, 219, 0.7);
    /* 使用背景色的半透明版本 */
    /* 添加模糊效果 */
    filter: blur(1px);
    /* 增加模糊效果，使发光更柔和 */
}
</style>