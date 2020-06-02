import React from 'react';
import edit from './icons/edit-icon.svg';
import email from './icons/email-icon.svg';
import phone from './icons/phone-icon.svg';
import save from './icons/save-icon.svg';
import warning from './icons/warning-icon.svg';

import './icon.scss';

const Icon = (props) => {
  const id = props.id || null;
  const measure = props.measure || 'px';
  const style = { width: `${props.size ? `${props.size}${measure}` : '100%'}` };
  switch (props.type) {
    case 'approved':
      return (<img id={id} className="doc-icon" alt="approved icon" style={style} src={edit} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'denied':
      return (<img id={id} className="doc-icon" alt="denied icon" style={style} src={email} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'leader':
      return (<img id={id} className="doc-icon" alt="leader icon" style={style} src={phone} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'pending':
      return (<img id={id} className="doc-icon" alt="pending icon" style={style} src={save} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'warning':
      return (<img id={id} className="doc-icon" alt="warning icon" style={style} src={warning} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    default:
      return null;
  }
};

export default Icon;
