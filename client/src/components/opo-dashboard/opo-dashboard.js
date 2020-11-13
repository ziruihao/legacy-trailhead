import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Stack, Queue, Divider, Box } from '../layout';
import Icon from '../icon';
import Badge from '../badge';
import OPOTrips from './trips';
import OPOVehicleRequests from './vehicle-requests';
import OPOLeaders from './profiles';
import FleetManagement from './fleet-management';
import VehicleCalendar from '../calendar/vehicleCalendar';
import './opo-dashboard.scss';

const OPODashboard = (props) => {
  const navigateDashboard = (toWhere) => {
    props.history.push(toWhere);
  };
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
      dashboardContent = <VehicleCalendar />;
      active.calendar = true;
  }
  return (
    <Box id='dashboard' dir='col' align='stretch' expand>
      <Box id='dashboard-tiles' className='doc-card no-scroll-bar' dir='row' justify='start' align='stretch'>
        <Box className={`section ${active.trips ? 'current-section' : ''}`} dir='col' justify='center' pad={[25, 50]} onClick={() => navigateDashboard('/opo-dashboard/opo-trips')} role='button' tabIndex={0}>
          <Box dir='row' align='center'>
            <Icon type='trip' size={32} />
            {/* <Badge type="trips" size={active.trips ? 48 : 48} /> */}
            <Queue size={25} />
            <div className='titles doc-h3'>Trip Approvals</div>
          </Box>
          {active.trips
            ? <Divider className='section-underline' size={5} color='green' />
            : null
          }
        </Box>
        <Box dir='row' pad={[25, 0]}>
          <Divider dir='col' size={1} />
        </Box>
        <Box className={`section ${active.vehicles ? 'current-section' : ''}`} dir='col' justify='center' pad={[25, 50]} onClick={() => navigateDashboard('/opo-dashboard/vehicle-requests')} role='button' tabIndex={0}>
          <Box dir='row' align='center'>
            <Icon type='vehicle' size={24} />
            {/* <Badge type="vehicle" size={active.vehicles ? 48 : 48} /> */}
            <Queue size={25} />
            <div className='titles doc-h3'>Vehicle Requests</div>
          </Box>
          {active.vehicles
            ? <Divider className='section-underline' size={5} color='green' />
            : null
          }
        </Box>
        <Box dir='row' pad={[25, 0]}>
          <Divider dir='col' size={1} />
        </Box>
        <Box className={`section ${active.calendar ? 'current-section' : ''}`} dir='col' justify='center' pad={[25, 50]} onClick={() => navigateDashboard('/opo-dashboard/vehicle-calendar')} role='button' tabIndex={0}>
          <Box dir='row' align='center'>
            <Icon type='calendar' size={24} />
            {/* <Badge type="calendar" size={active.calendar ? 48 : 48} /> */}
            <Queue size={25} />
            <div className='titles doc-h3'>Calendar</div>
          </Box>
          {active.calendar
            ? <Divider className='section-underline' size={5} color='green' />
            : null
          }
        </Box>
        <Box dir='row' pad={[25, 0]}>
          <Divider dir='col' size={1} />
        </Box>
        <Box className={`section ${active.leaders ? 'current-section' : ''}`} dir='col' justify='center' pad={[25, 50]} onClick={() => navigateDashboard('/opo-dashboard/leader-approvals')} role='button' tabIndex={0}>
          <Box dir='row' align='center'>
            <Icon type='cert' size={24} />
            {/* <Badge type="person" size={active.leaders ? 48 : 48} /> */}
            <Queue size={25} />
            <div className='titles doc-h3'>Profile Approvals</div>
          </Box>
          {active.leaders
            ? <Divider className='section-underline' size={5} color='green' />
            : null
          }
        </Box>
        <Box dir='row' pad={[25, 0]}>
          <Divider dir='col' size={1} />
        </Box>
        <Box className={`section ${active.fleet ? 'current-section' : ''}`} dir='col' justify='center' pad={[25, 50]} onClick={() => navigateDashboard('/opo-dashboard/opo-fleet-management')} role='button' tabIndex={0}>
          <Box dir='row' align='center'>
            <Icon type='marker' size={24} />
            {/* <Badge type="marker" size={active.fleet ? 48 : 48} /> */}
            <Queue size={25} />
            <div className='titles doc-h3'>Manage Fleet</div>
          </Box>
          {active.fleet
            ? <Divider className='section-underline' size={5} color='green' />
            : null
          }
        </Box>
        <Queue size={50} />
        <Queue size={50} />
        <div id='dashboard-tiles-blur' />
      </Box>
      <Stack size={100} />
      <Box id='dashboard-content' dir='col' align='stretch' expand>
        {dashboardContent}
      </Box>
    </Box>
  );
};


export default withRouter(OPODashboard);
