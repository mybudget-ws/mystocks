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
          <div class='chart' />
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
    website: '',
    ceo: '',
    description: '',
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
    const company = await api.company(this.token, { id: this.id });
    this.name = company.name;
    this.lastPrice = company.lastPrice;
    this.logoUrl = company.logoUrl;
    this.description = company.description;
    this.website = company.website;
    this.ceo = company.ceo;
    this.isLoading = false;
    await this.loadChart();
    this.timer = setInterval(this.loadChart, 10000);
  },
  beforeDestroy() { clearInterval(this.timer); },
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
</style>
