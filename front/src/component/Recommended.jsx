import React, { useState, useEffect } from 'react';
import { getCoordi, pickCoordi } from '../api/coordisetsService';
import { useUser } from '../context/UserContext';
import '../css/Recommendedstyle.css'

const RecommendedStyles = ({ onFavorite }) => {
  // 추천 스타일 데이터 상태
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가
  const { user } = useUser();

  useEffect(() => {
    if (user && user.id) {
      fetchStyles();
    } 
  }, [user]); // user가 변경될 때마다 실행

  // DB에서 추천 스타일 데이터 가져오기
  const fetchStyles = async () => {
    setLoading(true); // 로딩 시작
    try {
      const response = await getCoordi(user.id);
      setStyles(response);
      setError(null); // 에러 상태 초기화
    } catch (error) {
      setError('스타일 데이터를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false); // 로딩 끝
    }
  };

  // 즐겨찾기 상태 변경 함수
  const toggleFavorite = async (idx) => {
    const updatedStyles = styles.map((style) =>
      style.idx === idx ? { ...style, pick: !style.pick } : style
    );
    setStyles(updatedStyles); // UI 업데이트

    const updatedStyle = updatedStyles.find((style) => style.idx === idx);

    // 변경된 즐겨찾기 상태를 DB에 저장
    try {
      console.log(updatedStyle)
      await pickCoordi(updatedStyle);
      console.log('즐겨찾기 상태가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('즐겨찾기 상태를 업데이트하는 중 오류 발생:', error);
    }

    // 부모 컴포넌트로 업데이트된 스타일 정보 전달
    onFavorite(updatedStyle);
  };

  return (
    <div>
      <h3>추천 받은 스타일</h3>
      {loading && <div>로딩 중...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
  
      <div className="style-container">
        {styles.map((style) => (
          <div key={style.idx} className="style-item">
            <img src={style.img} alt={`Style ${style.idx}`} className="style-image" />
            <div
              className={`favorite-star ${style.pick ? 'favorite' : ''}`}
              onClick={() => toggleFavorite(style.idx)}
            >
              ★
            </div>
          </div>
        ))}
      </div>
    </div>
  );  
};

export default RecommendedStyles;
