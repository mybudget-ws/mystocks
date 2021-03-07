<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader :name='name'>
        <img v-if='!isLoading' class='logo' :src='logoUrl'>
        <Amount
          v-if='!isLoading'
          class='last-price'
          :value='lastPriceAmount'
          currency='USD'
        />
      </PageHeader>

      <Loader v-if='isLoading' />
      <div v-else class='row'>
        <div class='col s12'>
          <div class='chart-new' />
          <!--div class='chart' /-->
        </div>

        <div class='col s12'>
          <div class='row'>
            <div class='col s12 m6 offset-m6 l2 offset-l10'>
              <select
                ref='selectIntervals'
                v-model='interval'
                :class="{ 'browser-default': true }"
                @change='onChangeInterval'
              >
                <option v-for='v in intervals' :key='v.interval' :value='v.interval'>
                  {{ v.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class='col s12'>
          <!--h5>Дивиденды</h5-->
          <table>
            <thead>
              <tr>
                <th>Дивиденды</th>
                <th>Дата</th>
                <th>Частота</th>
                <th>Детали</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for='item in dividends'
                :key='item.id'
              >
                <td>
                  <Amount
                    :value='item.amount'
                    :currency='item.currency.name'
                  />
                </td>
                <td>{{ dateFormatted(item) }}</td>
                <td>{{ item.frequency }}</td>
                <td>{{ item.description }} ({{ item.flag }})</td>
              </tr>
            </tbody>
          </table>
          <p v-if='dividends.length === 0' class='note'>
            В ближайшее время дивидендов нет
          </p>
        </div>

        <div class='col s12'>
          <h5>Описание</h5>
          <p>{{ description }}</p>
          <p>
            CEO - {{ ceo }}
            <a :href='website' target='_blank' class='website'>{{ website }}</a>
          </p>
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
import SymbolShow from '@/mixins/symbol_show';
// import { get } from 'vuex-pathify';

const moment = require('moment');
moment.locale('ru');
// const SERVER_UTC_OFFSET = 3;

export default {
  name: 'Company',
  components: {
    Amount,
    Loader,
    Menu,
    PageHeader
  },
  mixins: [SymbolShow],
  props: {},
  data: () => ({}),
  computed: {
    ceo() { return this?.symbol?.company?.ceo; },
    description() { return this?.symbol?.company?.description; },
    website() { return this?.symbol?.company?.website; },
    dividends() {
      if (this.company == null) { return []; }
      if (this.company.dividends == null) { return []; }

      return this.company.dividends;
    }
  },

  async mounted() {
    this.$nextTick(() => {
      /* eslint-disable */
      M.FormSelect.init(this.$refs.selectIntervals, {});
      M.updateTextFields();
      /* eslint-enable */
    });
  },

  methods: {
    dateFormatted({ dateAt }) {
      return moment(dateAt).format('DD.MM.YYYY');
    }
  }
};
</script>

<style scoped lang='sass'>
// .chart
//   height: 400px
//   margin-left: -12px

.last-price
  font-size: 28px

  @media only screen and (min-width: 993px)
    display: inline-block
    margin-left: 20px

.logo
  height: 48px
  width: 48px
  vertical-align: top
  border-radius: 40px
  float: right

.website
  display: block

.chart-new
  height: 600px
  margin-left: -30px

  @media only screen and (min-width: 993px)
    margin-right: -30px

.note
  margin-left: 4px
  color: #90a4ae
</style>
