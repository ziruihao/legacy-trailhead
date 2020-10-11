import React from 'react';
import ReactLoading from 'react-loading';
import { styleSheet } from '../../constants';
import logo from './doc-logo.svg';
import './doc-loading.scss';

const DOCLoading = (props) => {
  const measure = props.measure || 'px';
  return (
    <div id='doc-loading-wrapper' className={props.className}>
      {props.type === 'doc'
        ? (
          <img id='doc-loader-image' src={logo} alt='logo' style={{ height: `${props.height}${measure}`, width: `${props.width}${measure}` }} />
        )
        : <ReactLoading {...props} height={`${props.height}${measure}`} width={`${props.width}${measure}`} color={styleSheet.color.green} />
    }
    </div>
  );
};

export default DOCLoading;
