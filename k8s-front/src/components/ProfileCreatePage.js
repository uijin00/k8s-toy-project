import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProfile } from '../utils/apiUtils';
import './ProfileCreatePage.css';

export default function ProfileCreatePage({ loggedInUser }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    intro: '',
    strengths: '',
    job: ''
  });

  // 로그인 체크
  React.useEffect(() => {
    if (!loggedInUser) {
      alert('로그인이 필요합니다.');
      navigate('/Login');
    }
  }, [loggedInUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    if (formData.name.length > 100) {
      alert('이름은 100자 이내로 입력해주세요.');
      return;
    }

    if (formData.intro && formData.intro.length > 500) {
      alert('소개는 500자 이내로 입력해주세요.');
      return;
    }

    if (formData.job && formData.job.length > 100) {
      alert('직무는 100자 이내로 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      // 백엔드 API 호출
      const response = await createProfile(formData);
      
      if (response) {
        console.log('프로필 생성 성공:', response);
        alert('프로필이 성공적으로 생성되었습니다!');
        navigate('/ProfileList');
      }
    } catch (error) {
      console.error('프로필 생성 실패:', error);
      alert(error.message || '프로필 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container">
      <h2 className="create-title">프로필 만들기</h2>
      
      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label className="form-label">
            이름 <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="이름을 입력하세요 (최대 100자)"
            maxLength={100}
            disabled={loading}
            required
          />
          <span className="char-count">{formData.name.length}/100</span>
        </div>

        <div className="form-group">
          <label className="form-label">소개</label>
          <textarea
            name="intro"
            value={formData.intro}
            onChange={handleChange}
            className="form-textarea"
            placeholder="자기소개를 입력하세요 (최대 500자)"
            rows={4}
            maxLength={500}
            disabled={loading}
          />
          <span className="char-count">{formData.intro.length}/500</span>
        </div>

        <div className="form-group">
          <label className="form-label">장점</label>
          <textarea
            name="strengths"
            value={formData.strengths}
            onChange={handleChange}
            className="form-textarea"
            placeholder="나의 장점을 입력하세요"
            rows={6}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">직무</label>
          <input
            type="text"
            name="job"
            value={formData.job}
            onChange={handleChange}
            className="form-input"
            placeholder="직무를 입력하세요 (최대 100자)"
            maxLength={100}
            disabled={loading}
          />
          <span className="char-count">{formData.job.length}/100</span>
        </div>

        <div className="button-group">
          <button
            type="button"
            onClick={() => navigate('/ProfileList')}
            className="cancel-btn"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '생성 중...' : '프로필 생성'}
          </button>
        </div>
      </form>
    </div>
  );
}