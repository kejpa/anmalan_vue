<script setup>
import { ref } from "vue";
import useSwimstyleStore from "@/stores/swimstyleStore.js";
import remove from "@/assets/images/delete.png";

const props = defineProps(["events", "sessions", "eventsList"]);
const editEvent = ref("event");
const swimstyleStore = useSwimstyleStore();

function removeEvent(eventNumber) {
  const index = props.events.findIndex((s) => s.number === eventNumber);
  if (index !== -1) {
    props.events.splice(index, 1);
    // Uppdatera numrering av grenar
    props.events.forEach((event, i) => {
      event.number = i + 1;
    });
  }
}
</script>

<template>
  <ul>
    <li> </li>
    <li>Nr</li>
    <li>Namn</li>
    <li>Gren</li>
    <li>Session</li>
    <li>Utmanare</li>
    <li>Åldersgrupper</li>
  </ul>
  <ul v-for="event in props.events" :key="event.number">
    <li>
      <img :src="remove" alt="Radera" @click="removeEvent(event.number)" />
    </li>
    <li>
      <input type="number" min="1" v-model="event.number" size="1" />
    </li>
    <li>
      <input type="text" v-model="event.name" />
    </li>
    <li>
      <select v-model="event.swimstyleid">
        <option
          v-for="swimstyle in eventsList"
          :key="swimstyle.id"
          :value="swimstyle.swimstyleid"
        >
          {{ swimstyle.name }}
        </option>
      </select>
    </li>
    <li>
      <input
        type="number"
        v-model="event.session"
        min="1"
        :max="props.sessions"
        size="1"
      />
    </li>
    <li>
      <input type="checkbox" v-model="event.utmanare" />
    </li>
    <li>
      <div v-for="agegroup in event.agegroups" :key="agegroup.agegroupid">
        <span>{{ agegroup.agegroupid }}: </span>
        <input type="number" v-model="agegroup.agemin" min="0" max="99" />
        <input
          type="number"
          v-model="agegroup.agemax"
          placeholder="Max ålder"
          min="0"
          max="99"
        />
      </div>
    </li>
  </ul>
</template>

<style scoped>
ul {
  display: grid;
  grid-template-columns:2rem 3rem 12rem 12rem 5rem 5rem 9rem ;
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
</style>
