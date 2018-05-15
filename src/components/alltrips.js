import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchTrips } from '../actions';

class AllTrips extends Component {
  // Fetch posts action
  componentDidMount(props) {
    this.props.fetchTrips();
  }

  // Render each post
  renderPosts() {
    const trips =
      this.props.trips.map((trip, id) => {
        return (
          <a href={`/trips/${trip.id}`}>
            <div>
              <h1>{trip.title}</h1>
            </div>
          </a>
        );
      });
    return trips;
  }

  // Render posts
  render() {
    return (
      <div>
        {this.renderPosts()}
      </div>
    );
  }
}

// States to be called
const mapStateToProps = state => (
  {
    trips: state.trips.all,
  }
);

export default withRouter(connect(mapStateToProps, { fetchTrips })(AllTrips)); // connected component
