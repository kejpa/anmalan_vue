<script setup>
import { onMounted} from 'vue'
import useUserStore from '@/stores/userStore.js'
import CompetitionForm from '@/components/CompetitionForm.vue'
import {storeToRefs} from "pinia";
import {useRoute} from "vue-router";
import useCompetitionStore from "@/stores/competitionStore.js";

const route = useRoute()
const userStore = useUserStore()
const user = storeToRefs(userStore)
const competitionStore=useCompetitionStore()
const {competition}=storeToRefs(competitionStore)

onMounted(async() => {
    await competitionStore.getCompetition(route.params.id)
})
</script>

<template>
  <main>
    <CompetitionForm :competitionid="route.params.id" />
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
