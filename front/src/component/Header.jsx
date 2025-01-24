import React from "react";
import '../css/styles.css';
import Calendar from "./Calender";
const Header = () => {
  return (
    <header>
      <div className="nav">
        <a href="#">Calendar</a>
        <a href="#">My Profile</a>
        <span>광주 동구</span>
      </div>
      <div className="weather">날씨: 흐림 온도: -2°C 체감 온도: -5°C</div>
    </header>
  );
};

export default Header;
