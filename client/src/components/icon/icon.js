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
import calendar from './icons/calendar-icon.svg';
import cert from './icons/cert-icon.svg';
import marker from './icons/marker-icon.svg';
import trip from './icons/trip-icon.svg';
import vehicle from './icons/vehicle-icon.svg';
import filter from './icons/filter.svg';

import './icon.scss';

const Icon = (props) => {
  const id = props.id || null;
  const measure = props.measure || 'px';
  const style = { width: `${props.size ? `${props.size}${measure}` : '100%'}` };
  switch (props.type) {
    case 'edit':
      return (<img id={id} className='doc-icon' alt='approved icon' style={style} src={edit} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'email':
      return (<img id={id} className='doc-icon' alt='denied icon' style={style} src={email} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'phone':
      return (<img id={id} className='doc-icon' alt='leader icon' style={style} src={phone} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'save':
      return (<img id={id} className='doc-icon' alt='pending icon' style={style} src={save} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'warning':
      return (<img id={id} className='doc-icon' alt='warning icon' style={style} src={warning} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'check':
      return (<img id={id} className='doc-icon' alt='approved icon' style={style} src={check} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'close':
      return (<img id={id} className='doc-icon doc-icon-close' alt='close icon' style={style} src={close} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'date':
      return (<img id={id} className='doc-icon' alt='leader icon' style={style} src={date} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'doc':
      return (<img id={id} className='doc-icon' alt='pending icon' style={style} src={doc} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'dropdown':
      return (<img id={id} className='doc-icon' alt='warning icon' style={style} src={dropdown} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'tree':
      return (<img id={id} className='doc-icon' alt='warning icon' style={style} src={tree} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'mountain':
      return (<img id={id} className='doc-icon' alt='warning icon' style={style} src={mountain} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'more':
      return (<img id={id} className='doc-icon' alt='more icon' style={style} src={more} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'calendar':
      return (<img id={id} className='doc-icon' alt='calendar icon' style={style} src={calendar} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'cert':
      return (<img id={id} className='doc-icon' alt='cert icon' style={style} src={cert} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'marker':
      return (<img id={id} className='doc-icon' alt='marker icon' style={style} src={marker} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'trip':
      return (<img id={id} className='doc-icon' alt='trip icon' style={style} src={trip} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'vehicle':
      return (<img id={id} className='doc-icon' alt='vehicle icon' style={style} src={vehicle} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    case 'filter':
      return (
        <div id={id} className='doc-icon' alt='vehicle icon' style={style} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} role='button' tabIndex={0}>
          <svg width={`${props.size}${measure}`} height={`${props.size}${measure}`} viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'>
            <path fillRule='evenodd' clipRule='evenodd' d='M0 8V13.5556H50V8H0ZM19.4444 41.3333H30.5555V35.7778H19.4444V41.3333ZM41.6667 27.4445H8.33333V21.8889H41.6667V27.4445Z' />
          </svg>
        </div>
      );
    // case 'filter':
    //   return (<img id={id} className='doc-icon' alt='filter icon' style={style} src={filter} data-tip={props.dataTip} data-for={props.dataFor} onClick={props.onClick} />);
    default:
      return null;
  }
};

export default Icon;
