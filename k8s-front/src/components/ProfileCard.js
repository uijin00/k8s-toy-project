import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileCard.css';

export default function ProfileCard({ profile }) {
  const navigate = useNavigate();

  return (
    <div 
      className="profile-card"
      onClick={() => navigate(`/ProfileDetail/${profile.id}`)}
    >
      <div className="profile-info">
        <h3 className="profile-name">{profile.name}</h3>
        <p className="profile-intro">{profile.intro}</p>
        <span className="profile-job">
          {profile.job}
        </span>
      </div>
      <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}