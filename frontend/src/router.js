import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Dashboard',
            component: () => import('./views/Dashboard.vue'),
            meta: {
                authRequired: true
            }
        },
        {
            path: '/readers',
            name: 'Reader List',
            component: () => import('./views/Readers.vue'),
            meta: {
                authRequired: true
            }
        },
        {
            path: '/cards',
            name: 'Card List',
            component: () => import('./views/Cards.vue'),
            meta: {
                authRequired: true
            }
        },
        {
            path: '/logs',
            name: 'Log List',
            component: () => import('./views/Logs.vue'),
            meta: {
                authRequired: true
            }
        },
        {
            path: '/login',
            name: 'Login',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "about" */ './views/Login.vue')
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.authRequired)) {
        if (!store.getters.isAuthenticated) {
            const isLogin = await store.dispatch('checkLogin');
            if (isLogin) {
                return next();
            }

            return next({
                path: '/login'
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
