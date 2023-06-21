<template>
  <div class='main-background'>
    <Menu />
    <div class='container main'>
      <div class='row'>
        <div class='col-12'>
          <h1 class='white-text'>Моя Биржа</h1>
          <h2 class='grey-text text-lighten-3'>Посторонним в!</h2>
        </div>
      </div>
    </div>

    <section class='container'>
      <div
        v-for='(row, index) in instruments'
        :key='index'
        class='row'
      >
        <div
          v-for='item in row'
          :key='item.symbol'
          class='col s6'
          @click='gotoInstrument(item.symbol)'
        >
          <div class='instrument' :class='item.displayClass'>
            <div class='name'>{{ item.name }}</div>
            <div class='kind'>{{ item.kind }}</div>
          </div>
        </div>
      </div>
      <div class='row'>
        <router-link to='/signals' class='col s12'>
          <span class='instrument gr-green'>
            <span class='name'>Сигналы</span>
          </span>
        </router-link>
      </div>
    </section>

    <section class='container'>
      <div
        v-for='(row, index) in archive'
        :key='index'
        class='row'
      >
        <div
          v-for='item in row'
          :key='item.symbol'
          class='col s6'
          @click='gotoInstrument(item.symbol)'
        >
          <div class='instrument' :class='item.displayClass'>
            <div class='name'>{{ item.name }}</div>
            <div class='kind'>{{ item.kind }}</div>
          </div>
        </div>
      </div>
    </section>

    <div class='container'>
      <div class='row'>
        <div class='col-12'>
          <h3>Время клиринга на ММВБ</h3>
          <table class='striped'>
            <thead>
              <tr>
                <th>Дневная сессия</th>
                <th>Вечерняя сессия</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>с 14:00 до 14:05</td>
                <td>с 18:45 до 19:00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class='blank-content' />

    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/footer';
import Menu from '@/components/menu';
import { get } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'Home',
  components: {
    Footer,
    Menu
  },
  props: {},
  data: () => ({
    isPhone: md.phone() != null,
    instruments: [
      [
        { symbol: 'SIU3', name: 'SiU3', kind: 'Фьючерс', displayClass: 'gr-blue' },
        { symbol: 'RMU3', name: 'RMU3', kind: 'Фьючерс', displayClass: 'gr-blue' }
      ], [
        { symbol: 'USD000UTSTOM', name: 'USD / RUB', kind: 'Курс', displayClass: 'gr-orange' },
        { symbol: 'CNYRUB_TOM', name: 'CNY / RUB', kind: 'Курс', displayClass: 'gr-orange' }
      ]
    ],
    archive: [
      [
        { symbol: 'SIM3', name: 'SiM3', kind: 'Фьючерс (архив)', displayClass: 'gr-gray' },
        { symbol: 'RIM3', name: 'RIM3', kind: 'Фьючерс (архив)', displayClass: 'gr-gray' },
        { symbol: 'SIH3', name: 'SiH3', kind: 'Фьючерс (архив)', displayClass: 'gr-gray' },
        { symbol: 'RMH3', name: 'RMH3', kind: 'Фьючерс (архив)', displayClass: 'gr-gray' }
      ]
    ]
  }),
  computed: {
    isSignedIn: get('user/isSignedIn'),
    isGuest: get('user/isGuest'),
    email: get('user/email'),
    token: get('user/token')
  },
  methods: {
    gotoInstrument(symbol) {
      this.$router.push(`/instruments/${symbol}`);
    }
  }
};
</script>

<style scoped lang='sass'>
.main-background
  background: linear-gradient(137.04deg, rgb(52, 111, 225) 33.4%, rgb(88, 68, 195) 82.8%)
  background-repeat: no-repeat
  background-size: 100% 360px

h1
  margin-bottom: 0px

h2
  font-size: 2.8rem

h3
  font-size: 2.2rem

section
  background-color: #fff
  border-radius: 20px
  padding: 20px 10px

.blank-content
  margin-bottom: 600px

.instrument
  display: block
  background-repeat: no-repeat
  border-radius: 12px
  color: #fff
  cursor: pointer
  padding: 20px

  &:hover
    opacity: 0.8

  &:active
    opacity: 0.9

  &.gr-blue
    background: linear-gradient(137.04deg, rgb(52, 111, 225) 33.4%, rgb(88, 68, 195) 82.8%)

  &.gr-orange
    background: linear-gradient(137.04deg, rgb(225, 136, 52) 33.4%, rgb(238, 110, 50) 82.8%)

  &.gr-green
    background: linear-gradient(137.04deg, #26a359 33.4%, #027f50 82.8%)

  &.gr-gray
    background: linear-gradient(137.04deg, rgb(100, 100, 127) 33.4%, rgb(50, 50, 80) 82.8%)
    margin-bottom: 20px

  .name
    font-weight: 600
    font-size: 16px

  .kind
    font-weight: 200
    font-size: 14px
</style>
