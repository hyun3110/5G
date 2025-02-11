import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecommendedStyles = ({ onFavorite }) => {
  // 추천 스타일 데이터 상태
  const [styles, setStyles] = useState([]);

  // DB에서 추천 스타일 데이터 가져오기
  // useEffect(() => {
  //   const fetchStyles = async () => {
  //     try {
  //       const response = await axios.get(''); // 경로
  //       setStyles(response.data); // 응답 데이터를 상태에 저장
  //     } catch (error) {
  //       console.error('스타일 데이터를 불러오는 중 오류 발생:', error);
  //     }
  //   };

  //   fetchStyles();
  // }, []);

  // 즐겨찾기 상태 변경 함수
  // const toggleFavorite = async (id) => {
  //   const updatedStyles = styles.map((style) =>
  //     style.id === id ? { ...style, isFavorite: !style.isFavorite } : style
  //   );
  //   setStyles(updatedStyles); // UI 업데이트

  //   const updatedStyle = updatedStyles.find((style) => style.id === id);

  //   // 변경된 즐겨찾기 상태를 DB에 저장
  //   try {
  //     await axios.post('http://localhost:8081/api/styles/favorite', {
  //       id: updatedStyle.id,
  //       isFavorite: updatedStyle.isFavorite,
  //     });
  //     console.log('즐겨찾기 상태가 성공적으로 업데이트되었습니다.');
  //   } catch (error) {
  //     console.error('즐겨찾기 상태를 업데이트하는 중 오류 발생:', error);
  //   }

  //   // 부모 컴포넌트로 업데이트된 스타일 정보 전달
  //   onFavorite(updatedStyle);
  // };

  return (
    <div>
      <h3>추천 받은 스타일</h3>
      <div className="style-grid">
        {/* {styles.map((style) => (
          <div key={style.id} className="style-item">
            <img src={style.image} alt={`Style ${style.id}`} className="style-image" />
            <div
              className={`favorite-star ${style.isFavorite ? 'favorite' : ''}`}
              onClick={() => toggleFavorite(style.id)}
            >
              ★
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default RecommendedStyles;
