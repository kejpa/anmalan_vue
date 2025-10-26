<script setup>
import {onMounted, ref} from 'vue'
import useCompetitionStore from '@/stores/competitionStore.js'
import settings from '@/assets/images/settings.png'
import enter from '@/assets/images/enter.png'

const competitionStore = useCompetitionStore()
const competitions = ref([])
onMounted(() => {
    competitionStore.getAll()
        .then(data => {
            competitions.value = data
            competitions.value.sort((a, b) => {
                return a.date - b.date
            })
        })

})

</script>

<template>
    <h1>Tävlingar</h1>
    <ul v-for="competition in competitions" :key="competition.id">
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
    </ul>
</template>

<style scoped>
ul {
    display: grid;
    grid-template-columns: 2rem 2rem 30rem;
    list-style-type: none;
    padding: 0;
}
</style>
