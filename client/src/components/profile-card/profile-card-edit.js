import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import * as s3 from '../s3';
import Field from '../field';
import { Stack, Queue, Divider, Box } from '../layout';
import DOCLoading from '../doc-loading';
import { appError, clearError, updateUser, getClubs, signOut, getUser, authUser } from '../../actions';
import ProfileCard from './profile-card';
import utils from '../../utils';
import dropdownIcon from '../../img/dropdown-toggle.svg';
import './profile.scss';

class ProfileCardEdit extends Component {
  TRAILER_CONSTANT = 'TRAILER';

  CERTIFICATION_CONSTANT = 'CERTIFICATION';

  NONE_CONSTANT = 'NONE';

  CERTIFICATIONS = [null, 'MICROBUS', 'VAN'];

  errorFields = {
    email: false,
    name: false,
    pronoun: false,
    dash_number: false,
    allergies_dietary_restrictions: false,
    medical: false,
    height: false,
    gender_shoe: false,
    shoe_size: false,
    gender_clothes: false,
    clothe_size: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      pronoun: '',
      dash_number: '',
      allergies_dietary_restrictions: '',
      medical: '',
      height: '',
      gender_shoe: '',
      shoe_size: '',
      gender_clothes: '',
      photo_url: '',
      clothe_size: '',
      clubsList: [],
      driver_cert: null,
      trailer_cert: false,
      ready: false,
      errorFields: this.errorFields,
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
  }

