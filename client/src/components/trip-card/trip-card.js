/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import ReactToolTip from 'react-tooltip';
import { Stack, Queue, Divider, Box } from '../layout';
import Badge from '../badge';
import Text from '../text';
import * as constants from '../../constants';
import utils from '../../utils';
import ledyard from './decals/ledyard.png';
import mountain from './decals/dmc.png';
import doc from './decals/doc.png';
import cnt from './decals/cnt.png';
import wiw from './decals/wiw.png';
import wood from './decals/woodsmen.png';
import surf from './decals/surf.png';
import dmbc from './decals/dmbc.png';
import wsc from './decals/wsc.png';
import poc from './decals/poc.jpg';

class TripCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: '',
      status: 'approved',
      reasons: [],
    };
  }

  componentDidMount() {
    // calculates the final status of the trip
    const tripStatus = constants.calculateTripStatus(this.props.trip);
    this.setState({ status: tripStatus.status, reasons: tripStatus.reasons });
    const roleOnTrip = constants.determineRoleOnTrip(this.props.user, this.props.trip);
    this.setState({ role: roleOnTrip });
  }

  renderDecal = (clubName, size) => {
    switch (clubName) {
      case 'Cabin and Trail':
        return <img className={`trip-card-decal ${size}`} style={{ transform: `rotate(${(Math.random() * 30)}deg)` }} src={cnt} alt='' />;
      case 'Women in the Wilderness':
        return <img className={`trip-card-decal ${size}`} style={{ transform: `rotate(${(Math.random() * 30)}deg)` }} src={wiw} alt='' />;
      case 'Surf Club':
        return <img className={`trip-card-decal ${size}`} style={{ transform: `rotate(${(Math.random() * 30)}deg)` }} src={surf} alt='' />;
      case 'Mountain Biking':
        return <img className={`trip-card-decal ${size}`} style={{ transform: `rotate(${(Math.random() * 30)}deg)` }} src={dmbc} alt='' />;
      case 'Winter Sports':
        return <img className={`trip-card-decal ${size}`} style={{ transform: `rotate(${(Math.random() * 30)}deg)` }} src={wsc} alt='' />;
      case 'Timber Team':
        return <img className={`trip-card-decal ${size}`} style={{ transform: `rotate(${(Math.random() * 30)}deg)` }} src={wood} alt='' />;
      case 'Mountaineering':
        return <img className={`trip-card-decal ${size}`} style={{ transform: `rotate(${(Math.random() * 30)}deg)` }} src={mountain} alt='' />;
      case 'Ledyard':
        return <img className={`trip-card-decal ${size}`} style={{ transform: `rotate(${(Math.random() * 30)}deg)` }} src={ledyard} alt='' />;
      case 'People of Color Outdoors':
        return <img className={`trip-card-decal ${size}`} style={{ transform: `rotate(${(Math.random() * 30)}deg)` }} src={poc} alt='' />;
      default:
        return <img className={`trip-card-decal ${size}`} style={{ transform: `rotate(${(Math.random() * 30)}deg)` }} src={doc} alt='' />;
    }
  }

  renderTripTitle = (title) => {
    if (title.length < 40) return title;
    else return `${title.substring(0, 36)}...`;
  }

  renderTripDescription = (description) => {
    return description;
    // if (description.length < 200) return description;
    // else return `${description.substring(0, 196)}...`;
  }

  render() {
    if (this.props.type === 'larg') {
      return (
        <>
          <Box className='trip-card doc-card' width={286} height={330} onClick={this.props.onClick} role='button' tabIndex={0}>
            {/* <div className="trip-card" onClick={this.props.onClick} style={{ transform: `rotate(${(Math.random() * 5) * (Math.floor(Math.random() * 2) === 1 ? 1 : -1)}deg)` }} role="button" tabIndex={0}> */}
            {this.props.displayInfoBadges
              ? (
                <Box dir='col-reverse' width={40} height={40} className='trip-card-badge-holder'>
                  <Badge type={`trip-${this.state.status}`} dataTip dataFor={`trip-card-${this.props.trip._id}`} />
                  <Stack size={12} />
                  {this.state.role === 'LEADER' ? <><Badge type='leader' dataTip dataFor='leader-on-trip-card' /><ReactToolTip id='leader-on-trip-card' place='bottom'>Your are leading this trip</ReactToolTip></> : null}
                  {this.state.role === 'APPROVED' ? <><Badge type='person-approved' dataTip dataFor='approved-on-trip-card' /><ReactToolTip id='approved-on-trip-card' place='bottom'>You've been approved to attend this trip</ReactToolTip></> : null}
                  {this.state.role === 'PENDING' ? <><Badge type='person-pending' dataTip dataFor='pending-on-trip-card' /><ReactToolTip id='pending-on-trip-card' place='bottom'>The leader has not approved you yet</ReactToolTip></> : null}
                </Box>
              )
              : null
              }
            {this.renderDecal(this.props.trip.club.name, 'large')}
            <Box dir='col' pad={15} className='trip-card-body'>
              <Box dir='row' justify='between' align='start'>
                <Text type='overline' color='gray'>TRIP #{this.props.trip.number}</Text>
                <Text type='overline' color='gray'>{this.props.trip.members.length + this.props.trip.pending.length} signups</Text>
              </Box>
              <Stack size={15} />
              <Text type='h2'>{this.renderTripTitle(this.props.trip.title)}</Text>
              <Stack size={15} />
              <Text type='p2'>{utils.dates.formatDate(new Date(this.props.trip.startDateAndTime))} {utils.dates.formatTime(new Date(this.props.trip.startDateAndTime))} - {utils.dates.formatDate(new Date(this.props.trip.endDateAndTime))} {utils.dates.formatTime(new Date(this.props.trip.endDateAndTime))}</Text>
              <Stack size={15} />
              <Text type='p2' className='trip-club-tag'>{this.props.trip.club ? this.props.trip.club.name : ''}</Text>
              <Stack size={15} />
              <Text type='p2' spacing='relaxed' className='trip-card-description'>{this.renderTripDescription(this.props.trip.description)}</Text>
            </Box>
            <div className='trip-card-blur large' />
          </Box>
          <ReactToolTip id={`trip-card-${this.props.trip._id}`} place='bottom'>
            <Box dir='col'>
              {this.state.reasons.length > 0 ? this.state.reasons.map(reason => <div key={reason}>{reason}</div>) : 'This trip is all approved!'}
            </Box>
          </ReactToolTip>
        </>
      );
    } else {
      return (
        <Box dir='row' justify='between' height={108.5} pad={25} className='trip-card doc-card'>
          <Box dir='col' justify=' between'>
            <Text type='h3'>{this.renderTripTitle(this.props.trip.location)}</Text>
            <Stack minSize={15} />
            <Box dir='row'>
              <Box dir='col'>
                <Text type='overline' color='gray'>{utils.dates.formatDate(new Date(this.props.trip.startDateAndTime), { weekday: true })}</Text>
                <Text type='overline' color='gray'>{utils.dates.formatTime(new Date(this.props.trip.startDateAndTime))}</Text>
              </Box>
              -
              <Box dir='col'>
                <Text type='overline' color='gray'>{utils.dates.formatDate(new Date(this.props.trip.endDateAndTime), { weekday: true })}</Text>
                <Text type='overline' color='gray'>{utils.dates.formatTime(new Date(this.props.trip.endDateAndTime))}</Text>
              </Box>
            </Box>
          </Box>
          {this.props.displayDescription
            ? (
              <>
                <Queue minSize={25} />
                <Divider dir='col' size={1} />
                <Queue minSize={25} />
                <Box dir='row' width={200} height={58.5} className='trip-card-body'>
                  <Text type='p2' color='gray' spacing='relaxed' style={{ overflow: 'hidden' }}>{this.props.trip.title}: {this.props.trip.description}</Text>
                  {/* <div className='trip-card-blur small' /> */}
                </Box>
                {/* <Box dir='col' justify='center'>
                  <Text type='p2' className='trip-club-tag'>{this.props.trip.club.name}</Text>
                </Box> */}
              </>
            )
            : <Queue size={158.5} />
          }
          <Queue size={108.5} />
          {this.renderDecal(this.props.trip.club.name, 'small')}
        </Box>
      );
    }
  }
}

export default TripCard;
