import React from 'react';
import ReactLoading from 'react-loading';
import { green } from '../../constants';
import logo from './doc-logo.svg';
import './doc-loading.scss';

const DOCLoading = (props) => {
  const measure = measure || 'px';
  return (
    <div id="doc-loading-wrapper">
      {props.type === 'doc'
        ? (
          <img id="doc-loader-image" src={logo} alt="logo" style={{ height: `${props.height}${measure}`, width: `${props.width}${measure}` }} />
        )
        : <ReactLoading {...props} height={`${props.height}${measure}`} width={`${props.width}${measure}`} color={green} />
    }
    </div>
  );
};

export default DOCLoading;
