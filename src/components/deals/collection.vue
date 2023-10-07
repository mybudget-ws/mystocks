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
          <p>Тут ничего нет :/</p>
        </div>
      </div>
    </div>
    <div>
      <div
        v-for='item in items'
        :key='item.id'
        :item='item'
      >
        {{ item.id }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Collection',
  components: {},
  props: {
    items: { type: Array, required: false, default: () => [] }
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
