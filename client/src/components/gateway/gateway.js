/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string';
import { Dropdown } from 'react-bootstrap';
import { signIn, signOut, casAuthed, getUser } from '../../actions';
import DOCLoading from '../doc-loading';
import { Stack, Queue, Divider, Box } from '../layout';
import Icon from '../icon';
import Text from '../text';
import TripCard from '../trip-card';
import CompleteProfile from './complete-profile';
import * as constants from '../../constants';
import './gateway.scss';

class Gateway extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signingIn: false,
      incompleteProfile: false,
      publicTripsLoaded: false,
      publicTrips: [],
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
    } else {
      axios.get(`${constants.BACKEND_URL}/trips/public`).then((response) => {
        console.log(response.data);
        this.setState({ publicTrips: response.data, publicTripsLoaded: true });
      });
    }
  }

  signInAndThenLoadData = (email, password) => {
    this.setState({ signingIn: true });
    this.props.signIn(email, password, this.props.dataLoader).then(() => {
      this.setState({ signingIn: false });
    });
  }

  fakeSignIn = (type) => {
    switch (type) {
      case 'cas':
        window.location = (`${constants.BACKEND_URL}/signin-cas`);
        break;
      case 'opo':
        this.signInAndThenLoadData('zirui.hao@gmail.com', 'opo');
        break;
      case 'leader':
        this.signInAndThenLoadData('ziray.hao@dali.dartmouth.edu', 'leader');
        break;
      case 'trippee1':
        this.signInAndThenLoadData('ziray.hao.22@dartmouth.edu', 'trippee1');
        break;
      case 'trippee2':
        this.signInAndThenLoadData('f003mfv@dartmouth.edu', 'trippee2');
        break;
      case 'trippee3':
        this.signInAndThenLoadData('z.22@dartmouth.edu', 'trippee3');
        break;
      default:
        break;
    }
  }

  renderDevAuthOptions = () => {
    return (
      <Dropdown onSelect={this.fakeSignIn}>
        <Dropdown.Toggle className='field'>
          <span className='field-dropdown-bootstrap'>Select test user</span>
          <Queue size={20} />
          <Icon type='dropdown' size={20} />
        </Dropdown.Toggle>
        <Dropdown.Menu className='field-dropdown-menu'>
          <Dropdown.Item eventKey='opo'>OPO Staff (the great Rory)</Dropdown.Item>
          <Dropdown.Item eventKey='leader'>Trip leader (Elliot)</Dropdown.Item>
          <Dropdown.Item eventKey='trippee1'>Trippee A (David)</Dropdown.Item>
          <Dropdown.Item eventKey='trippee2'>Trippee B (Simon)</Dropdown.Item>
          <Dropdown.Item eventKey='trippee3'>Trippee C (indoor cat)</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  renderAuthOptions = () => {
    return (
      <Box dir='row' justify='around' className='landing-card-actions'>
        <div className='doc-button' onClick={() => this.fakeSignIn('cas')} role='button' tabIndex={0}>Login via CAS</div>
      </Box>
    );
  }

  render() {
    return (
      <Box dir='row' justify='center' id='landing-page-background' className={this.state.incompleteProfile ? 'onboarding' : ''}>
        {this.state.incompleteProfile
          ? <CompleteProfile />
          : (
            <>
              <Box dir='col' width={600} height='100vh' pad={0} className='gateway-trips-list'>
                <Stack size={100} />
                <Box dir='row' marg={[0, 0, 0, 25]}>
                  <Text type='h1' color='dark-green'>Up Next</Text>
                </Box>
                <Stack size={25} />
                {this.state.publicTripsLoaded
                  ? (
                    <>
                      {this.state.publicTrips.map((trip, idx) => (
                        <>
                          <TripCard trip={trip} type='small' displayDescription />
                          {idx < this.state.publicTrips.length - 1
                            ? <Stack size={25} />
                            : <Stack size={100} />
                          }
                        </>
                      ))}
                    </>
                  )
                  : (
                    <Box dir='row' justify='center' align='center' width={700} height={300}>
                      <DOCLoading type='doc' width={50} height={50} />
                    </Box>
                  )
                }
              </Box>
              <Box dir='col' justify='stretch' className='landing-card doc-card' width={500} pad={50} marg={[0, 0, 0, 0]}>
                <Box dir='row' justify='center'>
                  <Icon type='tree' size={100} />
                </Box>
                <Stack size={25} />
                <Box dir='col' align='center'>
                  <Text type='h1'>Hello traveler!</Text>
                  <Stack size={25} />
                  <div className='p1 center-text'>
                    Welcome to the Dartmouth Outing Club website! Here you can view and sign up for trips, sort by date, activity, or required experience, and create and publish your own trips as a leader. See you in the out o’ doors!
                  </div>
                </Box>
                <Stack size={25} />
                <Box dir='row' justify='center'>
                  {this.state.signingIn ? <DOCLoading type='cubes' width={50} height={50} /> : this.renderAuthOptions() }
                </Box>
                {process.env.NODE_ENV === 'development'
                  ? (
                    <>
                      <Stack size={25} />
                      <Box dir='row' align='center'>
                        <Queue size={25} />
                        <Divider size={1} />
                        <Queue size={25} />
                        <div className='p1 thin gray'>OR</div>
                        <Queue size={25} />
                        <Divider size={1} />
                        <Queue size={25} />
                      </Box>
                      <Stack size={25} />
                      <Box dir='row' justify='center'>
                        {this.state.signingIn ? <DOCLoading type='cubes' width={50} height={50} /> : this.renderDevAuthOptions() }
                      </Box>
                    </>
                  )
                  : null
                }
              </Box>
            </>
          )
        }
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    errorMessage: state.error.errorMessage,
  };
};

export default withRouter(connect(mapStateToProps, { signIn, signOut, casAuthed, getUser })(Gateway));
