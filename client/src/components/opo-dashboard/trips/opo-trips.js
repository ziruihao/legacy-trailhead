import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import Toggle from '../../toggle';
import Table from 'react-bootstrap/Table';
import { Stack, Queue, Divider, Box } from '../../layout';
import Badge from '../../badge';
import Text from '../../text';
import DOCLoading from '../../doc-loading';
import { fetchOPOTrips, appError } from '../../../actions';
import utils from '../../../utils';
import dropdownIcon from '../../../img/dropdown-toggle.svg';
import '../../../styles/tripdetails_leader.scss';
import '../opo-approvals.scss';

class OPOTrips extends Component {
  ALL_KEY = 'ALL';

  ALL_VALUE = 'All Requests';

  PCARD_KEY = 'PCARD';

  PCARD_VALUE = 'P-Card Requests';

  VEHICLE_KEY = 'VEHICLE_KEY';

  VEHICLE_VALUE = 'Vehicle Requests';

  GEAR_KEY = 'GEAR_KEY';

  GEAR_VALUE = 'Gear Requests';

  now = new Date();

  constructor(props) {
    super(props);
    this.state = {
      selectedFilter: this.ALL_KEY,
      searchTerm: '',
      ready: false,
      getOldTrips: false
    };
    this.onDropdownChange = this.onDropdownChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchOPOTrips({ getOldTrips: false })
      .then(() => {
        this.setState({ ready: true });
      });
  }

  onDropdownChange(eventKey, event) {
    this.setState({ selectedFilter: eventKey });
  }

  onSearchTermChange = (event) => {
    event.persist();
    this.props.appError('This feature will be done soon!');
    this.setState({ searchTerm: event.target.value });
  }

  onRowClick = (id) => {
    this.props.history.push(`/approve-trip/${id}`);
  }

  getReqStatus = (status) => {
    if (status === 'N/A') {
      return <td>N/A</td>;
    } else if (status === 'pending') {
      return <td className='pending'><Badge type='pending' size={36} /></td>;
    } else if (status === 'approved') {
      return <td className='approved'><Badge type='approved' size={36} /></td>;
    } else {
      return <td className='denied'><Badge type='denied' size={36} /></td>;
    }
  }

  getGearStatus = (individualGearStatus, groupGearStatus) => {
    if (individualGearStatus === 'N/A' && groupGearStatus === 'N/A') {
      return <td>N/A</td>;
    } else if (individualGearStatus === 'pending' || groupGearStatus === 'pending') {
      return <td className='pending'><Badge type='pending' size={36} /></td>;
    } else if (individualGearStatus === 'denied' || groupGearStatus === 'denied') {
      return <td className='denied'><Badge type='denied' size={36} /></td>;
    } else {
      return <td className='approved'><Badge type='approved' size={36} /></td>;
    }
  }

  getPendingTable = () => {
    const pendingTrips = this.props.trips.filter((trip) => {
      let hasPendingGear = false;
      let hasPendingTrippeeGear = false;
      let hasPendingPcard = false;
      let hasPendingVehicle = false;
      switch (this.state.selectedFilter) {
        case this.ALL_KEY:
          hasPendingTrippeeGear = trip.trippeeGearStatus === 'pending';
          hasPendingGear = trip.gearStatus === 'pending';
          hasPendingPcard = trip.pcardStatus === 'pending';
          hasPendingVehicle = trip.vehicleStatus === 'pending';
          break;
        case this.GEAR_KEY:
          hasPendingTrippeeGear = trip.trippeeGearStatus === 'pending';
          hasPendingGear = trip.gearStatus === 'pending';
          break;
        case this.PCARD_KEY:
          hasPendingPcard = trip.pcardStatus === 'pending';
          break;
        case this.VEHICLE_KEY:
          hasPendingVehicle = trip.vehicleStatus === 'pending';
          break;
        default:
          hasPendingTrippeeGear = trip.trippeeGearStatus === 'pending';
          hasPendingGear = trip.gearStatus === 'pending';
          hasPendingPcard = trip.pcardStatus === 'pending';
          hasPendingVehicle = trip.vehicleStatus === 'pending';
      }
      const hasPassed = new Date(trip.startDateAndTime) < this.now;
      return (!hasPassed && (hasPendingTrippeeGear || hasPendingGear || hasPendingPcard || hasPendingVehicle));
    });
    if (pendingTrips.length === 0) {
      return (
        <Box dir='col' align='center' className='p1 gray thin'>All set for now!</Box>
      );
    } else {
      return (
        <Table className='doc-table' responsive='lg' hover>
          <thead>
            <tr>
              <th>Trip</th>
              <th>Start Time</th>
              <th>Subclub</th>
              <th>Leader</th>
              <th>Gear</th>
              <th>Vehicles</th>
              <th>P-Card</th>
            </tr>
          </thead>
          <tbody>
            {this.getPendingTripRows(pendingTrips)}
          </tbody>
        </Table>
      );
    }
  }

