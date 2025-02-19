import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/MainCodirecommend.css"; // 기존 스타일 유지

const MainCodirecommend = () => {
  const navigate = useNavigate();

  // 코디 추천 버튼 클릭 시 이동
  const handleRecommendClick = () => {
    navigate("/codirecommendmain"); // 실제 이동할 경로 수정
  };

  return (
   
      <div className="ai-recommendation">
        <img
          src="../img/maincodirecommend.png"
          alt="AI 코디 추천"
          className="recommendation-img"
        />
        <div className="recommend-overlay">
          <button className="recommend-text" onClick={handleRecommendClick}>
            코디 추천
          </button>
        </div>
      </div>
    
  );
};

export default MainCodirecommend;
