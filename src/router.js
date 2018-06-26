import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Presentation from './views/Presentation.vue';
import Admin from './views/Admin.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/presentation',
            name: 'presentation',
            component: Presentation
        },
        {
            path: '/admin',
            name: 'admin',
            component: Admin
        }
    ]
})
