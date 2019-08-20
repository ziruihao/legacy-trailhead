import axios from 'axios';
// import { getTrip } from '../../../project-doc-website-api/src/controllers/trip_controller';

export const ActionTypes = {
  FETCH_TRIPS: 'FETCH_TRIPS',
  FETCH_TRIP: 'FETCH_TRIP',
  ADD_PENDING: 'ADD_PENDING',
  JOIN_TRIP: 'JOIN_TRIP',
  LEAVE_TRIP: 'LEAVE_TRIP',
  EDIT_TRIP: 'EDIT_TRIP',
  IS_ON_TRIP: 'IS_ON_TRIP',
  MY_TRIPS: 'MY_TRIPS',
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
  UPDATE_USER: 'UPDATE_USER',
  ALL_CLUBS: 'ALL_CLUBS',
  ERROR: 'ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  FETCH_LEADER_APPROVALS: 'FETCH_LEADER_APPROVALS',
  FETCH_GEAR_REQUESTS: 'FETCH_GEAR_REQUESTS',
  FETCH_TRIPPEE_GEAR_REQUESTS: 'FETCH_TRIPPEE_GEAR_REQUESTS',
  UPDATE_RESTRICTED_PATH: 'UPDATE_RESTRICTED_PATH',
  FETCH_CERT_APPROVALS: 'FETCH_CERT_APPROVALS',
  FETCH_OPO_TRIPS: 'FETCH_OPO_TRIPS',
  FETCH_PCARD_REQUESTS: 'FETCH_PCARD_REQUESTS',
};

// const ROOT_URL = 'https://doc-planner-api.herokuapp.com/api';
const ROOT_URL = 'http://localhost:9090/api';

export function appError(message) {
  return {
    type: ActionTypes.ERROR,
    message,
  };
}

export function clearError() {
  return {
    type: ActionTypes.CLEAR_ERROR,
  };
}

export function updateRestrictedPath(restrictedPath) {
  return {
    type: ActionTypes.UPDATE_RESTRICTED_PATH,
    payload: restrictedPath,
  };
}

export function getUser() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/user`, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
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
        dispatch(appError(`Update user failed: ${error.response.data}`));
      });
  };
}

export function fetchTrips() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/alltrips`, { headers: { authorization: localStorage.getItem('token') } }).then((response) => {
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
    return new Promise((resolve, reject) => {
      axios.get(`${ROOT_URL}/trip/${id}`, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          dispatch({ type: ActionTypes.FETCH_TRIP, payload: response.data });
          resolve();
        }).catch((error) => {
          console.log(error);
          console.log('Fetch trip error');
        });
    });
  };
}

export function addToPending(signUpInfo) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/addpending/${signUpInfo.id}`, signUpInfo, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_TRIP, payload: response.data });
      }).catch((error) => {
        console.log('addpending error');
        console.log(error);
      });
  };
}

export function editUserGear(signUpInfo) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/editusergear/${signUpInfo.id}`, signUpInfo, { headers: { authorization: localStorage.getItem('token') } }).then((response) => {
      dispatch({ type: ActionTypes.FETCH_TRIP, payload: response.data });
    }).catch((error) => {
      console.log('addpending error');
      console.log(error);
    });
  };
}

export function joinTrip(id, pend) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.put(`${ROOT_URL}/jointrip/${id}`, { id, pend }, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          dispatch({ type: ActionTypes.FETCH_TRIP, payload: response.data });
          resolve();
        }).catch((error) => {
          console.log('joinTrip error');
          console.log(error);
        });
    });
  };
}

export function moveToPending(id, member) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.put(`${ROOT_URL}/movetopending/${id}`, { id, member }, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          dispatch({ type: ActionTypes.FETCH_TRIP, payload: response.data });
          resolve();
        }).catch((error) => {
          console.log('move to pending error');
          console.log(error);
        });
    });
  };
}

export function leaveTrip(id, userTripStatus) {
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/leaveTrip/${id}`, { headers: { authorization: localStorage.getItem('token') }, data: { userTripStatus } }).then((response) => {
      dispatch({ type: ActionTypes.FETCH_TRIP, payload: response.data });
    }).catch((error) => {
      console.log(error);
    });
  };
}

export function emailTrip(id, subject, body, history) {
  console.log('in email trip');
  const json = { id, subject, text: body };
  return (dispatch) => {
    axios.post(`${ROOT_URL}/sendEmailToTrip`, json, { headers: { authorization: localStorage.getItem('token') } }).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });
  };
}

export function createTrip(trip, history) {
  console.log('trying to create a trip');
  console.log(trip);
  return (dispatch) => {
    axios.post(`${ROOT_URL}/alltrips`, trip, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        history.push('/alltrips');
      })
      .catch((error) => {
        console.log(error);
        dispatch(appError(`Error creating trip: ${error}`));
      });
  };
}

export function deleteTrip(id, history) {
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/trip/${id}`, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        history.goBack();
      })
      .catch((error) => {
        console.log(error);
        dispatch(appError(`Error deleting trip: ${error}`));
      });
  };
}

