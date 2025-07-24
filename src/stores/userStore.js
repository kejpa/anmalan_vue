import { defineStore } from 'pinia'
import { ref } from 'vue'

const useUserStore = defineStore('userStore', () => {
  const user = ref(null)

  function setUser(newUser) {
    user.value = newUser
  }

  function getUser() {
    return user.value
  }

  return { setUser, getUser }
})
export default useUserStore;
