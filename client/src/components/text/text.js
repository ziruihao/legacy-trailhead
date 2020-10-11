import React from 'react';
import { styleSheet } from '../../constants';

const Text = (props) => {
  const style = { lineHeight: 1.0 };
  switch (props.type) {
    case 'h1':
      style.fontSize = 36;
      style.fontWeight = 700;
      style.color = styleSheet.color.green3;
      break;
    case 'h2':
      style.fontSize = 24;
      style.fontWeight = 700;
      style.color = styleSheet.color.green3;
      break;
    case 'h3':
      style.fontSize = 18;
      style.fontWeight = 700;
      style.color = styleSheet.color.green3;
      break;
    case 'p1':
      style.fontSize = 18;
      style.fontWeight = 400;
      break;
    case 'p2':
      style.fontSize = 14;
      style.fontWeight = 400;
      break;
    case 'overline':
      style.fontSize = 16;
      style.fontWeight = 400;
      style.color = styleSheet.color.gray3;
      break;
    case 'button':
      style.fontSize = 18;
      style.fontWeight = 600;
      break;
    default:
      break;
  }
  if (props.color) style.color = styleSheet.color[props.color];
  switch (props.weight) {
    case 'thin':
      style.fontWeight = 100;
      break;
    case 'think':
      style.fontWeight = 400;
      break;
    case 'thick':
      style.fontWeight = 800;
      break;
    default:
      break;
  }
  switch (props.align) {
    case 'center':
      style.textAlign = 'center';
      break;
    case 'right':
      style.textAlign = 'right';
      break;
    case 'justify':
      style.textAlign = 'justify';
      break;
    default:
      break;
  }
  switch (props.variant) {
    case 'italic':
      style.fontStyle = 'italic';
      break;
    default:
      break;
  }
  switch (props.spacing) {
    case 'tight':
      style.lineHeight = 1.0;
      style.minHeight = '1em';
      break;
    case 'relaxed':
      style.lineHeight = 1.5;
      style.minHeight = '1.5em';
      break;
    default:
      style.lineHeight = 1.0;
      style.minHeight = '1em';
  }
  return (
    <div id={props.id} className={props.className} style={{ ...style, ...props.style }}>{props.children}</div>
  );
};

export default Text;
