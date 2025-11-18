const USER_API_BASE_URL = process.env.REACT_APP_USER_API_URL || 'http://localhost:8080';
const PROFILE_API_BASE_URL = process.env.REACT_APP_PROFILE_API_URL || 'http://localhost:8081';

// Access Token을 포함한 fetch 요청
export const fetchWithAuth = async (url, options = {}) => {
  const accessToken = localStorage.getItem('accessToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    let response = await fetch(url, {
      ...options,
      headers,
    });

    // 401 에러 (토큰 만료) 시 토큰 갱신 시도
    if (response.status === 401) {
      const refreshed = await refreshAccessToken();
      
      if (refreshed) {
        // 갱신된 토큰으로 재시도
        const newAccessToken = localStorage.getItem('accessToken');
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        response = await fetch(url, {
          ...options,
          headers,
        });
      } else {
        // 토큰 갱신 실패 시 로그인 페이지로 이동
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.clear();
        window.location.href = '/Login';
        return null;
      }
    }

    return response;
  } catch (error) {
    console.error('API 요청 에러:', error);
    throw error;
  }
};

// Refresh Token으로 Access Token 갱신
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(`${USER_API_BASE_URL}/user/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      console.log('Access Token 갱신 성공');
      return true;
    } else {
      console.error('Token 갱신 실패');
      return false;
    }
  } catch (error) {
    console.error('Token 갱신 에러:', error);
    return false;
  }
};

// 사용자명으로 사용자 ID 조회
export const getUserIdByUsername = async (username) => {
  try {
    const response = await fetchWithAuth(`${USER_API_BASE_URL}/user/name/${username}`);
    
    if (response && response.ok) {
      const userId = await response.text();
      return userId;
    }
    return null;
  } catch (error) {
    console.error('사용자 ID 조회 에러:', error);
    return null;
  }
};

// ==================== Profile API ====================

// 프로필 생성
export const createProfile = async (profileData) => {
  try {
    const response = await fetchWithAuth(`${PROFILE_API_BASE_URL}/profile/create`, {
      method: 'POST',
      body: JSON.stringify(profileData)
    });

    if (response && response.ok) {
      return await response.json();
    } else if (response) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    return null;
  } catch (error) {
    console.error('프로필 생성 에러:', error);
    throw error;
  }
};

// 모든 프로필 조회
export const getAllProfiles = async () => {
  try {
    const response = await fetch(`${PROFILE_API_BASE_URL}/profile/all`);
    
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('프로필 목록 조회 에러:', error);
    return [];
  }
};

// 특정 프로필 조회
export const getProfileById = async (profileId) => {
  try {
    const response = await fetch(`${PROFILE_API_BASE_URL}/profile/${profileId}`);
    
    if (response.ok) {
      return await response.json();
    } else if (response.status === 404) {
      throw new Error('프로필을 찾을 수 없습니다.');
    }
    return null;
  } catch (error) {
    console.error('프로필 조회 에러:', error);
    throw error;
  }
};

// 프로필 삭제
export const deleteProfile = async () => {
  try {
    const response = await fetchWithAuth(`${PROFILE_API_BASE_URL}/profile/delete`, {
      method: 'DELETE'
    });

    if (response && response.ok) {
      const message = await response.text();
      return message;
    } else if (response) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    return null;
  } catch (error) {
    console.error('프로필 삭제 에러:', error);
    throw error;
  }
};


export { USER_API_BASE_URL, PROFILE_API_BASE_URL };