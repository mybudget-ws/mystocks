<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader :name='name'>
        <img v-if='!isLoading' class='logo' :src='logoUrl'>
      </PageHeader>

      <Loader v-if='isLoading' />
      <div v-else class='row'>
        <div class='col s12'>
          <div class='chart-new' />
          <!--div class='chart' /-->
        </div>

        <div class='col s12'>
          <div class='row'>
            <div class='col s12 m6 offset-m6 l2 offset-l10'>
              <select
                ref='selectIntervals'
                v-model='interval'
                :class="{ 'browser-default': true }"
                @change='onChangeInterval'
              >
                <option v-for='v in intervals' :key='v.interval' :value='v.interval'>
                  {{ v.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Текущая цена</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                $ {{ lastPrice }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/loader';
import Menu from '@/components/menu';
import PageHeader from '@/components/page_header';
import api from '../../api';
import c3 from 'c3';
import { get } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(am4themes_animated);

export default {
  name: 'Companies',
  components: {
    Loader,
    Menu,
    PageHeader
  },
  props: {},
  data: () => ({
    name: '',
    logoUrl: '',
    lastPrice: 0,

    interval: 'w1',
    intervals: [
      { name: 'Минута', interval: 'minute1' },
      { name: 'Неделя', interval: 'w1' }
    ],
    chart: undefined,
    // timer: undefined,
    isLoading: true,
    isPhone: md.phone() != null
  }),
  computed: {
    token: get('user/token'),
    id() { return this.$route.params.id; }
  },
  async created() {
    const symbol = await api.symbol(this.token, { id: this.id });
    this.name = symbol?.company?.name || symbol.name;
    // todo: Update lastPrice by timer from chart data.
    this.lastPrice = symbol.lastPrice;
    this.logoUrl = symbol?.company?.logoUrl || symbol.logoUrl;

    // Old chart
    // await this.loadChart();
    // this.timer = setInterval(this.loadChart, 10000);

    const data = await api.pricesChartOHLC(this);
    this.isLoading = false;
    this.$nextTick(() => this.loadNewChart(data));
  },

  async mounted() {
    this.$nextTick(() => {
      /* eslint-disable */
      M.FormSelect.init(this.$refs.selectIntervals, {});
      M.updateTextFields();
      /* eslint-enable */
    });
  },

  // beforeDestroy() { clearInterval(this.timer); },

  methods: {
    loadNewChart(data) {
      if (this.chart != null) {
        this.chart.dispose();
      }

      this.chart = am4core.create('chart-new', am4charts.XYChart);
      this.chart.paddingRight = 20;

      this.chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd hh:mm';

      // https://www.amcharts.com/docs/v4/reference/dateaxis/
      const dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.skipEmptyPeriods = true;

      const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;

      const series = this.chart.series.push(new am4charts.CandlestickSeries());
      series.dataFields.dateX = 'date';
      series.dataFields.valueY = 'close';
      series.dataFields.openValueY = 'open';
      series.dataFields.lowValueY = 'low';
      series.dataFields.highValueY = 'high';
      series.dataFields.diff = 'diff';
      series.simplifiedProcessing = true;
      series.tooltipText = '%: {diff}\n' +
        'Open: ${openValueY.value}\nHigh: ${highValueY.value}\n' +
        'Low: ${lowValueY.value}\nClose: ${valueY.value}';

      this.chart.cursor = new am4charts.XYCursor();

      // a separate series for scrollbar
      const lineSeries = this.chart.series.push(new am4charts.LineSeries());
      lineSeries.dataFields.dateX = 'date';
      lineSeries.dataFields.valueY = 'close';
      // need to set on default state, as initially series is "show"
      lineSeries.defaultState.properties.visible = false;

      // hide from legend too (in case there is one)
      lineSeries.hiddenInLegend = true;
      lineSeries.fillOpacity = 0.2;
      lineSeries.strokeOpacity = 0.4;

      const scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(lineSeries);
      this.chart.scrollbarX = scrollbarX;

      this.chart.data = data;
    },

    async onChangeInterval() {
      this.isLoading = true;
      const data = await api.pricesChartOHLC(this);
      this.isLoading = false;
      this.$nextTick(() => this.loadNewChart(data));
    },

    // Old chart
    change() {
      this.loadChart();
    },
    async loadChart() {
      const columns = await api.pricesChart(this.token, this.id);
      const categories = columns[0].slice(1);
      if (this.chart == null) {
        this.chart = c3.generate({
          bindto: '.chart',
          data: {
            x: 'x',
            // xFormat: '%Y-%m-%d %H:%M',
            type: 'spline',
            columns: columns
          },
          axis: {
            x: {
              type: 'category',
              categories: categories,
              tick: {
                multiline: false,
                centered: true,
                culling: { max: 6 }
                // format: '%d.%m.%Y %H:%M',
                // count: 10
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
      } else {
        this.chart.load({ columns, categories });
      }
    }
  }
};
</script>

<style scoped lang='sass'>
// .chart
//   height: 400px
//   margin-left: -12px

.logo
  height: 48px
  width: 48px
  vertical-align: top
  border-radius: 40px
  float: right

.website
  display: block

.chart-new
  height: 600px
  margin-left: -30px

  @media only screen and (min-width: 993px)
    margin-right: -30px
</style>
