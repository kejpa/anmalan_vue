<script setup>
import {watchEffect} from "vue";
import useCompetitionStore from "@/stores/competitionStore.js";
import {storeToRefs} from "pinia";

const props = defineProps(['competitionid'])
const competitionStore = useCompetitionStore()
const {competition} = storeToRefs(competitionStore)
watchEffect(() => {
    competitionStore.getCompetition(props.competitionid)
})
</script>

<template>
    <h3>{{ competition.name }}</h3>
    <p>{{ competition.city }} | {{ competition.course }} | {{ competition.date }}</p>
    <p>Anmälan senast {{ new Date(competition.lastEntry).toLocaleString().slice(0,-3) }}</p>
</template>

<style scoped>
h3 {
    color: blue;
    font-size: 1.5em;
}
</style>
