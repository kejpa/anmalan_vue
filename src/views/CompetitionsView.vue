<script setup>
import { onMounted } from 'vue'
import {storeToRefs} from "pinia";
import CompetitionList from '@/components/CompetitionList.vue'
import useUserStore from '@/stores/userStore.js'

const userStore = useUserStore()
const {user} = storeToRefs(userStore)

onMounted(() => {})
</script>

<template>
  <main>
      <router-link v-if="user?.isAdmin" to="/tavlingar/new">Ny tävling</router-link>
    <CompetitionList />
  </main>
</template>
<style scoped>
main {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}
@media (min-width: 1024px) {
  max-width: 70vw;
}
</style>
