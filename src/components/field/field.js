import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

/**
 * @param {String} type Type of <input>, one from https://www.w3schools.com/html/html_form_input_types.asp.
 * @param {Object} width Controlled width, either a Number for pixels or String for CSS value. Default is '100%.'
 * @param {Object} height Controlled height, either a Number for pixels or String for CSS value. Default is 'auto.'
 * @param {String} measure Unit of measurement for width and height props.
 * @param {String} name Unique ID for <input>, used to link with <label>.
 * @param {String} placeholder Placeholder.
 * @param {String} value Value for <input>.
 * @param {Boolean} error Whether or not to display an errored field.
 * @param {Boolean} errorMessage Error notice to display if errored.
 * @param {Function} onChange Function to handle changes.
 */
const Field = (props) => {
  const [seenError, setErrorSeenStatus] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    if (props.error && !seenError) ReactTooltip.show(reactToolTipRef);
  });

  let reactToolTipRef = {};
  const measure = props.measure || 'px';
  const width = `${props.width}${measure}` || '100%';
  const height = `${props.height}${measure}` || 'auto';

  return (
    <>
      <input
        className={`field ${props.error ? 'field-error' : ''}`}
        onChange={(event) => {
          console.log(event.target.name);
          props.onChange(event);
          setErrorSeenStatus(true);
        }}
        name={props.name}
        placeholder={props.placeholder}
        value={props.value}
        type={props.type}
        data-tip
        data-for={props.tooltipID ? props.tooltipID : `${props.name}-field-error`}
        ref={(ref) => { reactToolTipRef = ref; }}
        style={{ width, minWidth: width, height, minHeight: height }}
      />
      {props.error
        ? <ReactTooltip id={props.tooltipID ? props.tooltipID : `${props.name}-field-error`} place="bottom" backgroundColor="#A93A3A" textColor="white">{props.errorMessage}</ReactTooltip>
        : null
      }
    </>
  );
};


export default Field;
