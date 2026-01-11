import {defineStore} from 'pinia'
import {ref} from 'vue'
import APIServices from '../services/APIServices.js'

const useSwimstyleStore = defineStore('swimstyleStore', () => {
    const allSwimstyles = ref([])

    function fetch() {
        return new Promise((resolve, reject) => {
                if (allSwimstyles.value.length > 0) {
                    return resolve(true)
                }
                APIServices.get('getSwimstyles')
                    .then((data) => {
                        allSwimstyles.value = data
                        resolve(true)
                    })
                    .catch((error) => {
                        console.error('Error fetching swim styles:', error)
                        reject(error)
                    })
            }
        )
    }

    function getSwimstyle(id) {
        return allSwimstyles.value.find((style) => style.swimstyleid === id)
    }

    return {fetch, getSwimstyle, allSwimstyles}
})
export default useSwimstyleStore
