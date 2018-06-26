import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueSocketio from 'vue-socket.io-extended';
import io from 'socket.io-client';
import Helpers from './helpers.js';

Vue.config.productionTip = true;

Vue.use(VueSocketio, io(`${location.protocol}//${location.hostname}:${process.env.VUE_APP_SOCKET_PORT || location.port}`), { store });

Vue.use(Helpers, { store });

export default new Vue({
    router,
    store,
    sockets: {
        connect: function() {
            this.dispatch('authorize');
        }
    },
    render: h => h(App),
}).$mount('#app');
