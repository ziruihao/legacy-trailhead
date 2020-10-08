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
  FETCH_USERS: 'FETCH_USERS',
  ALL_CLUBS: 'ALL_CLUBS',
  ERROR: 'ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  FETCH_LEADER_APPROVALS: 'FETCH_LEADER_APPROVALS',
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

export function getUsers() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.get(`${constants.BACKEND_URL}/users`)
        .then((response) => {
          dispatch({ type: ActionTypes.FETCH_USERS, payload: response.data });
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

export function getUser() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.get(`${constants.BACKEND_URL}/user`)
        .then((response) => {
          dispatch({ type: ActionTypes.UPDATE_USER, payload: response.data.user });
          resolve(response.data.user);
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
      axios.put(`${constants.BACKEND_URL}/user`, updatedUser)
        .then((response) => {
          dispatch({ type: ActionTypes.UPDATE_USER, payload: response.data.user });
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject(error);
          dispatch(appError(`Error: ${error.response.data}`));
        });
    });
  };
}

export function fetchTrips() {
  return (dispatch) => {
    axios.get(`${constants.BACKEND_URL}/trips`).then((response) => {
      dispatch({
        type: ActionTypes.FETCH_TRIPS,
        payload: response.data,
      });
    }).catch((error) => {
      console.log('Fetch trips error');
      dispatch(appError(`Error getting all trips: ${error.message}`));
    });
  };
}