  getApprovedTable = () => {
    const approvedTrips = this.props.trips.filter((trip) => {
      const hasPendingTrippeeGear = trip.trippeeGearStatus === 'pending';
      const hasPendingGear = trip.gearStatus === 'pending';
      const hasPendingPcard = trip.pcardStatus === 'pending';
      const hasPendingVehicle = trip.vehicleStatus === 'pending';
      const hasPassed = new Date(trip.startDateAndTime) < this.now;
      return (hasPassed || (!hasPendingTrippeeGear && !hasPendingGear && !hasPendingPcard && !hasPendingVehicle));
    });
    const filteredTrips = approvedTrips.filter((trip) => {
      return trip.title.concat([`${utils.dates.formatDate(new Date(trip.startDateAndTime), { year: true, weekday: true })}@${utils.dates.formatTime(new Date(trip.startDateAndTime), { timezone: true })}`, trip.leaders[0].name, trip.club.name])
        .toLowerCase().includes(this.state.searchTerm.toLowerCase());
    });
    if (filteredTrips.length === 0) {
      return (
        <Box dir='col' align='center' className='p1 gray thin'>All set for now!</Box>
      );
    } else {
      return (
        <Table className='doc-table' responsive='lg' hover>
          <thead>
            <tr>
              <th>Trip</th>
              <th>Start Time</th>
              <th>Subclub</th>
              <th>Leader</th>
              <th>Gear</th>
              <th>Vehicles</th>
              <th>P-Card</th>
            </tr>
          </thead>
          <tbody>
            {this.getApprovedTripRows(filteredTrips)}
          </tbody>
        </Table>
      );
    }
  }

  getPendingTripRows = (pendingTrips) => {
    return pendingTrips.map(trip => (
      <tr key={trip._id} onClick={() => this.onRowClick(trip._id)}>
        <td>{trip.title}</td>
        <td>{utils.dates.formatDate(new Date(trip.startDateAndTime), { weekday: true })} @ {utils.dates.formatTime(new Date(trip.startDateAndTime), { timezone: true })}</td>
        <td>{trip.club.name}</td>
        <td>{trip.owner.name}</td>
        {this.getGearStatus(trip.gearStatus, trip.trippeeGearStatus)}
        {this.getReqStatus(trip.vehicleStatus)}
        {this.getReqStatus(trip.pcardStatus)}
      </tr>
    ));
  }

  getApprovedTripRows = (approvedTrips) => {
    return approvedTrips.map(trip => (
      <tr key={trip._id} onClick={() => this.onRowClick(trip._id)}>
        <td>{trip.title}</td>
        <td>{utils.dates.formatDate(new Date(trip.startDateAndTime), { weekday: true })} @ {utils.dates.formatTime(new Date(trip.startDateAndTime), { timezone: true })}</td>
        <td>{trip.club.name}</td>
        <td>{trip.owner.name}</td>
        {this.getGearStatus(trip.gearStatus, trip.trippeeGearStatus)}
        {this.getReqStatus(trip.vehicleStatus)}
        {this.getReqStatus(trip.pcardStatus)}
      </tr>
    ));
  }

  getCurrentFilter = () => {
    switch (this.state.selectedFilter) {
      case this.ALL_KEY:
        return this.ALL_VALUE;
      case this.GEAR_KEY:
        return this.GEAR_VALUE;
      case this.PCARD_KEY:
        return this.PCARD_VALUE;
      case this.VEHICLE_KEY:
        return this.VEHICLE_VALUE;
      default:
        return this.ALL_VALUE;
    }
  }

  render() {
    if (this.state.ready) {
      return (
        <div id='opo-trips-page' className='center-view'>
          <div className='opo-trips-page-databox doc-card large-card'>
            <div className='databox-heading'>
              <Text type='h1'>Pending Trips</Text>
              {/* <input
                name='search'
                placeholder='Search pending trips'
                value={this.state.searchTerm}
                onChange={this.onSearchTermChange}
                className='databox-heading-search field'
              /> */}
              {/* <div className="dropdown-and-label">
                <span className="dropdown-label">Filter by:</span>
                <Dropdown onSelect={this.onDropdownChange}>
                  <Dropdown.Toggle id="filter-dropdown" onChange={this.onDropdownChange}>
                    <p className="current-filter">{this.getCurrentFilter()}</p>
                    <img className="dropdown-icon" src={dropdownIcon} alt="dropdown-toggle" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="field-dropdown-menu">
                    <Dropdown.Item eventKey={this.ALL_KEY} active={this.ALL_KEY === this.state.selectedFilter}>{this.ALL_VALUE}</Dropdown.Item>
                    <Dropdown.Item eventKey={this.GEAR_KEY} active={this.GEAR_KEY === this.state.selectedFilter}>{this.GEAR_VALUE}</Dropdown.Item>
                    <Dropdown.Item eventKey={this.PCARD_KEY} active={this.PCARD_KEY === this.state.selectedFilter}>{this.PCARD_VALUE}</Dropdown.Item>
                    <Dropdown.Item eventKey={this.VEHICLE_KEY} active={this.VEHICLE_KEY === this.state.selectedFilter}>{this.VEHICLE_VALUE}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div> */}
            </div>
            {this.getPendingTable()}
          </div>
          <Stack size={100} />
          <div className='opo-trips-page-databox doc-card large-card'>
            <div className='databox-heading'>
              <Text type='h1'>Reviewed & Past Trips</Text>
              <Toggle value={this.state.getOldTrips}
                id='old-trips'
                label='Show older than a month'
                onChange={() => {
                  if (!this.state.getOldTrips) {
                    this.props.fetchOPOTrips({ getOldTrips: true });
                  } else {
                    this.props.fetchOPOTrips({ getOldTrips: false });
                  }
                  this.setState(prevState => ({ getOldTrips: !prevState.getOldTrips }))
                }}
                disabled={false}
              />
              {/* <input
                name='search'
                placeholder='Search reviewed & past trips'
                value={this.state.searchTerm}
                onChange={this.onSearchTermChange}
                className='databox-heading-search field'
              /> */}
            </div>
            {this.getApprovedTable()}
          </div>
          <Stack size={100} />
        </div>
      );
    } else {
      return (<DOCLoading type='doc' height='150' width='150' measure='px' />);
    }
  }
}

const mapStateToProps = (state) => {
  return {
    trips: state.opo.opoTrips,
  };
};

export default withRouter(connect(mapStateToProps, { fetchOPOTrips, appError })(OPOTrips));
