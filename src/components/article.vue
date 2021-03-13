<template>
  <div class='card'>
    <div class='card-content'>
      <div class='badges'>
        <span
          v-for='symbol in item.symbols'
          :key='symbol.id'
          :data-badge-caption='badgeName(symbol)'
          class='new badge tag lighten-4'
          @click='gotoStock(symbol)'
        />
      </div>
      <span class='card-title'>{{ item.title }}</span>
      <p>{{ item.summary }}</p>
      <br>
      <p class='grey-text'>{{ dateFormat(item) }}</p>
      <p><a :href='item.url' target='_blank'>Источник: {{ item.source }}</a></p>
    </div>
  </div>
</template>

<script>
const moment = require('moment');
moment.locale('ru');
const SERVER_UTC_OFFSET = 3;

export default {
  name: 'Article',
  components: {},
  props: {
    item: { type: Object, required: true }
  },
  computed: {
  },
  methods: {
    dateFormat(news) {
      const date = moment(news.dateAt).utcOffset(SERVER_UTC_OFFSET, true);
      const current = moment().utcOffset(SERVER_UTC_OFFSET, true);
      if (moment(date).isSame(current, 'day')) {
        return `Сегодня ${date.format('HH:mm')}`;
      }
      if (current.subtract(1, 'days').isSame(date, 'day')) {
        return `Вчера ${date.format('HH:mm')}`;
      }
      return date.format('DD.MM.YYYY HH:mm');
    },
    badgeName(symbol) {
      const { company } = symbol;
      return company == null ? symbol.name : company.name;
    },
    gotoStock(symbol) {
      this.$router.push(`/stocks/${symbol.id}`);
    }
  }
};
</script>

<style scoped lang='sass'>
.badges
  .badge
    margin-left: 0
    margin-right: 10px
    // color: #212121 !important
    cursor: pointer

    &:hover
      opacity: 0.8
    &:active
      opacity: 1.0
</style>
