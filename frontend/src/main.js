import Vue from 'vue';
import './plugins/axios';
import './plugins/vuetify';
import './plugins/vue-moment';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App),
    async mounted() {
        //await store.dispatch('checkLogin');
    }
}).$mount('#app');
