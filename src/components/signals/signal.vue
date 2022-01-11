<template>
  <div :class='cardClasses(item)' class='signal'>
    <div class='card-content'>
      <div :class="{ 'green-text text-darken-2': isActual(item) }" class='right right-align'>
        {{ itemDate(item.dateAt) }}
        <div class='created-at'>Создан • {{ itemTimeCreated(item) }}</div>
      </div>
      <div class='card-title'>
        <span class='logoUrl' :style='backgroundImgStyle(item)' />
        {{ item.symbol.name }}
        <span class='hide-on-small-only'>
          <span class='dot-devider' />
          <span class='full-name'>{{ itemName(item) }}</span>
        </span>
      </div>
      <div class='tags'>
        <span
          class='badge new indigo lighten-1 white-text'
          :data-badge-caption="`★ ${item.rating} ┆ ${item.interval.toUpperCase()}`"
        />
        <!--span
          class='badge new indigo lighten-3 white-text'
          :data-badge-caption="`${item.interval.toUpperCase()}`"
        /-->
        <span
          :class='directionClasses(item)'
          :data-badge-caption='directionText(item)'
        />
        <span
          :class='directionClasses(item, true)'
          :data-badge-caption='directionKind(item)'
        />
      </div>
      <div class='details' :class="{ 'with-margin': !isShowAction }">
        <div class='prices'>
          <pre class='price' title='Цена закрытия на момент сигнала'>PR: ${{ item.point.close.toFixed(2) }}</pre>
          <pre class='price green-text text-darken-4'>TP: ${{ item.takeProfit.toFixed(2) }}</pre>
          <pre class='price red-text text-darken-3'>SL: ${{ item.stopLoss.toFixed(2) }}</pre>
        </div>
        <router-link
          v-if='isShowAction'
          :to='pathStock(item)'
          target='_blank'
          class='btn-small btn-flat waves-effect waves-light blue-text text-darken-2'
          title='Открыть в новой вкладке'
        >
          Просмотр
          <i class='material-icons right'>open_in_new</i>
        </router-link>
      </div>
    </div>
    <!--div v-if='isShowAction' class='card-action'>
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
    </div-->
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
    directionText({ direction }) {
      if (direction === 'sell') { return '⬇ SELL'; }
      if (direction === 'buy') { return '⬆ BUY'; }
      return '?';
    },
    directionKind({ kind }) {
      if (kind === 'umbrella_direct') {
        return 'Прямой';
      }
      if (kind === 'umbrella_reverse') {
        return 'Обратный';
      }
      return '?';
    },
    directionClasses({ direction, kind }, isKind = false) {
      if (isKind && kind === 'umbrella_reverse') {
        return 'badge new grey lighten-2 grey-text text-darken-3';
      }
      if (direction === 'buy') {
        return 'badge new green lighten-4 green-text text-darken-4';
      }
      if (direction === 'sell') {
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
.signal
  position: relative

  .card-title
    font-size: 18px
    display: flex
    align-items: center
    font-weight: 400

    .full-name
      font-weight: 200

  .card-content
    padding: 18px

  .card-action
    padding: 8px 18px

  .rating
    background-color: #5c6bc0
    border-bottom-right-radius: 8px
    color: #fff
    font-size: 12px
    font-weight: 700
    left: 0
    padding: 2px 10px
    position: absolute
    top: 0

.logoUrl
  background-color: #eee
  background-position: center
  background-repeat: no-repeat
  background-size: contain
  border-radius: 4px
  display: inline-block
  height: 20px
  margin-right: 6px
  text-align: center
  width: 20px

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

.tags
  display: inline-block

  span.badge
    float: none
    display: inline-block
    margin: 0 10px 0 0

.details
  display: flex
  justify-content: space-between
  align-items: flex-end

  &.with-margin
    margin-top: 10px

  @media only screen and (max-width: 601px)
    margin-top: 10px

  .price
    font-size: 16px !important
    font-weight: 400 !important
    margin: 0

    @media only screen and (min-width: 601px)
      display: inline-block
      margin-right: 16px

</style>
