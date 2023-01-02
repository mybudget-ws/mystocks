<template>
  <div class='row row-menu'>
    <nav v-if='isShortMenu' class='menu z-depth-0'>
      <div class='nav-wrapper container'>
        <router-link
          to='/'
          class='brand-logo grey-text text-lighten-2 left col'
        >
          myStocks v0.2a
        </router-link>
        <div class='right'>
          <a href='//2.mybudget.ws/' :class='btnClasses' class='sign-in'>
            Назад в Мой Бюджет
          </a>
        </div>
      </div>
    </nav>
    <nav v-else class='deep-purple darken-4 z-depth-0'>
      <div class='nav-wrapper container container-wide'>
        <a href="#" data-target='mobile-demo' class='sidenav-trigger'>
          <i class='material-icons'>menu</i>
        </a>
        <ul class='hide-on-med-and-down'>
          <li v-for='item in items' :key='item.path'>
            <router-link :to='item.path' :class='btnClasses'>
              {{ item.name }}
            </router-link>
          </li>
          <li class='right' title='Назад в Мой Бюджет'>
            <a href='//2.mybudget.ws/#/transactions' :class='btnClasses' class='btn-flat waves-effect waves-purple mybudget-link'>
              Назад в Мой Бюджет
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <ul
      v-if='!isShortMenu'
      id='mobile-demo'
      ref='sidenav'
      class='sidenav'
    >
      <li v-for='item in items' :key='item.path'>
        <a :href='mobileLinkPath(item)' @click='goto(item.path)'>
          {{ item.name }}
        </a>
      </li>
      <li class='divider' />
      <li>
        <a @click='exit'>Выход</a>
      </li>
    </ul>
  </div>
</template>

<script>
import { get, call } from 'vuex-pathify';

export default {
  name: 'Menu',
  data: () => ({
    items: [
      { path: '/#/', name: 'Главная' },
      { path: '/news', name: 'Новости' },
      { path: '/signals', name: 'Сигналы' }
    ]
  }),
  computed: {
    isSignedIn: get('user/isSignedIn'),
    isGuest: get('user/isGuest'),
    isShortMenu() { return this.$router.currentRoute.name === 'home'; },
    btnClasses() {
      return this.isShortMenu ?
        'waves-effect waves-light btn-flat grey-text text-lighten-5 z-depth-0' :
        'blue-grey-text text-lighten-5';
    }
  },
  mounted() {
    /* eslint-disable */
    M.Sidenav.init(this.$refs.sidenav, {});
    /* eslint-enable */
  },
  methods: {
    logout: call('user/logout'),
    exit() {
      if (this.isGuest) {
        const message = 'Вы не завершили регистрацию. ' +
          'Все данные данные будут удалены. Удалить данные и выйти?';
        if (!confirm(message)) { return; }
      }
      this.logout();
      // NOTE: Use location to reload the page and hide overlay
      // this.$refs.sidenav.click();
      // this.$router.replace({ name: 'home' });
      window.location.href = '/';
    },
    goto(path) {
      /* eslint-disable */
      // To hide .sidenav-overlay
      const instance = M.Sidenav.getInstance(this.$refs.sidenav);
      instance.close();
      /* eslint-disable */
      // https://github.com/vuejs/vue-router/issues/2872
      this.$router.push({ path }).catch(_e => {});
    },
    mobileLinkPath({ path }) {
      return `#${path}`;
    }
  }
};
</script>

<style scoped lang='sass'>
.brand-logo
  font-size: 14px
  margin-top: 4px

.row-menu
  margin-bottom: 0

  .menu
    background: inherit

.sign-in
  border: 1px solid white
  border-radius: 6px
  line-height: 34px
  margin-right: 10px

nav
 i.material-icons
  font-size: 20px

.mybudget-link
  font-size: 12px !important
  border-radius: 4px
  border: 1px solid #d1c4e9
</style>
