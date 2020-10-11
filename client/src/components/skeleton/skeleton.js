import React from 'react';
import { styleSheet } from '../../constants';

const Skeleton = (props) => {
  const style = { opacity: 0.3 };
  if (props.color) style.backgroundColor = styleSheet.color[props.color];
  if (props.width) {
    if (typeof props.width === 'number') {
      style.width = `${props.width}px`;
    } else if (typeof props.width === 'string') {
      // eslint-disable-next-line prefer-destructuring
      style.width = props.width;
    }
  }
  if (props.height) {
    if (typeof props.height === 'number') {
      style.height = `${props.height}px`;
    } else if (typeof props.height === 'string') {
      // eslint-disable-next-line prefer-destructuring
      style.height = props.height;
    }
  }
  return (
    <div id={props.id} className={props.className} style={{ ...style, ...props.style }} />
  );
};

export default Skeleton;
