import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, withRouter } from 'react-router-dom';
import DOCLoading from '../doc-loading';
import TripCard from '../trip-card';
import { getMyTrips } from '../../actions';
import './my-trips.scss';
import './mytrips-style.scss';
import createtrip from './createtrip.svg';
import Badge from '../badge';

class MyTrips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
    };
  }

  componentDidMount(props) {
    this.props.getMyTrips()
      .then(() => {
        this.setState({ ready: true });
      });
  }

  formatDate = (date) => {
    // date fix adapted from https://stackoverflow.com/questions/7556591/javascript-date-object-always-one-day-off/31732581
    if (!date) {
      return '';
    }
    return new Date(date.replace(/-/g, '/').replace(/T.+/, '')).toLocaleDateString('en-US');
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
        <span className="mytrips-help-text">
          Trips you lead or sign up for will appear here. Only OPO approved club leaders can create trips.
          Club leaders should update the DOC Leadership field on their profiles to gain leader access.
        </span>
      )
      : null;
    if (this.props.myTrips.length !== 0) {
      const sortedTrips = this.props.myTrips.sort(this.compareStartDates);
      myTrips = sortedTrips.map((trip) => {
        return (
          <TripCard key={trip._id} trip={trip} user={this.props.user} />
        );
      });
    }
    return myTrips;
  }

  renderMyVehicleRequests = () => {
    if (this.props.myVehicleReqs.length === 0) {
      return (
        <span className="mytrips-help-text">
          Your vehicle requests will appear here. Only OPO certified drivers can request vehicles.
          Certified drivers should update the Driver Certifications field on their profiles to gain driver access.
        </span>
      );
    } else {
      return this.props.myVehicleReqs.map((vehicleReq) => {
        const { status } = vehicleReq;
        let reqTitle = '';
        let reqLink = '';
        if (vehicleReq.requestType === 'TRIP') {
          reqTitle = vehicleReq.associatedTrip.title;
          reqLink = `/trip/${vehicleReq.associatedTrip._id}`;
        } else if (vehicleReq.requestType === 'SOLO') {
          reqTitle = vehicleReq.requestDetails;
          reqLink = `/vehicle-request/${vehicleReq._id}`;
        }
        return (
          <div key={vehicleReq._id} className="mytrips-vehicle-req">
            {/* <div className="mytrips-status-badge">
              <img className="status-badge" src={this.badges[status]} alt={`${status}_badge`} />
            </div> */}
            <Badge type={status} />
            <div className="mytrips-req-header-and-status">
              <Link to={reqLink} className="mytrips-req-header">{reqTitle}</Link>
              <em className="mytrips-req-status">{status}</em>
            </div>
          </div>
        );
      });
    }
  }

  render() {
    if (this.state.ready) {
      return (
        <div id="my-trips-page" className="center-view spacy">
          <div className="">
            <div className="doc-h1">Your upcoming trips</div>
          </div>
          <div id="my-trips-tiles">
            {this.renderCreateTrip()}
            {this.renderMyTrips()}
          </div>
          <div className="mytrips-vehicle-reqs-container">
            <div className="mytrips-flex-start">
              <h2 className="mytrips-sub-header">Your upcoming vehicle requests</h2>
            </div>
            <div className="mytrips-vehicle-reqs">
              {this.renderMyVehicleRequests()}
            </div>
            <div className="mytrips-request-and-calendar-links">
              {this.props.user.driver_cert !== null
                ? <Link to="/vehicle-request" className="mytrips-request-button">Request vehicle</Link>
                : null}
              {this.props.user.driver_cert !== null || this.props.user.role !== 'Trippee'
                ? <Link to="/vehicle-calendar" className="mytrips-calendar-link" target="_blank">View vehicle calendar</Link>
                : null}
            </div>
          </div>
        </div>
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


export default withRouter(connect(mapStateToProps, { getMyTrips })(MyTrips)); // connected component
