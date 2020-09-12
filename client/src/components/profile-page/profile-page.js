import React from 'react';
import { Stack, Queue, Divider, Box } from '../layout';
import { ProfileCardEdit } from '../profile-card';
import './profile-page.scss';

function ProfilePage(props) {
  return (
    <Box dir='col' align='center' className='center-view'>
      <Stack size={100} />
      <ProfileCardEdit />
      <Stack size={100} />
    </Box>
  );
}

export default ProfilePage;
