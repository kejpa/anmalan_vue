<script setup>
import {onMounted, ref, watch} from "vue";
import useSwimmerStore from "@/stores/swimmerStore.js";
import APIServices from "@/services/APIServices.ts";
import {storeToRefs} from "pinia";

const swimmerStore = useSwimmerStore()
const {allSwimmers} = storeToRefs(swimmerStore)
const filteredSwimmers = ref([])
const gender = ref('A')
const grupp = ref('Alla')
const gren = ref('Alla')
const activeOnly = ref(true)
const groups = ref([])
const events = ref([])
const emit = defineEmits(['select'])
const sortOrder = ref('firstname asc')

onMounted(() => {
    swimmerStore.getAllSwimmers()
    APIServices.get('getActiveGroups')
        .then(data => {
            groups.value = data
            groups.value.sort((a, b) => {
                return a.name > b.name ? 1 : -1
            })
            filterSwimmers()
        })
})

watch(
    allSwimmers,
    (swimmers) => {
        filterSwimmers();
    },
    {deep: true}
)


function sortedSwimmers() {
    let [field, order] = sortOrder.value.split(" ")
    return [...filteredSwimmers.value].sort((a, b) => {
        let o = order === 'asc' ? 1 : -1;
        return a[field] > b[field] ? o : -o;
    })
}

function filterSwimmers() {
    filteredSwimmers.value = allSwimmers.value
    if (activeOnly.value) filteredSwimmers.value = filteredSwimmers.value.filter(swimmer => {
        return swimmer.active === activeOnly.value
    })
    if (gender.value !== 'A') {
        filteredSwimmers.value = filteredSwimmers.value.filter(swimmer => {
            return swimmer.gender === gender.value
        })
    }

    if (grupp.value !== 'Alla') {
        filteredSwimmers.value = filteredSwimmers.value.filter(swimmer => {
            for (const g of swimmer.groups) {
                if (g.id === grupp.value) {
                    return true
                }
            }
            return false
        })
    }
}

function selectSwimmer(swimmer) {
    emit('select', swimmer)
}

function sortList(way) {
    let [field, order] = sortOrder.value.split(" ")
    if (way === field) {
        order = order === 'asc' ? 'desc' : 'asc';
    } else {
        field = way
        order = 'asc'
    }

    sortOrder.value = `${field} ${order}`
}
</script>

<template>
    <h3>Anmälningsbara simmare</h3>
    <label>
        Klass:
        <select v-model="gender" @change="filterSwimmers">
            <option value="A">Alla</option>
            <option value="M">Herrar</option>
            <option value="F">Damer</option>
        </select>
    </label>
    <label>
        Grupp:
        <select v-model="grupp" @change="filterSwimmers">
            <option>Alla</option>
            <option v-for="group in groups" :key="group.id" :value="group.id">{{
                    group.name
                }}
            </option>
        </select>
    </label>
    <label style="display: none">
        Gren:
        <select v-model="gren" @change="filterSwimmers">
            <option>Alla</option>
            <option v-for="event in events" :key="event.eventid" :value="event.eventid">{{
                    `${event.number}. ${event.name}`
                }}
            </option>
        </select>
    </label>
    <br>
    <label>
        Endast aktiva simmare: <input type="checkbox" v-model="activeOnly"
                                      @change="filterSwimmers"/>
    </label>
    <ul class="header">
        <li class="sort" @click="sortList('firstname')">Förnamn</li>
        <li class="sort" @click="sortList('lastname')">Efternamn</li>
        <li class="sort" @click="sortList('yearborn')">Född</li>
        <li>Licens</li>
    </ul>
    <ul v-for="simmare in sortedSwimmers()" :key="simmare.id" @click="selectSwimmer(simmare)">
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
    background-color:var(--color-background-alternating-even);
    padding-left: .5em;
}

.header li {
    font-weight: bold;
    cursor: initial;
}

li.sort {
    cursor: pointer;
}

ul:nth-child(odd) {
    background-color: var(--color-background-alternating-odd);
}

li {
    list-style: none;
}
</style>
