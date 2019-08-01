import React, {Component} from 'react';
d4fc24b18b115d0dceb5505755faebef9638f30
// import { Link } from 'react-router-dom';
// import Modal from 'react-bootstrap/Modal';
// import Form from 'react-bootstrap/Form';
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
  return(
    <div>
        pcard request frontend
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

// const getPendingRows = (penders, moveToTrip) => {
//   return penders.map(pender => (
//     <div key={pender._id} className="leader-detail-row">
//       <span>{pender.user.name}</span>
//       <span>{pender.user.email}</span>
//       <span>
//         {pender.gear.length !== 0 ? pender.gear.map(gear => (
//           <li key={gear._id}>{gear.gear}</li>
//         )) : <span>None</span>}
//       </span>
//       <button type="button" className="signup-button leader-signup-button" onClick={() => moveToTrip(pender)}>Move to trip</button>
//     </div>
//   ));
// };

// const getPending = (props, pendingEmailRef) => {
//   if (props.trip.pending.length === 0) {
//     return (
//       <div className="no-on-trip">
//         <h4 className="none-f-now">None</h4>
//       </div>
//     );
//   } else {
//     return (
//       <div>
//         <div className="leader-detail-row">
//           <span>Name</span>
//           <span>Email</span>
//           <span>Gear Requests</span>
//           <span>Action</span>
//         </div>
//         <hr className="detail-line" />
//
//         {getPendingRows(props.trip.pending, props.moveToTrip)}
//
//         <div>
//           <h5>Emails</h5>
//           <div className="emails">
//             <Form className="col-9">
//               <Form.Control ref={pendingEmailRef} as="textarea" value={props.pendingEmail} name="pendingEmail" onChange={props.onTextChange} />
//             </Form>
//             <button type="button" className="signup-button leader-signup-button copy-button" onClick={props.copyPendingToClip}>Copy</button>
//           </div>
//         </div>
//       </div>
//     );
//   }
// };
//
// const getOnTripRows = (members, moveToPending) => {
//   return members.map(member => (
//     <div key={member._id} className="leader-detail-row">
//       <span>{member.user.name}</span>
//       <span>{member.user.email}</span>
//       <span>
//         {member.gear.length !== 0 ? member.gear.map(gear => (
//           <li key={gear._id}>{gear.gear}</li>
//         )) : <span>None</span>}
//       </span>
//       <button type="button" className="leader-cancel-button" onClick={() => moveToPending(member)}>Move to pending</button>
//     </div>
//   ));
// };
//
// const getOnTrip = (props, onTripEmailRef) => {
//   if (props.trip.members.length === 0) {
//     return (
//       <div className="no-on-trip">
//         <h4 className="none-f-now">None</h4>
//       </div>
//     );
//   } else {
//     return (
//       <div className="leader-on-trip-details">
//         <div className="leader-detail-row">
//           <span>Name</span>
//           <span>Email</span>
//           <span>Gear Requests</span>
//           <span>Action</span>
//         </div>
//         <hr className="detail-line" />
//
//         {getOnTripRows(props.trip.members, props.moveToPending)}
//
//         <div>
//           <h5>Emails</h5>
//           <div className="emails">
//             <Form className="col-9">
//               <Form.Control ref={onTripEmailRef} as="textarea" value={props.onTripEmail} name="onTripEmail" onChange={props.onTextChange} />
//             </Form>
//             <button type="button" className="signup-button leader-signup-button copy-button" onClick={props.copyOnTripToClip}>Copy</button>
//           </div>
//         </div>
//
//       </div>
//     );
//   }
// };
//
// const getGearStatus = (gearStatus) => {
//   switch (gearStatus) {
//     case 'pending':
//       return (
//         <span className="detail-right">Pending <img className="status-badge" src="/src/img/pending_badge.svg" alt="pending_badge" /> </span>
//       );
//     case 'approved':
//       return (
//         <span className="detail-right">Approved <img className="status-badge" src="/src/img/approved_badge.svg" alt="approved_badge" /> </span>
//       );
//     case 'denied':
//       return (
//         <span className="leader-detail-right">Denied <img className="status-badge" src="/src/img/denied_badge.svg" alt="denied_badge" /> </span>
//       );
//     default:
//       return (
//         <span className="detail-right">Pending <img className="status-badge" src="/src/img/pending_badge.svg" alt="pending_badge" /> </span>
//       );
//   }
// };
//
// const getIndividualGear = (individualGearArray, individualGearStatus) => {
//   if (individualGearArray.length === 0) {
//     return (
//       <div className="no-gear">
//         <div className="trip-detail">
//           <div className="no-on-trip">
//             <h4 className="none-f-now">None</h4>
//           </div>
//         </div>
//       </div>
//     );
//   } else {
//     return (
//       <div>
//         <div className="detail-row gear-status">
//           <span className="detail-left">Status</span>
//           {getGearStatus(individualGearStatus)}
//         </div>
//         <div className="trip-detail">
//           <div className="detail-row gear-header">
//             <h4 className="leader-detail-left">Gear</h4>
//             <h4 className="leader-detail-right">Quantity</h4>
//           </div>
//           <hr className="detail-line" />
//           {individualGearArray.map((gear, index, array) => (
//             <div key={gear._id}>
//               <div className="detail-row">
//                 <span>{gear.gear}</span>
//                 <span>{gear.quantity}</span>
//               </div>
//               {index !== array.length - 1 ? <hr className="detail-line" /> : null}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }
// };
//
// const getGroupGear = (groupGearArray, groupGearStatus) => {
//   if (groupGearArray.length === 0) {
//     return (
//       <div className="no-gear">
//         <div className="trip-detail">
//           <div className="no-on-trip">
//             <h4 className="none-f-now">None</h4>
//           </div>
//         </div>
//       </div>
//     );
//   } else {
//     return (
//       <div>
//         <div className="detail-row gear-status">
//           <span className="detail-left">Status</span>
//           {getGearStatus(groupGearStatus)}
//         </div>
//         <div className="trip-detail">
//           <div className="leader-trip-detail-row">
//             <h4>Gear</h4>
//           </div>
//           <hr className="detail-line" />
//           {groupGearArray.map((gear, index, array) => (
//             <div key={index}>
//               <div className="leader-trip-detail-row">
//                 <span>{gear}</span>
//               </div>
//               {index !== array.length - 1 ? <hr className="detail-line" /> : null}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }
// };

}


export default OPOTripDetails;
