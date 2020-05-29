import React from 'react';
import { connect } from 'react-redux';
import VehicleRequest from '../vehiclerequest';

class VehicleRequestPage extends React.Component {
  render() {
    return (
      <div id="vehicle-request-page" className="center-view spacy">
        <VehicleRequest />
      </div>
    );
  }
}

const mapStateToProps = reduxState => ({
  user: reduxState.user.user,
});


export default connect(mapStateToProps, null)(VehicleRequestPage);
