<template>
    <ion-content class="ion-padding">
        <div class="content">
            <h2>新发布版本:{{ infoNew.version }}</h2>
            <p>下载地址:</p>
            <p>{{ infoNew.url }}</p>
            <p v-if="infoNew.content">更新简介:</p>
            <div v-html="infoNew.content"></div>
        </div>

        <div class="btn">
            <ion-button @click="confirm">复制</ion-button>
            <ion-button @click="cancel">关闭</ion-button>
        </div>

    </ion-content>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonContent, IonButton, popoverController } from '@ionic/vue';
import { Clipboard } from '@capacitor/clipboard';
const info = defineProps({
    infoNew: {
        type: Object,
        default: {}
    }
})

const isConfirmed = ref(false);

const confirm = async () => {
    const { type, value } = await Clipboard.read();
    if (value != info.infoNew.version) {
        await Clipboard.write({
            string: info.infoNew.version
        });
    }
    isConfirmed.value = true;
    dismiss();
};

const cancel = () => {
    localStorage.setItem(IConfig.IVersionName, info.infoNew.version);
    isConfirmed.value = false;
    dismiss();
};

const dismiss = async () => {
    await popoverController.dismiss({ dismissed: isConfirmed.value });
};
</script>

<style scoped>
p {
    word-break: break-all;
    margin: 0;
    padding: 5px 0;
}

.content {
    max-height: 35vh;
    overflow: auto;
}

.btn {
    /* direction: rtl; */
    display: flex;
    justify-content: space-between;
}
</style>
