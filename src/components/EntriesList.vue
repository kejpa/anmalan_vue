<script setup>

import remove from "@/assets/images/delete.png";
import useSwimmerStore from "@/stores/swimmerStore.js";
import useCompetitionStore from "@/stores/competitionStore.js";
import useEntriesStore from "@/stores/entriesStore.js";
import {onMounted, ref} from "vue";

const props = defineProps(['competitionid']);
const competition = ref();
const entries = ref();
const swimmers = ref()

onMounted(async () => {
    swimmers.value = await useSwimmerStore().getAll();
    competition.value = await useCompetitionStore().getCompetition(props.competitionid);
    entries.value = await useEntriesStore().getAll(props.competitionid);

    entries.value.sort((a, b) => {
        if (a.swimmerid !== b.swimmerid) return getSwimmer(a.swimmerid).firstname < getSwimmer(b.swimmerid).firstname ? -1 : 1;
        return competition.value.events.find(e => e.eventid === a.eventid).number - competition.value.events.find(e => e.eventid === b.eventid).number;

    })
})

function getSwimmer(swimmerid) {
    let swimmer = swimmers.value.find(s => s.id === swimmerid)
    return swimmer;
}

function removeEntry(entry) {
    entries.value = entries.value.filter(itm => itm !== entry);
    useEntriesStore().removeEntry(entry.id);
}
</script>

<template>

    <ul class="header">
        <li>Namn</li>
        <li>Född</li>
        <li>Gren</li>
        <li>Tid</li>
        <li>&nbsp;</li>
    </ul>
    <ul v-for="entry in entries" :key="entry.id">
        <li>{{
                `${getSwimmer(entry.swimmerid).firstname} ${getSwimmer(entry.swimmerid).lastname}`
            }}
        </li>
        <li>{{ getSwimmer(entry.swimmerid).yearborn }}</li>
        <li>{{
                `${competition.events.find(e => e.eventid === entry.eventid).number} ${competition.events.find(e => e.eventid === entry.eventid).name}`
            }}
        </li>
        <li>{{ `${entry.info.swimtime} ${entry.info.course === 'SCM' ? '(25m)' : '(50m)'}` }}</li>
        <li><img :src="remove" @click="removeEntry(entry)"></li>
    </ul>


</template>
<style scoped>
ul {
    display: grid;
    grid-template-columns: 4fr 1fr 3fr 3fr 1.2em;
    list-style: none;
    background-color: #eee;
    cursor: pointer;
    padding-left: .5em;
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

img {
    height: 1em;
}
</style>
