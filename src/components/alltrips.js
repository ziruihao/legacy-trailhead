import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { fetchTrips } from '../actions';
import '../styles/alltrips-style.scss';


class AllTrips extends Component {
  componentDidMount(props) {
    this.props.fetchTrips();
  }

  renderTrips = () => {
    const trips =
      this.props.trips.map((trip, id) => {
        return (
          <div key={trip.id}>
            <a href={`/trip/${trip.id}`}>
              <div className="trip">
                <h1>{trip.title}</h1>
                <p>{trip.club}</p>
                <p>{trip.date}</p>
              </div>
            </a>
          </div>
        );
      });
    return trips;
  }

  render() {
    return (
      <div className="trips">
        <h1>All Trips</h1>
        <NavLink to="/">
          <button>All Trips</button>
        </NavLink>
        {this.renderTrips()}
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    trips: state.trips.all,
  }
);

export default withRouter(connect(mapStateToProps, { fetchTrips })(AllTrips)); // connected component
