<template>
    <div class="mask"></div>
</template>

<script setup lang="ts">


</script>

<style scoped>
/* 遮罩样式 */
.mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    /* 半透明黑色 */
    z-index: 100;
    /* 确保遮罩在最上层 */

}

/* 显示遮罩 */
.show-mask {
    display: block;
}
</style>
