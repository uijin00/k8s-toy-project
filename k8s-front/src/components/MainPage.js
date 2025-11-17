import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <div className="main-content">
        <h1 className="main-title">나만의 프로필을 만들어보세요</h1>
        <p className="main-description">
          간단하게 당신의 장점과 원하는 직무를 공유하고 새로운 기회를 만나보세요.
        </p>
        <div className="button-group">
          <button 
            onClick={() => navigate('/ProfileList')}
            className="btn btn-primary"
          >
            프로필 보러가기
          </button>
          <button 
            onClick={() => navigate('/ProfileCreate')}
            className="btn btn-secondary"
          >
            내 프로필 만들기
          </button>
        </div>
      </div>
    </div>
  );
}