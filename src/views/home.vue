<template>
  <div class='main-background'>
    <Menu />
    <div class='container main'>
      <div class='row'>
        <div class='col'>
          <h1 class='white-text'>Моя Биржа</h1>
          <h2 class='grey-text text-lighten-3'>Посторонним в!</h2>
        </div>
      </div>
    </div>

    <section class='container'>
      <div
        v-for='item in instruments'
        :key='item.name'
        class='instrument'
        @click='gotoInstrument(item.name)'
      >
        <div class='name'>{{ item.name }}</div>
        <div class='kind'>{{ item.kind }}</div>
      </div>
    </section>

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
      {
        name: 'SiH3',
        kind: 'Фьючерс'
      }
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
  margin: 10px 0
  font-size: 2.2rem

section
  background-color: #fff
  border-radius: 20px
  display: flex
  justify-content: start
  margin-bottom: 700px
  min-height: 200px
  padding: 10px

.instrument
  background-repeat: no-repeat
  background: linear-gradient(137.04deg, rgb(52, 111, 225) 33.4%, rgb(88, 68, 195) 82.8%)
  border-radius: 12px
  color: #fff
  cursor: pointer
  flex-grow: 1
  height: 90px
  margin: 10px
  padding: 20px

  &:hover
    opacity: 0.8

  &:active
    opacity: 0.9

  .name
    font-weight: 600
    font-size: 16px

  .kind
    font-weight: 200
    font-size: 14px
</style>
