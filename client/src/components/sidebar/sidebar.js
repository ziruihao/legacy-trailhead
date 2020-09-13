import React from 'react';
import { Box, Stack, Queue, Divider } from '../layout';
import Text from '../text';
import './sidebar.scss';

const Sidebar = (props) => {
  return (
    <Box dir='col' pad={[30, 0, 0, 0]} width={350} id='sidebar'>
      {props.sections.map(section => (
        <div className='sidebar-section' key={section.title}>
          <Stack size={36} />
          <Box dir='row'>
            <Queue size={30} />
            <Text type='h2'>{section.title}</Text>
          </Box>
          <Stack size={36} />
          {section.steps.map(step => (
            <div className='sidebar-section-row' key={step.number}>
              <div className={props.currentStep === step.number ? 'sidebar-highlight' : ''} />
              <div className={`${props.currentStep === step.number ? 'sidebar-text-highlight' : ''} doc-h3`}>{step.text}</div>
            </div>
          ))}
        </div>
      ))}
    </Box>
  );
};

export default Sidebar;
