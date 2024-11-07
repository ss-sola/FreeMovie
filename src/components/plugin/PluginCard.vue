<template>
    <ion-card class="card">
        <ion-grid>
            <ion-row>
                <ion-col class="name">{{ plugin.name }}</ion-col>
                <ion-col size="auto"><ion-toggle :checked="plugin.enable"
                        @ionChange="enableChange(plugin, $event, 'enable')">启用</ion-toggle></ion-col>
            </ion-row>

            <ion-row>
                <ion-col class="lowlight">版本号:{{ plugin.version }}</ion-col>
                <ion-col class="lowlight">作者:{{ plugin.author }}</ion-col>
                <ion-col>
                    <!-- <ion-toggle :disabled="!plugin.enable" :checked="plugin.enable"
                        @ionChange="enableChange(plugin, $event, 'rotation')">轮播</ion-toggle> -->
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col @click="doUpdate(plugin)"><i class="iconfont icon-jianchagengxin"></i>更新</ion-col>
                <ion-col @click="doRemove(plugin)"><i class="iconfont icon-changyonggoupiaorenshanchu"></i>删除</ion-col>
                <ion-col>
                    <!-- <ion-toggle :disabled="!plugin.enable" :checked="plugin.enable"
                        @ionChange="enableChange(plugin, $event, 'week')">周表</ion-toggle> -->
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import Confirm from '@/components/common/Confirm.vue'
import { IonCard, IonGrid, IonRow, IonCol, IonToggle, popoverController } from '@ionic/vue';
import { doRemove, doUpdate } from './action'
import { enablePlugin } from '@/service/plugin'
defineProps({
    plugin: {
        type: Object as () => IPlugin.IPluginModule,
        default: () => { }
    }
})
async function enableChange(plugin: any, event: CustomEvent, key: string) {
    plugin[key] = event.detail.checked
    if (!plugin.enable) {
        enablePlugin(plugin.id, IConfig.Disable)
        // plugin.rotation = false
        // plugin.week = false
    } else {
        enablePlugin(plugin.id, IConfig.Enable)
    }
}

</script>

<style scoped>
.card {
    display: flex;
    margin: 20px 10px;
    padding: 10px;
    color: #000;
    font-weight: bold;
    background-color: rgb(240 253 244);

}


.name {
    font-size: 25px;
    font-weight: bold;
    color: #000;
}

ion-row>ion-col {
    display: flex;
    align-items: flex-end;

    /* font-size: 12px;
    color: #999; */
}

.highlight {
    color: #000;
    font-weight: bold;
}

.lowlight {
    color: var(--color);
    font-weight: normal;
}
</style>