import React from 'react';
import { ProfileCardEdit } from '../profile-card';
import './profile-page.scss';

function ProfilePage(props) {
  return (
    <div id="profile-page" className="center-view">
      <div id="profile-card-wrapper">
        <ProfileCardEdit />
      </div>
    </div>
  );
}

export default ProfilePage;
