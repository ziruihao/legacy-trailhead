import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { fetchTrips, getClubs } from '../actions';
import '../styles/alltrips-style.scss';


class CarCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(props) {
    if (!this.props.authenticated || this.props.role !== 'opo') {
      alert('Please sign into OPO account to view this page');
      this.props.history.push('/');
    }
    this.props.fetchTrips();
    this.props.getClubs();
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

  renderDropdown = () => {
    const options = this.props.clubs.map((club) => {
      return <option key={club.id} value={club.name}>{club.name}</option>;
    });
    return (
      <select
        name="select"
        className="custom-select all-trips-select"
        defaultValue=""
        onChange={(e) => { this.setState({ club: e.target.value }); }}
      >
        <option key="none" value="">All Clubs</option>
        { options }
      </select>
    );
  }

  renderTrips = () => {
    const sortedTrips = this.props.trips.sort(this.compareStartDates);
    const trips = sortedTrips.filter(trip => this.state.club === '' || trip.club.name === this.state.club).map((trip) => {
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

    if (trips.length === 0) {
      return <div>No upcoming trips for this club</div>;
    }
    return trips;
  }

  render() {
    return (
      <div className="all-trips">
        <h1 className="all-trips-header">All Trips</h1>
        {this.renderDropdown()}
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
    role: state.user.role,
    clubs: state.clubs,
  }
);

export default withRouter(connect(mapStateToProps, { fetchTrips, getClubs })(CarCalendar)); // connected component
