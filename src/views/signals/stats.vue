<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Статистика сигналов' />
      <Loader v-if='isLoading' class='loading' />
      <div v-else class='row'>
        <div class='col s12'>
          <VueApexCharts
            type='line'
            height='600'
            :options='chartOptions'
            :series='series'
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import VueApexCharts from 'vue-apexcharts';
import { call, get } from 'vuex-pathify';

export default {
  name: 'SignalsStats',
  components: {
    Loader,
    Menu,
    PageHeader,
    VueApexCharts
  },
  props: {},
  data: () => ({}),
  computed: {
    token: get('user/token'),
    ...get([
      'signalsStats/isLoading',
      'signalsStats/categories',
      'signalsStats/series'
    ]),
    chartOptions() {
      return {
        chart: {
          zoom: { enabled: false }
        },
        xaxis: {
          categories: this.categories
        },
        stroke: {
          width: [4, 4, 4],
          curve: 'straight'
        },
        dataLabels: { enabled: false }
      };
    }
  },
  async mounted() {
    await this.fetch({
      token: this.token
    });
  },
  methods: {
    ...call([
      'signalsStats/fetch'
    ])
  }
};
</script>

<style scoped lang='sass'>
</style>
