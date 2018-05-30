import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { fetchTrips } from '../actions';
import '../styles/alltrips-style.scss';


class AllTrips extends Component {
  componentDidMount(props) {
    if (!this.props.authenticated) {
      alert('Please sign in/sign up to view this page');
      this.props.history.push('/');
    }
    this.props.fetchTrips();
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

  renderTrips = () => {
    const sortedTrips = this.props.trips.sort(this.compareStartDates);
    const trips =
      sortedTrips.map((trip, id) => {
        return (
          <div className="card all-trips-card text-center card-trip margins">
            <NavLink to={`/trip/${trip.id}`} key={trip.id}>
              <div className="card-body">
                <h2 className="card-title">{trip.title}</h2>
                <p className="card-text">{trip.club ? trip.club.name : ''}</p>
                <p className="card-text">{this.formatDate(trip.startDate)} - {this.formatDate(trip.endDate)}</p>
              </div>
            </NavLink>
          </div>
        );
      });
    return trips;
  }

  render() {
    return (
      <div className="all-trips">
        <h1 className="all-trips-header">All Trips</h1>
        <div className="all-trips-box">
          {this.renderTrips()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    trips: state.trips.all,
    authenticated: state.auth.authenticated,
  }
);

export default withRouter(connect(mapStateToProps, { fetchTrips })(AllTrips)); // connected component
