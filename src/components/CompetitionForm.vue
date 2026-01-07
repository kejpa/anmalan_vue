<script setup>
import {onMounted} from 'vue'
import useCompetitionStore from '@/stores/competitionStore.js'
import useSwimstyleStore from '@/stores/swimstyleStore.js'
import SessionsList from "@/components/SessionsList.vue";
import EventsList from "@/components/EventsList.vue";
import {storeToRefs} from "pinia";
import useUserStore from "@/stores/userStore.js";

const props = defineProps(['competitionid'])
const userStore = useUserStore()
const {user}=storeToRefs(userStore)
const competitionStore = useCompetitionStore()
const swimstyleStore = useSwimstyleStore()

const {competition} = storeToRefs(competitionStore)

onMounted(() => {
    swimstyleStore.fetch()

    if (!props.competitionid ) {
        competitionStore.reset()
    } else {
        competitionStore.getCompetition(props.competitionid)
    }
})



function submitCompetition(e) {
    e.preventDefault()
    competition.value.events.forEach((event) => {
        event.eventid = event.session * 1000 + event.number
        event.swimstyle = swimstyleStore.getSwimstyle(event.swimstyleid)
    })
    competitionStore.setCompetition(competition.value)
    competitionStore.saveCompetition().then(() => {
        alert('Tävlingen har sparats!')
    })
}

function setSessionDate(e) {
    competition.value.sessions.forEach((session) => {
        if (session.date < e.target.value) {
            session.date = e.target.value
        }
    })
}
</script>
<template>
    <h1>Skapa Tävling</h1>
    <form @submit="submitCompetition">
        <fieldset id="main">
            <legend>Tävling</legend>
            <label>
                ID: <span>{{ competition.id }}</span>
            </label>
            <label>
                Namn:
                <input type="text" v-model="competition.name" required/>
            </label>
            <label>
                Stad:
                <input type="text" v-model="competition.city" required/>
            </label>
            <label>
                Land:
                <input type="text" v-model="competition.country" required/>
            </label>
            <label>
                Datum:
                <input type="date" v-model="competition.date" required @change="setSessionDate"/>
            </label>
            <label>
                Bassäng:
                <select v-model="competition.course">
                    <option value="SCM">25 meter</option>
                    <option value="LCM">50 meter</option>
                </select>
            </label>
        </fieldset>
        <fieldset id="times">
            <legend>Anmälningstider</legend>
            <label>
                Anmälan senast:
                <input type="date" v-model="competition.lastEntry" required/>
            </label>
            <label>
                Tider uppnådda from:
                <input type="date" v-model="competition.swimtimesFrom" required/>
            </label>
            <label>
                Tider uppnådda till:
                <input type="date" v-model="competition.swimtimesTo" required/>
            </label>
            <label>
                Redigera anmälningstider:
                <input type="checkbox" v-model="competition.editSwimtimes"/>
            </label>
        </fieldset>
        <fieldset id="admin">
            <legend>Admin</legend>
            <label>
                Administrera grenar:
                <input type="checkbox" v-model="competition.editEvents"/>
            </label>
        </fieldset>
        <fieldset id="sessions">
            <legend>Tävlingspass</legend>
            <SessionsList :competitionid="props.competitionid" />

        </fieldset>
        <fieldset id="events">
            <legend>Grenar</legend>
            <EventsList :competitionid="props.competitionid"/>
            <button @click="addEvent">Lägg till gren</button>
        </fieldset>
        <button v-if="competition.id===''" type="submit">Skapa Tävling</button>
        <button v-else type="submit">Spara Tävling</button>
    </form>
</template>

<style scoped>
fieldset {
    float: left;
    margin: 0 0.5rem 0.5rem;
}

button {
    display: block;
    margin-top: 1rem;
    clear: both;
}

label {
    display: block;
    margin-bottom: 1rem;
}

#sessions {
    clear: left;
}

@media (min-width: 1024px) {
}
</style>
