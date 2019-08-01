import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { updateUser, getClubs, signOut } from '../actions';
import ProfileCard from './profilecard';
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
      allergies_dietary_restrictions: '',
      medical: '',
      height: '',
      shoe_size: '',
      clothe_size: '',
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

  onClotheSizeChange = (eventKey) => {
    this.setState({ clothe_size: eventKey });
  }

  startEditing = () => {
    this.setState({
      name: this.props.user.name,
      email: this.props.user.email,
      dash_number: this.props.user.dash_number ? this.props.user.dash_number : '',
      allergies_dietary_restrictions: this.props.user.allergies_dietary_restrictions ? this.props.user.allergies_dietary_restrictions : '',
      medical: this.props.user.medical_conditions ? this.props.user.medical_conditions : '',
      height: this.props.user.height ? this.props.user.height : '',
      clothe_size: this.props.user.clothe_size ? this.props.user.clothe_size : '',
      shoe_size: this.props.user.shoe_size ? this.props.user.shoe_size : '',
      clubsList: this.props.user.leader_for,
      driver_cert: this.props.user.driver_cert,
      trailer_cert: this.props.user.trailer_cert,
      isEditing: true,
    });
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

  getClotheForm = () => {
    return (
      <Dropdown onSelect={this.onClotheSizeChange}>
        <Dropdown.Toggle id="clothe-size-dropdown">
          <span>
            <span className="selected-size">{this.state.clothe_size}</span>
            <img className="dropdown-icon" src="/src/img/dropdown-toggle.svg" alt="dropdown-toggle" />
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="filter-options clothe-options">
          <Dropdown.Item eventKey="XS">XS</Dropdown.Item>
          <Dropdown.Item eventKey="S">S</Dropdown.Item>
          <Dropdown.Item eventKey="M">M</Dropdown.Item>
          <Dropdown.Item eventKey="L">L</Dropdown.Item>
          <Dropdown.Item eventKey="XL">XL</Dropdown.Item>
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

  updateUserInfo(event) {
    const updatedUser = {
      email: this.state.email,
      name: this.state.name,
      leader_for: this.state.clubsList,
      dash_number: this.state.dash_number,
      allergies_dietary_restrictions: this.state.allergies_dietary_restrictions,
      medical_conditions: this.state.medical,
      clothe_size: this.state.clothe_size,
      shoe_size: this.state.shoe_size,
      height: this.state.height,
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
                <span className="logout-button" onClick={() => this.props.signOut(this.props.history)} role="button" tabIndex={0}>Logout</span>
              </div>
              <ProfileCard
                asProfilePage
                isEditing={this.state.isEditing}
                startEditing={this.startEditing}
                user={this.props.user}
              />
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
              <ProfileCard
                asProfilePage
                isEditing={this.state.isEditing}
                onFieldChange={this.onFieldChange}
                name={this.state.name}
                email={this.state.email}
                updateUserInfo={this.updateUserInfo}
                dash_number={this.state.dash_number}
                allergies_dietary_restrictions={this.state.allergies_dietary_restrictions}
                medical={this.state.medical}
                height={this.state.height}
                shoe_size={this.state.shoe_size}
                clothe_size={this.state.clothe_size}
                displayCertificationFeedback={this.displayCertificationFeedback}
                getCertificationsForm={this.getCertificationsForm}
                displayLeaderFeedback={this.displayLeaderFeedback}
                getClubForm={this.getClubForm}
                getClotheForm={this.getClotheForm}
              />
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

export default withRouter(connect(mapStateToProps, { updateUser, getClubs, signOut })(ProfilePage));
