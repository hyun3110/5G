import React from "react";
import Slider from "./Slider";
import EventSection from "./EventSection";
import "../css/styles.css";
import Calendar from "./Calender";

const Main = () => {
  return (
    <div className="app-container">
      <div className="left-side">
        <div className="slider-container">
          <h1 className="daily-look-title">Daily Look</h1>
          <Slider />
        </div>
      </div>
      <div className="right-side">
        {/* EventSection과 Calander 컴포넌트 */}
        <div className="event-and-calendar">
          <EventSection />
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default Main;
