<script setup>
import {onMounted, ref} from 'vue'
import {storeToRefs} from "pinia";
import {RouterLink, RouterView} from 'vue-router'
import {storeAccessToken} from '@/stores/accessTokenStorage.js'
import APIServices from '@/services/APIServices.js'
import useUserStore from '@/stores/userStore.js'
import SplashScreen from '@/components/SplashScreen.vue'
import LoginScreen from '@/components/LoginScreen.vue'
import useSwimstyleStore from "@/stores/swimstyleStore.js";

const showScreen = ref('splash')
const userStore = useUserStore()
const {user} = storeToRefs(userStore)
const swimstyle = useSwimstyleStore()

onMounted(() => {
    // Prova logga in
    APIServices.get('check')
        .then((data) => {
            // Spara access token i localStorage
            storeAccessToken(data.jwt)
            // Spara användaren i UserStore
            let userStore = useUserStore()
            userStore.setUser(data.user)
            swimstyle.fetch()
            //           user.value = data.user

            // Visa lista vid lyckad inloggning
            showScreen.value = 'home'
        })
        .catch(async (error) => {
            console.error('Login failed:', await error)
            // Visa login-sida vid misslyckad inloggning
            showScreen.value = 'login'
        })
})

function logout() {
    // Rensa access token och användare
    APIServices.delete('refresh').then(() => {
        storeAccessToken('')
        let userStore = useUserStore()
        userStore.setUser(null)
    })

    // Visa login-sida
    showScreen.value = 'login'
}
</script>

<template>
    <template v-if="['splash', 'login'].includes(showScreen)">
        <header></header>
        <SplashScreen v-if="showScreen === 'splash'"/>
        <LoginScreen v-else-if="showScreen === 'login'" @logonEvent="showScreen = 'home'"/>
    </template>
    <template v-else>
        <header>
            <div>
                <img class="logo" alt="Logo" src="@/assets/logo.svg"/>
                <p>Väkommen {{ user ? user.firstname : '' }}</p>
            </div>
            <img class="logout" alt="Logout" @click="logout()" src="@/assets/images/logout.png"/>
            <nav>
                <RouterLink to="/tavlingar">Tävlingar</RouterLink>
                <RouterLink to="/about">About</RouterLink>
            </nav>
        </header>

        <RouterView/>
        <footer>
            <p>© 2025 Kjell Hansen</p>
        </footer>
    </template>
</template>

<style scoped>
header {
    line-height: 1.5;
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
}

.logo {
    display: initial;
    margin: 2rem 2rem 0 0;
    width: 80px;
}

.logout {
    content: url("@/assets/images/logout.png");
}

@media (prefers-color-scheme: dark) {
    .logout {
        content: url("@/assets/images/logout_dark.png");
    }
}

.logout {
    width: 50px;
}

header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
}

nav {
    width: 100%;
    margin: 0.5rem 0;
    text-align: left;
    font-size: 1rem;
    padding: 1rem 0;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

.logout {
    position: absolute;
    right: 5vw;
    top: 1rem;
    width: clamp(20px, 50px, 8vw);
    cursor: pointer;
}

footer {
    border-top: 3px double var(--color-border);
    text-align: center;
}
</style>
