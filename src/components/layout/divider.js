import React from 'react';
import './layout.scss';

const Divider = (props) => {
  const measure = props.measure || 'px';
  const direction = props.dir || 'horizontal';
  let style = {};
  if (direction === 'horizontal') style = { height: `${props.size}${measure}` };
  else style = { width: `${props.size}${measure}` };
  return (
    <div className={`doc-divider ${direction}`} style={style} />
  );
};

export default Divider;
