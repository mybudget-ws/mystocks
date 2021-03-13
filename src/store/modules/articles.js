import api from '../../api';

const INITIAL_STATE = {
  isLoading: true,
  isLoaded: false,
  isLoadingPage: false,
  symbolID: null,
  items: [],
  page: 1,
  perPage: 20,
  isMore: true
};

export default {
  namespaced: true,
  state: { ...INITIAL_STATE },

  actions: {
    updateScope({ commit, state }, { symbolID }) {
      if (state.symbolID == symbolID) { return; }
      commit('UPDATE_SCOPE', symbolID);
    },
    async fetch({ commit, state }, options = {}) {
      commit('START_LOADING');
      commit('UPDATE_SCOPE', options?.symbolID || null);
      const { symbolID, page, perPage } = state;
      const items = await api.articles({
        id: symbolID,
        page,
        perPage
      });
      commit('FINISH_LOADING', items);
    },
    async fetchNext({ commit, state }) {
      commit('START_NEXT_PAGE');
      const { symbolID, page, perPage } = state;
      const items = await api.articles({
        id: symbolID,
        page,
        perPage
      });
      commit('FINISH_NEXT_PAGE', items);
    }
  },

  mutations: {
    UPDATE_SCOPE(state, symbolID) {
      Object.assign(
        state,
        { ...INITIAL_STATE, symbolID: symbolID }
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
