import React from 'react';
import '../styles/profilepage-style.scss';
import editIcon from '../img/editButton.svg';

const TRAILER_CONSTANT = 'TRAILER';

const NONE_CONSTANT = 'None';

const displayClubs = (userClubs) => {
  let clubString = '';
  userClubs.forEach((club) => {
    clubString = clubString.concat(`${club.name}, `);
  });
  const clubs = clubString.length - 2 <= 0
    ? NONE_CONSTANT : clubString.substring(0, clubString.length - 2);
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

const ProfileCard = (props) => {
  if (!props.isEditing) {
    return (
      <div className="profile">
        <div className="profile-pic-container">
          <div className="profile-pic">
            <span className="user-initials">{getUserInitials(props.user.name)}</span>
          </div>
        </div>

        <div className="profile-card-body">
          <div className="profile-card-header">
            <div className="name-and-email">
              <div className="card-name">{props.user.name}</div>
              <div className="card-email">{props.user.email}</div>
            </div>
            {props.asProfilePage
              ? (
                <div className="button-place">
                  <input className="edit-button" type="image" src={editIcon} alt="edit button" onClick={props.startEditing} />
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
                {props.user.pronoun ? props.pronoun : 'Please fill out'}
              </span>
            </div>
            <hr className="line" />
            <div className="profile-card-row">
              <span className="card-headings">
                DASH
              </span>
              <span className="card-info">
                {props.user.dash_number ? props.user.dash_number : 'Please fill out'}
              </span>
            </div>
            <hr className="line" />
            <div className="profile-card-row">
              <span className="card-headings">
                Clothing Size
              </span>
              <span className="card-info">
                {props.user.clothe_size ? props.user.clothe_size : 'Please fill out'}
              </span>
            </div>
            <hr className="line" />
            <div className="profile-card-row">
              <span className="card-headings">
                Shoe Size
              </span>
              <span className="card-info">
                {props.user.shoe_size ? props.user.shoe_size : 'Please fill out'}
              </span>
            </div>
            <hr className="line" />
            <div className="profile-card-row">
              <span className="card-headings">
                Height
              </span>
              <span className="card-info">
                {props.user.height ? props.user.height : 'Please fill out'}
              </span>
            </div>
            <hr className="line" />
            <div className="profile-card-row">
              <span className="card-headings">
                Allergies/Dietary Restrictions
              </span>
              <span className="card-info">
                {props.user.allergies_dietary_restrictions ? props.user.allergies_dietary_restrictions : 'Please fill out'}
              </span>
            </div>
            <hr className="line" />
            <div className="profile-card-row">
              <span className="card-headings">
                Relevant Medical Conditions
              </span>
              <span className="card-info">
                {props.user.medical_conditions ? props.user.medical_conditions : 'Please fill out'}
              </span>
            </div>
            <hr className="line" />
            <div className="profile-card-row">
              <span className="card-headings">
                {props.asProfilePage && props.user.has_pending_cert_change ? 'Driver Certifications*' : 'Driver Certifications'}
              </span>
              <span className="card-info">
                {displayCertifications(props.user.driver_cert, props.user.trailer_cert)}
              </span>
            </div>
            {props.user.role !== 'OPO' ? <hr className="line" /> : null}
            {props.user.role !== 'OPO'
              ? (
                <div className="profile-card-row">
                  <span className="card-headings">
                    {props.asProfilePage && props.user.has_pending_leader_change ? 'DOC Leadership*' : 'DOC Leadership'}
                  </span>
                  <span className="card-info">
                    {displayClubs(props.user.leader_for)}
                  </span>
                </div>
              ) : null}
            <div className="pending-changes">
              {props.asProfilePage ? pendingChanges(props.user.has_pending_leader_change, props.user.has_pending_cert_change) : null}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="profile">
        <div className="profile-pic-container">
          <div className="profile-pic" />
        </div>

        <div className="profile-card-body">
          <div className="profile-card-header">
            <div className="name-and-email">
              <div className="card-name">
                <input
                  type="text"
                  name="name"
                  onChange={props.onFieldChange}
                  className={`my-form-control name-input ${props.errorFields.name ? 'vrf-error' : ''}`}
                  value={props.name}
                  placeholder="Name"
                />
              </div>
              <div className="card-email">
                <input
                  type="text"
                  name="email"
                  maxLength="50"
                  onChange={props.onFieldChange}
                  className={`my-form-control ${props.errorFields.email ? 'vrf-error' : ''}`}
                  value={props.email}
                  placeholder="Dartmouth email"
                />
              </div>
            </div>
            <div className="button-place">
              <span className="logout-button" onClick={props.updateUserInfo} role="button" tabIndex={0}>Save</span>
            </div>
          </div>
          <div className="profile-card-info">
            <div className="profile-card-row">
              <span className="card-headings">
                Pronouns
              </span>
              <span className="card-info">
                <input
                  className={`my-form-control ${props.errorFields.pronoun ? 'vrf-error' : ''}`}
                  type="text"
                  name="pronouns"
                  maxLength="50"
                  onChange={props.onFieldChange}
                  value={props.pronoun}
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
                  type="number"
                  id="dash_number"
                  name="dash_number"
                  maxLength="50"
                  onChange={props.onFieldChange}
                  className={`my-form-control ${props.errorFields.dash_number ? 'vrf-error' : ''}`}
                  value={props.dash_number}
                />
              </span>
            </div>
            <hr className="line" />
            <div className="profile-card-row">
              <span className="card-headings">
                Clothing Size
              </span>
              <span className="card-info">
                {props.getClotheForm()}
              </span>
            </div>
            <hr className="line" />
            <div className="profile-card-row">
              <span className="card-headings">
                Shoe Size
              </span>
              <span className="card-info">
              {props.getShoeGender()}
                <input
                  type="number"
                  name="shoe_size"
                  step="0.5"
                  onChange={props.onFieldChange}
                  className={`my-form-control ${props.errorFields.shoe_size ? 'vrf-error' : ''}`}
                  value={props.shoe_size}
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
                  onChange={props.onFieldChange}
                  className={`my-form-control ${props.errorFields.height ? 'vrf-error' : ''}`}
                  value={props.height}
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
                  className={`my-form-control ${props.errorFields.allergies_dietary_restrictions ? 'vrf-error' : ''}`}
                  type="text"
                  name="allergies_dietary_restrictions"
                  maxLength="50"
                  onChange={props.onFieldChange}
                  value={props.allergies_dietary_restrictions}
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
                  onChange={props.onFieldChange}
                  className={`my-form-control ${props.errorFields.medical ? 'vrf-error' : ''}`}
                  value={props.medical}
                />
                <span className="extra-info-message">This will only be visible to your trip leaders and OPO staff</span>
              </span>
            </div>
            <hr className="line" />
            <div className="profile-card-row">
              <span className="card-headings extra-info">
                Driver Certification(s)
                {props.displayCertificationFeedback()}
              </span>
              <span className="card-info extra-info">
                {props.getCertificationsForm()}
                <span className="extra-info-message">Please select your highest level of driver certification</span>
              </span>
            </div>
            <hr className="line" />
            <div className="profile-card-row">
              <span className="card-headings extra-info">
                DOC Leadership
                {props.displayLeaderFeedback()}
              </span>
              <span className="card-info">
                {props.getClubForm()}
              </span>
            </div>
            {/* {props.user.role !== 'OPO' ? <hr className="line" /> : null}
            {props.user.role !== 'OPO'
              ? (
                <div className="profile-card-row">
                  <span className="card-headings extra-info">
                    DOC Leadership
                    {props.displayLeaderFeedback()}
                  </span>
                  <span className="card-info">
                    {props.getClubForm()}
                  </span>
                </div>
              ) : null} */}
          </div>
        </div>
      </div>
    );
  }
};

export default ProfileCard;
