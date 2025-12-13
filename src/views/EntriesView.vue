<script setup>

import CompetitionInfo from "@/components/CompetitionInfo.vue";
import SwimmersList from "@/components/SwimmersList.vue";
import AddEntries from "@/components/AddEntries.vue";
import {ref} from "vue";

const showEntries = ref(false)
const swimmer = ref({})

function openModal(swimmerInfo){
    swimmer.value = swimmerInfo
    showEntries.value = true
}
function closeModal(){
    showEntries.value = false
    swimmer.value = null
}
</script>

<template>
    <AddEntries v-if="showEntries" :competition-id="$route.params.id" :swimmer="swimmer" @close="closeModal()"/>
    <main>
        <header>
            <CompetitionInfo :competitionid="$route.params.id"/>
        </header>
        <div id="swimmers">
            <h2>Simmare</h2>
            <SwimmersList :competitionid="$route.params.id" @select="openModal"/>
         </div>
        <div id="entries">
            <h2>Anmälningar</h2>
        </div>
    </main>
</template>

<style scoped>
main {
    display: grid;
    grid-template-areas: "header header"  "swimmers entries";
    grid-template-rows: auto 1fr;
}

header {
    grid-area: header;
    margin: 2em;
    height: auto;
}

#swimmers {
    grid-area: swimmers;
}

#entries {
    grid-area: entries;
}
</style>
