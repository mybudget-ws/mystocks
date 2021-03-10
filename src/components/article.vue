<template>
  <div class='card'>
    <div class='card-content'>
      <div class='badges'>
        <span
          v-for='symbol in item.symbols'
          :key='symbol.id'
          class='new badge tag indigo lighten-4'
          :data-badge-caption='symbol.name'
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

export default {
  name: 'Article',
  components: {},
  props: {
    item: { type: Object, required: true }
  },
  computed: {},
  methods: {
    dateFormat(news) {
      const date = moment(news.dateAt);
      const current = moment();
      if (moment(date).isSame(current, 'day')) {
        return `Сегодня ${date.format('hh:mm')}`;
      }
      if (current.subtract(1, 'days').isSame(date, 'day')) {
        return `Вчера ${date.format('hh:mm')}`;
      }
      return date.format('DD.MM.YYYY hh:mm');
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
