import * as dates from './dates';
import * as trips from './trips';
import * as users from './users';

const isStringEmpty = (string) => {
  if (string) return string.trim().length > 0;
  else return true;
};

const isObjectEmpty = (object) => {
  return object.constructor === Object && Object.entries(object).length === 0;
};

export default { dates, trips, users, isStringEmpty, isObjectEmpty };
