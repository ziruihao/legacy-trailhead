import React from 'react';
import './layout.scss';

const Stack = (props) => {
  const style = { height: null, minHeight: null };
  if (props.minSize) {
    style.flex = 1;
    if (typeof props.minSize === 'number') {
      style.minHeight = `${props.minSize}px`;
    } else if (typeof props.minSize === 'string') {
      // eslint-disable-next-line prefer-destructuring
      style.minHeight = props.minSize;
    }
  } else if (props.size) {
    if (typeof props.size === 'number') {
      style.height = `${props.size}px`;
    } else if (typeof props.size === 'string') {
      // eslint-disable-next-line prefer-destructuring
      style.height = props.size;
    }
    style.minHeight = style.height;
  }
  return (
    <div className={`doc-stack${props.expand ? ' expand' : ''}`} style={style} />
  );
};

export default Stack;
