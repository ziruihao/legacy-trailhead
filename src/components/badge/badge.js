import React from 'react';
import approved from './approved-badge.svg';
import denied from './denied-badge.svg';
import leader from './leader-badge.svg';
import pending from './pending-badge.svg';
import warning from './warning-badge.svg';
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
    default:
      return null;
  }
};

export default Badge;
