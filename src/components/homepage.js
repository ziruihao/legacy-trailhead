/* eslint-disable */
/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string'
import { signIn, signOut, authed, getUser } from '../actions';
import '../styles/homepage-style.scss';

class Homepage extends Component {
  componentDidMount() {
    const values = queryString.parse(this.props.location.search);
    if (!this.props.authenticated) {
      if (values.token) {
        this.props.authed(values.token, values.userId, this.props.history);
      } else {
        this.props.signIn();
      }
    } else {
      this.props.history.push('/alltrips');
    }
  }

  render() {
    return (
      <div id="landing-page">
        <div className="main1">
          <div className="home-text">
            <p>
              {
                this.props.authenticated
                  ? 'Join or create a trip of your own!'
                  : 'Hello there! This is the Dartmouth Outing Club (DOC) Website. Here, you can view, sign up for, or form trips.'
              }
            </p>
          </div>
          <div className="homepage-button">
            {this.props.authenticated
              ? <button className="signup-button" onClick={() => this.props.history.push('/alltrips')}>Let's Go!</button>
              : <button className="signup-button" onClick={() => this.props.signIn(this.props.history)}>Login</button>}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
    role: state.user.role,
    user: state.user,

  };
};

export default withRouter(connect(mapStateToProps, { signIn, signOut, authed, getUser })(Homepage));
