import React, { useEffect } from 'react';
import { Box } from '../layout';
import { styleSheet } from '../../constants';
import './button.scss';

const Button = (props) => {
  const [hover, setHover] = React.useState(false);
  let className = `${props.className} doc-button-new`;
  const style = { lineHeight: 1.0, borderRadius: '6px', cursor: 'pointer' };
  useEffect(() => {
    className = (hover || props.active) ? `${className} active` : className;
    if ((hover || props.active) && props.color !== 'disabled' && props.type !== 'toggle') {
      style.filter = 'brightness(110%)';
      style.cursor = 'pointer';
    }
  });
  let primaryColor = '';
  let secondaryColor = '';
  let tertiaryColor = '';
  switch (props.color) {
    case 'alarm':
      primaryColor = styleSheet.color.orange;
      secondaryColor = styleSheet.color.white;
      tertiaryColor = styleSheet.color.orange1;
      break;
    case 'disabled':
      primaryColor = styleSheet.color.gray3;
      secondaryColor = styleSheet.color.gray1;
      tertiaryColor = secondaryColor;
      className += ' disabled';
      break;
    case 'green':
      primaryColor = styleSheet.color.green;
      secondaryColor = styleSheet.color.white;
      tertiaryColor = styleSheet.color.green1;
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
      style.fill = primaryColor;
      if ((hover || props.active)) {
        style.backgroundColor = tertiaryColor;
      }
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
  return (
    <Box
      dir='row'
      justify='center'
      align='center'
      pad={[9, 18]}
      style={{ ...style, ...props.style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={props.onClick}
      id={props.id}
      className={className}
    >{props.children}
    </Box>
  );
};

export default Button;
