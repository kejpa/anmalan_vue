<script setup>
import { onMounted, ref } from 'vue'
import APIServices from '@/services/APIServices.js'
import { storeAccessToken } from '@/stores/accessTokenStorage.js'
import useUserStore from '@/stores/userStore.js'

const showScreen = ref('splash')

onMounted(() => {
  // Prova logga in
  APIServices.get('check')
    .then((data) => {
      // Spara access token i localStorage
      storeAccessToken(data.jwt)
      // Spara användaren i UserStore
      let userStore= useUserStore()
      userStore.setUser(data.user)

      // Visa lista vid lyckad inloggning
      showScreen.value = 'home'
    })
    .catch((error) => {
      console.error('Login failed:', error)
      // Visa login-sida vid misslyckad inloggning
      showScreen.value = 'login'
    })
})
</script>

<template>
  <template v-if="['splash', 'login'].includes(showScreen)">
    <header></header>
    <SplashScreen v-if="showScreen === 'splash'" />
    <LoginScreen v-else-if="showScreen === 'login'" @logonEvent="showScreen = 'home'" />
  </template>
  <template v-else>
    <header>
      <img class="logo" alt="Logo" src="@/assets/logo.svg" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>

    <RouterView />
    <footer>
      <p>© 2025 Kjell Hansen</p>
    </footer>
  </template>
</template>

<style scoped>
header {
  line-height: 1.5;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin: 0.5rem 0;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.logo {
  display: none;
}

footer {
  border-top: 3px double var(--color-border);
  text-align: center;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    display: initial;
    margin: 0 2rem 0 0;
    width: 80px;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
