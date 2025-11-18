import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProfileById, deleteProfile } from '../utils/apiUtils';
import './ProfileDetailPage.css';

export default function ProfileDetailPage({ loggedInUser }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // 프로필 로드
  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getProfileById(id);
      setProfile(data);
      console.log('프로필 로드 성공:', data);
    } catch (err) {
      console.error('프로필 로드 실패:', err);
      setError(err.message || '프로필을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!loggedInUser) {
      alert('로그인이 필요합니다.');
      navigate('/Login');
      return;
    }

    if (!window.confirm('정말로 이 프로필을 삭제하시겠습니까?')) {
      return;
    }

    setDeleting(true);

    try {
      await deleteProfile();
      alert('프로필이 삭제되었습니다.');
      navigate('/ProfileList');
    } catch (err) {
      console.error('프로필 삭제 실패:', err);
      alert(err.message || '프로필 삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="detail-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-container">
        <div className="not-found">
          <h2 className="not-found-title">{error}</h2>
          <button
            onClick={() => navigate('/ProfileList')}
            className="back-to-list-btn"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="detail-container">
        <div className="not-found">
          <h2 className="not-found-title">프로필을 찾을 수 없습니다.</h2>
          <button
            onClick={() => navigate('/ProfileList')}
            className="back-to-list-btn"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <button 
        onClick={() => navigate('/ProfileList')}
        className="back-link"
      >
        &larr; 목록으로 돌아가기
      </button>

      <div className="profile-detail">
        <div className="profile-header">
          <div>
            <h1 className="profile-detail-name">{profile.name}</h1>
            <p className="profile-detail-intro">{profile.intro}</p>
            {profile.job && (
              <span className="profile-detail-job">{profile.job}</span>
            )}
          </div>
          
          {loggedInUser && (
            <button
              onClick={handleDelete}
              className="delete-btn"
              disabled={deleting}
            >
              {deleting ? '삭제 중...' : '프로필 삭제'}
            </button>
          )}
        </div>
        
        <hr className="divider" />

        <div className="strengths-section">
          <h3 className="strengths-title">나의 장점</h3>
          <p className="strengths-content">
            {profile.strengths || '등록된 장점이 없습니다.'}
          </p>
        </div>

        <hr className="divider" />

        <div className="profile-meta">
          <p className="meta-item">
            <strong>생성일:</strong> {formatDate(profile.createdAt)}
          </p>
          <p className="meta-item">
            <strong>수정일:</strong> {formatDate(profile.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}