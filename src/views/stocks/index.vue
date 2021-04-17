<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Акции' />

      <Loader v-if='isLoading' class='loading' />

      <div v-if='!isLoading' class='row'>
        <div class='col l3 m6 s12'>
          <input
            v-model.trim='search'
            placeholder='Поиск по символу ↵ Enter'
            @keyup.enter='fetchSearch'
          >
        </div>
      </div>

      <div v-if='!isLoading && isNothingFound' class='row'>
        <p class='col s12 blue-grey-text'>
          По запросу <b>{{ searchPrev }}</b> ничего не найдено.
        </p>
      </div>

      <div v-if='!isLoading && !isNothingFound' class='row'>
        <div class='col s12'>
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th v-if='!isPhone'>Сектор, индустрия</th>
                <th class='right-align'>Цена</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for='item in items' :key='item.id' @click='gotoStock(item)'>
                <td>
                  <span class='logoUrl' :style='backgroundImgStyle(item)' />
                  <span>{{ item.company.name }}</span>
                  <span class='symbol'>{{ item.name }}</span>
                </td>
                <td v-if='!isPhone'>
                  <span
                    v-if='item.company.sector'
                    class='new badge tag indigo lighten-4'
                    :data-badge-caption='item.company.sector.name'
                  />
                  <span
                    v-if='item.company.industry'
                    class='new badge tag indigo lighten-4'
                    :data-badge-caption='item.company.industry.name'
                  />
                </td>
                <td class='price'>
                  <span v-if='item.lastPrice'>${{ item.lastPrice.toFixed(2) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
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

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'Stocks',
  components: {
    Loader,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    search: '',
    searchPrev: '',
    isPhone: md.phone() != null
  }),
  computed: {
    isSignedIn: get('user/isSignedIn'),
    isGuest: get('user/isGuest'),
    email: get('user/email'),
    ...get('stocks/*'),
    isNothingFound() {
      if (this.isLoading) { return false; }
      if (this.searchPrev == '') { return false; }
      return this.items.length === 0;
    }
  },
  async created() {
    await this.fetch({ isPopular: false, search: this.search });
  },
  methods: {
    ...call([
      'stocks/fetch',
      'stocks/fetchNext'
    ]),
    async fetchSearch() {
      this.searchPrev = this.search;
      await this.fetch({ isPopular: false, search: this.search });
    },
    more() {
      this.fetchNext({ isPopular: false, search: this.search });
    },
    gotoStock(symbol) {
      this.$router.push(`/stocks/${symbol.name}`);
    },
    logoUrl(symbol) {
      return symbol?.company?.logoUrl || symbol.logoUrl;
    },
    backgroundImgStyle(symbol) {
      return `background-image: url(${this.logoUrl(symbol)})`;
    }
  }
};
</script>

<style scoped lang='sass'>
.logoUrl
  background-position: center
  background-repeat: no-repeat
  background-size: contain
  border-radius: 4px
  display: inline-block
  height: 24px
  margin-bottom: -7px
  margin-right: 6px
  text-align: center
  width: 24px

td
  &.price
    text-align: right

tbody
  tr
    &:hover
      background-color: #fafafa
      cursor: pointer

.symbol
  color: #90a4ae
  font-weight: 200
  margin-left: 10px

  @media only screen and (max-width: 601px)
    margin-left: 0
    display: block

.badge
  margin-right: 10px
  color: #212121 !important
  // NOTE: To prevent broken badges on the mobile view.
  //       Need another version to show list of stocks for mobile version.
  overflow: hidden
  text-overflow: ellipsis
</style>
