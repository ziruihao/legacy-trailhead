import React, {Component, Fragment} from 'react';
import '../styles/tripdetails_opo.scss';
import '../styles/createtrip-style.scss';



class OPOTripDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //0 is basic info, 1 is gear requests, 2 is pcard requests
      render: 0
    }
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
renderPCardRequest = () =>{
  console.log(this.props.trip);
  return(
    <div>
      <p> P-Card Request </p>
      <div>
        <table>
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
              <td>{this.props.trip.pcard[1].totalCost}</td>
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
                      <td>{j.totalCost}</td>
                    </tr>
                );
              }  
              )            
              );
            }
            )
            }
          </tbody>
        </table>
      </div>

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


export default OPOTripDetails;
