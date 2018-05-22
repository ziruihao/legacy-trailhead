import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { signOut } from '../actions';
import '../styles/homepage-style.scss';

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let buttons = null;
    if (this.props.authenticated) {
      buttons = (
        <div className="three-buttons">
          <nav>
            <NavLink to="/alltrips">
              <button>All Trips</button>
            </NavLink>
            <NavLink to="/createtrip">
              <button>Create Trip</button>
            </NavLink>
            <NavLink to="/mytrips">
              <button>My Trips</button>
            </NavLink>
            <NavLink to="/user">
              <button>My Profile</button>
            </NavLink>
          </nav>
          <div>Signed In</div>
          <button onClick={() => this.props.signOut(this.props.history)}>Sign Out</button>
        </div>
      );
    } else {
      buttons = (
        <div className="two-buttons">
          <NavLink to="/signin">
            <button>Sign In</button>
          </NavLink>
          <NavLink to="/signup">
            <button>Sign Up</button>
          </NavLink>
        </div>
      );
    }

    return (
      <div className="main1">
        <div className="home-text">
          <h1> Welcome to Dartmouth Outdoor Club trip planner! </h1>
          <p> Please login or sign-up to find your next outdoor adventure! </p>
        </div>
        { buttons }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
  };
};

export default withRouter(connect(mapStateToProps, { signOut })(Homepage));
