import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Codirecstyle.css';

const CodiRecommend = ({ schedule }) => {
  // 추천된 스타일 데이터를 저장하는 상태
  const [recommendedOutfits, setRecommendedOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  // DB에서 추천 스타일 데이터 가져오기
  useEffect(() => {
    const fetchRecommendedOutfits = async () => {
      if (!schedule.type || !schedule.feelsLike || !schedule.weather) {
        console.warn('⚠️ 추천을 위해 필요한 정보가 부족합니다.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post('http://localhost:8081/api/recommend', {
          type: schedule.type,  // 일정 유형 (결혼식, 데이트, 출퇴근)
          feelsLike: schedule.feelsLike,  // 기온
          weather: schedule.weather,  // 날씨 상태 (Clear, Rain 등)
        });

        setRecommendedOutfits(response.data); // 추천된 스타일 저장
        setLoading(false);
      } catch (error) {
        console.error('❌ 코디 추천 데이터를 불러오는 중 오류 발생:', error);
        setLoading(false);
      }
    };

    fetchRecommendedOutfits();
  }, [schedule]); // `schedule` 변경될 때마다 실행

  // 즐겨찾기 기능 추가
  const toggleFavorite = async (id) => {
    const updatedOutfits = recommendedOutfits.map((outfit) =>
      outfit.id === id ? { ...outfit, isFavorite: !outfit.isFavorite } : outfit
    );
    setRecommendedOutfits(updatedOutfits);

    const updatedOutfit = updatedOutfits.find((outfit) => outfit.id === id);

    // DB에 즐겨찾기 상태 업데이트
    try {
      await axios.post('http://localhost:8081/api/outfits/auth', {
        id: updatedOutfit.id,
        isFavorite: updatedOutfit.isFavorite,
      });
      console.log('⭐ 즐겨찾기 상태가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('❌ 즐겨찾기 상태 업데이트 중 오류 발생:', error);
    }
  };

  return (
    <div className="codi-recommend-container">
      <h3>추천된 코디</h3>
      {loading ? (
        <p>로딩 중...</p>
      ) : recommendedOutfits.length > 0 ? (
        <div className="codi-grid">
          {recommendedOutfits.map((outfit) => (
            <div key={outfit.id} className="codi-item">
              <img src={outfit.image} alt={`Outfit ${outfit.id}`} className="codi-image" />
              <div className="codi-details">
                <p>{outfit.description}</p>
                <div
                  className={`favorite-star ${outfit.isFavorite ? 'favorite' : ''}`}
                  onClick={() => toggleFavorite(outfit.id)}
                >
                  ★
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>추천할 코디가 없습니다. 다른 조건을 선택해보세요.</p>
      )}
    </div>
  );
};

export default CodiRecommend;
