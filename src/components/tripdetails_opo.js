/* eslint-disable */

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchTrip, reviewPCardRequests, appError } from '../actions';
import { GearRequest, BasicInfo, LeftColumn, PCardRequest } from './opo-trip-info-pages';
import '../styles/tripdetails_opo.scss';
import '../styles/createtrip-style.scss';

class OPOTripDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      pcardAssigned: '',
      showModal: false,
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.approve = this.approve.bind(this);
    console.log(this.state);
  }

  onFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  nextPage = (e) => {
    e.preventDefault();
    this.nextStep();
  }

  backPage = (e) => {
    e.preventDefault();
    this.prevStep();
  }

  nextStep = () => {
    // console.log('nextStep');
    const { step } = this.state
    this.setState({
      step: step + 1
    });
  }
  onFieldChange(event) {
    this.setState({
      step: step + 1,
    });
  }


  prevStep = () => {
    const { step } = this.state
    this.setState({
      step: step - 1
    });
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

  isStringEmpty = (string) => {
    return string.length === 0 || !string.toString().trim();
  };

  approve = () => {
    if (this.isStringEmpty(this.state.pcardAssigned)) {
      this.props.appError('Please assign a pcard to this request');
    } else {
      const review = {
        id: this.props.trip.id,
        pcardStatus: "approved",
        pcardAssigned: this.state.pcardAssigned,
      };

      this.props.reviewPCardRequests(review);

    }


const formatDate = (date, startTime, endTime) => {
  let timeString = '';
  const rawDate = new Date(date);
  const dateString = rawDate.toUTCString();
  timeString = dateString.substring(0, 11);
  
  const startSplitTime = startTime.split(':');
  startSplitTime.push(' AM');
  const originalStartHour = startSplitTime[0];
  startSplitTime[0] = originalStartHour % 12;
  if (originalStartHour >= 12) {
    startSplitTime[2] = ' PM';
  }
  if (startSplitTime[0] === 0) {
    startSplitTime[0] = 12;
  }

  const endSplitTime = endTime.split(':');
  endSplitTime.push(' AM');
  const originalEndHour = endSplitTime[0];
  endSplitTime[0] = originalEndHour % 12;
  if (originalEndHour >= 12) {
    endSplitTime[2] = ' PM';
  }
  if (endSplitTime[0] === 0) {
    endSplitTime[0] = 12;
  }

  timeString = `${timeString}, ${startSplitTime[0]}:${startSplitTime[1]}${startSplitTime[2]}, ${endSplitTime[0]}:${endSplitTime[1]}${endSplitTime[2]}}`;
  return timeString;
};
  }

  //https://stackoverflow.com/questions/52923771/react-copy-component-state-value-to-clipboard-without-dummy-element
  copy = () => {
    let text = document.getElementById("leader-email").innerText;
    let elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = text;
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
    this.closeModal();
  }

  deny = () => {
    this.openModal();
    const review = {
      id: this.props.trip.id,
      pcardStatus: 'denied',
      pcardAssigned: parseInt(this.state.pcardAssigned, 10),
    };

    this.props.reviewPCardRequests(review);
  }


  render() {
    let page;
    switch (this.state.step) {

      case 1: page = <BasicInfo
        startDate={this.props.trip.startDate}
        endDate={this.props.trip.endDate}
        startTime={this.props.trip.startTime}
        endTime={this.props.trip.endTime}
        clubName={this.props.trip.club.name}
        leaders={this.props.trip.leaders[0].name}
        coLeaders={this.props.trip.leaders}
        description={this.props.trip.description}
        nextPage={this.nextPage}
      />;
        break;
      case 2: page = <GearRequest
        trippeeGear={this.props.trip.trippeeGear}
        groupGear={this.props.trip.OPOGearRequests}
        gearStatus={this.props.trip.gearStatus}
        nextPage={this.nextPage}
        prevPage={this.backPage}
      />;
        break;
      case 3: page = <PCardRequest
        trip={this.props.trip}
        copy={this.copy}
        approve={this.approve}
        deny={this.deny}
        onFieldChange={this.onFieldChange}
        openModal={this.openModal}
        closeModal={this.closeModal}
        showModal={this.state.showModal}
        pcardAssigned={this.state.pcardAssigned}


      />;

        break;
      case 4: page = null;
        break;

      default: page = <BasicInfo
        startDate={this.props.trip.startDate}
        endDate={this.props.trip.endDate}
        startTime={this.props.trip.startTime}
        endTime={this.props.trip.endTime}
        clubName={this.props.trip.club.name}
        leaders={this.props.trip.leaders[0].name}
        coLeaders={this.props.trip.leaders}
        description={this.props.trip.description}
        nextPage={this.nextPage}
      />;
        break;
    }
    return (
      <div className="row my-row">
        <LeftColumn
          currentStep={this.state.currentStep}
        />
        <div className="right-column">
          <div className="create-trip-form-page">
            {page}
          </div>
          <div className="create-trip-bottom-buttons create-trips-top-margin">
            <button disabled={this.state.step === 1} type="button" className="btn next-button" onClick={this.backPage}>Previous</button>
            <button type="button" className="btn next-button" onClick={this.state.step === 3 ? () => this.props.history.push('/opo-trips') : this.nextPage}>
              {this.state.step === 3 ? 'Back to dashboard' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    trip: state.trips.trip,
  };
};
export default withRouter(connect(mapStateToProps, { fetchTrip, reviewPCardRequests, appError })(OPOTripDetails));;
