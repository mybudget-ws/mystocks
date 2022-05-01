import api from '../../api';

const INITIAL_STATE = {
  isLoading: true
};

export default {
  namespaced: true,
  state: { ...INITIAL_STATE },

  actions: {
    async fetch({ commit, state }, { token, options = {} }) {
      commit('START_LOADING');
      commit('UPDATE_SCOPE', options);
      const { symbolId, search, minRating, direction, interval, page, perPage } = state;
      const items = await api.signals(token, {
        symbolId,
        search,
        minRating,
        direction,
        interval,
        page,
        perPage
      });
      commit('FINISH_LOADING', items);
    }
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
    },
    FINISH_LOADING(state, /*items*/) {
      state.isLoading = false;
    }
  }
};
