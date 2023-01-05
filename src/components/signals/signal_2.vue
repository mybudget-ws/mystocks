<template>
  <div
    :class='cardClasses(item)'
    class='signal'
    :title='item.id'
  >
    <div class='header'>
      <div class='title'>
        <b>{{ item.symbol.name }}</b>
        <!--div v-if='item.lastDailyPrice' class='last-price'>
          <span>┆</span>
          <pre>{{ item.lastDailyPrice.toFixed(2) }}</pre>
        </div-->
      </div>
      <div class='date'>
        {{ itemDate(item.dateAt) }} ┆
        <span class='createdAt'>
          {{ itemTimeCreated(item) }}
        </span>
      </div>
    </div>
    <div class='tags'>
      <span
        class='badge new indigo lighten-1 white-text'
        :data-badge-caption="`★ ${item.rating} ┆ ${item.interval.toUpperCase()}`"
      />
      <span
        :class='directionClasses(item, true)'
        :data-badge-caption='directionKind(item)'
      />
      <span v-if='item.isTakeProfit' class='badge new green' data-badge-caption='✔' />
      <span v-else :class='directionClasses(item, true)' data-badge-caption='✔' />
      <span v-if='item.isStopLoss' class='badge new red' data-badge-caption='✖' />
      <span v-else :class='directionClasses(item, true)' data-badge-caption='✖' />
      <span
        v-if='item.dealResultPercent != null'
        title='Если закрыть сделку по цене на конец дня'
        class='badge new'
        :class="item.dealResultPercent >= 0 ? 'green' : 'red'"
        :data-badge-caption="`${item.dealResultPercent}%`"
      />
      <span
        v-if='item.lastDailyPrice'
        title='Цена на конец дня'
        :class='directionClasses(item, true)'
        :data-badge-caption='item.lastDailyPrice.toFixed(2)'
      />
    </div>
    <div class='prices'>
      <pre>{{ item.point.close.toFixed(2) }}</pre>
      <pre>TP {{ item.takeProfit.toFixed(2) }}</pre>
      <pre>SL {{ item.stopLoss.toFixed(2) }}</pre>
      <div>
        <router-link
          v-if='isShowAction'
          :to='pathInstrument(item)'
          target='_blank'
          title='Открыть в новой вкладке'
          class='right white-text'
        >
          [{{ item.id }}]
        </router-link>
      </div>
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
    pathInstrument({ symbol }) {
      return `/instruments/${symbol.name}`;
    },
    directionText({ direction }) {
      if (direction === 'sell') { return '⬇ SELL'; }
      if (direction === 'buy') { return '⬆ BUY'; }
      return '?';
    },
    directionKind({ kind }) {
      if (kind === 'umbrella_direct') {
        return 'DIR';
      }
      if (kind === 'umbrella_reverse') {
        return 'REV';
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
      return direction;
    }
  }
};
</script>

<style scoped lang='sass'>
.signal
  padding: 10px
  margin-bottom: 10px
  border-radius: 10px

  &.buy
    background: linear-gradient(137.04deg, #6fcd95 33.4%, #008544 82.8%)

  &.sell
    background: linear-gradient(137.04deg, #d97c7c 33.4%, #ff4a4a 82.8%)

.header
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 8px

  .title
    display: flex

    .last-price
      color: #424242

  .date
    text-align: right
    color: #424242
    font-size: 12px

    .createdAt
      color: #f5f5f5
      font-weight: 400

.tags
  display: flex
  justify-content: flex-start
  align-items: center
  margin-bottom: 8px

  span.badge
    float: none
    display: inline-block
    margin: 0 4px 0 0

pre
  margin: 0
  display: inline-block

.header,
.prices
  display: flex
  justify-content: space-between
  align-items: center

  a
    font-size: 13px

.row
  &.last
    margin-bottom: 0
</style>
