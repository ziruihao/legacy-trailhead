import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { getMyTrips } from '../actions';

class MyTrips extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(props) {
    this.props.getMyTrips();
  }

  renderMyTrips = () => {
    const myTrips =
      this.props.myTrips.map((trip, id) => {
        return (
          <div key={trip.id}>
            <a href={`/trip/${trip.id}`}>
              <div className="myTrip">
                <h1>{trip.title}</h1>
                <p>{trip.club}</p>
                <p>{trip.date}</p>
              </div>
            </a>
          </div>
        );
      });
    return myTrips;
  }

  render() {
    console.log(this.props.myTrips);
    return (
      <div className="myTrips">
        <p>Coming soon: Will show all trips the user is signed up for, and maybe taken </p>
        <NavLink to="/">
          <button>Home</button>
        </NavLink>
        {this.renderMyTrips()}
      </div>
    );
  }
}
const mapStateToProps = state => (
  {
    myTrips: state.trips.myTrips,
  }
);
export default withRouter(connect(mapStateToProps, { getMyTrips })(MyTrips)); // connected component
