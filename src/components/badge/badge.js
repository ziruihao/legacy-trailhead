import React from 'react';
import approved from './approved-badge.svg';
import denied from './denied-badge.svg';
import leader from './leader-badge.svg';
import pending from './pending-badge.svg';
import warning from './warning-badge.svg';
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
