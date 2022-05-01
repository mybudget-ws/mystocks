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
import { get } from 'vuex-pathify';

export default {
  name: 'SignalsStats',
  components: {
    Loader,
    Menu,
    PageHeader,
    VueApexCharts
  },
  props: {},
  data: () => ({
    series: [
      {
        name: 'Desktops',
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
      },
      {
        name: 'Desktops 2',
        data: [12, 40, 30, 59, 40, 60, 39, 81, 128]
      }
    ],
    chartOptions: {
      chart: {
        zoom: {
          enabled: false
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
      },
      stroke: {
        width: [2, 2],
        curve: 'straight'
      },
      dataLabels: {
        enabled: false
      }
    }
  }),
  computed: {
    token: get('user/token'),
    ...get([
      'signals/isLoading'
    ])
  },
  async mounted() {
  },
  methods: {
  }
};
</script>

<style scoped lang='sass'>
</style>
