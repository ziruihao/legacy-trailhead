/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import {signIn, signOut, authed } from '../actions';
import DocLogo from '../img/DOC-log.svg';
import '../styles/homepage-style.scss';

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
    };
  }

  componentDidMount(){
    let url = window.location.href;
    if(url.includes("?") & url.includes("&")){
      //snag the jwt token returned by the server
      let token = url.substring(url.indexOf("?")+1, url.indexOf("&"));
      let id = url.substring(url.indexOf("&")+1, url.length)
      console.log(token);
      this.props.authed(token, id, this.props.history);
      this.setState({
        auth: true,
      })
    }

  }


  render() {
    let buttons = null;
    if (this.props.authenticated || this.state.auth) {
      buttons = <span />;
    } else {
      buttons = (
        <div className="two-buttons">
          {/* <NavLink to="/signin">
            <button className="log-in">Log In</button>
          </NavLink> */}
          <button className="log-in" onClick = {() => this.props.signIn(this.props.history)}>Log In</button>

          <NavLink to="/signup">
            <button className="sign-up">Sign Up</button>
          </NavLink>
        </div>
      );
    }

    return (
      <div id="landing-page">
        <div id="doc-icon">
          <img src={DocLogo} alt="DOC Logo" />
        </div>
        <div className="main1">
          <div className="home-text">
            <h1> Stay Crunchy. </h1>
            <p>
              {
                this.props.authenticated
                  ? 'Join or create a trip of your own!'
                  : 'Hello there! This is the Dartmouth Outing Club (DOC) Website. Here, you can view, sign up for, or form trips.'
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

export default withRouter(connect(mapStateToProps, { signIn,signOut,authed  })(Homepage));
