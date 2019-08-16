/* eslint-disable */
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import Modal from 'react-bootstrap/Modal';
// import Form from 'react-bootstrap/Form';
import { GearRequest, BasicInfo, LeftColumn } from './opo-trip-info-pages';
import '../styles/tripdetails_opo.scss';
import '../styles/createtrip-style.scss';

class OPOTripForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
    }
  }

  nextPage = (e) => {
    // console.log(this.state);
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
            step : step + 1
        });
  }

  prevStep = () => {
        const { step } = this.state
        this.setState({
            step : step - 1
        });
  }

  onButtonClick = (value) => {
    this.setState({
      step : value,
    });
    console.log('this is the new step:', this.state.step);
  }



  // getEachPage = (page) => {
  //   this.setState({
  //     step: page
  //   });
  // }

  render() {
    let page;
    console.log(this.state.step);
    switch(this.state.step) {

      case 1:  page = <BasicInfo
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
                        // console.log("case1");
      case 2:  page = <GearRequest
                        trippeeGear={this.props.trip.trippeeGear}
                        groupGear={this.props.trip.OPOGearRequests}
                        gearStatus={this.props.trip.gearStatus}
                        nextPage={this.nextPage}
                        prevPage={this.backPage}
                      />;
                      break;
      case 3: page = null;
              break;
      case 4: page = null;
              break;

      default:     page = <BasicInfo
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
    console.log(page);
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



export default OPOTripForm;
