import {defineStore} from 'pinia'
import {ref} from 'vue'
import APIServices from "@/services/APIServices.js";

const useEntriesStore = defineStore('entriesStore', () => {
    const allEntries = ref([])
    const isLoading = ref(false)
    const hasLoaded = ref(false)
    let loadPromise = null // används för att dela samma promise

    /*  const entry = ref({
          id: '',
          swimmerId: '',
          competitionId: '',
          eventId: '',
          info: {
              time: '',
              city: '',
              date: '',
              course: 'SCM',
          },
      })
  */

    async function getEntries(swimmerId) {
        // Se till att all data finns innan vi letar
        if (!hasLoaded.value) {
            await getAllForCompetition()
        }

        // Returnera posterna
        return allEntries.value.filter((entry) => entry.swimmerid === swimmerId) ?? [];
    }

    async function getAllForCompetition(competitionId) {
        if (hasLoaded.value) return allEntries.value
        if (isLoading.value && loadPromise) return loadPromise

        isLoading.value = true
        loadPromise = (async () => {
            try {
                const data = await APIServices.get(`getEntries?competitionId=${competitionId}`)
                allEntries.value = data.map(entry => {
                    entry.info.swimtime=entry.info.swimtime.substring(3)
                    return entry
                })
                hasLoaded.value = true
            } catch (error) {
                console.error('Error fetching entries:', error)
                allEntries.value = []
            } finally {
                isLoading.value = false
            }
            return allEntries.value
        })()

        return loadPromise
    }

    function saveEntry(entry) {
        return new Promise((resolve, reject) => {
            if (entry.id) {
                APIServices.put('saveEntry', entry)
                    .then(() => {
                        resolve(entry)
                    })
                    .catch((error) => {
                        console.error('Error updating entry:', error)
                        reject(error)
                    })
            } else {
                APIServices.post('saveEntry', entry)
                    .then((data) => {
                        entry.id = data.id
                        allEntries.value.push(entry)
                        resolve(entry)
                    })
                    .catch((error) => {
                        console.error('Error creating entry:', error)
                        reject(error)
                    })
            }
        })
    }

    function removeEntry(entryId) {
        return new Promise((resolve, reject) => {
            APIServices.delete('deleteEntry?id=' + entryId)
                .then(() => {
                    allEntries.value = allEntries.value.filter(e => e.id !== entryId)
                    resolve(true)
                })
                .catch((error) => {
                    console.error('Error removing entry:', error)
                    reject(error)
                })
        })
    }

    return {saveEntry, getAllForCompetition, getEntries, removeEntry, allEntries}
})
export default useEntriesStore
