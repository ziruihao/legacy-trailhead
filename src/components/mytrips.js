/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { getMyTrips } from '../actions';
import '../styles/card-style.scss';

import createtrip from "../img/createtrip.svg"

class MyTrips extends Component {
  componentDidMount(props) {
    this.props.getMyTrips();
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
    return(
      <div className="card text-center card-trip margins" >
        <div className = "card-body" id = "create-trip">
          <p className = "create-trip-words">create a trip</p>
          <img src = {createtrip} alt = "green circle with a plus sign"/>
        </div>
      </div>
    );
  }
  renderMyVehicles = () => {
    return(
      <div className = "vehicles">
        filler words filler words filler words filler words
      </div>
    );

  }

  renderMyTrips = () => {  
    let myTrips = <p>Trips you sign up for will appear here!</p>;
    const sortedTrips = this.props.myTrips.sort(this.compareStartDates);
    myTrips = sortedTrips.map((trip, id) => {
      let card_id = trip.club.name;
      if(card_id==="Cabin and Trail") card_id = "cnt";
      if(card_id==="Women in the Wilderness") card_id = "wiw";
      if(card_id==="Surf Club") card_id = "surf";
      if(card_id==="Mountain Biking") card_id = "dmbc";
      if(card_id==="Winter Sports") card_id = "wsc";

      //TODO: try to get bait and bullet logo 
      if(trip.club.name === 'Bait and Bullet' || trip.club.name === 'Other' ) card_id = "doc";
      let isLeading = false;
      trip.leaders.forEach((leaderId) => {
        if (leaderId === this.props.user.id) {
          isLeading = true;
        }
      });
      if (isLeading) {
        return (
          <div key={trip.id} className="card text-center card-trip margins">
            <NavLink to={`/trip/${trip.id}`}>
              <div className="card-body" id = {card_id} >
                <h2 className="card-title">(L) {trip.title}</h2>
                <p className="card-text">{trip.club ? trip.club.name : ''}</p>
                <p className="card-text">{this.formatDate(trip.startDate)} - {this.formatDate(trip.endDate)}</p>
                <p className="card-club">{trip.club ? trip.club.name : ''}</p>
              </div>
            </NavLink>
          </div>
        );
      } else {
        return (
          <div key={trip.id} className="card text-center card-trip margins" >
            <NavLink to={`/trip/${trip.id}`}>

            <div className="card-body" id = {card_id}>
              <h5 className="card-title">{trip.title}</h5>
              <p className="card-text">{trip.club ? trip.club.name : ''}</p>
              <p className="card-text">{this.formatDate(trip.startDate)} - {this.formatDate(trip.endDate)}</p>
              <p className="card-club">{trip.club ? trip.club.name : ''}</p>

            </div>
            </NavLink>
          </div>
        );
      }
    });
    return myTrips;
  }

  render() {
    return (
      <div className="tile-box">
        <h1 className="mytrips-header">Leader Dashboard</h1>
        <h2 className="mytrips-sub-header">Upcoming trips as a leader</h2>
        <div className="box">
          {this.renderMyTrips()}
          <NavLink className="create-trip-link" to="/createtrip">
            {this.renderCreateTrip()}
          </NavLink>
        </div>
        <h2 className="mytrips-sub-header"> Upcoming vehicle requests</h2>
        <NavLink className="btn btn-primary">Request vehicle</NavLink>
        <div className="box">
          {this.renderMyVehicles()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    myTrips: state.trips.myTrips,
    user: state.user,
  }
);


export default withRouter(connect(mapStateToProps, { getMyTrips })(MyTrips)); // connected component
