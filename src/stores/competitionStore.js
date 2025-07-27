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
    sessions: [{
      number:1,
      name: 'Session 1',
      date: '2023-10-01',
      daytime: '15:39'
    }],
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

  return { setCompetition, getCompetition }
})
export default useCompetitionStore;
