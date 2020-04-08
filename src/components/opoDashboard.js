import React from 'react';
import { Route, withRouter, NavLink } from 'react-router-dom';
import { Switch } from 'react-router';
import requireAuth from '../containers/requireAuth';
import OpoTrips from './opotrips';
import OpoApprovals from './opoStuff';
// import LeaderApprovals from './leader_approvals';
import TripApprovals from '../img/mountain.svg';
import VehicleRequests from '../img/vehicle.svg';
import LeaderApproval from '../img/leader.svg';
import MyTrips from '../img/mytrips_icon.png';
// import OPOAssignments from '../img/opoicon.svg';
import '../styles/opo-dashboard-style.scss';

const OPODashboard = () => {
  return (
    <div className="dashboard">
      <div className="section">
        <NavLink to="/opo-trips">
          <div>
            <img src={TripApprovals} alt="Trip Approval Icon" />
            <p className="titles">Trip Approvals</p>
          </div>
        </NavLink>
      </div>
      <div className="section">
        <NavLink to="/vehicle-requests">
          <div>
            <img src={VehicleRequests} alt="Vehicle Requests Icon" />
            <p className="titles">Vehicle Requests</p>
          </div>
        </NavLink>
      </div>
      <div className="section">
        <NavLink to="/leader-approvals">
          <div>
            <img src={LeaderApproval} alt="Leader Icon" />
            <p className="titles">Profile Approvals</p>
          </div>
        </NavLink>
      </div>
      <div className="section">
        {/* <NavLink to="/mytrips">
          <div>
            <img src={MyTrips} alt="My Trips Icon" />
            <p className="titles">My Trips</p>
          </div>
        </NavLink> */}
      </div>
      {/* <div className="section">
        <NavLink to="/leader_approvals">
          <div>
            <img src={OPOAssignments} alt="Opo Icon" />
            <p className="titles">OPO Officer</p>
            <p className="titles"> Assignments</p>
          </div>
        </NavLink>
      </div> */}
      <Switch>
        <Route path="/opo-dashboard/trip_approvals" component={requireAuth(OpoTrips)} />
        <Route path="/opo-dashboard/approvals" component={requireAuth(OpoApprovals)} />
      </Switch>
    </div>
  );
};


export default withRouter(OPODashboard);
