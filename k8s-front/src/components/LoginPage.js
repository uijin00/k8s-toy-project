import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const USER_API_BASE_URL = process.env.REACT_APP_USER_API_URL || 'http://localhost:8080';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !password) {
      alert('이름과 비밀번호를 입력하세요.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${USER_API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          password: password
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // JWT 토큰 저장
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('username', name);
        
        console.log('로그인 성공:', data);
        
        // 로그인 상태 업데이트
        onLogin(name);
        
        alert('로그인 성공!');
        navigate('/'); // 메인 페이지로 이동
      } else {
        const errorText = await response.text();
        alert(errorText || '로그인 실패: 사용자명 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      alert('서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label className="form-label">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="이름을 입력하세요"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label className="form-label">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="비밀번호"
            disabled={loading}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
        <p className="signup-text">
          계정이 없으신가요?{' '}
          <button 
            type="button"
            onClick={() => navigate('/Signup')} 
            className="signup-link"
            disabled={loading}
          >
            회원가입
          </button>
        </p>
      </form>
    </div>
  );
}