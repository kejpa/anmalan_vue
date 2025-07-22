<script setup>
import splash from "@/assets/logo.svg";


</script>

<template>
  <main>
  <img alt="Splash logo" :src="splash"/>
  <p>Loading...</p>
  </main>

</template>

<style scoped>
main {
  display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
}
img {
  display: block;
  margin: 0 auto;
  width: 70vw;
}
p {
  text-align: center;
  font-size: 1.5rem;
  color: var(--color-text);
}
</style>
