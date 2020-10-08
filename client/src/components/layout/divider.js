import React from 'react';
import { styleSheet } from '../../constants';
import './layout.scss';

const Divider = (props) => {
  const dir = props.dir || 'row';
  let size = null;
  let color = null;
  if (props.size) {
    if (typeof props.size === 'number') {
      size = `${props.size}px`;
    } else if (typeof props.size === 'string') {
      // eslint-disable-next-line prefer-destructuring
      size = props.size;
    }
  }
  if (props.color) color = styleSheet.color[props.color];
  // switch (props.color) {
  //   case 'gray':
  //     color = styleSheet.color.gray3;
  //     break;
  //   case 'gray1':
  //     style.color = styleSheet.color.gray1;
  //     break;
  //   case 'white':
  //     color = styleSheet.color.white;
  //     break;
  //   case 'dark-green':
  //     color = styleSheet.color.green3;
  //     break;
  //   default:
  //     break;
  // }
  let style = {};
  if (dir === 'row') style = { height: size, minHeight: size, backgroundColor: color };
  else style = { width: size, minWidth: size, backgroundColor: color };
  return (
    <div className={`${props.className ? props.className : ''} doc-divider doc-divider-${dir}`} style={style} />
  );
};

export default Divider;
