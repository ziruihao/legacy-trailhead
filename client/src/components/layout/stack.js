import React from 'react';
import './layout.scss';

const Stack = (props) => {
  let height = null;
  let minHeight = null;
  const style = { height, minHeight };
  if (props.minSize) {
    if (typeof props.size === 'number') {
      minHeight = `${props.size}px`;
    } else if (typeof props.size === 'string') {
      // eslint-disable-next-line prefer-destructuring
      minHeight = props.size;
    }
  } else if (props.size) {
    if (typeof props.size === 'number') {
      height = `${props.size}px`;
    } else if (typeof props.size === 'string') {
      // eslint-disable-next-line prefer-destructuring
      height = props.size;
    }
  }
  return (
    <div className={`doc-stack${props.expand ? ' expand' : ''}`} style={style} />
  );
};

export default Stack;
