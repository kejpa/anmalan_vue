import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import APIServices from '../services/APIServices.js'

const useSwimstyleStore = defineStore('swimstyleStore', () => {
  const swimstyle = ref([])

  function fetch() {
    return new Promise((resolve, reject) =>
      APIServices.get('getSwimstyles')
        .then((data) => {
          swimstyle.value = data
          resolve(true)
        })
        .catch((error) => {
          console.error('Error fetching swim styles:', error)
          reject(error)
        }),
    )
  }

  function getAll() {
    return swimstyle.value
  }

  function getSwimstyle(id) {
    return swimstyle.value.find((style) => style.swimstyleid === id)
  }

  return { fetch, getAll, getSwimstyle }
})
export default useSwimstyleStore
