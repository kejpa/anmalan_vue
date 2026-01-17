<script setup>
import {ref} from "vue";
import useSwimmerStore from "@/stores/swimmerStore.js";

const emit = defineEmits(['close'])

//const {user}=storeToRefs(useUserStore())
const swimmerStore=useSwimmerStore()
const swimmer = ref({
    id: '',
    firstname: '',
    lastname: '',
    gender: 'F',
    license: '',
    birthdate: '',
})

function closeModal() {
    emit('close')
}

function addSwimmer() {
    swimmer.value=swimmerStore.add(swimmer.value)
    closeModal()
}

</script>

<template>
    <div class="modal">
        <main>
            <div id="close" @click="closeModal()">×</div>
            <h1>Ny simmare</h1>
            {{swimmer.id}}
            <label>Förnamn: <input size="15" v-model="swimmer.firstname"></label>
            <label>Efternamn: <input size="15" v-model="swimmer.lastname"></label>
            <label>Födelsedag: <input type="date" v-model="swimmer.birthdate"></label>
            <label><input type="radio" v-model="swimmer.gender" value="F">Dam</label>
            <label><input type="radio" v-model="swimmer.gender" value="M">Herr</label>
            <button @click="addSwimmer">Spara</button>
        </main>
    </div>
</template>

<style scoped>
.modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
}

#close {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    line-height: 25px;
    color: white;
    background-color: red;
    cursor: pointer;
}

main {
    padding: 15px;
    height: 30%;
    width: 40%;
    top: 10%;
    position: absolute;
    border: 3px solid black;
    background-color: white;
}
label {
    display: block;
    padding: 2px;
}

input[type=text] {
    font: inherit;
    text-align: right;
}
</style>
