/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { Stack, Queue, Divider, Box } from '../../layout';
import { GearRequest, BasicInfo, PCardRequest } from '../../opo-trip-info-pages';
import OPOVehicleRequest from '../../opo-vehicle-request';
import Badge from '../../badge';
import Sidebar from '../../sidebar';
import { reviewGearRequest, reviewTrippeeGearRequest, reviewPCardRequests, appError } from '../../../actions';
import '../../../styles/tripdetails_opo.scss';
import '../../../styles/createtrip-style.scss';


class OPOTripDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      pcardAssigned: '',
      showModal: false,
      numOfPages: 1,
      isEditingPcard: true,
    };
    this.emailRef = React.createRef();
  }

  componentDidMount() {
    const { trip } = this.props;
    let numOfPages = 1;
    if (trip.gearStatus !== 'N/A' || trip.trippeeGearStatus !== 'N/A') {
      numOfPages += 1;
    }
    if (trip.pcardStatus !== 'N/A') {
      numOfPages += 1;
    }
    if (trip.vehicleStatus !== 'N/A') {
      numOfPages += 1;
    }
    const isEditingPcard = trip.pcardStatus === 'pending';
    this.setState({ numOfPages, isEditingPcard });
  }

  setStep = (step) => {
    this.setState({ step });
  }

  // getSideLinks = () => {
  //   let gearRequest = null;
  //   const { trip } = this.props;
  //   if (trip.gearStatus !== 'N/A' || trip.trippeeGearStatus !== 'N/A') {
  //     const hasBeenReviewed = trip.gearStatus !== 'pending' && trip.trippeeGearStatus !== 'pending';
  //     let status = (trip.gearStatus !== 'denied' && trip.trippeeGearStatus !== 'denied') ? 'approved' : 'denied';
  //     gearRequest = (
  //       <div className="ovr-sidebar-req-section otd-sb-req-section">
  //         {this.state.step === 2 ? <div className="otd-side-bar-highlight" /> : null}
  //         <button
  //           className={`side-links ovr-req-section-link ${this.state.step === 2 ? 'otd-text-highlight' : ''}`}
  //           onClick={() => this.setStep(2)}
  //         >
  //           Gear Request
  //         </button>
  //         {hasBeenReviewed ? <Badge type={status}></Badge> : null}
  //       </div>
  //     );
  //   }

  // let pcardRequest = null;
  // const { pcardStatus } = trip;
  // if (pcardStatus !== 'N/A') {
  //   pcardRequest = (
  //     <div className="ovr-sidebar-req-section otd-sb-req-section">
  //       {this.state.step === 3 ? <div className="otd-side-bar-highlight" /> : null}
  //       <button
  //         className={`side-links ovr-req-section-link ${this.state.step === 3 ? 'otd-text-highlight' : ''}`}
  //         onClick={() => this.setStep(3)}
  //       >
  //         P-Card Request
  //       </button>
  //       {pcardStatus !== 'pending' ? <Badge type={status}></Badge> : null}
  //     </div>
  //   )
  // }

  // let vehicleRequest = null;
  // const { vehicleStatus } = trip;
  // if (vehicleStatus !== 'N/A') {
  //   vehicleRequest = (
  //     <div className="ovr-sidebar-req-section otd-sb-req-section">
  //       {this.state.step === 4 ? <div className="otd-side-bar-highlight" /> : null}
  //       <button
  //         className={`side-links ovr-req-section-link ${this.state.step === 4 ? 'otd-text-highlight' : ''}`}
  //         onClick={() => this.setStep(4)}
  //       >
  //         Vehicle Request
  //       </button>
  //       {vehicleStatus !== 'pending' ? <Badge type={status}></Badge> : null}
  //     </div>
  //   )
  // }


  //   return (
  //     <div>
  //       {gearRequest}
  //       {pcardRequest}
  //       {vehicleRequest}
  //     </div>
  //   )
  // }

  nextPage = () => {
    if (this.state.step >= this.state.numOfPages) {
      this.props.history.push('/opo-trips');
    } else {
      this.setState((prevState) => {
        return { step: prevState.step + 1 };
      });
    }
  }

  previousPage = () => {
    if (this.state.step !== 1) {
      this.setState((prevState) => {
        return { step: prevState.step - 1 };
      });
    }
  }

  openModal = () => {
    this.setState({
      showModal: true,
    });
  }

  closeModal = () => {
    this.setState({
      showModal: false,
    });
  }

  reviewGroupGearRequest = (status) => {
    const review = {
      id: this.props.trip._id,
      status,
    };
    this.props.reviewGearRequest(review);
  }

  reviewTrippeeGearRequest = (status) => {
    const review = {
      id: this.props.trip._id,
      status,
    };
    this.props.reviewTrippeeGearRequest(review);
  }

  onFieldChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  isStringEmpty = (string) => {
    return string.length === 0 || !string.toString().trim();
  };

  reviewPCardRequest = (pcardStatus) => {
    if (this.state.isEditingPcard && this.isStringEmpty(this.state.pcardAssigned)) {
      this.props.appError('Please assign a pcard to this request');
      window.scrollTo(0, 0);
    } else {
      const pcardAssigned = pcardStatus === 'denied' ? '' : this.state.pcardAssigned;
      const review = {
        id: this.props.trip._id,
        pcardStatus,
        pcardAssigned,
      };
      this.props.reviewPCardRequests(review)
        .then(() => {
          this.setState({ isEditingPcard: false });
        });
    }
  }

  startEditingPcard = () => {
    this.setState({
      pcardAssigned: this.props.trip.pcardAssigned,
      isEditingPcard: true,
    });
  }

  cancelPcardUpdate = () => {
    this.setState({ isEditingPcard: false });
  }

  copyEmail = (event) => {
    this.emailRef.current.select();
    document.execCommand('copy');
    event.target.focus();
    this.props.appError('Email copied to clipboard!');
    this.setState({ showModal: false });
  }

  render() {
    let page;
    switch (this.state.step) {
      case 1:
        page = (
          <BasicInfo
            trip={this.props.trip}
          />
        );
        break;
      case 2:
        page = (
          <GearRequest
            trip={this.props.trip}
            reviewGroupGearRequest={this.reviewGroupGearRequest}
            reviewTrippeeGearRequest={this.reviewTrippeeGearRequest}
          />
        );
        break;
      case 3:
        page = (
          <PCardRequest
            trip={this.props.trip}
            approve={this.approve}
            deny={this.deny}
            onFieldChange={this.onFieldChange}
            pcardAssigned={this.state.pcardAssigned}
            isEditingPcard={this.state.isEditingPcard}
            reviewPCardRequest={this.reviewPCardRequest}
            startEditingPcard={this.startEditingPcard}
            cancelPcardUpdate={this.cancelPcardUpdate}
          />
        );
        break;
      case 4:
        page = (
          <OPOVehicleRequest
            partOfTrip
            vehicleReqId={this.props.trip.vehicleRequest._id}
          />
        );
        break;
      default:
        page = (
          <BasicInfo
            trip={this.props.trip}
          />
        );
        break;
    }
    return (
      <Box>
        <Sidebar
          sections={
            [
              { title: 'Trip Overview', steps: [{ number: 1, text: 'Basic information' }, { number: 2, text: 'Attendies' }] },
              { title: 'Requests', steps: [{ number: 3, text: 'Gear' }, { number: 4, text: 'P-Card' }, { number: 5, text: 'Vehicles' }] },
            ]
          }
          currentStep={this.state.currentStep}
        />

        <div className="ovr-req-content">
          <div className="otd-req-content">
            {page}
          </div>
          <div className="create-trip-bottom-buttons create-trips-top-margin">
            <button disabled={this.state.step === 1} type="button" className="btn next-button" onClick={this.previousPage}>Previous</button>
            <span className="cancel-link ovr-bottom-link ovr-contact-link" onClick={this.openModal} role="button" tabIndex={0}>Contact Trip Leader</span>
            <button type="button" className="btn next-button" onClick={this.nextPage}>
              {this.state.step === this.state.numOfPages ? 'Back to Trip Approvals' : 'Next'}
            </button>
          </div>
        </div>
        <Modal
          centered
          show={this.state.showModal}
          onHide={this.closeModal}
        >
          <div className="trip-details-close-button">
            <i className="material-icons close-button" onClick={this.closeModal} role="button" tabIndex={0}>close</i>
          </div>
          <Badge type="denied" />
          {/* <img className="status-badge ovr-status-badge" src={this.badges.denied} alt="warning_badge" /> */}

          <div className="cancel-content">
            <p className="cancel-question">{`Contact ${this.props.trip.leaders[0].name}`}</p>
            <p className="cancel-message">
              Please email the requester if you need them to update a request. They can't update a request after it has been reviewed.
            </p>
            <div className="ovr-modal-button-container">
              <input
                ref={this.emailRef}
                type="text"
                className="ovr-requester-email"
                defaultValue={this.props.trip.leaders[0].email}
              />
            </div>
            <div className="ovr-modal-button-container">
              <button type="button" className="vrf-submit-button signup-button" onClick={this.copyEmail}>Copy email address</button>
            </div>
          </div>
        </Modal>
      </Box>

    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    trip: state.trips.trip,
  };
};
export default withRouter(connect(mapStateToProps, { reviewGearRequest, reviewTrippeeGearRequest, reviewPCardRequests, appError })(OPOTripDetails));
