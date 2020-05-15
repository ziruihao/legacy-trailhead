import axios from 'axios';
import * as constants from '../constants';

export const ActionTypes = {
  FETCH_TRIPS: 'FETCH_TRIPS',
  FETCH_TRIP: 'FETCH_TRIP',
  SET_ATTENDENCE: 'SET_ATTENDENCE',
  ADD_PENDING: 'ADD_PENDING',
  JOIN_TRIP: 'JOIN_TRIP',
  LEAVE_TRIP: 'LEAVE_TRIP',
  EDIT_TRIP: 'EDIT_TRIP',
  IS_ON_TRIP: 'IS_ON_TRIP',
  MY_TRIPS: 'MY_TRIPS',
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
  UPDATE_USER_ID: 'UPDATE_USER_ID',
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
  FETCH_VEHICLE_REQUEST: 'FETCH_VEHICLE_REQUEST',
  FETCH_VEHICLE_REQUESTS: 'FETCH_VEHICLE_REQUESTS',
  FETCH_VEHICLES: 'FETCH_VEHICLES',
  FETCH_PCARD_REQUESTS: 'FETCH_PCARD_REQUESTS',
  OPO_RESPOND_TO_VEHICLE_REQUEST: 'OPO_RESPOND_TO_VEHICLE_REQUEST',
  FETCH_ASSIGNMENTS: 'FETCH_ASSIGNMENTS',
  HAS_COMPLETE_PROFILE: 'HAS_COMPLETE_PROFILE',
};

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
    return new Promise((resolve, reject) => {
      axios.get(`${constants.BACKEND_URL}/user`, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          dispatch({ type: ActionTypes.UPDATE_USER, payload: response.data.user });
          dispatch({ type: ActionTypes.AUTH_USER, payload: true });
          resolve();
        })
        .catch((error) => {
          dispatch(appError(`Get user failed: ${error.response.data}`));
          console.log(error);
          reject(error);
        });
    });
  };
}

export function updateUser(updatedUser) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.put(`${constants.BACKEND_URL}/user`, updatedUser, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          dispatch({ type: ActionTypes.UPDATE_USER, payload: response.data.user });
          resolve();
        })
        .catch((error) => {
          console.log(error);
          dispatch(appError(`Update user failed: ${error.response.data}`));
        });
    });
  };
}

export function fetchTrips() {
  return (dispatch) => {
    axios.get(`${constants.BACKEND_URL}/alltrips`, { headers: { authorization: localStorage.getItem('token') } }).then((response) => {
      dispatch({
        type: ActionTypes.FETCH_TRIPS,
        payload: response.data,
      });
    }).catch((error) => {
      console.log('Fetch trips error');
    });
  };
}

export function fetchTrip(id, temporaryToken) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      const token = temporaryToken || localStorage.getItem('token');
      axios.get(`${constants.BACKEND_URL}/trip/${id}`, { headers: { authorization: token } })
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

export function setAttendingStatus(tripID, memberID, status, temporaryToken) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      const token = temporaryToken || localStorage.getItem('token');
      axios.put(`${constants.BACKEND_URL}/set-attendence/${tripID}`, { memberID, status }, { headers: { authorization: token } })
        .then((response) => {
          dispatch({ type: ActionTypes.SET_ATTENDENCE, payload: { memberID, attending: response.data.status } });
          resolve();
        }).catch((error) => {
          console.log(error);
          console.log('Attendence set error');
        });
    });
  };
}

export function addToPending(signUpInfo) {
  return (dispatch) => {
    axios.put(`${constants.BACKEND_URL}/addpending/${signUpInfo.id}`, signUpInfo, { headers: { authorization: localStorage.getItem('token') } })
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
    axios.put(`${constants.BACKEND_URL}/editusergear/${signUpInfo.id}`, signUpInfo, { headers: { authorization: localStorage.getItem('token') } }).then((response) => {
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
      axios.put(`${constants.BACKEND_URL}/jointrip/${id}`, { id, pend }, { headers: { authorization: localStorage.getItem('token') } })
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
      axios.put(`${constants.BACKEND_URL}/movetopending/${id}`, { id, member }, { headers: { authorization: localStorage.getItem('token') } })
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
    axios.post(`${constants.BACKEND_URL}/leaveTrip/${id}`, { userTripStatus }, { headers: { authorization: localStorage.getItem('token') } }).then((response) => {
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
    axios.post(`${constants.BACKEND_URL}/sendEmailToTrip`, json, { headers: { authorization: localStorage.getItem('token') } }).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });
  };
}

export function createTrip(trip, history) {
  return (dispatch) => {
    axios.post(`${constants.BACKEND_URL}/allTrips`, trip, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        history.push('/all-trips');
      })
      .catch((error) => {
        console.log(error);
        dispatch(appError(`Error creating trip: ${error}`));
      });
  };
}

export function deleteTrip(id, history) {
  return (dispatch) => {
    axios.delete(`${constants.BACKEND_URL}/trip/${id}`, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        history.goBack();
      })
      .catch((error) => {
        console.log(error);
        dispatch(appError(`Error deleting trip: ${error}`));
      });
  };
}

