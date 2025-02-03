import React, { useState, useEffect } from "react";
import Header from "./Header";
import Slider from "./Slider";
import EventSection from "./EventSection";
import Calander from "./Calander";
import "../css/styles.css";
import axios from "axios";

const Main = ({ user }) => {
  const [events, setEvents] = useState([]); // 일정 정보

  useEffect(() => {
    // 로컬 스토리지에서 일정 데이터 불러오기
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        if (Array.isArray(parsedEvents)) {
          setEvents(parsedEvents); // 로컬스토리지에서 데이터를 로드
        }
      } catch (error) {
        console.error("로컬 스토리지 파싱 오류:", error);
      }
    }

    // 서버에서 일정 데이터 가져오기
    if (user) {
      axios
        .get(`/api/schedules/${user.id}`, { withCredentials: true })
        .then((response) => {
          if (Array.isArray(response.data)) {
            const calendarEvents = response.data.map((event) => {
              let endDate = new Date(event.endDate);
              const startDate = new Date(event.startDate);

              // 종료일에 하루를 추가
              if (startDate.getTime() !== endDate.getTime()) {
                endDate.setDate(endDate.getDate() + 1);
              }

              return {
                id: event.scheIdx,
                title: event.scheTitle,
                type: event.scheType,
                start: event.startDate,
                end: endDate.toISOString().split("T")[0],
                originalEndDate: event.endDate,
                color: event.color || "#ADD8E6",
                description: event.scheContent || "",
              };
            });

            // 기존 상태와 병합하여 중복 제거
            setEvents((prevEvents) => {
              const mergedEvents = [
                ...prevEvents.filter(
                  (prevEvent) =>
                    !calendarEvents.some((newEvent) => newEvent.id === prevEvent.id)
                ),
                ...calendarEvents,
              ];
              localStorage.setItem("events", JSON.stringify(mergedEvents)); // 로컬스토리지 업데이트
              return mergedEvents;
            });
          }
        })
        .catch((error) => {
          console.error("일정 정보를 가져오는 데 실패했습니다:", error);
        });
    }
  }, [user]); // user 상태 변경 시 실행

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
          <EventSection user={user} events={events} setEvents={setEvents} />
          <Calander user={user} events={events} setEvents={setEvents} />
        </div>
      </div>
    </div>
  );
};

export default Main;
