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
  // componentDidMount() {
  //   const values = queryString.parse(this.props.location.search);
  //   if (!this.props.authenticated) {
  //     if (values.token) {
  //       this.props.authed(values.token, values.userId, this.props.history);
  //     } else {
  //       this.props.signIn();
  //     }
  //   } else {
  //     this.props.history.push('/alltrips');
  //   }
  // }

  fakeSignIn = (type) => {
    switch(type) {
      case 'opo':
        this.props.signIn('opo', 'opo');
        break;
      case 'leader':
        this.props.signIn('leader', 'leader');
        break;
      case 'trippee':
        this.props.signIn('trippee', 'trippee');
        break;
      default:
        this.props.signIn('opo', 'opo');
    }
  }

  renderAuthOptions = () => {
    if (this.props.authenticated) {
      return(<button className="signup-button" onClick={() => this.props.history.push('/alltrips')}>Let's Go!</button>);
    }
    else {
      return(
        <div style={{display: 'flex'}}>
          <button className="signup-button" onClick={() => this.fakeSignIn('opo')}>OPO</button>
          <button className="signup-button" onClick={() => this.fakeSignIn('leader')}>Leader</button>
          <button className="signup-button" onClick={() => this.fakeSignIn('trippee')}>Trippee</button>
        </div>
      )
    }
  }

  render() {
    if (this.props.user) {
      return (
        <div id="landing-page">
          <div className="main1">
            <div className="home-text">
              <p>
                {
                  this.props.authenticated
                    ? `You're logged in as a test ${this.props.user.role}.`
                    : 'Hello there! Click the options below to login as test users of the following kind.'
                }
              </p>
            </div>
            <div className="homepage-button">
              {this.renderAuthOptions()}
            </div>
          </div>
        </div>
      )
    } else {
      return <div>loading</div>
    }

  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
    user: state.user.user,
  };
};

export default withRouter(connect(mapStateToProps, { signIn, signOut, authed, getUser })(Homepage));
