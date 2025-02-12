import React from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 추가
import Slider from "./Slider";
import EventSection from "./EventSection";
import "../css/styles.css";
import Calendar from "./Calender";
import MainCodirecommend from "./MainCodirecommend"; // ✅ 경로 수정

// 코디 추천 컴포넌트 추가

const Main = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 훅

  return (
    <div className="app-container">
      {/* 왼쪽 섹션 - Daily Look 슬라이더 */}
      <div className="left-side">
        <h1 className="daily-look-title">Daily Look</h1>
        <div className="slider-container">
          <Slider />
        </div>
      </div>
      {/* 오른쪽 섹션 - 다가올 일정 */}
      <div className="right-side">
        {/* EventSection과 Calander 컴포넌트 */}
        <div className="event-and-calendar">
          <MainCodirecommend />
          <EventSection />
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default Main;
