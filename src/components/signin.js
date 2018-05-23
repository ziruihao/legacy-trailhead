import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signIn } from '../actions';
import '../styles/signin-style.scss';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {
    if (this.props.authenticated) {
      this.props.history.push('/');
    }
  }

  onFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  signIn() {
    if (this.state.email !== '' && this.state.password !== '') {
      this.props.signIn({
        email: this.state.email,
        password: this.state.password,
      }, this.props.history);
    }
  }


  render() {
    return (
      <div className="main-signin">
        <div className="input-fields">
          <input className="input-styling" name="email" type="text" id="email-input" onChange={this.onFieldChange} placeholder="Dartmouth Email" value={this.state.email} />
          <input className="input-styling" name="password" type="password" placeholder="Password" onChange={this.onFieldChange} value={this.state.password} />
        </div>
        <div className="form-buttons">
          <button className="button-styling" type="submit" onClick={this.signIn}>Sign In</button>
          <button className="button-styling" type="reset" onClick={() => this.props.history.push('/')}>Cancel</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
  };
};

export default withRouter(connect(mapStateToProps, { signIn })(SignIn));
