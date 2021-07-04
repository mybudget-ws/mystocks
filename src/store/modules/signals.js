import api from '../../api';

const INITIAL_STATE = {
  isLoading: true,
  isLoaded: false,
  isLoadingPage: false,
  symbolId: null,
  search: null,
  items: [],
  page: 1,
  perPage: 100,
  isMore: true
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
      const { symbolId, search, page, perPage } = state;
      const items = await api.signals(token, {
        symbolId,
        search,
        page,
        perPage
      });
      commit('FINISH_LOADING', items);
    },
    async fetchNext({ commit, state }, { token }) {
      commit('START_NEXT_PAGE');
      const { symbolId, search, page, perPage } = state;
      const items = await api.signals(token, {
        symbolId,
        search,
        page,
        perPage
      });
      commit('FINISH_NEXT_PAGE', items);
    }
  },

  mutations: {
    UPDATE_SCOPE(state, { symbolId, search }) {
      Object.assign(
        state,
        { ...INITIAL_STATE, symbolId, search }
      );
    },
    START_LOADING(state) {
      state.isLoading = true;
      state.isLoadingPage = false;
      state.isLoaded = false;
      state.isMore = true;
      state.page = 1;
    },
    FINISH_LOADING(state, items) {
      state.items = items;
      state.isLoading = false;
      state.isLoaded = true;
      state.isMore = items.length >= state.perPage;
    },
    START_NEXT_PAGE(state) {
      state.isLoadingPage = true;
      state.page = state.page + 1;
    },
    FINISH_NEXT_PAGE(state, items) {
      state.isLoadingPage = false;
      state.isMore = items.length >= state.perPage;
      state.items = [...state.items, ...items];
    }
  }
};
