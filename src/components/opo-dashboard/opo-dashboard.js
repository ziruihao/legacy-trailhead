import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import TripApprovals from '../../img/mountain.svg';
import VehicleRequests from '../../img/vehicle.svg';
import LeaderApproval from '../../img/leader.svg';
import './opo-dashboard.scss';

const OPODashboard = () => {
  return (
    <div className="dashboard">
      <NavLink className="section" to="/opo-trips">
        <img src={TripApprovals} alt="Trip Approval Icon" />
        <div className="titles">Trip Approvals</div>
      </NavLink>
      <NavLink className="section" to="/vehicle-requests">
        <img src={VehicleRequests} alt="Vehicle Requests Icon" />
        <div className="titles">Vehicle Requests</div>
      </NavLink>
      <NavLink className="section" to="/leader-approvals">
        <img src={LeaderApproval} alt="Leader Icon" />
        <div className="titles">Profile Approvals</div>
      </NavLink>
      {/* <NavLink className="section" to="/mytrips">
            <img src={MyTrips} alt="My Trips Icon" />
            <div className="titles">My Trips</div>
        </NavLink> */}
      {/* <NavLink className="section" to="/leader_approvals">
            <img src={OPOAssignments} alt="Opo Icon" />
            <div className="titles">OPO Officer</div>
            <div className="titles"> Assignments</div>
        </NavLink> */}
    </div>
  );
};


export default withRouter(OPODashboard);
