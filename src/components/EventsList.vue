<script setup>
import {ref} from 'vue'
import useSwimstyleStore from '@/stores/swimstyleStore.js'
import remove from '@/assets/images/delete.png'
import add from '@/assets/images/add.png'

const props = defineProps(['events', 'sessions', 'eventsList', 'addEvents'])
const swimstyleStore = ref(useSwimstyleStore())

function removeEvent(eventNumber) {
    const index = props.events.findIndex((s) => s.number === eventNumber)
    if (index !== -1) {
        props.events.splice(index, 1)
        // Uppdatera numrering av grenar
        props.events.forEach((event, i) => {
            event.number = i + 1
        })
    }
}

function sortEvents() {
    props.events.sort((a, b) => a.number - b.number)
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

    <ul v-for="swimEvent in props.events" :key="swimEvent.number">
        <template v-if="props.addEvents === true">
            <li>
                <img :src="remove" alt="Radera" @click="removeEvent(swimEvent.number)"/>
            </li>
            <!--     TODO: Lägg till funktionalitet för att flytta grenar upp och ner -->
            <li>
                <input type="number" min="1" v-model="swimEvent.number" size="1"
                       @change="sortEvents"/>
            </li>
            <li>
                <select v-model="swimEvent.swimstyleid"
                        @change="swimEvent.name = $event.target.options[$event.target.selectedIndex].text">
                    <option
                        v-for="swimstyle in props.eventsList"
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
                    :max="props.sessions.length"
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
        </template>
        <template v-else>
            <li></li>
            <li>{{ swimEvent.number }}</li>
            <li>{{ swimstyleStore.getSwimstyle(swimEvent.swimstyleid).name }}</li>
            <li>{{ swimEvent.name }}</li>
            <li>{{ swimEvent.gender }}</li>
            <li>{{ swimEvent.session }}</li>
            <li>{{ swimEvent.utmanare ? 'Ja' : 'Nej' }}</li>
            <li>
                <div v-for="agegroup in swimEvent.agegroups" :key="agegroup.agegroupid">
                    <span>{{ agegroup.agegroupid }}: </span>
                    {{ agegroup.agemin }} - {{ agegroup.agemax }}
                </div>
            </li>
            <li>
                {{ swimEvent.round }}
            </li>
        </template>
    </ul>
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
