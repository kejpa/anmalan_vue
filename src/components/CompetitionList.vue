<script setup>
import {onMounted} from 'vue'
import {storeToRefs} from "pinia";
import APIServices from "@/services/APIServices.ts";
import useCompetitionStore from '@/stores/competitionStore.js'
import useUserStore from "@/stores/userStore.js";
import settings from '@/assets/images/settings.png'
import enter from '@/assets/images/enter.png'
import remove from "@/assets/images/delete.png"
import download from "@/assets/images/download.png"

const userStore = useUserStore()
const {user} = storeToRefs(userStore)
const competitionStore = useCompetitionStore()
const {allCompetitions} = storeToRefs(competitionStore)

onMounted(() => {
    competitionStore.getAllCompetitions()
})

function downloadEntries(id) {
    APIServices.getBlob(`entriesFile?id=${id}`)
        .then((blob) => {
            const fileUrl = window.URL.createObjectURL(blob)
            const aTagg = document.createElement('a')
            aTagg.href = fileUrl
            aTagg.download = 'anmalan.lef'
            document.body.appendChild(aTagg)
            aTagg.click()
            document.body.removeChild(aTagg)
            window.URL.revokeObjectURL(fileUrl)
        })
}

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
    <ul class="header">
        <li>&nbsp;</li>
        <li>&nbsp;</li>
        <li>Tävling</li>
        <li>Anmälan senast</li>
    </ul>
    <ul v-for="competition in sortedCompetitions()" :key="competition.id">
        <li v-if="new Date(competition.lastEntry).toLocaleString() > (new Date()).toLocaleString()">
            <router-link :to="'/anmalningar/' + competition.id">
                <img :src="enter" height="16" title="Lägg in anmälningar">
            </router-link>
        </li>
        <li v-else>&nbsp;</li>
        <li v-if="user.isAdmin">
            <router-link :to="'/tavlingar/' + competition.id">
                <img :src="settings" height="16" title="Admin">
            </router-link>
        </li>
        <li v-else-if="competition.editEvents">
            <router-link :to="'/grenar/' + competition.id">
                <img :src="settings" height="16" title="Admin">
            </router-link>
        </li>
        <li v-else>&nbsp;</li>
        <li v-if="new Date(competition.lastEntry).toLocaleString() > (new Date()).toLocaleString()">
            <router-link :to="'/anmalningar/' + competition.id">
                {{ competition.name }} - {{ new Date(competition.date).toLocaleDateString() }}
            </router-link>
        </li>
        <li v-else>
            {{ competition.name }} - {{ new Date(competition.date).toLocaleDateString() }}
        </li>
        <li>
            {{ new Date(competition.lastEntry).toLocaleString().slice(0, -3) }}
        </li>
        <li>
            <img :src="download" height="16" title="Download"
                 @click="downloadEntries(competition.id)">
        </li>
        <li v-if="user.isAdmin">
            <img :src="remove" height="16" title="Radera"
                 @click="removeCompetition(competition.id)">
        </li>
        <li v-else>&nbsp;</li>
    </ul>
</template>

<style scoped>
ul {
    display: grid;
    grid-template-columns: 1rem 1rem 30rem 20rem 1rem 1rem;
    grid-column-gap: 1em;
    list-style-type: none;
    background-color: var(--color-background-alternating-even);
    padding: 0;
}

ul:nth-child(odd) {
    background-color: var(--color-background-alternating-odd);
}

ul.header {
    background-color: var(--color-background-header);
}

ul.header li {
    font-weight: bold;
}

li a {
    color: var(--color-text);
}

a {
    cursor: pointer;
}

</style>
