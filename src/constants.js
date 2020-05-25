export const BACKEND_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:9090/api' : 'https://doc-logistics-app.herokuapp.com/api';
export const ROOT_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:9090/api' : 'https://doc-logistics-app.herokuapp.com/api';

export const green = '#0CA074';

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

export const calculateTripStatus = (trip) => {
  const statuses = [{ name: 'Group gear requests', state: trip.gearStatus }, { name: 'Trippee gear requests', state: trip.trippeeGearStatus }, { name: 'P-Card request', state: trip.pcardStatus }, { name: 'Vehicle request', state: trip.vehicleStatus }];
  let finalStatus = 'approved';
  const reasons = [];

  statuses.forEach((status) => {
    switch (status.state) {
      case 'pending':
        reasons.push(`${status.name} is still pending`);
        if (finalStatus === 'approved') finalStatus = 'pending';
        break;
      case 'denied':
        reasons.push(`${status.name} was denied`);
        finalStatus = 'warning';
        break;
      default:
        break;
    }
  });

  return { status: finalStatus, reasons };
};

/**
 * Returns the appropriate CSS ID for the club name for trip card decals.
 * @param {String} clubName
 */
export const clubDictionary = (clubName) => {
  switch (clubName) {
    case 'Cabin and Trail':
      return 'cnt';
    case 'Women in the Wilderness':
      return 'wiw';
    case 'Surf Club':
      return 'surf';
    case 'Mountain Biking':
      return 'dmbc';
    case 'Winter Sports':
      return 'wsc';
    case 'Woodsmen':
      return 'wood';
    case 'Mountaineering':
      return 'mountain';
    case 'Ledyard':
      return 'ledyard';
    default:
      return 'doc';
  }
};
