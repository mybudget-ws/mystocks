<template>
  <div>
    <div v-if='items.length == 0'>
      <div class='card blue-grey'>
        <div class='card-content white-text'>
          <span class='card-title'>Скоро</span>
          <p>Данный фукнционал находится в разработке</p>
        </div>
      </div>
    </div>
    <div
      v-for='item in items'
      :key='item.id'
      :class='cardClasses(item)'
    >
      <div class='card-content'>
        <div :class="{ 'green-text text-darken-2': isActual(item) }" class='right right-align'>
          {{ itemDate(item.dateAt) }}
          <div class='created-at'>Создан • {{ itemDate(item.createdAt) }}</div>
        </div>
        <div>
          <span class='logoUrl' :style='backgroundImgStyle(item)' />
          <span>{{ itemName(item) }}</span>
          <span class='symbol'>{{ item.symbol.name }}</span>
        </div>
        <div class='details'>
          <span
            :class='directionClasses(item)'
            class='direction'
          >
            {{ iconText(item) }} {{ item.direction }}
          </span>
          <span class='dot-devider' />
          <span class='interval'>{{ item.interval }}</span>
          <span class='dot-devider' />
          <span>Price</span>
          <span class='dot-devider' />
          <span class='indigo-text text-darken-4'>TP: TODO</span>
          <span class='dot-devider' />
          <span class='purple-text text-darken-3'>SL: TODO</span>
        </div>
      </div>
      <div v-if='isShowAction' class='card-action'>
        <router-link :to='pathStock(item)' class='blue-text text-darken-2'>Просмотр</router-link>
        <router-link
          :to='pathStock(item)'
          target='_blank'
          class='right blue-text'
          style='margin-right: 0'
          title='Открыть в новой вкладке'
        >
          <i class='tiny material-icons'>open_in_new</i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import DateFormat from '@/utils/date_format';

export default {
  name: 'Collection',
  components: {},
  props: {
    items: { type: Array, required: false, default: () => [] },
    isShowAction: { type: Boolean, required: false, default: false }
  },
  computed: {},
  methods: {
    logoUrl(symbol) {
      return symbol?.company?.logoUrl || symbol.logoUrl;
    },
    itemName({ symbol }) {
      if (symbol.kind == 'stock') { return symbol.company.name; }
      return symbol.name;
    },
    itemDate(dateAt) {
      return DateFormat.shortTime(dateAt);
    },
    isActual({ dateAt }) {
      return DateFormat.isActual(dateAt);
    },
    backgroundImgStyle({ symbol }) {
      return `background-image: url(${this.logoUrl(symbol)})`;
    },
    gotoStock({ symbol }) {
      this.$router.push(`/stocks/${symbol.name}`);
    },
    pathStock({ symbol }) {
      return `/stocks/${symbol.name}`;
    },
    iconText({ kind, direction }) {
      if (kind == 'umbrella_direct') {
        return direction == 'sell' ? '⊥' : '⊤';
      }
      if (kind == 'umbrella_reverse') {
        return direction == 'sell' ? '⊤' : '⊥';
      }
      return '?';
    },
    directionClasses({ direction }) {
      if (direction == 'buy') {
        return 'green-text text-darken-4';
      }
      if (direction == 'sell') {
        return 'red-text text-darken-3';
      }

      return 'grey-text text-darken-1';
    },
    cardClasses({ direction }) {
      if (direction === 'buy') {
        return 'card green lighten-5 z-depth-1';
      }
      if (direction === 'sell') {
        return 'card red lighten-5 z-depth-1';
      }

      return 'card z-depth-1';
    }
  }
};
</script>

<style scoped lang='sass'>
.logoUrl
  background-position: center
  background-repeat: no-repeat
  background-size: contain
  border-radius: 4px
  display: inline-block
  height: 24px
  margin-bottom: -7px
  margin-right: 6px
  text-align: center
  width: 24px

td
  &.price
    text-align: right

tbody
  tr
    &:hover
      background-color: #fafafa
      cursor: pointer

.symbol
  color: #546e7a
  font-weight: 200
  margin-left: 10px

  @media only screen and (max-width: 601px)
    margin-left: 0
    display: block

.direction
  font-weight: 600

.interval
  border-radius: 4px
  box-sizing: border-box
  color: #90a4ae
  display: inline-block

.dot-devider
  display: inline-block
  padding: 0 10px
  &:before
    color: #90a4ae
    content: '•'

.created-at
  font-size: 10px
  font-weight: 200
  opacity: 0.7

.details
  margin-top: 14px
</style>
