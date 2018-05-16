import axios from 'axios';

export const ActionTypes = {
  FETCH_TRIPS: 'FETCH_TRIPS',
  FETCH_TRIP: 'FETCH_TRIP',
  SIGN_UP_TRIP: 'SIGN_UP_TRIP',
  CANCEL_TRIP: 'CANCEL_TRIP',
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
};

const ROOT_URL = 'http://localhost:9090/api';

export function fetchTrips() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/alltrips`).then((response) => {
      dispatch({
        type: ActionTypes.FETCH_TRIPS,
        payload: response.data,
      });
    }).catch((error) => {
      console.log('Fetch trips error');
    });
  };
}

export function fetchTrip(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/alltrips/${id}`).then((response) => {
      dispatch({
        type: ActionTypes.FETCH_TRIP,
        payload: response.data,
      });
    }).catch((error) => {
      console.log('Fetch trip error');
    });
  };
}

export function signUpTrip() {
  return {
    type: ActionTypes.SIGN_UP_TRIP,
    payload: null,
  };
}

export function signIn({ email, password }, history) {
  return (dispatch) => {
    axios
      .post(`${ROOT_URL}/signin`, { email, password })
      .then((response) => {
        console.log(response);
        localStorage.setItem('token', response.data.token);
        dispatch({ type: ActionTypes.AUTH_USER });
        history.push('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function signUp({ email, password, name }, history) {
  return (dispatch) => {
    axios
      .post(`${ROOT_URL}/signup`, { email, password, name })
      .then((response) => {
        console.log(response);
        localStorage.setItem('token', response.data.token);
        dispatch({ type: ActionTypes.AUTH_USER });
        history.push('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function signOut(history) {
  return (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: ActionTypes.DEAUTH_USER });
    history.push('/');
  };
}
