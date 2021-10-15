/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { Stack, Queue, Divider, Box } from '../../layout';
import { GearRequest, BasicInfo, PCardRequest } from './opo-trip-info-pages';
import OPOVehicleRequest from '../vehicle-request/vehicle-request-approval';
import { ProfileCard } from '../../profile-card';
import Badge from '../../badge';
import Text from '../../text';
import Sidebar from '../../sidebar';
import DOCLoading from '../../doc-loading';
import AttendeeTable from '../../trip-details/full/attendee-table/attendee-table';
import utils from '../../../utils';
import { fetchTrip, reviewGearRequest, reviewTrippeeGearRequest, reviewPCardRequests, appError } from '../../../actions';
import './tripdetails_opo.scss';
import '../../../styles/createtrip-style.scss';


class OPOTripApproval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      currentStep: 1,
      pcardAssigned: '',
      showModal: false,
      numOfPages: null,
      isEditingPcard: true,
      showTrippeeModal: false,
      pcardError: false,
    };
    this.emailRef = React.createRef();
  }

  componentDidMount() {
    this.props.fetchTrip(this.props.match.params.tripID).then(() => {
      const { trip } = this.props;
      const numOfPages = 5;
      // if (trip.gearStatus !== 'N/A' || trip.trippeeGearStatus !== 'N/A') {
      //   numOfPages += 1;
      // }
      // if (trip.pcardStatus !== 'N/A') {
      //   numOfPages += 1;
      // }
      // if (trip.vehicleStatus !== 'N/A') {
      //   numOfPages += 1;
      // }
      const isEditingPcard = trip.pcardStatus === 'pending';
      this.setState({ numOfPages, isEditingPcard });
      this.setState({ loaded: true });
    });
  }

  nextPage = () => {
    if (this.state.currentStep >= this.state.numOfPages) {
      this.props.history.push('/opo-trips');
    } else {
      this.setState((prevState) => {
        return { currentStep: prevState.currentStep + 1 };
      });
    }
  }

  previousPage = () => {
    if (this.state.currentStep !== 1) {
      this.setState((prevState) => {
        return { currentStep: prevState.currentStep - 1 };
      });
    }
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

  reviewPCardRequest = (pcardStatus) => {
    if (this.state.isEditingPcard && pcardStatus !== 'denied' && utils.isStringEmpty(this.state.pcardAssigned)) {
      this.props.appError('Please assign a pcard to this request');
      this.setState({ pcardError: true });
    } else {
      this.setState({ pcardError: false });
      const pcardAssigned = pcardStatus === 'denied' ? '' : this.state.pcardAssigned;
      const review = {
        pcardStatus,
        pcardAssigned,
      };
      this.props.reviewPCardRequests(this.props.trip._id, review)
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
    this.emailRef.current.focus();
    this.emailRef.current.select();
    console.log(document.getSelection());
    document.execCommand('copy');
    event.target.focus();
    this.props.appError('Email copied to clipboard!');
    // this.setState({ showModal: false });
  }

  openTrippeeProfile = (trippee) => {
    this.setState({ currentTrippee: trippee, showTrippeeModal: true });
  }

  render() {
    if (this.state.loaded) {
      let page;
      switch (this.state.currentStep) {
        case 1:
          page = (
            <BasicInfo
              trip={this.props.trip}
            />
          );
          break;
        case 2:
          page = (
            <Box dir='col'>
              <Text type='h1'>Trippees</Text>
              <Stack size={50} />
              <Text type='h2'>Already approved</Text>
              <Stack size={25} />
              <div className='p1'>The trip leader has approved these members to attend the trip. Their attendence is not confirmed until the leader checks them in during the day-of when the trip meets outside of {this.props.trip.pickup}.</div>
              <Stack size={25} />
              <Box className='doc-bordered doc-white' dir='col' align='stretch' pad={25}>
                <AttendeeTable mode='approved' people={this.props.trip.members} emails={this.props.onTripEmail} startDateAndTime={this.props.trip.startDateAndTime} actions={[{ callback: person => window.open(`mailto:${person.user.email}`, '_blank'), message: 'Email' }]} openProfile={this.openTrippeeProfile} />
              </Box>
              <Stack size={50} />
              <Text type='h2'>Still pending</Text>
              <Stack size={25} />
              <div className='p1'>These people signed up for the trip but the leader has not yet approved them to attend. They may or may not ever be approved.</div>
              <Stack size={25} />
              <Box className='doc-bordered doc-white' dir='col' align='stretch' pad={25}>
                <AttendeeTable mode='approved' people={this.props.trip.pending} emails={this.props.onTripEmail} startDateAndTime={this.props.trip.startDateAndTime} actions={[{ callback: person => window.open(`mailto:${person.user.email}`, '_blank'), message: 'Email' }]} openProfile={this.openTrippeeProfile} />
              </Box>
            </Box>
          );
          break;
        case 3:
          page = (
            <GearRequest
              trip={this.props.trip}
              reviewGroupGearRequest={this.reviewGroupGearRequest}
              reviewTrippeeGearRequest={this.reviewTrippeeGearRequest}
            />
          );
          break;
        case 4:
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
              pcardError={this.state.pcardError}
            />
          );
          break;
        case 5:
          if (this.props.trip.vehicleRequest) {
            page = (
              <OPOVehicleRequest
                partOfTrip
                vehicleReqId={this.props.trip.vehicleRequest._id}
              />
            );
          } else {
            page = (
              <>
                <Text type='h1'>Vehicle request</Text>
                <Stack size={50} />
                <Box dir='row' justify='center' align='center' height={100} className='doc-bordered'>
                  <Text type='p1' color='gray3' weight='thin'>None</Text>
                </Box>
              </>
            );
          }
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
        <Box dir='row' expand>
          <Sidebar
            sections={
            [
              { title: `Trip #${this.props.trip.number} Overview`, steps: [{ number: 1, text: 'Basic information' }, { number: 2, text: 'Attendies' }] },
              { title: 'Requests', steps: [{ number: 3, text: 'Gear' }, { number: 4, text: 'P-Card' }, { number: 5, text: 'Vehicles' }] },
            ]
          }
            currentStep={this.state.currentStep}
          />
          <Box dir='col' pad={100} expand>
            <Box dir='col'>
              {page}
            </Box>
            <Stack size={100} />
            <Divider size={1} />
            <Stack size={50} />
            <Box dir='row' justify='between' align='center' id='approval-navigation'>
              <div className={`doc-button hollow ${this.state.currentStep === 1 ? 'disabled' : ''}`} onClick={this.state.currentStep === 1 ? null : this.previousPage} role='button' tabIndex={0}>Previous</div>
              <a id='email-trip-leader-link' href={`mailto:${this.props.trip.leaders.map(leader => leader.email)}`} target='_blank' rel='noopener noreferrer'>Contact trip leaders</a>
              <input type='text' ref={this.emailRef} style={{ display: 'none' }} value={this.props.trip.leaders.map(leader => leader.email).join()} />
              {/* <div className='doc-button' onClick={this.copyEmail} role='button' tabIndex={0}>Copy</div> */}
              <div className='doc-button' onClick={this.nextPage} role='button' tabIndex={0}>
                {this.state.currentStep === this.state.numOfPages ? 'Back to Trip Approvals' : 'Next'}
              </div>
            </Box>
          </Box>
          <Modal
            centered
            show={this.state.showModal}
            onHide={() => this.setState({ showModal: false })}
          >
            <div className='trip-details-close-button'>
              <i className='material-icons close-button' onClick={() => this.setState({ showModal: false })} role='button' tabIndex={0}>close</i>
            </div>
            <Badge type='denied' />
            <div className='cancel-content'>
              <p className='cancel-question'>{`Contact ${this.props.trip.owner.name}`}</p>
              <p className='cancel-message'>
                Please email the requester if you need them to update a request. They can't update a request after it has been reviewed.
              </p>
              <div className='ovr-modal-button-container'>
                <input
                  type='text'
                  className='ovr-requester-email'
                  defaultValue={this.props.trip.owner.email}
                />
              </div>
              <div className='ovr-modal-button-container'>
                <div className='doc-button' onClick={this.copyEmail} role='button' tabIndex={0}>Copy email address</div>
              </div>
            </div>
          </Modal>
          <Modal
            centered
            show={this.state.showTrippeeModal}
            onHide={() => this.setState({ showTrippeeModal: false })}
            size='lg'
          >
            <ProfileCard
              asProfilePage={false}
              isEditing={false}
              user={this.state.currentTrippee}
            />
          </Modal>
        </Box>
      );
    } else return (<DOCLoading type='doc' />);
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    trip: state.trips.trip,
  };
};
export default withRouter(connect(mapStateToProps, { fetchTrip, reviewGearRequest, reviewTrippeeGearRequest, reviewPCardRequests, appError })(OPOTripApproval));
