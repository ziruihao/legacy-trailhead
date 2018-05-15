import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchTrips } from '../actions';

class AllTrips extends Component {
  componentDidMount(props) {
    // this.props.fetchTrips(); TODO
  }

  renderTrips = () => {
    // const trips =
    //   this.props.trips.map((trip, id) => {
    //     return (
    //       <a href={`/alltrips/${trip.id}`}>
    //         <div>
    //           <h1>{trip.title}</h1>
    //         </div>
    //       </a>
    //     );
    //   });
    // return trips;  TODO
    return (
      <div>
        <h2>Trip 1</h2>
        <p>Info about Trip 1</p>
        <h2>Trip 2</h2>
        <p>Info about Trip 2</p>
        <h2>Trip 3</h2>
        <p>Info about Trip 3</p>
      </div>
    );
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

// const mapStateToProps = state => (
//   {
//     trips: state.trips.all,
//   }
// ); TODO

export default withRouter(connect(null, { fetchTrips })(AllTrips)); // connected component
