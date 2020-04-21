/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { getMyTrips } from '../actions';
import './trips/trip-card.scss';
import '../styles/mytrips-style.scss';
import createtrip from "../img/createtrip.svg";
import pendingBadge from '../img/pending_badge.svg';
import approvedBadge from '../img/approved_badge.svg';
import deniedBadge from '../img/denied_badge.svg';
import loadingGif from '../img/loading-gif.gif';

class MyTrips extends Component {
  badges = {
    pending: pendingBadge,
    approved: approvedBadge,
    denied: deniedBadge,
  };

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
    }
  }

  componentDidMount(props) {
    this.props.getMyTrips()
      .then(() => {
        this.setState({ ready: true });
      })
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
        <NavLink className="create-trip-link" to="/createtrip">
          <div className="card text-center card-trip margins" >
            <div className="card-body" id="create-trip">
              <p className="create-trip-words">create a trip</p>
              <img src={createtrip} alt="green circle with a plus sign" />
            </div>
          </div>
        </NavLink>
      );
    } else {
      return null;
    }
  }

  renderMyTrips = () => {
    let myTrips = this.props.user.role === 'Trippee'
      ? <span className="mytrips-help-text">
        Trips you lead or sign up for will appear here. Only OPO approved club leaders can create trips.
        Club leaders should update the 'DOC Leadership' field on their profiles to gain leader access.
        </span>
      : null;
    if (this.props.myTrips.length !== 0) {
      const sortedTrips = this.props.myTrips.sort(this.compareStartDates);
      myTrips = sortedTrips.map((trip, id) => {
        let card_id = trip.club.name;
        if (card_id === "Cabin and Trail") card_id = "cnt";
        if (card_id === "Women in the Wilderness") card_id = "wiw";
        if (card_id === "Surf Club") card_id = "surf";
        if (card_id === "Mountain Biking") card_id = "dmbc";
        if (card_id === "Winter Sports") card_id = "wsc";

  
        if(trip.club.name !== ('Ledyard' || 'Mountaineering' || 'cnt'|| 'wiw' || 'Woodsmen' || 'surf' || 'dmbc' || 'wsc')) card_id = "doc";
        let isLeading = false;
        trip.leaders.some((leaderId) => {
          if (leaderId === this.props.user.id) {
            isLeading = true;
          }
          return leaderId === this.props.user.id;
        });
        return (
          <div key={trip.id} className="card text-center card-trip margins">
            <NavLink to={`/trip/${trip.id}`}>
              <div className="card-body" id={card_id} >
                <h2 className="card-title">{isLeading ? '(L)' : null} {trip.title}</h2>
                <p className="card-text">{trip.club ? trip.club.name : ''}</p>
                <p className="card-text">{this.formatDate(trip.startDate)} - {this.formatDate(trip.endDate)}</p>
                <p className="card-club">{trip.club ? trip.club.name : ''}</p>
              </div>
            </NavLink>
          </div>
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
          Certified drivers should update the 'Driver Certifications' field on their profiles to gain driver access.
        </span>
      )
    } else {
      return this.props.myVehicleReqs.map((vehicleReq) => {
        const status = vehicleReq.status;
        let reqTitle = '';
        let reqLink = '';
        if (vehicleReq.requestType === 'TRIP') {
          reqTitle = vehicleReq.associatedTrip.title;
          reqLink = `/trip/${vehicleReq.associatedTrip.id}`;
        } else if (vehicleReq.requestType === 'SOLO') {
          reqTitle = vehicleReq.requestDetails;
          reqLink = `/vehicle-request/${vehicleReq.id}`;
        }
        return (
          <div key={vehicleReq.id} className="mytrips-vehicle-req">
            <div className="mytrips-status-badge">
              <img className="status-badge" src={this.badges[status]} alt={`${status}_badge`} />
            </div>
            <div className="mytrips-req-header-and-status">
              <Link to={reqLink} className="mytrips-req-header">{reqTitle}</Link>
              <em className="mytrips-req-status">{status}</em>
            </div>
          </div>
        )
      });
    }
  }

  render() {
    if (this.state.ready) {
      return (
        <div className="mytrips-container">
          <div className="mytrips-flex-start">
            <h1 className="mytrips-header">Your Dashboard</h1>
          </div>
          <div className="mytrips-trips-container">
            <div className="mytrips-flex-start">
              <h2 className="mytrips-sub-header">Your upcoming trips</h2>
            </div>
            <div className="mytrips-trips">
              {this.renderMyTrips()}
              {this.renderCreateTrip()}
            </div>
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
                ? < Link to="/vehicle-request" className="mytrips-request-button">Request vehicle</Link>
                : null}
              {this.props.user.driver_cert !== null || this.props.user.role !== 'Trippee'
                ? <Link to="/vehicle-calendar" className="mytrips-calendar-link" target="_blank">View vehicle calendar</Link>
                : null}
            </div>
          </div>
        </div >
      );
    } else {
      return (
        <div>
          <h1>Loading</h1>
          <img src={loadingGif} alt="loading-gif" />
        </div>
      );
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
