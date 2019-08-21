/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
<<<<<<< HEAD
import {signIn, signOut, authed, getUser } from '../actions';
import DocLogo from '../img/DOC-log.svg';
=======
import { signOut } from '../actions';
>>>>>>> cd664144cef2d1f035a299cd3490db10cd9d2d1e
import '../styles/homepage-style.scss';
import SignUp from './signup';
class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){
    let url = window.location.href;
    if(url.includes("?") & url.includes("&")){
      //snag the jwt token returned by the server
      let token = url.substring(url.indexOf("?")+1, url.indexOf("&"));
      let id = url.substring(url.indexOf("&")+1, url.length)
      this.props.authed(token, id, this.props.history);
      this.props.getUser();      

    }

<<<<<<< HEAD
  }


  render() {
      if(this.props.user.name === ""){
        return(
          <SignUp id = {this.props.user.id}/>
        );

      }else{
        let buttons = null;
        if (this.props.authenticated) {
          buttons = <span />;
        } else{
          buttons = (
            <div className="two-buttons">
              <button className="log-in" onClick = {() => this.props.signIn(this.props.history)}>Let's Go</button>
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
     
  
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
    role: state.user.role,
    user: state.user,

  };
};

export default withRouter(connect(mapStateToProps, { signIn,signOut,authed,getUser})(Homepage));
