<script setup>
const props = defineProps(['sessions'])
</script>

<template>
  {{props.sessions}}
  <ul v-for="session in props.sessions" :key="session.number">
    <li>{{ session.number }}</li>
    <li>{{ session.name }}</li>
    <li>{{ session.date }}</li>
    <li>{{ session.daytime }}</li>
  </ul>
</template>

<style scoped>
ul {
  display: grid;
  grid-template-columns: 2rem 1fr 4rem 3rem;
  margin: 0;
}
li {
  margin: 0;
  padding: 0.5rem;
  list-style: none;
}
</style>
