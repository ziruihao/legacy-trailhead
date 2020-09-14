/* eslint-disable no-case-declarations */
import * as dates from 'date-arithmetic';
import dateFormat from 'dateformat';

export {
  milliseconds,
  seconds,
  minutes,
  hours,
  month,
  startOf,
  endOf,
  add,
  subtract,
  eq,
  gte,
  gt,
  lte,
  lt,
  inRange,
  min,
  max,
} from 'date-arithmetic';

const MILLI = {
  seconds: 1000,
  minutes: 1000 * 60,
  hours: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
};

const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export const formatDateAndTime = (date, mode) => {
  if (mode === 'LONG') {
    return dateFormat(date, 'ddd, m/d/yy @ h:mm TT');
  } else if (mode === 'SHORT') {
    return dateFormat(date, 'm/d/yy, h:mm TT');
  } else {
    return dateFormat(date, 'm/d hh:mm');
  }
};

export const formatDate = (date, mode) => {
  if (mode === 'LONG') {
    return dateFormat(date, 'ddd, m/d/yy');
  } else {
    return dateFormat(date, 'm/d/yy');
  }
};

export const formatTime = (date) => {
  return dateFormat(date, 'h:mm TT');
};

export function withinTimePeriod(date, timePeriod, specificDay) {
  const today = dates.startOf(new Date(), 'day');
  if (typeof date === 'string') date = new Date(date);
  switch (timePeriod) {
    case 'Specific day':
      if (specificDay == null) return true;
      else {
        const dayStart = dates.startOf(specificDay, 'day');
        const dayEnd = dates.endOf(specificDay, 'day');
        if (date >= dayStart && date < dayEnd) return true;
        else return false;
      }
    case 'Tomorrow':
      const tomorrow = dates.add(today, 1, 'day');
      const tomorrowEnd = dates.endOf(tomorrow, 'day');
      if (date >= today && date < tomorrowEnd) return true;
      else return false;
    case 'Next 3 days':
      const next3Days = dates.add(today, 3, 'day');
      const next3DaysEnd = dates.endOf(next3Days, 'day');
      if (date >= today && date < next3DaysEnd) return true;
      else return false;
    case 'This week':
      let weekEnd = dates.endOf(today, 'week');
      weekEnd = dates.add(weekEnd, 1, 'day');
      if (date >= today && date < weekEnd) return true;
      else return false;
    case 'This weekend':
      let weekendEnd = dates.endOf(today, 'week');
      weekendEnd = dates.add(weekendEnd, 1, 'day');
      const weekendStart = dates.subtract(weekendEnd, 3, 'day');
      if (date >= weekendStart && date < weekendEnd) return true;
      else return false;
    case 'In a month':
      const next30Days = dates.add(today, 30, 'day');
      if (date >= today && date < next30Days) return true;
      else return false;
    default:
      return false;
  }
}

export function inThePast(date) {
  if (typeof date === 'string') date = new Date(date);
  const today = dates.startOf(new Date(), 'day');
  if (date >= today) return false;
  else return true;
}

export function monthsInYear(year) {
  const date = new Date(year, 0, 1);

  return MONTHS.map(i => dates.month(date, i));
}

export function firstVisibleDay(date, localizer) {
  const firstOfMonth = dates.startOf(date, 'month');

  return dates.startOf(firstOfMonth, 'week', localizer.startOfWeek());
}

export function lastVisibleDay(date, localizer) {
  const endOfMonth = dates.endOf(date, 'month');

  return dates.endOf(endOfMonth, 'week', localizer.startOfWeek());
}

export function visibleDays(date, localizer) {
  let current = firstVisibleDay(date, localizer);
  const last = lastVisibleDay(date, localizer);
  const days = [];

  while (dates.lte(current, last, 'day')) {
    days.push(current);
    current = dates.add(current, 1, 'day');
  }

  return days;
}

export function ceil(date, unit) {
  const floor = dates.startOf(date, unit);

  return dates.eq(floor, date) ? floor : dates.add(floor, 1, unit);
}

export function range(start, end, unit = 'day') {
  let current = start;
  const days = [];

  while (dates.lte(current, end, unit)) {
    days.push(current);
    current = dates.add(current, 1, unit);
  }

  return days;
}

export function merge(date, time) {
  if (time == null && date == null) return null;

  if (time == null) time = new Date();
  if (date == null) date = new Date();

  date = dates.startOf(date, 'day');
  date = dates.hours(date, dates.hours(time));
  date = dates.minutes(date, dates.minutes(time));
  date = dates.seconds(date, dates.seconds(time));
  return dates.milliseconds(date, dates.milliseconds(time));
}

export function eqTime(dateA, dateB) {
  return (
    dates.hours(dateA) === dates.hours(dateB)
    && dates.minutes(dateA) === dates.minutes(dateB)
    && dates.seconds(dateA) === dates.seconds(dateB)
  );
}

export function isJustDate(date) {
  return (
    dates.hours(date) === 0
    && dates.minutes(date) === 0
    && dates.seconds(date) === 0
    && dates.milliseconds(date) === 0
  );
}

export function duration(start, end, unit, firstOfWeek) {
  if (unit === 'day') unit = 'date';
  return Math.abs(
    dates[unit](start, undefined, firstOfWeek)
    - dates[unit](end, undefined, firstOfWeek),
  );
}

export function diff(dateA, dateB, unit) {
  if (!unit || unit === 'milliseconds') return Math.abs(+dateA - +dateB);

  // the .round() handles an edge case
  // with DST where the total won't be exact
  // since one day in the range may be shorter/longer by an hour
  return Math.round(
    Math.abs(
      +dates.startOf(dateA, unit) / MILLI[unit]
      - +dates.startOf(dateB, unit) / MILLI[unit],
    ),
  );
}

export function total(date, unit) {
  const ms = date.getTime();
  let div = 1;

  switch (unit) {
    case 'week':
      div *= 7;
      break;
    case 'day':
      div *= 24;
      break;
    case 'hours':
      div *= 60;
      break;
    case 'minutes':
      div *= 60;
      break;
    case 'seconds':
      div *= 1000;
      break;
    default:
  }

  return ms / div;
}

export function week(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  return Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7);
}
