import api from '../../api';

const INITIAL_STATE = {
  isLoading: true,
  isLoaded: false,
  isLoadingPage: false,
  isSubmitting: false,
  isFavouriteOnly: false,
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
    async fetch({ commit, state }, { token, options = {} }) {
      commit('START_LOADING');
      commit('UPDATE_SCOPE', options);
      const { symbolID, isFavouriteOnly, page, perPage } = state;
      const items = await api.articles(token, {
        id: symbolID,
        isFavouriteOnly,
        page,
        perPage
      });
      commit('FINISH_LOADING', items);
    },
    async fetchNext({ commit, state }, { token }) {
      commit('START_NEXT_PAGE');
      const { symbolID, isFavouriteOnly, page, perPage } = state;
      const items = await api.articles(token, {
        id: symbolID,
        isFavouriteOnly,
        page,
        perPage
      });
      commit('FINISH_NEXT_PAGE', items);
    },
    async toggleIsFavourite({ commit, state }, { token, article }) {
      if (state.isSubmitting) { return; }
      commit('START_SUBMITTING');
      const isFavourite = await api.toggleIsFavourite(token, article.id, 's_article');
      commit('TOGGLE_IS_FAVOURITE', { item:article, isFavourite });
      commit('FINISH_SUBMITTING');
      return isFavourite;
    }
  },

  mutations: {
    UPDATE_SCOPE(state, { symbolID, isFavouriteOnly }) {
      Object.assign(
        state,
        { ...INITIAL_STATE, symbolID, isFavouriteOnly }
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
    },
    START_SUBMITTING(state) {
      state.isSubmitting = true;
    },
    FINISH_SUBMITTING(state) {
      state.isSubmitting = false;
    },
    TOGGLE_IS_FAVOURITE(state, { item, isFavourite }) {
      const article = state.items.find(v => v.id === item.id);
      if (article) {
        article.isFavourite = isFavourite;
      }
    }
  }
};
