<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Ближайшие дивиденды' />

      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' class='loading' />
          <table v-else>
            <thead>
              <tr>
                <th class='logoUrl' />
                <th>Компания</th>
                <th class='right-align'>Цена акции</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for='item in items' :key='item.id' @click='gotoStock(item.symbol)'>
                <td class='logoUrl'>
                  <img :src='logoUrl(item.symbol)'>
                </td>
                <td>
                  <span>{{ item.symbol.company.name }}</span>
                  <span class='symbol'>{{ item.symbol.name }}</span>
                </td>
                <td class='price'>
                  <span v-if='item.symbol.lastPrice'>${{ item.symbol.lastPrice }}</span>
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
    gotoStock({ id }) {
      this.$router.push(`/stocks/${id}`);
    },
    logoUrl(symbol) {
      return symbol?.company?.logoUrl || symbol.logoUrl;
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
