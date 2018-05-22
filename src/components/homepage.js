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
        <div id="three-buttons">
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
          </nav>
          <div>Signed In</div>
          <button onClick={() => this.props.signOut(this.props.history)}>Sign Out</button>
        </div>
      );
    } else {
      buttons = (
        <div id="two-buttons">
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
      <div id="main-buttons">
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
