import api from '../../api';

export default {
  namespaced: true,

  state: {
    isLoading: true,
    isLoaded: false,
    items: []
  },

  // getters: {
  //   visibleItems: state => state.items.filter(v => !v.isHidden),
  //   hiddenItems: state => state.items.filter(v => v.isHidden),
  //   visibleItemsFilter: state => state.itemsFilter.filter(v => !v.isHidden)
  // },

  actions: {
    async fetch({ commit }) {
      commit('START_LOADING');
      const items = await api.companies();
      commit('FINISH_LOADING', items);
    }
    // async toggleIsFavourite({ commit }, { token, account }) {
    //   commit('START_SUBMITTING');
    //   const isFavourite = await api.toggleIsFavourite(token, account.id, 'account');
    //   commit('TOGGLE_IS_FAVOURITE', { item:account, isFavourite });
    //   commit('FINISH_SUBMITTING');
    //   return isFavourite;
    // }
  },

  mutations: {
    START_LOADING(state) {
      state.isLoading = true;
    },
    FINISH_LOADING(state, items) {
      state.items = items;
      state.isLoading = false;
      state.isLoaded = true;
    },
    START_SUBMITTING(state) {
      state.isSubmitting = true;
    },
    FINISH_SUBMITTING(state) {
      state.isSubmitting = false;
      state.isLoadedFilter = false;
    },
    TOGGLE_IS_FAVOURITE(state, { item, isFavourite }) {
      const account = state.items.find(v => v.id === item.id);
      if (account == null) { return; }
      account.isFavourite = isFavourite;
    }

    // START_LOADING_FILTER(state) {
    //   state.isLoadingFilter = true;
    // },
    // FINISH_LOADING_FILTER(state, items) {
    //   state.itemsFilter = items;
    //   state.isLoadingFilter = false;
    //   state.isLoadedFilter = true;
    // }
  }
};
