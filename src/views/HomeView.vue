<script setup>
import { onMounted, ref } from 'vue'
import useUserStore from '@/stores/userStore.js'

const user=ref(useUserStore().getUser())

onMounted(() => {
})
</script>

<template>
  <main>
    <p>Väkommen {{ user.firstname}}</p>
  </main>
</template>
