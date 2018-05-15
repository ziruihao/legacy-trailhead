export const ActionTypes = {
  FETCH_TRIPS: 'FETCH_TRIPS',
  FETCH_TRIP: 'FETCH_TRIP',
};

export function fetchTrips() {
  return {
    type: ActionTypes.FETCH_TRIPS,
    payload: null,
  };
}

export function fetchTrip() {
  return {
    type: ActionTypes.FETCH_TRIP,
    payload: null,
  };
}
