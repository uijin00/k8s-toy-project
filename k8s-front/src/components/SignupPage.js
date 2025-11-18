import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

const USER_API_BASE_URL = process.env.REACT_APP_USER_API_URL || 'http://localhost:8080';

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 이름 중복 확인
  const checkNameAvailability = async (username) => {
    try {
      const response = await fetch(`${USER_API_BASE_URL}/user/check-name?name=${encodeURIComponent(username)}`);
      const message = await response.text();
      return message.includes('사용 가능');
    } catch (error) {
      console.error('이름 확인 에러:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !password || !confirmPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 4) {
      alert('비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      // 이름 중복 확인
      const isNameAvailable = await checkNameAvailability(name);
      if (!isNameAvailable) {
        alert('이미 사용 중인 닉네임입니다. 다른 이름을 선택해주세요.');
        setLoading(false);
        return;
      }

      // 회원가입 요청
      const response = await fetch(`${USER_API_BASE_URL}/user/signup`, {
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
        const message = await response.text();
        console.log('회원가입 성공:', message);
        alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
        navigate('/Login');
      } else {
        const errorText = await response.text();
        alert(errorText || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      alert('서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">회원가입</h2>
      <form onSubmit={handleSubmit} className="signup-form">
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
            placeholder="비밀번호 (최소 4자)"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label className="form-label">비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            placeholder="비밀번호 확인"
            disabled={loading}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '가입 중...' : '가입하기'}
        </button>
        <p className="login-text">
          이미 계정이 있으신가요?{' '}
          <button 
            type="button"
            onClick={() => navigate('/Login')} 
            className="login-link"
            disabled={loading}
          >
            로그인
          </button>
        </p>
      </form>
    </div>
  );
}