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

  renderMyTrips = () => {
    const style = { width: '18rem' };
    let myTrips = <p>Trips you sign up for will appear here!</p>;
    myTrips =
      this.props.myTrips.map((trip, id) => {
        return (
          <div key={trip.id} className="card text-center card-trip margins" style={style}>
            <div className="card-body">
              <h5 className="card-title">{trip.title}</h5>
              <p className="card-text">{trip.club ? trip.club.name : ''}</p>
              <p className="card-text">{trip.date}</p>
              <NavLink to={`/trip/${trip.id}`} className="btn btn-primary">See details</NavLink>
            </div>
          </div>
        );
      });
    return myTrips;
  }

  render() {
    console.log(this.props.myTrips);
    return (
      <div className="container">
        <div className="myTrips">
          <h1 className="mytrips-header">My Trips</h1>
          <div className="myTrips">
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
  }
);
export default withRouter(connect(mapStateToProps, { getMyTrips })(MyTrips)); // connected component
