import React from "react";
import '../css/styles.css';
const EventSection = () => {
  return (
    <section className="event-section">
      <div className="event-header">Schedule</div>
      <div className="event-item">
        <div className="event-time">8:30</div>
        <div className="event-content">
          <div className="event-title">오늘 일정 적는 곳</div>
          <div className="event-location">Free Agency</div>
        </div>
      </div>
      <div className="event-item">
        <div className="event-time">9:00</div>
        <div className="event-content">
          <div className="event-title">추가 이벤트 이름</div>
          <div className="event-location">장소 이름</div>
        </div>
      </div>
      
      
    </section>
  );
};

export default EventSection;