  componentDidMount() {
    if (this.props.user) {
      const { user } = this.props;
      this.setState({
        name: user.name ? user.name : '',
        email: user.email ? user.email : '',
        pronoun: user.pronoun ? user.pronoun : '',
        dash_number: user.dash_number ? user.dash_number : '',
        allergies_dietary_restrictions: user.allergies_dietary_restrictions ? user.allergies_dietary_restrictions : '',
        medical: user.medical_conditions ? user.medical_conditions : '',
        height: user.height ? user.height : '',
        gender_clothes: user.clothe_size ? user.clothe_size.split('-')[0] : '',
        clothe_size: user.clothe_size ? user.clothe_size.split('-').pop() : '',
        gender_shoe: user.shoe_size ? user.shoe_size.split('-')[0] : '',
        shoe_size: user.shoe_size ? user.shoe_size.split('-').pop() : '',
        photo_url: user.photo_url ? user.photo_url : '',
        clubsList: user.has_pending_leader_change ? user.requested_clubs : user.leader_for,
        driver_cert: user.has_pending_cert_change ? user.requested_certs.driver_cert : user.driver_cert,
        trailer_cert: user.has_pending_cert_change ? user.requested_certs.trailer_cert : user.trailer_cert,
      });
    }
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
      this.setState((prevState) => {
        const updates = {};
        updates[event.target.name] = event.target.value;
        updates.errorFields = Object.assign({}, prevState.errorFields, { [event.target.name]: utils.isStringEmpty(event.target.value) });
        return updates;
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

  onClotheSizeChange = (eventKey) => {
    this.setState((prevState) => {
      const updates = {};
      updates.clothe_size = eventKey;
      updates.errorFields = Object.assign({}, prevState.errorFields, { clothe_size: utils.isStringEmpty(eventKey) });
      return updates;
    });
  }

  onClotheGenderChange = (eventKey) => {
    this.setState((prevState) => {
      const updates = {};
      updates.gender_clothes = eventKey;
      updates.errorFields = Object.assign({}, prevState.errorFields, { gender_clothes: utils.isStringEmpty(eventKey) });
      return updates;
    });
  }

  onShoeGenderChange = (eventKey) => {
    this.setState((prevState) => {
      const updates = {};
      updates.gender_shoe = eventKey;
      updates.errorFields = Object.assign({}, prevState.errorFields, { gender_shoe: utils.isStringEmpty(eventKey) });
      return updates;
    });
  }

  startEditing = () => {
    this.setState({ isEditing: true });
  }

  cancelChanges = () => {
    this.setState({ isEditing: false });
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
      const checked = currentClubIds.includes(club._id);
      return (
        <div className='club-option' key={club._id}>
          <label className='checkbox-container club-checkbox' htmlFor={club._id}>
            <input
              type='checkbox'
              name='club'
              id={club._id}
              value={club.name}
              onChange={this.onFieldChange}
              checked={checked}
            />
            <span className='checkmark' />
          </label>
          <span>{club.name}</span>
        </div>
      );
    });
    return (
      <Dropdown>
        <Dropdown.Toggle className='field p2'>
          <span className='field-dropdown-bootstrap'>Leader in {this.state.clubsList.length} clubs</span>
          <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
        </Dropdown.Toggle>
        <Dropdown.Menu className='field-dropdown-menu profile-club-options'>
          {clubForm}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  getCertificationsForm = () => {
    const trailer = (
      <div className='club-option p2'>
        <label className='checkbox-container club-checkbox' htmlFor={this.TRAILER_CONSTANT}>
          <input
            type='checkbox'
            name={this.TRAILER_CONSTANT}
            id={this.TRAILER_CONSTANT}
            value={this.TRAILER_CONSTANT}
            onChange={this.onDriverCertChange}
            checked={this.state.trailer_cert}
          />
          <span className='checkmark' />
        </label>
        <span>{this.TRAILER_CONSTANT}</span>
      </div>
    );

    const certificationForm = this.CERTIFICATIONS.map((certification) => {
      const checked = certification === this.state.driver_cert;
      certification = certification === null ? this.NONE_CONSTANT : certification;
      return (
        <div className='club-option p2' key={certification}>
          <label className='checkbox-container club-checkbox' htmlFor={certification}>
            <input
              type='radio'
              name={this.CERTIFICATION_CONSTANT}
              id={certification}
              value={certification}
              onChange={this.onDriverCertChange}
              checked={checked}
            />
            <span className='radio-button' />
          </label>
          <span>{certification}</span>
        </div>
      );
    });
    return (
      <Dropdown>
        <Dropdown.Toggle className='field p2' data-tip data-for='driver-certification-tooltip'>
          <span className='field-dropdown-bootstrap'>{this.displaySelectedCertifications()}</span>
          <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
        </Dropdown.Toggle>
        <Dropdown.Menu className='field-dropdown-menu'>
          {certificationForm}
          <Dropdown.Divider />
          {trailer}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  getClotheForm = () => {
    return (
      <div>
        <Dropdown onSelect={this.onClotheGenderChange}>
          <Dropdown.Toggle className={`field p2 ${this.state.errorFields.gender_clothes ? '' : ''}`}>
            <span className={`selected-size ${utils.isStringEmpty(this.state.gender_clothes) ? 'no-date' : ''}`}>
              {utils.isStringEmpty(this.state.gender_clothes) ? 'Select' : this.state.gender_clothes}
            </span>
            <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
          </Dropdown.Toggle>
          <Dropdown.Menu className='field-dropdown-menu'>
            <Dropdown.Item eventKey='Women'>Women</Dropdown.Item>
            <Dropdown.Item eventKey='Men'>Men</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown onSelect={this.onClotheSizeChange}>
          <Dropdown.Toggle className={`field p2 ${this.state.errorFields.clothe_size ? '' : ''}`}>
            <span className={`selected-size ${utils.isStringEmpty(this.state.clothe_size) ? 'no-date' : ''}`}>
              {utils.isStringEmpty(this.state.clothe_size) ? 'Select size' : this.state.clothe_size}
            </span>
            <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
          </Dropdown.Toggle>
          <Dropdown.Menu className='field-dropdown-menu'>
            <Dropdown.Item eventKey='XS'>XS</Dropdown.Item>
            <Dropdown.Item eventKey='S'>S</Dropdown.Item>
            <Dropdown.Item eventKey='M'>M</Dropdown.Item>
            <Dropdown.Item eventKey='L'>L</Dropdown.Item>
            <Dropdown.Item eventKey='XL'>XL</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }

  renderClothingSizeSelection = () => {
    return (
      <Box dir='row' className='p2'>
        <Dropdown onSelect={this.onClotheGenderChange}>
          <Dropdown.Toggle className={`field ${this.state.errorFields.gender_clothes ? 'field-error' : ''}`}>
            <span className='field-dropdown-bootstrap'>{this.state.gender_clothes ? this.state.gender_clothes : 'Type'}</span>
            <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
          </Dropdown.Toggle>
          <Dropdown.Menu className='field-dropdown-menu'>
            <Dropdown.Item eventKey='Men'>Men</Dropdown.Item>
            <Dropdown.Item eventKey='Women'>Women</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Queue size={15} />
        <Dropdown onSelect={this.onClotheSizeChange}>
          <Dropdown.Toggle className={`field ${this.state.errorFields.clothe_size ? 'field-error' : ''}`}>
            <span className='field-dropdown-bootstrap'>{this.state.clothe_size ? this.state.clothe_size : 'Size'}</span>
            <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
          </Dropdown.Toggle>
          <Dropdown.Menu className='field-dropdown-menu'>
            <Dropdown.Item eventKey='XS'>XS</Dropdown.Item>
            <Dropdown.Item eventKey='S'>S</Dropdown.Item>
            <Dropdown.Item eventKey='M'>M</Dropdown.Item>
            <Dropdown.Item eventKey='L'>L</Dropdown.Item>
            <Dropdown.Item eventKey='XL'>XL</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Box>
    );
  }

  renderShoeSizeSelection = () => {
    return (
      <Box dir='row' className='p2'>
        <Dropdown onSelect={this.onShoeGenderChange}>
          <Dropdown.Toggle className={`field ${this.state.errorFields.gender_shoe ? 'field-error' : ''}`}>
            <span className='field-dropdown-bootstrap'>{this.state.gender_shoe ? this.state.gender_shoe : 'Type'}</span>
            <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
          </Dropdown.Toggle>
          <Dropdown.Menu className='field-dropdown-menu'>
            <Dropdown.Item eventKey='Men'>Men</Dropdown.Item>
            <Dropdown.Item eventKey='Women'>Women</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Queue size={15} />
        <Field
          width={100}
          type='number'
          name='shoe_size'
          step='0.5'
          onChange={this.onFieldChange}
          // className={`field ${this.state.errorFields.shoe_size ? 'field-error' : ''}`}
          value={this.state.shoe_size}
          placeholder='e.g. 9.5'
          error={this.state.errorFields.shoe_size}
        />
      </Box>
    );
  }

  getShoeGender = () => {
    return (
      <Dropdown onSelect={this.onShoeGenderChange}>
        <Dropdown.Toggle className={`field p2 ${this.state.errorFields.gender_shoe ? '' : ''}`}>
          <span className={`selected-size ${utils.isStringEmpty(this.state.gender_shoe) ? 'no-date' : ''}`}>
            {utils.isStringEmpty(this.state.gender_shoe) ? 'Select' : this.state.gender_shoe}
          </span>
          <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
        </Dropdown.Toggle>
        <Dropdown.Menu className='field-dropdown-menu'>
          <Dropdown.Item eventKey='Women'>Women</Dropdown.Item>
          <Dropdown.Item eventKey='Men'>Men</Dropdown.Item>
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

  isValid = () => {
    const updates = {};
    let hasEmptyField = false;
    const errorFields = Object.keys(this.errorFields);
    errorFields.forEach((field) => {
      const isFieldEmpty = utils.isStringEmpty(this.state[field]);
      updates[field] = isFieldEmpty;
      if (isFieldEmpty) {
        hasEmptyField = true;
      }
    });
    if (hasEmptyField) {
      this.setState((prevState) => {
        return { errorFields: Object.assign({}, prevState.errorFields, updates) };
      });
      this.props.appError('Please complete all highlighted fields');
      window.scrollTo(0, 0);
      return false;
    }
    return true;
  }

  updateUserInfo(file, redirect) {
    if (this.isValid()) {
      this.props.clearError();
      if (file) {
        s3.uploadImage(file).then((url) => {
          const updatedUser = {
            email: this.state.email,
            name: this.state.name,
            photo_url: url,
            leader_for: this.state.clubsList,
            pronoun: this.state.pronoun,
            dash_number: this.state.dash_number,
            allergies_dietary_restrictions: this.state.allergies_dietary_restrictions,
            medical_conditions: this.state.medical,
            clothe_size: `${this.state.gender_clothes}-${this.state.clothe_size}`,
            shoe_size: `${this.state.gender_shoe}-${this.state.shoe_size}`,
            height: this.state.height,
            driver_cert: this.state.driver_cert,
            trailer_cert: this.state.trailer_cert,
          };
          this.props.updateUser(updatedUser).then(() => {
            if (redirect) {
              this.props.authUser();
            } else this.setState({ isEditing: false });
          });
        });
      } else {
        const updatedUser = {
          email: this.state.email,
          name: this.state.name,
          leader_for: this.state.clubsList,
          pronoun: this.state.pronoun,
          dash_number: this.state.dash_number,
          allergies_dietary_restrictions: this.state.allergies_dietary_restrictions,
          medical_conditions: this.state.medical,
          clothe_size: `${this.state.gender_clothes}-${this.state.clothe_size}`,
          shoe_size: `${this.state.gender_shoe}-${this.state.shoe_size}`,
          height: this.state.height,
          driver_cert: this.state.driver_cert,
          trailer_cert: this.state.trailer_cert,
        };
        this.props.updateUser(updatedUser).then(() => {
          if (redirect) {
            this.props.authUser();
          } else this.setState({ isEditing: false });
        });
      }
    }
  }

  render() {
    if (this.props.user) {
      if (this.props.completeProfileMode) {
        return (
          <ProfileCard
            completeProfileMode={this.props.completeProfileMode}
            {...this.state}
            photoUrlChange={(url) => { this.setState({ photo_url: url }); }}
            onFieldChange={this.onFieldChange}
            updateUserInfo={this.updateUserInfo}
            displayCertificationFeedback={this.displayCertificationFeedback}
            getCertificationsForm={this.getCertificationsForm}
            displayLeaderFeedback={this.displayLeaderFeedback}
            getClubForm={this.getClubForm}
            renderClothingSizeSelection={this.renderClothingSizeSelection}
            renderShoeSizeSelection={this.renderShoeSizeSelection}
            user={this.props.user}
          />
        );
      } else if (!this.state.isEditing) {
        return (
          <ProfileCard
            asProfilePage
            isEditing={this.state.isEditing}
            startEditing={this.startEditing}
            user={this.props.user}
            signOut={this.props.signOut}
          />
        );
      } else {
        return (
          <ProfileCard
            asProfilePage
            cancelChanges={this.cancelChanges}
            onFieldChange={this.onFieldChange}
            {...this.state}
            photoUrlChange={(url) => { this.setState({ photo_url: url }); }}
            updateUserInfo={this.updateUserInfo}
            displayCertificationFeedback={this.displayCertificationFeedback}
            getCertificationsForm={this.getCertificationsForm}
            displayLeaderFeedback={this.displayLeaderFeedback}
            getClubForm={this.getClubForm}
            renderClothingSizeSelection={this.renderClothingSizeSelection}
            renderShoeSizeSelection={this.renderShoeSizeSelection}
            user={this.props.user}
          />
        );
      }
    } else {
      return (<DOCLoading type='doc' height='150' width='150' measure='px' />);
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    clubs: state.clubs,
  };
};

export default withRouter(connect(mapStateToProps, { appError, clearError, updateUser, getClubs, signOut, getUser, authUser })(ProfileCardEdit));
