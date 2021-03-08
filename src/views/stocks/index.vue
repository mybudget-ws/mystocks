<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Акции' />

      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' class='loading' />
          <table v-else>
            <thead>
              <tr>
                <th class='logoUrl' />
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for='item in items' :key='item.id' @click='gotoStock(item)'>
                <td class='logoUrl'>
                  <img :src='logoUrl(item)'>
                </td>
                <td>
                  <span>{{ item.company.name }}</span>
                  <span class='symbol'>{{ item.name }}</span>
                </td>
                <td class='price'>
                  <span v-if='item.lastPrice'>$ {{ item.lastPrice }}</span>
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
    isPhone: md.phone() != null
  }),
  computed: {
    isSignedIn: get('user/isSignedIn'),
    isGuest: get('user/isGuest'),
    email: get('user/email'),
    ...get('stocks/*')
  },
  async created() {
    await this.fetch({ isPopular: false });
  },
  methods: {
    ...call([
      'stocks/fetch',
      'stocks/fetchNext'
    ]),
    more() {
      this.fetchNext({ isPopular: false });
    },
    gotoStock(symbol) {
      this.$router.push(`/stocks/${symbol.id}`);
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
  margin-left: 10px
  color: #90a4ae
</style>
