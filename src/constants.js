export const BACKEND_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:9090/api' : 'https://doc-dartmouth.herokuapp.com/api';
export const ROOT_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'http://doc-dartmouth.surge.sh';

export const green = '#0CA074';

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

export const determineRoleOnTrip = (user, trip) => {
  if (user.role === 'OPO') return 'OPO';
  else if (trip.leaders.some(leader => leader._id.toString() === user._id.toString())) return 'LEADER';
  else if (trip.members.some(member => member.user._id.toString() === user._id.toString())) return 'MEMBER';
  else if (trip.pending.some(pender => pender.user._id.toString() === user._id.toString())) return 'PENDING';
  else return 'NONE';
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
