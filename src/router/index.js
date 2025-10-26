import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CompetitionsView from "@/views/CompetitionsView.vue";
import EditCompetitionView from "@/views/EditCompetitionView.vue";
import EntriesView from "@/views/EntriesView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
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
            props: true,
        },
        {
            path: '/anmalningar/:id',
            name: 'entries',
            component: EntriesView,
            props: true,
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
