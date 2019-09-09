/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import {Modal} from 'react-bootstrap';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import {signIn, signOut, authed, getUser } from '../actions';
import '../styles/homepage-style.scss';
import SignUp from './signup';
class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      continue:false
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

    }else{
      this.props.signIn(this.props.history);
    }
  }

 continue =()=>{
  this.setState({
    continue: true
  });
}

  render() {
    console.log(this.props.user);
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
        
        if (window.innerWidth > 760 || this.state.continue) {
          return (
            <div id="landing-page">
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
         }else{
            return(
            <div>

              <Modal
                      centered
                      show = {true}
                    >

                      <img src="/src/img/confirmCancel.svg" alt="confirm-delete" className="cancel-image" />
                      <div className="cancel-content">
                        <p className="cancel-message">Uh oh! This site is not mobile-friendly. Please view it on a desktop.</p>
                      </div>
                      <button type="submit" className="leader-cancel-button confirm-cancel" onClick={this.continue}>Visit site anyways </button>

                </Modal>           
       </div>);
          }
  
      
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
