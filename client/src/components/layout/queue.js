import React from 'react';
import './layout.scss';

const Queue = (props) => {
  const style = { width: null, minWidth: null };
  if (props.minSize) {
    style.flex = 1;
    if (typeof props.minSize === 'number') {
      style.minWidth = `${props.minSize}px`;
    } else if (typeof props.minSize === 'string') {
      // eslint-disable-next-line prefer-destructuring
      style.minWidth = props.minSize;
    }
  } else if (props.size) {
    if (typeof props.size === 'number') {
      style.width = `${props.size}px`;
    } else if (typeof props.size === 'string') {
      // eslint-disable-next-line prefer-destructuring
      style.width = props.size;
    }
    style.minWidth = style.width;
  }
  return (
    <div className={`doc-queue${props.expand ? ' expand' : ''}`} style={style} />
  );
};

export default Queue;
