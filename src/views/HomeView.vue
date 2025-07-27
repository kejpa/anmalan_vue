<script setup>
import { onMounted, ref } from 'vue'
import useUserStore from '@/stores/userStore.js'
import CompetitionForm from '@/components/CompetitionForm.vue'

const user=ref(useUserStore().getUser())

onMounted(() => {
})
</script>

<template>
  <main>
    <CompetitionForm />
  </main>
</template>
<style scoped>
main {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  max-width: 70vw;
  padding: 1rem;
}
</style>
