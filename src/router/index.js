import {createRouter, createWebHistory} from 'vue-router'
import CompetitionsView from "@/views/CompetitionsView.vue";
import EditCompetitionView from "@/views/EditCompetitionView.vue";
import EntriesView from "@/views/EntriesView.vue";
import {storeToRefs} from "pinia";
import useUserStore from "@/stores/userStore.js";

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
            beforeEnter: () => {
                const {user} = storeToRefs(useUserStore())

                if (!user.isAdmin) {
                    return { name: "competitions" }
                }
            }
        },
        {
            path: '/anmalningar/:id',
            name: 'entries',
            component: EntriesView,
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
