<template>
  <div class='main-background'>
    <Menu />
    <div class='container main'>
      <div class='row'>
        <div class='col'>
          <h1 class='white-text'>Моя Биржа</h1>
          <h5 class='grey-text text-lighten-3'>Акции, индексы, новости</h5>
          <h6 class='grey-text text-lighten-2'>Нью-Йоркская фондовая биржа</h6>
        </div>
      </div>
    </div>

    <!--div class='container'>
      <div class='row'>
        <div class='col'>
          <div class='feature'>
            <h5>In DEV...</h5>
            Soon...
          </div>
        </div>
        <div v-if='!isSignedIn' class='col'>
          <div class='feature'>
            <h5>Вы не авторизованы</h5>
            Soon...
          </div>
        </div>
        <div v-if='isGuest' class='col'>
          <div class='feature'>
            <h5>Добро пожаловать, гость</h5>
            Soon...
          </div>
        </div>
        <div v-if='isSignedIn && !isGuest' class='col'>
          <div class='feature'>
            <h5>Добро пожаловать, {{ email }}</h5>
            Soon...
          </div>
        </div>
      </div>
    </div-->

    <div class='container companies'>
      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' class='loading' />
          <table v-else>
            <thead>
              <tr>
                <th class='logoUrl' />
                <th class='date'>Акции</th>
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
          <br>
          <router-link v-if='!isLoading' to='/stocks' class='btn btn-flat'>
            Все акции
          </router-link>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/footer';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'Home',
  components: {
    Footer,
    Loader,
    Menu
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
    await this.fetch();
  },
  methods: {
    ...call([
      'stocks/fetch'
    ]),
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
h1
  margin-bottom: 0px

.getstarted
  margin-top: 40px
  margin-bottom: 20px

.top-header
  height: 40px
  padding: 20px

.container.main
  padding-bottom: 40px

.feature
  background: #fff
  padding: 10px 20px 18px
  border-radius: 10px
  min-height: 10px
  margin-bottom: 20px
  margin-top: 210px

.main-background
  &:before
    background-image: url('../assets/home-background.svg')
    background-repeat: no-repeat
    position: absolute
    width: 100%
    height: 840px
    content: ''
    background-size: cover
    z-index: -1

.container.companies
  .row
    background-color: #fff
    border-radius: 6px

  .loading
    padding-bottom: 600px

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
