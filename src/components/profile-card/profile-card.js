// import { uploadImage } from '../s3';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import './profile.scss';
import leaderBadge from './leader-badge.svg';
import leaderPendingBadge from './leader-pending-badge.svg';
import editIcon from './edit-profile.svg';
import saveIcon from './save-profile.svg';

const TRAILER_CONSTANT = 'TRAILER';

const NONE_CONSTANT = 'None';

const displayClubs = (userClubs, hasPendingLeaderChange) => {
  if (hasPendingLeaderChange) return ['Pending OPO approval'];
  else {
    let clubString = '';
    userClubs.forEach((club) => {
      clubString = clubString.concat(`${club.name}, `);
    });
    const clubs = clubString.length - 2 <= 0 ? NONE_CONSTANT : clubString.substring(0, clubString.length - 2);
    return clubs;
  }
};

const displayCertifications = (driverCert, trailerCert, hasPendingCertChange) => {
  let certifications = '';
  if (hasPendingCertChange) {
    certifications = 'Pending OPO approval';
  } else if (driverCert === null && !trailerCert) {
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

class ProfileCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preview: null,
      file: null,
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

  getUserInitials = (userName) => {
    const names = userName.split(' ');
    const firstInitial = names[0].split('')[0];
    const lastInitial = names.length > 1 ? names[names.length - 1].split('')[0] : '';
    return `${firstInitial}${lastInitial}`;
  };

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
    if (!this.props.isEditing && !this.props.completeProfileMode) {
      return (
        <div id="profile-card">
          <div id="profile-card-picture-and-name">
            {this.props.user.name
              ? (
                <div className="profile-pic-container">
                  <div className="profile-pic">
                    <span className="user-initials">{this.props.user.photo_url === '' ? this.getUserInitials(this.props.user.name) : null}</span>
                    { this.props.user.photo_url === '' ? null : <div className="profile-photo-fit"><img className="profile-photo" id="photo" alt="" src={this.props.user.photo_url} /> </div>}
                  </div>
                </div>
              )
              : null
            }
            {this.props.user.completedProfile
              ? (
                <div id="profile-card-name">
                  <div className="h1">
                    {this.props.user.name}
                    {this.props.user.role === 'Leader'
                      ? <img src={leaderBadge} alt="leader badge" />
                      : null
                   }
                    {this.props.user.has_pending_leader_change
                      ? <img src={leaderPendingBadge} alt="leader pending badge" />
                      : null
                   }
                  </div>
                  <div className="p1">{`Email: ${this.props.user.email}`}</div>
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
                <input className="profile-card-edit-toggle" type="image" src={editIcon} alt="edit button" onClick={this.props.startEditing} />
              )
              : null
            }
          </div>
          <hr />
          <div id="profile-card-info">
            <div className="profile-card-row">
              <div className="card-headings h3">
                Pronouns
              </div>
              <div className="card-info p1">
                {this.props.user.pronoun ? this.props.user.pronoun : 'Please fill out'}
              </div>
            </div>
            <hr />
            <div className="profile-card-row">
              <div className="card-headings h3">
                DASH
              </div>
              <div className="card-info p1">
                {this.props.user.dash_number ? this.props.user.dash_number : 'Please fill out'}
              </div>
            </div>
            <hr />
            <div className="profile-card-row">
              <div className="card-headings h3">
                Clothing Size
              </div>
              <div className="card-info p1">
                {this.props.user.clothe_size ? this.props.user.clothe_size : 'Please fill out'}
              </div>
            </div>
            <hr />
            <div className="profile-card-row">
              <div className="card-headings h3">
                Shoe Size
              </div>
              <div className="card-info p1">
                {this.props.user.shoe_size ? this.props.user.shoe_size : 'Please fill out'}
              </div>
            </div>
            <hr />
            <div className="profile-card-row">
              <div className="card-headings h3">
                Height
              </div>
              <div className="card-info p1">
                {this.props.user.height ? this.props.user.height : 'Please fill out'}
              </div>
            </div>
            <hr />
            <div className="profile-card-row">
              <div className="card-headings h3">
                Allergies/Dietary Restrictions
              </div>
              <div className="card-info p1">
                {this.props.user.allergies_dietary_restrictions ? this.props.user.allergies_dietary_restrictions : 'Please fill out'}
              </div>
            </div>
            <hr />
            <div className="profile-card-row">
              <div className="card-headings h3">
                Relevant Medical Conditions
              </div>
              <div className="card-info p1">
                {this.props.user.medical_conditions ? this.props.user.medical_conditions : 'Please fill out'}
              </div>
            </div>
            <hr />
            <div className="profile-card-row">
              <div className="card-headings h3">
                {(this.props.asProfilePage || this.props.completeProfileMode) && this.props.user.has_pending_cert_change ? 'Driver Certifications*' : 'Driver Certifications'}
              </div>
              <div className="card-info p1">
                {displayCertifications(this.props.user.driver_cert, this.props.user.trailer_cert, this.props.user.has_pending_cert_change)}
              </div>
            </div>
            {this.props.user.role !== 'OPO' ? <hr /> : null}
            {this.props.user.role !== 'OPO'
              ? (
                <div className="profile-card-row">
                  <div className="card-headings h3">
                    {(this.props.asProfilePage || this.props.completeProfileMode) && this.props.user.has_pending_leader_change ? 'DOC Leadership*' : 'DOC Leadership'}
                  </div>
                  <div className="card-info p1">
                    {displayClubs(this.props.user.leader_for, this.props.user.has_pending_leader_change)}
                  </div>
                </div>
              ) : null}
          </div>
        </div>
      );
    } else {
      const name = this.props.user.name || this.props.user.casID.split(' ')[0];
      return (
        <div id="profile-card">
          <div id="profile-card-picture-and-name">
            {this.props.user.name || this.props.user.casID
              ? (
                <div className="profile-pic-container">
                  <div className="profile-pic">
                    <label className="user-initials">
                      {(this.state.preview == null || this.props.user.photo_url == null) ? this.getUserInitials(name) : null}
                      <input type="file" name="coverImage" onChange={this.onImageUpload} />
                    </label>
                    { this.displayImageEditing()}
                  </div>
                  {/* <label className="custom-file-upload"> */}
                  {/* </label> */}
                </div>
              )
              : null
            }
            <div id="profile-card-name">
              <div className="h1">
                <input
                  type="text"
                  name="name"
                  onChange={this.props.onFieldChange}
                  className={`field name-input ${this.props.errorFields.name ? 'vrf-error' : ''}`}
                  value={this.props.name}
                  placeholder="Name"
                />
              </div>
              <div className="p1">
                <input
                  type="text"
                  name="email"
                  maxLength="50"
                  onChange={this.props.onFieldChange}
                  className={`field ${this.props.errorFields.email ? 'vrf-error' : ''}`}
                  value={this.props.email}
                  placeholder="Dartmouth email"
                />
              </div>
            </div>
            {this.props.asProfilePage
              ? <input className="profile-card-edit-toggle" type="image" src={saveIcon} alt="save button" onClick={() => this.props.updateUserInfo(this.state.file, false)} />
              : null
          }
          </div>
          <hr />
          <div id="profile-card-info">
            <div className="profile-card-row">
              <div className="card-headings h3">
                Pronouns
              </div>
              <div className="card-info p1">
                <input
                  className={`field ${this.props.errorFields.pronoun ? 'vrf-error' : ''}`}
                  type="text"
                  name="pronoun"
                  maxLength="50"
                  onChange={this.props.onFieldChange}
                  value={this.props.pronoun}
                />
              </div>
            </div>
            <hr />
            <div className="profile-card-row">
              <div className="card-headings h3">
                DASH
              </div>
              <div className="card-info p1">
                <input
                  // type="number"
                  id="dash_number"
                  name="dash_number"
                  maxLength="50"
                  onChange={this.props.onFieldChange}
                  className={`field ${this.props.errorFields.dash_number ? 'vrf-error' : ''}`}
                  value={this.props.dash_number}
                />
              </div>
            </div>
            <hr />
            <div className="profile-card-row">
              <div className="card-headings h3">
                Clothing Size
              </div>
              <div className="card-info p1">
                {this.props.renderClothingSizeSelection()}
              </div>
            </div>
            <hr />
            <div className="profile-card-row">
              <div className="card-headings h3">
                Shoe Size
              </div>
              <div className="card-info p1">
                {this.props.renderShoeSizeSelection()}
              </div>
            </div>
            <hr />
            <div className="profile-card-row">
              <div className="card-headings h3">
                Height
              </div>
              <div className="card-info p1">
                <input
                  type="text"
                  name="height"
                  onChange={this.props.onFieldChange}
                  className={`field ${this.props.errorFields.height ? 'vrf-error' : ''}`}
                  value={this.props.height}
                  placeholder={'e.g. 5\'2"'}
                />
              </div>
            </div>
            <hr />
            <div className="profile-card-row">
              <div className="card-headings h3">
                Allergies/Dietary Restrictions
              </div>
              <div className="card-info p1">
                <input
                  className={`field ${this.props.errorFields.allergies_dietary_restrictions ? 'vrf-error' : ''}`}
                  type="text"
                  name="allergies_dietary_restrictions"
                  maxLength="50"
                  onChange={this.props.onFieldChange}
                  value={this.props.allergies_dietary_restrictions}
                />
              </div>
            </div>
            <hr />
            <div className="profile-card-row">
              <div className="card-headings h3">
                Relevant Medical Conditions
              </div>
              <div className="card-info p1 extra-info">
                <input
                  type="text"
                  name="medical"
                  maxLength="50"
                  onChange={this.props.onFieldChange}
                  className={`field ${this.props.errorFields.medical ? 'vrf-error' : ''}`}
                  value={this.props.medical}
                  data-tip="medical-conditions-tooltip"
                />
                <ReactTooltip data-for="medical-conditions-tooltip">This will only be visible to your trip leaders and OPO staff</ReactTooltip>
              </div>
            </div>
            <hr />
            <div className="profile-card-row">
              <div className="card-headings h3 extra-info">
                Driver Certification(s)
                {/* {this.props.displayCertificationFeedback()} */}
              </div>
              <div className="card-info p1 extra-info">
                {this.props.getCertificationsForm()}
                <ReactTooltip data-for="driver-certification-tooltip">Please select your highest level of driver certification</ReactTooltip>
              </div>
            </div>
            <hr />
            <div className="profile-card-row">
              <div className="card-headings h3 extra-info">
                DOC Leadership
                {/* {this.props.displayLeaderFeedback()} */}
              </div>
              <div className="card-info p1">
                {this.props.getClubForm()}
              </div>
            </div>
            {/* {this.props.user.role !== 'OPO' ? <hr /> : null}
            {this.props.user.role !== 'OPO'
              ? (
                <div className="profile-card-row">
                  <div className="card-headings h3 extra-info">
                    DOC Leadership
                    {this.props.displayLeaderFeedback()}
                  </div>
                  <div className="card-info p1">
                    {this.props.getClubForm()}
                  </div>
                </div>
              ) : null} */}
          </div>
          {this.props.completeProfileMode
            ? <div className="doc-button" role="button" tabIndex={0} src={saveIcon} onClick={() => this.props.updateUserInfo(this.state.file, true)}>Finish</div>
            : null
          }
        </div>
      );
    }
  }
}

export default ProfileCard;
