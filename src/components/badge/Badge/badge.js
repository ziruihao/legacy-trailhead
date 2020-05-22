import React from 'react';
import approved from './approved.svg';
import denied from './denied.svg';
import leader from './leader.svg';
import pending from './pending.svg';
import warning from './warning.svg';

export const Badge = (props) => {
  switch (props.type) {
    case 'approved':
      return (<img className="doc-badge" alt="approved badge" src={approved} />);
    case 'denied':
      return (<img className="doc-badge" alt="approved badge" src={denied} />);
    case 'leader':
      return (<img className="doc-badge" alt="approved badge" src={leader} />);
    case 'pending':
      return (<img className="doc-badge" alt="approved badge" src={pending} />);
    case 'warning':
      return (<img className="doc-badge" alt="approved badge" src={warning} />);
    default:
      return null;
  }
};

export default Badge;
