import { defineStore } from 'pinia'
import { ref } from 'vue'

const useCompetitionStore = defineStore('competitionStore', () => {
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
    swimTimePeridStartDate: '',
    swimTimePeridEndDate: '',
    allowRegisterSwimTimes: false,
    currentCourseOnly: false,
    addEvents: false,
    reorderEvents: false,
  })

  function setCompetition(newCompetition) {
    competition.value = newCompetition
  }

  function getCompetition() {
    return competition.value
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
            resolve(true)
          })
          .catch((error) => {
            console.error('Error creating competition:', error)
            reject(error)
          })
      }
    })
  }

  return { setCompetition, getCompetition, saveCompetition }
})
export default useCompetitionStore
