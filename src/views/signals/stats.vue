<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Статистика сигналов' />
      <div class='row'>
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
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import VueApexCharts from 'vue-apexcharts';


export default {
  name: 'SignalsStats',
  components: {
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
  })
};
</script>

<style scoped lang='sass'>
</style>
