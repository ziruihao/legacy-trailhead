import React, { Component } from 'react';
import '../profile-page/profile-page.scss';
import editIcon from '../../img/editButton.svg';
// import { uploadImage } from '../s3';
import * as s3 from '../s3';

const TRAILER_CONSTANT = 'TRAILER';

const NONE_CONSTANT = 'None';

const displayClubs = (userClubs) => {
  let clubString = '';
  userClubs.forEach((club) => {
    clubString = clubString.concat(`${club.name}, `);
  });
  const clubs = clubString.length - 2 <= 0 ? NONE_CONSTANT : clubString.substring(0, clubString.length - 2);
  return clubs;
};

const displayCertifications = (driverCert, trailerCert) => {
  let certifications = '';
  if (driverCert === null && !trailerCert) {
    certifications = NONE_CONSTANT;
  } else if (!trailerCert && driverCert !== null) {
    certifications = driverCert;
  } else if (trailerCert && driverCert === null) {
    certifications = TRAILER_CONSTANT;
  } else if (trailerCert && driverCert !== null) {
    certifications = `${TRAILER_CONSTANT}, ${driverCert}`;
  }
  return certifications;
};

const pendingChanges = (hasPendingLeaderChange, hasPendingCertChange) => {
  return hasPendingLeaderChange || hasPendingCertChange
    ? '* You have changes pending approval'
    : null;
};

const getUserInitials = (userName) => {
  const names = userName.split(' ');
  const firstInitial = names[0].split('')[0];
  const lastInitial = names.length > 1 ? names[names.length - 1].split('')[0] : '';
  return `${firstInitial}${lastInitial}`;
};

class ProfileCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preview: null,

    };
    this.onImageUpload = this.onImageUpload.bind(this);
  }

  onImageUpload(event) {
    const file = event.target.files[0];
    // Handle null file
    // Get url of the file and set it to the src of preview
    if (file) {
      this.setState({ preview: window.URL.createObjectURL(file), file });
    }
  }

  displayImageEditing() {
    if (this.props.user.photo_url !== '' && this.state.preview == null) {
      return (
        <div className="profile-photo-fit">
          <img className="profile-photo" id="preview" alt="" src={this.props.user.photo_url} />
        </div>
      );
    } else if (this.state.preview != null) {
      return (
        <div className="profile-photo-fit">
          <img className="profile-photo" id="preview" alt="" src={this.state.preview} />;
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    if (!this.props.isEditing) {
      return (
        <div id="profile-card">
          {this.props.user.name
            ? (
              <div className="profile-pic-container">
                <div className="profile-pic">
                  <span className="user-initials">{this.props.user.photo_url === '' ? getUserInitials(this.props.user.name) : null}</span>
                  { this.props.user.photo_url === '' ? null : <div className="profile-photo-fit"><img className="profile-photo" id="photo" alt="" src={this.props.user.photo_url} /> </div>}
                </div>
              </div>
            )
            : null
        }
          <div className="profile-card-body">
            <div className="profile-card-header">
              {this.props.user.completedProfile
                ? (
                  <div className="name-and-email">
                    <div className="card-name">{this.props.user.name}</div>
                    <div className="card-email">{this.props.user.email}</div>
                  </div>
                )
                : (
                  <div id="profile-card-incomplete-notice" className="h1">
                    Incomplete profile
                  </div>
                )
          }
              {this.props.asProfilePage
                ? (
                  <div className="button-place">
                    <input className="edit-button" type="image" src={editIcon} alt="edit button" onClick={this.props.startEditing} />
                  </div>
                )
                : null}
            </div>
            <div className="profile-card-info">
              <div className="profile-card-row">
                <span className="card-headings">
                  Pronouns
                </span>
                <span className="card-info">
                  {this.props.user.pronoun ? this.props.user.pronoun : 'Please fill out'}
                </span>
              </div>
              <hr className="line" />
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
                  Clothing Size
                </span>
                <span className="card-info">
                  {this.props.user.clothe_size ? this.props.user.clothe_size : 'Please fill out'}
                </span>
              </div>
              <hr className="line" />
              <div className="profile-card-row">
                <span className="card-headings">
                  Shoe Size
                </span>
                <span className="card-info">
                  {this.props.user.shoe_size ? this.props.user.shoe_size : 'Please fill out'}
                </span>
              </div>
              <hr className="line" />
              <div className="profile-card-row">
                <span className="card-headings">
                  Height
                </span>
                <span className="card-info">
                  {this.props.user.height ? this.props.user.height : 'Please fill out'}
                </span>
              </div>
              <hr className="line" />
              <div className="profile-card-row">
                <span className="card-headings">
                  Allergies/Dietary Restrictions
                </span>
                <span className="card-info">
                  {this.props.user.allergies_dietary_restrictions ? this.props.user.allergies_dietary_restrictions : 'Please fill out'}
                </span>
              </div>
              <hr className="line" />
              <div className="profile-card-row">
                <span className="card-headings">
                  Relevant Medical Conditions
                </span>
                <span className="card-info">
                  {this.props.user.medical_conditions ? this.props.user.medical_conditions : 'Please fill out'}
                </span>
              </div>
              <hr className="line" />
              <div className="profile-card-row">
                <span className="card-headings">
                  {this.props.asProfilePage && this.props.user.has_pending_cert_change ? 'Driver Certifications*' : 'Driver Certifications'}
                </span>
                <span className="card-info">
                  {displayCertifications(this.props.user.driver_cert, this.props.user.trailer_cert)}
                </span>
              </div>
              {this.props.user.role !== 'OPO' ? <hr className="line" /> : null}
              {this.props.user.role !== 'OPO'
                ? (
                  <div className="profile-card-row">
                    <span className="card-headings">
                      {this.props.asProfilePage && this.props.user.has_pending_leader_change ? 'DOC Leadership*' : 'DOC Leadership'}
                    </span>
                    <span className="card-info">
                      {displayClubs(this.props.user.leader_for)}
                    </span>
                  </div>
                ) : null}
              <div className="pending-changes">
                {this.props.asProfilePage ? pendingChanges(this.props.user.has_pending_leader_change, this.props.user.has_pending_cert_change) : null}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div id="profile-card">
          {this.props.user.name
            ? (
              <div className="profile-pic-container">
                <div className="profile-pic">
                  <span className="user-initials">{this.state.preview == null && this.props.user.photo_url === '' ? getUserInitials(this.props.user.name) : null}</span>
                  { this.displayImageEditing()}
                </div>
                <label className="custom-file-upload">
                  <input type="file" name="coverImage" onChange={this.onImageUpload} />
                  Select a File
                </label>
              </div>
            )
            : null
        }
          <div className="profile-card-body">
            <div className="profile-card-header">
              <div className="name-and-email">
                <div className="card-name">
                  <input
                    type="text"
                    name="name"
                    onChange={this.props.onFieldChange}
                    className={`my-form-control name-input ${this.props.errorFields.name ? 'vrf-error' : ''}`}
                    value={this.props.name}
                    placeholder="Name"
                  />
                </div>
                <div className="card-email">
                  <input
                    type="text"
                    name="email"
                    maxLength="50"
                    onChange={this.props.onFieldChange}
                    className={`my-form-control ${this.props.errorFields.email ? 'vrf-error' : ''}`}
                    value={this.props.email}
                    placeholder="Dartmouth email"
                  />
                </div>
              </div>
              <div className="button-place">
                <span
                  className="logout-button"
                  onClick={() => {
                    if (this.state.file) {
                      s3.uploadImage(this.state.file).then((url) => {
                        this.props.photoUrlChange(url);
                        this.props.updateUserInfo();
                      });
                    } else {
                      this.props.updateUserInfo();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >Save
                </span>
              </div>
            </div>
            <div className="profile-card-info">
              <div className="profile-card-row">
                <span className="card-headings">
                  Pronouns
                </span>
                <span className="card-info">
                  <input
                    className={`my-form-control ${this.props.errorFields.pronoun ? 'vrf-error' : ''}`}
                    type="text"
                    name="pronoun"
                    maxLength="50"
                    onChange={this.props.onFieldChange}
                    value={this.props.pronoun}
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
                    onChange={this.props.onFieldChange}
                    className={`my-form-control ${this.props.errorFields.dash_number ? 'vrf-error' : ''}`}
                    value={this.props.dash_number}
                  />
                </span>
              </div>
              <hr className="line" />
              <div className="profile-card-row">
                <span className="card-headings">
                  Clothing Size
                </span>
                <span className="card-info">
                  {this.props.getClotheForm()}
                </span>
              </div>
              <hr className="line" />
              <div className="profile-card-row">
                <span className="card-headings">
                  Shoe Size
                </span>
                <span className="card-info">
                  {this.props.getShoeGender()}
                  <input
                  // type="number"
                    name="shoe_size"
                    step="0.5"
                    onChange={this.props.onFieldChange}
                    className={`my-form-control ${this.props.errorFields.shoe_size ? 'vrf-error' : ''}`}
                    value={this.props.shoe_size}
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
                    onChange={this.props.onFieldChange}
                    className={`my-form-control ${this.props.errorFields.height ? 'vrf-error' : ''}`}
                    value={this.props.height}
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
                    className={`my-form-control ${this.props.errorFields.allergies_dietary_restrictions ? 'vrf-error' : ''}`}
                    type="text"
                    name="allergies_dietary_restrictions"
                    maxLength="50"
                    onChange={this.props.onFieldChange}
                    value={this.props.allergies_dietary_restrictions}
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
                    onChange={this.props.onFieldChange}
                    className={`my-form-control ${this.props.errorFields.medical ? 'vrf-error' : ''}`}
                    value={this.props.medical}
                  />
                  <span className="extra-info-message">This will only be visible to your trip leaders and OPO staff</span>
                </span>
              </div>
              <hr className="line" />
              <div className="profile-card-row">
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
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default ProfileCard;
