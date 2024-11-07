<template>
    <ion-content class="ion-padding">
        <p>{{ title }}</p>
        <div class="bottom">
            <ion-button @click="confirm">确认</ion-button>
            <ion-button @click="cancel">取消</ion-button>
        </div>
    </ion-content>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonContent, IonButton, popoverController } from '@ionic/vue';
defineProps({
    title: {
        type: String,
        default: '确认执行此操作?'
    }
})

const isConfirmed = ref(false);

const confirm = () => {
    isConfirmed.value = true;
    dismiss();
};

const cancel = () => {
    isConfirmed.value = false;
    dismiss();
};

const dismiss = async () => {
    await popoverController.dismiss({ dismissed: isConfirmed.value });
};
</script>
<style scoped>
p {
    text-align: center;
}

.bottom {
    display: flex;
    justify-content: space-between;
    padding: 0 5px;
}
</style>


