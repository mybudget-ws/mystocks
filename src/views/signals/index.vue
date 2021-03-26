<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Сигналы' />

      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' class='loading' />
          <Collection v-else :items='items' />
        </div>
      </div>

      <div class='row'>
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
import Collection from '@/components/signals/collection';
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
    ...get('signals/*')
  },
  async created() {
    await this.fetch({ token: this.token });
  },
  methods: {
    ...call([
      'signals/fetch',
      'signals/fetchNext'
    ]),
    more() {
      this.fetchNext({ token: this.token });
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
