<script setup>
import edit from '@/assets/images/edit.png'
import remove from '@/assets/images/delete.png'
import { ref } from 'vue'

const props = defineProps(['sessions', 'editSession'])
//const editSession = ref(0);

function removeSession(sessionNumber) {
  const index = props.sessions.findIndex((s) => s.number === sessionNumber)
  if (index !== -1) {
    props.sessions.splice(index, 1)
    // Uppdatera numrering av sessioner
    props.sessions.forEach((session, i) => {
      session.number = i + 1
    })
  }
}
</script>

<template>
  <ul>
    <li></li>
    <li>Nr</li>
    <li>Namn</li>
    <li>Datum</li>
    <li>Tid</li>
  </ul>
  <ul v-for="session in props.sessions" :key="session.number">
    <template v-if="editSession === true">
      <li>
        <img :src="remove" alt="Radera" @click="removeSession(session.number)" />
      </li>
      <!-- TODO: Lägg till funktionalitet för att flytta sessioner upp och ner -->
      <li>
        <input type="text" v-model="session.number" size="1" disabled />
      </li>
      <li>
        <input type="text" v-model="session.name" />
      </li>
      <li>
        <input type="date" v-model="session.date" />
      </li>
      <li>
        <input type="time" v-model="session.daytime" />
      </li>
    </template>
    <template v-else>
      <li></li>
      <li>{{ session.number }}</li>
      <li>{{ session.name }}</li>
      <li>{{ session.date }}</li>
      <li>{{ session.daytime }}</li>
    </template>
  </ul>
</template>

<style scoped>
ul {
  display: grid;
  grid-template-columns: 2rem 3rem 12rem 8rem 4.5rem;
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
