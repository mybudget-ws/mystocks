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
          <div class='badges'>
            <span
              v-if='sector'
              class='new badge tag indigo lighten-4'
              :data-badge-caption='sector'
            />
            <span
              v-if='industry'
              class='new badge tag indigo lighten-4'
              :data-badge-caption='industry'
            />
          </div>
          <div class='chart-new' />
          <!--div class='chart' /-->
        </div>

        <div class='col s12'>
          <a
            v-for='item in intervals'
            :key='item.interval'
            class='waves-effect waves-purple btn-flat'
            :class="{
              'deep-purple lighten-5 deep-purple-text text-darken-4': item.interval == interval
            }"
            @click='onChangeInterval(item.interval)'
          >
            <b v-if='item.interval == interval'>{{ item.name }}</b>
            <span v-else>{{ item.name }}</span>
          </a>
        </div>

        <div class='row'>
          <div class='hr col s12' />
        </div>

        <div class='row'>
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
          <div v-if='tabIndex === 0' class='col s12'>
            <div v-for='item in itemsArticles' :key='item.id'>
              <Article :item='item' />
            </div>
          </div>
          <div v-if='tabIndex === 1' class='col s12'>
            <p>{{ description }}</p>
            <p>
              CEO - {{ ceo }}
              <a :href='website' target='_blank' class='website'>{{ website }}</a>
            </p>
          </div>
          <div v-if='tabIndex === 2' class='col s12'>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Amount from '@/components/amount';
import Article from '@/components/article';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import SymbolShow from '@/mixins/symbol_show';
import { get, call } from 'vuex-pathify';

const moment = require('moment');
moment.locale('ru');
const SERVER_UTC_OFFSET = 3;

export default {
  name: 'Company',
  components: {
    Article,
    Amount,
    Loader,
    Menu,
    PageHeader
  },
  mixins: [SymbolShow],
  props: {},
  data: () => ({
    tabs: [
      'Новости', 'Описание', 'Дивиденды'
    ],
    tabIndex: 0
  }),
  computed: {
    itemsArticles: get('articles/items'),
    ceo() { return this?.symbol?.company?.ceo; },
    description() { return this?.symbol?.company?.description; },
    website() { return this?.symbol?.company?.website; },
    sector() { return this?.symbol?.company?.sector?.name; },
    industry() { return this?.symbol?.company?.industry?.name; },
    dividends() {
      if (this.company == null) { return []; }
      if (this.company.dividends == null) { return []; }

      return this.company.dividends;
    }
  },

  methods: {
    fetchArticles: call('articles/fetch'),
    updateArticlesScope: call('articles/updateScope'),
    dateFormatted({ dateAt }) {
      return moment(dateAt)
        .utcOffset(SERVER_UTC_OFFSET, true)
        .format('DD.MM.YYYY');
    },
    setTab(index) {
      this.tabIndex = index;
    },
    async objectCallback() {
      await this.fetchArticles({ symbolID: this.symbol.id });
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

.hr
  margin: 40px 0
  // border-top: 1px solid #90a4ae
  border-top: 1px solid rgba(0, 0, 0, 0.12)

.badges
  display: inline-block

  .badge
    margin-left: 0
    margin-right: 10px
    color: #212121 !important
</style>
