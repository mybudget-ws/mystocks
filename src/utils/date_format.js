const moment = require('moment');
moment.locale('ru');
const SERVER_UTC_OFFSET = 3;

export default {
  full(dateAt) {
    const date = moment(dateAt).utcOffset(SERVER_UTC_OFFSET, true);
    return date.format('DD.MM.YYYY HH:mm');
  },

  short(dateAt) {
    const date = moment(dateAt).utcOffset(SERVER_UTC_OFFSET, true);
    const current = moment().utcOffset(SERVER_UTC_OFFSET, true);
    if (date.isSame(current, 'day')) {
      return 'Сегодня';
    }
    if (current.subtract(1, 'days').isSame(date, 'day')) {
      return 'Вчера';
    }
    if (current.isSame(date, 'year')) {
      return date.format('DD MMMM');
    }
    return date.format('DD.MM.YYYY');
  },

  shortTime(dateAt) {
    const date = moment(dateAt).utcOffset(SERVER_UTC_OFFSET, true);
    const current = moment().utcOffset(SERVER_UTC_OFFSET, true);
    if (date.isSame(current, 'day')) {
      return `Сегодня ${date.format('HH:mm')}`;
    }
    if (current.subtract(1, 'days').isSame(date, 'day')) {
      return `Вчера ${date.format('HH:mm')}`;
    }
    if (current.isSame(date, 'year')) {
      return date.format('DD MMMM HH:mm');
    }
    return date.format('DD.MM.YYYY HH:mm');
  },

  isActual(dateAt) {
    const date = moment(dateAt).utcOffset(SERVER_UTC_OFFSET, true);
    const current = moment().utcOffset(SERVER_UTC_OFFSET, true);
    const yesterday = current.subtract(1, 'days');
    const max = moment.max(date, yesterday);
    return max == date;
  }
};
