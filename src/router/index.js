import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

/**
 * Define the routes for the application.
 * @type {Array<Object>}
 */
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    }
];

/**
 * Create a router instance with the specified history mode and routes.
 * @returns {Router} The router instance.
 */
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;