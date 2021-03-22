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
                <th>Время</th>
                <th>Тип</th>
                <th>Интервал</th>
                <th>Направление</th>
                <th>Инструмент</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for='item in items' :key='item.id' @click='gotoStock(item)'>
                <td :class="{ 'green-text text-darken-2': isActual(item) }">
                  {{ itemDate(item) }}
                </td>
                <td>{{ item.kind }}</td>
                <td>{{ item.interval }}</td>
                <td>{{ item.direction }}</td>
                <td>
                  <span class='logoUrl' :style='backgroundImgStyle(item)' />
                  <span>{{ itemName(item) }}</span>
                  <span class='symbol'>{{ item.symbol.name }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DateFormat from '@/utils/date_format';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

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
    logoUrl(symbol) {
      return symbol?.company?.logoUrl || symbol.logoUrl;
    },
    itemName({ symbol }) {
      if (symbol.kind == 'stock') { return symbol.company.name; }
      return symbol.name;
    },
    itemDate({ dateAt }) {
      return DateFormat.shortTime(dateAt);
    },
    isActual({ dateAt }) {
      return DateFormat.isActual(dateAt);
    },
    backgroundImgStyle({ symbol }) {
      return `background-image: url(${this.logoUrl(symbol)})`;
    },
    gotoStock({ symbol }) {
      this.$router.push(`/stocks/${symbol.id}`);
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
</style>
