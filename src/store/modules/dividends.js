import api from '../../api';

export default {
  namespaced: true,

  state: {
    isLoading: true,
    isLoaded: false,
    isLoadingPage: false,
    items: [],
    page: 1,
    perPage: 40,
    isMore: true
  },

  actions: {
    async fetch({ commit, state }, { token }) {
      commit('START_LOADING');
      const { page, perPage } = state;
      const items = await api.dividends(token, {
        page,
        perPage
      });
      commit('FINISH_LOADING', items);
    },
    async fetchNext({ commit, state }, { token }) {
      commit('START_NEXT_PAGE');
      const { page, perPage } = state;
      const items = await api.dividends(token, {
        page,
        perPage
      });
      commit('FINISH_NEXT_PAGE', items);
    }
  },

  mutations: {
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
