<script setup>
import {onMounted, ref, watchEffect} from "vue";
import useCompetitionStore from "@/stores/competitionStore.js";
import useSwimmerStore from "@/stores/swimmerStore.js";
import APIServices from "@/services/APIServices.ts";

const props = defineProps(['competitionid'])
const competitionStore = useCompetitionStore()
const swimmerStore = useSwimmerStore()
const competition = ref({})
const allSwimmers = ref([])
const filteredSwimmers = ref([])
const gender = ref('A')
const grupp = ref('Alla')
const gren = ref('Alla')
const activeOnly = ref(true)
const groups = ref([])

onMounted(() => {
    getSwimmers()
    APIServices.get('getActiveGroups')
        .then(data => {
            groups.value = data
            groups.value.sort((a, b) => {
                return a.name > b.name ? 1 : -1
            })
        })
})

watchEffect(() => {
    competitionStore.getCompetition(props.competitionid)
        .then(data => {
            competition.value = data
        })
})

async function getSwimmers() {
    allSwimmers.value = await swimmerStore.getAll(activeOnly.value)

    allSwimmers.value.sort((a, b) => {
        return a.firstname > b.firstname ? 1 : -1
    })
    filteredSwimmers.value = allSwimmers.value;
}

function filterGender() {
    if (gender.value === 'A') {
        filteredSwimmers.value = allSwimmers.value
    } else {
        filteredSwimmers.value = allSwimmers.value.filter(swimmer => {
            return swimmer.gender === gender.value
        })
    }
}

function filterGroup() {
    if (grupp.value === 'Alla') {
        filteredSwimmers.value = allSwimmers.value
    } else {
        filteredSwimmers.value = allSwimmers.value.filter(swimmer => {
            for (const g of swimmer.groups) {
                if (g.id === grupp.value) {
                    return true
                }
            }
            return false
        })
    }
}
</script>

<template>
    <h3>Anmälningsbara simmare</h3>
    <label>
        Klass:
        <select v-model="gender" @change="filterGender">
            <option value="A">Alla</option>
            <option value="M">Herrar</option>
            <option value="F">Damer</option>
        </select>
    </label>
    <label>
        Grupp:
        <select v-model="grupp" @change="filterGroup">
            <option>Alla</option>
            <option v-for="group in groups" :key="group.id" :value="group.id">{{
                    group.name
                }}
            </option>
        </select>
    </label>
    <label>
        Gren:
        <select v-model="gren">
            <option>Alla</option>
        </select>
    </label>
    <br>
    <label>
        Endast aktiva simmare: <input type="checkbox" v-model="activeOnly" @change="getSwimmers"/>
    </label>
    <ul class="header">
        <li>Förnamn</li>
        <li>Efternamn</li>
        <li>Född</li>
        <li>Licens</li>
    </ul>
    <ul v-for="simmare in filteredSwimmers" :key="simmare.id">
        <li>{{ simmare.firstname }}</li>
        <li>{{ simmare.lastname }}</li>
        <li>{{ simmare.yearborn }}</li>
        <li>{{ simmare.license }}</li>
    </ul>
</template>

<style scoped>
h3 {
    color: blue;
    font-size: 1.5em;
}

label {
    margin-left: .5em;
}

ul {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr 1fr;
    list-style: none;
    background-color: #eee;
}

.header li {
    font-weight: bold;
}

ul:nth-child(even) {
    background-color: #ddd;
}

li {
    list-style: none;
}
</style>
