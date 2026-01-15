<script setup>

import remove from "@/assets/images/delete.png";
import useSwimmerStore from "@/stores/swimmerStore.js";
import useCompetitionStore from "@/stores/competitionStore.js";
import useEntriesStore from "@/stores/entriesStore.js";
import {computed, onMounted, ref, watch} from "vue";
import {storeToRefs} from "pinia";
import useUserStore from "@/stores/userStore.js";

const props = defineProps(['competitionid']);
const competitionStore = useCompetitionStore();
const {competition} = storeToRefs(competitionStore);
const {allEntries} = storeToRefs(useEntriesStore());
const {allSwimmers} = storeToRefs(useSwimmerStore());
const {user} = storeToRefs(useUserStore());
const sortOrder = ref('firstname asc');
const swimmersCount = computed(() => {
    return allEntries.value
        .filter(e => user.value.isAdmin || e.createdby === user.value.id)
        .reduce((acc, itm) => {
            acc.add(itm.swimmerid)
            return acc
        }, new Set())
        .size
})
const entriesCount = computed(() => {
    return allEntries.value.filter(e => {
        return user.value.isAdmin || e.createdby === user.value.id
    }).length
})
onMounted(() => {
    useCompetitionStore().getCompetition(props.competitionid);
})
watch(
    allEntries,
    (entries) => {
        console.log("Entries loaded")
    },
    {deep: true}
)
watch(
    allSwimmers,
    (swimmers) => {
        console.log("Swimmers loaded")
    },
    {deep: true}
)

function sortedEntries() {
    let [field, order] = sortOrder.value.split(" ")
    return [...allEntries.value].sort((a, b) => {
        let o = order === 'asc' ? 1 : -1;
        if (field === 'firstname') {
            if (a.swimmerid !== b.swimmerid) return getSwimmer(a.swimmerid)?.firstname > getSwimmer(b.swimmerid)?.firstname ? o : -o;
            return competition.value.events.find(e => e.eventid === a.eventid).number - competition.value.events.find(e => e.eventid === b.eventid).number;
        } else {
            if (competition.value.events.find(e => e.eventid === a.eventid).number !== competition.value.events.find(e => e.eventid === b.eventid).number) return competition.value.events.find(e => e.eventid === a.eventid).number * o - competition.value.events.find(e => e.eventid === b.eventid).number * o;
            return getSwimmer(a.swimmerid)?.firstname > getSwimmer(b.swimmerid)?.firstname ? 1 : -1;
        }
    })
}

function getSwimmer(swimmerid) {
    if (!allSwimmers) return;
    let swimmer = allSwimmers.value.find(s => s.id === swimmerid)
    return swimmer;
}

function removeEntry(entry) {
//    allEntries.value = allEntries.value.filter(itm => itm !== entry);
    useEntriesStore().removeEntry(entry.id);
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
    <p>{{ entriesCount }} anmälningar för {{ swimmersCount }} simmare</p>
    <ul class="header">
        <li class="sort" @click="sortList('firstname')">Namn</li>
        <li>Född</li>
        <li class="sort" @click="sortList('event')">Gren</li>
        <li>Tid</li>
        <li>&nbsp;</li>
    </ul>
    <ul v-for="entry in sortedEntries().filter(e => {
     return user.isAdmin || e.createdby === user.id
    })" :key="entry.id">
        <li>{{
                `${getSwimmer(entry.swimmerid)?.firstname} ${getSwimmer(entry.swimmerid)?.lastname}`
            }}
        </li>
        <li>{{ getSwimmer(entry.swimmerid)?.yearborn }}</li>
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
    background-color: var(--color-background-alternating-even);
    padding-left: .5em;
}

.header li {
    font-weight: bold;
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

img {
    height: 1em;
}
</style>
