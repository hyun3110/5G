import React, { useState, useEffect } from 'react';
import '../css/styles.css';
import axios from 'axios'; // axios를 추가하여 서버 요청을 처리합니다.

const EventSection = ({ events, setEvents }) => {
  // 첫 렌더링 시 로컬스토리지에서 이벤트 불러오기
  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));  // 로컬스토리지에서 이벤트를 불러와 상태에 설정
    }
  }, []);  // 빈 배열을 사용하여 컴포넌트가 처음 렌더링될 때만 실행

  // 상태가 변경될 때마다 localStorage에 반영
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("events", JSON.stringify(events));  // events 상태를 localStorage에 저장
    }
  }, [events]);  // events 상태가 변경될 때마다 실행

  // D-DAY 계산 함수: 시작 날짜와 현재 날짜를 비교해 D-DAY를 계산합니다.
  const calculateDDay = (startDate) => {
    const today = new Date(); // 현재 날짜
    const start = new Date(startDate); // 시작 날짜
    const diff = Math.ceil((start - today) / (1000 * 60 * 60 * 24)); // 날짜 차이 계산
    return diff === 0 ? "D-DAY" : `D-${diff}`; // D-DAY 형식 반환
  };

  // D-DAY 기준으로 일정 정렬 후 최대 3개만 반환하는 함수
  const getSortedEvents = () => {
    const today = new Date();
    return [...events]
      .filter((event) => new Date(event.start) >= today) // 오늘 이후의 일정만 필터링
      .sort((a, b) => new Date(a.start) - new Date(b.start)) // 시작 날짜를 기준으로 정렬
      .slice(0, 3) // 최대 3개 일정만 반환
      .map((event) => ({
        ...event,
        dday: calculateDDay(event.start), // D-DAY 계산 결과 추가
      }));
  };

  return (
    <section className="event-section">
      <div className="event-header">Upcoming Events</div>
      {/* 정렬된 이벤트를 화면에 표시 */}
      {getSortedEvents().map((event) => (
        <div className="event-item" key={event.id}>
          <div className="event-dday">{event.dday}</div> {/* D-DAY 표시 */}
          <div className="event-details">
            <div className="event-title">{event.title}</div> {/* 일정 제목 */}
            <div className="event-description">{event.description || ""}</div> {/* 일정 내용 */}
          </div>
          {event.extendedProps?.cordiimg && (
            <div className="event-cordiimg">
              <img src={event.extendedProps.cordiimg} alt="Cordi" /> {/* 코디 이미지 */}
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default EventSection;
