<script setup></script>

<template>
  <main>
    <h1>Logga in</h1>
    <label>Användarnamn: <input type="text" placeholder="epost" name="user" /></label>
    <label>Lösenord: <input type="password" name="password" /></label>
    <button>Logga in</button>
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
</style>
