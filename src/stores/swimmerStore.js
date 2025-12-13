import {defineStore} from 'pinia'
import {ref} from 'vue'
import APIServices from "@/services/APIServices.js";

const useSwimmerStore = defineStore('swimmerStore', () => {
    const allSwimmers = ref([])
    const isLoading = ref(false)
    const hasLoaded = ref(false)
    let loadedOnlyActive =null
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
    async function getAll(onlyActive=true) {
        if(onlyActive !== loadedOnlyActive){
            loadedOnlyActive = onlyActive
            allSwimmers.value = []
            hasLoaded.value = false
            isLoading.value = false
            loadPromise = null
        }

        if (hasLoaded.value) return allSwimmers.value
        if (isLoading.value && loadPromise) return loadPromise

        isLoading.value = true
        loadPromise = (async () => {
            try {
                const data = await APIServices.get(`getAllSwimmers?onlyActive=${onlyActive}`)
                allSwimmers.value = data
                hasLoaded.value = true
            } finally {
                isLoading.value = false
            }
            return allSwimmers.value
        })()

        return loadPromise
    }

    async function getSwimmer(id) {
        // Se till att all data finns innan vi letar
        if (!hasLoaded.value) {
            await getAll()
        }

        // Returnera posten (eller undefined om inte hittad)
        return allSwimmers.value.find((swimmer) => swimmer.id === id);
    }

    async function getResults(competitionId, swimmerId) {
        return APIServices.get(`getResults?competitionId=${competitionId}&swimmerId=${swimmerId}`)
    }

    return {getSwimmer, getAll, getResults}
})
export default useSwimmerStore
