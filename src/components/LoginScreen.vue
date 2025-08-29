<script setup>
import APIServices from '@/services/APIServices.js'
import { storeAccessToken } from '@/stores/accessTokenStorage.js'
import useUserStore from '@/stores/userStore.js'

const emit = defineEmits(['logonEvent'])

function LoggaIn() {
  APIServices.post('login', {
    user: document.querySelector('input[name="user"]').value,
    password: document.querySelector('input[name="password"]').value,
  })
    .then((data) => {
      // Spara access token i localStorage
      storeAccessToken(data.jwt)
      // Spara användaren i UserStore
      let userStore = useUserStore()
      userStore.setUser(data.user)

      // emitta en händelse för att meddela att inloggningen lyckades
      emit('logonEvent', 'ok')
    })
    .catch((error) => {
      console.error('Fel vid inloggning:', error)
    })
}
</script>

<template>
  <main>
    <h1>Logga in</h1>
    <label>Användarnamn: <input type="text" placeholder="epost" name="user" /></label>
    <label>Lösenord: <input type="password" name="password" /></label>
    <button @click="LoggaIn()">Logga in</button>
  </main>
</template>

<style scoped>
main {
  margin: 0 auto;
  max-width: 70vw;
  padding: 1rem;
}

label {
  display: block;
  width: 15em;
  margin-bottom: 1rem;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

input {
  font-size: 1rem;
}
</style>
