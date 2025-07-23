<script setup>
import APIServices from '@/services/APIServices.js'
import { storeAccessToken } from '@/stores/accessTokenStorage.js'

function LoggaIn() {
  APIServices.post('login', {
    user: document.querySelector('input[name="user"]').value,
    password: document.querySelector('input[name="password"]').value,
  })
    .then((data) => {
      storeAccessToken(data.jwt)
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
