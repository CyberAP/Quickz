import Vue from 'vue';
import Vuex from 'vuex';
import vm from './main.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        auth: '',
        game: {},
        answer: '',
        isAdmin: true
    },
    mutations: {
        SOCKET_AUTH_SUCCESS(state, auth) {
            state.auth = auth;
            localStorage.setItem('auth', auth);
        },
        SOCKET_LOG_OUT_SUCCESS(state) {
            state.auth = '';
            localStorage.setItem('auth', '');
        },
        SOCKET_ADMIN_SUCCESS(state, adminPassword) {
            state.isAdmin = true;
            localStorage.setItem('admin', adminPassword);
        },
        SOCKET_SYNC(state, game) {
            Vue.set(state, 'game', game);
        },
        SOCKET_REVEAL_ANSWER(state, answer) {
            state.answer = answer;
        },
        CLEAR_ANSWER(state) {
            state.answer = '';
        }
    },
    actions: {
        authorize(context, auth) {
            if (!auth) { auth = localStorage.getItem('auth') }
            if (auth) { vm.$socket.emit('authorize', auth); }
        },
        admin(context, adminPassword) {
            if (context.store.isAdmin) return;
            if (!adminPassword) { adminPassword = localStorage.getItem('adminPassword') }
            if (adminPassword) { vm.$socket.emit('admin', adminPassword); }
        },
        logOut(context) {
            vm.$socket.emit('log_out');
        },
        startGame(context) {
            context.commit('CLEAR_ANSWER');
            vm.$socket.emit('start_game');
        },
        prevRound(context) {
            context.commit('CLEAR_ANSWER');
            vm.$socket.emit('prev_round');
        },
        nextRound(context) {
            context.commit('CLEAR_ANSWER');
            vm.$socket.emit('next_round');
        },
        startRound() {
            vm.$socket.emit('start_round');
        },
        revealAnswer() {
            vm.$socket.emit('reveal_answer');
        },
        clearAnswer(context) {
            context.commit('CLEAR_ANSWER');
        },
        attempt() {
            vm.$socket.emit('attempt');
        },
        score(context) {
            vm.$socket.emit('score', context.state.auth);
        },
    },
});
