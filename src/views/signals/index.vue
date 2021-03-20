<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Сигналы' />

      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' class='loading' />
          <div v-else-if='items.length == 0'>
            <div class='card blue-grey'>
              <div class='card-content white-text'>
                <span class='card-title'>Скоро</span>
                <p>Данный фукнционал находится в разработке</p>
              </div>
            </div>
          </div>
          <table v-else>
            <thead>
              <tr>
                <th class='logoUrl' />
                <th>Инструмент</th>
                <th>Время</th>
                <th>Тип</th>
                <th>Интервал</th>
                <th>Направление</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for='item in items' :key='item.id' @click='gotoStock(item)'>
                <td class='logoUrl'>
                  <img :src='itemLogoUrl(item)'>
                </td>
                <td>
                  <span>{{ itemName(item) }}</span>
                  <span class='symbol'>{{ item.symbol.name }}</span>
                </td>
                <td>{{ itemDate(item) }}</td>
                <td>{{ item.kind }}</td>
                <td>{{ item.interval }}</td>
                <td>{{ item.direction }}</td>
              </tr>
            </tbody>
          </table>
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
const SERVER_UTC_OFFSET = 3;

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'Signals',
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
    ...get('signals/*')
  },
  async created() {
    await this.fetch({ token: this.token });
  },
  methods: {
    ...call([
      'signals/fetch',
      'signals/fetchNext'
    ]),
    more() {
      this.fetchNext({ token: this.token });
    },
    itemLogoUrl({ symbol }) {
      return symbol?.company?.logoUrl || symbol.logoUrl;
    },
    itemName({ symbol }) {
      if (symbol.kind == 'stock') { return symbol.company.name; }
      return symbol.name;
    },
    itemDate({ dateAt }) {
      const date = moment(dateAt).utcOffset(SERVER_UTC_OFFSET, true);
      return date.format('DD.MM.YYYY HH:mm');
    },
    gotoStock({ symbol }) {
      this.$router.push(`/stocks/${symbol.id}`);
    }
  }
};
</script>

<style scoped lang='sass'>
th.logoUrl
  width: 40px

td
  &.logoUrl
    text-align: center

    img
      border-radius: 4px
      margin-bottom: -4px
      height: 24px
      width: 24px

  &.price
    text-align: right

tbody
  tr
    &:hover
      background-color: #fafafa
      cursor: pointer

.symbol
  margin-left: 10px
  color: #90a4ae
</style>
