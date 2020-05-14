import React from 'react';
import ReactLoading from 'react-loading';
import { green } from '../../constants';
import logo from './logo.svg';
import './loading.scss';

const Loading = props => (
  <div id="loading-wrapper">
    {props.type === 'doc'
      ? (
        <img id="loader-image" src={logo} alt="logo" style={{ height: `${props.height}px`, width: `${props.width}px` }} />
      )
      : <ReactLoading {...props} color={green} />
    }
  </div>
);

export default Loading;
