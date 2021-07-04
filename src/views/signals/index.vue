<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Сигналы' />

      <div v-if='!isLoading' class='row'>
        <div class='col l3 m6 s12'>
          <input
            v-model.trim='search'
            placeholder='Поиск по символу ↵ Enter'
            @keyup.enter='fetchSearch'
          >
        </div>
        <div class='col l1 m2 s3'>
          <input
            v-model='minRating'
            type='number'
            min='0'
            max='100'
            placeholder='Минимальный рейтинг'
            @keyup.enter='fetchSearch'
          >
        </div>
      </div>

      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' class='loading' />
          <Collection v-else :items='items' is-show-action />
        </div>
      </div>

      <div class='row'>
        <div v-if='!isLoading' class='col s12'>
          <Loader v-if='isLoadingPage' size='small' />
          <br>
          <a
            v-if='!isLoadingPage && isMore'
            class='btn btn-flat'
            @click='more'
          >
            Загрузить ещё...
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Collection from '@/components/signals/collection';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'Signals',
  components: {
    Collection,
    Loader,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    search: '',
    minRating: 20,
    isPhone: md.phone() != null
  }),
  computed: {
    token: get('user/token'),
    ...get([
      'signals/items',
      'signals/isMore',
      'signals/isLoading',
      'signals/isLoadingPage'
    ])
  },
  async mounted() {
    this.search = this.$route.query.search || '';
    this.minRating = parseInt(this.$route.query.minRating) || 20;
    await this.fetch({
      token: this.token,
      options: {
        search: this.search,
        minRating: this.minRating
      }
    });
  },
  methods: {
    ...call([
      'signals/fetch',
      'signals/fetchNext'
    ]),
    async fetchSearch() {
      this.$router.push({
        name: 'signals',
        query: { search: this.search, minRating: this.minRating }
      });
      await this.fetch({
        token: this.token,
        options: {
          search: this.search,
          minRating: parseInt(this.minRating)
        }
      });
    },
    more() {
      this.fetchNext({ token: this.token });
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
