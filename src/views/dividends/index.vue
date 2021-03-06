<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Ближайшие дивиденды' />

      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' class='loading' />
          <table v-else class='highlight'>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Доход</th>
                <th>Сумма</th>
                <th>Компания</th>
                <th class='right-align'>Цена акции</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for='item in items' :key='item.id' @click='gotoStock(item.symbol)'>
                <td :class="{ 'green-text text-darken-2': isActual(item) }">
                  {{ dateFormat(item) }}
                </td>
                <td
                  :class="{ 'green-text text-darken-2': isActual(item) }"
                  class='no-wrap'
                >
                  {{ percentage(item) }}
                </td>
                <td :class="{ 'green-text text-darken-2': isActual(item) }">
                  ${{ item.amount.toFixed(2) }}
                  <!--Amount
                    :value='item.amount'
                    :currency='item.currency.name'
                  /-->
                </td>
                <td>
                  <span class='logoUrl' :style='backgroundImgStyle(item)' />
                  <span>{{ item.symbol.company.name }}</span>
                  <span class='symbol'>{{ item.symbol.name }}</span>
                </td>
                <td class='price'>
                  <span v-if='item.symbol.lastPrice'>${{ item.symbol.lastPrice.toFixed(2) }}</span>
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
//import Amount from '@/components/amount';

import DateFormat from '@/utils/date_format';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'Dividends',
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
    token: get('user/token'),
    ...get('dividends/*')
  },
  async created() {
    await this.fetch({ token: this.token });
  },
  methods: {
    ...call([
      'dividends/fetch',
      'dividends/fetchNext'
    ]),
    more() {
      this.fetchNext({ token: this.token });
    },
    gotoStock({ name }) {
      this.$router.push(`/stocks/${name}`);
    },
    logoUrl(symbol) {
      return symbol?.company?.logoUrl || symbol.logoUrl;
    },
    dateFormat({ dateAt }) {
      return DateFormat.short(dateAt);
    },
    isActual({ dateAt }) {
      return DateFormat.isActual(dateAt);
    },
    backgroundImgStyle({ symbol }) {
      return `background-image: url(${this.logoUrl(symbol)})`;
    },
    percentage(item) {
      if (item.amount == 0) { return '-'; }
      if (item.symbol?.lastPrice == null) { return '-'; }

      const percentage =  (item.amount / item.symbol?.lastPrice) * 100;
      return `${percentage.toFixed(2)} %`;
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
