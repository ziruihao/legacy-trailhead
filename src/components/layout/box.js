import React from 'react';
import './layout.scss';

const Box = (props) => {
  const justify = props.justify || 'start';
  const align = props.align || 'stretch';
  const self = props.self || 'auto';
  const wrap = props.wrap || '';
  const expand = props.expand || '';
  let padding = null;
  let width = null;
  let height = null;
  if (props.width) {
    if (typeof props.width === 'number') {
      width = `${props.width}px`;
    } else if (typeof props.width === 'string') {
      // eslint-disable-next-line prefer-destructuring
      width = props.width;
    }
  }
  if (props.height) {
    if (typeof props.height === 'number') {
      height = `${props.height}px`;
    } else if (typeof props.height === 'string') {
      // eslint-disable-next-line prefer-destructuring
      height = props.height;
    }
  }
  if (props.pad) {
    if (typeof props.pad === 'number') {
      padding = `${props.pad}px`;
    } else if (typeof props.pad === 'string') {
      padding = props.pad;
    }
  }
  const style = { padding, width, height };
  return (
    <div id={props.id ? props.id : null} className={`${props.className ? props.className : ''} doc-box doc-box-${props.dir} justify-${justify} align-self-${self} align-${align} ${wrap} ${expand ? 'expand' : ''}`} style={style}>
      {props.children}
    </div>
  );
};

export default Box;
