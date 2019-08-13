import React, {Component, Fragment} from 'react';
import Modal from 'react-bootstrap/Modal';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { editTrip, appError } from '../actions';

import '../styles/tripdetails_opo.scss';
import '../styles/createtrip-style.scss';



class OPOTripDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //0 is basic info, 1 is gear requests, 2 is pcard requests
      render: 0,
      pcardAssigned: null,
      showModal: false,
    }
    this.onFieldChange = this.onFieldChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.deny = this.deny.bind(this);
    this.approve = this.approve.bind(this);
  }


 getCoLeaders = (leaders) => {
  let coleaders = '';
  leaders.forEach((leader, index) => {
    if (index !== 0) {
      coleaders += `${leader.name}, `;
    }
  });
  coleaders = coleaders.substring(0, coleaders.length - 2);
  coleaders = coleaders.length === 0 ? 'None' : coleaders;
  return coleaders;
}

formatDate = (date, startTime, endTime) => {
  let timeString = '';
  const rawDate = new Date(date);
  const dateString = rawDate.toString();
  timeString = `${dateString.slice(0, 3)},${dateString.slice(3, 10)}`;
  const startSplitTime = startTime.split(':');
  const endSplitTime = endTime.split(':');
  startSplitTime.push('am');
  endSplitTime.push('pm');
  if (startSplitTime[0] > 12) {
    startSplitTime[0] -= 12;
    startSplitTime[2] = 'pm';
  }
  if (endSplitTime[0] > 12) {
    endSplitTime[0] -= 12;
    endSplitTime[2] = 'am';
  }
  timeString = `${timeString}, ${startSplitTime[0]}:${startSplitTime[1]}${startSplitTime[2]}, ${endSplitTime[0]}:${endSplitTime[1]}${endSplitTime[2]}}`;
  return timeString;
}
onFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
renderBasicInformation = () => {
  return(
    <div className="col-9 right-column">
        <span className="page-title">Basic Information</span>
        <div className="row">
          <span className="sub-titles">Date</span>
          <span className="sub-fields">{this.formatDate(this.props.trip.startDate, this.props.trip.startTime, this.props.trip.endTime)}</span>
        </div>
        <div className="row">
          <span className="sub-titles">Subclub</span>
          <span className="sub-fields">{this.props.trip.club.name}</span>
        </div>
        <div className="row">
          <span className="sub-titles">Leader</span>
          <span className="sub-fields">{this.props.trip.leaders[0].name}</span>
        </div>
        <div className="row">
          <span className="sub-titles">Co-Leader(s)</span>
          <span className="sub-fields">{this.getCoLeaders(this.props.trip.leaders)}</span>
        </div>
        <div className="row">
          <span id="description" className="sub-titles">Description</span>
        </div>
        <div className="row">
          <span id="description-field" className="sub-fields">{this.props.trip.description}</span>
        </div>
      </div>
  );
}
showModal = () =>{
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
  const trip = {
    title: this.props.trip.title,
    leaders: this.props.trip.leaders,
    club: this.props.trip.club,
    members: this.props.trip.members,
    pending: this.props.trip.pending,
    startDate: this.props.trip.startDate,
    endDate: this.props.trip.endDate,
    location: this.props.trip.location,
    pickup: this.props.trip.pickup,
    dropoff: this.props.trip.dropoff,
    mileage: this.props.trip.mileage,
    cost: this.props.trip.cost,
    description: this.props.trip.description,
    experienceNeeded: this.props.trip.experienceNeeded,
    co_leader_access: this.props.trip.co_leader_access,
    OPOGearRequests: this.props.trip.OPOGearRequests,
    trippeeGear: this.props.trip.trippeeGear,
    gearStatus: this.props.trip.gearStatus,
    trippeeGearStatus: this.props.trippeeGearStatus,
    pcard: this.props.pcard,
    pcardStatus: "approved",
    pcardAssigned: this.state.pcardAssigned,
    vehicleStatus: this.props.trip.vehicleStatus,
    id: this.props.trip.id,

  }

  this.props.editTrip(trip, this.props.history);

}

