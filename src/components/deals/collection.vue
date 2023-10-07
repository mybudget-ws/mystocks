<template>
  <div>
    <div v-if='isNothingFound' class='row'>
      <p class='col s12 blue-grey-text'>
        По выбранным фильтрам ничего не найдено.
      </p>
    </div>
    <div v-if='items.length == 0'>
      <div class='card blue-grey'>
        <div class='card-content white-text'>
          <span class='card-title'>Пусто</span>
          <p>Тут ничего нет</p>
        </div>
      </div>
    </div>
    <div>
      <Signal
        v-for='item in items'
        :key='item.id'
        :item='item'
        :is-show-action='isShowAction'
      />
    </div>
  </div>
</template>

<script>
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
