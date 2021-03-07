import api from '@/api';
import c3 from 'c3';
import { get } from 'vuex-pathify';

import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(am4themes_animated);

export default {
  data: () => ({
    symbol: undefined,
    interval: 'h1',
    intervals: [
      { name: 'Минута', interval: 'min1' },
      { name: '30 минут', interval: 'min30' },
      { name: 'Час', interval: 'h1' },
      { name: 'День', interval: 'd1' },
      { name: 'Неделя', interval: 'w1' },
      { name: 'Месяц', interval: 'm1' }
    ],
    chart: undefined,
    lastDiff: 0,
    isLoading: true,
    isPhone: md.phone() != null
    // timer: undefined,
  }),

  async created() {
    this.symbol = await api.symbol(this.token, { id: this.id });

    // Old chart
    // await this.loadChart();
    // this.timer = setInterval(this.loadChart, 10000);

    const data = await api.pricesChartOHLC(this);
    const lastPoint = data[data.length - 1];
    if (lastPoint) {
      this.lastDiff = lastPoint['diff'];
    }
    this.isLoading = false;

    this.$nextTick(() => this.loadNewChart(data));
  },

  computed: {
    token: get('user/token'),

    id() { return this.$route.params.id; },

    lastPriceAmount() {
      if (this.lastDiff > 0) { return this.lastPrice; }
      return this.lastPrice * (-1);
    },

    name() {
      if (this.symbol == null) { return 'n/a'; }

      const { name, company } = this.symbol;
      if (company == null) { return name; }

      return company.name;
    },

    logoUrl() {
      if (this.symbol == null) { return null; }

      const { logoUrl, company } = this.symbol;
      if (company == null) { return logoUrl; }

      return company.logoUrl;
    },

    lastPrice() {
      if (this.symbol == null) { return 0; }

      // todo: Update lastPrice by timer from chart data.
      return this.symbol.lastPrice;
    },

    company() {
      if (this.symbol == null) { return null; }
      return this.symbol.company;
    }
  },

  // beforeDestroy() { clearInterval(this.timer); },

  methods: {
    async onChangeInterval(interval = null) {
      if (interval === this.interval) { return; }
      if (interval) { this.interval = interval; }
      this.isLoading = true;
      const data = await api.pricesChartOHLC(this);
      this.isLoading = false;
      this.$nextTick(() => this.loadNewChart(data));
    },

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

    // Old chart
    changeOld() {
      this.loadChartOld();
    },
    async loadChartOld() {
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
