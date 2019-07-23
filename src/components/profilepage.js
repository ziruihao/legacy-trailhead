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
      clubsList: [],
      driver_cert: null,
      trailer_cert: false,
      isEditing: false,
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
    this.changeToOPO = this.changeToOPO.bind(this);
    this.changeToTrippee = this.changeToTrippee.bind(this);
    this.changeToLeader = this.changeToLeader.bind(this);
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

  displayClubs = () => {
    if (!this.props.user.leader_for) {
      return '';
    }
    if (!this.state.isEditing) {
      let clubString = '';
      this.props.user.leader_for.forEach((club) => {
        clubString = clubString.concat(`${club.name}, `);
      });
      const clubs = clubString.length - 2 <= 0
        ? <em>None</em> : clubString.substring(0, clubString.length - 2);
      return (
        <div>
          <h5 className="card-title">DOC clubs that you are a leader for</h5>
          {clubs}
        </div>
      );
    } else {
      return this.getClubForm();
    }
  }

  displayCertifications = () => {
    if (!this.state.isEditing) {
      let certifications = '';
      if (this.props.user.driver_cert === null && !this.props.user.trailer_cert) {
        certifications = this.NONE_CONSTANT;
      } else {
        const driverCertString = this.props.user.driver_cert === null ? '' : `${this.props.user.driver_cert}, `;
        certifications = this.props.user.trailer_cert ? `${driverCertString}${this.TRAILER_CONSTANT}` : driverCertString;
      }
      return (
        <div>
          <h5 className="card-title">Driver certifications</h5>
          <p>{certifications}</p>
        </div>
      );
    } else {
      return (
        <div>
          <h5 className="card-title">Select your highest level of driver certification</h5>
          {this.getCertificationsForm()}
        </div>
      );
    }
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
      ? <strong>You have changes pending approval</strong>
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

  changeToOPO(event) {
    const updatedUser = {
      email: this.state.email,
      name: this.state.name,
      leader_for: [],
      role: 'OPO',
      dash_number: this.state.dash_number,
    };
    this.setState({ isEditing: false, clubsList: [] });
    this.props.updateUser(updatedUser);
  }

  changeToTrippee(event) {
    const updatedUser = {
      email: this.state.email,
      name: this.state.name,
      leader_for: [],
      role: 'Trippee',
      dash_number: this.state.dash_number,
    };
    this.setState({ isEditing: false, clubsList: [] });
    this.props.updateUser(updatedUser);
  }

  changeToLeader(event) {
    const updatedUser = {
      email: this.state.email,
      name: this.state.name,
      leader_for: this.state.clubsList,
      role: 'Leader',
      dash_number: this.state.dash_number,
    };
    this.setState({ isEditing: false, clubsList: [] });
    this.props.updateUser(updatedUser);
  }

  render() {
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
                <div className="card-header">
                  <div className="name-and-email">
                    <div className="card-name">
                      <p>{this.props.user.name}</p>
                    </div>
                    <div className="card-email">
                      <p>{this.props.user.email}</p>
                    </div>
                  </div>
                  <div className="button-place">
                    {/* <button id="edit-button" onClick={this.getUpdatedVals}> */}
                      <img src="/src/img/editButton.svg" alt="edit button" />
                      {/* <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.71 4.0425C18.1 3.6525 18.1 3.0025 17.71 2.6325L15.37 0.2925C15 -0.0975 14.35
                        -0.0975 13.96 0.2925L12.12 2.1225L15.87 5.8725L17.71 4.0425ZM0 14.2525V18.0025H3.75L14.81
                          6.9325L11.06 3.1825L0 14.2525Z"
                          fill="#0CA074"
                        />  
                      </svg> */}
                    {/* </button> */}
                  </div>
                </div>
                <div className="row justify-content-between">
                  <div className="col-6">
                    <p className="card-headings">DASH</p>
                  </div>
                  <div className="col-6">
                    <p className="card-info">{this.props.user.dash_number ? this.props.user.dash_number : 'Please fill out'}</p>
                  </div>
                </div>
                <hr className="line" />
                <div className="row justify-content-between">
                  <div className="col-6">
                    <p className="card-headings">Allergies</p>
                  </div>
                  <div className="col-6">
                    <p className="card-info">Peanuts, Bee Stings</p>
                  </div>
                </div>
                <hr className="line" />
                <div className="row justify-content-between">
                  <div className="col-6">
                    <p className="card-headings">Dietary Restrictions</p>
                  </div>
                  <div className="col-6">
                    <p className="card-info">n/a</p>
                  </div>
                </div>
                <div className="profile-field">
                  {this.displayClubs()}
                </div>
                <div className="profile-field">
                  {this.displayCertifications()}
                </div>
                <button className="btn btn-primary" onClick={this.startEditing}>Update my info</button>
                {this.pendingChanges()}
                <hr className="line" />
                <div className="row justify-content-between">
                  <div className="col-6">
                    <p className="card-headings">Relevant Medical Conditions</p>
                  </div>
                  <div className="col-6">
                    <p className="card-info">Asthma</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }


    return (
      <div className="my-container">
        <div id="page-header" className="row">
          <div className="col-6">
            <h1 className="header">My Profile</h1>
          </div>
          <div className="col-6">
            <button id="edit-button" className="logout-button">
              <span>Save</span>
            </button>
          </div>
          <div className="profile-field">
            {this.displayClubs()}
            {this.displayLeaderFeedback()}
            {this.displayCertifications()}
            {this.displayCertificationFeedback()}
          </div>
          <div className="row profile justify-content-center">
            <div className="col-4">
              <p className="profile-pic" />
            </div>

            <div className="col-8 card-body">
              <div className="row justify-content-between">
                <div className="col-6 card-name">
                  <p>{this.props.user.name}</p>
                </div>
                <div className="col-2 button-place">
                  <button id="save-button" onClick={this.updateUserInfo}>
                    <span>Save</span>
                  </button>
                </div>
              </div>
              <div className="row  justify-content-between">
                <div className="col-12 card-email">
                  <p>{this.props.user.email}</p>
                </div>

              </div>
              <div className="row justify-content-between">
                <div className="col-6">
                  <p className="card-headings">DASH</p>
                </div>
                <div className="col-6">
                  <input type="text" name="dash_number" onChange={this.onFieldChange} className="form-control my-form-control" value={this.state.dash_number} />
                </div>
              </div>
              <hr className="line" />
              <div className="row justify-content-between">
                <div className="col-6">
                  <p className="card-headings">Allergies</p>
                </div>
                <div className="col-6">
                  <input type="text" name="allergies" onChange={this.onFieldChange} className="form-control my-form-control" />
                </div>
              </div>
              <hr className="line" />
              <div className="row justify-content-between">
                <div className="col-6">
                  <p className="card-headings">Dietary Restrictions</p>
                </div>
                <div className="col-6">
                  <input type="text" name="dietary_restrictions" onChange={this.onFieldChange} className="form-control my-form-control" />
                </div>
              </div>
              <hr className="line" />
              <div className="row justify-content-between">
                <div className="col-6">
                  <p className="card-headings">Relevant Medical Conditions</p>
                </div>
                <div className="col-6">
                  <input type="text" name="medical_conditions" onChange={this.onFieldChange} className="form-control my-form-control" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    clubs: state.clubs,
  };
};

export default withRouter(connect(mapStateToProps, { updateUser, getClubs })(ProfilePage));
