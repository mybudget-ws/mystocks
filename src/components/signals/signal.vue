<template>
  <div :class='cardClasses(item)'>
    <div class='card-content'>
      <div class='card-title'>
        <span class='logoUrl hide-on-small-only' :style='backgroundImgStyle(item)' />
        {{ item.symbol.name }}
        <!--span class='dot-devider' />
        <span class='price' title='Цена закрытия на момент сигнала'>${{ item.point.close.toFixed(2) }}</span-->
        <span
          :class='directionClasses(item)'
          :data-badge-caption='directionKind(item)'
        />
        <span
          :class='directionClasses(item)'
          :data-badge-caption='directionText(item)'
        />
      </div>
      <div :class="{ 'green-text text-darken-2': isActual(item) }" class='right right-align'>
        {{ itemDate(item.dateAt) }}
        <div class='created-at'>Создан • {{ itemTimeCreated(item) }}</div>
      </div>
      <div class='details'>
        <!--span>{{ itemName(item) }}</span-->
        <div class='price' title='Цена закрытия на момент сигнала'>PR: ${{ item.point.close.toFixed(2) }}</div>
        <div class='price indigo-text text-darken-4'>TP: ${{ item.takeProfit }}</div>
        <div class='price purple-text text-darken-3'>SL: ${{ item.stopLoss }}</div>
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
</template>

<script>
import DateFormat from '@/utils/date_format';

export default {
  name: 'Signal',
  components: {},
  props: {
    item: { type: Object, required: true },
    isShowAction: { type: Boolean, required: false, default: false }
  },
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
    itemTimeCreated({ createdAt }) {
      return DateFormat.timeOnly(createdAt);
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
    directionText({ direction }) {
      if (direction === 'sell') { return 'SELL'; }
      if (direction === 'buy') { return 'BUY'; }
      return '?';
    },
    directionKind({ kind }) {
      if (kind == 'umbrella_direct') {
        return 'Прямой';
      }
      if (kind == 'umbrella_reverse') {
        return 'Обратный';
      }
      return '?';
    },
    directionClasses({ direction }) {
      if (direction == 'buy') {
        return 'badge new green lighten-4 green-text text-darken-4';
      }
      if (direction == 'sell') {
        return 'badge new red lighten-4 red-text text-darken-3';
      }

      return 'badge new grey lighten-2 grey-text text-darken-3';
    },
    cardClasses({ direction }) {
      // Использовать цвета в будущем для сработавших и не сработавших сигналов.
      if (direction === 'buy') {
        // return 'card green lighten-5 z-depth-1';
        return 'card z-depth-1';
      }
      if (direction === 'sell') {
        // return 'card red lighten-5 z-depth-1';
        return 'card z-depth-1';
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
  margin-bottom: -3px
  margin-right: 6px
  text-align: center
  width: 24px

.symbol
  color: #546e7a
  font-weight: 400
  margin-left: 10px

  @media only screen and (max-width: 601px)
    margin-left: 0
    display: block

.direction
  font-weight: 700
  text-transform: uppercase

.kind
  font-weight: 400
  text-transform: none

.interval
  border-radius: 4px
  box-sizing: border-box
  color: #546e7a
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
  color: #455a64

.details
  margin-top: 14px

.price
  font-size: 16px !important
  font-weight: 400 !important
</style>
