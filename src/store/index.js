import Vue from 'vue';
import Vuex from 'vuex';
import pathify from 'vuex-pathify';

import articles from './modules/articles';
import deals from './modules/deals';
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
    deals,
    dividends,
    indexes,
    signals,
    signalsStats,
    stocks,
    user
  },
  plugins: [pathify.plugin]
});

export default store;
window.store = store;
