/* eslint-disable */
/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string'
import { signIn, signOut, casAuthed, getUser } from '../../actions';
import * as constants from '../../constants';
import './gateway.scss';
import CompleteProfile from './complete-profile';
class Gateway extends Component {
  constructor(props) {
    super(props)
    this.state = {
      incompleteProfile: false,
      token: 'nope',
    }
  }
  componentDidMount() {
    const casValues = queryString.parse(this.props.location.search);
    if (casValues.token) {
      this.setState({token: 'token is there'})
      this.props.casAuthed(casValues.token, this.props.history, this.props.dataLoader).then(completedProfile => {
        if (!completedProfile) this.setState({incompleteProfile: true})
      });
    } else if (this.props.user) {
      this.setState({incompleteProfile: true})
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
        this.signInAndThenLoadData('ziray.hao.22@dartmouth.edu', 'trippee1');
        break;
      case 'trippee2':
        this.signInAndThenLoadData('ziray.hao@dali.dartmouth.edu', 'trippee2');
        break;
      case 'trippee3':
        this.signInAndThenLoadData('zirui.hao@gmail.com', 'trippee3');
        break;
      default:
        break;
    }
  }

  renderDevAuthOptions = () => {
    return(
      <div className="landing-card-actions">
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
      <div className="landing-card-actions">
        <button className="doc-button" onClick={() => this.fakeSignIn('cas')}>Login via CAS</button>
      </div>
    )
  }

  render() {
      return (
        <div id="landing-page">
          {this.props.errorMessage === '' ? <div className="error" /> : <div className="alert alert-danger error">{this.props.errorMessage}</div>}
          {this.state.incompleteProfile ?
            <CompleteProfile></CompleteProfile>
            :
            <div className="landing-card doc-card l">
            <div className="landing-card-message">
              <div className="doc-h1">Welcome there!</div>
              <div className="p1">
                Hello there! Click the options below to login as test users of the following kind. {this.state.token}
              </div>
            </div>
            {this.renderDevAuthOptions()}
            {this.renderAuthOptions()}
        </div>
          }

        </div>
      )
  }
}

const mapStateToProps = (state) => {
  return {
    errorMessage: state.error.errorMessage,
  };
};

export default withRouter(connect(mapStateToProps, { signIn, signOut, casAuthed, getUser })(Gateway));
