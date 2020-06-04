import React from 'react';
import edit from './icons/edit-icon.svg';
import email from './icons/email-icon.svg';
import phone from './icons/phone-icon.svg';
import save from './icons/save-icon.svg';
import warning from './icons/warning-icon.svg';
import check from './icons/check-icon.svg';
import close from './icons/close-icon.svg';
import date from './icons/date-icon.svg';
import doc from './icons/doc-icon.svg';
import dropdown from './icons/dropdown-icon.svg';
import more from './icons/more-icon.svg';
import tree from './icons/tree-icon.svg';
import mountain from './icons/mountain-icon.svg';

import './icon.scss';

const Icon = (props) => {
  const id = props.id || null;
  const measure = props.measure || 'px';
  const style = { width: `${props.size ? `${props.size}${measure}` : '100%'}` };
  switch (props.type) {
    case 'edit':
      return (<img id={id} className="doc-icon" alt="approved icon" style={style} src={edit} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'email':
      return (<img id={id} className="doc-icon" alt="denied icon" style={style} src={email} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'phone':
      return (<img id={id} className="doc-icon" alt="leader icon" style={style} src={phone} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'save':
      return (<img id={id} className="doc-icon" alt="pending icon" style={style} src={save} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'warning':
      return (<img id={id} className="doc-icon" alt="warning icon" style={style} src={warning} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'check':
      return (<img id={id} className="doc-icon" alt="approved icon" style={style} src={check} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'close':
      return (<img id={id} className="doc-icon doc-icon-close" alt="close icon" style={style} src={close} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'date':
      return (<img id={id} className="doc-icon" alt="leader icon" style={style} src={date} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'doc':
      return (<img id={id} className="doc-icon" alt="pending icon" style={style} src={doc} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'dropdown':
      return (<img id={id} className="doc-icon" alt="warning icon" style={style} src={dropdown} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'tree':
      return (<img id={id} className="doc-icon" alt="warning icon" style={style} src={tree} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'mountain':
      return (<img id={id} className="doc-icon" alt="warning icon" style={style} src={mountain} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    default:
      return null;
  }
};

export default Icon;
