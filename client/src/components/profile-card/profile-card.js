// import { uploadImage } from '../s3';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import './profile.scss';
import Field from '../field';
import Icon from '../icon';
import Badge from '../badge';
import Text from '../text';
import { Stack, Queue, Divider, Box } from '../layout';

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
      showClubs: false,
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
        <div className='profile-photo-fit edit'>
          <img className='profile-photo' id='preview' alt='' src={this.props.user.photo_url} />
        </div>
      );
    } else if (this.state.preview != null) {
      return (
        <div className='profile-photo-fit edit'>
          <img className='profile-photo' id='preview' alt='' src={this.state.preview} />;
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    if (!this.props.isEditing && !this.props.completeProfileMode) {
      return (
        <div id='profile-card'>
          <Box dir='row' justify='center' align='center' id='profile-card-picture-and-name'>
            {this.props.user.name
              ? (
                <div className='profile-pic-container'>
                  <div className='profile-pic'>
                    { this.props.user.photo_url === ''
                      ? <span className='user-initials'>{this.getUserInitials(this.props.user.name)}</span>
                      : <div className='profile-photo-fit'><img className='profile-photo' id='photo' alt='' src={this.props.user.photo_url} /> </div>}
                  </div>
                </div>
              )
              : null
            }
            <Queue size={50} />
            {this.props.user.completedProfile
              ? (
                <Box dir='col' justify='between' id='profile-card-name'>
                  <Box dir='row'>
                    <Text type='h1'>{this.props.user.name}</Text>
                    {this.props.user.role === 'Leader'
                      ? (
                        <>
                          <Queue size={25} />
                          <Badge type='leader' size={36} dataTip dataFor='leader-status-badge' />
                          <ReactTooltip id='leader-status-badge' place='bottom'>You are a leader in DOC subclubs!</ReactTooltip>
                        </>
                      )
                      : null
                   }
                    {this.props.user.has_pending_leader_change
                      ? (
                        <>
                          <Queue size={25} />
                          <Badge type='person-pending' size={36} dataTip dataFor='leader-pending-badge' />
                          <ReactTooltip id='leader-pending-badge' place='bottom'>Your request to be a subclub leader is being reviewed by OPO staff</ReactTooltip>
                        </>
                      )
                      : null
                   }
                    {this.props.user.has_pending_cert_change
                      ? (
                        <>
                          <Queue size={25} />
                          <Badge type='pending' size={36} dataTip dataFor='cert-pending-badge' />
                          <ReactTooltip id='cert-pending-badge' place='bottom'>Your request for vehicle certifications is being reviewed by OPO staff</ReactTooltip>
                        </>
                      )
                      : null
                   }
                  </Box>
                  <Stack size={15} />
                  <Box dir='row' align='center'>
                    <Icon type='email' size={18} />
                    <Queue size={15} />
                    <div className='p1 gray'>{this.props.user.email}</div>
                  </Box>
                </Box>
              )
              : (
                <div id='profile-card-incomplete-notice' className='doc-h1'>
                  Incomplete profile
                </div>
              )
            }
            <Queue size={50} />
          </Box>
          <Stack size={25} />
          <Divider size={1} />
          <Stack size={25} />
          <div id='profile-card-info'>
            <Box className='profile-card-row'>
              <Text type='h3' color='gray3'>
                Pronouns
              </Text>
              <Text type='p2' color='gray3'>
                {this.props.user.pronoun ? this.props.user.pronoun : 'Please fill out'}
              </Text>
            </Box>
            <Stack size={15} />
            <Box className='profile-card-row'>
              <Text type='h3' color='gray3'>
                DASH
              </Text>
              <Text type='p2' color='gray3'>
                {this.props.user.dash_number ? this.props.user.dash_number : 'Please fill out'}
              </Text>
            </Box>
            <Stack size={15} />
            <Box className='profile-card-row'>
              <Text type='h3' color='gray3'>
                Clothing Size
              </Text>
              <Text type='p2' color='gray3'>
                {this.props.user.clothe_size ? this.props.user.clothe_size : 'Please fill out'}
              </Text>
            </Box>
            <Stack size={15} />
            <Box className='profile-card-row'>
              <Text type='h3' color='gray3'>
                Shoe Size
              </Text>
              <Text type='p2' color='gray3'>
                {this.props.user.shoe_size ? this.props.user.shoe_size : 'Please fill out'}
              </Text>
            </Box>
            <Stack size={15} />
            <Box className='profile-card-row'>
              <Text type='h3' color='gray3'>
                Height
              </Text>
              <Text type='p2' color='gray3'>
                {this.props.user.height ? this.props.user.height : 'Please fill out'}
              </Text>
            </Box>
            <Stack size={15} />
            <Box className='profile-card-row'>
              <Text type='h3' color='gray3'>
                Allergies/Dietary Restrictions
              </Text>
              <Text type='p2' color='gray3'>
                {this.props.user.allergies_dietary_restrictions ? this.props.user.allergies_dietary_restrictions : 'Please fill out'}
              </Text>
            </Box>
            <Stack size={15} />
            <Box className='profile-card-row'>
              <Text type='h3' color='gray3'>
                Relevant Medical Conditions
              </Text>
              <Text type='p2' color='gray3'>
                {this.props.user.medical_conditions ? this.props.user.medical_conditions : 'Please fill out'}
              </Text>
            </Box>
            <Stack size={15} />
            <Box className='profile-card-row'>
              <Text type='h3' color='gray3'>
                {(this.props.asProfilePage || this.props.completeProfileMode) && this.props.user.has_pending_cert_change ? 'Driver Certifications*' : 'Driver Certifications'}
              </Text>
              <Text type='p2' color='gray3'>
                {displayCertifications(this.props.user.driver_cert, this.props.user.trailer_cert, this.props.user.has_pending_cert_change)}
              </Text>
            </Box>
            {this.props.user.role !== 'OPO' ? <Stack size={15} /> : null}
            {this.props.user.role !== 'OPO'
              ? (
                <Box className='profile-card-row'>
                  <Text type='h3' color='gray3'>
                    {(this.props.asProfilePage || this.props.completeProfileMode) && this.props.user.has_pending_leader_change ? 'DOC Leadership*' : 'DOC Leadership'}
                  </Text>
                  <div id='profile-card-clubs' className='card-info p2' onClick={() => this.setState(prevState => ({ showClubs: !prevState.showClubs }))} role='button' tabIndex={0}>
                    Leader in {this.props.user.leader_for.length} sub-clubs
                  </div>
                </Box>
              ) : null}
            {this.state.showClubs
              ? (
                <Box className='profile-card-row'>
                  <div id='profile-card-clubs-all' className='card-info p2'>
                    {displayClubs(this.props.user.leader_for, this.props.user.has_pending_leader_change)}
                  </div>
                </Box>
              )
              : null
              }
          </div>
          {this.props.asProfilePage
            ? (
              <>
                <Stack size={25} />
                <Divider size={1} />
                <Stack size={25} />
                <Box dir='row' justify='center'>
                  <div className='doc-button alarm' onClick={this.props.signOut} role='button' tabIndex={0}>Logout</div>
                  <Queue size={50} />
                  <div className='doc-button hollow' onClick={this.props.startEditing} role='button' tabIndex={0}>Edit profile</div>
                </Box>
              </>
            )
            : null
          }
        </div>
      );
    } else {
      const name = this.props.user.name || this.props.user.casID.split(' ')[0];
      return (
        <div id='profile-card'>
          <Box dir='row' justify='center' align='center' id='profile-card-picture-and-name'>
            {this.props.user.name || this.props.user.casID
              ? (
                <div className='profile-pic-container profile-pic-container-edit'>
                  <label>
                    <div id='profile-pic-upload-text'>Change</div>
                    <div className='profile-pic edit'>
                      {!(this.state.preview != null || this.props.user.photo_url != null) ? <span className='user-initials'>{this.getUserInitials(name)}</span> : this.displayImageEditing()}
                      <input type='file' name='coverImage' onChange={this.onImageUpload} />
                    </div>
                  </label>
                </div>
              )
              : null
            }
            <Queue size={50} />
            <Box dir='col' id='profile-card-name'>
              <Text type='p2'>
                <Field
                  type='text'
                  name='name'
                  onChange={this.props.onFieldChange}
                  value={this.props.name}
                  placeholder='Name'
                  error={this.props.errorFields.name}
                />
              </Text>
              <Stack size={5} />
              <Text type='p2'>
                <Field
                  type='text'
                  name='email'
                  maxLength='50'
                  onChange={this.props.onFieldChange}
                  value={this.props.email}
                  placeholder='Dartmouth email'
                  error={this.props.errorFields.email}
                />
              </Text>
            </Box>
            <Queue size={50} />
          </Box>
          <Stack size={25} />
          <Divider size={1} />
          <Stack size={25} />
          <div id='profile-card-info'>
            <Box className='profile-card-row'>
              <Text type='h3' color='gray3'>
                Pronouns
              </Text>
              <Text type='p2' color='gray3'>
                <Field
                  type='text'
                  name='pronoun'
                  placeholder='xx / xx / xx'
                  maxLength='50'
                  onChange={this.props.onFieldChange}
                  value={this.props.pronoun}
                  error={this.props.errorFields.pronoun}
                />
              </Text>
            </Box>
            <Stack size={5} />
            <Box className='profile-card-row'>
              <Text type='h3' color='gray3'>
                DASH
              </Text>
              <Text type='p2' color='gray3'>
                <Field
                  type='number'
                  id='dash_number'
                  name='dash_number'
                  maxLength='50'
                  placeholder='e.g. 100291029'
                  onChange={this.props.onFieldChange}
                  value={this.props.dash_number}
                  error={this.props.errorFields.dash_number}
                />
              </Text>
            </Box>
            <Stack size={5} />
            <Box className='profile-card-row'>
              <Text type='h3' color='gray3'>
                Clothing Size
              </Text>
              <Text type='p2' color='gray3'>
                {this.props.renderClothingSizeSelection()}
              </Text>
            </Box>
            <Stack size={5} />
            <Box className='profile-card-row'>
              <Text type='h3' color='gray3'>
                Shoe Size
              </Text>
              <Text type='p2' color='gray3'>
                {this.props.renderShoeSizeSelection()}
              </Text>
            </Box>
            <Stack size={5} />
            <Box className='profile-card-row'>
              <Text type='h3' color='gray3'>
                Height
              </Text>
              <Text type='p2' color='gray3'>
                <Field
                  type='text'
                  name='height'
                  onChange={this.props.onFieldChange}
                  value={this.props.height}
                  placeholder={'e.g. 5\'2"'}
                  error={this.props.errorFields.height}
                />
              </Text>
            </Box>
            <Stack size={5} />
            <Box className='profile-card-row'>
              <Text type='h3' color='gray3'>
                Allergies/Dietary Restrictions
              </Text>
              <Text type='p2' color='gray3'>
                <Field
                  className={`field ${this.props.errorFields.allergies_dietary_restrictions ? '' : ''}`}
                  type='text'
                  name='allergies_dietary_restrictions'
                  placeholder="Put 'none' if so"
                  onChange={this.props.onFieldChange}
                  value={this.props.allergies_dietary_restrictions}
                  error={this.props.errorFields.allergies_dietary_restrictions}
                />
              </Text>
            </Box>
            <Stack size={5} />
            <Box className='profile-card-row'>
              <Text type='h3' color='gray3'>
                Relevant Medical Conditions
              </Text>
              <Text type='p2' color='gray3'>
                <Field
                  type='text'
                  name='medical'
                  placeholder="Put 'none' if so"
                  onChange={this.props.onFieldChange}
                  value={this.props.medical}
                  dataTip
                  dataFor='medical-conditions-tooltip'
                  error={this.props.errorFields.medical}
                />
                <ReactTooltip id='medical-conditions-tooltip' place='right'>This will only be visible to your trip leaders and OPO staff</ReactTooltip>
              </Text>
            </Box>
            <Stack size={5} />
            <Box className='profile-card-row'>
              <Text type='h3' color='gray3'>
                Driver Certification(s)
                {/* {this.props.displayCeTextficationFeedback()} */}
              </Text>
              <Text type='p2' color='gray3'>
                {this.props.getCertificationsForm()}
                <ReactTooltip id='driver-certification-tooltip' place='right'>Please select your highest level of driver certification</ReactTooltip>
              </Text>
            </Box>
            <Stack size={5} />
            <Box className='profile-card-row'>
              <Text type='h3' color='gray3'>
                DOC Leadership
                {/* {this.props.displayLeTextrFeedback()} */}
              </Text>
              <Text type='p2' color='gray3'>
                {this.props.getClubForm()}
              </Text>
            </Box>
            {/* {this.props.user.role !== 'OPO' ? <Stack size={5} /> : null}
            {this.props.user.role !== 'OPO'
              ? (
                <Box className="profile-card-row">
                  <div className="card-headings doc-h3">
                    DOC Leadership
                    {this.props.displayLeaderFeedback()}
                  </div>
                  <div className="card-info p2">
                    {this.props.getClubForm()}
                  </div>
                </div>
              ) : null} */}
          </div>
          <Stack size={25} />
          <Divider size={1} />
          <Stack size={25} />
          {this.props.completeProfileMode
            ? (
              <Box dir='row' justify='center'>
                <div className='doc-button' role='button' tabIndex={0} onClick={() => this.props.updateUserInfo(this.state.file, true)}>Finish</div>
              </Box>
            )
            : (
              <Box dir='row' justify='center'>
                <div className='doc-button alarm' onClick={this.props.cancelChanges} role='button' tabIndex={0}>Cancel</div>
                <Queue size={50} />
                <div className='doc-button' onClick={() => this.props.updateUserInfo(this.state.file, false)} role='button' tabIndex={0}>Save</div>
              </Box>
            )
          }
        </div>
      );
    }
  }
}

export default ProfileCard;
