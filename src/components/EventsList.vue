<script setup>
import {computed, onMounted} from "vue";
import {storeToRefs} from "pinia";
import add from '@/assets/images/add.png'
import remove from '@/assets/images/delete.png'
import useSwimstyleStore from '@/stores/swimstyleStore.js'
import useCompetitionStore from "@/stores/competitionStore.js";
import useUserStore from "@/stores/userStore.js";

const props=defineProps(['competitionid'])
const userStore = useUserStore()
const {user} = storeToRefs(userStore)
const competitionStore = useCompetitionStore()
const {competition} = storeToRefs(competitionStore)
const swimstyleStore = useSwimstyleStore()
const {allSwimstyles} = storeToRefs(swimstyleStore)

onMounted(async ()=>{
    await competitionStore.getCompetition(props.competitionid)
})
function removeEvent(eventNumber) {
    const index = competition.events.findIndex((s) => s.number === eventNumber)
    if (index !== -1) {
        competition.events.splice(index, 1)
        // Uppdatera numrering av grenar
        competition.events.forEach((event, i) => {
            event.number = i + 1
        })
    }
}

const sortedEvents = computed(() => {
    return [...competition.value.events].sort((a, b) => a.number - b.number)
})

function addEvent(e) {
    e.preventDefault()
    let event = {
        number: competition.value.events.length + 1,
        eventid: nextEventId(),
        name: ' ',
        swimstyleid: 0,
        swimstyle: [],
        gender: 'M',
        utmanare: false,
        agegroups: [{agegroupid: 1, agemin: 0, agemax: 99}],
        session: 1,
        round: 'TIM'
    }
    competition.value.events.push(event)
}

function nextEventId() {
    let nextId = competition.events.reduce((nr, itm) => {
        return itm.eventid > nr ? itm.eventid : nr
    }, 0)
    nextId++

    return nextId > 1000 ? nextId : 1000 + nextId
}

</script>

<template>
    <ul>
        <li></li>
        <li>Nr</li>
        <li>Gren</li>
        <li>Namn</li>
        <li>Kön</li>
        <li>Session</li>
        <li>Utmanare</li>
        <li>Åldersgrupper</li>
        <li>Omgång</li>
    </ul>

    <ul v-for="swimEvent in sortedEvents" :key="swimEvent.eventid">
        <li v-if="user.isAdmin">
            <img :src="remove" alt="Radera" @click="removeEvent(swimEvent.number)"/>
        </li>
        <li v-else>&nbsp;</li>
        <li>
            <input type="number" min="1" v-model="swimEvent.number" size="1"/>
        </li>
        <li>
            <select v-model="swimEvent.swimstyleid"
                    @change="swimEvent.name = $event.target.options[$event.target.selectedIndex].text">
                <option
                    v-for="swimstyle in allSwimstyles.filter(swimstyle => swimstyle.course === competition.course)"
                    :key="swimstyle.id"
                    :value="swimstyle.swimstyleid"
                >
                    {{ swimstyle.name }}
                </option>
            </select>
        </li>
        <li>
            <input type="text" v-model="swimEvent.name"/>
        </li>
        <li>
            <select v-model="swimEvent.gender">
                <option value="M">Herrar</option>
                <option value="F">Damer</option>
                <option value="X">Mixed</option>
            </select>
        </li>
        <li>
            <input
                type="number"
                v-model="swimEvent.session"
                min="1"
                :max="competition.sessions.length"
                size="1"
            />
        </li>
        <li>
            <input type="checkbox" v-model="swimEvent.utmanare"/>
        </li>
        <li>
            <div class="agegroups" v-for="agegroup in swimEvent.agegroups"
                 :key="agegroup.agegroupid">
                <span>{{ agegroup.agegroupid }}: </span>
                <input type="number" v-model="agegroup.agemin" min="0" max="99"/>
                <input type="number" v-model="agegroup.agemax" placeholder="Max ålder" min="0"
                       max="99"/>
                <img v-if="agegroup.agegroupid!==1" :src="remove" alt="Radera"
                     @click="swimEvent.agegroups.splice(swimEvent.agegroups.indexOf(agegroup), 1)"/>
            </div>
            <img :src="add" alt="Lägg till åldersgrupp"
                 @click="swimEvent.agegroups.push({agegroupid: swimEvent.agegroups.length + 1, agemin: 0, agemax: 99})"/>
        </li>
        <li>
            <select v-model="swimEvent.round">
                <option value="TIM">Direktfinal</option>
                <option value="FHT">Bästa heat</option>
                <option value="PRE">Försök</option>
                <option value="FIN">Final</option>
                <option value="SEM">Semifinal</option>
                <option value="QUA">Kvartsfinal</option>
            </select>
        </li>
    </ul>
    <button @click="addEvent">Lägg till gren</button>
</template>

<style scoped>
ul {
    display: grid;
    grid-template-columns: 2rem 3rem 12rem 12rem 5rem 5rem 5rem 9rem 7rem;
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

.agegroups {
    float: left;
    clear: left;
}
</style>
