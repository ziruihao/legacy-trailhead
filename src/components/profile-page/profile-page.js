import React from 'react';
import { ProfileCardEdit } from '../profile-card';
import './profile-page.scss';

function ProfilePage(props) {
  return (
    <div id="profile-page" className="center-view">
      <ProfileCardEdit />
    </div>
  );
}

export default ProfilePage;
