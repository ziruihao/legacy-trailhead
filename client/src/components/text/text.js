import React from 'react';

const Text = (props) => {
  const style = { lineHeight: 1.0 };
  switch (props.color) {
    case 'gray':
      style.color = '#848588';
      break;
    case 'white':
      style.color = 'white';
      break;
    default:
      break;
  }
  switch (props.type) {
    case 'h1':
      style.fontSize = 36;
      style.fontWeight = 800;
      break;
    case 'h2':
      style.fontSize = 24;
      style.fontWeight = 800;
      break;
    case 'h3':
      style.fontSize = 18;
      style.fontWeight = 800;
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
      break;
    default:
      break;
  }
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
      break;
    case 'relaxed':
      style.lineHeight = 1.5;
      break;
    default:
      style.lineHeight = 1.0;
  }
  return (
    <div id={props.id} className={props.className} style={{ ...style, ...props.style }}>{props.children}</div>
  );
};

export default Text;
