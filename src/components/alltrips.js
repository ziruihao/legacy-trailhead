import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchTrips } from '../actions';

class AllTrips extends Component {
  componentDidMount(props) {
    this.props.fetchTrips();
  }

  renderTrips() {
    const trips =
      this.props.trips.map((trip, id) => {
        return (
          <a href={`/alltrips/${trip.id}`}>
            <div>
              <h1>{trip.title}</h1>
            </div>
          </a>
        );
      });
    return trips;
  }

  render() {
    return (
      <div>
        <h1>All Trips</h1>
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
