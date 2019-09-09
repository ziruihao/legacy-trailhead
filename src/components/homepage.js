/* eslint-disable */
/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string'
import { signIn, signOut, authed, getUser } from '../actions';
import '../styles/homepage-style.scss';
import SignUp from './signup';
class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      continue: false
    };
  }

  componentDidMount() {
    const values = queryString.parse(this.props.location.search);
    if (!this.props.authenticated) {
      if (values.token) {
        this.props.authed(values.token, values.userId, this.props.history);
      } else {
        this.props.signIn();
      }
    } else {
      this.props.history.push('/alltrips');
    }
  }

  continue = () => {
    this.setState({
      continue: true
    });
  }

  render() {
    if (this.props.user.name === "") {
      return (
        <SignUp id={this.props.user.id} />
      );

    } else {
      let buttons = null;
      if (this.props.authenticated) {
        buttons = <span />;
      } else {
        buttons = (
          <div className="two-buttons">
            <button className="log-in" onClick={() => this.props.signIn(this.props.history)}>Let's Go</button>
          </div>
        );
      }

      if (window.innerWidth > 760 || this.state.continue) {
        return (
          <div id="landing-page">
            <div className="main1">
              <div className="home-text">
                <h1> Stay Crunchy. </h1>
                <p>
                  {
                    this.props.authenticated
                      ? 'Join or create a trip of your own!'
                      : 'Hello there! This is the Dartmouth Outing Club (DOC) Website. Here, you can view, sign up for, or form trips.'
                  }
                </p>
              </div>
              {buttons}
            </div>
          </div>
        );
      } else {
        return (
          <div>

            <Modal
              centered
              show={true}
            >

              <img src="/src/img/confirmCancel.svg" alt="confirm-delete" className="cancel-image" />
              <div className="cancel-content">
                <p className="cancel-message">Uh oh! This site is not mobile-friendly. Please view it on a desktop.</p>
              </div>
              <button type="submit" className="leader-cancel-button confirm-cancel" onClick={this.continue}>Visit site anyways </button>

            </Modal>
          </div>);
      }
    }
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
    role: state.user.role,
    user: state.user,

  };
};

export default withRouter(connect(mapStateToProps, { signIn, signOut, authed, getUser })(Homepage));
