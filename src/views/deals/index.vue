<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Сделки' />

      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' class='loading' />
          <Collection v-else :items='items' is-show-action />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Collection from '@/components/deals/collection';
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import { get, call } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'Signals',
  components: {
    Collection,
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
    ...get([
      'signals/items',
      'signals/isLoading'
    ])
  },
  async mounted() {
    await this.fetch({
      token: this.token,
      options: {
        search: '',
        minRating: 10,
        direction: '',
        interval: 'h1'
      }
    });
  },
  methods: {
    ...call([
      'signals/fetch'
    ])
  }
};
</script>

<style scoped lang='sass'>
</style>
