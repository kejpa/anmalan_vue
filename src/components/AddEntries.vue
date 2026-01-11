<script setup>
import {ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {intToSwimtime, swimtimeToInt} from "@/assets/swimtimeFunctions.js";
import add from '@/assets/images/add.png'
import remove from '@/assets/images/delete.png'
import notAllowed from '@/assets/images/notAllowed.png'
import useEntriesStore from "@/stores/entriesStore.js";
import useCompetitionStore from "@/stores/competitionStore.js";
import useSwimmerStore from "@/stores/swimmerStore.js";
import useUserStore from "@/stores/userStore.js";

const props = defineProps(['competitionId', 'swimmer'])
const emit = defineEmits(['close'])

const {user}=storeToRefs(useUserStore())
const competitionStore = useCompetitionStore();
const {competition} = storeToRefs(competitionStore)
const swimmerStore = useSwimmerStore();
const swimmerEvents = ref([]);
const entriesStore = useEntriesStore();
const entries = ref([])

watch(() => props.competitionId, async (newId) => {
        if (!newId) return

        try {
            competitionStore.getCompetition(newId)
        } catch (err) {
            console.error("Kunde inte hämta tävlingen:", err)
            competitionStore.reset();
        }
    },
    {immediate: true} // Kör direkt vid mount
)
watch(() => props.swimmer, async (newSwimmer) => {
        if (!newSwimmer) return
        let data

        try {
            entries.value = await entriesStore.getEntries(newSwimmer.id)
            data = await swimmerStore.getResults(props.competitionId, newSwimmer.id)
        } catch (err) {
            console.error("Kunde inte hämta resultat för simmare:", err)
            swimmerEvents.value = []
            return
        }

        const currentUmanarStroke = []; // Array som fungerar som en flagga för rätt utmanargren per simsätt
        for (let event of competition.value.events) {
            let time = data.find(itm => itm.eventid === event.eventid)
            if (time) {
                const se = {event}
                se.hasSwimmerEntry = false;
                for (const itm in time.tider) {
                    // Ta bort timvärdet för tiden
                    time.tider[itm].swimtime = time.tider[itm].swimtime.slice(-8)
                }
                if (time.tider.length === 0) {
                    // Om ingen tid uppnåtts inom giltighetsperioden skapas en nolltid
                    time.tider = [{
                        "swimtime": '00:00.00',
                        "course": competition.value.course
                    }]
                }
                se.tider = time.tider

                if (event.utmanare && time.guldTid) {
                    // Om det är en utmanargren som aktuell simmare ska klara finns en guldtid som ska läggas till
                    se.guldtid = time.guldTid.swimtime
                    if ((time.tider[0] || time.tider?.SCM.swimtime > se.guldtid) && !currentUmanarStroke.find(itm => itm === event.swimstyle[0].stroke)) {
                        // aktuell gren (event) är den utmanargren som simmaren ska delta i för detta simsätt
                        se.currentEvent = true
                        currentUmanarStroke.push(event.swimstyle[0].stroke)
                    } else if (time.tider[0] && currentUmanarStroke.find(itm => itm === event.swimstyle[0].stroke)) {
                        // Lägg inte till grenen om simmaren inte har någon tid och det inte är aktuell gren för simsättet
                        // t.ex. en 50m sträcka när simmaren inte fått gultid på 25m
                        continue
                    }
                } else if (event.utmanare && !time.guldTid) {
                    // Lägg inte till grenen om det är en utmanargren och det inte finns någon guldtid att uppnå
                    // dvs simmaren ska inte alls genomföra aktuell gren i sin utmanarversion.
                    continue
                }
                se.hasSwimmerEntry = entries.value.some(itm => {
                    return itm.swimmerid === newSwimmer.id && itm.eventid === event.eventid
                })
                swimmerEvents.value.push(se)
            }
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
    entry.competitionid = props.competitionId
    entry.swimmerid = props.swimmer.id
    entry.eventid = eventid
    if (typeof (entryInfo) === 'string') {
        entryInfo = {swimtime: entryInfo, course: competition.value.course}
    }
    entry.info = entryInfo
    entry.createdby=user.value.id

    entries.value.push(entry)
    entriesStore.saveEntry(entry)
    swimmerEvents.value.find(itm => itm.event.eventid === eventid).hasSwimmerEntry = true;

    // Sortera entries efter grennummer
    entries.value.sort((a, b) => {
        return competition.value.events.find(e => e.eventid === a.eventid).number - competition.value.events.find(e => e.eventid === b.eventid).number
    })
}

function removeEntry(entry) {
    entries.value = entries.value.filter(itm => itm !== entry);
    entriesStore.removeEntry(entry.id);
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
                <li>{{ `${event.event.name}` }}</li>
                <li v-if="event.tider && event.event.utmanare"
                    :title="event.tider.SCM?.swimtime<event.guldtid ? 'Uppnådd tid bättre än guldtiden' :''">
                    <span v-if="event.currentEvent || event.tider.SCM?.swimtime" class="entrytimes">
                        <span v-if="event.tider.SCM?.swimtime>event.guldtid" class="enterEvent">
                            <img :src="add" @click="addEntry(event.event.eventid,event.tider.SCM)">
                        </span>
                        <span v-else-if="event.currentEvent" class="entrytimes enterEvent">
                            <img :src="add" @click="addEntry(event.event.eventid,'00:00.00')">
                            00:00.00
                        </span>
                        <span v-else class="enterEvent"><img :src="notAllowed"></span>
                        {{ event.tider.SCM?.swimtime ? `${event.tider.SCM?.swimtime} (25m)` : '' }}
                    </span>
                </li>
                <li v-if="event.tider && !event.event.utmanare">
                    <span v-if="event.tider.SCM?.swimtime" class="entrytimes">
                        <span class="enterEvent">
                            <img :src="add"
                                 @click="addEntry(event.event.eventid,event.tider.SCM)">
                        </span>
                        {{ event.tider.SCM?.swimtime ? `${event.tider.SCM?.swimtime} (25m)` : '' }}
                    </span>
                    <span v-if="event.tider.LCM?.swimtime" class="entrytimes">
                        <span class="enterEvent">
                            <img :src="add"
                                 @click="addEntry(event.event.eventid,event.tider.LCM)">
                        </span>
                        {{ event.tider.LCM?.swimtime ? `${event.tider.LCM?.swimtime} (50m)` : '' }}
                    </span>
                    <span v-if="event.tider[0] && competition.editSwimtimes"
                          class="entrytimes enterEvent">
                        <img :src="add"
                             @mouseup.prevent="addEntry(event.event.eventid,event.tider[0].swimtime)">
                        <input type="text" size="6" v-model="event.tider[0].swimtime"
                               @focus="event.tider[0].swimtime=swimtimeToInt(event.tider[0].swimtime)"
                               @blur="event.tider[0].swimtime=intToSwimtime(event.tider[0].swimtime)"/>
                    </span>
                    <span v-if="event.tider.length===0 && !competition.editSwimtimes"
                          class="entrytimes enterEvent">
                        <img :src="add"
                             @click="addEntry(event.event.eventid,event.tider[0].swimtime)">
                        Saknar tid
                    </span>
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
                        `${entry.info.swimtime} ${entry.info.course === 'SCM' ? '(25m)' : '(50m)'}`
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

input[type=text] {
    font: inherit;
    text-align: right;
}
</style>
