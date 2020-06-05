import React from 'react';
import approved from './badges/approved-badge.svg';
import denied from './badges/denied-badge.svg';
import leader from './badges/leader-badge.svg';
import pending from './badges/pending-badge.svg';
import warning from './badges/warning-badge.svg';
import add from './badges/add-badge.svg';
import id from './badges/id-badge.svg';
import list from './badges/list-badge.svg';
import marker from './badges/marker-badge.svg';
import people from './badges/people-badge.svg';
import person from './badges/person-badge.svg';
import personCheck from './badges/person-check-badge.svg';
import trips from './badges/trips-badge.svg';
import vehicle from './badges/vehicle-badge.svg';
import verified from './badges/verified-badge.svg';
import calendar from './badges/calendar-badge.svg';
import personApproved from './badges/person-approved-badge.svg';
import personPending from './badges/person-pending-badge.svg';
import personDenied from './badges/person-denied-badge.svg';
import tripApproved from './badges/trips-approved-badge.svg';
import tripPending from './badges/trips-pending-badge.svg';
import tripDenied from './badges/trips-denied-badge.svg';

import './badge.scss';

const Badge = (props) => {
  const measure = props.measure || 'px';
  const style = { width: `${props.size ? `${props.size}${measure}` : '100%'}`, height: `${props.size ? `${props.size}${measure}` : '100%'}` };
  switch (props.type) {
    case 'approved':
      return (<img className="doc-badge" alt="approved badge" style={style} src={approved} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'denied':
      return (<img className="doc-badge" alt="denied badge" style={style} src={denied} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'leader':
      return (<img className="doc-badge" alt="leader badge" style={style} src={leader} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'pending':
      return (<img className="doc-badge" alt="pending badge" style={style} src={pending} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'warning':
      return (<img className="doc-badge" alt="warning badge" style={style} src={warning} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'add':
      return (<img className="doc-badge" alt="add badge" style={style} src={add} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'id':
      return (<img className="doc-badge" alt="id badge" style={style} src={id} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'list':
      return (<img className="doc-badge" alt="list badge" style={style} src={list} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'marker':
      return (<img className="doc-badge" alt="marker badge" style={style} src={marker} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'people':
      return (<img className="doc-badge" alt="people badge" style={style} src={people} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'person':
      return (<img className="doc-badge" alt="person badge" style={style} src={person} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'person-check':
      return (<img className="doc-badge" alt="person badge" style={style} src={personCheck} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'trips':
      return (<img className="doc-badge" alt="trips badge" style={style} src={trips} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'vehicle':
      return (<img className="doc-badge" alt="vehicle badge" style={style} src={vehicle} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'verified':
      return (<img className="doc-badge" alt="verified badge" style={style} src={verified} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'calendar':
      return (<img className="doc-badge" alt="calendar badge" style={style} src={calendar} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'person-approved':
      return (<img className="doc-badge" alt="person badge" style={style} src={personApproved} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'person-pending':
      return (<img className="doc-badge" alt="person badge" style={style} src={personPending} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'person-denied':
      return (<img className="doc-badge" alt="trips badge" style={style} src={personDenied} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'trip-approved':
      return (<img className="doc-badge" alt="vehicle badge" style={style} src={tripApproved} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'trip-pending':
      return (<img className="doc-badge" alt="verified badge" style={style} src={tripPending} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'trip-denied':
      return (<img className="doc-badge" alt="calendar badge" style={style} src={tripDenied} data-tip={props.dataTip} data-for={props.dataFor} />);
    default:
      return null;
  }
};

export default Badge;
