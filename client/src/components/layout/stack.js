import React from 'react';
import './layout.scss';

const Stack = (props) => {
  const style = { height: null, minHeight: null };
  if (props.minSize) {
    if (typeof props.size === 'number') {
      style.minHeight = `${props.size}px`;
    } else if (typeof props.size === 'string') {
      // eslint-disable-next-line prefer-destructuring
      style.minHeight = props.size;
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
