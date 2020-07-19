import Vue from 'vue';
import Vuex from 'vuex';
import pathify from 'vuex-pathify';

import accounts from './modules/accounts';
import colors from './modules/colors';
import currencies from './modules/currencies';
import transactions from './modules/transactions';
import user from './modules/user';

Vue.use(Vuex);

//  const state = {
//    greeting: 'Hello',
//    name: 'World'
//  };
//
//  const getters = {
//    message(state) {
//      return `${state.greeting} ${state.name}!`;
//    }
//  };
//
//  const actions = {
//    greet({ getters }) {
//      alert(getters.message);
//    },
//    async ping() {
//      await api.ping();
//    },
//    async pingMutation() {
//      await api.pingMutation();
//    }
//  };
//
//  const mutations = make.mutations(state);

const store = new Vuex.Store({
  modules: {
    accounts,
    colors,
    currencies,
    transactions,
    user
  },
  plugins: [pathify.plugin]
});

export default store;
window.store = store;
