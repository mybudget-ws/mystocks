import Vue from 'vue';
import Vuex from 'vuex';
import pathify from 'vuex-pathify';

import articles from './modules/articles';
import dividends from './modules/dividends';
import indexes from './modules/indexes';
import signals from './modules/signals';
import signalsStats from './modules/signals_stats';
import stocks from './modules/stocks';
import user from './modules/user';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    articles,
    dividends,
    indexes,
    stocks,
    signals,
    signalsStats,
    user
  },
  plugins: [pathify.plugin]
});

export default store;
window.store = store;
