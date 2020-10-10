// eslint-disable-next-line no-unused-vars
import typedefs from '../constants/typedefs';
import * as dates from './dates';

/**
 * Determines whether or not a trip has had all of its requests approved.
 * A return status of {'approved'} implies approval for all requests.
 * A return status of {'pending'} implies some are awaiting approval, which is further specified in {reasons}.
 * A return status of {'denied} implies some request was denied, which is further specified in {reasons}.
 * The second return value {reasons} is an array of strings describing the statuses of each request.
 * @param {typedefs.Trip} trip - Trip to calculate status of.
 * @typedef {Object} TripStatus
 * @property {string} status - One of {'approved'}, {'pending'}, or {'denied'}.
 * @property {string[]} reasons - Contains reasons explaining the status.
 * @returns {TripStatus} - Calculated trip status.
 */
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
        finalStatus = 'denied';
        break;
      default:
        break;
    }
  });

  return { status: finalStatus, reasons };
};

/**
 * Returns the user's role on this trip as either {LEADER}, {APPROVED} trippee, {PENDING} trippee, or {OPO}.
 * @param {typedefs.User} user - User to check role for.
 * @param {typedefs.Trip} trip - Trip to check user's role on.
 */
export const determineRoleOnTrip = (user, trip) => {
  if (user.role === 'OPO') return 'OPO';
  else if (trip.leaders.some(leader => leader._id.toString() === user._id.toString())) return 'LEADER';
  else if (trip.members.some(member => member.user._id.toString() === user._id.toString())) return 'APPROVED';
  else if (trip.pending.some(pender => pender.user._id.toString() === user._id.toString())) return 'PENDING';
  else return 'NONE';
};

/**
 * Ranking helper function to sort trips based on earlier start times.
 * @param {typedefs.Trip} tripA - First trip.
 * @param {typedefs.Trip} tripB - Second trip.
 */
export const compareTripStartDates = (tripA, tripB) => {
  return dates.compare(new Date(tripA.startDateAndTime), new Date(tripB.startDateAndTime));
};
