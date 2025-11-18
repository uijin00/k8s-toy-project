import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/MainPage';
import Login from './components/LoginPage';
import Signup from './components/SignupPage';
import ProfileCreate from './components/ProfileCreatePage';
import ProfileDetail from './components/ProfileDetailPage';
import ProfileList from './components/ProfileListPage';
import Header from './components/HeaderComponents';
import './App.css';

const USER_API_BASE_URL = 'http://localhost:8080';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  // 컴포넌트 마운트 시 로컬 스토리지에서 로그인 정보 복원
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const accessToken = localStorage.getItem('accessToken');
    
    if (savedUsername && accessToken) {
      setLoggedInUser(savedUsername);
      console.log('저장된 로그인 정보 복원:', savedUsername);
    }
  }, []);

  const handleLogin = (username) => {
    setLoggedInUser(username);
    console.log('로그인 성공:', username);
  };

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (accessToken) {
        // 서버에 로그아웃 요청
        await fetch(`${USER_API_BASE_URL}/user/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
      }
    } catch (error) {
      console.error('로그아웃 에러:', error);
    } finally {
      // 로컬 스토리지 정리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      
      setLoggedInUser(null);
      console.log('로그아웃 완료');
      alert('로그아웃되었습니다.');
    }
  };

  // Layout 컴포넌트 (Header를 포함)
  const Layout = ({ children }) => (
    <>
      <Header loggedInUser={loggedInUser} onLogout={handleLogout} />
      {children}
    </>
  );

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/Login" element={<Login onLogin={handleLogin} />} />
          <Route path="/Signup" element={<Signup />} />
          <Route 
            path="/ProfileCreate" 
            element={<ProfileCreate loggedInUser={loggedInUser} />} 
          />
          <Route 
            path="/ProfileDetail/:id" 
            element={<ProfileDetail loggedInUser={loggedInUser} />} 
          />
          <Route 
            path="/ProfileList" 
            element={<ProfileList />} 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;