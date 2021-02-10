import React from 'react';
import './layout.scss';

const Box = (props) => {
  const justify = props.justify || 'start';
  const align = props.align || 'stretch';
  const self = props.self || 'auto';
  const wrap = props.wrap ? 'wrap' : '';
  const expand = props.expand || false;
  let padding = null;
  let margin = null;
  let width = null;
  let height = null;
  let minHeight = 'fit-content';
  let maxHeight = null;
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
    minHeight = height;
    maxHeight = height;
  }
  if (props.pad) {
    if (typeof props.pad === 'number') {
      padding = `${props.pad}px`;
    } else if (typeof props.pad === 'string') {
      padding = props.pad;
    } else if (Array.isArray(props.pad)) {
      padding = `${props.pad.reduce((prev, curr) => { return `${prev}px ${curr}`; })}px`.trim();
    }
  }
  if (props.marg) {
    if (typeof props.marg === 'number') {
      margin = `${props.marg}px`;
    } else if (typeof props.marg === 'string') {
      margin = props.marg;
    } else if (Array.isArray(props.marg)) {
      margin = `${props.marg.reduce((prev, curr) => { return `${prev}px ${curr}`; })}px`.trim();
    }
  }
  const style = { padding, margin, width, minWidth: width, maxWidth: width, height, minHeight, maxHeight };
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      id={props.id ? props.id : null}
      className={`${props.className ? props.className : ''} doc-box doc-box-${props.dir} justify-${justify} align-self-${self} align-${align} ${wrap} ${expand ? 'expand' : ''}`}
      style={{ ...style, ...props.style }}
      onClick={props.onClick}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      role={props.role || 'button'}
      tabIndex={props.tabIndex || 0}
      data-tip={props['data-tip'] === true ? true : undefined}
      data-for={props['data-for'] || undefined}
    >
      {props.children}
    </div>
  );
};

export default Box;
