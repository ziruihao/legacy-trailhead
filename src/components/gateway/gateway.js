/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { Dropdown } from 'react-bootstrap';
import { signIn, signOut, casAuthed, getUser } from '../../actions';
import { Stack, Queue, Divider, Box } from '../layout';
import CompleteProfile from './complete-profile';
import * as constants from '../../constants';
import './gateway.scss';
import dropdownIcon from '../../img/dropdown-toggle.svg';

class Gateway extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incompleteProfile: false,
    };
  }

  componentDidMount() {
    const casValues = queryString.parse(this.props.location.search);
    if (casValues.token) {
      this.props.casAuthed(casValues.token, this.props.history, this.props.dataLoader).then((completedProfile) => {
        if (!completedProfile) this.setState({ incompleteProfile: true });
      });
    } else if (this.props.user) {
      this.setState({ incompleteProfile: true });
    }
  }

  signInAndThenLoadData = (email, password) => {
    this.props.signIn(email, password, this.props.dataLoader);
  }

  fakeSignIn = (type) => {
    switch (type) {
      case 'cas':
        window.location = (`${constants.BACKEND_URL}/signin-cas`);
        break;
      case 'opo':
        this.signInAndThenLoadData('opo@dartmouth.edu', 'opo');
        break;
      case 'leader':
        this.signInAndThenLoadData('f003mfv@dartmouth.edu', 'leader');
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
    return (
      <Dropdown onSelect={this.fakeSignIn}>
        <Dropdown.Toggle className="field">
          <span className="field-dropdown-bootstrap">Select test user</span>
          <img className="dropdown-icon" src={dropdownIcon} alt="dropdown-toggle" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="field-dropdown-menu">
          <Dropdown.Item eventKey="opo">OPO Staff</Dropdown.Item>
          <Dropdown.Item eventKey="opo">Trip leader</Dropdown.Item>
          <Dropdown.Item eventKey="opo">Trippee A</Dropdown.Item>
          <Dropdown.Item eventKey="opo">Trippee B</Dropdown.Item>
          <Dropdown.Item eventKey="opo">Trippee C</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      // <div className="landing-card-actions">
      //   <button className="doc-button" onClick={() => this.fakeSignIn('opo')}>OPO</button>
      //   <button className="doc-button" onClick={() => this.fakeSignIn('leader')}>Leader</button>
      //   <button className="doc-button" onClick={() => this.fakeSignIn('trippee1')}>Trippee 1</button>
      //   <button className="doc-button" onClick={() => this.fakeSignIn('trippee2')}>Trippee 2</button>
      //   <button className="doc-button" onClick={() => this.fakeSignIn('trippee3')}>Trippee 3</button>
      // </div>
    );
  }

  renderAuthOptions = () => {
    return (
      <div className="landing-card-actions">
        <button className="doc-button" onClick={() => this.fakeSignIn('cas')}>Login via CAS</button>
      </div>
    );
  }

  render() {
    return (
      <div id="landing-page" className={this.state.incompleteProfile ? 'landing-page-onboarding' : ''}>
        {this.state.incompleteProfile
          ? <CompleteProfile />
          : (
            <Box dir="col" className="landing-card doc-card" width={500} pad={50}>
              <div className="landing-card-message">
                <div className="doc-h1">Hello traveler!</div>
                <div className="p1">
                  Welcome to the Dartmouth Outing Club website! Here you can view and sign up for trips, sort by date, activity, or required experience, and create and publish your own trips as a leader. See you in the out o’ doors!
                </div>
              </div>
              {this.renderAuthOptions()}
              <Stack size={25} />
              <Box dir="row" align="center">
                <Queue size={25} />
                <Divider size={1} />
                <Queue size={25} />
                <div className="p1 thin gray">OR</div>
                <Queue size={25} />
                <Divider size={1} />
                <Queue size={25} />
              </Box>
              <Stack size={25} />
              <Box dir="row" justify="center">
                {this.renderDevAuthOptions()}
              </Box>
            </Box>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    errorMessage: state.error.errorMessage,
  };
};

export default withRouter(connect(mapStateToProps, { signIn, signOut, casAuthed, getUser })(Gateway));
