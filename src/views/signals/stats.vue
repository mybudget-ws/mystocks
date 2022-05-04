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

        <div class='col s12'>
          <table>
            <thead>
              <tr>
                <th />
                <th>Cигнал</th>
                <th class='right-align'>Рейтинг</th>
                <th class='right-align'>Ved, %</th>
                <th class='right-align'>Vtp, %</th>
                <th class='right-align'>Vtpsl, %</th>
              </tr>
            </thead>
            <tbody>
              <tr class='blue-grey lighten-4'>
                <td>
                  <strong>Итого</strong>
                </td>
                <td>{{ signals.length }} шт.</td>
                <td class='right-align'>{{ avgRating.toFixed(2) }}</td>
                <td class='right-align'>{{ sumByDayResultPercent.toFixed(2) }}</td>
                <td class='right-align'>{{ sumByTpResultPercent.toFixed(2) }}</td>
                <td class='right-align'>{{ sumByTpSlResultPercent.toFixed(2) }}</td>
              </tr>
              <tr v-for='item in signals' :key='item.id'>
                <td class='grey-text'>{{ item.date }}</td>
                <td>{{ item.name }}</td>
                <td class='right-align'>{{ item.rating }}</td>
                <td class='right-align'>{{ item.dealByDayResultPercent.toFixed(2) }}</td>
                <td class='right-align'>{{ item.dealByTpResultPercent.toFixed(2) }}</td>
                <td class='right-align'>{{ item.dealByTpSlResultPercent.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
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
      'signalsStats/series',
      'signalsStats/signals'
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
    },
    avgRating() {
      if (this.isLoading) { return 0; }
      if (this.signals.length === 0) { return 0; }

      const sum = this.signals
        .map(v => v.rating)
        .reduce((total, v) => total + v);
      return sum / this.signals.length;
    },
    sumByDayResultPercent() {
      if (this.isLoading) { return 0; }
      if (this.signals.length === 0) { return 0; }

      return this.signals
        .map(v => v.dealByDayResultPercent)
        .reduce((total, v) => total + v);
    },
    sumByTpResultPercent() {
      if (this.isLoading) { return 0; }
      if (this.signals.length === 0) { return 0; }

      return this.signals
        .map(v => v.dealByTpResultPercent)
        .reduce((total, v) => total + v);
    },
    sumByTpSlResultPercent() {
      if (this.isLoading) { return 0; }
      if (this.signals.length === 0) { return 0; }

      return this.signals
        .map(v => v.dealByTpSlResultPercent)
        .reduce((total, v) => total + v);
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
