import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import {isOnTrip, fetchTrip } from '../actions';
import '../styles/card-style.scss';

const getCoLeaders = (leaders) => {
  let coleaders = '';
  leaders.forEach((leader, index) => {
    if (index !== 0) {
      coleaders += `${leader.name}, `;
    }
  });
  coleaders = coleaders.substring(0, coleaders.length - 2);
  coleaders = coleaders.length === 0 ? 'None' : coleaders;
  return coleaders;
};
const formatDate = (date, time) => {
  let timeString = '';
  const rawDate = new Date(date);
  const dateString = rawDate.toString();
  timeString = `${dateString.slice(0, 3)},${dateString.slice(3, 10)}`;
  const splitTime = time.split(':');
  splitTime.push('am');
  if (splitTime[0] > 12) {
    splitTime[0] -= 12;
    splitTime[2] = 'pm';
  }
  timeString = `${timeString}, ${splitTime[0]}:${splitTime[1]}${splitTime[2]}`;
  return timeString;
};
class TripDetailsModal extends Component{
    constructor(props){
        super(props);
    }
    async componentDidMount() {
        if (!this.props.authenticated) {
          alert('Please sign in/sign up to view this page');
          this.props.history.push('/');
        }
      }
      
    render(){
      return(     

            <div className="trip-details-modal">
              <div className="trip-details-close-button">
                <i className="material-icons close-button" onClick={this.props.closeModal} role="button" tabIndex={0}>close</i>
              </div>
              <div className="trip-details-content">
              
                <h1 className="trip-title">{this.props.trip.title}</h1>
                <div className="trip-club-container">
                  <span className="trip-club">{this.props.trip.club.name}</span>
                </div>
        
                <div className="trip-description">
                  <p>
                    {this.props.trip.description}
                  </p>
                </div>
        
                <div className="trip-detail">
                  <div className="detail-row">
                    <span className="detail-left">Start</span>
                    <span className="detail-right">{formatDate(this.props.trip.startDate, this.props.trip.startTime)}</span>
                  </div>
                  <hr className="detail-line" />
        
                  <div className="detail-row">
                    <span className="detail-left">End</span>
                    <span className="detail-right">{formatDate(this.props.trip.endDate, this.props.trip.endTime)}</span>
                  </div>
                  <hr className="detail-line" />
        
                  <div className="detail-row">
                    <span className="detail-left">Pickup</span>
                    <span className="detail-right">{this.props.trip.pickup}</span>
                  </div>
                  <hr className="detail-line" />
        
                  <div className="detail-row">
                    <span className="detail-left">Dropoff</span>
                    <span className="detail-right">{this.props.trip.dropoff}</span>
                  </div>
                  <hr className="detail-line" />
        
                  <div className="detail-row">
                    <span className="detail-left">Destination</span>
                    <span className="detail-right">{this.props.trip.location}</span>
                  </div>
                </div>
        
                <div className="trip-detail">
                  <div className="detail-row">
                    <span className="detail-left">Leader</span>
                    <span className="detail-right">{this.props.trip.leaders[0].name}</span>
                  </div>
                  <hr className="detail-line" />
        
                  <div className="detail-row">
                    <span className="detail-left">Co-Leader(s)</span>
                    <span className="detail-right">{getCoLeaders(this.props.trip.leaders)}</span>
                  </div>
                  <hr className="detail-line" />
        
                  <div className="detail-row">
                    <span className="detail-left">Experience Needed?</span>
                    <span className="detail-right">{this.props.trip.experienceNeeded ? 'Yes' : 'No'} </span>
                  </div>
                  <hr className="detail-line" />
        
                  <div className="detail-row">
                    <span className="detail-left">Subclub</span>
                    <span className="detail-right">{this.props.trip.club.name}</span>
                  </div>
                  <hr className="detail-line" />
        
                  <div className="detail-row">
                    <span className="detail-left">Cost</span>
                    <span className="detail-right">${this.props.trip.cost}</span>
                  </div>
                </div>
                </div>

                </div>
        
            
        );


        
    }


}
// connects particular parts of redux state to this components props
const mapStateToProps = state => (
    {
      isUserOnTrip: state.trips.isUserOnTrip,
      authenticated: state.auth.authenticated,
      user: state.user,
    }
  );
export default withRouter(connect(mapStateToProps, { fetchTrip, isOnTrip })(TripDetailsModal)); // connected component
