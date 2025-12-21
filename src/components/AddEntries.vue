<script setup>
import {ref, watch} from "vue";
import useCompetitionStore from "@/stores/competitionStore.js";
import useSwimmerStore from "@/stores/swimmerStore.js";
import add from '@/assets/images/add.png'
import remove from '@/assets/images/delete.png'
import notAllowed from '@/assets/images/notAllowed.png'
import useEntriesStore from "@/stores/entriesStore.js";

const props = defineProps(['competitionId', 'swimmer'])
const emit = defineEmits(['close'])

const competitionStore = useCompetitionStore();
const competition = ref({})
const swimmerStore = useSwimmerStore();
const swimmerEvents = ref([]);
const entriesStore = useEntriesStore();
const entries =ref([])

watch(() => props.competitionId, async (newId) => {
        if (!newId) return

        try {
            const data = await competitionStore.getCompetition(newId)
            competition.value = data
        } catch (err) {
            console.error("Kunde inte hämta tävlingen:", err)
            competition.value = null
        }
    },
    {immediate: true} // Kör direkt vid mount
)
watch(() => props.swimmer, async (newSwimmer) => {
        if (!newSwimmer) return

        try {
            entries.value=entriesStore.getEntries(newSwimmer.id)
            const data = await swimmerStore.getResults(props.competitionId, newSwimmer.id)
            for (let event of competition.value.events) {
                let time = data.find(itm => itm.eventid === event.eventid)
                if (time) {
                    const se = {event}
                    se.hasSwimmerEntry = false;
                    se.tider = time.tider
                    if (time.guldTid) {
                        se.guldtid = time.guldTid.swimtime
                    }
                    swimmerEvents.value.push(se)
                }
            }
        } catch (err) {
            console.error("Kunde inte hämta resultat för simmare:", err)
            swimmerEvents.value = null
        }
    },
    {immediate: true} // Kör direkt vid mount
)

function closeModal() {
    for (let item of competition.value.events) {
        delete (item.tider)
        delete (item.guldtid)
    }
    emit('close')
}

function addEntry(eventid, entryInfo) {
    const entry = {}
    entry.competitionId=props.competitionId
    entry.swimmerid = props.swimmer.id
    entry.eventid = eventid
    entry.info = entryInfo

    // Lägg till entry om eventid inte finns eller bassängen är olika
    entries.value.push(entry)
    swimmerEvents.value.find(itm => itm.event.eventid === eventid).hasSwimmerEntry = true;

    // Sortera entries efter grennummer
    entries.value.sort((a,b)=>{
        return competition.value.events.find(e => e.eventid===a.eventid).number-competition.value.events.find(e => e.eventid===b.eventid).number
    })
}

function removeEntry(entry){
    entries.value=entries.value.filter(itm => itm !== entry);
    swimmerEvents.value.find(itm => itm.event.eventid === entry.eventid).hasSwimmerEntry = false;
}

</script>

<template>
    <div class="modal">
        <main>
            <div id="close" @click="closeModal()">×</div>
            <h1>Anmälningar för {{ props.swimmer?.firstname ?? 'Lasse-gurra' }}
                {{ props.swimmer?.lastname ?? 'Aktersnurra' }}
                ({{ props.swimmer?.license ? props.swimmer.license : 'Ingen licens' }})</h1>
            <ul v-for="event in swimmerEvents.filter(e => e.hasSwimmerEntry===false)"
                :key="event.event.eventid">
                <li>{{ event.event.number }}</li>
                <li>{{ `${event.event.name} ${event.event.utmanare ? " (Utmanare)" : ""}` }}</li>
                <li v-if="event.tider && event.event.utmanare"
                    :title="event.tider.SCM?.swimtime<event.guldtid ? 'Uppnådd tid bättre än guldtiden' :''">
                    <span v-if="event.tider.SCM?.swimtime" class="entrytimes">
                    <span v-if="event.tider.SCM?.swimtime>event.guldtid" class="enterEvent"><img
                        :src="add"
                        @click="addEntry(event.event.eventid,event.tider.SCM, $event)"></span>
                    <span v-else class="enterEvent"><img :src="notAllowed"></span>
                        {{ event.tider.SCM?.swimtime ? `${event.tider.SCM?.swimtime} (25m)` : '' }}
                    </span>
                </li>
                <li v-if="event.tider && !event.event.utmanare">
                    <span v-if="event.tider.SCM?.swimtime" class="entrytimes">
                        <span class="enterEvent">
                            <img :src="add"
                                 @click="addEntry(event.event.eventid,event.tider.SCM, $event)">
                        </span>
                        {{ event.tider.SCM?.swimtime ? `${event.tider.SCM?.swimtime} (25m)` : '' }}
                    </span>
                    <span v-if="event.tider.LCM?.swimtime" class="entrytimes">
                        <span class="enterEvent">
                            <img :src="add"
                                 @click="addEntry(event.event.eventid,event.tider.LCM, $event)">
                        </span>
                        {{ event.tider.LCM?.swimtime ? `${event.tider.LCM?.swimtime} (50m)` : '' }}
                    </span>
                    <span v-if="event.tider.length===0" class="entrytimes">Inga tider angiven</span>
                </li>
                <li v-else>&nbsp;</li>
            </ul>
            <hr>
            <h2>Anmälda grenar</h2>
            <ul v-for="entry in entries" :key="entry">
                <li><span class="enterEvent"><img :src="remove" @click="removeEntry(entry)"></span>
                    {{
                        competition.events.find(e => e.eventid == entry.eventid)?.number ?? entry.eventid
                    }}
                </li>
                <li>{{
                        competition.events.find(e => e.eventid === entry.eventid)?.name
                    }}
                </li>
                <li>{{
                        competition.events.find(e => e.eventid === entry.eventid)?.utmanare ? " (Utmanare)" : ""
                    }}
                </li>
                <li>{{
                        `${entry.info.swimtime} ${entry.info.course === 'SCM' ? '(25)' : '(50m)'}`
                    }}
                </li>
            </ul>
        </main>
    </div>
</template>

<style scoped>
.modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
}

#close {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    line-height: 25px;
    color: white;
    background-color: red;
    cursor: pointer;
}

main {
    padding: 5px;
    height: 80%;
    width: 80%;
    top: 10%;
    position: absolute;
    border: 3px solid black;
    background-color: white;
}

ul {
    display: flex;
    list-style-type: none;
    flex-direction: row;
    background-color: lightgray;
}

ul:nth-child(odd) {
    background-color: white;
}

li {
    padding: 5px;
}

span.entrytimes {
    display: block;
}

.enterEvent img {
    height: 1em;
}
</style>
