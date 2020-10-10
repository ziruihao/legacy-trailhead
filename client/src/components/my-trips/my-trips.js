import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { Stack, Queue, Divider, Box } from '../layout';
import Toggle from '../toggle';
import DOCLoading from '../doc-loading';
import Badge from '../badge';
import Text from '../text';
import TripCard from '../trip-card';
import * as constants from '../../constants';
import utils from '../../utils';
import { getMyTrips, appError } from '../../actions';
import './my-trips.scss';
import './mytrips-style.scss';
import sadTree from '../trips/sad-tree.png';
import createtrip from './createtrip.svg';


class MyTrips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      seePastTrips: false,
      seeTripsImLeading: false,
      // seePastRequests: false,
      searchRequestTerm: '',
    };
  }

  componentDidMount() {
    this.props.getMyTrips()
      .then(() => {
        this.setState({ ready: true });
      });
  }

  onSearchRequestTermChange = (event) => {
    event.persist();
    this.setState({ searchRequestTerm: event.target.value });
  }

  renderCreateTrip = () => {
    if (this.props.user.role !== 'Trippee') {
      return (
        <NavLink to='/createtrip'>
          <Box dir='col' align='center' width={286} height={330} id='create-trip' className='trip-card'>
            <div className='create-trip-words h3'>Create a trip</div>
            <img src={createtrip} alt='green circle with a plus sign' />
          </Box>
        </NavLink>
      );
    } else {
      return null;
    }
  }

  renderMyTrips = () => {
    let myTrips = (
      <Box dir='row' align='center'>
        <img src={sadTree} alt='no trips found' />
        <Queue size={50} />
        <Box dir='col' width={400}>
          <Text type='h2' color='gray3'>Ready to Lead?</Text>
          <Stack size={50} />
          <div className='gray thin p1'>
            Only approved DOC leaders can create trips. Existing leaders should update the DOC Leadership field on their profiles to gain access. If you are interested in becoming a leader, visit: https://outdoors.dartmouth.edu/doc/becomeleader.html
          </div>
        </Box>
        <Queue size={100} />
        <div className='doc-button' onClick={() => this.props.history.push('/all-trips')} role='button' tabIndex={0}>Explore trips</div>
      </Box>
    );
    if (this.props.myTrips.length !== 0) {
      let sortedTrips = this.props.myTrips.sort(utils.trips.compareTripStartDates).filter(trip => !utils.dates.inThePast(trip.startDateAndTime));
      if (this.state.seeTripsImLeading) {
        sortedTrips = sortedTrips.filter(trip => utils.trips.determineRoleOnTrip(this.props.user, trip) === 'LEADER');
      }
      if (this.state.seePastTrips) {
        sortedTrips = sortedTrips.concat(this.props.myTrips.filter(trip => utils.dates.inThePast(trip.startDateAndTime)));
      }
      myTrips = sortedTrips.map((trip) => {
        return (
          <React.Fragment key={trip._id}>
            <TripCard type='large' trip={trip} displayInfoBadges user={this.props.user} displayDescription onClick={() => this.props.history.push(`/trip/${trip._id}`)} />
            <Queue size={45} />
          </React.Fragment>
        );
      });
    }
    return myTrips;
  }

  renderMyVehicleRequests = () => {
    if (this.props.myVehicleReqs.length === 0) {
      return (
        <div className='gray thin p1'>
          Your vehicle requests will appear here. Only OPO certified drivers can request vehicles.
          Certified drivers should update the Driver Certifications field on their profiles to gain driver access.
        </div>
      );
    } else {
      return (
        <Table className='doc-table' responsive='lg' hover>
          <thead>
            <tr>
              <th>Number</th>
              <th>Date</th>
              <th>Type</th>
              <th>Details</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.myVehicleReqs.map((vehicleReq) => {
                const { status } = vehicleReq;
                let reqTitle = '';
                let reqLink = '';
                let earliest = null;
                let latest = null;
                if (vehicleReq.requestType === 'TRIP') {
                  reqTitle = vehicleReq.associatedTrip.title;
                  reqLink = `/trip/${vehicleReq.associatedTrip._id}`;
                  earliest = `${utils.dates.formatDate(new Date(vehicleReq.associatedTrip.startDateAndTime))}@${utils.dates.formatTime(new Date(vehicleReq.associatedTrip.startDateAndTime))}`;
                  latest = `${utils.dates.formatDate(new Date(vehicleReq.associatedTrip.endDateAndTime))}@${utils.dates.formatTime(new Date(vehicleReq.associatedTrip.endDateAndTime))}`;
                } else if (vehicleReq.requestType === 'SOLO') {
                  const calc = constants.calculateVehicleRequestDateRange(vehicleReq);
                  earliest = `${utils.dates.formatDate(new Date(calc.earliest))}@${utils.dates.formatTime(new Date(calc.earliest))}`;
                  latest = `${utils.dates.formatDate(new Date(calc.latest))}@${utils.dates.formatTime(new Date(calc.latest))}`;
                  reqTitle = vehicleReq.requestDetails;
                  reqLink = `/vehicle-request/${vehicleReq._id}`;
                }
                return (
                  <tr key={vehicleReq._id} onClick={() => window.open(`${constants.ROOT_URL}${reqLink}`, '__blank')}>
                    <td className='p2'>{vehicleReq.number}</td>
                    <td className='p2'>{earliest}</td>
                    <td className='p2'>{vehicleReq.requestType === 'SOLO' ? 'Not for trip' : 'For a trip'}</td>
                    <td className='p2'>{vehicleReq.requestType === 'SOLO' ? vehicleReq.requestDetails : `Trip #${vehicleReq.associatedTrip.number}: ${vehicleReq.associatedTrip.title}`}</td>
                    <td><Badge type={status} size={36} /></td>
                  </tr>
                );
              })
            }
          </tbody>
        </Table>
      );
    }
  }

  render() {
    if (this.state.ready) {
      return (
        <Box id='my-trips-page' dir='col'>
          <Stack size={100} />
          <Box className='doc-card' dir='row' pad={45}>
            <Text type='h1'>Your upcoming trips</Text>
            <Queue expand />
            <Toggle
              id='see-trips-im-leading-toggle'
              label="Trips I'm leading"
              value={this.state.seeTripsImLeading}
              onChange={() => this.setState((prevState) => { return { seeTripsImLeading: !prevState.seeTripsImLeading }; })}
              disabled={false}
            />
            <Queue size={18} />
            <Toggle
              id='see-past-trips-toggle'
              label='See past trips'
              value={this.state.seePastTrips}
              onChange={() => this.setState((prevState) => { return { seePastTrips: !prevState.seePastTrips }; })}
              disabled={false}
            />
          </Box>
          <Stack size={35} />
          <Box id='my-trips-tiles-container'>
            <Box id='my-trips-tiles' className='no-scroll-bar'>
              <Queue size={20} />
              {this.renderCreateTrip()}
              {this.props.user.role !== 'Trippee' ? <Queue size={45} /> : null}
              {this.renderMyTrips()}
              <Queue size={300} />
            </Box>
            <div id='my-trip-tiles-blur' />
          </Box>
          <Stack size={85} />
          {this.props.user.driver_cert || this.props.user.trailer_cert
            ? (
              <Box dir='col' pad={45} className='doc-card'>
                <Box dir='row' justify='between' align='center'>
                  <Text type='h1'>Pending V-Requests</Text>
                  {/* <Toggle
                    id='see-past-requests-toggle'
                    label='See past requests'
                    value={this.state.seePastRequests}
                    onChange={() => this.setState((prevState) => { return { seePastRequests: !prevState.seePastRequests }; })}
                    disabled={false}
                  /> */}
                  <input
                    name='searchPending'
                    placeholder='Search pending requests'
                    value={this.state.searchRequestTerm}
                    onChange={this.onSearchRequestTermChange}
                    className='databox-heading-search field'
                  />
                </Box>
                <Stack size={25} />
                {this.renderMyVehicleRequests()}
                <Stack size={25} />
                <Box dir='row' justify='end'>
                  <div className='doc-button hollow' onClick={() => this.props.history.push('/vehicle-calendar')} role='button' tabIndex={0}>Vehicle calendar</div>
                  <Queue size={25} />
                  <div className='doc-button' onClick={() => { this.props.history.push('/vehicle-request'); window.scroll(0, 0); }} role='button' tabIndex={0}>Request vehicle</div>
                </Box>
              </Box>
            )
            : null
          }
          <Stack size={100} />
        </Box>
      );
    } else {
      return (<DOCLoading type='doc' height='150' width='150' measure='px' />);
    }
  }
}

const mapStateToProps = state => (
  {
    myTrips: state.trips.myTrips,
    myVehicleReqs: state.trips.myVehicleReqs,
    user: state.user.user,
  }
);


export default withRouter(connect(mapStateToProps, { getMyTrips, appError })(MyTrips)); // connected component
