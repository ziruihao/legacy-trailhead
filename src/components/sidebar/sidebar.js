import React from 'react';
import './sidebar.scss';

const Sidebar = (props) => {
  return (
    <div id="sidebar">
      {props.sections.map(section => (
        <div className="sidebar-section">
          <div className="sidebar-section-title doc-h2">
            {section.title}
          </div>
          {section.steps.map(step => (
            <div className="sidebar-section-row">
              <div className={props.currentStep === step.number ? 'sidebar-highlight' : ''} />
              <div className={`${props.currentStep === step.number ? 'sidebar-text-highlight' : ''} doc-h3`}>{step.text}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
