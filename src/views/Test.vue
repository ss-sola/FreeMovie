<template></template>

<script lang="ts" setup>
import { ref } from 'vue'
import MultiSelectList from '@/components/multi-select/MultiSelect.vue'
import { Filesystem, Directory } from '@capacitor/filesystem'
Filesystem.getUri({
  path: '',
  directory: Directory.External
})
  .then((uri) => {
    console.log(uri)
  })
  .catch((err) => {
    console.log(err)
  })
</script>
