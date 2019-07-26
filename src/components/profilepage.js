/* eslint-disable react/button-has-type */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
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

  displaySelectedClubs = () => {
    let clubString = '';
    this.state.clubsList.forEach((club) => {
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
    } else if (!this.props.user.trailer_cert && this.props.user.driver_cert !== null) {
      certifications = this.props.user.driver_cert;
    } else if (this.props.user.trailer_cert && this.props.user.driver_cert === null) {
      certifications = this.TRAILER_CONSTANT;
    } else if (this.props.user.trailer_cert && this.props.user.driver_cert !== null) {
      certifications = `${this.TRAILER_CONSTANT}, ${this.props.user.driver_cert}`;
    }
    return certifications;
  }

  displaySelectedCertifications = () => {
    let certifications = '';
    if (this.state.driver_cert === null && !this.state.trailer_cert) {
      certifications = this.NONE_CONSTANT;
    } else if (!this.state.trailer_cert && this.state.driver_cert !== null) {
      certifications = `${this.state.driver_cert}`;
    } else if (this.state.trailer_cert && this.state.driver_cert === null) {
      certifications = `${this.TRAILER_CONSTANT}`;
    } else if (this.state.trailer_cert && this.state.driver_cert !== null) {
      certifications = `${this.TRAILER_CONSTANT}, ${this.state.driver_cert}`;
    }
    return certifications;
  }

  getClubForm = () => {
    const currentClubIds = this.state.clubsList.map(club => club._id);
    const clubForm = this.props.clubs.map((club) => {
      const checked = currentClubIds.includes(club.id);
      return (
        <div className="club-option" key={club.id}>
          <label className="checkbox-container club-checkbox" htmlFor={club.id}>
            <input
              type="checkbox"
              name="club"
              id={club.id}
              value={club.name}
              onChange={this.onFieldChange}
              checked={checked}
            />
            <span className="checkmark" />
          </label>
          <span>{club.name}</span>
        </div>
      );
    });
    return (
      <Dropdown>
        <Dropdown.Toggle id="leader-dropdown">
          <p className="current-filter">{this.displaySelectedClubs()}</p>
          <img className="dropdown-icon" src="/src/img/dropdown-toggle.svg" alt="dropdown-toggle" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="filter-options">
          {clubForm}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  getCertificationsForm = () => {
    const trailer = (
      <div className="club-option">
        <label className="checkbox-container club-checkbox" htmlFor={this.TRAILER_CONSTANT}>
          <input
            type="checkbox"
            name={this.TRAILER_CONSTANT}
            id={this.TRAILER_CONSTANT}
            value={this.TRAILER_CONSTANT}
            onChange={this.onDriverCertChange}
            checked={this.state.trailer_cert}
          />
          <span className="checkmark" />
        </label>
        <span>{this.TRAILER_CONSTANT}</span>
      </div>
    );

    const certificationForm = this.CERTIFICATIONS.map((certification) => {
      const checked = certification === this.state.driver_cert;
      certification = certification === null ? this.NONE_CONSTANT : certification;
      return (
        <div className="club-option" key={certification}>
          <label className="checkbox-container club-checkbox" htmlFor={certification}>
            <input
              type="radio"
              name={this.CERTIFICATION_CONSTANT}
              id={certification}
              value={certification}
              onChange={this.onDriverCertChange}
              checked={checked}
            />
            <span className="radio-button" />
          </label>
          <span>{certification}</span>
        </div>
      );
    });
    return (
      <Dropdown>
        <Dropdown.Toggle id="driver-cert-dropdown">
          <p className="current-filter">{this.displaySelectedCertifications()}</p>
          <img className="dropdown-icon" src="/src/img/dropdown-toggle.svg" alt="dropdown-toggle" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="filter-options">
          {certificationForm}
          <Dropdown.Divider />
          {trailer}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  displayLeaderFeedback = () => {
    let message = '';
    let className = 'feedback';
    if (this.state.clubsList.length < this.props.user.leader_for.length) {
      message = 'You will need OPO approval to regain your leader permissions';
      className = 'feedback show-feedback';
    } else if (this.state.clubsList.length > this.props.user.leader_for.length) {
      message = 'Your changes will be applied after OPO approves them';
      className = 'feedback show-feedback';
    } else {
      message = null;
    }
    return (
      <span className={className}>{message}</span>
    );
  }

  displayCertificationFeedback = () => {
    let message = '';
    let className = 'feedback';
    if ((this.props.user.trailer_cert && !this.state.trailer_cert)
      || (this.props.user.driver_cert !== null && this.state.driver_cert === null)) {
      message = 'You will need OPO approval to regain your driver certifications';
      className = 'feedback show-feedback';
    } else if ((!this.props.user.trailer_cert && this.state.trailer_cert)
      || (this.props.user.driver_cert !== this.state.driver_cert)) {
      message = 'Your changes will be applied after OPO approves them';
      className = 'feedback show-feedback';
    } else {
      message = null;
    }
    return (
      <span className={className}>{message}</span>
    );
  }

  pendingChanges = () => {
    return this.props.user.has_pending_leader_change || this.props.user.has_pending_cert_change
      ? '* You have changes pending approval'
      : null;
  }

  getUserInitials = () => {
    const names = this.props.user.name.split(' ');
    const firstInitial = names[0].split('')[0];
    const lastInitial = names.length > 1 ? names[names.length - 1].split('')[0] : '';
    return `${firstInitial}${lastInitial}`;
  }

  updateUserInfo(event) {
    const updatedUser = {
      email: this.state.email,
      name: this.state.name,
      leader_for: this.state.clubsList,
      dash_number: this.state.dash_number,
      allergies: this.state.allergies,
      dietary_restrictions: this.state.diet,
      medical_conditions: this.state.medical,
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
                    <span className="user-initials">{this.getUserInitials()}</span>
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
                        {this.props.user.has_pending_cert_change ? 'Driver Certification(s)*' : 'Driver Certification(s)'}
                      </span>
                      <span className="card-info">
                        {this.displayCertifications()}
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
                      <span className="card-info extra-info">
                        <input type="text" name="medical" onChange={this.onFieldChange} className="my-form-control" value={this.state.medical} />
                        <span className="extra-info-message">This will only be visible to your trip leaders and OPO staff</span>
                      </span>
                    </div>
                    <hr className="line" />
                    <div className="profile-card-row">
                      <span className="card-headings extra-info">
                        {this.props.user.has_pending_cert_change ? 'Driver Certification(s)*' : 'Driver Certification(s)'}
                        {this.displayCertificationFeedback()}
                      </span>
                      <span className="card-info extra-info">
                        {this.getCertificationsForm()}
                        <span className="extra-info-message">Please select your highest level of driver certification</span>
                      </span>
                    </div>
                    <hr className="line" />
                    <div className="profile-card-row">
                      <span className="card-headings extra-info">
                        {this.props.user.has_pending_leader_change ? 'DOC Leadership*' : 'DOC Leadership'}
                        {this.displayLeaderFeedback()}
                      </span>
                      <span className="card-info">
                        {this.getClubForm()}
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
