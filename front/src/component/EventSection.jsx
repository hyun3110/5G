import React, { useState, useEffect } from "react";
import { useEvents } from "../context/eventsContext";
import "../css/styles.css";

const EventSection = () => {
  const { events, setEvents } = useEvents();
  const [showAll, setShowAll] = useState(false); // 전체 보기 상태
  const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 이벤트 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  // 첫 렌더링 시 로컬스토리지에서 이벤트 불러오기
  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        if (Array.isArray(parsedEvents)) {
          setEvents(parsedEvents);
        }
      } catch (error) {
        console.error("로컬스토리지에서 이벤트 파싱 실패:", error);
      }
    }
  }, [setEvents]);

  // 상태가 변경될 때마다 localStorage에 반영
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // D-DAY 계산 함수
  const calculateDDay = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const diff = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
    return diff === 0 ? "D-DAY" : `D-${diff}`;
  };

  // D-Day 기준으로 카테고리별로 일정 분류
  const getGroupedEvents = () => {
    const groupedEvents = { "D-DAY": [], "D-1": [], "D-2": [] };
    events.forEach((event) => {
      const dday = calculateDDay(event.start);
      if (groupedEvents[dday]) groupedEvents[dday].push(event);
    });
    return groupedEvents;
  };

  const groupedEvents = getGroupedEvents();

  // 이벤트 클릭 시 모달 열기
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  return (
    
<section className="event-section">
  <div className="event-header">다가올 일정</div>
  <div className="event-categories">
    {Object.keys(groupedEvents).map((category) => (
      <div key={category} className="event-category">
        <div className="category-title">{category}</div>
        <div className="category-divider" />
        <div className="category-events">
          {/* 조건부 렌더링: 해당 카테고리에 이벤트가 없으면 메시지 표시 */}
          {groupedEvents[category].length === 0 ? (
            <div className="text-box">
            <span className="no-events-message">등록된 일정이 없습니다.</span>
          </div>
        ) : (
          groupedEvents[category].map((event) => (
            <div
                className="event-item"
                key={event.id}
                onClick={() => handleEventClick(event)} // 클릭 시 모달 열기
              >
                <div className="event-title">{event.title}</div>
                <div className="event-description">
                  {event.description || "No description available."}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    ))}
  </div>
  <button
    className="show-more-button"
    onClick={() => setShowAll((prev) => !prev)}
  >
    {showAll ? "간략히 보기" : "더 보기"} {/* 버튼 텍스트 변경 */}
  </button>


      {/* 모달 */}
      {isModalOpen && selectedEvent && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedEvent.title}</h2>
            <p>{selectedEvent.description || "No description available."}</p>
            <p>
              <strong>시작일:</strong> {selectedEvent.start}
            </p>
            <p>
              <strong>종료일:</strong> {selectedEvent.end || "No end date"}
            </p>
            <button className="close-modal-button" onClick={closeModal}>
              닫기
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventSection;
