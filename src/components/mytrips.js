import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { getMyTrips } from '../actions';
import '../styles/mytrips-style.scss';
import '../styles/alltrips-style.scss';

class MyTrips extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(props) {
    if (!this.props.authenticated) {
      alert('Please sign in/sign up to view this page');
      this.props.history.push('/');
    }
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

  renderMyTrips = () => {
    const style = { width: '18rem' };
    let myTrips = <p>Trips you sign up for will appear here!</p>;
    const sortedTrips = this.props.myTrips.sort(this.compareStartDates);
    myTrips =
      sortedTrips.map((trip, id) => {
        let isLeading = false;
        trip.leaders.forEach((leaderId) => {
          if (leaderId === this.props.user.id) {
            isLeading = true;
          }
        });
        if (isLeading) {
          return (
            <div key={trip.id} className="card text-center card-trip margins" style={style}>
              <div className="card-body leading-trip">
                <h5 className="card-title">(L) {trip.title}</h5>
                <p className="card-text">{trip.club ? trip.club.name : ''}</p>
                <p className="card-text">{this.formatDate(trip.startDate)} - {this.formatDate(trip.endDate)}</p>
                <NavLink to={`/trip/${trip.id}`} className="btn btn-primary">See details</NavLink>
              </div>
            </div>
          );
        } else {
          return (
            <div key={trip.id} className="card text-center card-trip margins" style={style}>
              <div className="card-body">
                <h5 className="card-title">{trip.title}</h5>
                <p className="card-text">{trip.club ? trip.club.name : ''}</p>
                <p className="card-text">{this.formatDate(trip.startDate)} - {this.formatDate(trip.endDate)}</p>
                <NavLink to={`/trip/${trip.id}`} className="btn btn-primary">See details</NavLink>
              </div>
            </div>
          );
        }
      });
    return myTrips;
  }

  render() {
    console.log(this.props.myTrips);
    return (
      <div className="container">
        <div className="myTrips">
          <h1 className="mytrips-header">My Trips</h1>
          <div className="myTripsBox">
            {this.renderMyTrips()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    myTrips: state.trips.myTrips,
    authenticated: state.auth.authenticated,
    user: state.user,
  }
);


export default withRouter(connect(mapStateToProps, { getMyTrips })(MyTrips)); // connected component
