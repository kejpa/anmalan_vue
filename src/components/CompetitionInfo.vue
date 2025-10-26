<script setup>
import {ref, watchEffect} from "vue";
import useCompetitionStore from "@/stores/competitionStore.js";

const props = defineProps(['competitionid'])
const competitionStore = useCompetitionStore()
const competition = ref({})
watchEffect(() => {
    competitionStore.getCompetition(props.competitionid)
        .then(data => {
            competition.value = data
        })
})
</script>

<template>
    <h3>{{ competition.name }}</h3>
    <p>{{ competition.city }} | {{ competition.course }} | {{ competition.date }}</p>
</template>

<style scoped>
h3 {
    color: blue;
    font-size: 1.5em;
}
</style>
