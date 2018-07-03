import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home';
import Presentation from './views/Presentation';
import Admin from './views/Admin';
import CreateGame from  './views/CreateGame';
import EditGame from  './views/EditGame';

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
        },
        {
            path: '/create-game',
            name: 'createGame',
            component: CreateGame
        },
        {
            path: '/edit-game/:gameName',
            name: 'editGame',
            component: EditGame
        },
    ]
})
