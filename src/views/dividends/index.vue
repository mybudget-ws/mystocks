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
                <td :class="{ 'green-text text-darken-2': isActual(item) }">
                  {{ percentage(item) }}
                </td>
                <td>
                  <Amount
                    :value='item.amount'
                    :currency='item.currency.name'
                  />
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
import Amount from '@/components/amount';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

const moment = require('moment');
moment.locale('ru');
const SERVER_UTC_OFFSET = 3;

export default {
  name: 'Dividends',
  components: {
    Amount,
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
    gotoStock({ id }) {
      this.$router.push(`/stocks/${id}`);
    },
    logoUrl(symbol) {
      return symbol?.company?.logoUrl || symbol.logoUrl;
    },
    dateFormat({ dateAt }) {
      const date = moment(dateAt).utcOffset(SERVER_UTC_OFFSET, true);
      const current = moment().utcOffset(SERVER_UTC_OFFSET, true);
      if (date.isSame(current, 'day')) {
        return 'Сегодня';
      }
      if (current.subtract(1, 'days').isSame(date, 'day')) {
        return 'Вчера';
      }
      if (current.isSame(date, 'year')) {
        return date.format('DD MMMM');
      }
      return date.format('DD.MM.YYYY');
    },
    isActual({ dateAt }) {
      const date = moment(dateAt).utcOffset(SERVER_UTC_OFFSET, true);
      const current = moment().utcOffset(SERVER_UTC_OFFSET, true);
      const yesterday = current.subtract(1, 'days');
      const max = moment.max(date, yesterday);
      return max == date;
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
