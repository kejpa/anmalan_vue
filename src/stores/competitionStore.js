import {defineStore} from 'pinia'
import {ref} from 'vue'
import APIServices from "@/services/APIServices.js";

const useCompetitionStore = defineStore('competitionStore', () => {
    const allCompetitions = ref([])
    const isLoading = ref(false)
    const hasLoaded = ref(false)
    let loadPromise = null // används för att dela samma promise

    const competition = ref({
        id: '',
        name: '',
        city: '',
        country: '',
        date: '',
        course: 'SCM',
        sessions: [
            {
                number: 1,
                name: 'Session 1',
                date: '2023-10-01',
                daytime: '15:39',
            },
        ],
        events: [],
        lastEntryDate: '',
        swimtimesFrom: '',
        swimtimesTo: '',
        editSwimtimes: false,
        editSessions: false,
        editEvents: false,
    })

    function setCompetition(newCompetition) {
        competition.value = newCompetition
    }

    async function getCompetition(id) {
        // Se till att all data finns innan vi letar
        if (!hasLoaded.value) {
            await getAll()
        }

        // Returnera posten (eller undefined om inte hittad)
        return allCompetitions.value.find((comp) => comp.id === id);
    }

    async function getAllCompetitions() {
        if (hasLoaded.value) return allCompetitions.value
        if (isLoading.value && loadPromise) return loadPromise

        isLoading.value = true
        loadPromise = (async () => {
            try {
                const data = await APIServices.get(`getCompetitions`)
                allCompetitions.value = data
                hasLoaded.value = true
            } finally {
                isLoading.value = false
            }
            return allCompetitions.value
        })()

        return loadPromise
    }

    function saveCompetition() {
        return new Promise((resolve, reject) => {
            if (competition.value.id) {
                APIServices.put('saveCompetition', competition.value)
                    .then(() => {
                        resolve(true)
                    })
                    .catch((error) => {
                        console.error('Error updating competition:', error)
                        reject(error)
                    })
            } else {
                APIServices.post('saveCompetition', competition.value)
                    .then((data) => {
                        competition.value.id = data.id
                        allCompetitions.value = allCompetitions.value.push(competition.value)
                        resolve(true)
                    })
                    .catch((error) => {
                        console.error('Error creating competition:', error)
                        reject(error)
                    })
            }
        })
    }

    function removeCompetition(id) {
        return new Promise((resolve, reject) => {
            APIServices.delete('deleteCompetition?id=' + id)
                .then(() => {
                    allCompetitions.value = allCompetitions.value.filter(e => e.id !== id)
                    resolve(true)
                })
                .catch((error) => {
                    console.error('Error removing entry:', error)
                    reject(error)
                })
        })
    }

    /*
        function getEvent(evId) {
            return competition.value.events.find((ev) => ev.eventid === evId) ??''
        }
    */
    return {
        setCompetition,
        getCompetition,
        saveCompetition,
        getAllCompetitions,
        removeCompetition,
        allCompetitions
    }
})
export default useCompetitionStore
