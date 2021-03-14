<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Новости' />

      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' class='loading' />
          <div v-else class='row'>
            <div v-for='item in items' :key='item.id' class='col s12'>
              <Article :item='item' />
            </div>
          </div>
        </div>

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
import Article from '@/components/article';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'News',
  components: {
    Article,
    Loader,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    isPhone: md.phone() != null
  }),
  computed: {
    isSignedIn: get('user/isSignedIn'),
    isGuest: get('user/isGuest'),
    token: get('user/token'),
    email: get('user/email'),
    ...get('articles/*')
  },
  async created() {
    await this.fetch(this.token);
  },
  methods: {
    ...call([
      'articles/fetch',
      'articles/fetchNext'
    ]),
    more() {
      this.fetchNext(this.token);
    }
  }
};
</script>

<style scoped lang='sass'>
.badges
  .badge
    margin-left: 0
    margin-right: 10px
    color: #212121 !important
</style>
