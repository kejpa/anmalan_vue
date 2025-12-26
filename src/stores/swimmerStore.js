import {defineStore} from 'pinia'
import {ref} from 'vue'
import APIServices from "@/services/APIServices.js";

const useSwimmerStore = defineStore('swimmerStore', () => {
    const allSwimmers = ref([])
    const isLoading = ref(false)
    const hasLoaded = ref(false)
    let loadPromise = null // används för att dela samma promise

/*    const swimmer = ref({
        id: '',
        firstname: '',
        lastname: '',
        gender: '',
        license: '',
        yearborn: '',
        birthdate: '',
        date: '',
        groups: [
            {
                id: '',
                name: ''
            },
        ],
        firstCompetitionDate: '',
    })
*/
    async function getAllSwimmers() {
        if (hasLoaded.value) return allSwimmers.value
        if (isLoading.value && loadPromise) return loadPromise

        isLoading.value = true
        loadPromise = (async () => {
            try {
                const data = await APIServices.get(`getAllSwimmers`)
                allSwimmers.value = data
                hasLoaded.value = true
            } finally {
                isLoading.value = false
            }
            return allSwimmers.value
        })()

        return loadPromise
    }


    async function getResults(competitionId, swimmerId) {
        return APIServices.get(`getResults?competitionId=${competitionId}&swimmerId=${swimmerId}`)
    }

    return {getAllSwimmers, getResults, allSwimmers}
})
export default useSwimmerStore
