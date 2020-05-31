import React from 'react';
import './layout.scss';

const Stack = (props) => {
  const measure = props.measure || 'px';
  return (
    <div className={`doc-stack${props.expand ? ' expand' : ''}`} style={{ height: `${props.size}${measure}` }} />
  );
};

export default Stack;
