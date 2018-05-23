import axios from 'axios';

export const ActionTypes = {
  FETCH_TRIPS: 'FETCH_TRIPS',
  FETCH_TRIP: 'FETCH_TRIP',
  JOIN_TRIP: 'JOIN_TRIP',
  CANCEL_TRIP: 'CANCEL_TRIP',
  IS_ON_TRIP: 'IS_ON_TRIP',
  MY_TRIPS: 'MY_TRIPS',
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
  UPDATE_USER: 'UPDATE_USER',
};

const ROOT_URL = 'https://doc-planner-api.herokuapp.com/api';

export function getUser() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/user`, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        console.log(response);
        dispatch({ type: ActionTypes.UPDATE_USER, payload: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function updateUser(updatedUser) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/user`, updatedUser, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        console.log(response);
        dispatch({ type: ActionTypes.UPDATE_USER, payload: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function fetchTrips() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/trips`).then((response) => {
      dispatch({
        type: ActionTypes.FETCH_TRIPS,
        payload: response.data,
      });
    }).catch((error) => {
      console.log('Fetch trips error');
    });
  };
}

export function fetchTrip(tripID) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/trip/${tripID}`).then((response) => {
      console.log(response.data);
      dispatch({ type: ActionTypes.FETCH_TRIP, payload: response.data });
    }).catch((error) => {
      console.log(error);
      console.log('Fetch trip error');
    });
  };
}

export function joinTrip(tripID) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/jointrip`, { tripID }, { headers: { authorization: localStorage.getItem('token') } }).then((response) => {
      dispatch({ type: ActionTypes.JOIN_TRIP, payload: response.data.isOnTrip });
      console.log(response.data);
    }).catch((error) => {
      console.log('joinTrip error');
      console.log(error);
    });
  };
}

export function cancelTrip(tripID) {
  return {
    type: ActionTypes.FETCH_TRIPS,
    payload: null,
  };
  // return (dispatch) => {
  //   axios.put(`${ROOT_URL}/joinTrip/${tripID}$`).then((response) => {
  //     dispatch({ type: ActionTypes.JOIN_TRIP, payload: response.data.isOnTrip });
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // };
}

export function createTrip(trip, history) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/trips`, trip, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        console.log(response);
        history.push('/alltrips');
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function getMyTrips() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/myTrips`, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        dispatch({ type: ActionTypes.MY_TRIPS, payload: response.data });
      }).catch((error) => {
        console.log(error);
      });
  };
}

export function isOnTrip(tripID) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/isOnTrip/${tripID}$`, { headers: { authorization: localStorage.getItem('token') } }).then((response) => {
      dispatch({ type: ActionTypes.IS_ON_TRIP, payload: response.data.isOnTrip });
    }).catch((error) => {
      console.log(error);
    });
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
        dispatch({ type: ActionTypes.UPDATE_USER, payload: response.data.user });
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
        dispatch({ type: ActionTypes.UPDATE_USER, payload: response.data.user });
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
