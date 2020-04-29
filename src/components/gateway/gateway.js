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
    if (casValues.token) {
      console.log(casValues.token);
      this.props.casAuthed(casValues.token, this.props.history, this.props.dataLoader);
    }
  }

  signInAndThenLoadData = (email, password) => {
    this.props.signIn(email, password, this.props.dataLoader);
  }

  fakeSignIn = (type) => {
    switch(type) {
      case 'cas':
        window.location = (`${constants.BACKEND_URL}/signin-cas`);
        break;
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
        break;
    }
  }

  renderDevAuthOptions = () => {
    return(
      <div id="landing-card-actions">
        <button className="doc-button" onClick={() => this.fakeSignIn('opo')}>OPO</button>
        <button className="doc-button" onClick={() => this.fakeSignIn('leader')}>Leader</button>
        <button className="doc-button" onClick={() => this.fakeSignIn('trippee1')}>Trippee 1</button>
        <button className="doc-button" onClick={() => this.fakeSignIn('trippee2')}>Trippee 2</button>
        <button className="doc-button" onClick={() => this.fakeSignIn('trippee3')}>Trippee 3</button>
      </div>
    )
  }

  renderAuthOptions = () => {
    return(
      <div id="landing-card-actions">
        <button className="doc-button" onClick={() => this.fakeSignIn('cas')}>Login via CAS</button>
      </div>
    )
  }

  render() {
      return (
        <div id="landing-page">
          <div id="landing-card">
              <div id="landing-card-message">
                <div className="h1">Welcome there!</div>
                <div className="p1">
                  {
                    this.props.authenticated
                      ? `You're logged in as a test ${!this.props.user ? 'loading' : this.props.user.role}.`
                      : 'Hello there! Click the options below to login as test users of the following kind.'
                  }
                </div>
              </div>
              {this.renderDevAuthOptions()}
              {this.renderAuthOptions()}
          </div>
        </div>
      )
  }
}


export default withRouter(connect(null, { signIn, signOut, casAuthed, getUser })(Gateway));