export function editTrip(trip, history) {
  console.log(trip);
  return (dispatch) => {
    axios.put(`${ROOT_URL}/trip/${trip.id}`, trip, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        history.push(`/trip/${trip.id}`);
      })
      .catch((error) => {
        console.log(error);
        dispatch(appError(`Error updating trip: ${error}`));
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
    axios.get(`${ROOT_URL}/isOnTrip/${tripID}`, { headers: { authorization: localStorage.getItem('token') } }).then((response) => {
      dispatch({ type: ActionTypes.IS_ON_TRIP, payload: response.data.isOnTrip });
    }).catch((error) => {
      console.log(error);
    });
  };
}


export function signIn({ email, password }, history) {
  return (dispatch, getState) => {
    axios
      .post(`${ROOT_URL}/signin`, { email, password })
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        dispatch({ type: ActionTypes.AUTH_USER });
        dispatch({ type: ActionTypes.UPDATE_USER, payload: response.data.user });
        history.push(getState().restrictedPath.restrictedPath);
      })
      .catch((error) => {
        console.log(error);
        dispatch(appError(`Sign in failed: ${error.response.data}`));
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
        history.push('/alltrips');
      })
      .catch((error) => {
        console.log(error);
        dispatch(appError(`Sign up failed: ${error.response.data}`));
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

export function getClubs() {
  return (dispatch) => {
    axios
      .get(`${ROOT_URL}/club`)
      .then((response) => {
        console.log(response);
        dispatch({ type: ActionTypes.ALL_CLUBS, payload: response.data });
      });
  };
}

export function fetchLeaderApprovals() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/leaderapprovals`, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        dispatch({
          type: ActionTypes.FETCH_LEADER_APPROVALS,
          payload: response.data,
        });
      }).catch((error) => {
        dispatch(appError(`Error fetching leader requests: ${error}`));
        console.log(error);
      });
  };
}

export function fetchCertApprovals() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/certapprovals`, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        dispatch({
          type: ActionTypes.FETCH_CERT_APPROVALS,
          payload: response.data,
        });
      }).catch((error) => {
        dispatch(appError(`Error fetching certification requests: ${error}`));
        console.log(error);
      });
  };
}

export function reviewRoleRequest(review) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/leaderapprovals`, review, { headers: { authorization: localStorage.getItem('token') } })
      .then(
        dispatch(fetchLeaderApprovals()),
      ).catch((error) => {
        dispatch(appError(`Error responding to role request: ${error}`));
      });
  };
}

export function reviewCertRequest(review) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/certapprovals`, review, { headers: { authorization: localStorage.getItem('token') } })
      .then(
        dispatch(fetchCertApprovals()),
      ).catch((error) => {
        dispatch(appError(`Error responding to certification request: ${error}`));
      });
  };
}

export function fetchGearRequests() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/gearrequests`, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        dispatch({
          type: ActionTypes.FETCH_GEAR_REQUESTS,
          payload: response.data,
        });
      }).catch((error) => {
        dispatch(appError(`Error fetching gear request: ${error}`));
        console.log(error);
      });
  };
}

export function fetchOpoTrips() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.get(`${ROOT_URL}/opotrips`, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          dispatch({
            type: ActionTypes.FETCH_OPO_TRIPS,
            payload: response.data,
          });
          resolve();
        })
        .catch((error) => {
          dispatch(appError(`Error fetching opo trips: ${error}`));
          console.log(error);
        });
    });
  };
}

export function reviewGearRequest(review) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/gearrequests`, review, { headers: { authorization: localStorage.getItem('token') } })
      .then(
        dispatch(fetchGearRequests()),
      ).catch((error) => {
        dispatch(appError(`Error responding to gear request: ${error}`));
      });
  };
}

export function fetchTrippeeGearRequests() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/trippeegearrequests`, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        dispatch({
          type: ActionTypes.FETCH_TRIPPEE_GEAR_REQUESTS,
          payload: response.data,
        });
      }).catch((error) => {
        dispatch(appError(`Error fetching trippee gear request: ${error}`));
        console.log(error);
      });
  };
}

export function reviewTrippeeGearRequest(review) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/trippeegearrequests`, review, { headers: { authorization: localStorage.getItem('token') } })
      .then(
        dispatch(fetchTrippeeGearRequests()),
      ).catch((error) => {
        dispatch(appError(`Error responding to trippee gear request: ${error}`));
      });
  };
}


export function reviewPCardRequests(review) {
  console.log(review);
  return (dispatch) => {
    axios.put(`${ROOT_URL}/pcardrequests`, review, { headers: { authorization: localStorage.getItem('token') } })
      .then(
        dispatch(fetchTrip(review.id)),
      ).catch((error) => {
        dispatch(appError(`Error responding to pcard  request: ${error}`));
      });
  };
}
