<template>
  <div>
    <div v-if='isNothingFound' class='row'>
      <p class='col s12 blue-grey-text'>
        По выбранным фильтрам ничего не найдено.
      </p>
    </div>
    <div v-if='items.length == 0 && !isNothingFound'>
      <div class='card blue-grey'>
        <div class='card-content white-text'>
          <span class='card-title'>Скоро</span>
          <p>Данный фукнционал находится в разработке</p>
        </div>
      </div>
    </div>
    <div>
      <div v-if='todayItems.length > 0' class='today'>
        <h5>Сегодня</h5>
        <Signal
          v-for='item in todayItems'
          :key='item.id'
          :item='item'
          :is-show-action='isShowAction'
        />
      </div>
      <div v-if='pastItems.length > 0'>
        <h5>В прошлом</h5>
        <Signal
          v-for='item in pastItems'
          :key='item.id'
          :item='item'
          :is-show-action='isShowAction'
        />
      </div>
    </div>
  </div>
</template>

<script>
import DateFormat from '@/utils/date_format';
import Signal from '@/components/signals/signal_2';

export default {
  name: 'Collection',
  components: {
    Signal
  },
  props: {
    items: { type: Array, required: false, default: () => [] },
    isShowAction: { type: Boolean, required: false, default: false }
  },
  computed: {
    todayItems() {
      return this.items.filter(v => DateFormat.isToday(v.dateAt));
    },
    pastItems() {
      return this.items.filter(v => !DateFormat.isToday(v.dateAt));
    },
    isNothingFound() {
      return this.items.length == 0 && (this.$route.query.search || this.$route.query.minRating);
    }
  },
  methods: {}
};
</script>

<style scoped lang='sass'>
.today
  margin-bottom: 40px
</style>
