<script setup>
import {onMounted, ref} from 'vue'
import useCompetitionStore from '@/stores/competitionStore.js'

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
    <ul>
        <li v-for="competition in competitions" :key="competition.id">
            <router-link :to="'/tavlingar/' + competition.id">
                {{ competition.name }} - {{ new Date(competition.date).toLocaleDateString() }}
            </router-link>
        </li>
    </ul>
</template>

<style scoped>

</style>
