import { createRouter, createWebHistory } from 'vue-router'
import ContentView from '../views/ContentView.vue';
import User from '@/scripts/User';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'content', component: ContentView },
        { path: '/emailLogin', name: 'emailLogin', component: () => import('../views/EmailLogin.vue') },
        { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
        { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
        { path: '/create', name: 'create', component: () => import('../views/CreateView.vue') },
        { path: '/search', name: 'search', component: () => import('../views/SearchView.vue') },
        { path: '/account', name: 'account', component: () => import('../views/AccountView.vue') }
    ]
});

router.beforeEach((to, from, next) => {
    const connected = User.CurrentUser !== null;
    const bypassRoutes = ['register', 'login', 'emailLogin', 'emailChange'];
    if (bypassRoutes.indexOf(to.name as string) < 0 && !connected) {
        next({ name: 'register' });
        return;
    }
    next();
});

export default router;
