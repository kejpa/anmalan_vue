<script setup>
import CompetitionInfo from "@/components/CompetitionInfo.vue";
import EventsList from "@/components/EventsList.vue";
import useCompetitionStore from "@/stores/competitionStore.js";
import {onMounted} from "vue";
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";

const route = useRoute()
const competitionStore=useCompetitionStore()
const {competition}=storeToRefs(competitionStore)
onMounted( async ()=>{
    await competitionStore.getCompetition(route.params.id)
})
function saveCompetition(e) {
    e.preventDefault()

    competitionStore.saveCompetition().then(() => {
        alert('Tävlingen har sparats!')
    })
}


</script>

<template>
    <main>
        <header>
            <CompetitionInfo :competitionid="$route.params.id"/>
        </header>
        <EventsList :competitionid="$route.params.id" />

        <br>
        <button @click="saveCompetition">Spara Tävling</button>

    </main>
</template>

<style scoped>
button {
    margin-top: 1em;
}
</style>
