import React from 'react';
import './layout.scss';

const Queue = (props) => {
  let width = null;
  let minWidth = null;
  const style = { width, minWidth: minWidth || width };
  if (props.size) {
    if (typeof props.size === 'number') {
      width = `${props.size}px`;
    } else if (typeof props.size === 'string') {
      // eslint-disable-next-line prefer-destructuring
      width = props.size;
    }
  }
  if (props.minSize) {
    style.flex = 1;
    if (typeof props.minSize === 'number') {
      minWidth = `${props.minSize}px`;
    } else if (typeof props.minSize === 'string') {
      // eslint-disable-next-line prefer-destructuring
      minWidth = props.minSize;
    }
  }
  return (
    <div className={`doc-queue${props.expand ? ' expand' : ''}`} style={{ width, minWidth: minWidth || width }} />
  );
};

export default Queue;
