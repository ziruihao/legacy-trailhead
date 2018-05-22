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
    const style = { width: '18rem' };
    const myTrips =
      this.props.myTrips.map((trip, id) => {
        return (
          <div key={trip.id} className="card text-center" style={style}>
            <div className="card-body">
              <h5 className="card-title">{trip.title}</h5>
              <p className="card-text">{trip.club}</p>
              <p className="card-text">{trip.date}</p>
              <a href={`/trip/${trip.id}`} className="btn btn-primary">See details</a>
            </div>
          </div>
        );
      });
    return myTrips;
  }

  render() {
    console.log(this.props.myTrips);
    return (
      <div className="card">
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
