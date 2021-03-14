<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Новости' />

      <div v-if='isSignedIn' class='row'>
        <div class='col s12'>
          <div
            v-for='(tab, index) in tabs'
            :key='index'
            class='waves-effect waves-purple btn-flat'
            :class="{
              'deep-purple lighten-5 deep-purple-text text-darken-4': index === tabIndex
            }"
            @click='setTab(index)'
          >
            <b v-if='index === tabIndex'>{{ tabs[index] }}</b>
            <span v-else>{{ tabs[index] }}</span>
          </div>
        </div>
      </div>

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
    tabs: [
      'Все', 'Избранные'
    ],
    tabIndex: 0,
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
    await this.fetch({ token: this.token });
  },
  methods: {
    ...call([
      'articles/fetch',
      'articles/fetchNext'
    ]),
    more() {
      this.fetchNext({ token: this.token });
    },
    setTab(index) {
      if (index === this.tabIndex) { return; }
      this.tabIndex = index;
      this.fetch({ token: this.token, options: { isFavouriteOnly: index === 1 } });
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
