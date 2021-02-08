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

        <div class='col s12'>
          <h5>Description</h5>
          <p>{{ description }}</p>
          <p>
            CEO - {{ ceo }}
            <a :href='website' target='_blank' class='website'>{{ website }}</a>
          </p>
        </div>
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
    website: undefined,
    ceo: undefined,
    description: undefined,
    lastPrice: 0,

    chart: undefined,
    timer: undefined,
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
    // TODO: Update lastPrice by timer from chart data.
    this.lastPrice = symbol.lastPrice;
    this.logoUrl = symbol?.company?.logoUrl || symbol.logoUrl;
    this.description = symbol?.company?.description;
    this.website = symbol?.company?.website;
    this.ceo = symbol?.company?.ceo;
    this.isLoading = false;

    // Old chart
    // await this.loadChart();
    // this.timer = setInterval(this.loadChart, 10000);

    const data = await api.pricesChartOHLC(this);
    this.loadNewChart(data);
  },
  // beforeDestroy() { clearInterval(this.timer); },
  methods: {
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
    },
    loadNewChart(data) {
      const chart = am4core.create('chart-new', am4charts.XYChart);
      chart.paddingRight = 20;

      chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd hh:mm';

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;

      const series = chart.series.push(new am4charts.CandlestickSeries());
      series.dataFields.dateX = 'date';
      series.dataFields.valueY = 'close';
      series.dataFields.openValueY = 'open';
      series.dataFields.lowValueY = 'low';
      series.dataFields.highValueY = 'high';
      series.dataFields.diff = 'diff';
      series.simplifiedProcessing = true;
      series.tooltipText = '%: {diff}\n' +
        'Open: ${openValueY.value}\nLow: ${lowValueY.value}\n' +
        'High: ${highValueY.value}\nClose: ${valueY.value}';

      chart.cursor = new am4charts.XYCursor();

      // a separate series for scrollbar
      const lineSeries = chart.series.push(new am4charts.LineSeries());
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
      chart.scrollbarX = scrollbarX;

      chart.data = data;
    }
  }
};
</script>

<style scoped lang='sass'>
.chart
  height: 400px
  margin-left: -12px

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
  margin-right: -30px
</style>
