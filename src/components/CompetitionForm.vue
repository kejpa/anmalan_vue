<script setup>
import {onMounted, ref} from 'vue'
import useCompetitionStore from '@/stores/competitionStore.js'
import useSwimstyleStore from '@/stores/swimstyleStore.js'
import SessionsList from "@/components/SessionsList.vue";
import EventsList from "@/components/EventsList.vue";

const props = defineProps(['competitionid'])

const competitionStore = useCompetitionStore()
const swimstyleStore = useSwimstyleStore()
const events = ref([])

const competition = ref({})

onMounted(() => {
    if (props.competitionid === '') {
        competition.value = new competitionStore.emptyCompetition()
        return
    } else {
        competitionStore.getCompetition(props.competitionid)
            .then(data => {
                competition.value = data
            })
    }
        /*swimstyleStore.getAll()
            .then(data => {
                events.value = data
            })*/
})

function addSession(e) {
    e.preventDefault()
    let session = {
        number: competition.value.sessions.length + 1,
        name: 'Session ' + (competition.value.sessions.length + 1),
        date:
            competition.value.sessions[competition.value.sessions.length - 1]?.date ||
            competition.value.date ||
            '',
        daytime: '',
    }
    competition.value.sessions.push(session)
}

function addEvent(e) {
    e.preventDefault()
    let event = {
        number: competition.value.events.length + 1,
        name: ' ',
        swimstyleid: 0,
        utmanare: false,
        agegroups: [{agegroupid: 1, agemin: 0, agemax: 99}],
        session: 1,
    }
    competition.value.events.push(event)
}

function submitCompetition(e) {
    e.preventDefault()
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
                Administrera tävlingspass:
                <input type="checkbox" v-model="competition.editSessions"/>
            </label>
            <label>
                Administrera grenar:
                <input type="checkbox" v-model="competition.editEvents"/>
            </label>
        </fieldset>
        <fieldset id="sessions">
            <legend>Tävlingspass</legend>
            <SessionsList
                :sessions="competition.sessions"
                :editSession="competition.editSessions ?? true"
            />
            <button v-if="competition.editSessions ?? true" @click="addSession">Lägg till pass
            </button>
        </fieldset>
        <fieldset id="events">
            <legend>Grenar</legend>
            <EventsList
                :events="competition.events"
                :sessions="competition.sessions ?? null"
                :eventsList="events.filter((e) => e.course === competition.course)"
                :addEvents="competition.addEvents ?? false"
            />
            <button v-if="competition.addEvents" @click="addEvent">Lägg till gren</button>
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
