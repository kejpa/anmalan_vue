<script setup>
import { onMounted, ref } from 'vue'
import useCompetitionStore from '@/stores/competitionStore.js'
import SessionsList from '@/components/SessionsList.vue'

const competitionStore = useCompetitionStore()
const competition = ref({})

onMounted(() => {
  competition.value = competitionStore.getCompetition()
})
</script>

<template>
  <h1>Skapa Tävling</h1>
  <form @submit="submitCompetition">
    <fieldset id="main">
      <legend>Tävling</legend>
      <label>
        Namn:
        <input type="text" v-model="competition.name" required />
      </label>
      <label>
        Stad:
        <input type="text" v-model="competition.city" required />
      </label>
      <label>
        Land:
        <input type="text" v-model="competition.country" required />
      </label>
      <label>
        Datum:
        <input type="date" v-model="competition.date" required />
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
        Tider uppnådda from:
        <input type="date" v-model="competition.swimTimePeridStartDate" required />
      </label>
      <label>
        Tider uppnådda till:
        <input type="date" v-model="competition.swimTimePeridEndDate" required />
      </label>
      <label>
        Redigera anmälningstider:
        <input type="checkbox" v-model="competition.allowRegisterSwimTimes" />
      </label>
      <label>
        Endast tider i aktuell bassäng:
        <input type="checkbox" v-model="competition.currentCourseOnly" />
      </label>
    </fieldset>
    <fieldset id="admin">
      <legend>Admin</legend>

      <label>
        Lägg till grenar:
        <input type="checkbox" v-model="competition.addEvents" />
      </label>
      <label>
        Ändra grenordning:
        <input type="checkbox" v-model="competition.reorderEvents" />
      </label>
    </fieldset>
    <fieldset id="sessions">
      <legend>Tävlingspass</legend>
      <SessionsList :sessions="competition.sessions" />
      <label>
        Lägg till pass:
        <input type="checkbox" v-model="competition.addSessions" />
      </label>
      <label>
        Redigera pass:
        <input type="checkbox" v-model="competition.editSessions" />
      </label>
      <label>
        Ta bort pass:
        <input type="checkbox" v-model="competition.removeSessions" />
      </label>
    </fieldset>
    <fieldset id="events">
      <legend>Grenar</legend>
    </fieldset>
    <button type="submit">Skapa Tävling</button>
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
</style>
