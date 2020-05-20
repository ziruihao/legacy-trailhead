import React from 'react';
import ReactTooltip from 'react-tooltip';
import './profile.scss';
import leaderBadge from './leader-badge.svg';
import leaderPendingBadge from './leader-pending-badge.svg';
import editIcon from './edit-profile.svg';
import saveIcon from './save-profile.svg';

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

const getUserInitials = (userName) => {
  const names = userName.split(' ');
  const firstInitial = names[0].split('')[0];
  const lastInitial = names.length > 1 ? names[names.length - 1].split('')[0] : '';
  return `${firstInitial}${lastInitial}`;
};

const ProfileCard = (props) => {
  if (!props.isEditing) {
    return (
      <div id="profile-card">
        <div id="profile-card-picture-and-name">
          {props.user.name
            ? (
              <div id="profile-card-picture">
                <span className="user-initials">{getUserInitials(props.user.name)}</span>
              </div>
            )
            : null
          }
          {props.user.completedProfile
            ? (
              <div id="profile-card-name">
                <div className="h1">
                  {props.user.name}
                  {props.user.role === 'Leader'
                    ? <img src={leaderBadge} alt="leader badge" />
                    : null
                   }
                  {props.user.has_pending_leader_change
                    ? <img src={leaderPendingBadge} alt="leader pending badge" />
                    : null
                   }
                </div>
                <div className="p1">{`Email: ${props.user.email}`}</div>
              </div>
            )
            : (
              <div id="profile-card-incomplete-notice" className="h1">
                Incomplete profile
              </div>
            )
          }
          {props.asProfilePage
            ? (
              <input className="profile-card-edit-toggle" type="image" src={editIcon} alt="edit button" onClick={props.startEditing} />
            )
            : null}
        </div>
        <hr />
        <div id="profile-card-info">
          <div className="profile-card-row">
            <div className="card-headings h3">
              Pronouns
            </div>
            <div className="card-info p1">
              {props.user.pronoun ? props.user.pronoun : 'Please fill out'}
            </div>
          </div>
          <hr />
          <div className="profile-card-row">
            <div className="card-headings h3">
              DASH
            </div>
            <div className="card-info p1">
              {props.user.dash_number ? props.user.dash_number : 'Please fill out'}
            </div>
          </div>
          <hr />
          <div className="profile-card-row">
            <div className="card-headings h3">
              Clothing Size
            </div>
            <div className="card-info p1">
              {props.user.clothe_size ? props.user.clothe_size : 'Please fill out'}
            </div>
          </div>
          <hr />
          <div className="profile-card-row">
            <div className="card-headings h3">
              Shoe Size
            </div>
            <div className="card-info p1">
              {props.user.shoe_size ? props.user.shoe_size : 'Please fill out'}
            </div>
          </div>
          <hr />
          <div className="profile-card-row">
            <div className="card-headings h3">
              Height
            </div>
            <div className="card-info p1">
              {props.user.height ? props.user.height : 'Please fill out'}
            </div>
          </div>
          <hr />
          <div className="profile-card-row">
            <div className="card-headings h3">
              Allergies/Dietary Restrictions
            </div>
            <div className="card-info p1">
              {props.user.allergies_dietary_restrictions ? props.user.allergies_dietary_restrictions : 'Please fill out'}
            </div>
          </div>
          <hr />
          <div className="profile-card-row">
            <div className="card-headings h3">
              Relevant Medical Conditions
            </div>
            <div className="card-info p1">
              {props.user.medical_conditions ? props.user.medical_conditions : 'Please fill out'}
            </div>
          </div>
          <hr />
          <div className="profile-card-row">
            <div className="card-headings h3">
              {props.asProfilePage && props.user.has_pending_cert_change ? 'Driver Certifications*' : 'Driver Certifications'}
            </div>
            <div className="card-info p1">
              {displayCertifications(props.user.driver_cert, props.user.trailer_cert, props.user.has_pending_cert_change)}
            </div>
          </div>
          {props.user.role !== 'OPO' ? <hr /> : null}
          {props.user.role !== 'OPO'
            ? (
              <div className="profile-card-row">
                <div className="card-headings h3">
                  {props.asProfilePage && props.user.has_pending_leader_change ? 'DOC Leadership*' : 'DOC Leadership'}
                </div>
                <div className="card-info p1">
                  {displayClubs(props.user.leader_for)}
                </div>
              </div>
            ) : null}
        </div>
      </div>
    );
  } else {
    return (
      <div id="profile-card">
        <div id="profile-card-picture-and-name">
          {props.user.name
            ? (
              <div id="profile-card-picture">
                <span className="user-initials">{getUserInitials(props.user.name)}</span>
              </div>
            )
            : null
          }
          <div id="profile-card-name">
            <div className="h1">
              <input
                type="text"
                name="name"
                onChange={props.onFieldChange}
                className={`field name-input ${props.errorFields.name ? 'vrf-error' : ''}`}
                value={props.name}
                placeholder="Name"
              />
            </div>
            <div className="p1">
              <input
                type="text"
                name="email"
                maxLength="50"
                onChange={props.onFieldChange}
                className={`field ${props.errorFields.email ? 'vrf-error' : ''}`}
                value={props.email}
                placeholder="Dartmouth email"
              />
            </div>
          </div>
          <input className="profile-card-edit-toggle" type="image" src={saveIcon} alt="save button" onClick={props.updateUserInfo} />
        </div>
        <hr />
        <div id="profile-card-info">
          <div className="profile-card-row">
            <div className="card-headings h3">
              Pronouns
            </div>
            <div className="card-info p1">
              <input
                className={`field ${props.errorFields.pronoun ? 'vrf-error' : ''}`}
                type="text"
                name="pronoun"
                maxLength="50"
                onChange={props.onFieldChange}
                value={props.pronoun}
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
                onChange={props.onFieldChange}
                className={`field ${props.errorFields.dash_number ? 'vrf-error' : ''}`}
                value={props.dash_number}
              />
            </div>
          </div>
          <hr />
          <div className="profile-card-row">
            <div className="card-headings h3">
              Clothing Size
            </div>
            <div className="card-info p1">
              {props.renderClothingSizeSelection()}
            </div>
          </div>
          <hr />
          <div className="profile-card-row">
            <div className="card-headings h3">
              Shoe Size
            </div>
            <div className="card-info p1">
              {props.renderShoeSizeSelection()}
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
                onChange={props.onFieldChange}
                className={`field ${props.errorFields.height ? 'vrf-error' : ''}`}
                value={props.height}
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
                className={`field ${props.errorFields.allergies_dietary_restrictions ? 'vrf-error' : ''}`}
                type="text"
                name="allergies_dietary_restrictions"
                maxLength="50"
                onChange={props.onFieldChange}
                value={props.allergies_dietary_restrictions}
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
                onChange={props.onFieldChange}
                className={`field ${props.errorFields.medical ? 'vrf-error' : ''}`}
                value={props.medical}
                data-tip="medical-conditions-tooltip"
              />
              <ReactTooltip data-for="medical-conditions-tooltip">This will only be visible to your trip leaders and OPO staff</ReactTooltip>
            </div>
          </div>
          <hr />
          <div className="profile-card-row">
            <div className="card-headings h3 extra-info">
              Driver Certification(s)
              {props.displayCertificationFeedback()}
            </div>
            <div className="card-info p1 extra-info">
              {props.getCertificationsForm()}
              <ReactTooltip data-for="driver-certification-tooltip">Please select your highest level of driver certification</ReactTooltip>
            </div>
          </div>
          <hr />
          <div className="profile-card-row">
            <div className="card-headings h3 extra-info">
              DOC Leadership
              {props.displayLeaderFeedback()}
            </div>
            <div className="card-info p1">
              {props.getClubForm()}
            </div>
          </div>
          {/* {props.user.role !== 'OPO' ? <hr /> : null}
            {props.user.role !== 'OPO'
              ? (
                <div className="profile-card-row">
                  <div className="card-headings h3 extra-info">
                    DOC Leadership
                    {props.displayLeaderFeedback()}
                  </div>
                  <div className="card-info p1">
                    {props.getClubForm()}
                  </div>
                </div>
              ) : null} */}
        </div>
      </div>
    );
  }
};

export default ProfileCard;
