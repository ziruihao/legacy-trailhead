/* eslint-disable */
/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ProfileCardEdit } from '../../profile-card';
import queryString from 'query-string'
import { signIn, signOut, casAuthed, getUser } from '../../../actions';
import * as constants from '../../../constants';
import '../gateway.scss';

class CompleteProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stage: '1',
      name: '',
      email: '',
      pronoun: '',
      dash_number: '',
      shoe_size: '',
      height: '',
      allergies_dietary_restrictions: '',
      medical: '',
    }
  }

  render() {
      return (
        <>
            {this.props.user ?
              <>
                {this.state.stage === '1' ?
                  <div className="landing-card doc-card s">
                    <div className="landing-card-message">
                      <div className="doc-h1">Hello {this.props.user.casID.split(' ')[0]}</div>
                      <div className="p1">
                        Welcome to the DOC platform. As a new user you just need to complete your profile to start signing up for trips.
                      </div>
                    </div>
                    <div className="landing-card-actions">
                      <div role="button" tabIndex={0} className="doc-button" onClick={() => this.setState({stage: '2'})}>Let's Go</div>
                    </div>
                  </div>
                  :
                  <ProfileCardEdit completeProfileMode={true}></ProfileCardEdit>
                }
              </>
              :
              <div id="landing-card" className="doc-card">
                <DOCLoading type="dots" />
              </div>
            }
        </>
      )
  }
}

const mapStateToProps = (reduxState) => ({
  user: reduxState.user.user,
})


export default withRouter(connect(mapStateToProps, { signIn, signOut, casAuthed, getUser })(CompleteProfile));