export function editTrip(trip, history, id, temporaryToken) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      const token = temporaryToken || localStorage.getItem('token');
      axios.put(`${constants.BACKEND_URL}/trip/${id}`, trip, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          dispatch({ type: ActionTypes.FETCH_TRIP, payload: response.data });
          resolve();
        })
        .catch((error) => {
          console.log(error);
          dispatch(appError(`Error updating trip: ${error}`));
          reject(error);
        });
    });
  };
}

export function getMyTrips() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.get(`${constants.BACKEND_URL}/myTrips`, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          dispatch({ type: ActionTypes.MY_TRIPS, payload: response.data });
          resolve();
        }).catch((error) => {
          console.log(error);
        });
    });
  };
}

export function signIn(email, password, dataLoader) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.post(`${constants.BACKEND_URL}/signin-simple`, { email, password }).then((response) => {
        localStorage.setItem('token', response.data.token);
        dispatch({ type: ActionTypes.AUTH_USER });
        dispatch({ type: ActionTypes.UPDATE_USER, payload: response.data.user });
        dataLoader().then(() => resolve());
      }).catch((error) => {
        reject(error);
      });
    });
  };
}

export function casAuthed(token, history, dataLoader) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      localStorage.setItem('token', token);
      axios.get(`${constants.BACKEND_URL}/user`, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          dispatch({ type: ActionTypes.AUTH_USER });
          dispatch({ type: ActionTypes.UPDATE_USER, payload: response.data.user });
          dataLoader().then(() => resolve());
          // history.push(getState().restrictedPath.restrictedPath);
        })
        .catch((error) => {
          dispatch(appError(`Update user failed: ${error.response.data}`));
          reject(error);
        });
    });
  };
}

export function signUp({ email, id, name }, history) {
  return (dispatch) => {
    axios
      .post(`${constants.BACKEND_URL}/signup`, { email, id, name })
      .then((response) => {
        console.log(response);
        dispatch({ type: ActionTypes.UPDATE_USER, payload: response.data.user });
        history.push('/user');
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
    return new Promise((resolve, reject) => {
      axios.get(`${constants.BACKEND_URL}/club`)
        .then((response) => {
          dispatch({ type: ActionTypes.ALL_CLUBS, payload: response.data });
          resolve();
        }).catch((error) => {
          dispatch(appError(`Error fetching clubs: ${error}`));
          console.log(error);
          reject(error);
        });
    });
  };
}

export function fetchLeaderApprovals() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.get(`${constants.BACKEND_URL}/leaderapprovals`, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          dispatch({
            type: ActionTypes.FETCH_LEADER_APPROVALS,
            payload: response.data,
          });
          resolve();
        }).catch((error) => {
          dispatch(appError(`Error fetching leader requests: ${error}`));
          console.log(error);
          reject(error);
        });
    });
  };
}

export function fetchCertApprovals() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.get(`${constants.BACKEND_URL}/certapprovals`, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          dispatch({
            type: ActionTypes.FETCH_CERT_APPROVALS,
            payload: response.data,
          });
          resolve();
        }).catch((error) => {
          dispatch(appError(`Error fetching certification requests: ${error}`));
          console.log(error);
        });
    });
  };
}

export function reviewRoleRequest(review) {
  return (dispatch) => {
    axios.put(`${constants.BACKEND_URL}/leaderapprovals`, review, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        dispatch({
          type: ActionTypes.FETCH_LEADER_APPROVALS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch(appError(`Error responding to role request: ${error}`));
      });
  };
}

export function reviewCertRequest(review) {
  return (dispatch) => {
    axios.put(`${constants.BACKEND_URL}/certapprovals`, review, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        dispatch({
          type: ActionTypes.FETCH_CERT_APPROVALS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch(appError(`Error responding to certification request: ${error}`));
      });
  };
}

export function fetchGearRequests() {
  return (dispatch) => {
    axios.get(`${constants.BACKEND_URL}/gearrequests`, { headers: { authorization: localStorage.getItem('token') } })
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
      axios.get(`${constants.BACKEND_URL}/opotrips`, { headers: { authorization: localStorage.getItem('token') } })
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
    axios.put(`${constants.BACKEND_URL}/gearrequest/${review.id}`, review, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        dispatch({
          type: ActionTypes.FETCH_TRIP,
          payload: response.data,
        });
      }).catch((error) => {
        dispatch(appError(`Error responding to gear request: ${error}`));
      });
  };
}

export function fetchTrippeeGearRequests() {
  return (dispatch) => {
    axios.get(`${constants.BACKEND_URL}/trippeegearrequests`, { headers: { authorization: localStorage.getItem('token') } })
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
    axios.put(`${constants.BACKEND_URL}/trippeegearrequest/${review.id}`, review, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        dispatch({
          type: ActionTypes.FETCH_TRIP,
          payload: response.data,
        });
      }).catch((error) => {
        dispatch(appError(`Error responding to trippee gear request: ${error}`));
      });
  };
}

