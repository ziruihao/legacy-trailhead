import React from 'react';
import './layout.scss';

const Divider = (props) => {
  const dir = props.dir || 'row';
  let size = null;
  if (props.size) {
    if (typeof props.size === 'number') {
      size = `${props.size}px`;
    } else if (typeof props.size === 'string') {
      // eslint-disable-next-line prefer-destructuring
      size = props.size;
    }
  }
  const color = props.color || null;
  let style = {};
  if (dir === 'row') style = { height: size, minHeight: size, backgroundColor: color };
  else style = { width: size, minWidth: size, backgroundColor: color };
  return (
    <div className={`${props.className ? props.className : ''} doc-divider doc-divider-${dir}`} style={style} />
  );
};

export default Divider;
