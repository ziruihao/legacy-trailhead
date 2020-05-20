/* eslint-disable */
/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
          <div id="landing-card" className="doc-card">
            {this.props.user ?
              <>
                {this.state.stage === '1' ?
                  <div id="landing-card-message">
                    <div className="h1">Hello {this.props.user.casID.split(' ')[0]}</div>
                    <div className="p1">
                      Welcome to the DOC platform. As a new user you just need to complete your profile to start signing up for trips.
                    </div>
                    <button className="doc-button" onClick={() => this.setState({stage: '2'})}>Let's Go</button>
                  </div>
                  :
                  <>
                    {this.props.user.name
                      ? (
                        <div className="profile-pic-container">
                          <div className="profile-pic">
                            <span className="user-initials">{getUserInitials(this.props.user.name)}</span>
                          </div>
                        </div>
                      )
                      : null
                    }
                    <div className="profile-card-body">
                      <div className="profile-card-info">
                      <div className="profile-card-row">
                          <span className="card-headings">
                            Name
                          </span>
                          <span className="card-info">
                            <input
                              type="text"
                              name="name"
                              maxLength="50"
                              onChange={this.onFieldChange}
                              value={this.state.name}
                            />
                          </span>
                        </div>
                        <hr className="line" />

                      <div className="profile-card-row">
                          <span className="card-headings">
                            Email
                          </span>
                          <span className="card-info">
                            <input
                              type="text"
                              name="email"
                              maxLength="50"
                              onChange={this.onFieldChange}
                              value={this.state.email}
                            />
                          </span>
                        </div>
                        <hr className="line" />

                        <div className="profile-card-row">
                          <span className="card-headings">
                            Pronouns
                          </span>
                          <span className="card-info">
                            <input
                              type="text"
                              name="pronoun"
                              maxLength="50"
                              onChange={this.onFieldChange}
                              value={this.state.pronoun}
                            />
                          </span>
                        </div>
                        <hr className="line" />
                        <div className="profile-card-row">
                          <span className="card-headings">
                            DASH
                          </span>
                          <span className="card-info">
                            <input
                              // type="number"
                              id="dash_number"
                              name="dash_number"
                              maxLength="50"
                              onChange={this.onFieldChange}
                              value={this.state.dash_number}
                            />
                          </span>
                        </div>
                        <hr className="line" />
                        <div className="profile-card-row">
                          <span className="card-headings">
                            Clothing Size
                          </span>
                          <span className="card-info">
                            {/* {this.props.getClotheForm()} */}
                          </span>
                        </div>
                        <hr className="line" />
                        <div className="profile-card-row">
                          <span className="card-headings">
                            Shoe Size
                          </span>
                          <span className="card-info">
                            {/* {this.props.getShoeGender()} */}
                            <input
                              // type="number"
                              name="shoe_size"
                              step="0.5"
                              onChange={this.onFieldChange}
                              value={this.state.shoe_size}
                              placeholder="e.g. 9.5"
                            />
                          </span>
                        </div>
                        <hr className="line" />
                        <div className="profile-card-row">
                          <span className="card-headings">
                            Height
                          </span>
                          <span className="card-info">
                            <input
                              type="text"
                              name="height"
                              onChange={this.onFieldChange}
                              value={this.state.height}
                              placeholder={'e.g. 5\'2"'}
                            />
                          </span>
                        </div>
                        <hr className="line" />
                        <div className="profile-card-row">
                          <span className="card-headings">
                            Allergies/Dietary Restrictions
                          </span>
                          <span className="card-info">
                            <input
                              type="text"
                              name="allergies_dietary_restrictions"
                              maxLength="50"
                              onChange={this.onFieldChange}
                              value={this.state.allergies_dietary_restrictions}
                            />
                          </span>
                        </div>
                        <hr className="line" />
                        <div className="profile-card-row">
                          <span className="card-headings">
                            Relevant Medical Conditions
                          </span>
                          <span className="card-info extra-info">
                            <input
                              type="text"
                              name="medical"
                              maxLength="50"
                              onChange={this.onFieldChange}
                              value={this.state.medical}
                            />
                            <span className="extra-info-message">This will only be visible to your trip leaders and OPO staff</span>
                          </span>
                        </div>
                        <hr className="line" />
                        {/* <div className="profile-card-row">
                          <span className="card-headings extra-info">
                            Driver Certification(s)
                            {this.props.displayCertificationFeedback()}
                          </span>
                          <span className="card-info extra-info">
                            {this.props.getCertificationsForm()}
                            <span className="extra-info-message">Please select your highest level of driver certification</span>
                          </span>
                        </div>
                        <hr className="line" />
                        <div className="profile-card-row">
                          <span className="card-headings extra-info">
                            DOC Leadership
                            {this.props.displayLeaderFeedback()}
                          </span>
                          <span className="card-info">
                            {this.props.getClubForm()}
                          </span>
                        </div> */}
                      </div>
                    </div>
                  </>
                  }
              </>
              :
              <Loading type="dots"></Loading>
            }
          </div>
      )
  }
}

const mapStateToProps = (reduxState) => ({
  user: reduxState.user.user,
})


export default withRouter(connect(mapStateToProps, { signIn, signOut, casAuthed, getUser })(CompleteProfile));
