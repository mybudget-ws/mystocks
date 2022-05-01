import api from '../../api';

const INITIAL_STATE = {
  categories: [],
  series: [],
  isLoading: true
};

export default {
  namespaced: true,
  state: { ...INITIAL_STATE },

  actions: {
    async fetch({ commit }, { token, _options = {} }) {
      commit('START_LOADING');
      // const { symbolId, search, minRating, direction, interval, page, perPage } = state;
      const data = await api.signalsStats(token, {});
      commit('FINISH_LOADING', data);
    }
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
    },
    FINISH_LOADING(state, { categories, series }) {
      state.categories = categories;
      state.series = series;
      state.isLoading = false;
    }
  }
};
