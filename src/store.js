import Vue from 'vue';
import Vuex from 'vuex';
import vm from './main.js';
import router from './router.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        auth: '',
        game: undefined,
        isAdmin: false,
        adminData: {}
    },
    mutations: {
        SOCKET_AUTH_SUCCESS(state, auth) {
            state.auth = auth;
            localStorage.setItem('auth', auth);
        },
        SOCKET_AUTH_FAIL(state, message) {
            state.auth = '';
            localStorage.setItem('auth', '');
        },
        SOCKET_LOG_OUT_SUCCESS(state) {
            state.auth = '';
            localStorage.setItem('auth', '');
        },
        SOCKET_ADMIN_SUCCESS(state, adminPassword) {
            state.isAdmin = true;
            localStorage.setItem('admin', adminPassword);
        },
        SOCKET_ADMIN_FAIL(state) {
            state.isAdmin = false;
            localStorage.setItem('admin', '');
        },
        SOCKET_SYNC(state, game) {
            Vue.set(state, 'game', game);
        },
        SOCKET_ADMIN_SYNC(state, adminData) {
            Vue.set(state, 'adminData', adminData);
        },
    },
    actions: {
        authorize(context, auth) {
            if (!auth) { auth = localStorage.getItem('auth') }
            vm.$socket.emit('authorize', auth);
        },
        admin(context, adminPassword) {
            if (!adminPassword) { adminPassword = localStorage.getItem('admin') }
            vm.$socket.emit('admin', adminPassword);
        },
        connect(context) {
            context.getters.auth && context.dispatch('authorize');
            context.getters.admin && context.dispatch('admin');
        },
        logOut(context) {
            vm.$socket.emit('log_out');
        },
        toggleAnswer(context) {
            vm.$socket.emit('toggle_answer');
        },
        attempt(context) {
            vm.$socket.emit('attempt');
        },
        score(context, participant) {
            vm.$socket.emit('score', participant);
        },
        startGame(context) {
            vm.$socket.emit('start_game');
        },
        endGame(context) {
            vm.$socket.emit('end_game');
        },
        prevRound(context) {
            vm.$socket.emit('prev_round');
        },
        nextRound(context) {
            vm.$socket.emit('next_round');
        },
        startRound(context) {
            vm.$socket.emit('start_round');
        },
        loadGame(context, gameId) {
            vm.$socket.emit('load_game', gameId);
        },
        unloadGame(context) {
            vm.$socket.emit('unload_game');
        },
        saveGame(context, game) {
            vm.$socket.emit('save_game', game);
        },
        deleteGame(context, gameId) {
            vm.$socket.emit('delete_game', gameId);
        },

        goToEditGame(context, gameId) {
            router.push({
                name: 'EditGame',
                params: { gameId }
            });
        },
    },
    getters: {
        attempts(state) {
            const attempts = state.game?.attempts;
            if (!attempts) return [];
            const arr = Object.keys(attempts).map((key) => { return {  ...attempts[key], name: key } });
            return arr.length ? arr.sort((a,b) => { return new Date(a.date) > new Date(b.date) }) : arr;
        },
        auth(state) {
            return state.auth || localStorage.getItem('auth');
        },
        admin(state) {
            return state.admin || localStorage.getItem('admin');
        },
        games(state) {
            return state.adminData.savedGames || [];
        },
    }
});
