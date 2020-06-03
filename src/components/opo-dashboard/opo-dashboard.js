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
      <Box id="dashboard-tiles" className="doc-card" dir="row" justify="start" align="stretch" pad={[0, 50]}>
        <Box className={`section ${active.trips ? 'current-section' : ''}`} dir="col" justify="center" pad={[50, 0]}>
          <NavLink to="/opo-dashboard/opo-trips">
            <Box dir="row" align="center">
              <Badge type="trips" size={active.trips ? 48 : 48} />
              <Queue size={25} />
              <div className="titles doc-h3">Trip Approvals</div>
            </Box>
          </NavLink>
          {active.trips
            ? <Divider className="section-underline" size={5} color="#0CA074" />
            : null
          }
        </Box>
        <Box dir="row" pad={50}>
          <Divider dir="col" size={1} />
        </Box>
        <Box className={`section ${active.vehicles ? 'current-section' : ''}`} dir="col" justify="center" pad={[50, 0]}>
          <NavLink to="/opo-dashboard/vehicle-requests">
            <Box dir="row" align="center">
              <Badge type="vehicle" size={active.vehicles ? 48 : 48} />
              <Queue size={25} />
              <div className="titles doc-h3">Vehicle Requests</div>
            </Box>
          </NavLink>
          {active.vehicles
            ? <Divider className="section-underline" size={5} color="#0CA074" />
            : null
          }
        </Box>
        <Box dir="row" pad={50}>
          <Divider dir="col" size={1} />
        </Box>
        <Box className={`section ${active.calendar ? 'current-section' : ''}`} dir="col" justify="center" pad={[50, 0]}>
          <NavLink to="/opo-dashboard/vehicle-calendar">
            <Box dir="row" align="center">
              <Badge type="calendar" size={active.calendar ? 48 : 48} />
              <Queue size={25} />
              <div className="titles doc-h3">Calendar</div>
            </Box>
          </NavLink>
          {active.calendar
            ? <Divider className="section-underline" size={5} color="#0CA074" />
            : null
          }
        </Box>
        <Box dir="row" pad={50}>
          <Divider dir="col" size={1} />
        </Box>
        <Box className={`section ${active.leaders ? 'current-section' : ''}`} dir="col" justify="center" pad={[50, 0]}>
          <NavLink to="/opo-dashboard/leader-approvals">
            <Box dir="row" align="center">
              <Badge type="person" size={active.leaders ? 48 : 48} />
              <Queue size={25} />
              <div className="titles doc-h3">Profile Approvals</div>
            </Box>
          </NavLink>
          {active.leaders
            ? <Divider className="section-underline" size={5} color="#0CA074" />
            : null
          }
        </Box>
        <Box dir="row" pad={50}>
          <Divider dir="col" size={1} />
        </Box>
        <Box className={`section ${active.fleet ? 'current-section' : ''}`} dir="col" justify="center" pad={[50, 0]}>
          <NavLink to="/opo-dashboard/opo-fleet-management">
            <Box dir="row" align="center">
              <Badge type="marker" size={active.fleet ? 48 : 48} />
              <Queue size={25} />
              <div className="titles doc-h3">Manage Fleet</div>
            </Box>
          </NavLink>
          {active.fleet
            ? <Divider className="section-underline" size={5} color="#0CA074" />
            : null
          }
        </Box>
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
