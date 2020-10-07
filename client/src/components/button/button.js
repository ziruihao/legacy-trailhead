import React from 'react';
import { Box } from '../layout';
import { styleSheet } from '../../constants';
import './button.scss';

const Button = (props) => {
  const [active, setActivity] = React.useState(props.active === true);
  let className = `${props.className} doc-button`;
  className = active ? `${className} active` : className;
  const style = { lineHeight: 1.0, borderRadius: '6px', cursor: 'pointer' };
  let primaryColor = '';
  let secondaryColor = '';
  switch (props.color) {
    case 'alarm':
      primaryColor = styleSheet.color.orange;
      secondaryColor = styleSheet.color.white;
      break;
    case 'disabled':
      primaryColor = styleSheet.color.gray1;
      secondaryColor = styleSheet.color.gray2;
      className += ' disabled';
      break;
    case 'green':
      primaryColor = styleSheet.color.green;
      secondaryColor = styleSheet.color.white;
      break;
    default:
      primaryColor = styleSheet.color.green;
      secondaryColor = styleSheet.color.white;
      break;
  }
  switch (props.type) {
    case 'hollow':
      style.color = primaryColor;
      style.backgroundColor = secondaryColor;
      style.borderColor = primaryColor;
      style.borderStyle = 'solid';
      style.borderWidth = '3px';
      break;
    case 'toggle':
      className += ' toggle';
      style.color = primaryColor;
      break;
    case 'link':
      className += ' link';
      style.fontSize = 18;
      style.fontWeight = 800;
      break;
    case 'filled':
      style.color = secondaryColor;
      style.backgroundColor = primaryColor;
      break;
    default:
      style.color = secondaryColor;
      style.backgroundColor = primaryColor;
      break;
  }
  console.log(active);
  return (
    <Box
      dir='row'
      justify='center'
      align='center'
      pad={[9, 18]}
      style={{ ...style, ...props.style }}
      onMouseEnter={() => setActivity(true)}
      onMouseLeave={() => {
        if (!props.active) setActivity(false);
      }}
      onClick={props.onClick}
      id={props.id}
      className={className}
    >{props.children}
    </Box>
  );
};

export default Button;
