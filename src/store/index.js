import Vue from 'vue';
import Vuex from 'vuex';
import pathify from 'vuex-pathify';

import companies from './modules/companies';
import indexes from './modules/indexes';
import stocks from './modules/stocks';
import user from './modules/user';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    companies,
    indexes,
    stocks,
    user
  },
  plugins: [pathify.plugin]
});

export default store;
window.store = store;
