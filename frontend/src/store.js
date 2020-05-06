import Vue from 'vue';
import Vuex from 'vuex';
import router from '@/router';

Vue.use(Vuex);

const directions_reader = [
    { value: 'in', text: 'In' },
    { value: 'out', text: 'Out' }
];

const types_reader = [
    { value: 'RS232', text: 'RS232' },
    { value: 'Wiegand', text: 'Wiegand' }
];
const formats_reader = [
    { value: 'decimal', text: 'Decimal' },
    { value: 'hex', text: 'HEX' },
    { value: 'decimal-1c', text: '1C Decimal' }
];
export default new Vuex.Store({
    state: {
        readers: [],
        cards: [],
        card_logs: [],
        logs: [],
        directions_reader: directions_reader,
        types_reader: types_reader,
        formats_reader: formats_reader,
        apiUrl: 'api',
        user: null,
        isProcess: false,
        errorMessage: null
    },
    mutations: {
        setReaders(state, payload) {
            state.readers = payload;
        },
        setCards(state, payload) {
            state.cards = payload;
        },
        setCardLogs(state, payload) {
            state.card_logs = payload;
        },
        setLogs(state, payload) {
            state.logs = payload;
        },
        setUser(state, payload) {
            state.user = payload;
            if (payload) {
                sessionStorage.setItem('auth_user', JSON.stringify(payload));
            } else {
                sessionStorage.removeItem('auth_user');
            }
        },
        setError(state, payload) {
            state.errorMessage = payload;
            state.user = null;
            state.isProcess = false;
        },
        setIsProcess(state, payload) {
            if (payload) state.errorMessage = null;
            state.isProcess = payload;
        }
    },
    actions: {
        async getReaders({ state, commit }) {
            try {
                let response = await Vue.axios.get(`${state.apiUrl}/readers`);

                commit('setReaders', response.data);
            } catch (error) {
                commit('setReaders', []);
            }
        },
        async getCards({ state, commit }) {
            try {
                let response = await Vue.axios.get(`${state.apiUrl}/cards`);

                commit('setCards', response.data);
            } catch (error) {
                commit('setCards', []);
            }
        },
        async getCardLogs({ state, commit }, card_id) {
            try {
                let response = await Vue.axios.get(`${state.apiUrl}/logs/${card_id}`);

                commit('setCardLogs', response.data);
            } catch (error) {
                commit('setCardLogs', []);
            }
        },
        async getLogs({ state, commit }) {
            try {
                let response = await Vue.axios.get(`${state.apiUrl}/logs`);

                commit('setLogs', response.data);
            } catch (error) {
                commit('setLogs', []);
            }
        },
        async pushLogs({ state, commit }) {
            try {
                let response = await Vue.axios.get(`${state.apiUrl}/logs/push`);
                return response.data;
            } catch (error) {
                commit('setError', error.response.data.message);
            }
        },

        doLogin({ commit }, loginData) {
            commit('setIsProcess', true);
            Vue.axios
                .post('api/auth/login', {
                    ...loginData
                })
                .then(response => {
                    commit('setUser', response.data.user);
                    commit('setIsProcess', false);
                    router.push('/');
                })
                .catch(error => {
                    commit('setError', error.response.data.message);
                });
        },
        doLogout({ commit }) {
            commit('setIsProcess', true);
            Vue.axios
                .get('api/auth/logout')
                .then(() => {
                    commit('setUser', null);
                    commit('setIsProcess', false);
                    router.push('/login');
                })
                .catch(error => {
                    commit('setError', error.response.data.message);
                });
        },
        async checkLogin({ state, commit }) {
            try {
                const resp = await Vue.axios.get(`${state.apiUrl}/auth`);
                commit('setUser', resp.data.user);
                return true;
            } catch (error) {
                commit('setError', error.response.data.message);
                return false;
            }
        },
        async addReader({ state, commit }, payload) {
            try {
                const res = await Vue.axios.post(`${state.apiUrl}/readers`, payload);
                return res.data;
            } catch (error) {
                commit('setError', error.response.data.message);
            }
        },
        async updateReader({ state, commit }, payload) {
            try {
                let { id } = payload;
                const res = await Vue.axios.put(`${state.apiUrl}/readers/${id}`, payload);
                return res.data;
            } catch (error) {
                commit('setError', error.response.data.message);
            }
        },
        async deleteReader({ state, commit }, payload) {
            try {
                return await Vue.axios.delete(`${state.apiUrl}/readers/${payload}`);
            } catch (error) {
                commit('setError', error.response.data.message);
            }
        },
        async updatePassword({ state, commit }, payload) {
            try {
                const res = await Vue.axios.put(`${state.apiUrl}/auth/update-password`, payload);
                return res.data;
            } catch (error) {
                commit('setError', error.response.data.message);
            }
        },
        openReader({ state, commit }, payload) {
            try {
                let { id } = payload;
                const res = Vue.axios.post(`${state.apiUrl}/readers/open/${id}`);
                return res.data;
            } catch (error) {
                commit('setError', error.response.data.message);
            }
        }
    },
    getters: {
        isAuthenticated(state) {
            var status = state.user !== undefined && state.user !== null;
            return status;
        }
    }
});
