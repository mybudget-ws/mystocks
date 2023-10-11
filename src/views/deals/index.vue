<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Сделки' />

      <div v-if='!isLoading' class='row'>
        <div class='col l3 m6 s12'>
          <div class='card-panel z-depth-0 indigo lighten-4'>
            <div class='card-content'>
              <b class='card-title'>Всего</b>
              <div>{{ items.length }}</div>
            </div>
          </div>
        </div>

        <div class='col l3 m6 s12'>
          <div class='card-panel z-depth-0 green lighten-4'>
            <div class='card-content'>
              <b class='card-title'>Покупка</b>
              <div>{{ buyCount }}</div>
            </div>
          </div>
        </div>

        <div class='col l3 m6 s12'>
          <div class='card-panel z-depth-0 red lighten-4'>
            <div class='card-content'>
              <b class='card-title'>Продажа</b>
              <div>{{ sellCount }}</div>
            </div>
          </div>
        </div>

        <div class='col l3 m6 s12'>
          <div class='card-panel z-depth-0 amber lighten-4'>
            <div class='card-content'>
              <b class='card-title'>Доход</b>
              <div>{{ totalProfitPercent }}%</div>
            </div>
          </div>
        </div>
      </div>

      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' class='loading' />
          <Collection v-else :items='items' is-show-action />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Collection from '@/components/deals/collection';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'Deals',
  components: {
    Collection,
    Loader,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    isPhone: md.phone() != null
  }),
  computed: {
    token: get('user/token'),
    ...get([
      'deals/items',
      'deals/isLoading'
    ]),
    buyCount() {
      if (this.isLoading) return 0;
      return this.items.filter(v => v.direction === 'buy').length;
    },
    sellCount() {
      if (this.isLoading) return 0;
      return this.items.filter(v => v.direction === 'sell').length;
    },
    totalProfitPercent() {
      if (this.isLoading) return 0;
      const amout = this.items.map(v => v.profitPercent).reduce((sum, v) => sum + v, 0);
      return amout.toFixed(2);
    }
  },
  async mounted() {
    await this.fetch({
      token: this.token,
      options: {
        search: '',
        minRating: 10,
        direction: '',
        interval: 'h1'
      }
    });
  },
  methods: {
    ...call([
      'deals/fetch'
    ])
  }
};
</script>

<style scoped lang='sass'>
</style>
