<script setup>
import {ref, watch} from "vue";
import useCompetitionStore from "@/stores/competitionStore.js";
import useSwimmerStore from "@/stores/swimmerStore.js";

const props = defineProps(['competitionId', 'swimmer'])
const emit = defineEmits(['close'])

const competitionStore = useCompetitionStore();
const competition = ref({})
const swimmerStore = useSwimmerStore();
const swimmerResults=ref([]);

const entries = ref([])

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
            const data = await swimmerStore.getResults(props.competitionId, newSwimmer.id)
            for(let item of competition.value.events)  {
                item.tider=data.find(itm => itm.eventid===item.eventid).tider
                item.guldtid= data.find(itm => itm.eventid===item.eventid).guldTid.swimtime ?? null
            }
        } catch (err) {
            console.error("Kunde inte hämta resultat för simmare:", err)
            swimmerResults.value = null
        }
        console.log(swimmerResults.value)
    },
    {immediate: true} // Kör direkt vid mount
)

function closeModal() {
    for(let item of competition.value.events)  {
        delete (item.tider)
        delete(item.guldtid)
    }
    emit('close')
}
</script>

<template>
    <div class="modal">

        <div id="entries">
            <div id="close" @click="closeModal()">×</div>
            <h1>Anmälningar för {{ props.swimmer?.firstname ?? 'Lasse-gurra' }}
                {{ props.swimmer?.lastname ?? 'Aktersnurra' }}
                ({{ props.swimmer?.license ? props.swimmer.license : 'Ingen licens' }})</h1>
            <ul v-for="event in competition.events" :key="event.id">
                <li>{{ event.name }}</li>
                <li>{{ event.utmanare ? "Utmanare" : "Vanlig gren" }}</li>
                <li>{{ event?.tider  ??'' }}</li>
                <li>{{ event?.guldtid  ??'' }}</li>
             </ul>
            {{swimmerResults}}
        </div>
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

#entries {
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
</style>
