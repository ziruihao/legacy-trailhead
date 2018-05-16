import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { signOut } from '../actions';

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
        <div>
          <div>Signed In</div>
          <button onClick={() => this.props.signOut(this.props.history)}>Sign Out</button>
        </div>
      );
    } else {
      buttons = (
        <div>
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
      <div>
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
