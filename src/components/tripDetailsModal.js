import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import {isOnTrip, fetchTrip } from '../actions';



class TripDetailsModal extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }
    async componentDidMount() {
        if (!this.props.authenticated) {
          alert('Please sign in/sign up to view this page');
          this.props.history.push('/');
        }
        return Promise
          .all([
            this.props.isOnTrip(this.props.tripID),
    
            this.props.fetchTrip(this.props.tripID),
    
          ])
          .catch((error) => {
            console.log(error);
          });
      }
    render(){
        
    }


}
// connects particular parts of redux state to this components props
const mapStateToProps = state => (
    {
      trip: state.trips.trip,
      isUserOnTrip: state.trips.isUserOnTrip,
      authenticated: state.auth.authenticated,
      user: state.user,
    }
  );
export default withRouter(connect(mapStateToProps, { fetchTrips, getClubs })(TripDetailsModal)); // connected component
