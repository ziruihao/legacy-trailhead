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
      pcardAssigned:"",
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
    const { step } = this.state;
    this.setState({
      step: step + 1,
    });
  }


  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1,
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

  approve = () => {
    if (this.state.pcardAssigned === null) {
      this.props.appError('Please assign a pcard to this request');
    } else {
      const review = {
        id: this.props.trip.id,
        pcardStatus: 'approved',
        pcardAssigned: parseInt(this.state.pcardAssigned, 10),
      };
      this.props.reviewPCardRequests(review);
    }
  }

  //  https://stackoverflow.com/questions/52923771/react-copy-component-state-value-to-clipboard-without-dummy-element
  copy = () => {
    const text = document.getElementById('leader-email').innerText;
    const elem = document.createElement('textarea');
    document.body.appendChild(elem);
    elem.value = text;
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
    this.closeModal();
  }

  deny = () => {
    this.showModal();
    const review = {
      id: this.props.trip.id,
      pcardStatus: 'denied',
      pcardAssigned: parseInt(this.state.pcardAssigned, 10),
    };
    this.props.reviewPCardRequests(review);
  }


  onButtonClick = (value) => {
    this.setState({
      step: value,
    });
    console.log('this is the new step:', this.state.step);
  }

  render() {
    let page;
    console.log(this.state.step);
    switch (this.state.step) {
      case 1:
        page = (
          <BasicInfo
            startDate={this.props.trip.startDate}
            endDate={this.props.trip.endDate}
            startTime={this.props.trip.startTime}
            endTime={this.props.trip.endTime}
            clubName={this.props.trip.club.name}
            leaders={this.props.trip.leaders[0].name}
            coLeaders={this.props.trip.leaders}
            description={this.props.trip.description}
            nextPage={this.nextPage}
          />
        );
        break;

      case 2:
        page = (
          <GearRequest
            trippeeGear={this.props.trip.trippeeGear}
            groupGear={this.props.trip.OPOGearRequests}
            gearStatus={this.props.trip.gearStatus}
            nextPage={this.nextPage}
            prevPage={this.backPage}
          />
        );
        break;
      case 3:
        page = (
          <PCardRequest
            trip={this.props.trip}
            copy={this.copy}
            approve={this.approve}
            deny={this.deny}
            onFieldChange={this.onFieldChange}
            openModal={this.openModal}
            closeModal={this.closeModal}
            showModal={this.state.showModal}
            pcardAssigned={this.state.pcardAssigned}
            nextPage={this.nextPage}
            prevPage={this.backPage}
          />
        );
        break;
      case 4:
        page = null;
        break;

      default:
        page = (
          <BasicInfo
            startDate={this.props.trip.startDate}
            endDate={this.props.trip.endDate}
            startTime={this.props.trip.startTime}
            endTime={this.props.trip.endTime}
            clubName={this.props.trip.club.name}
            leaders={this.props.trip.leaders[0].name}
            coLeaders={this.props.trip.leaders}
            description={this.props.trip.description}
            nextPage={this.nextPage}
          />
        );
        break;
    }
    return (
      <div className="row my-row">
        <LeftColumn
          tripTitle={this.props.trip.title}
          step={this.state.step}
          setState={this.onButtonClick}
        />
        { page }
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
export default withRouter(connect(mapStateToProps, { fetchTrip, reviewPCardRequests, appError })(OPOTripDetails));
