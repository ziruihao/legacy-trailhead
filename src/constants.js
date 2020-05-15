export const BACKEND_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:9090/api' : 'https://doc-planner.herokuapp.com/api';
export const ROOT_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:9090/api' : 'https://doc-planner.herokuapp.com/api';

export const hi = 'hi';

export const formatDate = (date) => {
  const rawDate = new Date(date);
  const dateString = rawDate.toUTCString();
  return dateString.substring(0, 11);
};

export const formatTime = (time) => {
  const splitTime = time.split(':');
  splitTime.push(' AM');
  const originalHour = splitTime[0];
  splitTime[0] = originalHour % 12;
  if (originalHour >= 12) {
    splitTime[2] = ' PM';
  }
  if (splitTime[0] === 0) {
    splitTime[0] = 12;
  }
  return `${splitTime[0]}:${splitTime[1]}${splitTime[2]}`;
};
