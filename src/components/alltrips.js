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
          <div className="col-md-4" key={trip.id}>
            <div className="card mb-4 box-shadow card-trip">
              <NavLink to={`/trip/${trip.id}`}>
                <div className="card-body">
                  <h1 className="card-title">{trip.title}</h1>
                  <p className="card-text">{trip.club}</p>
                  <p className="card-text">{`${new Date(trip.startDate).toLocaleDateString('en-US')}-${new Date(trip.endDate).toLocaleDateString('en-US')}`}</p>
                </div>
              </NavLink>
            </div>
          </div>
        );
      });
    return trips;
  }

  render() {
    return (
      <div className="container">
        <h1>All Trips</h1>
        <div className="row">
          {this.renderTrips()}
        </div>
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
