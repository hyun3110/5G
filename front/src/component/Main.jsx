import React from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 추가
import Slider from "./Slider";
import EventSection from "./EventSection";
import "../css/styles.css";
import Calendar from "./Calender";

const Main = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 훅

  // 코디 추천 버튼 클릭 시 이동할 경로 설정
  const handleRecommendClick = () => {
    navigate("/codirecommendmain"); // 이동할 페이지 경로 (예: '/recommendation')
  };

  return (
    <div className="app-container">
      {/* 왼쪽 섹션 - Daily Look 슬라이더 */}
      <div className="left-side">
        <h1 className="daily-look-title">Daily Look</h1>
        <div className="slider-container">
          <Slider />
        </div>
      </div>

      {/* 중앙 섹션 - AI 코디 추천 */}
      <div className="center-section">
        <div className="ai-recommendation">
          {/* AI 추천 이미지 */}
          <img src="여기에 AI 추천 관련 이미지를 삽입" alt="AI 코디 추천" className="recommendation-img" />
          
          {/* 코디 추천 버튼 오버레이 */}
          <div className="recommend-overlay">
            <button className="recommend-text">코디 추천</button>
          </div>
        </div>
      </div>

      {/* 오른쪽 섹션 - 다가올 일정 */}
      <div className="right-side">
        <div className="event-and-calendar">
          <EventSection />
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default Main;
