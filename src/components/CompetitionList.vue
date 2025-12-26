<script setup>
import {onMounted, ref} from 'vue'
import useCompetitionStore from '@/stores/competitionStore.js'
import settings from '@/assets/images/settings.png'
import enter from '@/assets/images/enter.png'
import remove from "@/assets/images/delete.png"
import download from "@/assets/images/download.png"
import {storeToRefs} from "pinia";

const competitionStore = useCompetitionStore()
const {allCompetitions} = storeToRefs(competitionStore)

onMounted(() => {
    competitionStore.getAllCompetitions()
})

function removeCompetition(id) {
    competitionStore.removeCompetition(id)
}

function sortedCompetitions() {
    return [...allCompetitions.value].sort((a, b) => {
        return a.date > b.date ? 1 : -1;
    })
}

</script>

<template>
    <h1>Tävlingar</h1>
    <ul v-for="competition in sortedCompetitions()" :key="competition.id">
        <li>
            <router-link :to="'/anmalningar/' + competition.id">
                <img :src="enter" height="16" title="Lägg in anmälningar">
            </router-link>
        </li>
        <li>
            <router-link :to="'/tavlingar/' + competition.id">
                <img :src="settings" height="16" title="Admin">
            </router-link>
        </li>
        <li>
            {{ competition.name }} - {{ new Date(competition.date).toLocaleDateString() }}
        </li>
        <li>
            <img :src="download" height="16" title="Download">
        </li>
        <li>
            <img :src="remove" height="16" title="Radera" @click="removeCompetition(competition.id)">
        </li>
    </ul>
</template>

<style scoped>
ul {
    display: grid;
    grid-template-columns: 1rem 1rem 30rem 1rem 1rem;
    grid-column-gap: 1em;
    list-style-type: none;
    padding: 0;
}
img {
    cursor: pointer;
}
</style>
