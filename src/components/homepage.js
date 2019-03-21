/* eslint-disable react/button-has-type */
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
      buttons = <span />;
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
          <h1> Welcome to the Dartmouth Outing Club trip planner! </h1>
          <p>
            {
              this.props.authenticated
                ? 'Join or create a trip of your own!'
                : 'Please login or sign-up to find your next outdoor adventure!'
            }
          </p>
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
