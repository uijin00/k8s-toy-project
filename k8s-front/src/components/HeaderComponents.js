import React from 'react';
import { useNavigate } from 'react-router-dom';  // Outlet 제거
import './HeaderComponents.css';

export default function HeaderComponents({ loggedInUser, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <nav className="nav-container">
        <div 
          className="logo"
          onClick={() => navigate('/')}
        >
          MyProfile
        </div>
        <div className="nav-buttons">
          <button onClick={() => navigate('/ProfileList')} className="nav-link">프로필 목록</button>
          <button onClick={() => navigate('/ProfileCreate')} className="nav-link">프로필 만들기</button>
          {loggedInUser ? (
            <>
              <span className="welcome-text">환영합니다, {loggedInUser}님!</span>
              <button onClick={onLogout} className="btn btn-logout">로그아웃</button>
            </>
          ) : (
            <button onClick={() => navigate('/Login')} className="btn btn-login">로그인</button>
          )}
        </div>
      </nav>
    </header>
  );
}