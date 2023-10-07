import api from '../../api';

const INITIAL_STATE = {
  isLoading: true,
  isLoaded: false,
  symbolId: null,
  search: null,
  minRating: null,
  direction: null,
  items: []
};

export default {
  namespaced: true,
  state: { ...INITIAL_STATE },

  actions: {
    updateScope({ commit, state }, { symbolId }) {
      if (state.symbolId == symbolId) { return; }
      commit('UPDATE_SCOPE', symbolId);
    },
    async fetch({ commit, state }, { token, options = {} }) {
      commit('START_LOADING');
      commit('UPDATE_SCOPE', options);
      const { symbolId, search, minRating, direction } = state;
      const items = await api.deals(token, {
        symbolId,
        search,
        minRating,
        direction
      });
      commit('FINISH_LOADING', items);
    }
  },

  mutations: {
    UPDATE_SCOPE(state, { symbolId, search, minRating, direction }) {
      Object.assign(
        state,
        { ...INITIAL_STATE, symbolId, search, minRating, direction }
      );
    },
    START_LOADING(state) {
      state.isLoading = true;
      state.isLoaded = false;
    },
    FINISH_LOADING(state, items) {
      state.items = items;
      state.isLoading = false;
      state.isLoaded = true;
    }
  }
};
