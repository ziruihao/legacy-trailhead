import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Stack, Queue, Divider, Box } from '../layout';
import Badge from '../badge';
import OPOTrips from '../opo-approvals/trips';
import OPOVehicleRequests from '../opo-approvals/vehicle-requests';
import OPOLeaders from '../opo-approvals/leaders';
import FleetManagement from '../fleet-management';
import VehicleCalendar from '../vehicleCalendar';
import './opo-dashboard.scss';

const OPODashboard = (props) => {
  let dashboardContent = <OPOTrips />;
  const active = { trips: false, vehicles: false, calendar: false, leaders: false, fleet: false };
  switch (props.location.pathname) {
    case '/opo-dashboard/opo-trips':
      active.trips = true;
      break;
    case '/opo-dashboard/vehicle-requests':
      dashboardContent = <OPOVehicleRequests />;
      active.vehicles = true;
      break;
    case '/opo-dashboard/vehicle-calendar':
      dashboardContent = <VehicleCalendar />;
      active.calendar = true;
      break;
    case '/opo-dashboard/leader-approvals':
      dashboardContent = <OPOLeaders />;
      active.leaders = true;
      break;
    case '/opo-dashboard/opo-fleet-management':
      dashboardContent = <FleetManagement />;
      active.fleet = true;
      break;
    default:
      dashboardContent = <OPOTrips />;
      active.trips = true;
  }
  return (
    <Box id="dashboard" dir="col" align="stretch" expand>
      <Box id="dashboard-tiles" className="doc-card" dir="row" justify="start" align="stretch" pad={50}>
        <NavLink className={`section ${active.trips ? 'current-section' : ''}`} to="/opo-dashboard/opo-trips">
          <Box dir="row" align="center">
            <Badge type="trips" size={48} />
            <Queue size={25} />
            <div className="titles doc-h2">Trip Approvals</div>
          </Box>
        </NavLink>
        <Queue size={50} />
        <Divider dir="col" size={1} />
        <Queue size={50} />
        <NavLink className={`section ${active.vehicles ? 'current-section' : ''}`} to="/opo-dashboard/vehicle-requests">
          <Box dir="row" align="center">
            <Badge type="vehicle" size={48} />
            <Queue size={25} />
            <div className="titles doc-h2">Vehicle Requests</div>
          </Box>
        </NavLink>
        <Queue size={50} />
        <Divider dir="col" size={1} />
        <Queue size={50} />
        <NavLink className={`section ${active.calendar ? 'current-section' : ''}`} to="/opo-dashboard/vehicle-calendar">
          <Box dir="row" align="center">
            <Badge type="calendar" size={48} />
            <Queue size={25} />
            <div className="titles doc-h2">Calendar</div>
          </Box>
        </NavLink>
        <Queue size={50} />
        <Divider dir="col" size={1} />
        <Queue size={50} />
        <NavLink className={`section ${active.leaders ? 'current-section' : ''}`} to="/opo-dashboard/leader-approvals">
          <Box dir="row" align="center">
            <Badge type="person" size={48} />
            <Queue size={25} />
            <div className="titles doc-h2">Profile Approvals</div>
          </Box>
        </NavLink>
        <Queue size={50} />
        <Divider dir="col" size={1} />
        <Queue size={50} />
        <NavLink className={`section ${active.fleet ? 'current-section' : ''}`} to="/opo-dashboard/opo-fleet-management">
          <Box dir="row" align="center">
            <Badge type="marker" size={48} />
            <Queue size={25} />
            <div className="titles doc-h2">Manage Fleet</div>
          </Box>
        </NavLink>
        <Queue size={50} />
        <Queue size={50} />
      </Box>
      <Stack size={100} />
      <Box id="dashboard-content" dir="col" align="stretch" expand>
        {dashboardContent}
      </Box>
    </Box>
  );
};


export default withRouter(OPODashboard);