export function reviewPCardRequests(review) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.put(`${constants.BACKEND_URL}/pcardrequest/:id`, review, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          dispatch({
            type: ActionTypes.FETCH_TRIP,
            payload: response.data,
          });
          resolve();
        })
        .catch((error) => {
          dispatch(appError(`Error responding to pcard  request: ${error}`));
        });
    });
  };
}

export function submitVehicleRequest(vehicleRequest, history) {
  return (dispatch) => {
    axios.post(`${constants.BACKEND_URL}/vehicleRequests`, vehicleRequest, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        history.push('/mytrips');
      }).catch((error) => {
        dispatch(appError(`Error making vehicle request: ${error}`));
      });
  };
}

export function fetchVehicleRequest(id) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.get(`${constants.BACKEND_URL}/vehiclerequest/${id}`, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          dispatch({ type: ActionTypes.FETCH_VEHICLE_REQUEST, payload: response.data });
          resolve();
        }).catch((error) => {
          console.log(error);
          dispatch(appError(`Error fetching vehicle request: ${error}`));
        });
    });
  };
}

export function fetchVehicleRequests() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.get(`${constants.BACKEND_URL}/vehicleRequests`, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          dispatch({ type: ActionTypes.FETCH_VEHICLE_REQUESTS, payload: response.data });
          resolve();
        }).catch((error) => {
          dispatch(appError(`Error fetching vehicle requests: ${error}`));
        });
    });
  };
}

export function updateVehicleRequest(vehicleRequest) {
  return (dispatch) => {
    axios.put(`${constants.BACKEND_URL}/vehicleRequest/${vehicleRequest.id}`, vehicleRequest, { headers: { authorization: localStorage.getItem('token') } })
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_VEHICLE_REQUEST, payload: response.data });
      }).catch((error) => {
        console.log(error);
        dispatch(appError(`Error making vehicle request: ${error}`));
      });
  };
}

export function getVehicles() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.get(`${constants.BACKEND_URL}/vehicles`, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          dispatch({ type: ActionTypes.FETCH_VEHICLES, payload: response.data });
          setTimeout(() => {
            resolve();
          }, 1000);
          // resolve();
        }).catch((error) => {
          dispatch(appError(`Error fetching vehicles : ${error}`));
          console.log(error);
          reject(error);
        });
    });
  };
}

export function createVehicle(vehicle) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.post(`${constants.BACKEND_URL}/vehicles`, vehicle, { headers: { authorization: localStorage.getItem('token') } })
        .then(() => {
          getVehicles()(dispatch).then(() => {
            resolve();
          });
        }).catch((error) => {
          dispatch(appError(`Error fetching vehicles : ${error}`));
          console.log(error);
          reject(error);
        });
    });
  };
}

export function deleteVehicle(vehicleID) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.delete(`${constants.BACKEND_URL}/vehicles/${vehicleID}`, { headers: { authorization: localStorage.getItem('token') } })
        .then(() => {
          getVehicles()(dispatch).then(() => {
            resolve();
          });
        }).catch((error) => {
          dispatch(appError(`Error fetching vehicles : ${error}`));
          console.log(error);
          reject(error);
        });
    });
  };
}

export function assignVehicles(vehicleResponse, finishEditing) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.post(`${constants.BACKEND_URL}/opoVehicleRequest/${vehicleResponse.reqId}`, vehicleResponse, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          finishEditing();
          dispatch({ type: ActionTypes.OPO_RESPOND_TO_VEHICLE_REQUEST, payload: response.data });
          resolve();
        }).catch((error) => {
          console.log(error);
          dispatch(appError(`Error responding to vehicle request: ${error}`));
          reject(error);
        });
    });
  };
}

export function cancelAssignments(deleteInfo) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.delete(`${constants.BACKEND_URL}/opoVehicleRequest/${deleteInfo.reqId}`, { headers: { authorization: localStorage.getItem('token') }, data: { deleteInfo } })
        .then((response) => {
          dispatch({ type: ActionTypes.OPO_RESPOND_TO_VEHICLE_REQUEST, payload: response.data });
          resolve();
        }).catch((error) => {
          console.log(error);
          dispatch(appError(`Error canceling assignment: ${error}`));
        });
    });
  };
}

export function denyVehicleRequest(id) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.put(`${constants.BACKEND_URL}/opoVehicleRequest/${id}`, id, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          dispatch({ type: ActionTypes.OPO_RESPOND_TO_VEHICLE_REQUEST, payload: response.data });
          resolve();
        }).catch((error) => {
          console.log(error);
          dispatch(appError(`Error denying vehicle request: ${error}`));
        });
    });
  };
}

export function fetchVehicleAssignments() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.get(`${constants.BACKEND_URL}/vehicle-assignments`, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          dispatch({ type: ActionTypes.FETCH_ASSIGNMENTS, payload: response.data });
          resolve();
        }).catch((error) => {
          console.log(error);
          dispatch(appError(`Error fetching vehicle request: ${error}`));
        });
    });
  };
}