export function fetchTrip(tripID, temporaryToken) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      const token = temporaryToken || localStorage.getItem('token');
      axios.get(`${constants.BACKEND_URL}/trips/${tripID}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          dispatch({ type: ActionTypes.FETCH_TRIP, payload: response.data });
          resolve();
        }).catch((error) => {
          console.log(error);
          dispatch(appError(`Error getting trip data: ${error.message}`));
          reject(error);
        });
    });
  };
}

export function setAttendingStatus(tripID, memberID, status, temporaryToken) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      const token = temporaryToken || localStorage.getItem('token');
      axios.put(`${constants.BACKEND_URL}/trips/set-attendence/${tripID}`, { memberID, status }, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          dispatch({ type: ActionTypes.SET_ATTENDENCE, payload: { memberID, attending: response.data.status } });
          resolve();
        }).catch((error) => {
          console.log(error);
          dispatch(appError(`Error marking attendence: ${error.message}`));
          reject(error);
        });
    });
  };
}

export function editUserGear(signUpInfo) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.put(`${constants.BACKEND_URL}/trips/editusergear/${signUpInfo.id}`, signUpInfo).then((response) => {
        fetchTrip(signUpInfo.id)(dispatch);
        setTimeout(() => resolve(), 1000);
      }).catch((error) => {
        dispatch(appError(`Error editing gear requests: ${error.message}`));
        console.log(error);
        reject(error);
      });
    });
  };
}

export function toggleTripLeadership(id, member) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.put(`${constants.BACKEND_URL}/trips/toggle-leadership/${id}`, { id, member })
        .then((response) => {
          dispatch({ type: ActionTypes.FETCH_TRIP, payload: response.data });
          resolve(response.data);
        }).catch((error) => {
          console.log('Assign to Leader error');
          console.log(error);
          reject(error);
        });
    });
  };
}

export function applyToTrip(signUpInfo) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.post(`${constants.BACKEND_URL}/trips/apply/${signUpInfo.id}`, signUpInfo)
        .then(() => {
          fetchTrip(signUpInfo.id)(dispatch);
          setTimeout(() => resolve(), 1000);
        }).catch((error) => {
          dispatch(appError(`Error applying for trip: ${error.message}`));
          console.log(error);
          reject(error);
        });
    });
  };
}

export function rejectFromTrip(tripID, rejectedUserID) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.post(`${constants.BACKEND_URL}/trips/reject/${tripID}`, { rejectedUserID })
        .then(() => {
          fetchTrip(tripID)(dispatch);
          setTimeout(() => resolve(), 1000);
        }).catch((error) => {
          dispatch(appError(`Error rejecting from trip: ${error.message}`));
          console.log(error);
          reject(error);
        });
    });
  };
}

export function admitToTrip(tripID, admittedUserID) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.post(`${constants.BACKEND_URL}/trips/admit/${tripID}`, { admittedUserID })
        .then(() => {
          fetchTrip(tripID)(dispatch);
          resolve();
        }).catch((error) => {
          dispatch(appError(`Error admitting trip: ${error.message}`));
          console.log(error);
          reject(error);
        });
    });
  };
}

export function unAdmitToTrip(tripID, unAdmittedUserID) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.post(`${constants.BACKEND_URL}/trips/unadmit/${tripID}`, { unAdmittedUserID })
        .then(() => {
          fetchTrip(tripID)(dispatch);
          resolve();
        }).catch((error) => {
          dispatch(appError(`Error putting trippee back to pending list: ${error.message}`));
          console.log(error);
          reject(error);
        });
    });
  };
}

export function leaveTrip(tripID, leavingUserID) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.post(`${constants.BACKEND_URL}/trips/leave/${tripID}`, { leavingUserID }).then(() => {
        fetchTrip(tripID)(dispatch);
        setTimeout(() => resolve(), 1000);
      }).catch((error) => {
        dispatch(appError(`Error leaving trip: ${error.message}`));
        console.log(error);
        reject(error);
      });
    });
  };
}

export function toggleTripLeftStatus(tripID, status, temporaryToken) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      const token = temporaryToken || localStorage.getItem('token');
      axios.put(`${constants.BACKEND_URL}/trips/toggle-left/${tripID}`, { status }, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          dispatch({ type: ActionTypes.FETCH_TRIP, payload: response.data });
          resolve();
        }).catch((error) => {
          console.log(error);
          dispatch(appError(`Error marking trip as returned: ${error.message}`));
          reject(error);
        });
    });
  };
}

export function toggleTripReturnedStatus(tripID, status, temporaryToken) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      const token = temporaryToken || localStorage.getItem('token');
      axios.put(`${constants.BACKEND_URL}/trips/toggle-returned/${tripID}`, { status }, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          dispatch({ type: ActionTypes.FETCH_TRIP, payload: response.data });
          resolve();
        }).catch((error) => {
          console.log(error);
          dispatch(appError(`Error marking trip as returned: ${error.message}`));
          reject(error);
        });
    });
  };
}

export function createTrip(trip, history) {
  return (dispatch) => {
    axios.post(`${constants.BACKEND_URL}/trips`, trip)
      .then((response) => {
        history.push(`/trip/${response.data._id}`);
      })
      .catch((error) => {
        console.log(error);
        dispatch(appError(`Error creating trip: ${error.message}`));
      });
  };
}

export function deleteTrip(id, history) {
  return (dispatch) => {
    axios.delete(`${constants.BACKEND_URL}/trips/${id}`)
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
      axios.put(`${constants.BACKEND_URL}/trips/${id}`, trip, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          history.push(`/trip/${id}`);
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
      axios.get(`${constants.BACKEND_URL}/myTrips`)
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
        axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
        dispatch({ type: ActionTypes.AUTH_USER });
        dispatch({ type: ActionTypes.UPDATE_USER, payload: response.data.user });
        setTimeout(() => dataLoader().then(() => resolve()), 2000);
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
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      axios.get(`${constants.BACKEND_URL}/user`)
        .then((response) => {
          if (response.data.user.completedProfile) {
            dispatch({ type: ActionTypes.AUTH_USER });
            dataLoader().then(() => resolve(response.data.user.completedProfile));
          }
          dispatch({ type: ActionTypes.UPDATE_USER, payload: response.data.user });
          resolve(response.data.user.completedProfile);
          // history.push(getState().restrictedPath.restrictedPath);
        })
        .catch((error) => {
          dispatch(appError(`Update user failed: ${error}`));
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

export function authUser() {
  return (dispatch) => {
    dispatch({ type: ActionTypes.AUTH_USER });
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
      axios.get(`${constants.BACKEND_URL}/leaderapprovals`)
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
      axios.get(`${constants.BACKEND_URL}/certapprovals`)
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
    axios.put(`${constants.BACKEND_URL}/leaderapprovals`, review)
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
    axios.put(`${constants.BACKEND_URL}/certapprovals`, review)
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

export function fetchOPOTrips() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.get(`${constants.BACKEND_URL}/opotrips`)
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
    axios.put(`${constants.BACKEND_URL}/gearrequest/${review.id}`, review)
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

export function reviewTrippeeGearRequest(review) {
  return (dispatch) => {
    axios.put(`${constants.BACKEND_URL}/trippeegearrequest/${review.id}`, review)
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

export function reviewPCardRequests(tripID, review) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.put(`${constants.BACKEND_URL}/pcardrequest/${tripID}`, review)
        .then((response) => {
          dispatch({
            type: ActionTypes.FETCH_TRIP,
            payload: response.data,
          });
          resolve();
        })
        .catch((error) => {
          dispatch(appError(`Error responding to pcard request: ${error}`));
        });
    });
  };
}

export function submitVehicleRequest(vehicleRequest, history) {
  return dispatch => new Promise((resolve, reject) => {
    axios.post(`${constants.BACKEND_URL}/vehicleRequests`, vehicleRequest)
      .then((response) => {
        history.push(`/vehicle-request/${response.data._id}`);
        resolve();
      }).catch((error) => {
        reject(error);
        dispatch(appError(`Error making vehicle request: ${error}`));
      });
  });
}

export function fetchVehicleRequest(id) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.get(`${constants.BACKEND_URL}/vehicle-request/${id}`)
        .then((response) => {
          dispatch({ type: ActionTypes.FETCH_VEHICLE_REQUEST, payload: response.data });
          resolve();
        }).catch((error) => {
          console.log(error);
          dispatch(appError(`Error fetching vehicle request: ${error}`));
          reject(error);
        });
    });
  };
}

export function fetchVehicleRequests() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.get(`${constants.BACKEND_URL}/vehicleRequests`)
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
    axios.put(`${constants.BACKEND_URL}/vehicle-request/${vehicleRequest.id}`, vehicleRequest)
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_VEHICLE_REQUEST, payload: response.data });
      }).catch((error) => {
        console.log(error);
        dispatch(appError(`Error making vehicle request: ${error}`));
      });
  };
}

export function cancelVehicleRequest(vehicleRequestID, history) {
  return dispatch => new Promise((resolve, reject) => {
    axios.delete(`${constants.BACKEND_URL}/vehicle-request/${vehicleRequestID}`)
      .then(() => {
        resolve();
        history.push('/');
      }).catch((error) => {
        reject(error);
        dispatch(appError(`Error cancelling vehicle request: ${error.message}`));
      });
  });
}

export function getVehicles() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      axios.get(`${constants.BACKEND_URL}/vehicles`)
        .then((response) => {
          dispatch({ type: ActionTypes.FETCH_VEHICLES, payload: response.data });
          setTimeout(() => {
            resolve();
          }, 0);
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
      axios.post(`${constants.BACKEND_URL}/vehicles`, vehicle)
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
      axios.delete(`${constants.BACKEND_URL}/vehicles/${vehicleID}`)
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
      axios.post(`${constants.BACKEND_URL}/opoVehicleRequest/${vehicleResponse.reqId}`, vehicleResponse)
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
      axios.delete(`${constants.BACKEND_URL}/opoVehicleRequest/${deleteInfo.reqId}`, { data: { deleteInfo } })
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
      axios.put(`${constants.BACKEND_URL}/opoVehicleRequest/${id}`, id)
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
      axios.get(`${constants.BACKEND_URL}/vehicle-assignments`)
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
