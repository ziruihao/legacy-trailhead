import React from 'react';
import ReactToolTip from 'react-tooltip';
import Badge from '../badge';
import * as constants from '../../constants';
import ledyard from './decals/ledyard.png';
import mountain from './decals/dmc.png';
import doc from './decals/doc.png';
import cnt from './decals/cnt.png';
import wiw from './decals/wiw.png';
import wood from './decals/woodsmen.png';
import surf from './decals/surf.png';
import dmbc from './decals/dmbc.png';
import wsc from './decals/wsc.png';

class TripCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userIsLeader: false,
      status: 'approved',
      reasons: [],
    };
  }

  componentDidMount() {
    // determines whether the user is a leader or co-leader in this trip
    this.props.trip.leaders.forEach(((leader) => {
      if (leader._id === this.props.user._id) {
        this.setState({ userIsLeader: true });
      }
    }));
    // calculates the final status of the trip
    const tripStatus = constants.calculateTripStatus(this.props.trip);
    this.setState({ status: tripStatus.status, reasons: tripStatus.reasons });
  }

  renderDecal = (clubName) => {
    switch (clubName) {
      case 'Cabin and Trail':
        return <img className="trip-card-decal" src={cnt} alt="" />;
      case 'Women in the Wilderness':
        return <img className="trip-card-decal" src={wiw} alt="" />;
      case 'Surf Club':
        return <img className="trip-card-decal" src={surf} alt="" />;
      case 'Mountain Biking':
        return <img className="trip-card-decal" src={dmbc} alt="" />;
      case 'Winter Sports':
        return <img className="trip-card-decal" src={wsc} alt="" />;
      case 'Woodsmen':
        return <img className="trip-card-decal" src={wood} alt="" />;
      case 'Mountaineering':
        return <img className="trip-card-decal" src={mountain} alt="" />;
      case 'Ledyard':
        return <img className="trip-card-decal" src={ledyard} alt="" />;
      default:
        return <img className="trip-card-decal" src={doc} alt="" />;
    }
  }

  renderTripTitle = (title) => {
    if (title.length < 40) return title;
    else return `${title.substring(0, 36)}...`;
  }

  renderTripDescription = (description) => {
    if (description.length < 200) return description;
    else return `${description.substring(0, 196)}...`;
  }

  render() {
    return (
      <div className="trip-card" onClick={this.props.onClick} role="button" tabIndex={0}>
        <div className="trip-card-badge-holder">
          <Badge type={this.state.status} dataTip dataFor={`trip-card-${this.props.trip._id}`} />
        </div>
        {this.renderDecal(this.props.trip.club.name)}
        <div className="trip-card-body">
          <div className="label-text">TRIP #{this.props.trip.number}</div>
          <div className="doc-h2">{this.renderTripTitle(`${this.state.userIsLeader ? '[L]' : ''} ${this.props.trip.title}`)}</div>
          <div className="p2 trip-card-date">{constants.formatDate(this.props.trip.startDate)} - {constants.formatDate(this.props.trip.endDate)}</div>
          <div className="p2 trip-card-club">{this.props.trip.club ? this.props.trip.club.name : ''}</div>
          <div className="p2">{this.renderTripDescription(this.props.trip.description)}</div>
        </div>
        <ReactToolTip id={`trip-card-${this.props.trip._id}`} place="bottom">
          Reasons: {this.state.reasons.length > 0 ? this.state.reasons.reduce((all, current) => `${all}, ${current}`) : null}
        </ReactToolTip>
      </div>
    );
  }
}

export default TripCard;
