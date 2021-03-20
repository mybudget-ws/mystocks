import Vue from 'vue';
import Vuex from 'vuex';
import pathify from 'vuex-pathify';

import articles from './modules/articles';
import indexes from './modules/indexes';
import stocks from './modules/stocks';
import signals from './modules/signals';
import user from './modules/user';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    articles,
    indexes,
    stocks,
    signals,
    user
  },
  plugins: [pathify.plugin]
});

export default store;
window.store = store;
