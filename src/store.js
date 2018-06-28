import Vue from 'vue';
import Vuex from 'vuex';
import vm from './main.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        auth: '',
        game: {},
        isAdmin: false
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
    },
    actions: {
        authorize(context, auth) {
            if (!auth) { auth = localStorage.getItem('auth') }
            vm.$socket.emit('authorize', auth);
        },
        admin(context, adminPassword) {
            if (context.isAdmin) return;
            if (!adminPassword) { adminPassword = localStorage.getItem('adminPassword') }
            vm.$socket.emit('admin', adminPassword);
        },
        logOut(context) {
            vm.$socket.emit('log_out');
        },
        startGame(context) {
            vm.$socket.emit('start_game');
        },
        prevRound(context) {
            vm.$socket.emit('prev_round');
        },
        nextRound(context) {
            vm.$socket.emit('next_round');
        },
        startRound() {
            vm.$socket.emit('start_round');
        },
        toggleAnswer() {
            vm.$socket.emit('toggle_answer');
        },
        attempt() {
            vm.$socket.emit('attempt');
        },
        score(context, participant) {
            vm.$socket.emit('score', participant);
        },
    },
    getters: {
        attempts(state) {
            const obj = state.game.attempts;
            if (!obj) return [];
            const arr = Object.keys(obj).map((key) => { return { name: key, ...obj[key] } });
            return arr.length ? arr.sort((a,b) => { return new Date(a.date) > new Date(b.date) }) : arr;
        }
    }
});
