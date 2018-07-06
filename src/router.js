import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home';
import Presentation from './views/Presentation';
import Admin from './views/Admin';
import AdminIndex from './views/AdminIndex';
import CreateGame from  './views/CreateGame';
import EditGame from  './views/EditGame';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/presentation',
            name: 'Presentation',
            component: Presentation
        },
        {
            path: '/admin',
            component: Admin,
            children: [
                {
                    path: '',
                    name: 'AdminIndex',
                    component: AdminIndex
                },
                {
                    path: 'create-game',
                    name: 'CreateGame',
                    component: CreateGame
                },
                {
                    path: 'edit-game/:gameId',
                    name: 'EditGame',
                    component: EditGame
                },
            ]
        },
    ]
})
