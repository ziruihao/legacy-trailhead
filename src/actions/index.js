export const ActionTypes = {
  FETCH_TRIPS: 'FETCH_TRIPS',
  FETCH_TRIP: 'FETCH_TRIP',
  SIGN_UP_TRIP: 'SIGN_UP_TRIP',
  CANCEL_TRIP: 'CANCEL_TRIP',
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


export function signUpTrip() {
  return {
    type: ActionTypes.SIGN_UP_TRIP,
    payload: null,
  };
}
