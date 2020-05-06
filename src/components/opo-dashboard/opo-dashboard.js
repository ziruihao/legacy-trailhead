import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import TripApprovals from '../../img/mountain.svg';
import VehicleRequests from '../../img/vehicle.svg';
import LeaderApproval from '../../img/leader.svg';
import OPOAssignments from '../../img/mytrips_icon.png';
import './opo-dashboard.scss';

const OPODashboard = () => {
  return (
    <div id="dashboard" className="center-view">
      <div id="dashboard-tiles">
        <NavLink className="section" to="/opo-trips">
          <img src={TripApprovals} alt="Trip Approval Icon" />
          <div className="titles h2">Trip Approvals</div>
        </NavLink>
        <NavLink className="section" to="/vehicle-requests">
          <img src={VehicleRequests} alt="Vehicle Requests Icon" />
          <div className="titles h2">Vehicle Requests</div>
        </NavLink>
        <NavLink className="section" to="/leader-approvals">
          <img src={LeaderApproval} alt="Leader Icon" />
          <div className="titles h2">Profile Approvals</div>
        </NavLink>
        <NavLink className="section" to="/opo-fleet-management">
          <img src={OPOAssignments} alt="Fleet Icon" />
          <div className="titles h2">Manage Fleet</div>
        </NavLink>
      </div>
    </div>
  );
};


export default withRouter(OPODashboard);
