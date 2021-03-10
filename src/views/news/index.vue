<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Новости' />

      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' class='loading' />
          <div v-else class='row'>
            <!-- TODO: Extract news component -->
            <div v-for='item in items' :key='item.id' class='col s12'>
              <div class='card'>
                <div class='card-content'>
                  <div class='badges'>
                    <span
                      v-for='symbol in item.symbols'
                      :key='symbol.id'
                      class='new badge tag indigo lighten-4'
                      :data-badge-caption='symbol.name'
                    />
                  </div>
                  <span class='card-title'>{{ item.title }}</span>
                  <p>{{ item.summary }}</p>
                  <br>
                  <p class='grey-text'>{{ dateFormat(item) }}</p>
                  <p><a :href='item.url' target='_blank'>Источник: {{ item.source }}</a></p>
                </div>
              </div>
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
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

const moment = require('moment');
moment.locale('ru');

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'News',
  components: {
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
    email: get('user/email'),
    ...get('articles/*')
  },
  async created() {
    await this.fetch();
  },
  methods: {
    ...call([
      'articles/fetch',
      'articles/fetchNext'
    ]),
    more() {
      this.fetchNext();
    },
    dateFormat(news) {
      const date = moment(news.dateAt);
      const current = moment();
      if (moment(date).isSame(current, 'day')) {
        return `Сегодня ${date.format('hh:mm')}`;
      }
      if (current.subtract(1, 'days').isSame(date, 'day')) {
        return `Вчера ${date.format('hh:mm')}`;
      }
      return date.format('DD.MM.YYYY hh:mm');
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
