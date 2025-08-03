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
  padding: 1rem;
}
@media (min-width: 1024px) {
  max-width: 70vw;

}
</style>
