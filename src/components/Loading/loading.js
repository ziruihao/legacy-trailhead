import React from 'react';
import ReactLoading from 'react-loading';
import { green } from '../../constants';
import logo from './logo.svg';
import './eslint-has-a-problem-with-a-simple-filename-so-here-it-is.scss';

const Loading = props => (
  <div id="loading-wrapper">
    {props.type === 'doc'
      ? (
        <img id="loader-image" src={logo} alt="logo" style={{ height: `${props.height}${props.measure}`, width: `${props.width}${props.measure}` }} />
      )
      : <ReactLoading {...props} height={`${props.height}${props.measure}`} width={`${props.width}${props.measure}`} color={green} />
    }
  </div>
);

export default Loading;
