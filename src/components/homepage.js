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
            <button className="log-in">Log In</button>
          </NavLink>
          <NavLink to="/signup">
            <button className="sign-up">Sign Up</button>
          </NavLink>
        </div>
      );
    }

    return (
      <div id="landing-page">
        <div className="main1">
          <div className="home-text">
            <h1>Welcome to the Dartmouth Outing Club website!</h1>
            <p>
              {
                this.props.authenticated
                  ? 'Join or create a trip of your own!'
                  : 'Hello there! Log in to view, sign up for, or create trips. See you in the out o’ doors!'
              }
            </p>
          </div>
          { buttons }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
    role: state.user.role,
  };
};

export default withRouter(connect(mapStateToProps, { signOut })(Homepage));
