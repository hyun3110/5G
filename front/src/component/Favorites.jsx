import React, { useState, useEffect } from "react";
import { getPickCoordi } from "../api/coordisetsService";
import { useUser } from '../context/UserContext';
import '../css/Favoritesstyle.css'

const Favorites = () => {
  const { user } = useUser();
  const [styles, setStyles] = useState([]);  // 초기값을 빈 배열로 설정

  useEffect(() => {
    if (user && user.id) {
      pick();  // user가 존재하면 pick() 호출
    }
  }, [user]);

  const pick = async () => {
    try {
      const response = await getPickCoordi(user.id);

      // 응답이 정상적으로 오지 않거나, 빈 배열일 경우 처리
      if (response && Array.isArray(response)) {
        setStyles(response);
      } else {
        console.error('빈 배열이거나 유효하지 않은 응답입니다.');
        setStyles([]);  // 유효하지 않은 데이터가 올 경우 빈 배열로 초기화
      }
    } catch (error) {
      console.error('즐겨찾기 오류:', error);
      setStyles([]);  // 오류 발생 시 빈 배열로 초기화
    }
  };

  return (
    <div>
      <h3>즐겨찾기</h3>
      <div className="favorites-container">
        {styles.length > 0 ? (
          styles.map((style) => (
            <div key={style.idx} className="favorites-item">
              {style.img ? (
                <img
                  src={style.img}
                  alt={`Favorite ${style.idx}`}
                  className="favorites-image"
                />
              ) : (
                <p>이미지가 없습니다.</p>
              )}
            </div>
          ))
        ) : (
          <p>즐겨찾기한 스타일이 없습니다.</p>
        )}
      </div>
    </div>
  );  
};

export default Favorites;
