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
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th />
            <th>Name</th>
            <th>State</th>
            <th class='right-align'>s-Price</th>
            <th class='right-align'>f-Price</th>
            <th class='right-align'>Profit</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for='item in items'
            :key='item.id'
            :item='item'
          >
            <td style='width: 1rem;'>
              <small>{{ item.id }}</small>
            </td>
            <td :class='directionTextClass(item)' style='width: 1rem;'>
              {{ item.direction == 'buy' ? '⬇ ' : '⬇ ' }}
            </td>
            <td>{{ item.signal.symbol.name }}</td>
            <td>{{ item.state }}</td>
            <td class='right-align'>{{ item.startPrice || '-' }}</td>
            <td class='right-align'>{{ item.finishPrice || '-' }}</td>
            <td class='right-align'>{{ item.profit || '-' }}</td>
          </tr>
        </tbody>
      </table>
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
  methods: {
    directionTextClass({ direction }) {
      return direction == 'buy' ? 'green-text' : 'red-text';
    }
  }
};
</script>

<style scoped lang='sass'>
.today
  margin-bottom: 40px
</style>
