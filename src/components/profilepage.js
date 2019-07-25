/* eslint-disable react/button-has-type */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateUser, getClubs } from '../actions';
import '../styles/profilepage-style.scss';

class ProfilePage extends Component {
  TRAILER_CONSTANT = 'TRAILER';

  CERTIFICATION_CONSTANT = 'CERTIFICATION';

  NONE_CONSTANT = 'NONE';

  CERTIFICATIONS = [null, 'MICROBUS', 'VAN'];

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      dash_number: '',
      allergies: '',
      diet: '',
      medical: '',
      clubsList: [],
      driver_cert: null,
      trailer_cert: false,
      isEditing: false,
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
  }

  componentDidMount() {
    this.props.getClubs();
  }

  onFieldChange(event) {
    event.persist();
    if (event.target.type === 'checkbox') {
      if (event.target.checked) {
        this.setState(prevState => ({
          clubsList: [...prevState.clubsList, { _id: event.target.id, name: event.target.value }],
        }));
      } else {
        this.setState((prevState) => {
          const key = event.target.id;
          const withoutClickedClub = prevState.clubsList.filter(club => club._id !== key);
          return {
            clubsList: withoutClickedClub,
          };
        });
      }
    } else {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  }

  isObjectEmpty = (object) => {
    return Object.entries(object).length === 0 && object.constructor === Object;
  }

  onDriverCertChange = (event) => {
    event.persist();
    if (event.target.name === this.TRAILER_CONSTANT) {
      this.setState({ trailer_cert: event.target.checked });
    }
    if (event.target.name === this.CERTIFICATION_CONSTANT) {
      const selected = event.target.value === this.NONE_CONSTANT ? null : event.target.value;
      this.setState({ driver_cert: selected });
    }
  }

  startEditing = () => {
    this.setState({
      name: this.props.user.name,
      email: this.props.user.email,
      dash_number: this.props.user.dash_number ? this.props.user.dash_number : '',
      clubsList: this.props.user.leader_for,
      driver_cert: this.props.user.driver_cert,
      trailer_cert: this.props.user.trailer_cert,
      isEditing: true,
    });
  }

  cancelChanges = () => {
    this.setState({ isEditing: false });
  }

  displayClubs = () => {
    let clubString = '';
    this.props.user.leader_for.forEach((club) => {
      clubString = clubString.concat(`${club.name}, `);
    });
    const clubs = clubString.length - 2 <= 0
      ? <em>None</em> : clubString.substring(0, clubString.length - 2);
    return clubs;
  }

  displayCertifications = () => {
    let certifications = '';
    if (this.props.user.driver_cert === null && !this.props.user.trailer_cert) {
      certifications = this.NONE_CONSTANT;
    } else {
      const driverCertString = this.props.user.driver_cert === null ? '' : `${this.props.user.driver_cert}, `;
      certifications = this.props.user.trailer_cert ? `${driverCertString}${this.TRAILER_CONSTANT}` : driverCertString;
    }
    return certifications;
  }

  getClubForm = () => {
    if (this.props.user.has_pending_leader_change) {
      return <h1>You can&apos;t update this until your previous changes have been reviewed</h1>;
    }
    const currentClubIds = this.state.clubsList.map(club => club._id);
    const clubForm = this.props.clubs.map((club) => {
      const checked = currentClubIds.includes(club.id);
      return (
        <div key={club.id}>
          <label htmlFor={club.id}>
            <input
              type="checkbox"
              name="club"
              id={club.id}
              value={club.name}
              onChange={this.onFieldChange}
              checked={checked}
            />
            {club.name}
          </label>
        </div>
      );
    });
    return (
      <div>
        <h5 className="card-title"> {this.props.user.role === 'Leader' ? 'DOC clubs that you are a leader for' : 'Request leader access'}</h5>
        {clubForm}
      </div>
    );
  }

  getCertificationsForm = () => {
    if (this.props.user.has_pending_cert_change) {
      return <h1>You can&apos;t update this until your previous changes have been reviewed</h1>;
    }

    const trailer = (
      <div>
        <label htmlFor={this.TRAILER_CONSTANT}>
          <input
            type="checkbox"
            name={this.TRAILER_CONSTANT}
            id={this.TRAILER_CONSTANT}
            value={this.TRAILER_CONSTANT}
            onChange={this.onDriverCertChange}
            checked={this.state.trailer_cert}
          />
          {this.TRAILER_CONSTANT}
        </label>
      </div>
    );

    const certificationForm = this.CERTIFICATIONS.map((certification) => {
      const checked = certification === this.state.driver_cert;
      certification = certification === null ? this.NONE_CONSTANT : certification;
      return (
        <div key={certification}>
          <label htmlFor={certification}>
            <input
              type="radio"
              name={this.CERTIFICATION_CONSTANT}
              id={certification}
              value={certification}
              onChange={this.onDriverCertChange}
              checked={checked}
            />
            {certification}
          </label>
        </div>
      );
    });
    return (
      <div>
        {certificationForm}
        {trailer}
      </div>
    );
  }

  displayLeaderFeedback = () => {
    if (this.state.clubsList.length < this.props.user.leader_for.length) {
      return (
        <p>
          Submitting this form will revoke your leader permissions in one or more clubs.
          You will need approval from the OPO to regain them.
          Please review before you proceed.
        </p>
      );
    } else if (this.state.clubsList.length > this.props.user.leader_for.length) {
      return (
        <p>
          Submitting this form will trigger a request to the OPO for leader permissions.
          Please proceed only if you are a leader in the selected clubs!
        </p>
      );
    } else {
      return null;
    }
  }

  displayCertificationFeedback = () => {
    if ((this.props.user.trailer_cert && !this.state.trailer_cert)
      || (this.props.user.driver_cert !== null && this.state.driver_cert === null)) {
      return (
        <p>
          Submitting this form will revoke one or more of your driver certifications.
          You will need approval from the OPO to regain them.
          Please review before you proceed.
        </p>
      );
    } else if ((!this.props.user.trailer_cert && this.state.trailer_cert)
      || (this.props.user.driver_cert !== this.state.driver_cert)) {
      return (
        <p>
          Submitting this form will trigger a request to the OPO for approval.
          Please proceed only if you have the selected driver certifications.
        </p>
      );
    } else {
      return null;
    }
  }

  pendingChanges = () => {
    return this.props.user.has_pending_leader_change || this.props.user.has_pending_cert_change
      ? '* You have changes pending approval'
      : null;
  }

  updateUserInfo(event) {
    const updatedUser = {
      email: this.state.email,
      name: this.state.name,
      leader_for: this.state.clubsList,
      dash_number: this.state.dash_number,
      driver_cert: this.state.driver_cert,
      trailer_cert: this.state.trailer_cert,
    };
    this.props.updateUser(updatedUser);
    this.setState({ isEditing: false });
  }

  render() {
    if (!this.isObjectEmpty(this.props.user)) {
      if (!this.state.isEditing) {
        return (
          <div className="background">
            <div className="my-container">
              <div className="profile-page-header">
                <h1 className="header">My Profile</h1>
                <span className="logout-button" onClick={this.logout} role="button" tabIndex={0}>Logout</span>
              </div>
              <div className="profile">
                <div className="profile-pic-container">
                  <div className="profile-pic">
                    {/* <h1>RY</h1> */}
                  </div>
                </div>

                <div className="profile-card-body">
                  <div className="profile-card-header">
                    <div className="name-and-email">
                      <div className="card-name">{this.props.user.name}</div>
                      <div className="card-email">{this.props.user.email}</div>
                    </div>
                    <div className="button-place">
                      <input className="edit-button" type="image" src="/src/img/editButton.svg" alt="edit button" onClick={this.startEditing} />
                    </div>
                  </div>
                  <div className="profile-card-info">
                    <div className="profile-card-row">
                      <span className="card-headings">
                        DASH
                      </span>
                      <span className="card-info">
                        {this.props.user.dash_number ? this.props.user.dash_number : 'Please fill out'}
                      </span>
                    </div>
                    <hr className="line" />
                    <div className="profile-card-row">
                      <span className="card-headings">
                        Allergies
                      </span>
                      <span className="card-info">
                        Peanuts, Bee Stings
                      </span>
                    </div>
                    <hr className="line" />
                    <div className="profile-card-row">
                      <span className="card-headings">
                        Dietary Restrictions
                      </span>
                      <span className="card-info">
                        n/a
                      </span>
                    </div>
                    <hr className="line" />
                    <div className="profile-card-row">
                      <span className="card-headings">
                        Relevant Medical Conditions
                      </span>
                      <span className="card-info">
                        Asthma
                      </span>
                    </div>
                    <hr className="line" />
                    <div className="profile-card-row">
                      <span className="card-headings">
                        {this.props.user.has_pending_leader_change ? 'DOC Leadership*' : 'DOC Leadership'}
                      </span>
                      <span className="card-info">
                        {this.displayClubs()}
                      </span>
                    </div>
                    <hr className="line" />
                    <div className="profile-card-row">
                      <span className="card-headings">
                        {this.props.user.has_pending_cert_change ? 'Driver Certification(s)*' : 'Driver Certification(s)'}
                      </span>
                      <span className="card-info">
                        {this.displayCertifications()}
                      </span>
                    </div>
                    <div className="pending-changes">
                      {this.pendingChanges()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="background">
            <div className="my-container">
              <div className="profile-page-header">
                <h1 className="header">My Profile</h1>
                <span className="cancel-changes" onClick={this.cancelChanges} role="button" tabIndex={0}>Cancel changes</span>
              </div>
              <div className="profile">
                <div className="profile-pic-container">
                  <div className="profile-pic">
                    {/* <h1>RY</h1> */}
                  </div>
                </div>

                <div className="profile-card-body">
                  <div className="profile-card-header">
                    <div className="name-and-email">
                      <div className="card-name">
                        <input type="text" name="name" onChange={this.onFieldChange} className="my-form-control name-input" value={this.state.name} />
                      </div>
                      <div className="card-email">
                        <input type="text" name="email" onChange={this.onFieldChange} className="my-form-control" value={this.state.email} />
                      </div>
                    </div>
                    <div className="button-place">
                      <span className="logout-button" onClick={this.updateUserInfo} role="button" tabIndex={0}>Save</span>
                    </div>
                  </div>
                  <div className="profile-card-info">
                    <div className="profile-card-row">
                      <span className="card-headings">
                        DASH
                      </span>
                      <span className="card-info">
                        <input type="text" name="dash_number" onChange={this.onFieldChange} className="my-form-control" value={this.state.dash_number} />
                      </span>
                    </div>
                    <hr className="line" />
                    <div className="profile-card-row">
                      <span className="card-headings">
                        Allergies
                      </span>
                      <span className="card-info">
                        <input type="text" name="allergies" onChange={this.onFieldChange} className="my-form-control" value={this.state.allergies} />
                      </span>
                    </div>
                    <hr className="line" />
                    <div className="profile-card-row">
                      <span className="card-headings">
                        Dietary Restrictions
                      </span>
                      <span className="card-info">
                        <input type="text" name="diet" onChange={this.onFieldChange} className="my-form-control" value={this.state.diet} />
                      </span>
                    </div>
                    <hr className="line" />
                    <div className="profile-card-row">
                      <span className="card-headings">
                        Relevant Medical Conditions
                      </span>
                      <span className="card-info">
                        <input type="text" name="medical" onChange={this.onFieldChange} className="my-form-control" value={this.state.medical} />
                      </span>
                    </div>
                    <hr className="line" />
                    <div className="profile-card-row">
                      <span className="card-headings">
                        {this.props.user.has_pending_leader_change ? 'DOC Leadership*' : 'DOC Leadership'}
                      </span>
                      <span className="card-info">
                        {this.displayClubs()}
                      </span>
                    </div>
                    <hr className="line" />
                    <div className="profile-card-row">
                      <span className="card-headings">
                        {this.props.user.has_pending_cert_change ? 'Driver Certification(s)*' : 'Driver Certification(s)'}
                      </span>
                      <span className="card-info">
                        {this.displayCertifications()}
                      </span>
                    </div>
                    <div className="pending-changes">
                      {this.pendingChanges()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div className="background">
          <div className="my-container">
            <div className="profile-page-header">
              <h1 className="header">My Profile</h1>
              <span className="logout-button" onClick={this.logout} role="button" tabIndex={0}>Logout</span>
            </div>
            <div className="profile">
              <h1>Loading...</h1>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    clubs: state.clubs,
  };
};

export default withRouter(connect(mapStateToProps, { updateUser, getClubs })(ProfilePage));
