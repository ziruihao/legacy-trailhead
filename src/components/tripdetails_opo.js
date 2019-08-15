
import React, {Component} from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchTrip, reviewPCardRequests, appError } from '../actions';
import { GearRequest, BasicInfo, LeftColumn, PCardRequest } from './opo-trip-info-pages';


import '../styles/tripdetails_opo.scss';
import '../styles/createtrip-style.scss';

class OPOTripForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      pcardAssigned: this.props.trip.pcardAssigned ? this.props.trip.pcardAssigned : null,
      showModal: false,
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
  onFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  prevStep = () => {
        const { step } = this.state
        this.setState({
            step : step - 1
        });
  }
  openModal = () =>{
    this.setState({
      showModal: true,
    });
  }
  closeModal = () =>{
    this.setState({
      showModal: false,
    });
  }
  
   approve = () =>{
    if(this.state.pcardAssigned === null){
      this.props.appError('Please assign a pcard to this request');
    }else{
      const review = {
        id:this.props.trip.id,
        pcardStatus: "approved",
        pcardAssigned: parseInt(this.state.pcardAssigned),
      };
      
      this.props.reviewPCardRequests(review);
    
    }
    
  }
  
  //https://stackoverflow.com/questions/52923771/react-copy-component-state-value-to-clipboard-without-dummy-element
   copy = () =>{
    let text = document.getElementById("leader-email").innerText;
    let elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = text;
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
    this.closeModal();
  }
  
   deny = () => {
    this.showModal();
    const review = {
      id: this.props.trip.id,
      pcardStatus: "denied",
      pcardAssigned: parseInt(this.state.pcardAssigned),
    };
    
    this.props.reviewPCardRequests(review);
  
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
      case 3: page = <PCardRequest
                      trip = {this.props.trip}
                      copy = {this.copy}
                      approve = {this.approve}
                      deny = {this.deny}
                      onFieldChange = {this.onFieldChange}
                      openModal = {this.openModal}
                      closeModal = {this.closeModal}
                      showModal = {this.state.showModal}
                      pcardAssigned = {this.state.pcardAssigned}


                      />;

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
        />
        { page }

      </div>
    );

  }
}



export default withRouter(connect(mapStateToProps,{ fetchTrip, reviewPCardRequests, appError })(OPOTripDetails));;
