import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { appError, updateRestrictedPath } from '../actions';

export default function (ComposedComponent) {
  class RequireAuth extends Component {
    componentWillMount() {
      if (!this.props.authenticated) {
        this.props.updateRestrictedPath(`${this.props.location.pathname}`);
        this.props.appError('Please sign in or sign up to view that page');
        this.props.history.push('/');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.authenticated) {
        this.props.updateRestrictedPath(`${this.props.location.pathname}`);
        this.props.appError('Please sign in or sign up to view that page');
        nextProps.history.push('/');
      }
    }

    render() {
      return (
        <div>
          <ComposedComponent {...this.props} />
        </div>
      );
    }
  }

  const mapStateToProps = state => (
    {
      authenticated: state.auth.authenticated,
    }
  );

  return withRouter(connect(mapStateToProps, { appError, updateRestrictedPath })(RequireAuth));
}
