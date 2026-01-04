import { defineStore } from 'pinia'
import { ref } from 'vue'

const useUserStore = defineStore('userStore', () => {
  const user = ref(null)

  function setUser(newUser) {
    user.value = newUser
  }

  return { setUser, user }
})
export default useUserStore
