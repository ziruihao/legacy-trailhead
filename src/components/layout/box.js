import React from 'react';
import './layout.scss';

const Box = (props) => {
  const justify = props.justify || 'start';
  const align = props.align || 'stretch';
  const wrap = props.wrap || '';
  const expand = props.expand || '';
  const pad = props.pad || 0;
  const measure = props.measure || 'px';
  return (
    <div className={`doc-box doc-box-${props.dir} justify-${justify} align-${align} ${wrap} ${expand ? 'expand' : ''}`} style={{ padding: `${pad}${measure}` }}>
      {props.children}
    </div>
  );
};

export default Box;
