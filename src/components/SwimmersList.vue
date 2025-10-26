<script setup>
import {ref, watchEffect} from "vue";
import useCompetitionStore from "@/stores/competitionStore.js";

const props = defineProps(['competitionid'])
const competitionStore = useCompetitionStore()
//const swimmerStore = useSwimmerStore()
const competition = ref({})
const allSwimmers = ref([])
const filteredSwimmers = ref([])
const gender = ref('A')
const grupp = ref('Alla')
const gren = ref('Alla')
const activeOnly = ref(true)

watchEffect(() => {
    competitionStore.getCompetition(props.competitionid)
        .then(data => {
            competition.value = data
        })
    allSwimmers.value = [{
        id: 1,
        firstname: 'Kjell',
        lastname: 'Hansen',
        gender: 'M',
        yearBorn: 1966,
        license: '66A301'
    }, {
        id: 2,
        firstname: 'Kjell',
        lastname: 'Hansen',
        gender: 'M',
        yearBorn: 1966,
        license: '66A302'
    }, {
        id: 3,
        firstname: 'Kjell',
        lastname: 'Hansen',
        gender: 'M',
        yearBorn: 1966,
        license: '66A303'
    }, {
        id: 11,
        firstname: 'Anna',
        lastname: 'Hansen',
        gender: 'F',
        yearBorn: 1968,
        license: '68A301'
    }, {
        id: 2,
        firstname: 'Anna',
        lastname: 'Hansen',
        gender: 'F',
        yearBorn: 1968,
        license: '68A302'
    }, {
        id: 3,
        firstname: 'Nina',
        lastname: 'Hansen',
        gender: 'F',
        yearBorn: 1972,
        license: '72A503'
    },]
    filteredSwimmers.value = allSwimmers.value;
})

function filterGender() {
    if (gender.value === 'A') {
        filteredSwimmers.value = allSwimmers.value
    } else {
        filteredSwimmers.value= allSwimmers.value.filter(swimmer => {
            return swimmer.gender === gender.value
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
        <select v-model="grupp">
            <option>Alla</option>
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
        Endast aktiva simmare: <input type="checkbox" v-model="activeOnly"/>
    </label>
    <ul>
        <li>Förnamn</li>
        <li>Efternamn</li>
        <li>Född</li>
        <li>Licens</li>
    </ul>
    <ul v-for="simmare in filteredSwimmers" :key="simmare.id">
        <li>{{ simmare.firstname }}</li>
        <li>{{ simmare.lastname }}</li>
        <li>{{ simmare.yearBorn }}</li>
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

ul:first-child li {
    font-weight: bold;
}

ul:nth-child(even) {
    background-color: #ddd;
}

li {
    list-style: none;
}
</style>
