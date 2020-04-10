import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import OPODashboard from '../components/opoDashboard';
import MyTrips from '../components/myTrips';
import AllTrips from '../components/allTrips';

class Dashboard extends React.Component {
  render() {
    if (this.props.user) {
      if (this.props.user.role === 'OPO') {
        return (<OPODashboard />);
      } else if (this.props.user.role === 'Leader') {
        return (<MyTrips />);
      } else {
        return (<AllTrips />);
      }
    } else {
      return <div>Loading</div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

export default withRouter(connect(mapStateToProps, null)(Dashboard));
