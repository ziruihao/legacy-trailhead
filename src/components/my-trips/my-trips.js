import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { Stack, Queue, Divider, Box } from '../layout';
import Toggle from '../toggle';
import DOCLoading from '../doc-loading';
import Badge from '../badge';
import TripCard from '../trip-card';
import * as constants from '../../constants';
import utils from '../../utils';
import { getMyTrips, appError } from '../../actions';
import './my-trips.scss';
import './mytrips-style.scss';
import createtrip from './createtrip.svg';


class MyTrips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      seePastTrips: false,
      seeTripsImLeaing: false,
      seePastRequests: false,
      searchRequestTerm: '',
    };
  }

  componentDidMount(props) {
    this.props.getMyTrips()
      .then(() => {
        this.setState({ ready: true });
      });
  }

  onSearchRequestTermChange = (event) => {
    event.persist();
    this.setState({ searchRequestTerm: event.target.value });
  }

  compareStartDates = (a, b) => {
    const t1 = new Date(a.startDate);
    const t2 = new Date(b.startDate);
    return t1.getTime() - t2.getTime();
  }

  renderCreateTrip = () => {
    if (this.props.user.role !== 'Trippee') {
      return (
        <NavLink id="create-trip" className="trip-card" to="/createtrip">
          <div className="create-trip-words h3">Create a trip</div>
          <img src={createtrip} alt="green circle with a plus sign" />
        </NavLink>
      );
    } else {
      return null;
    }
  }

  renderMyTrips = () => {
    let myTrips = this.props.user.role === 'Trippee'
      ? (
        <div className="gray thin p1">
          Trips you lead or sign up for will appear here. Only OPO approved club leaders can create trips.
          Club leaders should update the DOC Leadership field on their profiles to gain leader access.
        </div>
      )
      : null;
    if (this.props.myTrips.length !== 0) {
      const sortedTrips = this.props.myTrips.sort(this.compareStartDates);
      myTrips = sortedTrips.map((trip) => {
        return (
          <>
            <TripCard key={trip._id} trip={trip} user={this.props.user} onClick={() => this.props.history.push(`/trip/${trip._id}`)} />
            <Queue size={45} />
          </>
        );
      });
    }
    return myTrips;
  }

  renderMyVehicleRequests = () => {
    if (this.props.myVehicleReqs.length === 0) {
      return (
        <div className="gray thin p1">
          Your vehicle requests will appear here. Only OPO certified drivers can request vehicles.
          Certified drivers should update the Driver Certifications field on their profiles to gain driver access.
        </div>
      );
    } else {
      return (
        <Table className="doc-table" responsive="lg" hover>
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
                  earliest = utils.dates.formatDate(new Date(vehicleReq.associatedTrip.startDate));
                  latest = utils.dates.formatDate(new Date(vehicleReq.associatedTrip.endDaate));
                } else if (vehicleReq.requestType === 'SOLO') {
                  const calc = constants.calculateVehicleRequestDateRange(vehicleReq);
                  earliest = utils.dates.formatDate(calc.earliest);
                  latest = utils.dates.formatDate(calc.latest);
                  reqTitle = vehicleReq.requestDetails;
                  reqLink = `/vehicle-request/${vehicleReq._id}`;
                }
                return (
                  <tr key={vehicleReq._id} onClick={() => window.open(`${constants.ROOT_URL}${reqLink}`, '__blank')}>
                    <td className="p2">{vehicleReq.number}</td>
                    <td className="p2">{earliest}</td>
                    <td className="p2">{vehicleReq.requestType === 'SOLO' ? 'Not for trip' : 'For a trip'}</td>
                    <td className="p2">{vehicleReq.requestType === 'SOLO' ? vehicleReq.requestDetails : `Trip #${vehicleReq.associatedTrip.number}: ${vehicleReq.associatedTrip.title}`}</td>
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
        <Box id="my-trips-page" dir="col">
          <Stack size={100} />
          <Box className="doc-card" dir="row" pad={45}>
            <div className="doc-h1">Your upcoming trips</div>
            <Queue expand />
            <Toggle
              id="see-trips-im-leading-toggle"
              label="Trips I'm leading"
              value={this.state.seeTripsImLeaing}
              onChange={() => this.setState((prevState) => { this.props.appError('This feature is under construction!'); return { seeTripsImLeaing: !prevState.seeTripsImLeaing }; })}
              disabled={false}
            />
            <Toggle
              id="see-past-trips-toggle"
              label="See past trips"
              value={this.state.seePastTrips}
              onChange={() => this.setState((prevState) => { this.props.appError('This feature is under construction!'); return { seePastTrips: !prevState.seePastTrips }; })}
              disabled={false}
            />
          </Box>
          <Stack size={35} />
          <Box id="my-trips-tiles-container">
            <Box id="my-trips-tiles" className="no-scroll-bar">
              <Queue size={20} />
              {this.renderCreateTrip()}
              {this.props.user.role !== 'Trippee' ? <Queue size={45} /> : null}
              {this.renderMyTrips()}
              <Queue size={300} />
            </Box>
            <div id="my-trip-tiles-blur" />
          </Box>
          <Stack size={85} />
          {this.props.user.role !== 'Trippee'
            ? (
              <Box dir="col" pad={45} className="doc-card">
                <Box dir="row" justify="between" align="center">
                  <div className="doc-h1">Pending V-Requests</div>
                  <Toggle
                    id="see-past-requests-toggle"
                    label="See past requests"
                    value={this.state.seePastRequests}
                    onChange={() => this.setState((prevState) => { this.props.appError('This feature is under construction!'); return { seePastRequests: !prevState.seePastRequests }; })}
                    disabled={false}
                  />
                  <input
                    name="searchPending"
                    placeholder="Search pending requests"
                    value={this.state.searchRequestTerm}
                    onChange={this.onSearchRequestTermChange}
                    className="databox-heading-search field"
                  />
                </Box>
                <Stack size={25} />
                {this.renderMyVehicleRequests()}
                <Stack size={25} />
                <Box dir="row" justify="end">
                  <div className="doc-button hollow" onClick={() => this.props.history.push('/vehicle-calendar')} role="button" tabIndex={0}>Vehicle calendar</div>
                  <Queue size={25} />
                  <div className="doc-button" onClick={() => { this.props.history.push('/vehicle-request'); window.scroll(0, 0); }} role="button" tabIndex={0}>Request vehicle</div>
                </Box>
              </Box>
            )
            : null
          }
          <Stack size={100} />
        </Box>
      );
    } else {
      return (<DOCLoading type="doc" height="150" width="150" measure="px" />);
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
