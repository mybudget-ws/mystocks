<template>
  <div>
    <Menu />
    <div class='container container-wide'>
      <PageHeader name='Компании' />

      <div class='row'>
        <div class='col s12'>
          <Loader v-if='isLoading' class='loading' />
          <table v-else>
            <thead>
              <tr>
                <th class='logoUrl' />
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for='item in items' :key='item.id' @click='gotoCompany(item.id)'>
                <td class='logoUrl'>
                  <img :src='item.logoUrl'>
                </td>
                <td>{{ item.name }}</td>
                <td class='price'>
                  <span v-if='item.lastPrice'>$ {{ item.lastPrice }}</span>
                </td>
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
import { get, call } from 'vuex-pathify';

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
    isPhone: md.phone() != null
  }),
  computed: {
    isSignedIn: get('user/isSignedIn'),
    isGuest: get('user/isGuest'),
    email: get('user/email'),
    ...get('companies/*')
  },
  async created() {
    await this.fetch();
  },
  methods: {
    ...call([
      'companies/fetch'
    ]),
    gotoCompany(id) {
      this.$router.push(`/companies/${id}`);
    }
  }
};
</script>

<style scoped lang='sass'>
th.logoUrl
  width: 40px

td
  &.logoUrl
    text-align: center

    img
      border-radius: 4px
      margin-bottom: -4px
      height: 24px
      width: 24px

  &.price
    text-align: right

tbody
  tr
    &:hover
      background-color: #fafafa
      cursor: pointer
</style>
