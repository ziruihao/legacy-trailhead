/* eslint-disable */
/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string'
import { signIn, signOut, casAuthed, getUser } from '../../actions';
import * as constants from '../../constants';
import './gateway.scss';
class Gateway extends Component {
  componentWillMount() {
    const casValues = queryString.parse(this.props.location.search);
    console.log(casValues);
    if (casValues.token) {
      this.props.casAuthed(casValues.token, this.props.history);
    }
  }

  signInAndThenLoadData = (email, password) => {
    this.props.signIn(email, password, this.props.dataLoader);
  }

  fakeSignIn = (type) => {
    switch(type) {
      case 'cas':
        window.location = (`${constants.BACKEND_URL}/signin-cas`);
      case 'opo':
        this.signInAndThenLoadData('opo@dartmouth.edu', 'opo');
        break;
      case 'leader':
        this.signInAndThenLoadData('leader@dartmouth.edu', 'leader');
        break;
      case 'trippee1':
        this.signInAndThenLoadData('trippee1@dartmouth.edu', 'trippee1');
        break;
      case 'trippee2':
        this.signInAndThenLoadData('trippee2@dartmouth.edu', 'trippee2');
        break;
      case 'trippee3':
        this.signInAndThenLoadData('trippee3@dartmouth.edu', 'trippee3');
        break;
      default:
        this.signInAndThenLoadData('opo@dartmouth.edu', 'opo');
    }
  }

  renderAuthOptions = () => {
    if (this.props.authenticated) {
      return(<button className="signup-button" onClick={() => this.props.history.push('/')}>Let's Go!</button>);
    }
    else {
      return(
        <div style={{display: 'flex'}}>
          <button className="signup-button" onClick={() => this.fakeSignIn('cas')}>Login via CAS</button>
          <button className="signup-button" onClick={() => this.fakeSignIn('opo')}>OPO</button>
          <button className="signup-button" onClick={() => this.fakeSignIn('leader')}>Leader</button>
          <button className="signup-button" onClick={() => this.fakeSignIn('trippee1')}>Trippee 1</button>
          <button className="signup-button" onClick={() => this.fakeSignIn('trippee2')}>Trippee 2</button>
          <button className="signup-button" onClick={() => this.fakeSignIn('trippee3')}>Trippee 3</button>
        </div>
      )
    }
  }

  render() {
    if (true) {
      return (
        <div id="landing-page">
          <div className="main1">
            <div className="home-text">
              <p>
                {
                  this.props.authenticated
                    ? `You're logged in as a test ${!this.props.user ? 'loading' : this.props.user.role}.`
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
      return <div>loading2</div>
    }
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
    user: state.user.user,
  };
};

export default withRouter(connect(mapStateToProps, { signIn, signOut, casAuthed, getUser })(Gateway));
