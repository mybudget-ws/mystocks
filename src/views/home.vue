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
      <h3 class='grey-text text-darken-1'>В разработке... пока тут нет ничего интересного :)</h3>
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
    isPhone: md.phone() != null
  }),
  computed: {
    isSignedIn: get('user/isSignedIn'),
    isGuest: get('user/isGuest'),
    email: get('user/email'),
    token: get('user/token'),
  },
  methods: {
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
  min-height: 200px
  background-color: #fff
  padding: 20px
  border-radius: 20px
  margin-bottom: 700px
</style>
