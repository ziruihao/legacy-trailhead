import React from 'react';
import approved from './approved.svg';
import denied from './denied.svg';
import leader from './leader.svg';
import pending from './pending.svg';
import warning from './warning.svg';
import './badge.scss';

const Badge = (props) => {
  switch (props.type) {
    case 'approved':
      return (<img className="doc-badge" alt="approved badge" src={approved} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'denied':
      return (<img className="doc-badge" alt="denied badge" src={denied} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'leader':
      return (<img className="doc-badge" alt="leader badge" src={leader} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'pending':
      return (<img className="doc-badge" alt="pending badge" src={pending} data-tip={props.dataTip} data-for={props.dataFor} />);
    case 'warning':
      return (<img className="doc-badge" alt="warning badge" src={warning} data-tip={props.dataTip} data-for={props.dataFor} />);
    default:
      return null;
  }
};

export default Badge;
