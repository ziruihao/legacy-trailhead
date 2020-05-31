import React from 'react';
import './layout.scss';

const Queue = (props) => {
  const measure = props.measure || 'px';
  return (
    <div className={`doc-queue${props.expand ? ' expand' : ''}`} style={{ width: `${props.size}${measure}` }} />
  );
};

export default Queue;
