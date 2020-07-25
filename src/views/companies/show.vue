<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Компания N' />
      <div class='row'>
        <div class='col s12'>
          <div class='chart' />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import api from '../../api';
import c3 from 'c3';
import { get } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'Companies',
  components: {
    // Loader,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    isPhone: md.phone() != null
  }),
  computed: {
    token: get('user/token')
    // ...get('companies/*')
  },
  async created() {
    // await this.fetch();
    await this.loadChart();
  },
  methods: {
    // ...call([
    //   'companies/fetch'
    // ]),
    change() {
      this.loadChart();
    },
    async loadChart() {
      const columns = await api.pricesChart(this.token, this.$route.params.id);
      this.chart = c3.generate({
        bindto: '.chart',
        data: {
          x: 'x',
          xFormat: '%Y-%m-%d %H:%M',
          columns: columns
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: '%d.%m.%Y %H:%M',
              count: 10
            },
            padding: { left: 0, right: 0 }
          },
          y: {
            padding: { top: 20 }
          }
        },
        point: { show: false },
        grid: {
          x: { show: false },
          y: { show: true }
        }
      });
    }
  }
};
</script>

<style scoped lang='sass'>
.chart
  height: 400px
  margin-left: -20px
</style>
