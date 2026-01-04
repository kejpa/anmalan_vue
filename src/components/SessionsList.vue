<script setup>
import remove from '@/assets/images/delete.png'
import {storeToRefs} from "pinia";
import useCompetitionStore from "@/stores/competitionStore.js";

const competitionStore = useCompetitionStore()
const {competition} = storeToRefs(competitionStore)

function removeSession(sessionNumber) {
    const index = competition.sessions.findIndex((s) => s.number === sessionNumber)
    if (index !== -1) {
        competition.sessions.splice(index, 1)
        // Uppdatera numrering av sessioner
        competition.sessions.forEach((session, i) => {
            let newNumber = i + 1
            competition.events.forEach(event => {
                if (event.session === sessionNumber) event.session = newNumber
            })
            session.number = newNumber
        })
    }
}
</script>

<template>
    <ul>
        <li></li>
        <li>Nr</li>
        <li>Namn</li>
        <li>Datum</li>
        <li>Tid</li>
    </ul>
    <ul v-for="session in competition.sessions" :key="session.number">
        <li>
            <img :src="remove" alt="Radera" @click="removeSession(session.number)"/>
        </li>
        <!-- TODO: Lägg till funktionalitet för att flytta sessioner upp och ner -->
        <li>
            <input type="text" v-model="session.number" size="1" disabled/>
        </li>
        <li>
            <input type="text" v-model="session.name"/>
        </li>
        <li>
            <input type="date" v-model="session.date"/>
        </li>
        <li>
            <input type="time" v-model="session.daytime"/>
        </li>
    </ul>
</template>

<style scoped>
ul {
    display: grid;
    grid-template-columns: 2rem 3rem 12rem 8rem 4.5rem;
    margin: 0;
    padding: 0;
}

li {
    margin: 0;
    padding: 0.2rem;
    list-style: none;
}

ul:nth-child(even) {
    background-color: var(--color-border);
}

img {
    width: 1rem;
}
</style>
