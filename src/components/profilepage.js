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

  CERTIFICATIONS = [null, 'MICROBUS', 'VAN', 'MINIVAN'];

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
        certifications = this.props.user.trailer_cert ? `${this.props.user.driver_cert}, ${this.TRAILER_CONSTANT}` : this.props.driver_cert;
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
    if (this.props.user.role === 'Leader' && this.state.clubsList.length === 0) {
      return (
        <p>
          Unchecking all clubs will revoke your leader permissions.
          You will need to request acccess from the OPO to regain them.
          Please review before you proceed.
        </p>
      );
    } else if (this.props.user.role === 'Trippee' && this.state.clubsList.length > 0) {
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
        <div className="container">
          <div className="profile">
            <div className="card-header profile-header">{`${this.props.user.name}'s Profile`}</div>
            <div className="card-body">
              <div className="profile-field">
                <h5 className="card-title">Email</h5>
                <p className="card-text">{this.props.user.email}</p>
              </div>
              <div className="profile-field">
                <h5 className="card-title">Account Type</h5>
                <p className="card-text">{this.props.user.role}</p>
              </div>
              <div className="profile-field">
                <h5 className="card-title">Dash #</h5>
                <p className="card-text">{this.props.user.dash_number ? this.props.user.dash_number : 'Please fill out'}</p>
              </div>
              <div className="profile-field">
                {this.displayClubs()}
              </div>
              <div className="profile-field">
                {this.displayCertifications()}
              </div>
              <button className="btn btn-primary" onClick={this.startEditing}>Update my info</button>
              {this.pendingChanges()}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="card profile">
          <div className="card-header profile-header">{`${this.props.user.name}'s Profile`}</div>
          <div className="card-body">
            <div className="profile-field">
              <h5 className="card-title">Name</h5>
              <input type="text" name="name" onChange={this.onFieldChange} className="form-control" value={this.state.name} />
            </div>
            <div className="profile-field">
              <h5 className="card-title">Email</h5>
              <input type="text" name="email" onChange={this.onFieldChange} className="form-control" value={this.state.email} />
            </div>
            <div className="profile-field">
              <h5 className="card-title">Dash #</h5>
              <input type="text" name="dash_number" onChange={this.onFieldChange} className="form-control" value={this.state.dash_number} />
            </div>
            <div className="profile-field">
              {this.displayClubs()}
              {this.displayLeaderFeedback()}
              {this.displayCertifications()}
              {this.displayCertificationFeedback()}
            </div>

            <button className="btn btn-primary" onClick={this.changeToOPO}>Change to OPO</button>
            <button className="btn btn-primary" onClick={this.changeToTrippee}>Change to Trippee</button>
            <button className="btn btn-primary" onClick={this.changeToLeader}>Change to Leader</button>
            <button className="btn btn-success" onClick={this.updateUserInfo}>Update info</button>
            <button className="btn btn-danger" onClick={() => { this.setState({ isEditing: false, clubsList: [] }); }}>Cancel changes</button>
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
