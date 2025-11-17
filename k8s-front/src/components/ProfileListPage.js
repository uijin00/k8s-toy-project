import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import { getAllProfiles } from '../utils/apiUtils';
import './ProfileListPage.css';

export default function ProfileListPage() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 프로필 목록 불러오기
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAllProfiles();
      setProfiles(data);
      console.log('프로필 목록 로드 성공:', data);
    } catch (err) {
      console.error('프로필 목록 로드 실패:', err);
      setError('프로필 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="list-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadProfiles} className="retry-btn">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <h2 className="list-title">프로필 목록</h2>
        <button
          onClick={() => navigate('/ProfileCreate')}
          className="create-profile-btn"
        >
          + 새 프로필 만들기
        </button>
      </div>
      
      {/* 프로필 카드 리스트 */}
      <div className="profile-list">
        {profiles && profiles.length > 0 ? (
          profiles.map(profile => (
            <ProfileCard key={profile.id} profile={profile} />
          ))
        ) : (
          <div className="empty-state">
            <p className="empty-message">
              아직 등록된 프로필이 없습니다.
            </p>
            <button
              onClick={() => navigate('/ProfileCreate')}
              className="create-first-profile-btn"
            >
              첫 프로필 만들기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}