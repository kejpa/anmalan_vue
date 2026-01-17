<script setup>

import CompetitionInfo from "@/components/CompetitionInfo.vue";
import SwimmersList from "@/components/SwimmersList.vue";
import AddEntries from "@/components/AddEntries.vue";
import {onMounted, ref} from "vue";
import useEntriesStore from "@/stores/entriesStore.js";
import {useRoute} from "vue-router";
import EntriesList from "@/components/EntriesList.vue";
import AddSwimmer from "@/components/AddSwimmer.vue";

const route = useRoute()
const entriesStore = useEntriesStore()
const showEntries = ref(false)
const showNewSwimmer = ref(false)
const swimmer = ref({})

onMounted(async () => {
    entriesStore.getAllForCompetition(route.params.id)
})

function openModal(swimmerInfo) {
    swimmer.value = swimmerInfo
    showEntries.value = true
}

function closeModal() {
    showEntries.value = false
    swimmer.value = null
}
function openAddSwimmer() {
    showNewSwimmer.value = true
}
function closeNewSwimmer() {
    showNewSwimmer.value = false
}
</script>

<template>
    <AddEntries v-if="showEntries" :competition-id="$route.params.id" :swimmer="swimmer"
                @close="closeModal()"/>
    <AddSwimmer v-if="showNewSwimmer"  @close="closeNewSwimmer"/>
    <main>
        <header>
            <CompetitionInfo :competitionid="$route.params.id"/>
        </header>
        <div id="swimmers">
            <h2>Simmare</h2>
            <button @click="openAddSwimmer">Ny simmare</button>
            <SwimmersList :competitionid="$route.params.id" @select="openModal"/>
        </div>
        <div id="entries">
            <h2>Anmälningar</h2>
            <EntriesList :competitionid="$route.params.id"/>
       </div>
    </main>
</template>

<style scoped>
main {
    display: grid;
    grid-template-areas: "header header"  "swimmers entries";
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 1em;
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