deny = () => {
  this.showModal();
  const trip = {
    title: this.props.trip.title,
    leaders: this.props.trip.leaders,
    club: this.props.trip.club,
    members: this.props.trip.members,
    pending: this.props.trip.pending,
    startDate: this.props.trip.startDate,
    endDate: this.props.trip.endDate,
    location: this.props.trip.location,
    pickup: this.props.trip.pickup,
    dropoff: this.props.trip.dropoff,
    mileage: this.props.trip.mileage,
    cost: this.props.trip.cost,
    description: this.props.trip.description,
    experienceNeeded: this.props.trip.experienceNeeded,
    co_leader_access: this.props.trip.co_leader_access,
    OPOGearRequests: this.props.trip.OPOGearRequests,
    trippeeGear: this.props.trip.trippeeGear,
    gearStatus: this.props.trip.gearStatus,
    trippeeGearStatus: this.props.trippeeGearStatus,
    pcard: this.props.pcard,
    pcardStatus: "denied",
    pcardAssigned: this.state.pcardAssigned,
    vehicleStatus: this.props.trip.vehicleStatus,
    id: this.props.trip.id,

  }

  this.props.editTrip(trip, this.props.history);

}
renderPCardRequest = () =>{
  return(
    <div className = "pcard-opo">
      <Modal
    centered
    show = {this.state.showModal}
  >
    <div className="trip-details-close-button">
      <i className="material-icons close-button" onClick={this.closeModal} role="button" tabIndex={0}>close</i>
    </div>
    <div className="cancel-content">
      <p className="cancel-question">Contact Leader</p>
      <p className="cancel-message">To contact the trip leader, please copy their email address and send them an email</p>
      <p className="cancel-question">{this.props.trip.leaders[0].email}</p>
    </div>

  </Modal>
      <h1> P-Card Request </h1>
      <div>
          <table className = "pcard-overview-table">
            <thead>
              <tr>
              <th>Reason</th>
              <th>Subclub</th>
              <th># of Participants</th>
              <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                <td>Food, others</td>
                <td>{this.props.trip.club.name}</td>
                <td>{this.props.trip.pcard[0].participants}</td>
                <td>${this.props.trip.pcard[1].totalCost}</td>
                </tr>
            </tbody>
          </table>
          <table>
          <thead>
            <tr>
            <th>Expense Details</th>
            <th>Unit Cost</th>
            <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
          { this.props.trip.pcard[2].reason.map((i) =>{
            return(
              i.info.map((j)=>{
                return(
                    <tr>
                      <td>{j.expenseDetails}</td>
                      <td>{j.unitCost}</td>
                      <td>${j.totalCost}</td>
                    </tr>
                );}));})}
          </tbody>
        </table>
        <div className = "pcard-assign">
            <p style= {{display: "block", fontWeight: "bold", fontSize: "12pt"}}>P-Card Assigned</p>
            <input 
                    className = "pcard-assign-input"
                    onChange={this.props.onFieldChange}
                    name="pcardAssigned"
                    placeholder="e.g. 1234"
                    value={this.state.pcardAssigned}
                    />
          </div>
      </div>
      <button type="button" className="btn approve-button" onClick={this.approve}>Approve and Notify Leader</button>
      <button type="button" className="btn deny-button" onClick={this.deny}>Contact Leader</button>
    </div>

  );
}
renderGearRequest = () =>{
  return(
    <div>
        gear request frontend
    </div>

  );
}
renderInfo = (info) => {
  if(this.state.render === 1){
    return this.renderGearRequest();
  }else if (this.state.render === 2){
    return this.renderPCardRequest();
  }
  return this.renderBasicInformation();
  
}
changeRenderState = (num) =>{
  this.setState({
    render: num
  });

}
render(){
  return (
    <div className="row my-row">
      <div className="col-3 left-column">
        <span className="trip-title">{this.props.trip.title}</span>
        <div className="row column-headers column-adjust">
          <p>Trip Overview</p>
        </div>
        <div className="row column-sub-headers" onClick = {() => this.changeRenderState(0)}>
          <p>Basic information</p>
        </div>
        <div className="row column-headers">
          <p>OPO Requests</p>
        </div>
        <div className="row column-sub-headers" onClick = {() => this.changeRenderState(1)}>
          <p>Gear Request</p>
        </div>
        <div className="row column-sub-headers" onClick = {() => this.changeRenderState(2)}>
          <p>P-Card Request</p>
        </div>
      </div>
      {this.renderInfo(this.state.render)}
    </div>
  );
}

}

const mapStateToProps = (state) => {
  return {
    trip: state.trips.trip,
  };
};

export default withRouter(connect(mapStateToProps,{ editTrip, appError })(OPOTripDetails));;
