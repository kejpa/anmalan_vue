<script setup>

import CompetitionInfo from "@/components/CompetitionInfo.vue";
</script>

<template>
<main>
    <header>
        <CompetitionInfo :competitionid="$route.params.id" />
    </header>
    <div id="swimmers">
<h2>Simmare</h2>
    </div>
    <div id="entries">
        <h2>Anmälningar</h2>
    </div>
</main>
</template>

<style scoped>
main {
    display:grid;
    grid-template-areas: "header header"  "swimmers entries";
    grid-template-rows: auto 1fr;
}
header {
    grid-area: header;
    margin:2em;
    height:auto;
}
#swimmers {
    grid-area: swimmers;
}
#entries {
    grid-area: entries;
}
</style>
