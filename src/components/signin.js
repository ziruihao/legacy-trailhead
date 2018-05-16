import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signIn } from '../actions';

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

  onFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  signIn(event) {
    if (this.state.email !== '' && this.state.password !== '') {
      this.props.signIn({
        email: this.state.email,
        password: this.state.password,
      }, this.props.history);
    }
    event.preventDefault();
  }


  render() {
    return (
      <div>
        <form className="input" onSubmit={this.signIn}>
          <label htmlFor="email">
            <div>Dartmouth e-mail:</div>
            <input name="email" type="text" onChange={this.onFieldChange} value={this.state.email} />
          </label>
          <label htmlFor="password">
            <div>Password:</div>
            <input name="password" type="password" onChange={this.onFieldChange} value={this.state.password} />
          </label>
          <button type="submit">Sign In</button>
          <button type="reset" onClick={() => this.props.history.push('/')}>Cancel</button>
        </form>
      </div>
    );
  }
}

export default withRouter(connect(null, { signIn })(SignIn));
