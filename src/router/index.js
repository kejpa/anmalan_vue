import {createRouter, createWebHistory} from 'vue-router'
import {storeToRefs} from "pinia";
import CompetitionsView from "@/views/CompetitionsView.vue";
import EditCompetitionView from "@/views/EditCompetitionView.vue";
import EntriesView from "@/views/EntriesView.vue";
import EditEventsView from "@/views/EditEventsView.vue";
import useUserStore from "@/stores/userStore.js";
import useCompetitionStore from "@/stores/competitionStore.js";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: CompetitionsView,
        },
        {
            path: '/tavlingar',
            name: 'competitions',
            component: CompetitionsView,
        },
        {
            path: '/tavlingar/:id',
            name: 'competition',
            component: EditCompetitionView,
            beforeEnter: async () => {
                const userStore=useUserStore()
                const {user} = storeToRefs(userStore)

                if (!user.value.isAdmin) {
                    return {name: "competitions"}
                }
            }
        },
        {
            path: '/anmalningar/:id',
            name: 'entries',
            component: EntriesView,
        },
        {
            path: '/grenar/:id',
            name: 'editEvents',
            component: EditEventsView,
            async beforeEnter(to) {
                const competitionStore = useCompetitionStore()
                const {competition} = storeToRefs(competitionStore)
                const id = to.params.id

                // Se till att tävlingen är laddad
                if (!competition.value.id) {
                    await competitionStore.getCompetition(id)
                    console.log(competition.value.id)
                }

                // Blockera om edits inte är tillåtna
                if (!competition.value.editEvents) {
                    return {
                        name: "competitions",
                    }
                }

                // Tillåt navigation
                return true
            }
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue'),
        },
    ],
})

export default router
