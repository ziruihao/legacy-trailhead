import React from 'react';
import ReactTooltip from 'react-tooltip';
import { Stack, Queue, Divider, Box } from '../layout';
import Badge from '../badge';
import './profile-card-small.scss';

const getUserInitials = (userName) => {
  const names = userName.split(' ');
  const firstInitial = names[0].split('')[0];
  const lastInitial = names.length > 1 ? names[names.length - 1].split('')[0] : '';
  return `${firstInitial}${lastInitial}`;
};

const shortenEmail = (email) => {
  if (email.length > 26) {
    return `${email.substring(0, 23)}...`;
  } else return email;
};

const SmallProfileCard = (props) => {
  return (
    <Box dir='row' align='center' pad={25} width={400} className='doc-card'>
      {props.user.name
        ? (
          <Box className='profile-pic-container'>
            <Box className='profile-pic'>
              { props.user.photo_url === ''
                ? <span className='user-initials'>{getUserInitials(props.user.name)}</span>
                : <div className='profile-photo-fit'><img className='profile-photo' id='photo' alt='' src={props.user.photo_url} /> </div>}
            </Box>
          </Box>
        )
        : null
            }
      <Queue size={25} />
      <Box dir='col'>
        <div className='doc-h3'>{props.user.name}</div>
        <Stack size={15} />
        <div className='label-text'>{shortenEmail(props.user.email)}</div>
        <Stack size={15} />
        <Box dir='row'>
          {props.user.role === 'Leader'
            ? (
              <>
                <Badge type='leader' size={36} dataTip dataFor='leader-status-badge' />
                <ReactTooltip id='leader-status-badge' place='bottom'>A DOC subclub leader</ReactTooltip>
                <Queue size={15} />
              </>
            )
            : null
                   }
          {props.user.has_pending_leader_change
            ? (
              <>
                <Badge type='person-pending' size={36} dataTip dataFor='leader-pending-badge' />
                <ReactTooltip id='leader-pending-badge' place='bottom'>Leader status request pending</ReactTooltip>
                <Queue size={15} />
              </>
            )
            : null
                   }
          {props.user.has_pending_cert_change
            ? (
              <>
                <Badge type='pending' size={36} dataTip dataFor='cert-pending-badge' />
                <ReactTooltip id='cert-pending-badge' place='bottom'>Driver cert pending</ReactTooltip>
                <Queue size={15} />
              </>
            )
            : null
                   }
        </Box>
      </Box>
    </Box>
  );
};

export default SmallProfileCard;
