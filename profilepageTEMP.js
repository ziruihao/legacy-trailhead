import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateUser, getClubs } from '../actions';
import '../styles/profilepage-style.scss';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      clubsList: [],
      dash_number: '',
      isEditing: false,
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
    this.changeToOPO = this.changeToOPO.bind(this);
    this.changeToTrippee = this.changeToTrippee.bind(this);
    this.changeToLeader = this.changeToLeader.bind(this);
  }

  componentDidMount() {
    if (!this.props.authenticated) {
      alert('Please sign in/sign up to view this page');
      this.props.history.push('/');
    }
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

  getUpdatedVals = () => {
    this.setState({
      name: this.props.user.name,
      email: this.props.user.email,
      dash_number: this.props.user.dash_number ? this.props.user.dash_number : '',
      isEditing: true,
      clubsList: this.props.user.leader_for,
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
      const clubs = clubString.substring(0, clubString.length - 2);
      return clubs.length === 0 ? <em>None</em> : clubs;
    } else {
      return this.getClubForm();
    }
  }

  getClubForm = () => {
    if (this.props.user.has_pending_changes) {
      return <h1>You can&apos;t update this until your previous changes have been reviewed</h1>;
    }
    const currentClubIds = this.state.clubsList.map(club => club._id);
    return this.props.clubs.map((club) => {
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
  }

  displayFeedback = () => {
    if (this.props.user.role === 'Leader' && this.state.clubsList.length === 0) {
      return (
        <p>
          {`Unchecking all clubs will revoke your leader permissions.
          You will need to request acccess from the OPO to regain them.
          Please review before you proceed`}.
        </p>
      );
    } else if (this.props.user.role === 'Trippee' && this.state.clubsList.length > 0) {
      return (
        <p>
          {`Submitting this form will trigger a request to the OPO for leader permissions.
          Please proceed only if you're a leader!`}
        </p>
      );
    } else {
      return null;
    }
  }

  pendingChanges = () => {
    return this.props.user.has_pending_changes
      ? <strong>You have changes pending approval</strong>
      : null;
  }

  updateUserInfo(event) {
    const updatedUser = {
      email: this.state.email,
      name: this.state.name,
      leader_for: this.state.clubsList,
      dash_number: this.state.dash_number,
    };
    this.setState({ isEditing: false, clubsList: [] });
    this.props.updateUser(updatedUser);
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
        <div className="my-container">
          <div id="page-header" className="row">
            <div className="col-6">
              <h1 className="header">My Profile</h1>
            </div>
            <div className="col-6">
              <button id="edit-button" class="logout-button">
                <svg width="82" height="22" viewBox="0 0 82 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.968 0.079999H3.44V14.936H11.648V17H0.968V0.079999ZM20.0461 17.168C18.8941 17.168 17.8781 16.92 16.9981 16.424C16.1341 15.928 15.4621 15.224 14.9821 14.312C14.5181 13.384 14.2861 12.312 14.2861 11.096C14.2861 9.864 14.5181 8.792 14.9821 7.88C15.4621 6.952 16.1341 6.24 16.9981 5.744C17.8781 5.248 18.8941 5 20.0461 5C21.1981 5 22.2061 5.248 23.0701 5.744C23.9501 6.24 24.6221 6.952 25.0861 7.88C25.5661 8.792 25.8061 9.864 25.8061 11.096C25.8061 12.312 25.5661 13.384 25.0861 14.312C24.6221 15.224 23.9501 15.928 23.0701 16.424C22.2061 16.92 21.1981 17.168 20.0461 17.168ZM20.0461 15.248C21.1181 15.248 21.9341 14.896 22.4941 14.192C23.0701 13.488 23.3581 12.456 23.3581 11.096C23.3581 9.752 23.0701 8.728 22.4941 8.024C21.9181 7.304 21.1021 6.944 20.0461 6.944C18.9901 6.944 18.1741 7.304 17.5981 8.024C17.0221 8.728 16.7341 9.752 16.7341 11.096C16.7341 12.456 17.0141 13.488 17.5741 14.192C18.1501 14.896 18.9741 15.248 20.0461 15.248ZM40.601 5.288V16.064C40.601 17.856 40.121 19.208 39.161 20.12C38.217 21.032 36.817 21.488 34.961 21.488C33.953 21.488 32.993 21.352 32.081 21.08C31.185 20.824 30.385 20.448 29.681 19.952L30.425 18.2C31.193 18.696 31.929 19.048 32.633 19.256C33.353 19.48 34.121 19.592 34.937 19.592C37.129 19.592 38.225 18.48 38.225 16.256V14.408C37.889 15.112 37.377 15.664 36.689 16.064C36.001 16.448 35.201 16.64 34.289 16.64C33.265 16.64 32.353 16.4 31.553 15.92C30.753 15.44 30.129 14.76 29.681 13.88C29.249 13 29.033 11.984 29.033 10.832C29.033 9.68 29.257 8.664 29.705 7.784C30.153 6.904 30.769 6.224 31.553 5.744C32.353 5.248 33.265 5 34.289 5C35.185 5 35.969 5.192 36.641 5.576C37.329 5.96 37.849 6.504 38.201 7.208V5.288H40.601ZM34.865 14.72C35.905 14.72 36.721 14.376 37.313 13.688C37.905 13 38.201 12.048 38.201 10.832C38.201 9.632 37.905 8.688 37.313 8C36.737 7.296 35.921 6.944 34.865 6.944C33.809 6.944 32.977 7.288 32.369 7.976C31.777 8.664 31.481 9.616 31.481 10.832C31.481 12.048 31.785 13 32.393 13.688C33.001 14.376 33.825 14.72 34.865 14.72ZM50.2664 17.168C49.1144 17.168 48.0984 16.92 47.2184 16.424C46.3544 15.928 45.6824 15.224 45.2024 14.312C44.7384 13.384 44.5064 12.312 44.5064 11.096C44.5064 9.864 44.7384 8.792 45.2024 7.88C45.6824 6.952 46.3544 6.24 47.2184 5.744C48.0984 5.248 49.1144 5 50.2664 5C51.4184 5 52.4264 5.248 53.2904 5.744C54.1704 6.24 54.8424 6.952 55.3064 7.88C55.7864 8.792 56.0264 9.864 56.0264 11.096C56.0264 12.312 55.7864 13.384 55.3064 14.312C54.8424 15.224 54.1704 15.928 53.2904 16.424C52.4264 16.92 51.4184 17.168 50.2664 17.168ZM50.2664 15.248C51.3384 15.248 52.1544 14.896 52.7144 14.192C53.2904 13.488 53.5784 12.456 53.5784 11.096C53.5784 9.752 53.2904 8.728 52.7144 8.024C52.1384 7.304 51.3224 6.944 50.2664 6.944C49.2104 6.944 48.3944 7.304 47.8184 8.024C47.2424 8.728 46.9544 9.752 46.9544 11.096C46.9544 12.456 47.2344 13.488 47.7944 14.192C48.3704 14.896 49.1944 15.248 50.2664 15.248ZM70.1973 5.288V17H67.8453V15.104C67.4773 15.776 66.9653 16.288 66.3093 16.64C65.6693 16.992 64.9493 17.168 64.1493 17.168C61.3013 17.168 59.8773 15.6 59.8773 12.464V5.288H62.3013V12.44C62.3013 13.384 62.4933 14.08 62.8773 14.528C63.2613 14.976 63.8533 15.2 64.6533 15.2C65.5973 15.2 66.3493 14.896 66.9093 14.288C67.4853 13.68 67.7733 12.872 67.7733 11.864V5.288H70.1973ZM80.3334 15.296C80.7014 15.296 81.0614 15.272 81.4134 15.224L81.2934 17.072C80.8934 17.136 80.4774 17.168 80.0454 17.168C78.5254 17.168 77.3894 16.8 76.6374 16.064C75.9014 15.312 75.5334 14.232 75.5334 12.824V7.16H73.2534V5.288H75.5334V1.76H77.9574V5.288H81.1734V7.16H77.9574V12.728C77.9574 14.44 78.7494 15.296 80.3334 15.296Z" fill="#0CA074"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="row profile justify-content-center">
            <div className="col-4">
              <p className="profile-pic"></p>
            </div>

            <div className="col-8 card-body">
              <div className="row justify-content-between">
                <div className="col-6 card-name">
                  <p>{this.props.user.name}</p>
                </div>
                <div className="col-1 button-place">
                  <button id="edit-button" onClick={this.getUpdatedVals}>
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.71 4.0425C18.1 3.6525 18.1 3.0025 17.71 2.6325L15.37 0.2925C15 -0.0975 14.35 -0.0975 13.96 0.2925L12.12 2.1225L15.87 5.8725L17.71 4.0425ZM0 14.2525V18.0025H3.75L14.81 6.9325L11.06 3.1825L0 14.2525Z" fill="#0CA074" />
                    </svg>
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
                  <p className="card-info">{this.props.user.dash_number ? this.props.user.dash_number : 'Please fill out'}</p>
                </div>
              </div>
              <hr className="line"/>
              <div className="row justify-content-between">
                <div className="col-6">
                  <p className="card-headings">Allergies</p>
                </div>
                <div className="col-6">
                  <p className="card-info">Peanuts, Bee Stings</p>
                </div>
              </div>
              <hr className="line"/>
              <div className="row justify-content-between">
                <div className="col-6">
                  <p className="card-headings">Dietary Restrictions</p>
                </div>
                <div className="col-6">
                  <p className="card-info">n/a</p>
                </div>
              </div>
              <hr className="line"/>
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

      );
    }


    return (
      <div className="my-container">
          <div id="page-header" className="row">
            <div className="col-6">
              <h1 className="header">My Profile</h1>
            </div>
            <div className="col-6">
              <button id="edit-button" class="logout-button">
                <svg width="82" height="22" viewBox="0 0 82 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.968 0.079999H3.44V14.936H11.648V17H0.968V0.079999ZM20.0461 17.168C18.8941 17.168 17.8781 16.92 16.9981 16.424C16.1341 15.928 15.4621 15.224 14.9821 14.312C14.5181 13.384 14.2861 12.312 14.2861 11.096C14.2861 9.864 14.5181 8.792 14.9821 7.88C15.4621 6.952 16.1341 6.24 16.9981 5.744C17.8781 5.248 18.8941 5 20.0461 5C21.1981 5 22.2061 5.248 23.0701 5.744C23.9501 6.24 24.6221 6.952 25.0861 7.88C25.5661 8.792 25.8061 9.864 25.8061 11.096C25.8061 12.312 25.5661 13.384 25.0861 14.312C24.6221 15.224 23.9501 15.928 23.0701 16.424C22.2061 16.92 21.1981 17.168 20.0461 17.168ZM20.0461 15.248C21.1181 15.248 21.9341 14.896 22.4941 14.192C23.0701 13.488 23.3581 12.456 23.3581 11.096C23.3581 9.752 23.0701 8.728 22.4941 8.024C21.9181 7.304 21.1021 6.944 20.0461 6.944C18.9901 6.944 18.1741 7.304 17.5981 8.024C17.0221 8.728 16.7341 9.752 16.7341 11.096C16.7341 12.456 17.0141 13.488 17.5741 14.192C18.1501 14.896 18.9741 15.248 20.0461 15.248ZM40.601 5.288V16.064C40.601 17.856 40.121 19.208 39.161 20.12C38.217 21.032 36.817 21.488 34.961 21.488C33.953 21.488 32.993 21.352 32.081 21.08C31.185 20.824 30.385 20.448 29.681 19.952L30.425 18.2C31.193 18.696 31.929 19.048 32.633 19.256C33.353 19.48 34.121 19.592 34.937 19.592C37.129 19.592 38.225 18.48 38.225 16.256V14.408C37.889 15.112 37.377 15.664 36.689 16.064C36.001 16.448 35.201 16.64 34.289 16.64C33.265 16.64 32.353 16.4 31.553 15.92C30.753 15.44 30.129 14.76 29.681 13.88C29.249 13 29.033 11.984 29.033 10.832C29.033 9.68 29.257 8.664 29.705 7.784C30.153 6.904 30.769 6.224 31.553 5.744C32.353 5.248 33.265 5 34.289 5C35.185 5 35.969 5.192 36.641 5.576C37.329 5.96 37.849 6.504 38.201 7.208V5.288H40.601ZM34.865 14.72C35.905 14.72 36.721 14.376 37.313 13.688C37.905 13 38.201 12.048 38.201 10.832C38.201 9.632 37.905 8.688 37.313 8C36.737 7.296 35.921 6.944 34.865 6.944C33.809 6.944 32.977 7.288 32.369 7.976C31.777 8.664 31.481 9.616 31.481 10.832C31.481 12.048 31.785 13 32.393 13.688C33.001 14.376 33.825 14.72 34.865 14.72ZM50.2664 17.168C49.1144 17.168 48.0984 16.92 47.2184 16.424C46.3544 15.928 45.6824 15.224 45.2024 14.312C44.7384 13.384 44.5064 12.312 44.5064 11.096C44.5064 9.864 44.7384 8.792 45.2024 7.88C45.6824 6.952 46.3544 6.24 47.2184 5.744C48.0984 5.248 49.1144 5 50.2664 5C51.4184 5 52.4264 5.248 53.2904 5.744C54.1704 6.24 54.8424 6.952 55.3064 7.88C55.7864 8.792 56.0264 9.864 56.0264 11.096C56.0264 12.312 55.7864 13.384 55.3064 14.312C54.8424 15.224 54.1704 15.928 53.2904 16.424C52.4264 16.92 51.4184 17.168 50.2664 17.168ZM50.2664 15.248C51.3384 15.248 52.1544 14.896 52.7144 14.192C53.2904 13.488 53.5784 12.456 53.5784 11.096C53.5784 9.752 53.2904 8.728 52.7144 8.024C52.1384 7.304 51.3224 6.944 50.2664 6.944C49.2104 6.944 48.3944 7.304 47.8184 8.024C47.2424 8.728 46.9544 9.752 46.9544 11.096C46.9544 12.456 47.2344 13.488 47.7944 14.192C48.3704 14.896 49.1944 15.248 50.2664 15.248ZM70.1973 5.288V17H67.8453V15.104C67.4773 15.776 66.9653 16.288 66.3093 16.64C65.6693 16.992 64.9493 17.168 64.1493 17.168C61.3013 17.168 59.8773 15.6 59.8773 12.464V5.288H62.3013V12.44C62.3013 13.384 62.4933 14.08 62.8773 14.528C63.2613 14.976 63.8533 15.2 64.6533 15.2C65.5973 15.2 66.3493 14.896 66.9093 14.288C67.4853 13.68 67.7733 12.872 67.7733 11.864V5.288H70.1973ZM80.3334 15.296C80.7014 15.296 81.0614 15.272 81.4134 15.224L81.2934 17.072C80.8934 17.136 80.4774 17.168 80.0454 17.168C78.5254 17.168 77.3894 16.8 76.6374 16.064C75.9014 15.312 75.5334 14.232 75.5334 12.824V7.16H73.2534V5.288H75.5334V1.76H77.9574V5.288H81.1734V7.16H77.9574V12.728C77.9574 14.44 78.7494 15.296 80.3334 15.296Z" fill="#0CA074"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="row profile justify-content-center">
            <div className="col-4">
              <p className="profile-pic"></p>
            </div>

            <div className="col-8 card-body">
              <div className="row justify-content-between">
                <div className="col-6 card-name">
                  <p>{this.props.user.name}</p>
                </div>
                <div className="col-1 button-place">
                  <button id="edit-button" onClick={this.updateUserInfo}>
                    <svg width="55" height="19" viewBox="0 0 55 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.512 18.192C5.2 18.192 3.992 18.016 2.888 17.664C1.8 17.312 0.864 16.792 0.08 16.104L0.968 14.28C1.8 14.952 2.656 15.44 3.536 15.744C4.432 16.032 5.432 16.176 6.536 16.176C7.8 16.176 8.776 15.944 9.464 15.48C10.152 15 10.496 14.328 10.496 13.464C10.496 12.728 10.176 12.184 9.536 11.832C8.896 11.464 7.872 11.12 6.464 10.8C5.12 10.512 4.016 10.184 3.152 9.816C2.288 9.448 1.608 8.952 1.112 8.328C0.632 7.688 0.392 6.88 0.392 5.904C0.392 4.912 0.648 4.04 1.16 3.288C1.688 2.536 2.432 1.952 3.392 1.536C4.352 1.104 5.464 0.887999 6.728 0.887999C7.912 0.887999 9.024 1.072 10.064 1.44C11.12 1.792 11.984 2.304 12.656 2.976L11.792 4.8C11.008 4.16 10.2 3.688 9.368 3.384C8.552 3.064 7.68 2.904 6.752 2.904C5.536 2.904 4.576 3.16 3.872 3.672C3.184 4.168 2.84 4.864 2.84 5.76C2.84 6.528 3.144 7.112 3.752 7.512C4.36 7.896 5.336 8.248 6.68 8.568C8.088 8.888 9.224 9.224 10.088 9.576C10.968 9.912 11.664 10.384 12.176 10.992C12.704 11.584 12.968 12.36 12.968 13.32C12.968 14.296 12.704 15.152 12.176 15.888C11.664 16.624 10.92 17.192 9.944 17.592C8.984 17.992 7.84 18.192 6.512 18.192ZM21.8229 6C23.3909 6 24.5509 6.392 25.3029 7.176C26.0709 7.96 26.4549 9.152 26.4549 10.752V18H24.1269V16.056C23.8229 16.744 23.3669 17.272 22.7589 17.64C22.1669 17.992 21.4709 18.168 20.6709 18.168C19.9029 18.168 19.1989 18.016 18.5589 17.712C17.9189 17.392 17.4149 16.952 17.0469 16.392C16.6949 15.832 16.5189 15.208 16.5189 14.52C16.5189 13.672 16.7349 13.008 17.1669 12.528C17.6149 12.032 18.3429 11.68 19.3509 11.472C20.3749 11.264 21.7749 11.16 23.5509 11.16H24.1029V10.464C24.1029 9.568 23.9109 8.92 23.5269 8.52C23.1589 8.12 22.5509 7.92 21.7029 7.92C20.3749 7.92 19.0469 8.328 17.7189 9.144L16.9989 7.44C17.6229 7.008 18.3749 6.664 19.2549 6.408C20.1509 6.136 21.0069 6 21.8229 6ZM21.1029 16.368C21.9829 16.368 22.7029 16.072 23.2629 15.48C23.8229 14.872 24.1029 14.096 24.1029 13.152V12.528H23.6709C22.4229 12.528 21.4629 12.584 20.7909 12.696C20.1189 12.808 19.6389 13 19.3509 13.272C19.0629 13.528 18.9189 13.904 18.9189 14.4C18.9189 14.96 19.1189 15.432 19.5189 15.816C19.9349 16.184 20.4629 16.368 21.1029 16.368ZM41.6986 6.312L36.6106 18H34.4266L29.3866 6.312H31.9306L35.5786 15.264L39.2746 6.312H41.6986ZM54.5073 12.552H46.2273C46.4033 15.032 47.6353 16.272 49.9233 16.272C51.2673 16.272 52.4833 15.832 53.5713 14.952L54.3153 16.656C53.7713 17.12 53.0993 17.488 52.2993 17.76C51.4993 18.032 50.6833 18.168 49.8513 18.168C47.9793 18.168 46.4993 17.632 45.4113 16.56C44.3393 15.488 43.8033 14.008 43.8033 12.12C43.8033 10.92 44.0353 9.856 44.4993 8.928C44.9793 8 45.6433 7.28 46.4913 6.768C47.3553 6.256 48.3313 6 49.4193 6C51.0033 6 52.2433 6.512 53.1393 7.536C54.0513 8.56 54.5073 9.976 54.5073 11.784V12.552ZM49.4673 7.776C48.5393 7.776 47.7953 8.072 47.2353 8.664C46.6913 9.24 46.3633 10.072 46.2513 11.16p2.4193C52.3713 10.072 52.0913 9.24 51.5793 8.664C51.0833 8.072 50.3793 7.776 49.4673 7.776Z" fill="#0CA074"/>
                    </svg>
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
              <hr className="line"/>
              <div className="row justify-content-between">
                <div className="col-6">
                  <p className="card-headings">Allergies</p>
                </div>
                <div className="col-6">
                  <input type="text" name="allergies" onChange={this.onFieldChange} className="form-control my-form-control" />
                </div>
              </div>
              <hr className="line"/>
              <div className="row justify-content-between">
                <div className="col-6">
                  <p className="card-headings">Dietary Restrictions</p>
                </div>
                <div className="col-6">
                  <input type="text" name="dietary_restrictions" onChange={this.onFieldChange} className="form-control my-form-control" />
                </div>
              </div>
              <hr className="line"/>
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

    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    clubs: state.clubs,
    authenticated: state.auth.authenticated,
  };
};

export default withRouter(connect(mapStateToProps, { updateUser, getClubs })(ProfilePage));
